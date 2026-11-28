// Ranked en todos los cursos (supabase/pending/20261226120000_ranked_all_courses.sql), probado en PGlite
// sobre una base como la de producción: todas las migraciones + las publicaciones de supabase/pending/
// (en A2 U13–U17, B1, B2, pt, it, zh, fr + enable_fr, es), en el orden en que se aplicaron.
//
// Cubre: migración (flags, rating inicial de quien ya estaba, idempotencia, nada existente cambia),
// espejo con shared/languages.ts, cambio de curso con rating por curso, partida por cada curso con
// victoria y derrota, historial y estadísticas por idioma, abandono, resultado duplicado, rating
// desactualizado, permisos (el cliente no escribe ELO) y rollback.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { LANGUAGES } from '../../shared/languages.ts';
import { COURSES } from '../../shared/courses.ts';
import { computeRatingChange, isPlaced } from '../../shared/ranking.ts';

const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');
const MIGRATION = '20261226120000_ranked_all_courses.sql';
const PUBLISHED = [
  '20261121120000_publish_en_a2_u13_u17.sql',
  '20261123120000_publish_en_b1.sql',
  '20261125120000_publish_en_b2.sql',
  '20261127120000_publish_pt_a1_a2.sql',
  '20261129120000_publish_it_a1_a2.sql',
  '20261201120000_publish_zh_a1_a2.sql',
  '20261203120000_publish_fr_a1_a2.sql',
  '20261203130000_enable_fr.sql',
  '20261205120000_publish_es_a1_a2.sql',
];
/**
 * Publicados en producción después de esta migración (2026-11-27): inglés para hablantes de
 * portugués, italiano y francés, que shared/courses.ts ya da por abiertos.
 */
const PUBLISHED_AFTER = [
  '20270111120000_publish_en_from_pt.sql',
  '20270111120100_publish_en_from_it.sql',
  '20270111120200_publish_en_from_fr.sql',
];
const rollbackSql = readFileSync(
  new URL(`../rollback/20261226120000_ranked_all_courses.down.sql`, import.meta.url),
  'utf8',
);

/** Base como producción antes de la migración. */
async function productionLike() {
  const db = await createDb();
  for (const file of PUBLISHED) await db.exec(pending(file));
  return db;
}

let n = 0;
/** Usuario con el onboarding hecho (v1, como las builds de tienda) en `language`. */
async function onboard(db, language = 'en') {
  n += 1;
  const u = await createUser(db, `rac${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, 'A1', 10::smallint)`, [
      `rac_user_${n}`,
      language,
    ]),
  );
  return u;
}

const rows = async (db, sql, params = []) => (await db.query(sql, params)).rows;
const one = async (db, sql, params = []) => (await rows(db, sql, params))[0];
const rpc = (db, u, sql, params = []) => as(db, 'authenticated', u, () => db.query(sql, params));
const server = (db, sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);

const ratingOf = (db, u, language) =>
  one(db, 'select * from public.player_ratings where user_id = $1 and language_code = $2', [
    u,
    language,
  ]);
const ratingsOf = async (db, u) =>
  Object.fromEntries(
    (
      await rows(
        db,
        `select language_code, rating, games_played, wins, losses from public.player_ratings
         where user_id = $1 order by language_code`,
        [u],
      )
    ).map((r) => [r.language_code, r]),
  );

/** Como server/src: start_battle + settle_battle con el ELO de shared/ranking.ts. */
async function playRanked(
  db,
  language,
  winner,
  loser,
  { status = 'completed', forfeit = false } = {},
) {
  const id = randomUUID();
  await server(db, `select public.start_battle($1, $2, $3, $4, 2::smallint)`, [
    id,
    language,
    winner,
    loser,
  ]);
  const ctx = await server(
    db,
    'select * from public.battle_settlement_context_v2($1, 24) order by slot',
    [id],
  );
  const [w, l] = ctx;
  const cw = computeRatingChange({
    rating: w.rating,
    opponentRating: l.rating,
    outcome: 'win',
    placed: isPlaced({ wins: w.wins }),
  });
  const cl = computeRatingChange({
    rating: l.rating,
    opponentRating: w.rating,
    outcome: 'loss',
    placed: isPlaced({ wins: l.wins }),
  });
  const players = [
    {
      slot: 1,
      score: 900,
      correct: 9,
      answered: 10,
      result: 'win',
      forfeited: false,
      rating_before: w.rating,
      games_played_before: w.games_played,
      rating_after: cw.after,
    },
    {
      slot: 2,
      score: 200,
      correct: 2,
      answered: forfeit ? 3 : 10,
      result: 'loss',
      forfeited: forfeit,
      rating_before: l.rating,
      games_played_before: l.games_played,
      rating_after: cl.after,
    },
  ];
  const settle = () =>
    server(db, `select public.settle_battle($1, $2, $3::jsonb) as r`, [
      id,
      status,
      JSON.stringify(players),
    ]);
  const [{ r }] = await settle();
  return { id, r, cw, cl, settle, players };
}

describe('migración sobre una base como producción', () => {
  let db;
  let frUser;
  let esUser;
  let enUser;
  let before_;

  before(async () => {
    db = await productionLike();
    // Antes: en fr por el onboarding; en es por una inscripción (el español estaba «soon»).
    frUser = await onboard(db, 'fr');
    esUser = await onboard(db, 'en');
    await db.query(
      `insert into public.user_courses (user_id, course_code) values ($1, 'es-from-en')`,
      [esUser],
    );
    enUser = await onboard(db, 'en');
    await db.query(
      `update public.player_ratings set rating = 777, peak_rating = 800, games_played = 9, wins = 6, losses = 3
       where user_id = $1 and language_code = 'en'`,
      [enUser],
    );
    before_ = {
      languages: await rows(db, 'select * from public.languages order by code'),
      ratings: await rows(
        db,
        'select * from public.player_ratings order by user_id, language_code',
      ),
      history: await rows(db, 'select * from public.rating_history order by id'),
    };
    assert.equal(await ratingOf(db, frUser, 'fr'), undefined, 'antes, fr no tenía Ranked');
    await db.exec(pending(MIGRATION));
  });

  test('fr y es con Ranked; es disponible; el resto sin cambios', async () => {
    const after = await rows(db, 'select * from public.languages order by code');
    for (const lang of after) {
      const prev = before_.languages.find((l) => l.code === lang.code);
      if (lang.code === 'fr') assert.deepEqual(lang, { ...prev, ranked_available: true });
      else if (lang.code === 'es')
        assert.deepEqual(lang, { ...prev, ranked_available: true, content_status: 'available' });
      else assert.deepEqual(lang, prev);
    }
  });

  test('espejo: languages coincide con shared/languages.ts en estado y Ranked', async () => {
    const db_ = Object.fromEntries(
      (await rows(db, 'select code, content_status, ranked_available from public.languages')).map(
        (l) => [l.code, l],
      ),
    );
    for (const l of LANGUAGES) {
      assert.equal(db_[l.code].content_status, l.status, `${l.code} status`);
      assert.equal(db_[l.code].ranked_available, l.ranked, `${l.code} ranked`);
    }
  });

  test('rating inicial (100, sin posicionar) para quien ya estaba en fr o es; nada existente cambia', async () => {
    assert.equal((await ratingOf(db, frUser, 'fr')).rating, 100);
    assert.equal((await ratingOf(db, esUser, 'es')).rating, 100);
    const initial = await rows(
      db,
      `select user_id, language_code, rating_before, rating_after from public.rating_history
       where reason = 'initial' and language_code in ('fr', 'es') order by language_code`,
    );
    assert.deepEqual(
      initial.map((h) => [h.user_id, h.language_code, h.rating_before, h.rating_after]),
      [
        [esUser, 'es', 100, 100],
        [frUser, 'fr', 100, 100],
      ],
    );
    // Todas las filas previas siguen idénticas.
    const ratings = await rows(
      db,
      'select * from public.player_ratings order by user_id, language_code',
    );
    for (const prev of before_.ratings) {
      assert.deepEqual(
        ratings.find((r) => r.user_id === prev.user_id && r.language_code === prev.language_code),
        prev,
      );
    }
    const history = await rows(db, 'select * from public.rating_history order by id');
    assert.deepEqual(history.slice(0, before_.history.length), before_.history);
    assert.equal(history.length, before_.history.length + 2);
    assert.equal((await ratingOf(db, enUser, 'en')).rating, 777);
  });

  test('idempotente: reaplicarla no cambia nada', async () => {
    const snap = async () => ({
      languages: await rows(db, 'select * from public.languages order by code'),
      ratings: await rows(
        db,
        'select * from public.player_ratings order by user_id, language_code',
      ),
      history: await rows(db, 'select count(*)::int as c from public.rating_history'),
    });
    const a = await snap();
    await db.exec(pending(MIGRATION));
    assert.deepEqual(await snap(), a);
  });
});

describe('sin contenido publicado, la migración no se aplica', () => {
  test('aborta si fr o es no tienen A1 y A2 publicados', async () => {
    const db = await createDb(); // sin supabase/pending: fr y es cargados pero sin publicar
    await assert.rejects(db.exec(pending(MIGRATION)), /sin unidades publicadas/);
    const { c } = await one(
      db,
      `select count(*)::int as c from public.languages where code in ('fr', 'es') and ranked_available`,
    );
    assert.equal(c, 0);
  });
});

describe('Ranked por curso, después de la migración', () => {
  let db;
  before(async () => {
    db = await productionLike();
    await db.exec(pending(MIGRATION));
    for (const file of PUBLISHED_AFTER) await db.exec(pending(file));
  });

  test('cada curso se puede activar y crea su propio rating (los otros no cambian)', async () => {
    const u = await onboard(db, 'en');
    const base = await ratingsOf(db, u);
    assert.deepEqual(Object.keys(base), ['en']);
    for (const course of COURSES) {
      await rpc(db, u, `select public.set_active_course($1)`, [course.code]);
      const { target_language, active_course_code } = await one(
        db,
        'select target_language, active_course_code from public.profiles where id = $1',
        [u],
      );
      assert.equal(active_course_code, course.code);
      assert.equal(target_language, course.target);
    }
    const all = await ratingsOf(db, u);
    assert.deepEqual(Object.keys(all).sort(), ['en', 'es', 'fr', 'it', 'pt', 'zh']);
    for (const r of Object.values(all)) assert.equal(r.games_played, 0);
    // Volver a activar un curso no crea otro rating ni otra fila de historial.
    const h = await one(
      db,
      'select count(*)::int as c from public.rating_history where user_id = $1',
      [u],
    );
    await rpc(db, u, `select public.set_active_course('fr-from-es')`);
    const h2 = await one(
      db,
      'select count(*)::int as c from public.rating_history where user_id = $1',
      [u],
    );
    assert.equal(h2.c, h.c);
  });

  for (const course of COURSES) {
    const language = course.target;
    test(`${course.code}: victoria y derrota, historial y estadísticas sólo en ${language}`, async () => {
      const a = await onboard(db, 'en');
      const b = await onboard(db, 'en');
      for (const u of [a, b])
        await rpc(db, u, `select public.set_active_course($1)`, [course.code]);
      // Un ELO en inglés que no se tiene que mover.
      await db.query(
        `update public.player_ratings set rating = 640, peak_rating = 640 where user_id = any($1) and language_code = 'en'`,
        [[a, b]],
      );
      const othersBefore = { a: await ratingsOf(db, a), b: await ratingsOf(db, b) };

      const { id, r, cw, cl } = await playRanked(db, language, a, b);
      assert.equal(r.duplicate, false);
      const battle = await one(
        db,
        'select language_code, status, is_ranked from public.battles where id = $1',
        [id],
      );
      assert.deepEqual(battle, { language_code: language, status: 'completed', is_ranked: true });

      const ra = await ratingOf(db, a, language);
      const rb = await ratingOf(db, b, language);
      assert.equal(ra.rating, cw.after);
      assert.equal(rb.rating, cl.after);
      assert.ok(ra.rating > 100, 'el ganador sube');
      assert.deepEqual([ra.games_played, ra.wins, ra.losses, ra.win_streak], [1, 1, 0, 1]);
      assert.deepEqual([rb.games_played, rb.wins, rb.losses, rb.win_streak], [1, 0, 1, 0]);

      const hist = await rows(
        db,
        `select user_id, language_code, rating_before, rating_after from public.rating_history
         where battle_id = $1 order by user_id`,
        [id],
      );
      assert.equal(hist.length, 2);
      for (const h of hist) assert.equal(h.language_code, language);

      // Los demás idiomas, intactos.
      for (const [u, key] of [
        [a, 'a'],
        [b, 'b'],
      ]) {
        const now = await ratingsOf(db, u);
        for (const [code, prev] of Object.entries(othersBefore[key])) {
          if (code !== language) assert.deepEqual(now[code], prev, `${code} de ${key}`);
        }
      }
      assert.equal((await ratingOf(db, a, 'en')).rating, language === 'en' ? cw.after : 640);
    });
  }

  test('resultado duplicado: la segunda liquidación no cambia nada', async () => {
    const a = await onboard(db, 'en');
    const b = await onboard(db, 'en');
    for (const u of [a, b]) await rpc(db, u, `select public.set_active_course('es-from-en')`);
    const game = await playRanked(db, 'es', a, b);
    const snap = { a: await ratingOf(db, a, 'es'), b: await ratingOf(db, b, 'es') };
    const [{ r }] = await game.settle();
    assert.equal(r.duplicate, true);
    assert.deepEqual({ a: await ratingOf(db, a, 'es'), b: await ratingOf(db, b, 'es') }, snap);
    const { c } = await one(
      db,
      'select count(*)::int as c from public.rating_history where battle_id = $1',
      [game.id],
    );
    assert.equal(c, 2);
  });

  test('abandono (desconexión): queda como forfeited y el que abandona pierde', async () => {
    const a = await onboard(db, 'en');
    const b = await onboard(db, 'en');
    for (const u of [a, b]) await rpc(db, u, `select public.set_active_course('zh-from-es')`);
    const { id, cl } = await playRanked(db, 'zh', a, b, { status: 'forfeited', forfeit: true });
    const battle = await one(db, 'select status from public.battles where id = $1', [id]);
    assert.equal(battle.status, 'forfeited');
    const bp = await one(
      db,
      'select forfeited, result, rating_after from public.battle_players where battle_id = $1 and slot = 2',
      [id],
    );
    assert.deepEqual(bp, { forfeited: true, result: 'loss', rating_after: cl.after });
  });

  test('rating desactualizado (otra partida en el medio): se rechaza sin escribir', async () => {
    const a = await onboard(db, 'en');
    const b = await onboard(db, 'en');
    for (const u of [a, b]) await rpc(db, u, `select public.set_active_course('it-from-es')`);
    const id = randomUUID();
    await server(db, `select public.start_battle($1, 'it', $2, $3, 2::smallint)`, [id, a, b]);
    const players = [
      {
        slot: 1,
        score: 1,
        correct: 1,
        answered: 1,
        result: 'win',
        forfeited: false,
        rating_before: 999,
        games_played_before: 0,
        rating_after: 1010,
      },
      {
        slot: 2,
        score: 0,
        correct: 0,
        answered: 1,
        result: 'loss',
        forfeited: false,
        rating_before: 100,
        games_played_before: 0,
        rating_after: 100,
      },
    ];
    await assert.rejects(
      server(db, `select public.settle_battle($1, 'completed', $2::jsonb)`, [
        id,
        JSON.stringify(players),
      ]),
      /stale_rating/,
    );
    assert.equal((await ratingOf(db, a, 'it')).rating, 100);
    assert.equal(
      (await one(db, 'select status from public.battles where id = $1', [id])).status,
      'in_progress',
    );
  });

  test('permisos: el cliente no puede escribir su ELO ni liquidar partidas', async () => {
    const u = await onboard(db, 'en');
    await rpc(db, u, `select public.set_active_course('pt-from-es')`);
    await rpc(db, u, `update public.player_ratings set rating = 3000 where user_id = $1`, [
      u,
    ]).catch(() => {});
    assert.equal((await ratingOf(db, u, 'pt')).rating, 100);
    await rpc(
      db,
      u,
      `insert into public.rating_history (user_id, language_code, reason, rating_before, rating_after)
                      values ($1, 'pt', 'adjustment', 100, 3000)`,
      [u],
    ).catch(() => {});
    const { c } = await one(
      db,
      `select count(*)::int as c from public.rating_history where user_id = $1 and reason = 'adjustment'`,
      [u],
    );
    assert.equal(c, 0);
    await assert.rejects(
      rpc(db, u, `select public.settle_battle($1, 'completed', '[]'::jsonb)`, [randomUUID()]),
      /permission denied/,
    );
    await assert.rejects(
      rpc(db, u, `select public.start_battle($1, 'pt', $2, $2, 2::smallint)`, [randomUUID(), u]),
      /permission denied/,
    );
  });

  test('clasificación por idioma: cada curso tiene su propia tabla', async () => {
    const leaders = await rows(
      db,
      `select language_code, count(*)::int as c from public.player_ratings group by 1 order by 1`,
    );
    assert.deepEqual(
      leaders.map((l) => l.language_code),
      ['en', 'es', 'fr', 'it', 'pt', 'zh'],
    );
  });

  test('test de nivel en cada curso: A2 se guarda por curso y no pisa un curso ya empezado', async () => {
    const u = await onboard(db, 'en');
    const start = async (code, level) =>
      (
        await rpc(
          db,
          u,
          `select public.start_course($1, $2, $3, 9::smallint, 12::smallint, 'placement-v1') as r`,
          [code, level, level],
        )
      ).rows[0].r;
    for (const course of COURSES) {
      if (course.code === 'en-from-es') continue; // el curso del registro: ya empezado
      const r = await start(course.code, 'A2');
      assert.equal(r.created, true, course.code);
      assert.equal(r.start_level, 'A2', course.code);
    }
    // Repetir el test no cambia lo guardado (ni siquiera con otro resultado).
    const again = await start('zh-from-es', 'A1');
    assert.equal(again.created, false);
    assert.equal(again.start_level, 'A2');
    const enrolled = await rows(
      db,
      `select course_code, start_level, placement_level from public.user_courses
       where user_id = $1 order by course_code`,
      [u],
    );
    assert.deepEqual(
      enrolled.map((e) => [e.course_code, e.start_level, e.placement_level]),
      [
        ['en-from-es', 'A1', null],
        ['en-from-fr', 'A2', 'A2'],
        ['en-from-it', 'A2', 'A2'],
        ['en-from-pt', 'A2', 'A2'],
        ['es-from-en', 'A2', 'A2'],
        ['fr-from-es', 'A2', 'A2'],
        ['it-from-es', 'A2', 'A2'],
        ['pt-from-es', 'A2', 'A2'],
        ['zh-from-es', 'A2', 'A2'],
      ],
    );
    // Nada más alto que lo publicado: ninguno de los cinco tiene B1.
    await assert.rejects(
      rpc(db, u, `select public.start_course('it-from-es', 'B1', null, null, null, null)`),
      /unavailable/,
    );
  });
});

describe('rollback', () => {
  test('apaga fr y es sin borrar ratings; se niega si hay perfiles en español', async () => {
    const db = await productionLike();
    await db.exec(pending(MIGRATION));
    const u = await onboard(db, 'en');
    await rpc(db, u, `select public.set_active_course('es-from-en')`);
    await assert.rejects(db.exec(rollbackSql), /perfiles con español/);
    await db.exec('rollback').catch(() => {});

    await rpc(db, u, `select public.set_active_course('en-from-es')`);
    const ratings = await rows(
      db,
      'select * from public.player_ratings order by user_id, language_code',
    );
    await db.exec(rollbackSql);
    const langs = await rows(
      db,
      `select code, content_status, ranked_available from public.languages where code in ('fr', 'es') order by code`,
    );
    assert.deepEqual(langs, [
      { code: 'es', content_status: 'soon', ranked_available: false },
      { code: 'fr', content_status: 'available', ranked_available: false },
    ]);
    assert.deepEqual(
      await rows(db, 'select * from public.player_ratings order by user_id, language_code'),
      ratings,
    );
    // Se puede volver a aplicar.
    await db.exec(pending(MIGRATION));
    const { c } = await one(
      db,
      `select count(*)::int as c from public.languages where code in ('fr', 'es') and ranked_available`,
    );
    assert.equal(c, 2);
  });
});
