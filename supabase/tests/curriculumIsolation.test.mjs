// Fase C.7 (docs/LEARNING_PHASE_C.md §C7): aislamiento curricular en Repasos, Ranked y Mastery Display
// (20261117120000_curriculum_isolation.sql), probado en PGlite.
//
// La base se arma hasta la C.6, se crean cuentas v1 (cliente antiguo y C.5) con conocimiento de TODO el
// vocabulario de inglés (el peor caso: incluidas las palabras de U13/U14) y estado en el SRS v2 y en el
// motor, y los 181 ítems de U13/U14 se activan sólo en esta base desechable (en el repo son `draft`).
// Se toma una foto de todo (candidatos, Mastery, catálogo de funciones, progreso, historial, Ranked,
// interruptores) y se aplica la C.7 dos veces. «Cliente antiguo» = request sin la cabecera
// x-polygo-curriculum-api; «nuevo» = la envía con 1. Las funciones de repaso corren como service_role
// con la cabecera que la Edge Function reenvía desde esta fase. La segunda parte publica U13/U14 y
// habilita la v2 sólo en esta base.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser } from './harness.mjs';
import { helpers, answerAll, TZ, j } from './learningHelpers.mjs';
import { buildBasicPlan } from '../../shared/focusReview.ts';
import { reviewPresentationOrders } from '../../shared/learningSession.ts';
import { rushLabel } from '../../shared/wordRush.ts';

const C7 = '20261117120000_curriculum_isolation.sql';
const dir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, dir), 'utf8');
const OLD = null; // sin cabecera
const NEW = 1;
const NEW_UNITS = ['a1-u13', 'a1-u14'];
const NOW = '2026-11-10T15:00:00Z';

let db;
let h;
const users = {};
let before7; // foto antes de la C.7
let u13Items; // ítems cuyo ejercicio está en U13 (sólo allí)
let u14Items;
let sharedOnly; // ítems de U13/U14 cuyos conceptos target son todos palabras de otras unidades
let oldItems; // ítems activos de U1–U12, A2 y otros idiomas
let exclusiveWords;

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

/** Ejecuta fn con rol, JWT y cabeceras de PostgREST (api null = cliente antiguo). */
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

/** La Edge Function learning-session: service_role con la cabecera del cliente reenviada. */
const edge = (api, fn) => asClient('service_role', null, api, fn);
const call = async (name, args) => {
  const ph = args.map((_, i) => `$${i + 1}`).join(', ');
  return (await one(`select public.${name}(${ph}) r`, args)).r;
};

async function signUp(email, api) {
  const meta = api == null ? null : { polygo_curriculum_api: api };
  const id = (
    await one(`insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`, [
      email,
      meta,
    ])
  ).id;
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [
      id,
      email
        .split('@')[0]
        .replace(/[^a-z0-9]/gi, '')
        .slice(0, 20),
    ],
  );
  await db.query(`update public.player_ratings set rating = 100 where user_id = $1`, [id]);
  return id;
}

/** Conoce todas las palabras de inglés (SRS v1: vistas y vencidas). */
const knowAllWords = (user) =>
  db.query(
    `insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count, incorrect_count,
       last_result, last_reviewed_at, next_review_at)
     select $1, w.id, 1, 2, 1, 1, false, now() - interval '2 days', now() - interval '1 hour'
     from public.words w where w.language_code = 'en'
     on conflict (user_id, word_id) do nothing`,
    [user],
  );

/** Completa todas las lecciones publicadas de esas unidades. */
const completeUnits = (user, units) =>
  db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy,
       first_completed_at, last_completed_at)
     select $1, l.id, 1, 1, 1, now(), now() from public.lessons l
     where l.unit_id = any ($2) and l.is_published
     on conflict (user_id, lesson_id) do nothing`,
    [user, units],
  );

/** Estado SRS v2 real (una lección por la ruta de la Edge Function) clonado a todos los conceptos en. */
async function srsLearner(email, api) {
  const user = await signUp(email, api);
  const lessonId = 'a1-u01-l01';
  const s = randomUUID();
  await h.startLesson(user, s, lessonId);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(user, s, lessonId, answerAll(snaps), new Date(Date.now() - 5 * 60000));
  await db.query(
    `insert into public.user_srs_state
     select (jsonb_populate_record(null::public.user_srs_state,
               to_jsonb(t) || jsonb_build_object('concept_id', c.id))).*
     from (select distinct on (dimension) * from public.user_srs_state where user_id = $1 order by dimension, concept_id) t
     cross join public.concepts c
     where c.language_code = 'en' and c.kind = 'lexical' and c.status = 'active'
     on conflict do nothing`,
    [user],
  );
  await db.query(
    `update public.user_srs_state set due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour',
       me_hint_at = null, me_hint_expires_at = null
     where user_id = $1`,
    [user],
  );
  return user;
}

const knownMap = async (user, api, mode) =>
  Object.fromEntries(
    (
      await edge(api, () =>
        all(
          `select r.item_id, bool_or(public.review_item_known($1, r.item_id, $2)) k
           from public.review_item_candidates('en') r group by r.item_id order by 1`,
          [user, mode],
        ),
      )
    ).map((r) => [r.item_id, r.k]),
  );

const focus = (user, api, now = NOW) =>
  edge(api, () => call('learning_focus_candidates', [user, 'en', now]));
const reviewCand = (user, api) =>
  edge(api, () => call('learning_review_candidates', [user, 'en', TZ, NOW]));
/** Ítems por palabra (focus) y por unidad (srs), sin los campos que dependen del reloj. */
const focusItems = (f) =>
  Object.fromEntries(f.words.map((w) => [w.word.id, w.items.map((i) => i.item_id)]));
const reviewItems = (c) =>
  Object.fromEntries(
    c.units.map((u) => [
      `${u.concept_id}|${u.dimension}`,
      { items: (u.items ?? []).map((i) => i.item_id), intro: u.intro_lesson_id },
    ]),
  );

async function mastery(user, api, lang = 'en') {
  return asClient('authenticated', user, api, () => call('get_learning_mastery', [lang, TZ]));
}

/** Motor «visible» sólo en esta base: la migración no lo enciende (se comprueba aparte). */
const withDisplay = async (fn) => {
  await db.query(
    `update public.mastery_model_versions set enabled_for_display = true where version = 'me-1.0.0'`,
  );
  try {
    return await fn();
  } finally {
    await db.query(
      `update public.mastery_model_versions set enabled_for_display = false where version = 'me-1.0.0'`,
    );
  }
};

/** Estado del motor para conceptos de esas unidades (débil, con evidencia). */
const engineState = (user, units) =>
  db.query(
    `insert into public.user_concept_state (user_id, concept_id, dimension, language_code, evidence_count,
       exposure_count, status, weak, mastery, confidence, model_version, computed_at, last_exposed_at)
     select $1, c.id, 'vocabulary', 'en', 3, 3, 'in_progress', true, 0.2, 0.6, 'me-1.0.0', now(), now()
     from public.concepts c join public.words w on w.id = c.word_id
     where w.unit_id = any ($2) and c.kind = 'lexical'
     on conflict do nothing`,
    [user, units],
  );

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

async function snapshot() {
  const q = async (sql) => JSON.stringify((await db.query(sql)).rows);
  return {
    functions: await q(
      `select p.oid::regprocedure::text sig, md5(p.prosrc) src, p.proacl::text acl, p.prosecdef sd, p.proconfig::text cfg
       from pg_proc p where p.pronamespace = 'public'::regnamespace order by 1`,
    ),
    tables: await q(
      `select c.relname, string_agg(a.attname || ':' || format_type(a.atttypid, a.atttypmod), ',' order by a.attnum) cols,
              c.relacl::text acl, c.relrowsecurity rls
       from pg_class c join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
       where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm') group by c.oid order by 1`,
    ),
    policies: await q(
      `select tablename, policyname, permissive, qual from pg_policies order by 1, 2`,
    ),
    wordProgress: await q(`select * from public.user_word_progress order by 1, 2`),
    lessonProgress: await q(`select * from public.user_lesson_progress order by 1, 2`),
    srs: await q(`select * from public.user_srs_state order by 1, 2, 3`),
    concepts: await q(`select * from public.user_concept_state order by 1, 2, 3`),
    attempts: await q(
      `select count(*), md5(string_agg(id::text, ',' order by id)) from public.exercise_attempts`,
    ),
    sessions: await q(`select * from public.learning_sessions order by id`),
    ratings: await q(`select * from public.player_ratings order by 1, 2`),
    ratingHistory: await q(`select * from public.rating_history order by id`),
    battles: await q(`select * from public.battles order by id`),
    battlePlayers: await q(`select * from public.battle_players order by 1, 2`),
    items: await q(`select id, status, current_version_id from public.exercise_items order by id`),
    routes: await q(`select * from public.curriculum_routes order by id`),
    assignments: await q(`select * from public.user_curriculum_routes order by 1, 2, 3`),
    switches: await q(
      `select (select json_agg(s) from public.srs_v2_settings s) srs,
              (select json_agg(m order by version) from public.mastery_model_versions m) mastery,
              (select count(*) from pg_namespace where nspname = 'cron') cron`,
    ),
  };
}

before(async () => {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql') && f < C7)
    .sort();
  db = await createDb({ files });
  h = helpers(db);

  // Cuentas v1 (la v2 está apagada: también el alta desde un cliente nuevo recibe la v1).
  users.v1old = await signUp('v1old@test.dev', OLD);
  users.v1new = await signUp('v1new@test.dev', NEW);
  for (const u of [users.v1old, users.v1new]) await knowAllWords(u);
  // SRS v2 real para una cuenta v1 (encendido sólo para sembrar; se restaura).
  const srsWas = (await one(`select enabled from public.srs_v2_settings`)).enabled;
  await h.setEnabled(true);
  users.srs = await srsLearner('srs@test.dev', NEW);
  await h.setEnabled(srsWas);
  // Motor: estados débiles en U1, U5 y (registro «histórico» imposible hoy) en U13 para una cuenta v1.
  await engineState(users.v1old, ['a1-u01', 'a1-u05', 'a1-u13']);
  // Ranked: progreso distinto.
  users.fresh1 = await signUp('fresh1@test.dev', NEW);
  users.fresh2 = await signUp('fresh2@test.dev', OLD);
  users.ahead1 = await signUp('ahead1@test.dev', NEW);
  users.ahead2 = await signUp('ahead2@test.dev', NEW);
  for (const u of [users.ahead1, users.ahead2])
    await completeUnits(u, ['a1-u01', 'a1-u02', 'a1-u03']);

  // Los ítems de U13/U14 se activan sólo en esta base (en el repo son draft).
  const itemsIn = async (sql) => (await all(sql)).map((r) => r.id);
  u13Items = await itemsIn(
    `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
     where l.unit_id = 'a1-u13' order by 1`,
  );
  u14Items = await itemsIn(
    `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
     where l.unit_id = 'a1-u14' order by 1`,
  );
  sharedOnly = (
    await all(
      `select i.id from public.exercise_items i
       where exists (select 1 from public.exercises e join public.lessons l on l.id = e.lesson_id
                     where e.item_id = i.id and l.unit_id = any ($1))
         and exists (select 1 from public.item_concepts ic where ic.item_id = i.id and ic.role = 'target')
         and not exists (select 1 from public.item_concepts ic join public.concepts c on c.id = ic.concept_id
                         left join public.words w on w.id = c.word_id
                         where ic.item_id = i.id and ic.role = 'target' and (w.unit_id is null or w.unit_id = any ($1)))
       order by 1`,
      [NEW_UNITS],
    )
  ).map((r) => r.id);
  await db.query(`update public.exercise_items set status = 'active' where id = any ($1)`, [
    [...u13Items, ...u14Items],
  ]);
  oldItems = (
    await all(
      `select i.id from public.exercise_items i where i.status = 'active' and i.id <> all ($1) order by 1`,
      [[...u13Items, ...u14Items]],
    )
  ).map((r) => r.id);
  exclusiveWords = (
    await all(`select id from public.words where unit_id = any ($1) order by id`, [NEW_UNITS])
  ).map((r) => r.id);

  before7 = {
    snap: await snapshot(),
    known: {},
    focus: {},
    review: {},
    mastery: {},
  };
  for (const [name, u] of Object.entries({ v1old: users.v1old, v1new: users.v1new })) {
    for (const api of [OLD, NEW]) {
      before7.known[`${name}:${api}`] = await knownMap(u, api, 'v1');
      before7.focus[`${name}:${api}`] = focusItems(await focus(u, api));
    }
  }
  for (const api of [OLD, NEW]) {
    before7.review[api] = reviewItems(await reviewCand(users.srs, api));
    before7.knownSrs = before7.knownSrs ?? {};
    before7.knownSrs[api] = await knownMap(users.srs, api, 'srs');
  }
  before7.mastery = await withDisplay(async () => ({
    old: await mastery(users.v1old, OLD),
    new: await mastery(users.v1old, NEW),
  }));

  await db.exec(migration(C7));
  await db.exec(migration(C7)); // idempotente
});

// =================================================================================================
// Migración
// =================================================================================================

test('C.7: sólo agrega; reaplicable; cambia exactamente las funciones previstas; datos y switches intactos', async () => {
  const after = await snapshot();
  for (const key of Object.keys(before7.snap)) {
    if (['functions', 'tables'].includes(key)) continue;
    assert.equal(after[key], before7.snap[key], key);
  }
  const fa = JSON.parse(after.functions);
  const fb = JSON.parse(before7.snap.functions);
  const bySig = (rows) => Object.fromEntries(rows.map((r) => [r.sig, r]));
  const [A, B] = [bySig(fa), bySig(fb)];
  const added = Object.keys(A)
    .filter((s) => !B[s])
    .sort();
  const removed = Object.keys(B).filter((s) => !A[s]);
  const changed = Object.keys(A)
    .filter((s) => B[s] && JSON.stringify(A[s]) !== JSON.stringify(B[s]))
    .sort();
  assert.deepEqual(removed, []);
  assert.deepEqual(added, [
    'curriculum_unit_visible_for(uuid,text,smallint)',
    'curriculum_unlocked_unit_ids(uuid,text)',
    'review_item_in_route(uuid,text)',
    'rush_common_unit_ids(text,uuid[],smallint[])',
    'rush_fallback_unit_ids(text)',
    'rush_my_unit_ids(text)',
    'rush_player_unit_ids(uuid,text,smallint)',
    'rush_questions_in_units(text,integer,integer,text[])',
    'rush_questions_in_units(text,integer,text[])',
  ]);
  // Elo, liquidación, matchmaking, duración, submit, FSRS y motor: sin cambios.
  assert.deepEqual(changed, [
    'accept_friend_challenge(text)',
    'get_learning_mastery(text,text)',
    'join_human_queue()',
    'learning_review_candidates(uuid,text,text,timestamp with time zone)',
    'review_item_known(uuid,text,text)',
    'rush_questions(text,integer)',
    'rush_questions(text,integer,integer)',
  ]);
  for (const s of changed) assert.equal(A[s].acl, B[s].acl, `${s}: mismos permisos`);
  // Tablas: sólo dos columnas nuevas.
  const ta = Object.fromEntries(JSON.parse(after.tables).map((r) => [r.relname, r]));
  const tb = Object.fromEntries(JSON.parse(before7.snap.tables).map((r) => [r.relname, r]));
  assert.deepEqual(Object.keys(ta).sort(), Object.keys(tb).sort());
  const tchanged = Object.keys(ta)
    .filter((t) => JSON.stringify(ta[t]) !== JSON.stringify(tb[t]))
    .sort();
  assert.deepEqual(tchanged, ['friend_challenges', 'ranked_queue']);
  assert.equal(ta.ranked_queue.cols, `${tb.ranked_queue.cols},curriculum_api:smallint`);
  assert.equal(
    ta.friend_challenges.cols,
    `${tb.friend_challenges.cols},host_curriculum_api:smallint`,
  );
  // Interruptores: SRS v2, Mastery (display/adaptive), v2 de la ruta y pg_cron, como estaban.
  assert.equal(after.switches, before7.snap.switches);
  assert.equal(
    (await one(`select enabled from public.curriculum_routes where id = 'en.a1.route.v2'`)).enabled,
    false,
  );
  // Sin sentencias destructivas.
  const text = migration(C7).replace(/--.*$/gm, '');
  assert.doesNotMatch(text, /\b(drop|delete|truncate)\b/i);
});

test('la migración está al día con scripts/build-c7-sql.ts', () => {
  const r = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/build-c7-sql.ts', '--check'], {
    cwd: new URL('../../', import.meta.url),
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);
});

// =================================================================================================
// Repasos (SRS)
// =================================================================================================

test('repasos · inventario: toda vía que arma candidatos pasa por review_item_known(p_user, …)', async () => {
  const fns = await all(
    `select p.proname, p.prosrc from pg_proc p where p.pronamespace = 'public'::regnamespace
     and p.prosrc ~ 'review_item_candidates\\(' order by 1`,
  );
  assert.deepEqual(
    fns.map((f) => f.proname),
    [
      'learning_focus_candidates',
      'learning_review_candidates',
      'learning_review_coverage', // agregado por idioma, sin usuario ni ítems: decide «contenido pendiente»
      'learning_start_basic_review',
      'learning_start_focus_review',
      'learning_start_review',
    ],
  );
  for (const f of fns) {
    if (f.proname === 'learning_review_coverage') continue;
    assert.match(f.prosrc, /review_item_known\(p_user, r\.item_id, '(srs|v1)'\)/, f.proname);
  }
  const known = await one(
    `select prosrc from pg_proc where oid = 'public.review_item_known(uuid, text, text)'::regprocedure`,
  );
  assert.match(known.prosrc, /and public\.review_item_in_route\(p_user, p_item\)\s*$/);
});

test('repasos · v1 con cliente antiguo y con cliente C.5: nada de U13/U14 (exclusivos ni compartidos); lo demás idéntico', async () => {
  assert.equal(u13Items.length + u14Items.length, 181);
  assert.equal(sharedOnly.length, 35);
  assert.ok(u13Items.length > 0 && u14Items.length > 0);
  for (const [name, u] of Object.entries({ v1old: users.v1old, v1new: users.v1new })) {
    for (const api of [OLD, NEW]) {
      const key = `${name}:${api}`;
      const now = await knownMap(u, api, 'v1');
      const was = before7.known[key];
      // Antes de la C.7 los ítems de U13/U14 (activados) eran presentables para quien conocía sus palabras.
      assert.ok(
        sharedOnly.every((i) => was[i] === true),
        `${key}: el hueco existía`,
      );
      for (const i of [...u13Items, ...u14Items]) {
        if (i in now) assert.equal(now[i], false, `${key} ${i}`);
      }
      for (const i of sharedOnly) assert.equal(now[i], false, `${key} compartido ${i}`);
      // Unidades antiguas: exactamente igual.
      for (const i of Object.keys(was)) {
        if (u13Items.includes(i) || u14Items.includes(i)) continue;
        assert.equal(now[i], was[i], `${key} ${i}`);
      }
      // learning_focus_candidates (repaso básico y Plus): lo de antes sin U13/U14, sin duplicados.
      const f = focusItems(await focus(u, api));
      const expected = Object.fromEntries(
        Object.entries(before7.focus[key]).map(([w, items]) => [
          w,
          items.filter((i) => !u13Items.includes(i) && !u14Items.includes(i)),
        ]),
      );
      assert.deepEqual(f, expected, key);
      for (const items of Object.values(f)) assert.equal(new Set(items).size, items.length);
    }
  }
});

test('repasos · SRS v2 (learning_review_candidates): mismo orden y unidades, sin ítems de U13/U14', async () => {
  for (const api of [OLD, NEW]) {
    const c = await reviewCand(users.srs, api);
    const now = reviewItems(c);
    const was = before7.review[api];
    assert.deepEqual(Object.keys(now), Object.keys(was), 'mismas unidades en el mismo orden');
    let removed = 0;
    for (const [k, v] of Object.entries(was)) {
      const keep = v.items.filter((i) => !u13Items.includes(i) && !u14Items.includes(i));
      removed += v.items.length - keep.length;
      assert.deepEqual(now[k], { items: keep, intro: v.intro }, k);
      assert.equal(new Set(now[k].items).size, now[k].items.length, `${k}: sin duplicados`);
    }
    assert.ok(removed > 0, 'había ítems de U13/U14 para la cuenta v1 antes de la C.7');
    // 'srs' también: los ítems de U13/U14 dejan de ser presentables, el resto igual.
    const known = await knownMap(users.srs, api, 'srs');
    for (const [i, k] of Object.entries(before7.knownSrs[api])) {
      assert.equal(known[i], u13Items.includes(i) || u14Items.includes(i) ? false : k, i);
    }
  }
});

test('repasos · un plan armado a mano con un ítem de U13 se rechaza (validación del servidor)', async () => {
  const user = users.v1new;
  // Hora real: learning_start_basic_review valida el vencimiento con now().
  const cand = await focus(user, NEW, new Date().toISOString());
  const good = buildBasicPlan({ ...cand, seed: 'c7' });
  assert.ok(good.items.length > 0);
  const ok = randomUUID();
  const started = await edge(NEW, () =>
    call('learning_start_basic_review', [
      user,
      ok,
      'en',
      TZ,
      j(good),
      j(reviewPresentationOrders(ok, good.items)),
    ]),
  );
  assert.ok(started.presentations.length > 0, 'control: el plan legítimo pasa');
  // Mismo plan, primer ítem reemplazado por uno de U13 cuyos conceptos son de palabras compartidas.
  const forgedItem = (
    await edge(NEW, () =>
      all(
        `select r.item_id, r.concept_id, r.dimension, r.rung, r.option_count from public.review_item_candidates('en') r
         where r.item_id = any ($1) and r.dimension = 'vocabulary' order by 1 limit 1`,
        [sharedOnly],
      ),
    )
  )[0];
  assert.ok(forgedItem, 'hay un ítem compartido de U13/U14 candidato');
  const forged = {
    ...good,
    items: [{ ...good.items[0], ...forgedItem, position: 1, reason: 'due' }],
  };
  const s = randomUUID();
  for (const api of [OLD, NEW]) {
    const err = await errorOf(
      edge(api, () =>
        call('learning_start_basic_review', [
          user,
          s,
          'en',
          TZ,
          j(forged),
          j(reviewPresentationOrders(s, forged.items)),
        ]),
      ),
    );
    assert.match(String(err?.message), /invalid_plan/);
  }
});

test('repasos · los helpers nuevos no los llama un cliente', async () => {
  for (const sql of [
    `select public.review_item_in_route('${users.v1new}', 'x')`,
    `select public.curriculum_unit_visible_for('${users.v1new}', 'a1-u13', 1::smallint)`,
    `select public.curriculum_unlocked_unit_ids('${users.v1new}', 'en')`,
    `select public.rush_player_unit_ids('${users.v1new}', 'en', 1::smallint)`,
    `select public.rush_common_unit_ids('en', array['${users.v1new}'::uuid], null)`,
    `select public.rush_fallback_unit_ids('en')`,
    `select public.rush_questions_in_units('en', 4, 100, array['a1-u13'])`,
    `select public.rush_questions_in_units('en', 4, array['a1-u13'])`,
    `select public.rush_questions('en', 4, 100)`,
  ]) {
    for (const role of ['authenticated', 'anon']) {
      const err = await errorOf(asClient(role, users.v1new, NEW, () => db.query(sql)));
      assert.match(String(err?.message), /permission denied/, `${role}: ${sql}`);
    }
  }
  assert.match(
    String(
      (
        await errorOf(
          asClient('anon', null, NEW, () => db.query(`select public.rush_my_unit_ids('en')`)),
        )
      ).message,
    ),
    /permission denied/,
  );
});

// =================================================================================================
// Mastery Display
// =================================================================================================

const unitIds = (m) => m.units.map((u) => u.unit_id);
const weakTexts = (m) => m.weak.map((w) => w.text);

test('mastery · v1 (cliente antiguo y C.5): sin U13/U14; unidades antiguas e históricos idénticos', async () => {
  await withDisplay(async () => {
    for (const [k, api] of [
      ['old', OLD],
      ['new', NEW],
    ]) {
      const m = await mastery(users.v1old, api);
      const was = before7.mastery[k];
      assert.equal(m.available, true);
      // U13/U14 sin publicar: antes tampoco salían en units; ahora todo igual salvo «débiles» de U13.
      assert.deepEqual(m.units, was.units, `${k}: units`);
      assert.deepEqual(m.dimensions, was.dimensions, `${k}: dimensiones`);
      assert.deepEqual(m.retention, was.retention);
      assert.deepEqual(m.speed, was.speed);
      assert.deepEqual(m.review, was.review);
      assert.ok(!unitIds(m).some((u) => NEW_UNITS.includes(u)));
      // El registro «histórico» de U13 sigue en la base y en los conteos, pero no se nombra.
      const u13Texts = (await all(`select text from public.words where unit_id = 'a1-u13'`)).map(
        (r) => r.text,
      );
      assert.ok(
        !weakTexts(m).some((t) => u13Texts.includes(t)),
        `${k}: sin palabras de U13 en débiles`,
      );
      assert.ok(m.weak.length > 0);
    }
  });
});

// =================================================================================================
// Ranked
// =================================================================================================

/** Palabras de unidades y etiquetas que pueden aparecer (enunciado u opción). */
async function shownTexts(units) {
  const rows = await all(
    `select text, translation_es from public.words where language_code = 'en' and is_published and unit_id = any ($1)`,
    [units],
  );
  return new Set(rows.flatMap((r) => [r.text, r.translation_es, rushLabel(r.translation_es)]));
}

async function questionUnits(questions) {
  const ids = [...new Set(questions.map((q) => q.wordId))];
  return [
    ...new Set(
      (await all(`select unit_id from public.words where id = any ($1)`, [ids])).map(
        (r) => r.unit_id,
      ),
    ),
  ].sort();
}

async function assertWithin(questions, units) {
  const ok = await shownTexts(units);
  for (const q of questions) {
    assert.ok(ok.has(q.prompt), `enunciado «${q.prompt}» fuera de ${units}`);
    for (const o of q.options) assert.ok(ok.has(o), `opción «${o}» fuera de ${units}`);
  }
  for (const u of await questionUnits(questions)) assert.ok(units.includes(u), `unidad ${u}`);
}

const join = (u, api) =>
  asClient(
    'authenticated',
    u,
    api,
    async () => (await one(`select public.join_human_queue() r`)).r,
  );
const leave = (u, api) =>
  asClient('authenticated', u, api, () => db.query(`select public.leave_human_queue()`));
const getMatch = (u, api, id) =>
  asClient(
    'authenticated',
    u,
    api,
    async () => (await one(`select public.get_human_match($1) r`, [id])).r,
  );

/** Empareja a a y b por la cola SQL; devuelve las preguntas que lee cada uno. */
async function pair([a, apiA], [b, apiB]) {
  assert.equal((await join(a, apiA)).status, 'waiting');
  const m = await join(b, apiB);
  assert.equal(m.status, 'matched');
  const qa = (await getMatch(a, apiA, m.battle_id)).questions;
  const qb = (await getMatch(b, apiB, m.battle_id)).questions;
  // Cierra la partida para que no queden en curso (sin tocar ELO: se cancela como la base).
  await db.query(
    `update public.battles set status = 'cancelled', ended_at = greatest(now(), started_at) where id = $1`,
    [m.battle_id],
  );
  await db.query(
    `update public.ranked_queue set active = false, battle_id = null where user_id in ($1, $2)`,
    [a, b],
  );
  return { qa, qb, id: m.battle_id };
}

const common = (players, apis) =>
  edge(
    null,
    async () =>
      (
        await one(`select public.rush_common_unit_ids('en', $1::uuid[], $2::smallint[]) r`, [
          players,
          apis,
        ])
      ).r,
  );

test('ranked · desbloqueo: curriculum_unlocked_unit_ids coincide con is_lesson_unlocked', async () => {
  for (const u of [users.fresh1, users.ahead1, users.v1old, users.srs]) {
    for (const lang of ['en', 'it']) {
      const a = (
        await all(`select public.curriculum_unlocked_unit_ids($1, $2) id order by 1`, [u, lang])
      ).map((r) => r.id);
      const b = (
        await all(
          `select distinct l.unit_id id from public.lessons l join public.curriculum_units cu on cu.id = l.unit_id
           where cu.language_code = $2 and public.is_lesson_unlocked($1, l.id) order by 1`,
          [u, lang],
        )
      ).map((r) => r.id);
      assert.deepEqual(a, b, `${u} ${lang}`);
    }
  }
});

test('ranked · dos v1: mismas preguntas y orden para ambos, sólo lo común y desbloqueado (U1)', async () => {
  const { qa, qb } = await pair([users.fresh1, NEW], [users.fresh2, OLD]);
  assert.equal(qa.length, 40);
  assert.deepEqual(qa, qb);
  await assertWithin(qa, ['a1-u01']);
  assert.deepEqual(await questionUnits(qa), ['a1-u01']);
});

test('ranked · progreso distinto: lo común (U1); mismo progreso: hasta U4', async () => {
  const mixed = await pair([users.ahead1, NEW], [users.fresh1, NEW]);
  assert.deepEqual(mixed.qa, mixed.qb);
  await assertWithin(mixed.qa, ['a1-u01']);
  const same = await pair([users.ahead1, NEW], [users.ahead2, OLD]);
  assert.deepEqual(same.qa, same.qb);
  const units = ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u04'];
  await assertWithin(same.qa, units);
  assert.ok((await questionUnits(same.qa)).length > 1, 'usa más que U1');
  assert.deepEqual(
    await common([users.ahead1, users.ahead2], [1, 0]),
    [
      ...units,
      ...(
        await all(
          `select id from public.curriculum_units where language_code = 'en' and level = 'A2' order by id`,
        )
      ).map((r) => r.id),
    ].sort(),
  );
});

test('ranked · contratos: ELO, matchmaking y liquidación no cambian; la cola guarda el nivel del cliente', async () => {
  const q = await all(
    `select user_id, curriculum_api from public.ranked_queue where user_id = any ($1) order by 1`,
    [[users.fresh1, users.fresh2]],
  );
  assert.deepEqual(Object.fromEntries(q.map((r) => [r.user_id, r.curriculum_api])), {
    [users.fresh1]: 1,
    [users.fresh2]: 0,
  });
  // Ningún rating ni historial se movió con las partidas de prueba (canceladas).
  const snap = await snapshot();
  assert.equal(snap.ratings, before7.snap.ratings);
  assert.equal(snap.ratingHistory, before7.snap.ratingHistory);
});

test('ranked · firmas viejas de rush_questions: nunca fuera de la ruta de respaldo', async () => {
  const fb = await edge(
    null,
    async () => (await one(`select public.rush_fallback_unit_ids('en') r`)).r,
  );
  assert.ok(!fb.some((u) => NEW_UNITS.includes(u)));
  assert.ok(fb.includes('a1-u12') && fb.includes('a2-u01'));
  const itAll = (
    await all(`select id from public.curriculum_units where language_code = 'it' order by id`)
  ).map((r) => r.id);
  assert.deepEqual(
    await edge(null, async () => (await one(`select public.rush_fallback_unit_ids('it') r`)).r),
    itAll,
  );
});

// ---------- v2 habilitada (sólo en esta base) ----------

test('v2 habilitada · repasos: la v2 con cliente compatible recibe U13/U14 publicadas; con cliente antiguo, no', async () => {
  await publish(NEW_UNITS);
  await enableV2();
  users.v2 = await signUp('vtwo@test.dev', NEW);
  users.v2b = await signUp('vtwob@test.dev', NEW);
  assert.equal(
    (
      await one(
        `select route_id from public.user_curriculum_routes where user_id = $1 and level = 'A1'`,
        [users.v2],
      )
    ).route_id,
    'en.a1.route.v2',
  );
  await knowAllWords(users.v2);
  const ok = await knownMap(users.v2, NEW, 'v1');
  // Presentable = lo de siempre (conoce sus palabras; antes de la C.7) y con un ejercicio publicado. Las
  // lecciones «-context» de U13/U14 siguen sin publicar: sus ítems tampoco entran para la v2.
  const published = new Set(
    (
      await all(
        `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
         where l.unit_id = any ($1) and e.is_published and l.is_published`,
        [NEW_UNITS],
      )
    ).map((r) => r.id),
  );
  const base = before7.known['v1old:null'];
  let shown = 0;
  for (const i of [...u13Items, ...u14Items]) {
    if (!(i in ok)) continue;
    assert.equal(ok[i], base[i] && published.has(i), `v2 nuevo ${i}`);
    if (ok[i]) shown++;
  }
  assert.ok(shown > 0, `la v2 recibe los ítems publicados de U13/U14 (${shown})`);
  assert.ok(
    sharedOnly.some((i) => ok[i] === true),
    'también los de conceptos compartidos',
  );
  assert.ok(u13Items.some((i) => ok[i]) && u14Items.some((i) => ok[i]));
  assert.ok(
    [...u13Items, ...u14Items].some((i) => i in ok && !published.has(i) && ok[i] === false),
  );
  const old = await knownMap(users.v2, OLD, 'v1');
  for (const i of [...u13Items, ...u14Items])
    if (i in old) assert.equal(old[i], false, `v2 antiguo ${i}`);
  // Unidades antiguas: iguales para todos los clientes.
  for (const i of Object.keys(ok)) if (oldItems.includes(i)) assert.equal(old[i], ok[i], i);
  // Las cuentas v1 siguen sin U13/U14 con la v2 habilitada y publicada.
  for (const u of [users.v1old, users.v1new]) {
    for (const api of [OLD, NEW]) {
      const k = await knownMap(u, api, 'v1');
      for (const i of [...u13Items, ...u14Items]) if (i in k) assert.equal(k[i], false);
    }
  }
  // Publicación: ejercicios de U13 sin publicar → sus ítems no; U14 sí.
  await db.query(
    `update public.exercises set is_published = false where lesson_id in (select id from public.lessons where unit_id = 'a1-u13')`,
  );
  let k = await knownMap(users.v2, NEW, 'v1');
  for (const i of u13Items) if (i in k) assert.equal(k[i], false, `U13 sin publicar ${i}`);
  for (const i of u14Items) if (i in k) assert.equal(k[i], ok[i]);
  await publish(['a1-u13']);
  // Unidad sin publicar (aunque sus ejercicios lo estén).
  await db.query(`update public.curriculum_units set is_published = false where id = 'a1-u14'`);
  k = await knownMap(users.v2, NEW, 'v1');
  for (const i of u14Items) if (i in k) assert.equal(k[i], false, `U14 sin publicar ${i}`);
  await publish(['a1-u14']);
  // Sin duplicados en candidatos de la v2.
  const f = focusItems(await focus(users.v2, NEW));
  for (const items of Object.values(f)) assert.equal(new Set(items).size, items.length);
  assert.ok(
    Object.values(f)
      .flat()
      .some((i) => u13Items.includes(i)),
  );
});

test('v2 habilitada · ranked: v2+v2 usan U13; v1+v2 y v2 con cliente antiguo, no; amistosos igual', async () => {
  for (const u of [users.v2, users.v2b]) await completeUnits(u, ['a1-u01', 'a1-u02', 'a1-u03']);
  const v2units = ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u13'];
  assert.deepEqual(
    (await common([users.v2, users.v2b], [1, 1])).filter((u) => u.startsWith('a1-')),
    v2units,
  );
  const both = await pair([users.v2, NEW], [users.v2b, NEW]);
  assert.deepEqual(both.qa, both.qb);
  await assertWithin(both.qa, v2units);
  assert.ok((await questionUnits(both.qa)).includes('a1-u13'), 'la v2 ve U13 desbloqueada');

  // v1 adelantado (U1–U4) + v2 (U1–U3, U13): lo común es U1–U3.
  const mixed = await pair([users.ahead1, NEW], [users.v2, NEW]);
  assert.deepEqual(mixed.qa, mixed.qb);
  await assertWithin(mixed.qa, ['a1-u01', 'a1-u02', 'a1-u03']);

  // v2 con cliente antiguo: su ruta visible es la v1 → sin U13.
  const oldClient = await pair([users.v2, OLD], [users.v2b, NEW]);
  assert.deepEqual(oldClient.qa, oldClient.qb);
  await assertWithin(oldClient.qa, ['a1-u01', 'a1-u02', 'a1-u03']);

  // Un cliente que falsifica la cabecera no cambia su ruta: v1 sigue sin U13/U14.
  assert.ok(!(await common([users.v1new], [999])).some((u) => NEW_UNITS.includes(u)));

  // Amistoso: anfitrión v2 (cliente nuevo), invitado v1 → nada de U13; anfitrión e invitado v2 → U13.
  const challenge = async ([host, apiH], [guest, apiG]) => {
    const c = await asClient(
      'authenticated',
      host,
      apiH,
      async () => (await one(`select public.create_friend_challenge() r`)).r,
    );
    const code = c.code ?? c;
    const m = await asClient(
      'authenticated',
      guest,
      apiG,
      async () => (await one(`select public.accept_friend_challenge($1) r`, [code])).r,
    );
    const qs = (await getMatch(host, apiH, m.battle_id)).questions;
    assert.deepEqual((await getMatch(guest, apiG, m.battle_id)).questions, qs);
    await db.query(
      `update public.battles set status = 'cancelled', ended_at = greatest(now(), started_at) where id = $1`,
      [m.battle_id],
    );
    return qs;
  };
  const f1 = await challenge([users.v2, NEW], [users.ahead1, NEW]);
  await assertWithin(f1, [
    'a1-u01',
    'a1-u02',
    'a1-u03',
    ...(
      await all(
        `select id from public.curriculum_units where level = 'A2' and language_code = 'en'`,
      )
    ).map((r) => r.id),
  ]);
  assert.ok(!(await questionUnits(f1)).some((u) => NEW_UNITS.includes(u)));
  const f2 = await challenge([users.v2, NEW], [users.v2b, NEW]);
  assert.ok(!(await questionUnits(f2)).includes('a1-u14'), 'U14 no está desbloqueada');
  const f3 = await challenge([users.v2, OLD], [users.v2b, NEW]);
  assert.ok(
    !(await questionUnits(f3)).some((u) => NEW_UNITS.includes(u)),
    'anfitrión con cliente antiguo',
  );
});

test('v2 habilitada · rush_my_unit_ids (partida contra bots del teléfono) respeta ruta, cliente y desbloqueos', async () => {
  const mine = (u, api) =>
    asClient('authenticated', u, api, async () =>
      (await all(`select public.rush_my_unit_ids('en') id`)).map((r) => r.id),
    );
  const a1 = (ids) => ids.filter((u) => u.startsWith('a1-'));
  assert.deepEqual(a1(await mine(users.v2, NEW)), ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u13']);
  assert.deepEqual(a1(await mine(users.v2, OLD)), ['a1-u01', 'a1-u02', 'a1-u03']);
  assert.deepEqual(a1(await mine(users.fresh1, NEW)), ['a1-u01']);
  // Coincide con lo que el cliente ya puede leer (nunca revela una unidad oculta).
  for (const [u, api] of [
    [users.v2, NEW],
    [users.v2, OLD],
    [users.v1new, NEW],
  ]) {
    const visible = await asClient('authenticated', u, api, async () =>
      (await all(`select public.curriculum_visible_unit_ids() id`)).map((r) => r.id),
    );
    for (const id of await mine(u, api)) assert.ok(visible.includes(id), id);
  }
});

test('v2 habilitada · mastery: v2 con cliente compatible ve U13/U14; con cliente antiguo y la v1, no', async () => {
  await engineState(users.v2, ['a1-u01', 'a1-u13', 'a1-u14']);
  await withDisplay(async () => {
    const v2new = await mastery(users.v2, NEW);
    const v2old = await mastery(users.v2, OLD);
    assert.ok(unitIds(v2new).includes('a1-u13') && unitIds(v2new).includes('a1-u14'));
    assert.ok(!unitIds(v2old).some((u) => NEW_UNITS.includes(u)));
    // Unidades antiguas idénticas; dimensiones y estados no cambian según el cliente.
    assert.deepEqual(
      v2new.units.filter((u) => !NEW_UNITS.includes(u.unit_id)),
      v2old.units,
    );
    assert.deepEqual(v2new.dimensions, v2old.dimensions);
    const exclusiveTexts = (
      await all(`select text from public.words where id = any ($1)`, [exclusiveWords])
    ).map((r) => r.text);
    assert.ok(!weakTexts(v2old).some((t) => exclusiveTexts.includes(t)));
    // Cuenta v2 cuyo único estado está en U13/U14: con cliente compatible ve sus débiles; con uno
    // antiguo, ninguno; los conteos por dimensión (el estado real) son los mismos.
    await engineState(users.v2b, NEW_UNITS);
    const onlyNew = await mastery(users.v2b, NEW);
    const onlyOld = await mastery(users.v2b, OLD);
    assert.ok(onlyNew.weak.length > 0);
    assert.ok(weakTexts(onlyNew).every((t) => exclusiveTexts.includes(t)));
    assert.deepEqual(onlyOld.weak, []);
    assert.deepEqual(onlyNew.dimensions, onlyOld.dimensions);
    assert.ok(onlyNew.dimensions.vocabulary.weak > 0);
    // La v1 sigue sin U13/U14 aunque estén publicadas, incluso falsificando la cabecera.
    for (const api of [OLD, NEW, 999]) {
      const m = await mastery(users.v1old, api);
      assert.ok(!unitIds(m).some((u) => NEW_UNITS.includes(u)), `v1 ${api}`);
      assert.ok(!weakTexts(m).some((t) => exclusiveTexts.includes(t)));
    }
    // Sin publicar: U14 desaparece también para la v2.
    await db.query(`update public.curriculum_units set is_published = false where id = 'a1-u14'`);
    assert.ok(!unitIds(await mastery(users.v2, NEW)).includes('a1-u14'));
    await publish(['a1-u14']);
    // Consulta directa: sólo authenticated y sólo los datos propios.
    assert.match(
      String(
        (await errorOf(asClient('anon', null, NEW, () => call('get_learning_mastery', ['en', TZ]))))
          .message,
      ),
      /permission denied/,
    );
  });
});

// =================================================================================================
// Regresión: italiano, portugués, chino e inglés A2
// =================================================================================================

test('regresión · it, pt, zh e inglés A2: repasos, Ranked y Mastery como antes', async () => {
  for (const lang of ['it', 'pt', 'zh']) {
    const units = (
      await all(`select id from public.curriculum_units where language_code = $1 order by id`, [
        lang,
      ])
    ).map((r) => r.id);
    for (const u of [users.fresh1, users.v2]) {
      for (const api of [OLD, NEW]) {
        // Ranked: todo, sin desbloqueos (como antes: decide words.is_published).
        assert.deepEqual(
          await edge(
            null,
            async () =>
              (
                await one(`select public.rush_common_unit_ids($1, $2::uuid[], $3::smallint[]) r`, [
                  lang,
                  [u],
                  [api ?? 0],
                ])
              ).r,
          ),
          units,
        );
        // Mastery: todas sus unidades publicadas visibles.
        const vis = await asClient('authenticated', u, api, async () =>
          (
            await all(
              `select id, public.curriculum_unit_visible(id) v from public.curriculum_units where language_code = $1`,
              [lang],
            )
          ).every((r) => r.v),
        );
        assert.ok(vis, lang);
      }
    }
    // Repasos: todo ítem activo del idioma sigue en ruta para cualquiera.
    const bad = await edge(OLD, () =>
      one(
        `select count(*)::int n from public.exercise_items i where i.language_code = $1 and i.status = 'active'
         and not public.review_item_in_route($2, i.id)`,
        [lang, users.v1old],
      ),
    );
    assert.equal(bad.n, 0, lang);
  }
  // Inglés A2: sin rutas → ítems y unidades como antes, sin depender del progreso.
  const a2 = (
    await all(
      `select id from public.curriculum_units where language_code = 'en' and level = 'A2' order by id`,
    )
  ).map((r) => r.id);
  const fresh = await common([users.fresh1], [0]);
  for (const u of a2) assert.ok(fresh.includes(u), u);
  const a2bad = await edge(OLD, () =>
    one(
      `select count(*)::int n from public.exercise_items i where i.language_code = 'en' and i.level = 'A2'
       and i.status = 'active' and not public.review_item_in_route($1, i.id)`,
      [users.v1old],
    ),
  );
  assert.equal(a2bad.n, 0);
  // Las preguntas viejas de it siguen saliendo con las firmas de siempre.
  const qs = await edge(
    null,
    async () => (await one(`select public.rush_questions('it', 12, 100) r`)).r,
  );
  assert.equal(qs.length, 12);
});
