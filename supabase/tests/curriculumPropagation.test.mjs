// Fase C.8 (docs/LEARNING_PHASE_C.md §C8): propagación del nivel curricular de punta a punta, en local.
//
//   Repasos: app (supabase-js con la cabecera global x-polygo-curriculum-api, functions.invoke) →
//            gateway emulado → index.ts REAL de learning-session cargado en Node (Deno.serve/Deno.env
//            emulados, ver tests/edge/runEdgeFunction.mjs) → supabase-js de la función → PostgREST
//            emulado (request.headers como PostgREST) → PGlite con TODAS las migraciones.
//   Ranked:  socket.io con `curriculumApi` en el handshake → servidor de partidas real (createBattleServer)
//            → createSupabaseStore real (rushUnits, loadWords) → PostgREST emulado → SQL
//            (rush_common_unit_ids). Perfiles, inicio y liquidación con el FakeStore (sin ELO real).
//   Bots:    lo que hace la app: words (RLS) + rush_my_unit_ids por PostgREST emulado con la cabecera, y
//            shared/wordRush.ts (rushUnitsFromRpc, localRushWords, generateQuestions).
//
// NO es Deno ni el Edge Runtime: es la misma función sobre Node (supabase-js del proyecto). La prueba en
// Deno real es supabase/tests/deno/learning-session.e2e.mjs (requiere DENO_BIN; no ejecutada en la C.8).
//
// En esta base desechable (nunca en el repo ni en producción) se activan los ítems de U13/U14, se
// publican U13/U14 y se habilita la ruta v2, DESPUÉS de crear las cuentas v1.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { createClient } from '@supabase/supabase-js';
import { io as connect } from 'socket.io-client';

import { createDb } from './harness.mjs';
import { rightAnswer, TZ } from './learningHelpers.mjs';
import { startEmulator } from './edge/postgrestEmulator.mjs';
import { loadEdgeFunction } from './edge/runEdgeFunction.mjs';
import {
  WORD_RUSH_PROTOCOL_VERSION as PROTOCOL_VERSION,
  WORD_RUSH,
} from '../../shared/protocol.ts';
import {
  generateQuestions,
  localRushWords,
  rushLabel,
  rushUnitsFromRpc,
} from '../../shared/wordRush.ts';
import { createBattleServer } from '../../server/src/server.ts';
import { createServiceClient, createSupabaseStore } from '../../server/src/supabaseStore.ts';
import { silentLogger } from '../../server/src/types.ts';
import { FakeStore, player, seededRandom } from '../../server/test/helpers.ts';

const SERVICE_KEY = 'service-key-local-c8';
const ANON_KEY = 'anon-key-local-c8';
const HEADER = 'x-polygo-curriculum-api';
const OLD = undefined; // build anterior: no manda la cabecera ni el campo del handshake
const NEW = 1; // CURRICULUM_API de esta build (src/lib/clientInfo.ts)
const NEW_UNITS = ['a1-u13', 'a1-u14'];
const CLIENT = { contract: 2, app_version: '0.1.0', platform: 'android' };
const FUNCTION = fileURLToPath(new URL('../functions/learning-session/index.ts', import.meta.url));

let db;
let emu;
const users = {};
let newItems; // ítems con ejercicios en U13/U14 (sólo allí)
let exclusiveWords; // words.unit_id en U13/U14
let sharedWords; // palabras de ejercicios de U13/U14 que pertenecen a otra unidad
let routesBefore;

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
/** Huella de las filas de esas cuentas (las que existían al empezar: la prueba crea otras después). */
const hashOf = async (table, owners) =>
  (
    await one(
      `select md5(coalesce(string_agg(t::text, '|' order by t::text), '')) h from public.${table} t
       where t.user_id = any ($1::uuid[])`,
      [owners],
    )
  ).h;
let initialUsers;

/** Alta como la hace la app (C.5): el nivel del cliente en raw_user_meta_data. */
async function signUp(email, api) {
  const meta = api == null ? null : { polygo_curriculum_api: api };
  const { id } = await one(
    `insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`,
    [email, meta],
  );
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

const routeOf = async (user) =>
  (
    await one(
      `select route_id from public.user_curriculum_routes where user_id = $1 and level = 'A1'`,
      [user],
    )
  )?.route_id ?? null;

/** Conoce todas las palabras del idioma (SRS v1: vistas y vencidas). Las de U13/U14, con más errores. */
const knowWords = (user, lang) =>
  db.query(
    `insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count, incorrect_count,
       last_result, last_reviewed_at, next_review_at)
     select $1, w.id, 1, 2, 1, case when w.unit_id = any ($3) then 9 else 1 end, false,
            now() - interval '2 days', now() - interval '1 hour'
     from public.words w where w.language_code = $2
     on conflict (user_id, word_id) do nothing`,
    [user, lang, NEW_UNITS],
  );

/** Vuelve a dejar todo vencido (como la e2e de Deno) para poder repasar otra vez. */
async function makeDue(user) {
  await db.query(
    `update public.user_word_progress set next_review_at = now() - interval '1 hour',
       last_reviewed_at = now() - interval '2 days' where user_id = $1`,
    [user],
  );
  await db.query(
    `update public.learning_sessions set local_date = local_date - 1 where user_id = $1`,
    [user],
  );
}

const completeUnits = (user, units) =>
  db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy,
       first_completed_at, last_completed_at)
     select $1, l.id, 1, 1, 1, now(), now() from public.lessons l
     where l.unit_id = any ($2) and l.is_published
     on conflict (user_id, lesson_id) do nothing`,
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

/** Cliente Supabase como el de la app (src/lib/supabase.ts: cabecera global de clientInfo.ts). */
const appClient = (user, api) =>
  createClient(emu.url, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer user-${user}`,
        ...(api === OLD ? {} : { [HEADER]: String(api) }),
      },
    },
  });

async function invoke(user, api, body) {
  const { data, error } = await appClient(user, api).functions.invoke('learning-session', {
    body: { ...body, client: CLIENT },
  });
  if (!error) return { status: 200, data };
  const ctx = error.context;
  const payload = ctx?.json ? await ctx.json().catch(() => null) : null;
  return { status: ctx?.status ?? 0, error: payload?.error ?? error.message };
}

const snapshots = async (user, sid) =>
  (await one(`select public.learning_session_presentations($1, $2) r`, [user, sid])).r;
const planItems = async (sid) =>
  (
    await all(
      `select x ->> 'item_id' id from public.srs_session_plans p cross join lateral jsonb_array_elements(p.items) x
       where p.session_id = $1`,
      [sid],
    )
  ).map((r) => r.id);
const toAttempt = (s) => ({
  presentation_id: s.presentation_id,
  answer: rightAnswer(s),
  client_verdict: 'correct',
  response_ms: 1500,
  assists: {},
});
/** Ítems de los candidatos que la función recibió de learning_focus_candidates. */
const candidateItems = (calls) => {
  const c = calls.find((x) => x.fn === 'learning_focus_candidates');
  assert.ok(c, 'la función pidió candidatos');
  assert.equal(c.status, 200, JSON.stringify(c.body));
  return new Set((c.body.words ?? []).flatMap((w) => (w.items ?? []).map((i) => i.item_id)));
};

/**
 * Un repaso completo por la Edge Function: start_review, answer_review de cada presentación y
 * submit_review. `api` = cabecera de la app en start; `answerApi` = la de answer/submit.
 */
async function reviewFlow(user, api, opts = {}) {
  const { lang = 'en', onlyDue = null } = opts;
  // 'answerApi' presente aunque sea undefined (= cliente sin cabecera): no cae al nivel de start.
  const answerApi = 'answerApi' in opts ? opts.answerApi : api;
  await makeDue(user);
  if (onlyDue)
    await db.query(
      `update public.user_word_progress set next_review_at = now() + interval '1 day'
       where user_id = $1 and word_id <> all ($2)`,
      [user, onlyDue],
    );
  const sid = randomUUID();
  const mark = emu.calls.length;
  const st = await invoke(user, api, {
    action: 'start_review',
    session_id: sid,
    language_code: lang,
    time_zone: TZ,
  });
  assert.equal(st.status, 200, JSON.stringify(st));
  const startCalls = emu.calls.slice(mark);
  const snaps = await snapshots(user, sid);
  assert.ok(snaps.length > 0, `hay presentaciones (${JSON.stringify(st.data?.status)})`);
  const markAnswer = emu.calls.length;
  for (const s of snaps) {
    const r = await invoke(user, answerApi, {
      action: 'answer_review',
      session_id: sid,
      attempt: { ...toAttempt(s), attempt_no: 1 },
    });
    assert.equal(r.status, 200, JSON.stringify(r));
    // En inglés, la respuesta correcta del helper es válida. En it/pt/zh el helper no arma todas las
    // respuestas por tokens (zh): basta con que el servidor la registre y la corrija.
    if (lang === 'en') assert.equal(r.data.status, 'valid', JSON.stringify(r.data).slice(0, 300));
    else assert.ok(['valid', 'invalid_response'].includes(r.data.status), JSON.stringify(r.data));
  }
  const sub = await invoke(user, answerApi, {
    action: 'submit_review',
    session_id: sid,
    started_at: new Date(Date.now() - 60_000).toISOString(),
    time_zone: TZ,
    attempts: snaps.map(toAttempt),
  });
  assert.equal(sub.status, 200, JSON.stringify(sub));
  const closed = await one(`select count(*)::int n from public.learning_sessions where id = $1`, [
    sid,
  ]);
  assert.equal(closed.n, 1, 'la sesión quedó registrada');
  return {
    sid,
    items: await planItems(sid),
    candidates: candidateItems(startCalls),
    startCalls,
    answerCalls: emu.calls.slice(markAnswer),
  };
}

/** Qué nivel recibió cada consulta de la función (lo que lee request_curriculum_api()). */
function assertForwarded(calls, expected) {
  assert.ok(calls.length > 0);
  for (const c of calls) {
    assert.equal(c.role, 'service_role', c.fn);
    assert.equal(c.headers[HEADER], expected, `${c.fn} recibió ${c.headers[HEADER]}`);
  }
}

const isNew = (item) => newItems.has(item);

/**
 * Repaso de la v2 con sólo las palabras compartidas con U13/U14 vencidas; cada palabra elige uno de sus
 * ítems con la semilla de la sesión, así que se prueba con otra sesión si ninguna eligió uno de U13/U14.
 */
async function v2PlanWithNewItem(api, ...rest) {
  const answerApi = rest.length > 0 ? rest[0] : api; // OLD (undefined) explícito = sin cabecera
  const shared = sharedWords.map((w) => w.id);
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await reviewFlow(users.v2, api, { answerApi, onlyDue: shared });
    if (r.items.some(isNew)) return r;
  }
  assert.fail('ningún plan de la v2 tomó un ítem de U13/U14');
}

before(async () => {
  db = await createDb();
  emu = await startEmulator(db, { serviceKey: SERVICE_KEY, anonKey: ANON_KEY });
  emu.functions['learning-session'] = await loadEdgeFunction(FUNCTION, {
    SUPABASE_URL: emu.url,
    SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
    SUPABASE_ANON_KEY: ANON_KEY,
  });

  // Cuentas v1, antes de habilitar la v2 (también el alta desde un cliente nuevo recibe la v1).
  users.v1old = await signUp('v1old@c8.dev', OLD);
  users.v1new = await signUp('v1new@c8.dev', NEW);
  users.v1ahead = await signUp('v1ahead@c8.dev', NEW);
  await completeUnits(users.v1ahead, ['a1-u01', 'a1-u02', 'a1-u03']);

  // Sólo en esta base: ítems de U13/U14 activos, U13/U14 publicadas y la v2 habilitada.
  newItems = new Set(
    (
      await all(
        `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
         where l.unit_id = any ($1)`,
        [NEW_UNITS],
      )
    ).map((r) => r.id),
  );
  await db.query(`update public.exercise_items set status = 'active' where id = any ($1)`, [
    [...newItems],
  ]);
  await publish(NEW_UNITS);
  await db.exec(`set role service_role`);
  await db.query(`select public.curriculum_enable_route('en.a1.route.v2')`);
  await db.exec(`reset role`);

  users.v2 = await signUp('vtwo@c8.dev', NEW);
  users.v2b = await signUp('vtwob@c8.dev', NEW);
  users.v2fresh = await signUp('vtwofresh@c8.dev', NEW);
  for (const u of [users.v2, users.v2b]) await completeUnits(u, ['a1-u01', 'a1-u02', 'a1-u03']);
  for (const u of [users.v1old, users.v1new, users.v2]) await knowWords(u, 'en');

  exclusiveWords = new Set(
    (await all(`select id from public.words where unit_id = any ($1)`, [NEW_UNITS])).map(
      (r) => r.id,
    ),
  );
  sharedWords = await all(
    `select distinct w.id, w.unit_id from public.exercise_words ew
     join public.exercises e on e.id = ew.exercise_id join public.lessons l on l.id = e.lesson_id
     join public.words w on w.id = ew.word_id
     where l.unit_id = any ($1) and w.unit_id <> all ($1)`,
    [NEW_UNITS],
  );
  initialUsers = Object.values(users);
  routesBefore = await hashOf('user_curriculum_routes', initialUsers);
});

after(async () => {
  await emu?.close();
});

test('preparación: rutas persistentes (v1 antes de habilitar la v2, v2 después) y contenido de U13/U14', async () => {
  assert.equal(await routeOf(users.v1old), 'en.a1.route.v1');
  assert.equal(await routeOf(users.v1new), 'en.a1.route.v1');
  assert.equal(await routeOf(users.v2), 'en.a1.route.v2');
  assert.ok(newItems.size > 0 && exclusiveWords.size > 0 && sharedWords.length > 0);
});

// =================================================================================================
// Repasos por la Edge Function
// =================================================================================================

test('repasos · cuenta v1 con cliente antiguo: start/answer/submit; todas las consultas con nivel 0; sin U13/U14', async () => {
  const r = await reviewFlow(users.v1old, OLD);
  assertForwarded(r.startCalls, '0');
  assertForwarded(r.answerCalls, '0');
  assert.ok(![...r.candidates].some(isNew), 'candidatos sin U13/U14');
  assert.ok(!r.items.some(isNew), 'plan sin U13/U14');
});

test('repasos · cuenta v1 con cliente nuevo: el nivel 1 viaja a todas las consultas; la ruta sigue siendo la v1', async () => {
  const r = await reviewFlow(users.v1new, NEW);
  assertForwarded(r.startCalls, '1');
  assertForwarded(r.answerCalls, '1');
  assert.ok(![...r.candidates].some(isNew));
  assert.ok(!r.items.some(isNew));
});

test('repasos · cuenta v2 con cliente compatible: recibe ítems de su recorrido (U13/U14) en candidatos y plan', async () => {
  const r = await reviewFlow(users.v2, NEW);
  assertForwarded(r.startCalls, '1');
  assertForwarded(r.answerCalls, '1');
  assert.ok([...r.candidates].some(isNew), 'candidatos con U13/U14');
  // El plan básico toma 10 palabras por prioridad (errores, vencimiento): para ver un ítem de U13/U14 en
  // la sesión se dejan vencidas sólo las palabras compartidas con U13/U14 (todo lo demás, sin cambios).
  const planned = await v2PlanWithNewItem(NEW);
  assertForwarded(planned.startCalls, '1');
  assertForwarded(planned.answerCalls, '1');
  // Sólo ítems con ejercicio publicado (las lecciones -context siguen sin publicar).
  const unpublished = (
    await all(
      `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
       where l.unit_id = any ($1) and not exists (
         select 1 from public.exercises e2 join public.lessons l2 on l2.id = e2.lesson_id
         where e2.item_id = e.item_id and e2.is_published and l2.is_published)`,
      [NEW_UNITS],
    )
  ).map((x) => x.id);
  for (const i of unpublished) assert.ok(!r.candidates.has(i), `sin publicar: ${i}`);
});

test('repasos · cuenta v2 con cliente antiguo: nivel 0 → ve la v1, sin U13/U14', async () => {
  const r = await reviewFlow(users.v2, OLD);
  assertForwarded(r.startCalls, '0');
  assert.ok(![...r.candidates].some(isNew));
  assert.ok(!r.items.some(isNew));
});

test('repasos · sin bypass: cabecera falsificada (999) en v1 no da U13/U14; basura se reenvía como 0', async () => {
  const forged = await reviewFlow(users.v1new, 999);
  assertForwarded(forged.startCalls, '999');
  assert.ok(![...forged.candidates].some(isNew));
  assert.ok(!forged.items.some(isNew));
  const junk = await reviewFlow(users.v1old, 'abc');
  assertForwarded(junk.startCalls, '0');
  assert.ok(!junk.items.some(isNew));
});

test('repasos · la sesión conserva su contenido: v2 empieza con nivel 1 y responde/cierra desde un cliente sin cabecera', async () => {
  const r = await v2PlanWithNewItem(NEW, OLD);
  assertForwarded(r.answerCalls, '0');
  // answer/submit no vuelven a elegir candidatos: corrigen las presentaciones registradas en start.
  assert.ok(
    !r.answerCalls.some((c) => /candidates|start_/.test(c.fn)),
    r.answerCalls.map((c) => c.fn).join(','),
  );
});

test('repasos · regresión: it, pt y zh con cliente antiguo y nuevo funcionan igual', async () => {
  for (const lang of ['it', 'pt', 'zh']) {
    const u = await signUp(`rev-${lang}@c8.dev`, NEW);
    await knowWords(u, lang);
    const a = await reviewFlow(u, OLD, { lang });
    const b = await reviewFlow(u, NEW, { lang });
    assert.ok(a.items.length > 0 && b.items.length > 0, lang);
    assert.ok(![...a.candidates, ...b.candidates].some(isNew));
  }
});

test('repasos · inglés A2 sigue entrando para v1 y v2 con cualquier cliente', async () => {
  const a2Items = new Set(
    (
      await all(
        `select distinct e.item_id id from public.exercises e join public.lessons l on l.id = e.lesson_id
         join public.curriculum_units u on u.id = l.unit_id where u.language_code = 'en' and u.level = 'A2'`,
      )
    ).map((r) => r.id),
  );
  for (const [u, api] of [
    [users.v1old, OLD],
    [users.v2, NEW],
    [users.v2, OLD],
  ]) {
    await makeDue(u);
    const sid = randomUUID();
    const mark = emu.calls.length;
    const st = await invoke(u, api, {
      action: 'start_review',
      session_id: sid,
      language_code: 'en',
      time_zone: TZ,
    });
    assert.equal(st.status, 200);
    assert.ok(
      [...candidateItems(emu.calls.slice(mark))].some((i) => a2Items.has(i)),
      'A2 presente',
    );
  }
});

// =================================================================================================
// Ranked por el servidor de partidas (store real contra SQL)
// =================================================================================================

const RULES = {
  ...WORD_RUSH,
  questionCount: 10,
  countdownMs: 20,
  durationMs: 10_000,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};
let battle;
let battleUrl;
const sockets = [];

async function startBattleServer() {
  const real = createSupabaseStore(createServiceClient(emu.url, SERVICE_KEY));
  const store = new FakeStore();
  for (const id of Object.values(users)) store.add(player(id, 100));
  // Lo curricular, de la base: vocabulario publicado y unidades comunes (rush_common_unit_ids).
  store.loadWords = (lang) => real.loadWords(lang);
  store.rushUnits = (lang, players) => real.rushUnits(lang, players);
  battle = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    tickMs: 20,
    random: seededRandom(5),
    botAfterMs: null,
    wordCacheMs: 0,
  });
  await new Promise((resolve) => battle.http.listen(0, resolve));
  battleUrl = `http://127.0.0.1:${battle.http.address().port}`;
}

function socketFor(user, api) {
  const auth = { token: `tok-${user}`, protocolVersion: PROTOCOL_VERSION };
  if (api !== OLD) auth.curriculumApi = api;
  const s = connect(battleUrl, {
    transports: ['websocket'],
    auth,
    reconnection: false,
    forceNew: true,
  });
  sockets.push(s);
  return s;
}
const nextEvent = (s, event, ms = 4_000) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${event}`)), ms);
    s.once(event, (p) => {
      clearTimeout(t);
      resolve(p);
    });
  });

async function playAll(s, battleId, first) {
  const seen = [];
  let q = await first;
  for (;;) {
    seen.push({ index: q.index, kind: q.kind, prompt: q.prompt, options: q.options });
    const nq = q.index + 1 < RULES.questionCount ? nextEvent(s, 'battle:question') : null;
    const res = await s.emitWithAck('battle:answer', {
      battleId,
      questionIndex: q.index,
      ...(q.kind === 'write' ? { text: 'x' } : { option: 0 }),
    });
    assert.equal(res.ok, true);
    if (!nq) return seen;
    q = await nq;
  }
}

/** Partida ranked real por sockets: lo que vio cada uno y el conjunto que pidió el servidor. */
async function ranked([a, apiA], [b, apiB]) {
  const ca = socketFor(a, apiA);
  const cb = socketFor(b, apiB);
  await Promise.all([nextEvent(ca, 'connect'), nextEvent(cb, 'connect')]);
  const fa = nextEvent(ca, 'match:found');
  const fb = nextEvent(cb, 'match:found');
  const mark = emu.calls.length;
  assert.equal((await ca.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  assert.equal((await cb.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  const found = await fa;
  await fb;
  const qa = nextEvent(ca, 'battle:question');
  const qb = nextEvent(cb, 'battle:question');
  const ea = nextEvent(ca, 'battle:finish', 10_000);
  const eb = nextEvent(cb, 'battle:finish', 10_000);
  await ca.emitWithAck('match:ready', { battleId: found.battleId });
  await cb.emitWithAck('match:ready', { battleId: found.battleId });
  const [seenA, seenB] = await Promise.all([
    playAll(ca, found.battleId, qa),
    playAll(cb, found.battleId, qb),
  ]);
  await Promise.all([ea, eb]);
  ca.disconnect();
  cb.disconnect();
  const call = emu.calls.slice(mark).find((c) => c.fn === 'rush_common_unit_ids');
  assert.ok(call, 'el servidor pidió el conjunto común a la base');
  return { seenA, seenB, call };
}

/** Lo común según SQL, directo (sin el servidor), para comparar. */
const commonUnits = async (players, apis) =>
  (
    await one(`select public.rush_common_unit_ids('en', $1::uuid[], $2::smallint[]) r`, [
      players,
      apis,
    ])
  ).r;

/** Textos que puede mostrar una partida con esas unidades (palabra, traducción y emoji). */
async function shownTexts(units) {
  const rows = await all(
    `select text, translation_es, emoji from public.words
     where language_code = 'en' and is_published and unit_id = any ($1)`,
    [units],
  );
  return new Set(
    rows.flatMap((w) => [w.text, rushLabel(w.translation_es), w.emoji].filter(Boolean)),
  );
}
const unitsOfTexts = async (texts) =>
  (
    await all(
      `select distinct unit_id from public.words where language_code = 'en' and is_published
       and (text = any ($1) or translation_es = any ($1))`,
      [texts],
    )
  ).map((r) => r.unit_id);

async function assertDeck({ seenA, seenB, call }, expectedApis, units) {
  assert.deepEqual(seenA, seenB, 'mismas preguntas y orden para ambos');
  assert.equal(seenA.length, RULES.questionCount);
  assert.deepEqual(call.args.p_apis, expectedApis);
  assert.deepEqual(call.body, units, 'el servidor usa exactamente el conjunto de la base');
  const ok = await shownTexts(units);
  for (const t of seenA.flatMap((q) => [q.prompt, ...q.options]))
    assert.ok(ok.has(t) || t === 'x', `«${t}» fuera de lo común`);
}

test('ranked · dos v1 con cliente antiguo (protocolo anterior): nivel 0, lo común, mismas preguntas', async () => {
  await startBattleServer();
  const units = await commonUnits([users.v1old, users.v1new], [0, 0]);
  assert.ok(!units.some((u) => NEW_UNITS.includes(u)));
  await assertDeck(await ranked([users.v1old, OLD], [users.v1new, OLD]), [0, 0], units);
});

test('ranked · dos v2 con cliente compatible: U13 (desbloqueada por ambos) entra; U14 (bloqueada) no', async () => {
  const units = await commonUnits([users.v2, users.v2b], [1, 1]);
  assert.ok(units.includes('a1-u13') && !units.includes('a1-u14'));
  const r = await ranked([users.v2, NEW], [users.v2b, NEW]);
  await assertDeck(r, [1, 1], units);
  const shown = await unitsOfTexts(r.seenA.flatMap((q) => [q.prompt, ...q.options]));
  assert.ok(shown.includes('a1-u13'), `aparece vocabulario de U13 (${shown.join(', ')})`);
});

test('ranked · un cliente antiguo y otro nuevo (ambos v2): sin U13/U14', async () => {
  const units = await commonUnits([users.v2, users.v2b], [1, 0]);
  assert.ok(!units.some((u) => NEW_UNITS.includes(u)));
  await assertDeck(await ranked([users.v2, NEW], [users.v2b, OLD]), [1, 0], units);
});

test('ranked · rutas distintas (v1 adelantado + v2, clientes nuevos): lo común U1–U3, sin U13', async () => {
  const units = await commonUnits([users.v1ahead, users.v2], [1, 1]);
  assert.deepEqual(
    units.filter((u) => u.startsWith('a1-')),
    ['a1-u01', 'a1-u02', 'a1-u03'],
  );
  await assertDeck(await ranked([users.v1ahead, NEW], [users.v2, NEW]), [1, 1], units);
});

test('ranked · progreso distinto (v2 con U1–U3 + v2 nuevo): sólo U1', async () => {
  const units = await commonUnits([users.v2, users.v2fresh], [1, 1]);
  assert.deepEqual(
    units.filter((u) => u.startsWith('a1-')),
    ['a1-u01'],
  );
  await assertDeck(await ranked([users.v2, NEW], [users.v2fresh, NEW]), [1, 1], units);
});

test('ranked · un nivel declarado no cambia la ruta ni desbloquea: v1 con 999 = v1 con 0', async () => {
  const forged = await commonUnits([users.v1new, users.v1ahead], [999, 999]);
  assert.deepEqual(forged, await commonUnits([users.v1new, users.v1ahead], [0, 0]));
  await assertDeck(await ranked([users.v1new, 999], [users.v1ahead, 999]), [999, 999], forged);
  assert.equal(
    await hashOf('user_curriculum_routes', initialUsers),
    routesBefore,
    'rutas persistentes intactas',
  );
});

test('ranked · regresión: it, pt y zh sin rutas usan todas sus unidades con cualquier nivel', async () => {
  for (const lang of ['it', 'pt', 'zh']) {
    const all0 = (
      await one(`select public.rush_common_unit_ids($1, $2::uuid[], $3::smallint[]) r`, [
        lang,
        [users.v1old, users.v2],
        [0, 1],
      ])
    ).r;
    const units = (
      await all(`select id from public.curriculum_units where language_code = $1 order by id`, [
        lang,
      ])
    ).map((r) => r.id);
    assert.deepEqual(all0, units, lang);
  }
  for (const s of sockets) s.disconnect();
  await battle.close();
});

// =================================================================================================
// Partida contra bots armada en el teléfono
// =================================================================================================

/** Lo que hace useLocalBattleSession: words (RLS) + rush_my_unit_ids, con la cabecera de la build. */
async function botWords(user, api, lang = 'en') {
  const sb = appClient(user, api);
  const { data: rows, error } = await sb.from('words').select('*').eq('language_code', lang);
  assert.equal(error, null, JSON.stringify(error));
  const { data, error: rpcError } = await sb.rpc('rush_my_unit_ids', { p_language_code: lang });
  return localRushWords(rows, rushUnitsFromRpc(data, rpcError));
}
const ids = (words) => new Set(words.map((w) => w.id));
const unitsIn = (words) => [...new Set(words.map((w) => w.unitId))].sort();

test('bots · cuenta v1 (cliente antiguo y nuevo): nunca palabras exclusivas de U13/U14; sólo U1 desbloqueada', async () => {
  for (const api of [OLD, NEW, 999]) {
    const words = await botWords(users.v1new, api);
    assert.ok(![...ids(words)].some((w) => exclusiveWords.has(w)), `api ${api}`);
    assert.deepEqual(
      unitsIn(words).filter((u) => u.startsWith('a1-')),
      ['a1-u01'],
    );
    const shown = generateQuestions(words, 40, seededRandom(2)).flatMap((q) => [
      q.prompt,
      ...q.options,
    ]);
    const exclusiveTexts = (
      await all(`select text from public.words where id = any ($1)`, [[...exclusiveWords]])
    ).map((r) => r.text);
    for (const t of exclusiveTexts) assert.ok(!shown.includes(t), t);
  }
});

test('bots · cuenta v2 con cliente compatible: U13 publicada y desbloqueada entra; U14 bloqueada no', async () => {
  const words = await botWords(users.v2, NEW);
  const a1 = unitsIn(words).filter((u) => u.startsWith('a1-'));
  assert.deepEqual(a1, ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u13']);
  assert.ok(words.some((w) => w.unitId === 'a1-u13' && exclusiveWords.has(w.id)));
  // Con una build antigua, la misma cuenta ve la v1.
  const old = await botWords(users.v2, OLD);
  assert.deepEqual(
    unitsIn(old).filter((u) => u.startsWith('a1-')),
    ['a1-u01', 'a1-u02', 'a1-u03'],
  );
});

test('bots · unidad bloqueada: v2 sin progreso sólo U1 (U13 bloqueada)', async () => {
  const words = await botWords(users.v2fresh, NEW);
  assert.deepEqual(
    unitsIn(words).filter((u) => u.startsWith('a1-')),
    ['a1-u01'],
  );
});

test('bots · unidad no publicada: U13 despublicada desaparece aunque esté desbloqueada', async () => {
  await db.query(`update public.curriculum_units set is_published = false where id = 'a1-u13'`);
  try {
    const words = await botWords(users.v2, NEW);
    assert.ok(!words.some((w) => w.unitId === 'a1-u13'));
  } finally {
    await db.query(`update public.curriculum_units set is_published = true where id = 'a1-u13'`);
  }
  const back = await botWords(users.v2, NEW);
  assert.ok(
    back.some((w) => w.unitId === 'a1-u13'),
    'publicada otra vez: vuelve',
  );
});

test('bots · palabras compartidas con U13/U14: siguen a su propia unidad (v1 las ve si la desbloqueó)', async () => {
  const v1 = ids(await botWords(users.v1ahead, NEW)); // U1–U4 desbloqueadas
  const unlocked = new Set(['a1-u01', 'a1-u02', 'a1-u03', 'a1-u04']);
  let seen = 0;
  for (const w of sharedWords) {
    const published = (await one(`select is_published p from public.words where id = $1`, [w.id]))
      .p;
    if (!published) continue;
    if (unlocked.has(w.unit_id)) {
      assert.ok(v1.has(w.id), `compartida ${w.id} (${w.unit_id})`);
      seen++;
    } else if (w.unit_id.startsWith('a1-')) {
      assert.ok(!v1.has(w.id), `compartida bloqueada ${w.id} (${w.unit_id})`);
    }
  }
  assert.ok(seen > 0, 'hay compartidas de unidades desbloqueadas');
});

test('bots · regresión: it, pt, zh e inglés A2 idénticos con cliente antiguo y nuevo', async () => {
  for (const lang of ['it', 'pt', 'zh']) {
    const a = await botWords(users.v1old, OLD, lang);
    const b = await botWords(users.v2, NEW, lang);
    assert.deepEqual(ids(a), ids(b), lang);
    const published = await one(
      `select count(*)::int n from public.words where language_code = $1 and is_published`,
      [lang],
    );
    assert.equal(a.length, published.n, `${lang}: todo el vocabulario publicado`);
  }
  const a2 = (w) => w.filter((x) => x.level === 'A2');
  assert.deepEqual(
    ids(a2(await botWords(users.v1old, OLD))),
    ids(a2(await botWords(users.v2, NEW))),
  );
  assert.ok(a2(await botWords(users.v1old, OLD)).length > 0);
});

test('regresión · las declaraciones de nivel no tocaron las rutas persistentes', async () => {
  assert.equal(await hashOf('user_curriculum_routes', initialUsers), routesBefore);
  assert.equal(await routeOf(users.v1new), 'en.a1.route.v1');
  assert.equal(await routeOf(users.v2), 'en.a1.route.v2');
});
