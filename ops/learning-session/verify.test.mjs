// Verificación del despliegue aislado de learning-session v4 (docs/LEARNING_INSTANT_REVIEW.md).
//
//   node --import tsx --test ops/learning-session/verify.test.mjs
//
// Ejecuta la función REAL de producción (v3, respaldo byte a byte) y la candidata (v4) en Node, con Deno
// y supabase-js simulados, y comprueba:
//   1. integridad del respaldo (SHA-256) y builds reproducibles (fuente → paquete, byte a byte);
//   2. que la v4 sólo agrega grading_key a start_review: mismas respuestas, mismas RPC, misma
//      autenticación, sin C.7 (cabecera curricular) ni O-1 (manejo de configuración);
//   3. que la corrección del servidor es idéntica en v3 y v4 (lecciones y repasos, miles de respuestas);
//   4. que la app, con la clave, da el mismo veredicto que el servidor v4 (y que con las reglas de
//      Aprender no lo daría: por eso la clave lleva la versión del corrector).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it, before } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const TMP = mkdtempSync(join(tmpdir(), 'ls-verify-'));
const FILES = ['index.ts', 'core.generated.js', 'planner.generated.js', 'focus.generated.js'];

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sums = (dir) =>
  Object.fromEntries(
    readFileSync(join(HERE, dir, 'SHA256SUMS'), 'utf8')
      .trim()
      .split('\n')
      .map((l) => l.trim().split(/\s+\*?/))
      .map(([h, f]) => [f.replace(/^\*/, ''), h]),
  );

// ------------------------------------------------------------------------------------------------
// La función en Node: Deno.serve / Deno.env simulados, supabase-js reemplazado por un doble.

const db = { calls: [], clients: [], rpc: {}, users: { 'token-ok': 'user-1' } };

const SUPABASE_MOCK = `
export function createClient(url, key, options) {
  const db = globalThis.__db;
  if (!url) throw new Error('supabaseUrl is required.');
  db.clients.push({ url, key, options: JSON.parse(JSON.stringify(options ?? null)) });
  return {
    auth: {
      getUser: async (token) => {
        const id = db.users[token];
        return id ? { data: { user: { id } }, error: null } : { data: { user: null }, error: { message: 'invalid' } };
      },
    },
    rpc: async (name, args) => {
      db.calls.push([name, JSON.parse(JSON.stringify(args))]);
      const handler = db.rpc[name];
      return handler ? handler(args) : { data: null, error: { message: 'not_mocked:' + name } };
    },
  };
}`;

async function loadFunction(version) {
  const out = join(TMP, `${version}.mjs`);
  await esbuild.build({
    entryPoints: [join(HERE, version, 'index.ts')],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    outfile: out,
    logLevel: 'silent',
    plugins: [
      {
        name: 'supabase-mock',
        setup(b) {
          b.onResolve({ filter: /^npm:@supabase\/supabase-js/ }, () => ({
            path: 'supabase',
            namespace: 'mock',
          }));
          b.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({
            contents: SUPABASE_MOCK,
            loader: 'js',
          }));
        },
      },
    ],
  });
  let handler;
  globalThis.Deno = {
    serve: (h) => {
      handler = h;
    },
    env: { get: (k) => globalThis.__env[k] },
  };
  await import(pathToFileURL(out).href + `?v=${version}`);
  return handler;
}

const ENV = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'service' };

/** Llama a la función y devuelve lo observable: respuesta, RPC llamadas y clientes creados. */
async function call(
  handler,
  body,
  { token = 'token-ok', headers = {}, env = ENV, method = 'POST' } = {},
) {
  globalThis.__db = db;
  globalThis.__env = env;
  db.calls = [];
  db.clients = [];
  const req = new Request('https://fn.local/learning-session', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
  let res;
  let thrown = null;
  try {
    res = await handler(req);
  } catch (e) {
    thrown = String(e?.message ?? e);
  }
  return {
    thrown,
    status: res?.status ?? null,
    headers: res ? Object.fromEntries(res.headers) : null,
    body: res
      ? await res
          .text()
          .then((t) => (t ? JSON.parse(t) : null))
          .catch(() => null)
      : null,
    calls: db.calls,
    clients: db.clients,
  };
}

// ------------------------------------------------------------------------------------------------
// Datos: presentaciones de un repaso del servidor (exercise_id null) con sus fotografías.

const SESSION = '11111111-1111-4111-8111-111111111111';
let gradingSpecFor;
let client; // shared/learningSession.ts de la app (con tsx)
let answersApp;
let v3core;
let v4core;

function snapshot(id, over) {
  return {
    presentation_id: id,
    exercise_id: null,
    item_id: `it-${id}`,
    item_version_id: 100 + id,
    grading_mode_id: '',
    accepted_answers: [],
    payload: {},
    option_set_id: null,
    option_order: null,
    option_texts: null,
    explanation_es: `Explicación ${id}`,
    ...over,
  };
}

/** Frases semilla (respuesta, aceptadas) en los idiomas del producto, con apóstrofos y contracciones. */
const TEXT_SEEDS = [
  ["It is three o'clock.", []],
  ["She wasn't busy.", ['She was not busy.']],
  ["I'm from Argentina", ['I am from Argentina']],
  ["Don't worry.", ['Do not worry.']],
  ["Let's go to the beach.", []],
  ["L'ombrello è rosso.", []],
  ["C'è un gatto.", []],
  ['Buongiorno, come stai?', []],
  ['Eu sou do Brasil.', []],
  ['Obrigado pela ajuda.', []],
  ['Wǒ shì xuéshēng.', ['wo shi xuesheng', 'wo3 shi4 xue2 sheng1']],
  ['我是学生', []],
  ['The beautiful window', []],
  ['chair', []],
  ['Good morning', []],
];

function mutations(s) {
  const out = new Set([s, s.toLowerCase(), s.toUpperCase(), s.replace(/[.,!?¿¡]/g, ''), ` ${s}  `]);
  out.add(s.replace(/'/g, ''));
  out.add(s.replace(/'/g, '´'));
  out.add(s.replace(/'/g, '’'));
  out.add(s.replace(/ /, " '"));
  out.add(s.normalize('NFD').replace(/[̀-ͯ]/g, ''));
  const chars = [...s];
  for (let i = 0; i < chars.length; i++) {
    out.add([...chars.slice(0, i), ...chars.slice(i + 1)].join('')); // borrar
    out.add([...chars.slice(0, i), 'x', ...chars.slice(i + 1)].join('')); // cambiar
    out.add([...chars.slice(0, i), chars[i], ...chars.slice(i)].join('')); // duplicar
    if (i + 1 < chars.length) {
      const sw = [...chars];
      [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
      out.add(sw.join('')); // trasponer
    }
  }
  out.add('');
  out.add('   ');
  return [...out];
}

/** Presentaciones + respuestas: texto (con y sin tolerancia), orden de palabras, opciones y parejas. */
function corpus() {
  const snaps = [];
  const cases = [];
  let id = 1;
  for (const type of ['translate_write', 'complete_word']) {
    for (const [answer, accepted] of TEXT_SEEDS) {
      const p = snapshot(id++, {
        grading_spec: gradingSpecFor(type),
        answer,
        accepted_answers: accepted,
        payload: { type, source: 'x', ...(type === 'complete_word' ? { sentence: '___' } : {}) },
      });
      snaps.push(p);
      for (const v of mutations(answer)) cases.push([p, { kind: 'text', value: v }]);
      cases.push([p, { kind: 'option', value: answer }]); // tipo equivocado → invalid_response
    }
  }
  const orderSeeds = [
    ['I am happy.', ['I', 'am', 'happy']],
    ["It's five o'clock.", ["It's", 'five', "o'clock"]],
    ['Io sono felice.', ['Io', 'sono', 'felice']],
  ];
  for (const [answer, tokens] of orderSeeds) {
    const p = snapshot(id++, {
      grading_spec: gradingSpecFor('order_words'),
      answer,
      payload: { type: 'order_words', tokens, translation: 'x' },
    });
    snaps.push(p);
    const perms = (a) =>
      a.length <= 1
        ? [a]
        : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r]));
    for (const t of perms(tokens)) cases.push([p, { kind: 'tokens', value: t }]);
    cases.push([p, { kind: 'tokens', value: [...tokens, 'extra'] }]);
    cases.push([p, { kind: 'tokens', value: tokens.map((t) => t.replace(/'/g, '')) }]);
  }
  const options = ['perro', 'gato', 'casa', "l'acqua"];
  for (const answer of options) {
    const p = snapshot(id++, {
      grading_spec: gradingSpecFor('translation_choice'),
      answer,
      payload: { type: 'translation_choice', word: 'x' },
      option_set_id: 9,
      option_order: [2, 0, 3, 1],
      option_texts: options,
    });
    snaps.push(p);
    for (const v of [...options, 'otra', 'Perro', 'lacqua'])
      cases.push([p, { kind: 'option', value: v }]);
    cases.push([p, { kind: 'text', value: answer }]);
  }
  const pairs = [
    { left: 'cat', right: 'gato' },
    { left: 'dog', right: 'perro' },
    { left: "o'clock", right: 'en punto' },
  ];
  const pp = snapshot(id++, {
    grading_spec: { mode: 'pair_set', mode_version: 1 },
    answer: '',
    payload: { type: 'match_pairs', pairs },
  });
  snaps.push(pp);
  cases.push([pp, { kind: 'pairs', value: pairs }]);
  cases.push([
    pp,
    {
      kind: 'pairs',
      value: [pairs[0], { left: 'dog', right: 'en punto' }, { left: "o'clock", right: 'perro' }],
    },
  ]);
  cases.push([pp, { kind: 'pairs', value: pairs.slice(0, 2) }]);
  cases.push([pp, { kind: 'pairs', value: [...pairs, { left: 'x', right: 'y' }] }]);
  return { snaps, cases };
}

const items = (snaps) =>
  snaps.map((s, i) => ({
    presentation_id: s.presentation_id,
    position: i + 1,
    item_id: s.item_id,
    type: s.payload?.type ?? 'x',
    prompt: 'p',
    payload: s.payload,
    options_shown: s.option_texts,
    word: { id: 'w' },
    answered: null,
  }));

let v3;
let v4;
let data;

before(async () => {
  ({ gradingSpecFor } = await import(pathToFileURL(join(ROOT, 'shared/grading.ts')).href));
  client = await import(pathToFileURL(join(ROOT, 'shared/learningSession.ts')).href);
  answersApp = await import(pathToFileURL(join(ROOT, 'shared/answers.ts')).href);
  v3core = await import(pathToFileURL(join(HERE, 'v3/core.generated.js')).href);
  v4core = await import(pathToFileURL(join(HERE, 'v4/core.generated.js')).href);
  v3 = await loadFunction('v3');
  v4 = await loadFunction('v4');
  data = corpus();
});

// ------------------------------------------------------------------------------------------------

describe('1. respaldo de producción y builds reproducibles', () => {
  it('los cuatro archivos de la v3 coinciden con SHA256SUMS (respaldo intacto)', () => {
    const expected = sums('v3');
    for (const f of FILES) assert.equal(sha256(join(HERE, 'v3', f)), expected[f], f);
    const meta = JSON.parse(readFileSync(join(HERE, 'v3', 'metadata.json'), 'utf8'));
    assert.equal(meta.version, 3);
    assert.equal(meta.verify_jwt, false);
  });

  it('la v4 coincide con SHA256SUMS; planner y focus son los de la v3', () => {
    const expected = sums('v4');
    for (const f of FILES) assert.equal(sha256(join(HERE, 'v4', f)), expected[f], f);
    for (const f of ['planner.generated.js', 'focus.generated.js']) {
      assert.equal(sha256(join(HERE, 'v4', f)), sha256(join(HERE, 'v3', f)), f);
    }
  });

  it('v3-source reproduce byte a byte el core de producción; v4-source, el de la v4', () => {
    for (const v of ['v3', 'v4']) {
      const out = join(TMP, `core.${v}.js`);
      execFileSync(process.execPath, [join(HERE, 'build.cjs'), join(HERE, `${v}-source`), out]);
      assert.equal(sha256(out), sha256(join(HERE, v, 'core.generated.js')), v);
    }
  });

  it('v4-source = v3-source salvo learningSession.ts y grading.ts (sin cambios de idiomas ni de answers.ts)', () => {
    for (const f of ['answers.ts', 'exercises.ts', 'languages.ts', 'shuffle.ts']) {
      assert.equal(
        sha256(join(HERE, 'v4-source/shared', f)),
        sha256(join(HERE, 'v3-source/shared', f)),
        f,
      );
    }
    for (const f of ['learningSession.ts', 'grading.ts']) {
      assert.equal(sha256(join(HERE, 'v4-source/shared', f)), sha256(join(ROOT, 'shared', f)), f);
    }
  });

  it('index.ts v4 = v3 + exactamente el parche de docs/patches (sin C.7 ni O-1)', () => {
    const changed = (text) =>
      text.split('\n').filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
    let diff = '';
    try {
      execFileSync(
        'git',
        [
          'diff',
          '--no-index',
          '--no-color',
          '-U3',
          join(HERE, 'v3/index.ts'),
          join(HERE, 'v4/index.ts'),
        ],
        { encoding: 'utf8' },
      );
    } catch (e) {
      diff = e.stdout; // git diff --no-index sale con 1 cuando hay diferencias
    }
    const patch = readFileSync(
      join(ROOT, 'docs/patches/learning-session-instant-review.patch'),
      'utf8',
    );
    assert.deepEqual(changed(diff), changed(patch));
    const lines = changed(diff);
    assert.equal(lines.filter((l) => l.startsWith('+')).length, 13);
    assert.equal(lines.filter((l) => l.startsWith('-')).length, 5);
    assert.ok(
      lines.every(
        (l) => !/curriculum|CURRICULUM|O-1|SUPABASE_URL|getUser|createClient|CORS/.test(l),
      ),
    );
    assert.equal(
      readFileSync(join(HERE, 'v4/index.ts'), 'utf8').includes('x-polygo-curriculum-api'),
      false,
    );
  });
});

describe('2. la función v4 se comporta como la v3 salvo grading_key', () => {
  const setReview = (session) => {
    db.rpc = {
      learning_review_prepare: () => ({
        data: { session, enabled: true, source: 'adaptive_review', complete: true },
        error: null,
      }),
      learning_review_content: () => ({ data: items(data.snaps), error: null }),
      learning_session_presentations: () => ({ data: data.snaps, error: null }),
      learning_review_words: () => ({
        data: Object.fromEntries(data.snaps.map((s) => [s.item_id, 'w'])),
        error: null,
      }),
      learning_review_answer: (args) => ({
        data: { recorded: args.p_grading, duplicate: false },
        error: null,
      }),
      learning_review_retry: (args) => ({ data: { retry: args.p_grading }, error: null }),
      record_learning_session: (args) => ({
        data: { session_id: SESSION, gradings: args.p_gradings },
        error: null,
      }),
      srs_v2_session_result: () => ({ data: null, error: null }),
      learning_note_client: () => ({ data: null, error: null }),
    };
  };
  const start = {
    action: 'start_review',
    session_id: SESSION,
    language_code: 'en',
    time_zone: 'UTC',
  };
  const stripKeys = (body) => ({
    ...body,
    items: body.items.map(({ grading_key, ...rest }) => rest),
  });

  for (const session of ['open', 'expired']) {
    it(`start_review (${session}): mismo cuerpo + grading_key por ítem; una RPC más, de lectura`, async () => {
      setReview(session);
      const a = await call(v3, start);
      const b = await call(v4, start);
      assert.equal(a.status, 200);
      assert.equal(b.status, a.status);
      assert.deepEqual(b.headers, a.headers);
      assert.deepEqual(stripKeys(b.body), a.body);
      assert.ok(a.body.items.every((i) => !('grading_key' in i)));
      for (const item of b.body.items) {
        const snap = data.snaps.find((s) => s.presentation_id === item.presentation_id);
        assert.deepEqual(item.grading_key, client.reviewGradingKey(snap));
        assert.equal(item.grading_key.grader_version, '1.0.0');
      }
      const names = (r) => r.calls.map(([n]) => n);
      assert.deepEqual(
        names(b).filter((n) => n !== 'learning_session_presentations'),
        names(a),
      );
      assert.equal(names(b).filter((n) => n === 'learning_session_presentations').length, 1);
      assert.deepEqual(b.clients, a.clients);
    });
  }

  it('start_review: si la fotografía falla, los ítems van sin clave (la app espera al servidor)', async () => {
    setReview('open');
    db.rpc.learning_session_presentations = () => ({ data: null, error: { message: 'boom' } });
    const a = await call(v3, start);
    const b = await call(v4, start);
    assert.equal(b.status, 200);
    assert.deepEqual(b.body, a.body);
  });

  it('C.7: con la cabecera curricular, v4 crea el cliente igual que v3 (no la reenvía)', async () => {
    setReview('open');
    const h = { 'x-polygo-curriculum-api': '1' };
    const a = await call(v3, start, { headers: h });
    const b = await call(v4, start, { headers: h });
    assert.deepEqual(b.clients, a.clients);
    assert.equal(JSON.stringify(b.clients).includes('curriculum'), false);
  });

  it('O-1: sin SUPABASE_URL, v4 falla exactamente como v3', async () => {
    setReview('open');
    const env = { SUPABASE_SERVICE_ROLE_KEY: 'service' };
    const a = await call(v3, start, { env });
    const b = await call(v4, start, { env });
    assert.deepEqual({ ...b, calls: b.calls }, { ...a, calls: a.calls });
    assert.ok(a.thrown, 'v3 lanza (sin el manejo de O-1)');
  });

  it('autenticación: sin token, token inválido y OPTIONS, igual que v3', async () => {
    setReview('open');
    for (const opts of [
      { token: null },
      { token: 'malo' },
      { method: 'OPTIONS' },
      { method: 'GET' },
    ]) {
      const a = await call(v3, start, opts);
      const b = await call(v4, start, opts);
      assert.deepEqual(b, a, JSON.stringify(opts));
    }
  });

  it('answer_review: misma respuesta y mismas RPC (misma corrección) en todo el corpus', async () => {
    setReview('open');
    let n = 0;
    for (const [p, answer] of data.cases) {
      for (const extra of [{}, { attempt_no: 2 }, { client_verdict: 'correct' }]) {
        const body = {
          action: 'answer_review',
          session_id: SESSION,
          attempt: {
            presentation_id: p.presentation_id,
            answer,
            response_ms: 1234,
            assists: {},
            ...extra,
          },
        };
        const a = await call(v3, body);
        const b = await call(v4, body);
        assert.deepEqual(b, a);
        // No es una igualdad trivial: las dos corrigen y registran (200 con la corrección).
        assert.equal(a.status, 200, JSON.stringify(a.body));
        assert.ok(a.calls.some(([name]) => name.startsWith('learning_review_')));
        n++;
      }
    }
    assert.ok(n > 3000, `casos: ${n}`);
    console.log(
      `answer_review comparado en ${n} llamadas (${data.cases.length} respuestas × 3 variantes)`,
    );
  });

  it('submit_review: mismo registro (record_learning_session) que v3', async () => {
    setReview('open');
    const attempts = data.snaps.map((p) => {
      const c = data.cases.find(([s]) => s === p);
      return { presentation_id: p.presentation_id, answer: c[1], response_ms: 900, assists: {} };
    });
    const body = {
      action: 'submit_review',
      session_id: SESSION,
      started_at: new Date(0).toISOString(),
      time_zone: 'UTC',
      attempts,
    };
    const a = await call(v3, body);
    const b = await call(v4, body);
    assert.deepEqual(b, a);
    assert.equal(a.status, 200, JSON.stringify(a.body));
    assert.ok(a.calls.some(([name]) => name === 'record_learning_session'));
  });

  it('acciones desconocidas o mal formadas: igual que v3', async () => {
    setReview('open');
    for (const body of [
      { action: 'nope', session_id: SESSION },
      { action: 'start_review', session_id: 'x' },
      null,
    ]) {
      const a = await call(v3, body);
      const b = await call(v4, body);
      assert.deepEqual(b, a);
    }
  });
});

describe('3. la corrección del servidor no cambia (v3 = v4)', () => {
  it('gradeReviewAnswer, repeticiones y gradeLessonAttempts: idénticos en todo el corpus', () => {
    const words = Object.fromEntries(data.snaps.map((s) => [s.item_id, 'w']));
    const lessonSnaps = data.snaps.map((s) => ({ ...s, exercise_id: `ex-${s.presentation_id}` }));
    const run = (core, fn) => {
      try {
        return { ok: fn(core) };
      } catch (e) {
        return { error: e.code ?? e.message };
      }
    };
    for (const [p, answer] of data.cases) {
      const raw = { presentation_id: p.presentation_id, answer, response_ms: 10 };
      for (const attemptNo of [1, 2]) {
        assert.deepEqual(
          run(v4core, (c) => c.gradeReviewAnswer(data.snaps, raw, words, attemptNo)),
          run(v3core, (c) => c.gradeReviewAnswer(data.snaps, raw, words, attemptNo)),
        );
      }
      assert.deepEqual(
        run(v4core, (c) => c.gradeLessonAttempts(lessonSnaps, [raw])),
        run(v3core, (c) => c.gradeLessonAttempts(lessonSnaps, [raw])),
      );
    }
    assert.equal(v4core.LEARNING_GRADER.grader_version, v3core.LEARNING_GRADER.grader_version);
  });
});

describe('4. la app y el servidor v4 dan el mismo veredicto', () => {
  it('gradeWithKey (app) = answer_review (v4) en todo el corpus', () => {
    const words = Object.fromEntries(data.snaps.map((s) => [s.item_id, 'w']));
    let differsWithAppRules = 0;
    for (const [p, answer] of data.cases) {
      const server = v4core.gradeReviewAnswer(
        data.snaps,
        { presentation_id: p.presentation_id, answer, response_ms: 1 },
        words,
      ).grading;
      const key = v4core.withGradingKeys([{ presentation_id: p.presentation_id }], data.snaps)[0]
        .grading_key;
      // La clave viaja como JSON.
      const local = client.gradeWithKey(JSON.parse(JSON.stringify(key)), answer);
      assert.deepEqual(
        local,
        { status: server.status, verdict: server.verdict },
        JSON.stringify(answer),
      );
      // Con las reglas de Aprender (TEXT_RULES) la app diría otra cosa en algunos casos.
      if (answer.kind === 'text' && p.grading_spec.mode === 'normalized_text') {
        const app = answersApp.verdictForText(
          answer.value,
          [p.answer, ...p.accepted_answers],
          p.grading_spec.typo_tolerance,
        );
        const serverCorrect = server.verdict === 'correct' || server.verdict === 'typo';
        if (server.status === 'valid' && app.correct !== serverCorrect) differsWithAppRules++;
      }
    }
    assert.ok(
      differsWithAppRules > 0,
      'el corpus incluye casos de apóstrofos donde las reglas difieren',
    );
  });

  it('el core de la app y el v4 arman la misma clave', () => {
    const fromApp = client.withGradingKeys(items(data.snaps), data.snaps);
    const fromV4 = v4core.withGradingKeys(items(data.snaps), data.snaps);
    assert.deepEqual(fromApp, fromV4);
  });
});

writeFileSync(join(TMP, 'README'), 'temporal de verify.test.mjs\n');
