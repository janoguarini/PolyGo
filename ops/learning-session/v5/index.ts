// Lecciones con presentación registrada y corrección en el servidor (fase 2,
// docs/LEARNING_ATTEMPTS_PHASE2.md).
//
//   POST {action: 'start', session_id, lesson_id}
//     → registra una presentación por ejercicio (versión, conjunto y orden de opciones) y devuelve
//       lo que la app tiene que mostrar. Idempotente por session_id.
//   POST {action: 'submit', session_id, lesson_id, started_at, time_zone, attempts: [{presentation_id,
//         answer: UserAnswer, client_verdict, response_ms, assists}]}
//     → corrige cada respuesta con shared/grading.ts contra la versión presentada y lo guarda todo en
//       una transacción (learning_submit_graded → submit_learning_session sin cambios). Idempotente
//       por session_id: un reenvío devuelve el mismo resultado.
//
//   POST {action: 'start_review', session_id, language_code, time_zone}
//     → fase 3: el servidor arma el repaso (shared/adaptivePlanner.ts sobre learning_review_candidates:
//       SRS v2 + Mastery Engine), registra el plan y las presentaciones exactas (ítems del catálogo con
//       su versión vigente y su conjunto de opciones) y devuelve lo que la app tiene que mostrar.
//       Sin nada elegible: {status: 'up_to_date' | 'budget_exhausted', presentations: []}.
//   POST {action: 'submit_review', session_id, started_at, time_zone, attempts}
//     → corrige cada respuesta (una por presentación) y guarda en una transacción
//       (learning_submit_review_graded → submit_learning_session('review') sin cambios).
//
// Fase 4 (docs/LEARNING_PHASE4.md §2):
//   start_review
//     · con el v2 apagado y sin sesión abierta → {status: 'srs_v2_disabled'}: la app usa el repaso de la
//       app vieja como MODO declarado por el servidor (no como respaldo ante un error);
//     · con una sesión abierta (mismo session_id) → la retoma tal cual (duplicate: true), con las
//       respuestas ya corregidas;
//     · una sesión ya enviada → 409 session_closed;
//     · devuelve `items` (learning_review_content: lo que se muestra, sin la respuesta) y `persistent`
//       (AL17: unidades persistentes con la lección de su explicación).
//   POST {action: 'answer_review', session_id, attempt: {presentation_id, answer, client_verdict,
//         response_ms, assists}}
//     → corrige UNA respuesta (gradeReviewAnswer) y la registra; la primera respuesta es la que vale
//       (un reintento devuelve la misma corrección, duplicate: true). El feedback de la app sale de acá.
//   submit_review exige que cada respuesta ya corregida coincida con la registrada (409 answer_mismatch).
//
// Cierre de la fase 4 (docs/LEARNING_PHASE4.md §10):
//   start_review {…, focus?: {kind: 'smart'} | {kind: 'topic', unit_id}}
//     · con `focus` → repaso Plus (P3): el servidor comprueba Plus, elige las palabras con las reglas de
//       shared/focusReview.ts sobre learning_focus_candidates y registra plan y presentaciones
//       (learning_start_focus_review, origen focus_review). Igual con el v2 apagado o encendido: la
//       corrección y el envío son los de cualquier repaso del servidor;
//     · una sesión de otro día (en la zona registrada al iniciarla) → {status: 'session_expired',
//       complete, items}: ya no admite respuestas nuevas; si está completa, la app la envía (P7).
//   answer_review con attempt.attempt_no 2 o 3 → repetición de un error dentro de la sesión (P4):
//     corregida por el servidor y registrada aparte (learning_review_retry); no es evidencia ni se envía.
//
// Fase 5 (docs/LEARNING_PHASE5.md):
//   body.client = {contract, app_version, platform} (opcional; sin él = contrato 1). Se registra por
//     sesión (learning_session_clients) para medir el uso de cada ruta; nunca cambia una corrección.
//   start_review en un idioma sin repasos del servidor (sin contenido publicado o sin ítems corregibles)
//     → {status: 'content_unavailable', coverage}: la app muestra «contenido pendiente», no «al día».
//   start_review sin foco con el SRS v2 apagado (contrato ≥ 2) → repaso básico armado por el servidor con
//     las reglas del SRS v1 (buildBasicPlan + learning_start_basic_review, origen basic_review). Ya no
//     se declara srs_v2_disabled (sólo al contrato 1).
//   submit_review → record_learning_session (ítems de uno o varios conceptos, cualquier dimensión). La
//     respuesta es la de siempre más 'route'. learning_submit_review_graded queda sin uso (para volver atrás).
//
// Los envíos devuelven además `srs`: el estado confirmado de cada unidad en el SRS v2 (srs_seq y
// vencimientos, 13.3), o null mientras el v2 esté apagado.
//
// verify_jwt = false: valida el token del usuario con auth.getUser (igual que delete-account). Las
// funciones SQL que llama sólo las puede ejecutar service_role.
import { createClient } from 'npm:@supabase/supabase-js@2';

import {
  gradeLessonAttempts,
  gradeRecordedAttempts,
  gradeReviewAnswer,
  parseClientInfo,
  LEARNING_GRADER,
  LearningSessionError,
  presentationOrders,
  reviewPresentationOrders,
  withGradingKeys,
} from './core.generated.js';
import { buildBasicPlan, buildFocusPlan, parseFocusRequest } from './focus.generated.js';
import { buildReviewPlan, persistentUnits } from './planner.generated.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-polygo-curriculum-api',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

function secretKey(): string {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
}

/** Cabecera del nivel curricular del cliente (src/lib/clientInfo.ts, fase C.5). */
const CURRICULUM_API_HEADER = 'x-polygo-curriculum-api';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Errores de las funciones SQL que la app sabe manejar (mismos códigos que submit_learning_session). */
const SQL_ERRORS: Record<string, number> = {
  not_authenticated: 401,
  lesson_not_found: 404,
  lesson_locked: 403,
  presentations_not_found: 404,
  session_conflict: 409,
  session_closed: 409,
  no_energy: 402,
  incomplete_lesson: 422,
  invalid_exercise: 422,
  invalid_orders: 422,
  invalid_gradings: 422,
  invalid_request: 400,
  invalid_attempts: 400,
  invalid_started_at: 422,
  attempts_mismatch: 500,
  nothing_to_review: 404,
  invalid_plan: 422,
  answer_mismatch: 409,
  session_expired: 409,
  plus_required: 403,
  retry_not_allowed: 409,
};

function sqlError(error: { message?: string }) {
  const code = Object.keys(SQL_ERRORS).find((k) => error.message === k);
  return code ? json({ error: code }, SQL_ERRORS[code]) : json({ error: 'server_error' }, 500);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);

  // Fase C.7: el nivel curricular del cliente (cabecera de la C.5) viaja a las RPC, donde
  // request_curriculum_api() lo lee para filtrar los repasos por la ruta que esa build puede
  // representar. Sin cabecera o inválida = 0 (cliente antiguo: la ruta de respaldo).
  const curriculumApi = /^[0-9]{1,3}$/.test(req.headers.get(CURRICULUM_API_HEADER)?.trim() ?? '')
    ? String(Number(req.headers.get(CURRICULUM_API_HEADER)!.trim()))
    : '0';
  // O-1 (PRE_RELEASE_VALIDATION.md): sin URL o sin clave de servicio, createClient lanza antes del
  // try principal y la respuesta salía sin JSON ni CORS. La configuración rota se responde como
  // cualquier error del servidor, y se registra para diagnosticarla.
  let admin: ReturnType<typeof createClient>;
  try {
    const url = Deno.env.get('SUPABASE_URL') ?? '';
    const key = secretKey();
    if (!url || !key) throw new Error('SUPABASE_URL o la clave de servicio no están configuradas');
    admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { [CURRICULUM_API_HEADER]: curriculumApi } },
    });
  } catch (e) {
    console.error('learning-session: configuración inválida:', e instanceof Error ? e.message : e);
    return json({ error: 'server_error' }, 500);
  }
  const authResult = await admin.auth.getUser(token).catch((e: unknown) => {
    console.error('learning-session: auth.getUser falló:', e instanceof Error ? e.message : e);
    return null;
  });
  if (!authResult) return json({ error: 'server_error' }, 500);
  const { data: auth, error: authError } = authResult;
  if (authError || !auth.user) return json({ error: 'unauthorized' }, 401);
  const userId = auth.user.id;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const sessionId = body?.session_id;
  if (typeof sessionId !== 'string' || !UUID.test(sessionId)) {
    return json({ error: 'invalid_request' }, 400);
  }
  const timeZone = typeof body?.time_zone === 'string' ? body.time_zone : 'UTC';
  const client = parseClientInfo(body?.client);
  // Contrato mínimo aceptado (docs/LEARNING_PHASE5.md §5). Por defecto 1: no rechaza a nadie. Subirlo
  // es la forma de retirar un contrato viejo sin desplegar otra función: esas builds reciben 426.
  const minContract = Number(Deno.env.get('LEARNING_MIN_CONTRACT') ?? '1');
  if (Number.isInteger(minContract) && client.contract < minContract) {
    return json({ error: 'client_outdated', min_contract: minContract }, 426);
  }
  /** Estado confirmado del SRS v2 de la sesión (después del commit); null con el v2 apagado. */
  const srsResult = async () =>
    (await admin.rpc('srs_v2_session_result', { p_user: userId, p_session_id: sessionId })).data ??
    null;

  try {
    if (body?.action === 'start_review') {
      const lang = body.language_code;
      if (typeof lang !== 'string' || !/^[a-z]{2}$/.test(lang))
        return json({ error: 'invalid_request' }, 400);
      const prepared = await admin.rpc('learning_review_prepare', {
        p_user: userId,
        p_session_id: sessionId,
        p_tz: timeZone,
      });
      if (prepared.error) return sqlError(prepared.error);
      const focus = body.focus === undefined ? null : parseFocusRequest(body.focus);
      if (body.focus !== undefined && !focus) return json({ error: 'invalid_request' }, 400);
      const state = prepared.data as {
        session: 'new' | 'open' | 'expired' | 'closed';
        enabled: boolean;
        source?: string;
        complete?: boolean;
      };
      if (state.session === 'closed') return json({ error: 'session_closed' }, 409);
      // Un session_id guardado para otro tipo de repaso no se mezcla con este.
      if (
        (state.session === 'open' || state.session === 'expired') &&
        (focus
          ? state.source !== 'focus_review'
          : state.source !== 'adaptive_review' && state.source !== 'basic_review')
      ) {
        return json({ error: 'session_conflict' }, 409);
      }
      // Corrección instantánea (docs/LEARNING_INSTANT_REVIEW.md): cada ítem lleva la clave con la que
      // answer_review y submit_review lo corrigen (la presentación registrada), para que la app dé el
      // feedback en el momento. El servidor sigue corrigiendo y registrando cada respuesta. Si la
      // fotografía no se puede leer, los ítems van sin clave y la app espera al servidor como antes.
      const content = async () => {
        const [items, snapshots] = await Promise.all([
          admin.rpc('learning_review_content', { p_user: userId, p_session_id: sessionId }),
          admin.rpc('learning_session_presentations', { p_user: userId, p_session_id: sessionId }),
        ]);
        if (items.error) throw items.error;
        if (snapshots.error || !Array.isArray(snapshots.data) || !Array.isArray(items.data)) {
          return items.data;
        }
        return withGradingKeys(items.data, snapshots.data);
      };
      if (state.session === 'expired') {
        return json({
          session_id: sessionId,
          status: 'session_expired',
          complete: state.complete === true,
          items: await content(),
        });
      }
      if (state.session === 'open') {
        return json({
          session_id: sessionId,
          duplicate: true,
          status: 'ok',
          items: await content(),
        });
      }
      // Un idioma sin repasos del servidor no es «estar al día»: es contenido pendiente (fase 5, C).
      const coverage = await admin.rpc('learning_review_coverage', { p_lang: lang });
      if (coverage.error) return sqlError(coverage.error);
      if (!coverage.data) return json({ error: 'invalid_request' }, 400);
      if (coverage.data.available !== true) {
        return json({
          session_id: sessionId,
          status: 'content_unavailable',
          coverage: coverage.data,
          presentations: [],
          items: [],
        });
      }
      if (focus) {
        const cand = await admin.rpc('learning_focus_candidates', {
          p_user: userId,
          p_lang: lang,
          p_now: new Date().toISOString(),
        });
        if (cand.error) return sqlError(cand.error);
        if (cand.data?.plus !== true) return json({ error: 'plus_required' }, 403);
        const plan = buildFocusPlan({ ...cand.data, seed: sessionId }, focus);
        if (plan.items.length === 0) {
          return json({ session_id: sessionId, status: plan.status, presentations: [], items: [] });
        }
        const started = await admin.rpc('learning_start_focus_review', {
          p_user: userId,
          p_session_id: sessionId,
          p_lang: lang,
          p_tz: timeZone,
          p_plan: plan,
          p_orders: reviewPresentationOrders(sessionId, plan.items),
        });
        if (started.error) return sqlError(started.error);
        return json({ ...started.data, status: plan.status, items: await content() });
      }
      if (!state.enabled) {
        // Contrato 1 (builds de la fase 4, nunca publicadas): el modo declarado de entonces.
        if (client.contract < 2) {
          return json({
            session_id: sessionId,
            status: 'srs_v2_disabled',
            items: [],
            presentations: [],
          });
        }
        // Cierre de la fase 5: repaso básico autoritativo con el SRS v1. El servidor elige (regla de
        // siempre del repaso básico), registra, corrige y guarda (record_learning_session).
        const cand = await admin.rpc('learning_focus_candidates', {
          p_user: userId,
          p_lang: lang,
          p_now: new Date().toISOString(),
        });
        if (cand.error) return sqlError(cand.error);
        const plan = buildBasicPlan({ ...cand.data, seed: sessionId });
        if (plan.items.length === 0) {
          return json({ session_id: sessionId, status: plan.status, presentations: [], items: [] });
        }
        const started = await admin.rpc('learning_start_basic_review', {
          p_user: userId,
          p_session_id: sessionId,
          p_lang: lang,
          p_tz: timeZone,
          p_plan: plan,
          p_orders: reviewPresentationOrders(sessionId, plan.items),
        });
        if (started.error) return sqlError(started.error);
        return json({ ...started.data, status: plan.status, items: await content() });
      }
      const candidates = await admin.rpc('learning_review_candidates', {
        p_user: userId,
        p_lang: lang,
        p_tz: timeZone,
        p_now: new Date().toISOString(),
      });
      if (candidates.error) return sqlError(candidates.error);
      const input = { ...candidates.data, seed: sessionId };
      const plan = buildReviewPlan(input);
      const persistent = persistentUnits(input);
      if (plan.items.length === 0) {
        return json({
          session_id: sessionId,
          status: plan.status,
          recommend_lesson: plan.recommend_lesson,
          presentations: [],
          items: [],
          plan: [],
          persistent,
        });
      }
      const started = await admin.rpc('learning_start_review', {
        p_user: userId,
        p_session_id: sessionId,
        p_lang: lang,
        p_tz: timeZone,
        p_plan: plan,
        p_orders: reviewPresentationOrders(sessionId, plan.items),
      });
      if (started.error) return sqlError(started.error);
      return json({
        ...started.data,
        status: plan.status,
        recommend_lesson: plan.recommend_lesson,
        items: await content(),
        persistent,
      });
    }

    if (body?.action === 'answer_review') {
      const snapshots = await admin.rpc('learning_session_presentations', {
        p_user: userId,
        p_session_id: sessionId,
      });
      if (snapshots.error) return sqlError(snapshots.error);
      const words = await admin.rpc('learning_review_words', {
        p_user: userId,
        p_session_id: sessionId,
      });
      if (words.error) return sqlError(words.error);
      const rawNo = (body.attempt as { attempt_no?: unknown } | null)?.attempt_no;
      const attemptNo = rawNo === undefined || rawNo === null ? 1 : rawNo;
      if (typeof attemptNo !== 'number') return json({ error: 'invalid_request' }, 400);
      const one = gradeReviewAnswer(snapshots.data, body.attempt, words.data, attemptNo);
      // Primer intento: la respuesta que vale. Repetición (P4): sólo feedback, no evidencia.
      const saved = await admin.rpc(
        attemptNo === 1 ? 'learning_review_answer' : 'learning_review_retry',
        {
          p_user: userId,
          p_session_id: sessionId,
          p_grading: one.grading,
          p_response_ms: one.responseMs,
          p_grader: LEARNING_GRADER,
        },
      );
      if (saved.error) return sqlError(saved.error);
      return json(saved.data);
    }

    if (body?.action === 'submit_review') {
      const startedAt = body.started_at;
      if (typeof startedAt !== 'string' || Number.isNaN(Date.parse(startedAt))) {
        return json({ error: 'invalid_request' }, 400);
      }
      const snapshots = await admin.rpc('learning_session_presentations', {
        p_user: userId,
        p_session_id: sessionId,
      });
      if (snapshots.error) return sqlError(snapshots.error);
      const words = await admin.rpc('learning_review_words', {
        p_user: userId,
        p_session_id: sessionId,
      });
      if (words.error) return sqlError(words.error);
      const gradings = gradeRecordedAttempts(
        snapshots.data,
        Array.isArray(body.attempts) ? body.attempts : [],
        words.data,
      );
      const saved = await admin.rpc('record_learning_session', {
        p_user: userId,
        p_session_id: sessionId,
        p_started_at: startedAt,
        p_time_zone: timeZone,
        p_gradings: gradings,
        p_grader: LEARNING_GRADER,
        p_client: client,
      });
      if (saved.error) return sqlError(saved.error);
      return json({ ...saved.data, srs: await srsResult() });
    }

    const lessonId = body?.lesson_id;
    if (typeof lessonId !== 'string') return json({ error: 'invalid_request' }, 400);

    if (body?.action === 'start') {
      const plan = await admin.rpc('learning_lesson_plan', {
        p_user: userId,
        p_lesson_id: lessonId,
      });
      if (plan.error) return sqlError(plan.error);
      const orders = presentationOrders(sessionId, plan.data);
      const started = await admin.rpc('learning_start_lesson', {
        p_user: userId,
        p_session_id: sessionId,
        p_lesson_id: lessonId,
        p_orders: orders,
      });
      if (started.error) return sqlError(started.error);
      return json(started.data);
    }

    if (body?.action === 'submit') {
      const startedAt = body.started_at;
      if (typeof startedAt !== 'string' || Number.isNaN(Date.parse(startedAt))) {
        return json({ error: 'invalid_request' }, 400);
      }
      const snapshots = await admin.rpc('learning_session_presentations', {
        p_user: userId,
        p_session_id: sessionId,
      });
      if (snapshots.error) return sqlError(snapshots.error);
      const graded = gradeLessonAttempts(
        snapshots.data,
        Array.isArray(body.attempts) ? body.attempts : [],
      );
      const saved = await admin.rpc('learning_submit_graded', {
        p_user: userId,
        p_session_id: sessionId,
        p_lesson_id: lessonId,
        p_started_at: startedAt,
        p_time_zone: timeZone,
        p_attempts: graded.attempts,
        p_gradings: graded.gradings,
        p_grader: LEARNING_GRADER,
      });
      if (saved.error) return sqlError(saved.error);
      // Registro del cliente (sólo medición): nunca hace fallar un envío ya guardado.
      await admin.rpc('learning_note_client', {
        p_user: userId,
        p_session_id: sessionId,
        p_route: 'lesson_graded',
        p_client: client,
      });
      return json({ ...saved.data, srs: await srsResult() });
    }

    return json({ error: 'invalid_action' }, 400);
  } catch (err) {
    if (err instanceof LearningSessionError) return json({ error: err.code }, 422);
    console.error(err);
    return json({ error: 'server_error' }, 500);
  }
});
