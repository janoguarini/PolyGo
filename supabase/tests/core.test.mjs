import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createDb, createUser, as } from './harness.mjs';

let db;
let alice;
let bob;

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
  bob = await createUser(db, 'bob@test.dev');
});

const rejects = (promise, pattern) => assert.rejects(promise, pattern);

test('el alta crea perfil, ajustes, rating inicial 1000 e historial', async () => {
  const { rows } = await db.query(
    `select p.public_code, p.username, r.rating, r.peak_rating, h.reason, h.delta, s.profile_visibility
       from public.profiles p
       join public.player_ratings r on r.user_id = p.id
       join public.rating_history h on h.user_id = p.id
       join public.user_settings s on s.user_id = p.id
      where p.id = $1`,
    [alice],
  );
  assert.equal(rows.length, 1);
  assert.match(rows[0].public_code, /^PG-[A-Z0-9]{6}$/);
  assert.equal(rows[0].username, null);
  assert.equal(rows[0].rating, 1000);
  assert.equal(rows[0].reason, 'initial');
  assert.equal(rows[0].delta, 0);
  assert.equal(rows[0].profile_visibility, 'public');
});

test('anon no puede leer perfiles ni ratings', async () => {
  await as(db, 'anon', null, async () => {
    await rejects(db.query('select * from public.profiles'), /permission denied/);
    await rejects(db.query('select * from public.player_ratings'), /permission denied/);
    const { rows } = await db.query('select code from public.languages');
    assert.ok(rows.length > 0, 'los idiomas son públicos');
  });
});

test('complete_onboarding valida y guarda el perfil', async () => {
  await as(db, 'authenticated', alice, async () => {
    const { rows } = await db.query(
      `select * from public.complete_onboarding('  Alice_01 ', 'crown', 'en', 'A1', 15::smallint)`,
    );
    assert.equal(rows[0].username, 'alice_01');
    assert.equal(rows[0].avatar_id, 'crown');
    assert.equal(rows[0].daily_goal_minutes, 15);
    assert.ok(rows[0].onboarding_completed_at);
  });
});

test('username único y con formato válido', async () => {
  await as(db, 'authenticated', bob, async () => {
    const taken = await db.query(`select public.is_username_available('ALICE_01') as ok`);
    assert.equal(taken.rows[0].ok, false);
    const bad = await db.query(`select public.is_username_available('a!') as ok`);
    assert.equal(bad.rows[0].ok, false);
    const free = await db.query(`select public.is_username_available('bob') as ok`);
    assert.equal(free.rows[0].ok, true);

    await rejects(
      db.query(`select public.complete_onboarding('alice_01', 'bolt', 'en', 'A1', 10::smallint)`),
      /username_taken/,
    );
    await rejects(
      db.query(`select public.complete_onboarding('x', 'bolt', 'en', 'A1', 10::smallint)`),
      /check constraint/,
    );
    await rejects(
      db.query(`select public.complete_onboarding('bobby', 'bolt', 'fr', 'A1', 10::smallint)`),
      /language_unavailable/,
    );
  });
});

test('complete_onboarding sin sesión falla', async () => {
  await as(db, 'authenticated', null, async () => {
    await rejects(
      db.query(`select public.complete_onboarding('nobody', 'bolt', 'en', 'A1', 10::smallint)`),
      /not_authenticated/,
    );
  });
});

test('un usuario no puede modificar su rating ni el historial', async () => {
  await as(db, 'authenticated', alice, async () => {
    await rejects(
      db.query(`update public.player_ratings set rating = 3000 where user_id = $1`, [alice]),
      /permission denied/,
    );
    await rejects(
      db.query(
        `insert into public.rating_history (user_id, language_code, reason, rating_before, rating_after)
         values ($1, 'en', 'adjustment', 1000, 3000)`,
        [alice],
      ),
      /permission denied/,
    );
  });
});

test('un usuario no puede cambiar username ni public_code directamente', async () => {
  await as(db, 'authenticated', alice, async () => {
    await rejects(
      db.query(`update public.profiles set username = 'hacker' where id = $1`, [alice]),
      /permission denied/,
    );
    await rejects(
      db.query(`update public.profiles set public_code = 'PG-AAAAAA' where id = $1`, [alice]),
      /permission denied/,
    );
  });
});

test('un usuario sólo edita su propio perfil', async () => {
  await as(db, 'authenticated', alice, async () => {
    const own = await db.query(`update public.profiles set display_name = 'Ali' where id = $1`, [
      alice,
    ]);
    assert.equal(own.affectedRows, 1);
    const other = await db.query(
      `update public.profiles set display_name = 'pwned' where id = $1`,
      [bob],
    );
    assert.equal(other.affectedRows, 0, 'RLS filtra filas ajenas');
  });
});

test('los ajustes son privados', async () => {
  await as(db, 'authenticated', alice, async () => {
    const { rows } = await db.query('select user_id from public.user_settings');
    assert.deepEqual(
      rows.map((r) => r.user_id),
      [alice],
    );
    const other = await db.query(
      `update public.user_settings set show_region = true where user_id = $1`,
      [bob],
    );
    assert.equal(other.affectedRows, 0);
  });
});

test('el historial de rating sólo es visible para su dueño', async () => {
  await as(db, 'authenticated', bob, async () => {
    const { rows } = await db.query('select distinct user_id from public.rating_history');
    assert.deepEqual(
      rows.map((r) => r.user_id),
      [bob],
    );
  });
});

test('una misma partida no puede liquidarse dos veces para un jugador', async () => {
  const battle = '11111111-1111-1111-1111-111111111111';
  const insert = () =>
    db.query(
      `insert into public.rating_history (user_id, language_code, battle_id, reason, rating_before, rating_after)
       values ($1, 'en', $2, 'battle', 1000, 1016)`,
      [alice, battle],
    );
  await insert();
  await rejects(insert(), /duplicate key/);
});

test('el rating no puede bajar del piso', async () => {
  await rejects(
    db.query(
      `update public.player_ratings set rating = 50, peak_rating = 1000 where user_id = $1`,
      [alice],
    ),
    /check constraint/,
  );
});

test('borrar la cuenta elimina en cascada sus datos', async () => {
  const carol = await createUser(db, 'carol@test.dev');
  await db.query('delete from auth.users where id = $1', [carol]);
  const { rows } = await db.query(
    `select (select count(*) from public.profiles where id = $1)::int as p,
            (select count(*) from public.player_ratings where user_id = $1)::int as r`,
    [carol],
  );
  assert.deepEqual(rows[0], { p: 0, r: 0 });
});
