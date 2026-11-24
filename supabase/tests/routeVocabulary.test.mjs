// Fase C.6 (docs/LEARNING_PHASE_C.md §C6): el vocabulario se lee según la ruta curricular visible
// (20261116120000_route_vocabulary_access.sql), probado en PGlite.
//
// La base se arma hasta antes de la C.4, se crea una cuenta «existente» con progreso, se aplican C.4 y
// C.5, se toma una foto de contenido, progreso y rutas, y se aplica la C.6 (dos veces). Un «cliente
// antiguo» es un request SIN la cabecera x-polygo-curriculum-api; uno «nuevo» la envía con 1. Lo que
// veía `authenticated` antes de la C.6 es exactamente la política permisiva (is_published / true), así
// que «antes» se calcula como superusuario con ese mismo filtro. La segunda parte publica U13/U14 y
// habilita la v2 sólo dentro de esta base desechable.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser } from './harness.mjs';

const C4 = '20261114120000_curriculum_routes.sql';
const C5 = '20261115120000_client_compatibility.sql';
const C6 = '20261116120000_route_vocabulary_access.sql';
const dir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, dir), 'utf8');
const OLD = null; // sin cabecera
const NEW = 1;
const NEW_UNITS = ['a1-u13', 'a1-u14'];

let db;
const users = {};
let snapshotBefore;
let exclusive; // palabras que introducen U13/U14 (words.unit_id)
let shared; // palabras de otras unidades que usan los ejercicios de U13/U14

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
const ids = (rows) => rows.map((r) => r.id);

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

/** Ejecuta fn como un cliente: rol, JWT y cabeceras de PostgREST (api null = cliente antiguo). */
async function asClient(role, userId, api, fn) {
  const headers = api == null ? {} : { 'x-polygo-curriculum-api': String(api) };
  await db.exec(`set role ${role}`);
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId ?? '']);
  await db.query(`select set_config('request.headers', $1, false)`, [JSON.stringify(headers)]);
  try {
    return await fn();
  } finally {
    await db.exec('reset role');
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
    await db.query(`select set_config('request.headers', '', false)`);
  }
}

async function signUp(email, api) {
  const meta = api == null ? null : { polygo_curriculum_api: api };
  return (
    await one(`insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`, [
      email,
      meta,
    ])
  ).id;
}

/** Lo que un cliente lee de una consulta directa (como PostgREST: rol authenticated + cabeceras). */
const read = (user, api, sql, params = []) =>
  asClient('authenticated', user, api, () => all(sql, params));
const wordIds = async (user, api, where = 'true', params = []) =>
  ids(await read(user, api, `select id from public.words where ${where} order by id`, params));

/** Lo que veía authenticated antes de la C.6: la política permisiva sola. */
const publishedWordIds = async (where = 'true', params = []) =>
  ids(await all(`select id from public.words where is_published and ${where} order by id`, params));

/** fetchWordPool de la app: todas las palabras del idioma. */
const wordPool = (user, api, lang) => wordIds(user, api, 'language_code = $1', [lang]);
/** fetchLessonContent de la app: ejercicios de una lección con sus palabras embebidas. */
const lessonContent = (user, api, lesson) =>
  read(
    user,
    api,
    `select e.id, coalesce(jsonb_agg(jsonb_build_object('word_id', ew.word_id, 'text', w.text))
                             filter (where ew.word_id is not null), '[]') words
     from public.exercises e
     left join public.exercise_words ew on ew.exercise_id = e.id
     left join public.words w on w.id = ew.word_id
     where e.lesson_id = $1 group by e.id order by e.id`,
    [lesson],
  );

async function snapshot() {
  const q = async (sql) => JSON.stringify((await db.query(sql)).rows);
  return {
    words: await q(`select * from public.words order by id`),
    exercises: await q(
      `select id, lesson_id, payload, answer, is_published from public.exercises order by id`,
    ),
    exerciseWords: await q(`select * from public.exercise_words order by 1, 2`),
    lessons: await q(`select id, unit_id, position, is_published from public.lessons order by id`),
    units: await q(`select id, position, is_published from public.curriculum_units order by id`),
    wordProgress: await q(`select * from public.user_word_progress order by 1, 2`),
    lessonProgress: await q(`select * from public.user_lesson_progress order by 1, 2`),
    routes: await q(`select * from public.curriculum_routes order by id`),
    routeUnits: await q(`select * from public.curriculum_route_units order by 1, 2`),
    enrollment: await q(`select * from public.curriculum_route_enrollment order by 1, 2`),
    assignments: await q(`select * from public.user_curriculum_routes order by 1, 2, 3`),
    unlocks: await q(
      `select u.id, l.id lesson, public.is_lesson_unlocked(u.id, l.id) ok
       from public.profiles u cross join public.lessons l order by 1, 2`,
    ),
  };
}

async function publish(units) {
  for (const u of units) {
    await db.query(`update public.curriculum_units set is_published = true where id = $1`, [u]);
    await db.query(`update public.words set is_published = true where unit_id = $1`, [u]);
    await db.query(
      `update public.lessons set is_published = true where unit_id = $1 and id not like '%-context'`,
      [u],
    );
    await db.query(
      `update public.exercises set is_published = true where lesson_id in
         (select id from public.lessons where unit_id = $1 and id not like '%-context')`,
      [u],
    );
  }
}

const enableV2 = () =>
  asClient('service_role', null, null, () =>
    db.query(`select public.curriculum_enable_route('en.a1.route.v2')`),
  );

before(async () => {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql') && f < C4)
    .sort();
  db = await createDb({ files });
  users.existing = await createUser(db, 'existing@test.dev');
  await db.query(
    `insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count, incorrect_count,
       last_result, last_reviewed_at, next_review_at)
     select $1, w.id, 1, 2, 1, 1, false, now(), now() - interval '1 hour'
     from public.words w where w.unit_id in ('a1-u01', 'a1-u07') and w.is_published`,
    [users.existing],
  );
  await db.exec(migration(C4));
  await db.exec(migration(C5));
  // Altas con la v2 apagada: el cliente nuevo también recibe la v1 (C.5).
  users.v1old = await signUp('v1-old@test.dev', OLD);
  users.v1new = await signUp('v1-new@test.dev', NEW);
  snapshotBefore = await snapshot();
  await db.exec(migration(C6));
  await db.exec(migration(C6)); // idempotente

  exclusive = ids(
    await all(`select id from public.words where unit_id = any($1) order by id`, [NEW_UNITS]),
  );
  shared = ids(
    await all(
      `select distinct w.id from public.exercise_words ew
       join public.exercises e on e.id = ew.exercise_id
       join public.lessons l on l.id = e.lesson_id
       join public.words w on w.id = ew.word_id
       where l.unit_id = any($1) and w.unit_id <> all($1) order by w.id`,
      [NEW_UNITS],
    ),
  );
});

// --- 11: la migración no cambia datos -------------------------------------------------------------

test('11: sin cambios en contenido, ids, progreso, rutas, asignaciones ni desbloqueos; reaplicable', async () => {
  const after = await snapshot();
  for (const key of Object.keys(snapshotBefore)) {
    assert.equal(after[key], snapshotBefore[key], key);
  }
  // Reaplicada: las mismas tres políticas restrictivas, sin duplicados.
  assert.deepEqual(
    await all(
      `select tablename, policyname, permissive from pg_policies
       where schemaname = 'public' and tablename in ('words', 'exercises', 'exercise_words')
       order by 1, 2`,
    ),
    [
      {
        tablename: 'exercise_words',
        policyname: "exercise words in the client's curriculum route",
        permissive: 'RESTRICTIVE',
      },
      {
        tablename: 'exercise_words',
        policyname: 'exercise words readable',
        permissive: 'PERMISSIVE',
      },
      {
        tablename: 'exercises',
        policyname: "exercises in the client's curriculum route",
        permissive: 'RESTRICTIVE',
      },
      {
        tablename: 'exercises',
        policyname: 'exercises readable when published',
        permissive: 'PERMISSIVE',
      },
      {
        tablename: 'words',
        policyname: "words in the client's curriculum route",
        permissive: 'RESTRICTIVE',
      },
      { tablename: 'words', policyname: 'words readable when published', permissive: 'PERMISSIVE' },
    ],
  );
  // Sin sentencias destructivas.
  const code = migration(C6)
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('--'))
    .join('\n');
  assert.doesNotMatch(code, /\b(drop|delete|truncate|update|alter\s+table)\b/i);
});

test('pertenencia: 34 palabras propias de U13/U14 (words.unit_id) y 25 reutilizadas de otras unidades', () => {
  assert.equal(exclusive.length, 34);
  assert.ok(exclusive.includes('en-surname') && exclusive.includes('en-a-cup-of'));
  assert.equal(shared.length, 25);
  assert.ok(
    shared.includes('en-coffee') && shared.includes('en-price') && shared.includes('en-how-much'),
  );
  assert.ok(!shared.some((w) => exclusive.includes(w)));
});

// --- 12a: v2 apagada, U13/U14 sin publicar ----------------------------------------------------------

test('12 · v2 apagada: los enlaces de U13/U14 (antes leíbles con using(true)) ya no llegan a la v1', async () => {
  // Antes de la C.6 cualquier cuenta leía los 322 enlaces, con ids como en-surname, aunque nada estuviera publicado.
  const before = await all(
    `select count(*)::int n from public.exercise_words ew join public.exercises e on e.id = ew.exercise_id
     join public.lessons l on l.id = e.lesson_id where l.unit_id = any($1)`,
    [NEW_UNITS],
  );
  assert.equal(before[0].n, 322);
  for (const user of [users.existing, users.v1old, users.v1new]) {
    for (const api of [OLD, NEW]) {
      const rows = await read(
        user,
        api,
        `select word_id from public.exercise_words where word_id = any($1)`,
        [exclusive],
      );
      assert.deepEqual(rows, [], `${api}`);
      // Los enlaces de U1–U12 siguen todos (también los de ejercicios sin publicar, como antes).
      const visible = await read(user, api, `select count(*)::int n from public.exercise_words`);
      assert.equal(visible[0].n, 10423 - 322);
    }
  }
});

// --- Publicación de U13/U14 con la v2 apagada -----------------------------------------------------

test('1 · 2 · 4 · 5 · 9: publicadas U13/U14 y v2 apagada, la v1 no las lee con ningún cliente', async () => {
  await publish(NEW_UNITS);
  assert.equal(
    (await one(`select enabled from public.curriculum_routes where id = 'en.a1.route.v2'`)).enabled,
    false,
  );
  const expected = (await publishedWordIds(`language_code = 'en'`)).filter(
    (w) => !exclusive.includes(w),
  );
  for (const user of [users.existing, users.v1old, users.v1new]) {
    for (const api of [OLD, NEW]) {
      // 9: consultas directas a words.
      assert.deepEqual(await wordPool(user, api, 'en'), expected);
      assert.deepEqual(await wordIds(user, api, `id = 'en-surname'`), []); // 4: U13
      assert.deepEqual(await wordIds(user, api, `id = 'en-a-cup-of'`), []); // 5: U14
      assert.deepEqual(await wordIds(user, api, `unit_id = any($1)`, [NEW_UNITS]), []);
      assert.deepEqual(await wordIds(user, api, `text in ('surname', 'alphabet', 'dollar')`), []);
      // Ejercicios y enlaces de sus lecciones.
      assert.deepEqual(await lessonContent(user, api, 'a1-u13-l01'), []);
      assert.deepEqual(await lessonContent(user, api, 'a1-u14-l04'), []);
      assert.deepEqual(
        await read(
          user,
          api,
          `select id from public.exercises where lesson_id like 'a1-u13-%' or lesson_id like 'a1-u14-%'`,
        ),
        [],
      );
      // Embebido inverso (words → exercise_words → exercises): tampoco.
      assert.deepEqual(
        await read(
          user,
          api,
          `select w.id from public.words w join public.exercise_words ew on ew.word_id = w.id
           join public.exercises e on e.id = ew.exercise_id
           join public.lessons l on l.id = e.lesson_id where l.unit_id = any($1)`,
          [NEW_UNITS],
        ),
        [],
      );
    }
  }
});

test('6: las palabras reutilizadas siguen visibles para la v1; sólo se ocultan sus enlaces a U13/U14', async () => {
  for (const api of [OLD, NEW]) {
    assert.deepEqual(await wordIds(users.existing, api, `id = any($1)`, [shared]), shared);
    // En las lecciones de su unidad: igual que antes.
    const u7 = await lessonContent(users.existing, api, 'a1-u07-l01');
    assert.ok(u7.length > 0);
    assert.ok(u7.some((e) => e.words.some((w) => w.word_id === 'en-coffee')));
    // Los enlaces de coffee: sólo los de unidades visibles.
    const links = await read(
      users.existing,
      api,
      `select ew.exercise_id from public.exercise_words ew where ew.word_id = 'en-coffee' order by 1`,
    );
    const expected = await all(
      `select ew.exercise_id from public.exercise_words ew join public.exercises e on e.id = ew.exercise_id
       join public.lessons l on l.id = e.lesson_id where ew.word_id = 'en-coffee' and l.unit_id <> all($1) order by 1`,
      [NEW_UNITS],
    );
    assert.ok(expected.length > 0);
    assert.deepEqual(links, expected);
  }
});

test('7: palabras sin ejercicios: deciden su unidad y su publicación, como antes', async () => {
  // Hoy toda palabra tiene ejercicios: se crean tres sin enlaces sólo en esta base.
  await db.query(
    `insert into public.words (id, language_code, unit_id, text, translation_es, is_published) values
       ('en-c6-loose-u05', 'en', 'a1-u05', 'c6 loose u05', 'suelta u05', true),
       ('en-c6-loose-a2', 'en', 'a2-u03', 'c6 loose a2', 'suelta a2', true),
       ('en-c6-loose-u13', 'en', 'a1-u13', 'c6 loose u13', 'suelta u13', true),
       ('en-c6-loose-draft', 'en', 'a1-u05', 'c6 loose draft', 'borrador', false)`,
  );
  for (const api of [OLD, NEW]) {
    assert.deepEqual(await wordIds(users.existing, api, `id like 'en-c6-%'`), [
      'en-c6-loose-a2',
      'en-c6-loose-u05',
    ]);
  }
  await db.query(`delete from public.words where id like 'en-c6-%'`);
});

test('8: otros idiomas y niveles sin rutas: exactamente lo publicado, con cualquier cliente', async () => {
  const langs = ids(await all(`select distinct language_code id from public.words order by 1`));
  assert.ok(['it', 'pt', 'zh'].every((l) => langs.includes(l)));
  for (const lang of langs.filter((l) => l !== 'en')) {
    const expected = await publishedWordIds('language_code = $1', [lang]);
    assert.ok(expected.length > 0, lang);
    for (const api of [OLD, NEW]) {
      assert.deepEqual(await wordPool(users.existing, api, lang), expected, `${lang} ${api}`);
      const lessonIds = ids(
        await all(
          `select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
           where u.language_code = $1`,
          [lang],
        ),
      );
      const ex = await read(
        users.existing,
        api,
        `select count(*)::int n from public.exercises where lesson_id = any($1)`,
        [lessonIds],
      );
      const exExpected = await one(
        `select count(*)::int n from public.exercises where lesson_id = any($1) and is_published`,
        [lessonIds],
      );
      assert.equal(ex[0].n, exExpected.n, lang);
    }
  }
  // Inglés A2: también sin rutas.
  const a2 = await publishedWordIds(`unit_id like 'a2-%' and language_code = 'en'`);
  assert.ok(a2.length > 0);
  assert.deepEqual(
    await wordIds(users.existing, OLD, `unit_id like 'a2-%' and language_code = 'en'`),
    a2,
  );
});

test('10: palabra del día, resumen y funciones auxiliares no exponen U13/U14 a la v1', async () => {
  // word_of_the_day (SECURITY INVOKER): 500 días seguidos, nunca una palabra exclusiva.
  const days = await read(
    users.existing,
    OLD,
    `select (select w.id from public.word_of_the_day(d::date, 'en') w) id
     from generate_series(date '2026-01-01', date '2026-01-01' + 499, interval '1 day') d`,
  );
  assert.equal(days.length, 500);
  assert.ok(days.every((d) => d.id && !exclusive.includes(d.id)));
  // Como superusuario (lo que haría sin RLS) alguna de esas fechas sí caería en U13/U14: la prueba no es vacía.
  const raw = await all(
    `select (select w.id from public.word_of_the_day(d::date, 'en') w) id
     from generate_series(date '2026-01-01', date '2026-01-01' + 499, interval '1 day') d`,
  );
  assert.ok(raw.some((d) => exclusive.includes(d.id)));

  // Funciones auxiliares: sólo booleanos; una palabra oculta y una inexistente dan lo mismo.
  const probe = await read(
    users.existing,
    NEW,
    `select public.curriculum_word_visible('en-surname') hidden, public.curriculum_word_visible('en-nope') missing,
            public.curriculum_word_visible('en-coffee') shared,
            public.curriculum_exercise_visible((select min(id) from public.exercises where lesson_id = 'a1-u01-l01')) ex,
            public.curriculum_lesson_visible('a1-u13-l01') lesson, public.curriculum_unit_visible('a1-u14') unit`,
  );
  assert.deepEqual(probe[0], {
    hidden: false,
    missing: false,
    shared: true,
    ex: true,
    lesson: false,
    unit: false,
  });
  // anon no las ejecuta ni lee vocabulario.
  for (const sql of [
    `select public.curriculum_word_visible('en-coffee')`,
    `select id from public.words limit 1`,
    `select * from public.exercise_words limit 1`,
  ]) {
    assert.ok(await errorOf(asClient('anon', null, NEW, () => db.query(sql))), sql);
  }
});

test('10: inventario de vías a vocabulario para authenticated y anon (falla si aparece una nueva)', async () => {
  // Relaciones leíbles por un cliente: las de contenido tienen la política restrictiva de ruta.
  const content = await all(
    `select c.relname from pg_class c
     where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm', 'f', 'p')
       and (has_table_privilege('authenticated', c.oid, 'select') or has_table_privilege('anon', c.oid, 'select'))
       and exists (select 1 from pg_attribute a where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
                   and a.attname in ('word_id', 'unit_id', 'lesson_id', 'exercise_id', 'payload', 'translation_es'))
     order by 1`,
  );
  assert.deepEqual(ids(content.map((r) => ({ id: r.relname }))), [
    'exercise_attempts', // intentos propios (owner)
    'exercise_words',
    'exercises',
    'learning_sessions', // sesiones propias (owner): sólo el id de la lección
    'lessons',
    'user_lesson_progress', // progreso propio (owner)
    'user_word_progress', // progreso propio (owner); el embebido a words pasa por su RLS
    'words',
  ]);
  for (const t of ['curriculum_units', 'lessons', 'words', 'exercises', 'exercise_words']) {
    assert.ok(
      (
        await one(
          `select count(*)::int n from pg_policies where schemaname = 'public' and tablename = $1
         and permissive = 'RESTRICTIVE' and policyname like '%curriculum route'`,
          [t],
        )
      ).n === 1,
      t,
    );
  }
  // Funciones que un cliente puede llamar y que leen words: invoker (RLS) o sólo datos propios.
  const fns = await all(
    `select p.proname, p.prosecdef secdef from pg_proc p
     where p.pronamespace = 'public'::regnamespace and p.prosrc ~* 'public\\.words([^_a-z]|$)'
       and (has_function_privilege('authenticated', p.oid, 'execute') or has_function_privilege('anon', p.oid, 'execute'))
     order by 1`,
  );
  assert.deepEqual(fns, [
    { proname: 'curriculum_word_visible', secdef: true }, // booleano
    { proname: 'get_learning_mastery', secdef: true }, // textos sólo de conceptos con estado propio
    { proname: 'get_learning_summary', secdef: false }, // invoker: words con RLS
    { proname: 'word_of_the_day', secdef: false }, // invoker: words y unidades con RLS
  ]);
});

// --- v2 habilitada -----------------------------------------------------------------------------------

test('3 · 12 · v2 habilitada: la v2 con cliente nuevo lee U13/U14; con cliente antiguo ve la v1', async () => {
  await enableV2();
  users.v2 = await signUp('v2@test.dev', NEW);
  users.v1late = await signUp('v1-late@test.dev', OLD);
  assert.equal(
    (
      await one(
        `select route_id from public.user_curriculum_routes where user_id = $1 and language_code = 'en' and level = 'A1'`,
        [users.v2],
      )
    ).route_id,
    'en.a1.route.v2',
  );
  const all_en = await publishedWordIds(`language_code = 'en'`);
  const v1View = all_en.filter((w) => !exclusive.includes(w));

  // 3: v2 + cliente C.5: todo lo publicado, incluido U13/U14.
  assert.deepEqual(await wordPool(users.v2, NEW, 'en'), all_en);
  assert.deepEqual(await wordIds(users.v2, NEW, `id in ('en-surname', 'en-a-cup-of')`), [
    'en-a-cup-of',
    'en-surname',
  ]);
  const u14 = await lessonContent(users.v2, NEW, 'a1-u14-l04');
  assert.ok(u14.length > 0);
  assert.ok(u14.some((e) => e.words.some((w) => w.word_id === 'en-a-cup-of')));
  assert.ok(u14.some((e) => e.words.some((w) => w.word_id === 'en-coffee'))); // compartida, en U14
  // v2 + cliente antiguo: la ruta que esa build puede dibujar (v1), como en la C.5.
  assert.deepEqual(await wordPool(users.v2, OLD, 'en'), v1View);
  assert.deepEqual(await lessonContent(users.v2, OLD, 'a1-u14-l04'), []);
  // Las cuentas v1 siguen igual con la v2 habilitada.
  for (const user of [users.existing, users.v1old, users.v1new, users.v1late]) {
    for (const api of [OLD, NEW]) {
      assert.deepEqual(await wordPool(user, api, 'en'), v1View);
    }
  }
  // Publicación sigue mandando: una palabra de U13 sin publicar no la lee ni la v2.
  await db.query(`update public.words set is_published = false where id = 'en-surname'`);
  assert.deepEqual(await wordIds(users.v2, NEW, `id = 'en-surname'`), []);
  await db.query(`update public.words set is_published = true where id = 'en-surname'`);
});

test('10: resumen y palabra del día de la v2 respetan el cliente; el progreso no cambia', async () => {
  await db.query(
    `insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count, incorrect_count,
       last_result, last_reviewed_at, next_review_at)
     values ($1, 'en-surname', 0, 3, 0, 9, false, now(), now())`,
    [users.v2],
  );
  const progressBefore = await all(`select * from public.user_word_progress where user_id = $1`, [
    users.v2,
  ]);
  const mistakes = (api) =>
    asClient('authenticated', users.v2, api, async () =>
      (await one(`select public.get_learning_summary('UTC') s`)).s.frequent_mistakes.map(
        (m) => m.word_id,
      ),
    );
  assert.deepEqual(await mistakes(NEW), ['en-surname']);
  assert.deepEqual(await mistakes(OLD), []); // la build antigua no dibuja U13
  // Mis palabras (user_word_progress con words!inner): igual.
  const mine = (api) =>
    read(
      users.v2,
      api,
      `select p.word_id from public.user_word_progress p join public.words w on w.id = p.word_id
       where p.user_id = $1`,
      [users.v2],
    );
  assert.deepEqual(ids((await mine(NEW)).map((r) => ({ id: r.word_id }))), ['en-surname']);
  assert.deepEqual(await mine(OLD), []);
  // La fila de progreso sigue intacta (sólo cambia lo que se lee).
  assert.deepEqual(
    await all(`select * from public.user_word_progress where user_id = $1`, [users.v2]),
    progressBefore,
  );
  // Palabra del día para la v2 con cliente nuevo: puede caer en U13/U14 (alguna fecha de 500).
  const days = await read(
    users.v2,
    NEW,
    `select (select w.id from public.word_of_the_day(d::date, 'en') w) id
     from generate_series(date '2026-01-01', date '2026-01-01' + 499, interval '1 day') d`,
  );
  assert.ok(days.some((d) => exclusive.includes(d.id)));
});

test('la visibilidad por clave coincide con la de la C.5 para toda unidad, ruta y cliente', async () => {
  for (const user of [users.existing, users.v2]) {
    for (const api of [OLD, NEW]) {
      const rows = await read(
        user,
        api,
        `select u.id, public.curriculum_unit_visible(u.id) a,
                u.id in (select public.curriculum_visible_unit_ids()) b
         from public.curriculum_units u order by 1`,
      );
      assert.ok(rows.length > 50);
      for (const r of rows) assert.equal(r.a, r.b, `${r.id} ${api}`);
    }
  }
});
