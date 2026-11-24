/**
 * Prueba funcional de la fase 2 contra PRODUCCIÓN con una cuenta autorizada
 * (docs/LEARNING_ATTEMPTS_PHASE2.md §7). Hace exactamente lo que hace la app en una lección.
 *
 * ESCRIBE DATOS REALES en esa cuenta: una sesión completada de la lección (gasta 1 de energía sin
 * Plus, suma progreso y actualiza el SRS de sus palabras), sus intentos, presentaciones y
 * correcciones. No crea otras cuentas ni toca datos ajenos. Exige --confirm.
 *
 *   POLYGO_E2E_EMAIL=… POLYGO_E2E_PASSWORD=… [POLYGO_E2E_LESSON=a1-u01-l01] \
 *     npx tsx --env-file=.env scripts/e2e-learning-session.ts --confirm
 *
 * Lee EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY de .env. No imprime credenciales.
 */
import { randomUUID } from 'node:crypto';

import { createClient } from '@supabase/supabase-js';

import { choiceSeed, shuffleOrderV1 } from '../shared/shuffle';

type Json = Record<string, unknown>;
interface Presentation {
  presentation_id: number;
  exercise_id: string;
  item_version_id: number;
  option_set_id: number | null;
  option_order: number[] | null;
  options_shown: string[] | null;
}
interface ExerciseRow {
  id: string;
  type: string;
  payload: Json;
  answer: string;
  item_version_id: number | null;
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.POLYGO_E2E_EMAIL;
const password = process.env.POLYGO_E2E_PASSWORD;
const lessonId = process.env.POLYGO_E2E_LESSON ?? 'a1-u01-l01';

let failures = 0;
function check(ok: boolean, label: string, detail?: unknown) {
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${label}${ok || detail === undefined ? '' : ` → ${JSON.stringify(detail)}`}`,
  );
  if (!ok) failures++;
}

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.error('Escribe datos reales en la cuenta de prueba. Volvé a correrlo con --confirm.');
    process.exit(2);
  }
  if (!url || !anon || !email || !password) {
    console.error('Faltan EXPO_PUBLIC_SUPABASE_URL/ANON_KEY (.env) o POLYGO_E2E_EMAIL/PASSWORD.');
    process.exit(2);
  }
  const db = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const fnUrl = `${url}/functions/v1/learning-session`;

  // 0. Sin token, la función no hace nada.
  const anonymous = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start', session_id: randomUUID(), lesson_id: lessonId }),
  });
  check(anonymous.status === 401, 'sin token → 401', anonymous.status);

  const { data: auth, error: authError } = await db.auth.signInWithPassword({ email, password });
  if (authError || !auth.session)
    throw new Error(`no se pudo iniciar sesión: ${authError?.message}`);
  console.log(`cuenta de prueba autenticada; lección ${lessonId}`);

  const call = async (body: Json) => {
    const { data, error } = await db.functions.invoke('learning-session', {
      body,
      timeout: 20_000,
    });
    if (!error) return { status: 200, data: data as Json };
    const ctx = (error as { context?: Response }).context;
    return {
      status: ctx?.status ?? 0,
      data: ((await ctx?.json().catch(() => null)) ?? {}) as Json,
    };
  };

  const energy = (await db.rpc('get_energy')).data as { plus: boolean; energy: number } | null;
  if (energy && !energy.plus && energy.energy < 1) throw new Error('la cuenta no tiene energía');

  const { data: rows, error: rowsError } = await db
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('is_published', true)
    .order('position');
  if (rowsError || !rows?.length)
    throw new Error(`no se pudo leer la lección: ${rowsError?.message}`);
  const exercises = rows as unknown as ExerciseRow[];

  // 1. Inicio: una presentación por ejercicio, con su versión vigente y el orden de la app.
  const session = randomUUID();
  const started = await call({ action: 'start', session_id: session, lesson_id: lessonId });
  check(started.status === 200, 'start → 200', started);
  const presentations = (started.data.presentations ?? []) as Presentation[];
  check(presentations.length === exercises.length, 'una presentación por ejercicio', {
    presentations: presentations.length,
    exercises: exercises.length,
  });
  const byExercise = new Map(presentations.map((p) => [p.exercise_id, p]));
  for (const e of exercises) {
    const p = byExercise.get(e.id);
    check(
      Boolean(p) && Number(p!.item_version_id) === Number(e.item_version_id),
      `${e.id}: versión vigente`,
      p,
    );
    const options = e.payload.options as string[] | undefined;
    if (p?.options_shown && options) {
      const order = shuffleOrderV1(options.length, choiceSeed(session, e.id));
      check(
        JSON.stringify(p.options_shown) === JSON.stringify(order.map((k) => options[k])),
        `${e.id}: opciones en el orden de polygo.shuffle.v1`,
        p.options_shown,
      );
    }
  }
  const again = await call({ action: 'start', session_id: session, lesson_id: lessonId });
  check(
    again.data.duplicate === true &&
      JSON.stringify((again.data.presentations as Presentation[]).map((p) => p.presentation_id)) ===
        JSON.stringify(presentations.map((p) => p.presentation_id)),
    'start repetido → mismas presentaciones (idempotente)',
    again.data,
  );

  // 2. Rechazos que no escriben nada: sesión sin presentaciones y presentación de otra sesión.
  const foreign = await call({
    action: 'submit',
    session_id: randomUUID(),
    lesson_id: lessonId,
    started_at: new Date(Date.now() - 60_000).toISOString(),
    attempts: [
      {
        presentation_id: presentations[0]!.presentation_id,
        answer: { kind: 'text', value: 'x' },
        response_ms: 1,
      },
    ],
  });
  check(
    foreign.status === 422 && foreign.data.error === 'presentation_not_found',
    'presentación de otra sesión → 422',
    foreign,
  );

  // 3. Envío: el primer ejercicio mal y después bien (el cliente miente «correct»); el resto bien.
  const right = (e: ExerciseRow) => answerFor(e, true);
  const [first, ...rest] = exercises;
  const attempts = [
    { e: first!, answer: answerFor(first!, false), client_verdict: 'correct' },
    ...rest.map((e) => ({ e, answer: right(e), client_verdict: 'correct' })),
    { e: first!, answer: right(first!), client_verdict: 'correct' },
  ].map((a) => ({
    presentation_id: byExercise.get(a.e.id)!.presentation_id,
    answer: a.answer,
    client_verdict: a.client_verdict,
    response_ms: 1500,
    assists: {},
  }));
  const body = {
    action: 'submit',
    session_id: session,
    lesson_id: lessonId,
    started_at: new Date(Date.now() - 120_000).toISOString(),
    time_zone: 'America/Argentina/Buenos_Aires',
    attempts,
  };
  const saved = await call(body);
  check(saved.status === 200 && saved.data.duplicate === false, 'submit → 200', saved);
  const verdicts = (saved.data.verdicts ?? []) as {
    attempt_no: number;
    status: string;
    verdict: string;
  }[];
  check(verdicts.length === attempts.length, 'un veredicto por intento', verdicts.length);
  check(
    verdicts[0]?.verdict === 'incorrect' && verdicts[0]?.attempt_no === 1,
    'la respuesta equivocada es incorrect aunque el cliente diga correct',
    verdicts[0],
  );
  check(
    verdicts
      .slice(1)
      .every((v) => v.status === 'valid' && (v.verdict === 'correct' || v.verdict === 'typo')),
    'el resto, correct',
    verdicts,
  );
  check(verdicts.at(-1)?.attempt_no === 2, 'reintento = intento 2', verdicts.at(-1));
  check(
    saved.data.first_try_correct === exercises.length - 1,
    'first_try_correct = n − 1',
    saved.data,
  );

  // 4. Reenvío (reintento de red): mismo resultado, nada nuevo.
  const resent = await call(body);
  check(
    resent.data.duplicate === true &&
      JSON.stringify(resent.data.verdicts) === JSON.stringify(saved.data.verdicts),
    'reenvío → duplicate con los mismos veredictos',
    resent.data,
  );
  const closed = await call({ action: 'start', session_id: session, lesson_id: lessonId });
  check(
    closed.status === 409 && closed.data.error === 'session_closed',
    'start después de enviar → 409',
    closed,
  );

  await db.auth.signOut();
  console.log(`\nsession_id = ${session}`);
  console.log('Verificación en la base (sólo lectura), §7 de docs/LEARNING_ATTEMPTS_PHASE2.md.');
  console.log(failures === 0 ? '\nTODO OK' : `\n${failures} comprobaciones fallaron`);
  process.exit(failures === 0 ? 0 : 1);
}

/** Respuesta correcta o equivocada desde el ejercicio publicado (la app también lo lee). */
function answerFor(e: ExerciseRow, correct: boolean) {
  const p = e.payload;
  switch (e.type) {
    case 'image_choice':
    case 'translation_choice':
    case 'fill_blank':
    case 'listen_choice':
    case 'context_choice': {
      const options = p.options as string[];
      return { kind: 'option', value: correct ? e.answer : options.find((o) => o !== e.answer)! };
    }
    case 'match_pairs': {
      const pairs = p.pairs as { left: string; right: string }[];
      return {
        kind: 'pairs',
        value: correct
          ? pairs
          : pairs.map((x, i) => ({ left: x.left, right: pairs[(i + 1) % pairs.length]!.right })),
      };
    }
    case 'order_words': {
      const pool = [...(p.tokens as string[])];
      const tokens = e.answer.split(/\s+/).map((w) => {
        const k = pool.findIndex((t) => t === w || t === w.replace(/[.,!?。，！？]+$/u, ''));
        return pool.splice(k, 1)[0]!;
      });
      return { kind: 'tokens', value: correct ? tokens : [...tokens].reverse() };
    }
    default:
      return { kind: 'text', value: correct ? e.answer : 'zzzz' };
  }
}

main().catch((err) => {
  console.error(`ERROR: ${(err as Error).message}`);
  process.exit(1);
});
