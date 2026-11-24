// Fase C: comprensión lectora y auditiva en contexto (docs/LEARNING_PHASE_C.md), probada en PGlite con
// todas las migraciones, incluidas 20261113120000_context_comprehension.sql (esquema) y
// 20261113120100_comprehension_en_a1.sql (contenido generado). La ruta de lección corregida en el
// servidor se ejerce exactamente como la Edge Function learning-session (learningHelpers.mjs).
//
// Las lecciones «En contexto» se cargan SIN publicar. Para probar la corrección, la última parte del
// archivo las publica dentro de esta base desechable (nunca en otra parte): así se ejerce el camino
// que tendrían después de una revisión pedagógica, sin cambiar nada fuera de PGlite.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers, j, rightAnswer, wrongAnswer } from './learningHelpers.mjs';
import {
  gradeLessonAttempts,
  LEARNING_GRADER,
  LearningSessionError,
} from '../../shared/learningSession.ts';
import { comprehensionSql } from '../../scripts/comprehension-sql.ts';
import { COMPREHENSION_OBJECTIVES, COMPREHENSION_PATH } from '../../content/comprehension.ts';
import { PLANNED_OBJECTIVES } from '../../content/planned-objectives.ts';
import { CONTENT_PERSONAS } from '../../content/personas.ts';

const SCHEMA = '20261113120000_context_comprehension.sql';
// Fase C.1 (U1–U12): se conserva tal cual. La C.2 (U13, U14) trae todo el contenido de la fase C,
// idempotente: reaplica sin cambios lo de la C.1 y agrega U13 y U14 (docs/LEARNING_PHASE_C.md §C2).
const CONTENT_C1 = '20261113120100_comprehension_en_a1.sql';
const CONTENT_C1_SHA256 = 'e3e24ef0382503596d6805c721a20c0039de829a30d1bfc2c3e3700917c001ba';
const CONTENT = '20261113120200_comprehension_en_a1_u13_u14.sql';
const PLANNED_UNITS = ['a1-u13', 'a1-u14'];
// Lecciones nuevas del cierre de inglés A1 (docs/A1_EN_CLOSURE.md), sin publicar, en la posición 12.
const CLOSURE_LESSONS = ['a1-u05-l06', 'a1-u09-l06', 'a1-u12-l06'];
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');

let db;
let h;
const CONTEXT = `like '%-context'`;
const LESSONS = COMPREHENSION_PATH.map((p) => p.lessons[0].id);
const QUESTIONS = COMPREHENSION_PATH.reduce((n, p) => n + p.lessons[0].exercises.length, 0);

before(async () => {
  db = await createDb();
  h = helpers(db);
});

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

// --- Generación y esquema --------------------------------------------------------------------

test('la migración de contenido es la salida exacta del generador (determinista)', () => {
  const a = comprehensionSql().sql;
  const b = comprehensionSql().sql;
  assert.equal(a, b);
  assert.equal(migration(CONTENT), a);
  // La migración de la C.1 no se tocó.
  assert.equal(createHash('sha256').update(migration(CONTENT_C1)).digest('hex'), CONTENT_C1_SHA256);
});

test('C.2: la migración nueva contiene las 12 lecciones de la C.1 sin cambios, más U13 y U14', () => {
  const doc = (name) => JSON.parse(/\$content\$([\s\S]*?)\$content\$/.exec(migration(name))[1]);
  const [c1, c2] = [doc(CONTENT_C1), doc(CONTENT)];
  const byId = (rows) => new Map(rows.map((r) => [r.id, r]));
  const [l1, l2] = [byId(c1.lessons), byId(c2.lessons)];
  const [e1, e2] = [byId(c1.exercises), byId(c2.exercises)];
  for (const [id, row] of l1) assert.deepEqual(l2.get(id), row, id);
  for (const [id, row] of e1) assert.deepEqual(e2.get(id), row, id);
  assert.deepEqual([...l2.keys()].filter((id) => !l1.has(id)).sort(), [
    'a1-u13-context',
    'a1-u14-context',
  ]);
  assert.equal(c1.units, undefined);
  assert.deepEqual(
    c2.units.map((u) => u.id),
    PLANNED_UNITS,
  );
});

test('esquema: context_choice y reading entran; un tipo o una habilidad desconocidos siguen afuera', async () => {
  const checks = await h.all(
    `select conname, pg_get_constraintdef(oid) def from pg_constraint
     where conname in ('exercises_type_check', 'exercises_skill_check', 'exercise_items_type_check',
                       'exercises_choice_option_set_check') order by conname`,
  );
  assert.equal(checks.length, 4);
  for (const c of checks) {
    if (c.conname === 'exercises_skill_check') assert.match(c.def, /'reading'/);
    else assert.match(c.def, /'context_choice'/);
  }
  const bad = await errorOf(
    db.query(
      `insert into public.exercise_items (id, language_code, level, origin, type, assessment_mode,
         response_format, input_modality, response_privacy, status)
       values ('en.ex.zzzzzzzzzzzzzz', 'en', 'A1', 'authored', 'free_essay', 'reading_comprehension',
         'select', 'text', 'closed', 'draft')`,
    ),
  );
  assert.match(String(bad?.message), /exercise_items_type_check/);
  // Reaplicar el esquema no cambia nada.
  await db.exec(migration(SCHEMA));
  const again = await h.all(
    `select conname, pg_get_constraintdef(oid) def from pg_constraint
     where conname in ('exercises_type_check', 'exercises_skill_check', 'exercise_items_type_check',
                       'exercises_choice_option_set_check') order by conname`,
  );
  assert.deepEqual(again, checks);
});

test('las migraciones nuevas no tocan Ranked, energía, rachas, logros, Plus, SRS v1 ni los motores', () => {
  const text = (
    migration(SCHEMA) +
    '\n' +
    comprehensionSql().sql.replace(/\$content\$[\s\S]*?\$content\$/, '')
  )
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('--'))
    .join('\n');
  for (const word of [
    'ranked',
    'battle',
    'energy',
    'streak',
    'achievement',
    'plus',
    'user_word_progress',
    'exercise_words',
    'srs_v2_settings',
    'mastery_model_versions',
    'learning_job_runs',
    'cron',
    'grant ',
    'revoke ',
    'policy',
    'submit_learning_session',
    'is_lesson_unlocked',
    'is_published = true',
  ]) {
    assert.ok(!text.toLowerCase().includes(word), `menciona ${word}`);
  }
});

// --- Contenido cargado (sin publicar) ----------------------------------------------------------

test('lecciones y ejercicios cargados sin publicar, con su ítem, versión y conjunto', async () => {
  const lessons = await h.all(
    `select l.id, l.unit_id, l.position, l.is_published,
            (select max(x.position) from public.lessons x where x.unit_id = l.unit_id and x.id <> l.id
               -- Las lecciones nuevas del cierre de inglés A1 van después de la «En contexto» (posición 12).
               and x.id <> all($1)) last_other
     from public.lessons l where l.id ${CONTEXT} order by l.id`,
    [CLOSURE_LESSONS],
  );
  assert.deepEqual(
    lessons.map((l) => l.id),
    [...LESSONS].sort(),
  );
  for (const l of lessons) {
    assert.equal(l.is_published, false);
    // U13 y U14: después de las 10 posiciones reservadas, que ocupan sus lecciones escritas y su
    // consolidación (fase C.3, sin publicar).
    if (PLANNED_UNITS.includes(l.unit_id))
      assert.deepEqual([l.position, l.last_other], [11, 10], l.id);
    else
      assert.equal(
        l.position,
        l.last_other + 1,
        `${l.id} va después de la última lección de la unidad`,
      );
  }
  const ex = await h.one(
    `select count(*)::int n, count(*) filter (where is_published)::int published,
            count(*) filter (where item_id is null or item_version_id is null or option_set_id is null)::int incomplete,
            count(*) filter (where type <> 'context_choice')::int other,
            array_agg(distinct skill order by skill) skills
     from public.exercises where lesson_id ${CONTEXT}`,
  );
  assert.deepEqual(ex, {
    n: QUESTIONS,
    published: 0,
    incomplete: 0,
    other: 0,
    skills: ['listening', 'reading'],
  });
  // Sin exercise_words: la comprensión no entra en el SRS léxico v1.
  const links = await h.one(
    `select count(*)::int n from public.exercise_words w join public.exercises e on e.id = w.exercise_id
     where e.lesson_id ${CONTEXT}`,
  );
  assert.equal(links.n, 0);
});

test('ítems draft de comprensión: modo, entrada, privacidad y dimensiones (§4.3)', async () => {
  const items = await h.all(
    `select i.id, i.type, i.status, i.assessment_mode, i.response_format, i.input_modality, i.response_privacy,
            e.payload -> 'stimulus' ->> 'kind' kind
     from public.exercise_items i join public.exercises e on e.item_id = i.id
     where e.lesson_id ${CONTEXT}`,
  );
  assert.equal(items.length, QUESTIONS);
  for (const i of items) {
    assert.equal(i.type, 'context_choice');
    assert.equal(i.status, 'draft');
    assert.equal(i.response_format, 'select');
    assert.equal(i.response_privacy, 'closed');
    assert.equal(
      i.assessment_mode,
      i.kind === 'reading' ? 'reading_comprehension' : 'listening_comprehension',
    );
    assert.equal(i.input_modality, i.kind === 'reading' ? 'text' : 'audio');
  }
  // Cada concepto target da vocabulary + comprehension, nada de production ni grammar.
  const dims = await h.all(
    `select ic.dimension, count(*)::int n from public.item_concepts ic
     join public.exercises e on e.item_id = ic.item_id where e.lesson_id ${CONTEXT}
     group by ic.dimension order by ic.dimension`,
  );
  assert.deepEqual(
    dims.map((d) => d.dimension),
    ['comprehension', 'vocabulary'],
  );
  assert.equal(dims[0].n, dims[1].n);
  // La versión vigente guarda el estímulo y corrige con exact_option.v1.
  const v = await h.one(
    `select count(*)::int n,
            count(*) filter (where v.grading_mode_id = 'exact_option.v1')::int exact,
            count(*) filter (where v.payload -> 'stimulus' is null)::int without_stimulus
     from public.exercises e join public.exercise_item_versions v on v.id = e.item_version_id
     where e.lesson_id ${CONTEXT}`,
  );
  assert.deepEqual(v, { n: QUESTIONS, exact: QUESTIONS, without_stimulus: 0 });
});

test('objetivos del mapa (cL/cR): draft, con su ancla, relaciones a lecciones, ítems y conceptos', async () => {
  const objectives = await h.all(
    `select id, status, cefr_activity, cefr_ref from public.learning_objectives where id like 'en.a1.obj.%' order by id`,
  );
  assert.equal(objectives.length, COMPREHENSION_OBJECTIVES.length);
  assert.equal(objectives.length, 11);
  assert.deepEqual(
    objectives.map((o) => o.id),
    ['cl01', 'cl02', 'cl03', 'cl04', 'cl05', 'cl06', 'cr01', 'cr02', 'cr03', 'cr05', 'cr06'].map(
      (c) => `en.a1.obj.${c}`,
    ),
  );
  assert.ok(objectives.every((o) => o.status === 'draft' && typeof o.cefr_ref === 'string'));
  assert.deepEqual([...new Set(objectives.map((o) => o.cefr_activity))].sort(), [
    'listening',
    'reading',
  ]);
  const rel = await h.one(
    `select (select count(*)::int from public.lesson_objectives where lesson_id ${CONTEXT}) lessons,
            (select count(*)::int from public.item_objectives io join public.exercises e on e.item_id = io.item_id
               where e.lesson_id ${CONTEXT}) items,
            (select count(*)::int from public.objective_concepts where objective_id like 'en.a1.obj.%') concepts`,
  );
  // Un objetivo se comparte entre las lecciones que lo practican (cL05: cinco lecciones).
  assert.equal(
    rel.lessons,
    COMPREHENSION_OBJECTIVES.reduce((n, o) => n + o.lessons.length, 0),
  );
  assert.equal(rel.items, QUESTIONS);
  // La C.3 agrega a cuatro objetivos los conceptos de los ítems de U13 y U14 que los practican.
  const loaded = COMPREHENSION_OBJECTIVES.map(
    (o) => PLANNED_OBJECTIVES.find((p) => p.id === o.id) ?? o,
  );
  assert.equal(
    rel.concepts,
    loaded.reduce((n, o) => n + o.concepts.length, 0),
  );
});

test('reaplicar la migración de contenido no cambia nada', async () => {
  // Sobre la base hasta la C.2: la C.3 (20261113120300) agrega relaciones a cuatro de estos objetivos,
  // así que reaplicar la C.2 después de la C.3 aborta (como reaplicar la C.1 después de la C.2), y no
  // es una operación prevista (docs/LEARNING_PHASE_C.md §C3.6).
  const files = readdirSync(new URL('../migrations/', import.meta.url))
    .filter((f) => f.endsWith('.sql') && f <= CONTENT)
    .sort();
  const db = await createDb({ files });
  const h = helpers(db);
  const snapshot = () =>
    h.all(
      `select e.id, e.payload, e.answer, e.is_published, e.item_version_id, e.option_set_id, l.is_published lp,
              i.status
       from public.exercises e join public.lessons l on l.id = e.lesson_id
       join public.exercise_items i on i.id = e.item_id
       where e.lesson_id ${CONTEXT} order by e.id`,
    );
  const before = await snapshot();
  const counts = () =>
    h.one(`select (select count(*)::int from public.exercise_item_versions) v,
                  (select count(*)::int from public.exercise_option_sets) s,
                  (select count(*)::int from public.exercise_option_set_assignments) a,
                  (select count(*)::int from public.learning_objectives) o`);
  const c0 = await counts();
  await db.exec(migration(CONTENT));
  assert.deepEqual(await snapshot(), before);
  assert.deepEqual(await counts(), c0);
});

// --- Aislamiento: nada de esto está en un recorrido activo -------------------------------------

test('la app no ve las lecciones sin publicar ni puede empezarlas', async () => {
  const user = await createUser(db, 'phasec-app@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(
          `select (select count(*)::int from public.lessons where id ${CONTEXT}) lessons,
                (select count(*)::int from public.exercises where lesson_id ${CONTEXT}) exercises`,
        )
      ).rows[0],
  );
  assert.deepEqual(seen, { lessons: 0, exercises: 0 });
  const err = await errorOf(h.startLesson(user, randomUUID(), 'a1-u01-context'));
  assert.match(String(err?.message), /lesson_not_found/);
  const old = await errorOf(
    as(db, 'authenticated', user, () =>
      db.query(
        `select public.submit_learning_session($1, 'lesson', 'a1-u01-context', now() - interval '1 minute', '[]'::jsonb, 'UTC')`,
        [randomUUID()],
      ),
    ),
  );
  assert.ok(old, 'la ruta vieja tampoco acepta la lección');
});

test('C.2: U13 y U14 existen sin publicar; la app no las ve', async () => {
  // Desde la C.3 (20261113120300) tienen también sus palabras y sus lecciones escritas, todas sin
  // publicar (lo prueba supabase/tests/planned.test.mjs): la «En contexto» sigue última.
  const units = await h.all(
    `select u.id, u.position, u.is_published, u.title_es, u.review_status,
            (select count(*)::int from public.words w where w.unit_id = u.id and w.is_published) words,
            (select count(*)::int from public.lessons l where l.unit_id = u.id and l.is_published) published,
            (select array_agg(l.id order by l.position desc) from public.lessons l where l.unit_id = u.id) lessons
     from public.curriculum_units u where u.id = any($1) order by u.id`,
    [PLANNED_UNITS],
  );
  assert.deepEqual(
    units.map(({ lessons, ...u }) => ({ ...u, last: lessons[0], count: lessons.length })),
    [
      {
        id: 'a1-u13',
        position: 13,
        is_published: false,
        title_es: 'Letras y datos personales',
        review_status: 'draft',
        words: 0,
        published: 0,
        last: 'a1-u13-context',
        count: 11,
      },
      {
        id: 'a1-u14',
        position: 14,
        is_published: false,
        title_es: 'Precios y compras',
        review_status: 'draft',
        words: 0,
        published: 0,
        last: 'a1-u14-context',
        count: 11,
      },
    ],
  );
  // Las 12 unidades escritas de inglés A1 siguen en sus posiciones, publicadas.
  const written = await h.all(
    `select id, position, is_published from public.curriculum_units
     where language_code = 'en' and level = 'A1' and not (id = any($1)) order by position`,
    [PLANNED_UNITS],
  );
  assert.deepEqual(
    written,
    Array.from({ length: 12 }, (_, i) => ({
      id: `a1-u${String(i + 1).padStart(2, '0')}`,
      position: i + 1,
      is_published: true,
    })),
  );
  const user = await createUser(db, 'phasec2-units@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(`select count(*)::int n from public.curriculum_units where id = any($1)`, [
          PLANNED_UNITS,
        ])
      ).rows[0],
  );
  assert.equal(seen.n, 0);
  const err = await errorOf(h.startLesson(user, randomUUID(), 'a1-u13-context'));
  assert.match(String(err?.message), /lesson_not_found/);
});

test('C.2: la huésped de U13 es una persona ficticia de content_personas, y sus ítems siguen cerrados', async () => {
  const personas = await h.all(
    `select id, language_code, display_name, phone, email, fictional from public.content_personas`,
  );
  // Los datos salen de content/personas.ts: un correo escrito acá contaría como usuario de prueba
  // para personaPrivacyProblems (content/__tests__/phase1.test.ts).
  const [guest] = CONTENT_PERSONAS;
  assert.deepEqual(personas, [
    {
      id: guest.id,
      language_code: 'en',
      display_name: guest.displayName,
      phone: guest.phone,
      email: guest.email,
      fictional: true,
    },
  ]);
  assert.equal(guest.id, 'en.persona.sofia-ruiz');
  // Sus datos están en la versión inmutable de las preguntas de U13, que no piden texto libre.
  const u13 = await h.all(
    `select i.response_privacy, v.payload -> 'stimulus' ->> 'kind' kind, strpos(v.payload::text, $1) > 0 has_email
     from public.exercises e join public.exercise_items i on i.id = e.item_id
     join public.exercise_item_versions v on v.id = e.item_version_id
     where e.lesson_id = 'a1-u13-context' order by e.position`,
    [guest.email],
  );
  assert.equal(u13.length, 7);
  assert.ok(u13.every((r) => r.response_privacy === 'closed'));
  assert.deepEqual(
    u13.filter((r) => r.has_email).map((r) => r.kind),
    ['reading', 'reading', 'reading'],
  );
  // Ninguna otra versión muestra un correo (salvo las lecciones escritas de U13, fase C.3, que citan a
  // la misma persona: lo prueba supabase/tests/planned.test.mjs).
  const others = await h.one(
    `select count(*)::int n from public.exercise_item_versions v join public.exercises e on e.item_version_id = v.id
     where e.lesson_id not like 'a1-u13-%' and v.payload::text ~ '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]+'`,
  );
  assert.equal(others.n, 0);
});

test('el desbloqueo no cambia: quien terminó una unidad sigue con la siguiente desbloqueada', async () => {
  const user = await createUser(db, 'phasec-unlock@test.dev');
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, 'a1-u01-final', 1, 1, 1, now(), now())`,
    [user],
  );
  const r = await h.one(`select public.is_lesson_unlocked($1, 'a1-u02-l01') ok`, [user]);
  assert.equal(r.ok, true);
});

test('los ítems de comprensión no son candidatos de ningún repaso', async () => {
  const ids = (await h.all(`select item_id from public.exercises where lesson_id ${CONTEXT}`)).map(
    (r) => r.item_id,
  );
  for (const fn of ['review_item_candidates', 'learning_review_item_candidates']) {
    const exists = await h.one(`select count(*)::int n from pg_proc where proname = $1`, [fn]);
    if (!exists.n) continue;
    const rows = await h.all(`select item_id from public.${fn}('en')`);
    assert.ok(rows.length > 0, `${fn} devuelve candidatos`);
    assert.equal(rows.filter((r) => ids.includes(r.item_id)).length, 0, fn);
  }
  // Ni las funciones con otro nombre que leen exercise_items para repasos.
  const fns = await h.all(
    `select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.prokind = 'f' and pg_get_functiondef(p.oid) ilike '%from public.exercise_items i%'
       and pg_get_functiondef(p.oid) ilike '%review%'`,
  );
  for (const { proname } of fns) {
    const def = (
      await h.one(
        `select pg_get_functiondef(p.oid) d from pg_proc p where p.proname = $1 and p.prokind = 'f' limit 1`,
        [proname],
      )
    ).d;
    assert.match(def, /i\.status = 'active'/, `${proname} filtra ítems activos`);
  }
});

test('los motores siguen apagados y no hay trabajos', async () => {
  const s = await h.one(
    `select (select bool_or(enabled) from public.srs_v2_settings) srs,
            (select bool_or(enabled_for_adaptive) from public.mastery_model_versions) adaptive,
            (select bool_or(enabled_for_display) from public.mastery_model_versions) display,
            (select count(*)::int from public.learning_job_runs) runs,
            (select count(*)::int from pg_extension where extname = 'pg_cron') cron`,
  );
  assert.deepEqual(s, { srs: false, adaptive: false, display: false, runs: 0, cron: 0 });
});

// --- Corrección en el servidor (lecciones publicadas sólo dentro de esta base) -----------------

test('publicadas en la base desechable: la lección se juega y el servidor corrige', async () => {
  await db.query(`update public.lessons set is_published = true where id ${CONTEXT}`);
  await db.query(`update public.exercises set is_published = true where lesson_id ${CONTEXT}`);

  const lesson = 'a1-u07-context';
  const user = await h.learner(lesson);
  const session = randomUUID();
  const started = await h.startLesson(user, session, lesson);
  assert.equal(started.presentations.length, 6);
  const snaps = await h.snapshotsOf(user, session);
  // Cada presentación lleva su estímulo y la pregunta, desde la versión inmutable.
  for (const s of snaps) {
    assert.equal(s.payload.type, 'context_choice');
    assert.ok(s.payload.stimulus.lines.length > 0);
    assert.equal(s.grading_mode_id, 'exact_option.v1');
    assert.deepEqual([...s.option_texts].sort(), [...s.payload.options].sort());
  }
  // La primera pregunta mal, el reintento bien; el resto bien.
  const first = snaps[0];
  const attempts = [
    {
      presentation_id: first.presentation_id,
      answer: wrongAnswer(first),
      client_verdict: 'incorrect',
      response_ms: 3000,
    },
    ...answerAll(snaps.slice(1)),
    {
      presentation_id: first.presentation_id,
      answer: rightAnswer(first),
      client_verdict: 'correct',
      response_ms: 2000,
    },
  ];
  const r = await h.submitLesson(user, session, lesson, attempts);
  assert.equal(r.first_try_total, 6);
  assert.equal(r.first_try_correct, 5);
  const g = await h.all(
    `select g.attempt_no, g.verdict, g.input_modality, g.grading_mode_id, a.is_correct
     from public.exercise_attempt_gradings g join public.exercise_attempts a on a.id = g.attempt_id
     where g.session_id = $1 and g.presentation_id = $2 order by g.attempt_no`,
    [session, first.presentation_id],
  );
  assert.deepEqual(
    g.map((x) => [x.attempt_no, x.verdict, x.is_correct]),
    [
      [1, 'incorrect', false],
      [2, 'correct', true],
    ],
  );
  const modalities = await h.all(
    `select distinct g.input_modality from public.exercise_attempt_gradings g where g.session_id = $1 order by 1`,
    [session],
  );
  assert.deepEqual(
    modalities.map((m) => m.input_modality),
    ['audio', 'text'],
  );
  // El SRS léxico v1 no recibe nada de la comprensión.
  const words = await h.one(
    `select count(*)::int n from public.user_word_progress where user_id = $1`,
    [user],
  );
  assert.equal(words.n, 0);
});

test('respuestas: espacios, mayúsculas, opción inventada y texto libre no son la opción presentada', async () => {
  const lesson = 'a1-u03-context';
  const user = await h.learner(lesson);
  const session = randomUUID();
  await h.startLesson(user, session, lesson);
  const snaps = await h.snapshotsOf(user, session);
  const [a, b, c, d] = snaps;
  // exact_option compara por valor, carácter por carácter, contra el conjunto presentado: la app manda
  // el texto exacto de la opción tocada. Lo que no es una opción presentada es invalid_response.
  const graded = gradeLessonAttempts(snaps, [
    {
      presentation_id: a.presentation_id,
      answer: { kind: 'option', value: `  ${a.answer} ` },
      response_ms: 900,
    },
    { presentation_id: a.presentation_id, answer: rightAnswer(a), response_ms: 900 },
    {
      presentation_id: b.presentation_id,
      answer: { kind: 'option', value: b.answer.toUpperCase() },
      response_ms: 900,
    },
    { presentation_id: b.presentation_id, answer: rightAnswer(b), response_ms: 900 },
    {
      presentation_id: c.presentation_id,
      answer: { kind: 'option', value: 'Respuesta que no estaba' },
      response_ms: 900,
    },
    { presentation_id: c.presentation_id, answer: rightAnswer(c), response_ms: 900 },
    {
      presentation_id: d.presentation_id,
      answer: { kind: 'text', value: d.answer },
      response_ms: 900,
    },
    { presentation_id: d.presentation_id, answer: rightAnswer(d), response_ms: 900 },
    ...answerAll(snaps.slice(4)),
  ]);
  const byPresentation = (id) =>
    graded.gradings.filter((x) => x.presentation_id === id).map((x) => [x.status, x.verdict]);
  assert.deepEqual(byPresentation(a.presentation_id), [
    ['invalid_response', null],
    ['valid', 'correct'],
  ]);
  assert.deepEqual(byPresentation(b.presentation_id).slice(1), [['valid', 'correct']]);
  assert.notEqual(byPresentation(b.presentation_id)[0][1], 'correct');
  assert.deepEqual(byPresentation(c.presentation_id), [
    ['invalid_response', null],
    ['valid', 'correct'],
  ]);
  assert.deepEqual(byPresentation(d.presentation_id), [
    ['invalid_response', null],
    ['valid', 'correct'],
  ]);
  const r = await h.service(() =>
    h.call('learning_submit_graded', [
      user,
      session,
      lesson,
      new Date(Date.now() - 60000).toISOString(),
      'UTC',
      j(graded.attempts),
      j(graded.gradings),
      j(LEARNING_GRADER),
    ]),
  );
  assert.equal(r.first_try_correct, snaps.length - 4);
  // Reenviar lo mismo es idempotente (respuestas duplicadas por red).
  const again = await h.service(() =>
    h.call('learning_submit_graded', [
      user,
      session,
      lesson,
      new Date(Date.now() - 60000).toISOString(),
      'UTC',
      j(graded.attempts),
      j(graded.gradings),
      j(LEARNING_GRADER),
    ]),
  );
  assert.equal(again.duplicate, true);
});

test('el cliente no decide: veredicto, opción u opciones alteradas se rechazan', async () => {
  const lesson = 'a1-u05-context';
  const user = await h.learner(lesson);
  const session = randomUUID();
  await h.startLesson(user, session, lesson);
  const snaps = await h.snapshotsOf(user, session);
  // El cliente dice «correcta» con una opción equivocada: el servidor corrige incorrecta.
  const lies = answerAll(snaps, wrongAnswer, { client_verdict: 'correct' });
  const graded = gradeLessonAttempts(snaps, [...lies, ...answerAll(snaps)]);
  assert.ok(graded.gradings.slice(0, snaps.length).every((g) => g.verdict === 'incorrect'));
  // Correcciones manipuladas antes de llegar a la SQL.
  const ok = gradeLessonAttempts(snaps, answerAll(snaps));
  const call = (attempts, grads) =>
    errorOf(
      h.service(() =>
        h.call('learning_submit_graded', [
          user,
          session,
          lesson,
          new Date(Date.now() - 60000).toISOString(),
          'UTC',
          j(attempts),
          j(grads),
          j(LEARNING_GRADER),
        ]),
      ),
    );
  const flipped = ok.gradings.map((g, i) => (i === 0 ? { ...g, verdict: 'incorrect' } : g));
  assert.match(String((await call(ok.attempts, flipped))?.message), /invalid_gradings/);
  const otherOption = ok.gradings.map((g, i) =>
    i === 0 ? { ...g, selected_option: (g.selected_option + 1) % snaps[0].option_texts.length } : g,
  );
  assert.match(String((await call(ok.attempts, otherOption))?.message), /opción elegida/);
  // Opciones cambiadas en la versión vigente después de presentar: se corrige con lo presentado.
  const before = await h.snapshotsOf(user, session);
  await db.query(
    `update public.exercises set payload = jsonb_set(payload, '{question}', '"¿Otra pregunta?"') where id = $1`,
    [snaps[0].exercise_id],
  );
  assert.deepEqual(await h.snapshotsOf(user, session), before);
  const r = await h.submitLesson(user, session, lesson, answerAll(snaps));
  assert.equal(r.first_try_correct, snaps.length);
});

test('presentaciones ajenas: de otra sesión, de otra lección o de otra cuenta', async () => {
  const lesson = 'a1-u09-context';
  const alice = await h.learner(lesson);
  const bob = await h.learner(lesson);
  const session = randomUUID();
  const other = randomUUID();
  await h.startLesson(alice, session, lesson);
  await h.startLesson(alice, other, 'a1-u10-context').catch(() => null);
  const snaps = await h.snapshotsOf(alice, session);

  // Otra cuenta no ve ni puede enviar las presentaciones de Alice.
  assert.deepEqual(await h.snapshotsOf(bob, session), []);
  const e1 = await errorOf(h.submitLesson(bob, session, lesson, answerAll(snaps)));
  assert.ok(e1 instanceof LearningSessionError && e1.code === 'presentation_not_found');
  assert.match(
    String((await errorOf(h.startLesson(bob, session, lesson)))?.message),
    /session_conflict/,
  );

  // Una presentación de otra lección (otra sesión de la misma cuenta) no corrige esta.
  const u10 = await h.learner('a1-u10-context');
  const s10 = randomUUID();
  await h.startLesson(u10, s10, 'a1-u10-context');
  const foreignSnaps = await h.snapshotsOf(u10, s10);
  const e2 = await errorOf(
    h.submitLesson(alice, session, lesson, [
      ...answerAll(snaps).slice(1),
      ...answerAll(foreignSnaps).slice(0, 1),
    ]),
  );
  assert.ok(e2, 'rechaza una presentación de otra lección');

  // Bob no lee las correcciones de nadie.
  await h.submitLesson(alice, session, lesson, answerAll(snaps));
  const read = await errorOf(
    as(db, 'authenticated', bob, () =>
      db.query(`select count(*) from public.exercise_attempt_gradings`),
    ),
  );
  assert.ok(read, 'authenticated no lee exercise_attempt_gradings');
});

test('misma energía que cualquier lección y Ranked sin cambios', async () => {
  const normal = 'a1-u07-l01';
  const u1 = await h.learner(normal);
  const u2 = await h.learner('a1-u07-context');
  const energyOf = async (u) =>
    (await h.one(`select units from public.user_energy where user_id = $1`, [u]))?.units ?? null;
  const s1 = randomUUID();
  await h.startLesson(u1, s1, normal);
  await h.submitLesson(u1, s1, normal, answerAll(await h.snapshotsOf(u1, s1)));
  const s2 = randomUUID();
  await h.startLesson(u2, s2, 'a1-u07-context');
  await h.submitLesson(u2, s2, 'a1-u07-context', answerAll(await h.snapshotsOf(u2, s2)));
  assert.equal(await energyOf(u2), await energyOf(u1));
  // Ranked no tiene ninguna referencia a los ítems ni a las lecciones nuevas.
  const ranked = await h.all(
    `select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.prokind = 'f' and (p.proname ilike '%ranked%' or p.proname ilike '%battle%')
       and (pg_get_functiondef(p.oid) ilike '%context_choice%' or pg_get_functiondef(p.oid) ilike '%-context%')`,
  );
  assert.deepEqual(ranked, []);
});

test('publicadas al final de la unidad bloquearían la siguiente a quien ya la terminó (decisión pendiente)', async () => {
  // Documenta por qué se cargan sin publicar (docs/LEARNING_PHASE_C.md §10): con la regla de hoy, una
  // lección publicada al final de U1 pasa a ser requisito de a1-u02-l01.
  const user = await createUser(db, 'phasec-blocked@test.dev');
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, 'a1-u01-final', 1, 1, 1, now(), now())`,
    [user],
  );
  const r = await h.one(`select public.is_lesson_unlocked($1, 'a1-u02-l01') ok`, [user]);
  assert.equal(r.ok, false);
});
