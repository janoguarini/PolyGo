import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { computeRatingChange } from '../../shared/ranking.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

async function player(email, rating = 1000) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0]],
  );
  await db.query(
    `update public.player_ratings set rating = $2, peak_rating = greatest(peak_rating, $2) where user_id = $1`,
    [id, rating],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);

const join = (u) => rpc(u, 'select public.join_human_queue() as r');
const leave = (u) => rpc(u, 'select public.leave_human_queue() as r');
const match = (u, id) => rpc(u, 'select public.get_human_match($1) as r', [id]);
const result = (u, id) => rpc(u, 'select public.human_match_result($1) as r', [id]);
const finish = (u, id, score, correct, answered, forfeit = false) =>
  rpc(u, 'select public.finish_human_match($1, $2, $3, $4, $5) as r', [
    id,
    score,
    correct,
    answered,
    forfeit,
  ]);

/** Lleva la partida al pasado: `seconds` desde el inicio. */
const elapse = (id, seconds) =>
  db.query(
    `update public.battles set started_at = now() - make_interval(secs => $2) where id = $1`,
    [id, seconds],
  );

/** Empareja a dos jugadores y devuelve el id de la partida. */
async function pair(a, b) {
  assert.equal((await join(a)).status, 'waiting');
  const m = await join(b);
  assert.equal(m.status, 'matched');
  const again = await join(a);
  assert.deepEqual(again, { status: 'matched', battle_id: m.battle_id });
  return m.battle_id;
}

test('las preguntas son válidas: 4 opciones, una sola correcta y sin palabra repetida seguida', async () => {
  const { q } = await one(`select public.rush_questions('en', 40) as q`);
  assert.equal(q.length, 40);
  const words = new Map(
    (
      await db.query(`select id, text, translation_es from public.words where language_code = 'en'`)
    ).rows.map((w) => [w.id, w]),
  );
  const norm = (s) => s.trim().toLowerCase();
  q.forEach((question, i) => {
    assert.equal(question.index, i);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(norm)).size, 4, 'opciones distintas');
    const word = words.get(question.wordId);
    const correct = question.direction === 'en_es' ? word.translation_es : word.text;
    assert.equal(question.options[question.correctOption], correct);
    assert.equal(question.prompt, question.direction === 'en_es' ? word.text : word.translation_es);
    // Ninguna otra opción es también válida.
    for (const [j, option] of question.options.entries()) {
      if (j === question.correctOption) continue;
      const same = [...words.values()].filter(
        (w) => norm(question.direction === 'en_es' ? w.translation_es : w.text) === norm(option),
      );
      assert.ok(
        same.every(
          (w) =>
            norm(w.text) !== norm(word.text) &&
            norm(w.translation_es) !== norm(word.translation_es),
        ),
      );
    }
    if (i > 0) assert.notEqual(question.wordId, q[i - 1].wordId);
  });
});

test('emparejamiento: dos jugadores cercanos quedan en la misma partida con las mismas preguntas', async () => {
  const ana = await player('ana@h.dev');
  const beto = await player('beto@h.dev', 1040);
  const id = await pair(ana, beto);

  const a = await match(ana, id);
  const b = await match(beto, id);
  assert.equal(a.your_slot + b.your_slot, 3);
  assert.deepEqual(a.questions, b.questions);
  assert.equal(a.questions.length, 40);
  assert.equal(a.players.length, 2);
  assert.ok(
    a.starts_at - a.server_now > 3_000 && a.starts_at - a.server_now <= 5_000,
    'empieza en ~5 s',
  );
  assert.equal(a.ends_at - a.starts_at, 75_000);

  const intruso = await player('intruso@h.dev');
  await assert.rejects(match(intruso, id), /battle_not_found/);
});

test('la ventana de ELO se amplía con la espera y no empareja a quien dejó de buscar', async () => {
  const lo = await player('lowr@h.dev', 1000);
  const hi = await player('high@h.dev', 1350);
  assert.equal((await join(lo)).status, 'waiting');
  assert.equal((await join(hi)).status, 'waiting', '350 de diferencia: todavía no');
  // Llevan 30 s esperando: ventana de 400.
  await db.query(
    `update public.ranked_queue set joined_at = now() - interval '30 seconds' where user_id in ($1, $2)`,
    [lo, hi],
  );
  // Uno dejó de consultar hace rato: no se lo empareja.
  await db.query(
    `update public.ranked_queue set seen_at = now() - interval '10 seconds' where user_id = $1`,
    [lo],
  );
  assert.equal((await join(hi)).status, 'waiting');
  const m = await join(lo);
  assert.equal(m.status, 'matched');
});

test('salir de la cola: sin partida no devuelve nada; si justo lo emparejaron, devuelve la partida', async () => {
  const caro = await player('caro@h.dev');
  const dani = await player('dani@h.dev');
  await join(caro);
  assert.deepEqual(await leave(caro), { battle_id: null });
  assert.equal((await join(dani)).status, 'waiting', 'caro ya no está en la cola');

  // Dani sale; Caro vuelve a buscar y Dani entra y la empareja: Caro todavía no consultó.
  await leave(dani);
  assert.equal((await join(caro)).status, 'waiting');
  const m = await join(dani);
  assert.equal(m.status, 'matched');
  assert.deepEqual(await leave(caro), { battle_id: m.battle_id });
});

test('liquidación: espera los dos puntajes y aplica el ELO de shared/ranking.ts a ambos', async () => {
  const eva = await player('eva@h.dev');
  const fran = await player('fran@h.dev', 1020);
  const id = await pair(eva, fran);
  const slotOf = async (u) => (await match(u, id)).your_slot;
  const evaSlot = await slotOf(eva);

  await assert.rejects(finish(eva, id, 500, 4, 5), /too_early/);
  await elapse(id, 80);
  await assert.rejects(finish(eva, id, 9000, 4, 5), /invalid_result/);

  assert.deepEqual(await finish(eva, id, 500, 4, 5), { pending: true });
  assert.deepEqual(await result(fran, id), { pending: true });
  const r = await finish(fran, id, 300, 3, 6);
  assert.equal(r.pending, false);
  assert.equal(r.status, 'completed');

  const line = (slot) => r.players.find((p) => p.slot === slot);
  const e = line(evaSlot);
  const f = line(3 - evaSlot);
  const expectedE = computeRatingChange({
    rating: 1000,
    opponentRating: 1020,
    outcome: 'win',
    placed: false,
  });
  const expectedF = computeRatingChange({
    rating: 1020,
    opponentRating: 1000,
    outcome: 'loss',
    placed: false,
  });
  // Ninguno había ganado: eva se posiciona; fran sigue sin posicionar y no pierde rating.
  assert.deepEqual([e.result, e.rating_after, e.placed_before], ['win', expectedE.after, false]);
  assert.equal(f.rating_after, 1020);
  assert.deepEqual([f.result, f.rating_after], ['loss', expectedF.after]);
  assert.deepEqual(
    r.achievements[eva].map((x) => x.id),
    // Al posicionarse en ~1016 cuenta el rango máximo (Platino).
    ['first_win', 'peak_silver', 'peak_gold', 'peak_platinum'],
  );
  assert.deepEqual(r.achievements[fran], []);

  // Repetir no reliquida.
  const again = await result(eva, id);
  assert.equal(again.players.find((p) => p.slot === evaSlot).rating_after, expectedE.after);
  const rating = await one('select games_played from public.player_ratings where user_id = $1', [
    eva,
  ]);
  assert.equal(rating.games_played, 1);
});

test('quien no informa a tiempo pierde por abandono; el anti-farming baja el K con el mismo rival', async () => {
  const gus = await player('gus@h.dev');
  const hugo = await player('hugo@h.dev');

  // Partida 1: hugo nunca informa.
  const id1 = await pair(gus, hugo);
  await elapse(id1, 80);
  assert.deepEqual(await finish(gus, id1, 400, 3, 4), { pending: true });
  await elapse(id1, 110);
  const r1 = await result(gus, id1);
  assert.equal(r1.status, 'forfeited');
  const gusSlot = (await match(gus, id1)).your_slot;
  assert.equal(r1.players.find((p) => p.slot === gusSlot).result, 'win');
  assert.deepEqual(
    (({ result, forfeited }) => ({ result, forfeited }))(
      r1.players.find((p) => p.slot !== gusSlot),
    ),
    { result: 'loss', forfeited: true },
  );

  // Partidas 2 y 3 entre los mismos: la tercera en 24 h va con K a la mitad.
  for (const n of [2, 3]) {
    const id = await pair(gus, hugo);
    await elapse(id, 80);
    await finish(hugo, id, 100, 1, 2);
    const before = await one(
      'select rating, games_played from public.player_ratings where user_id = $1',
      [gus],
    );
    const opp = await one('select rating from public.player_ratings where user_id = $1', [hugo]);
    const r = await finish(gus, id, 400, 3, 4);
    const mySlot = (await match(gus, id)).your_slot;
    const mine = r.players.find((p) => p.slot === mySlot);
    const expected = computeRatingChange({
      rating: before.rating,
      opponentRating: opp.rating,
      outcome: 'win',
      matchesAgainstOpponentInWindow: n,
    });
    assert.equal(mine.rating_after, expected.after, `partida ${n}`);
  }
});

test('abandonar a mitad de partida pierde enseguida si el rival ya informó', async () => {
  const ines = await player('ines@h.dev');
  const juan = await player('juan@h.dev');
  const id = await pair(ines, juan);
  await elapse(id, 30);
  assert.deepEqual(
    await finish(ines, id, 0, 0, 0, true),
    { pending: true },
    'abandono antes de tiempo',
  );
  await elapse(id, 80);
  const r = await finish(juan, id, 200, 2, 3);
  assert.equal(r.status, 'forfeited');
  const juanSlot = (await match(juan, id)).your_slot;
  assert.equal(r.players.find((p) => p.slot === juanSlot).result, 'win');
});

test('permisos: anon no entra y las funciones internas no son públicas', async () => {
  const kai = await player('kai@h.dev');
  await as(db, 'anon', null, async () => {
    await assert.rejects(db.query('select public.join_human_queue()'), /permission denied/);
  });
  for (const sql of [
    `select public.rush_questions('en', 1)`,
    `select public.settle_human_match(gen_random_uuid())`,
    'select * from public.ranked_queue',
  ]) {
    await as(db, 'authenticated', kai, async () => {
      await assert.rejects(db.query(sql), /permission denied/);
    });
  }
});
