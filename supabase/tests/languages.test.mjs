import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { LANGUAGES } from '../../shared/languages.ts';
import { createDb, createUser, as } from './harness.mjs';

let db;
let n = 0;

// La base que espera la app (como producción + Ranked en todos los cursos): todas las migraciones y
// las publicaciones de supabase/pending/, en el orden en que se aplicaron, más
// 20261226120000_ranked_all_courses (francés y español con Ranked; español disponible).
const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');
const PENDING = [
  '20261121120000_publish_en_a2_u13_u17.sql',
  '20261123120000_publish_en_b1.sql',
  '20261125120000_publish_en_b2.sql',
  '20261127120000_publish_pt_a1_a2.sql',
  '20261129120000_publish_it_a1_a2.sql',
  '20261201120000_publish_zh_a1_a2.sql',
  '20261203120000_publish_fr_a1_a2.sql',
  '20261203130000_enable_fr.sql',
  '20261205120000_publish_es_a1_a2.sql',
  '20261226120000_ranked_all_courses.sql',
];

before(async () => {
  db = await createDb();
  for (const file of PENDING) await db.exec(pending(file));
});

/** Usuario con el registro completo (en inglés). */
async function onboardedUser() {
  n += 1;
  const u = await createUser(db, `lang${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(
      `select public.complete_onboarding('lang_user_${n}', 'bolt', 'en', 'A1', 10::smallint)`,
    ),
  );
  return u;
}

const setLanguage = (u, code) =>
  as(db, 'authenticated', u, () =>
    db.query('select target_language from public.set_target_language($1)', [code]),
  );

const targetOf = async (u) =>
  (await db.query('select target_language from public.profiles where id = $1', [u])).rows[0]
    .target_language;

test('el estado de cada idioma replica shared/languages.ts', async () => {
  const { rows } = await db.query(
    'select code, content_status, ranked_available from public.languages order by code',
  );
  const byCode = Object.fromEntries(rows.map((r) => [r.code, r]));
  for (const l of LANGUAGES) {
    assert.deepEqual(
      {
        code: l.code,
        status: byCode[l.code]?.content_status,
        ranked: byCode[l.code]?.ranked_available,
      },
      { code: l.code, status: l.status, ranked: l.ranked },
    );
  }
  // Los seis idiomas: disponibles para todos y con Ranked.
  for (const code of ['en', 'fr', 'it', 'pt', 'zh', 'es']) {
    assert.deepEqual(
      [byCode[code].content_status, byCode[code].ranked_available],
      ['available', true],
    );
  }
});

test('sin ser tester se eligen los idiomas disponibles y no los inexistentes', async () => {
  const u = await onboardedUser();
  await assert.rejects(setLanguage(u, 'xx'), /language_unavailable/);
  // Cualquier cuenta elige cualquiera de los seis; cada uno crea su propio rating.
  for (const code of ['fr', 'it', 'pt', 'zh', 'es']) {
    await setLanguage(u, code);
    assert.equal(await targetOf(u), code);
  }
  const ratings = await db.query(
    'select language_code from public.player_ratings where user_id = $1 order by language_code',
    [u],
  );
  assert.deepEqual(
    ratings.rows.map((r) => r.language_code),
    ['en', 'es', 'fr', 'it', 'pt', 'zh'],
  );
  const { rows } = await setLanguage(u, 'en');
  assert.equal(rows[0].target_language, 'en');
});

test('registrarse en otro idioma: rating inicial de ese idioma y sólo niveles con contenido', async () => {
  n += 1;
  const u = await createUser(db, `lang${n}@test.dev`);
  const register = (lang, level) =>
    as(db, 'authenticated', u, () =>
      db.query(
        `select public.complete_onboarding('lang_user_${n}', 'bolt', $1, $2, 10::smallint)`,
        [lang, level],
      ),
    );
  // Italiano, portugués y chino tienen A2 publicado; ninguno tiene B1 (el inglés sí).
  await assert.rejects(register('it', 'B1'), /level_unavailable/);
  await assert.rejects(register('xx', 'A1'), /language_unavailable/);
  // Francés: se registra en A1 o A2, con su propio rating.
  await register('fr', 'A2');
  assert.equal(await targetOf(u), 'fr');
  await register('fr', 'A1');
  await register('zh', 'A1');
  assert.equal(await targetOf(u), 'zh');
  const { rows } = await db.query(
    'select language_code, rating, wins from public.player_ratings where user_id = $1 order by language_code',
    [u],
  );
  assert.deepEqual(
    rows.map((r) => [r.language_code, r.rating, r.wins]),
    [
      ['en', 100, 0],
      ['fr', 100, 0],
      ['zh', 100, 0],
    ],
  );
  // Repetir el registro no duplica el rating.
  await register('zh', 'A1');
  const again = await db.query(
    "select count(*)::int as c from public.rating_history where user_id = $1 and language_code = 'zh'",
    [u],
  );
  assert.equal(again.rows[0].c, 1);
});

test('un tester elige otro idioma con ranked: conserva su inglés y recibe el rating inicial', async () => {
  const u = await onboardedUser();
  await db.query('insert into public.content_testers (user_id) values ($1)', [u]);
  const tester = await as(db, 'authenticated', u, () =>
    db.query('select public.is_content_tester() as ok'),
  );
  assert.equal(tester.rows[0].ok, true);

  await setLanguage(u, 'zh');
  assert.equal(await targetOf(u), 'zh');
  const ratings = await db.query(
    'select language_code, rating, wins from public.player_ratings where user_id = $1 order by language_code',
    [u],
  );
  assert.deepEqual(
    ratings.rows.map((r) => [r.language_code, r.rating, r.wins]),
    [
      ['en', 100, 0],
      ['zh', 100, 0],
    ],
  );

  // El español y el francés ya no dependen de ser tester.
  await setLanguage(u, 'es');
  assert.equal(await targetOf(u), 'es');
  await setLanguage(u, 'fr');
  assert.equal(await targetOf(u), 'fr');

  await setLanguage(u, 'en');
  assert.equal(await targetOf(u), 'en');
});

test('en chino Ranked no pide escribir (no se escriben caracteres)', async () => {
  const { rows } = await db.query(
    "select public.rush_writing_for(700, 'zh') as zh, public.rush_writing_for(700, 'it') as it, public.rush_writing_for(699, 'it') as low",
  );
  assert.deepEqual(rows[0], { zh: false, it: true, low: false });
  const q = await db.query("select public.rush_questions('zh', 9, 900) as q");
  assert.ok(q.rows[0].q.every((x) => !x.write));
  const it = await db.query("select public.rush_questions('it', 9, 900) as q");
  assert.ok(it.rows[0].q.some((x) => x.write));
});

test('un idioma con ranked crea el rating inicial si falta', async () => {
  const u = await onboardedUser();
  await db.query("delete from public.rating_history where user_id = $1 and language_code = 'en'", [
    u,
  ]);
  await db.query("delete from public.player_ratings where user_id = $1 and language_code = 'en'", [
    u,
  ]);
  await setLanguage(u, 'en');
  const { rows } = await db.query(
    "select rating from public.player_ratings where user_id = $1 and language_code = 'en'",
    [u],
  );
  assert.equal(rows.length, 1);
});

test('la activación del francés es idempotente y su rollback lo vuelve a cerrar sin tocar perfiles', async (t) => {
  // En su propia base, con el estado de cuando se activó el francés (sin Ranked: enable_fr se niega
  // a correr con ranked_available en true, que ahora decide 20261226120000_ranked_all_courses).
  const shared = db;
  db = await createDb();
  t.after(() => {
    db = shared;
  });
  await db.exec(pending('20261203120000_publish_fr_a1_a2.sql'));
  await db.exec(pending('20261203130000_enable_fr.sql'));
  const u = await onboardedUser();
  await setLanguage(u, 'fr');
  await db.exec(pending('20261203130000_enable_fr.sql'));
  const rollback = readFileSync(
    new URL('../rollback/20261203130000_enable_fr.down.sql', import.meta.url),
    'utf8',
  );
  await db.exec(rollback);
  await db.exec(rollback);
  const other = await onboardedUser();
  await assert.rejects(setLanguage(other, 'fr'), /language_unavailable/);
  // Quien ya lo eligió conserva el idioma.
  assert.equal(await targetOf(u), 'fr');
  // El rollback de la publicación se niega mientras alguien estudia francés.
  await assert.rejects(
    db.exec(
      readFileSync(
        new URL('../rollback/20261203120000_publish_fr_a1_a2.down.sql', import.meta.url),
        'utf8',
      ),
    ),
    /fr_unpublish: hay perfiles estudiando francés/,
  );
  await db.exec(pending('20261203130000_enable_fr.sql'));
  await setLanguage(other, 'fr');
  assert.equal(await targetOf(other), 'fr');
});

test('nadie más que el propio usuario cambia su idioma y la tabla de testers es privada', async () => {
  const u = await createUser(db, 'not-onboarded@test.dev');
  await assert.rejects(setLanguage(u, 'en'), /profile_not_found/);
  await assert.rejects(
    as(db, 'anon', null, () => db.query("select public.set_target_language('en')")),
  );
  await assert.rejects(
    as(db, 'authenticated', u, () => db.query('select * from public.content_testers')),
  );
});
