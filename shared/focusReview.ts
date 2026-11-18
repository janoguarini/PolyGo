/**
 * Repasos de PolyGo Plus (inteligente y por tema) — reglas de selección compartidas por la app (para
 * contar lo disponible) y por el servidor (que arma, registra y corrige la sesión: cierre de la fase 4,
 * docs/LEARNING_PHASE4.md §10, P3). Código puro, sin dependencias de la app.
 *
 * Las reglas son las mismas de siempre (sin IA ni modelo adaptativo) sobre el historial real del SRS v1
 * (user_word_progress). Plus elige QUÉ se repasa; no cambia cómo se corrige, cómo se registra ni los
 * parámetros del SRS (AL11): el envío va por la misma vía que cualquier repaso del servidor.
 */

/** Palabras por sesión de repaso inteligente (el básico usa 10). */
export const SMART_REVIEW_SIZE = 15;
/** Palabras por sesión de repaso por tema. */
export const TOPIC_REVIEW_SIZE = 15;
/** «Por olvidar»: el repaso espaciado la pide dentro de este plazo. */
export const DUE_SOON_MS = 24 * 60 * 60 * 1000;

/**
 * focus-1.0.0 → 1.1.0 (fase 5, docs/LEARNING_PHASE5.md): admite ítems de varios conceptos (todas sus
 * palabras ya estudiadas: lo filtra el servidor). Mismas reglas de selección de palabras; una palabra no
 * aparece en dos entradas de la sesión, tampoco como concepto secundario de otro ítem.
 */
export const FOCUS_PLANNER_VERSION = 'focus-1.1.0';

export type SmartReason = 'due' | 'frequent_mistakes' | 'difficult' | 'due_soon';

/** Lo que las reglas necesitan de cada palabra estudiada (forma de WordProgressEntry en la app). */
export interface FocusProgress {
  word: { id: string; unit_id: string | null };
  stage: number;
  seenCount: number;
  incorrectCount: number;
  nextReviewAt: string | null;
}

const dueAtOf = (e: FocusProgress) =>
  e.nextReviewAt === null ? Infinity : new Date(e.nextReviewAt).getTime();
const isDue = (e: FocusProgress, now: number) =>
  e.nextReviewAt !== null && new Date(e.nextReviewAt).getTime() <= now;

/**
 * Repaso inteligente. Reglas fijas sobre tu historial real:
 * 1. vencidas según el repaso espaciado (más errores primero),
 * 2. errores frecuentes (2 o más),
 * 3. difíciles: te equivocaste en al menos un tercio de las veces o siguen en la etapa inicial
 *    después de verlas varias veces,
 * 4. por olvidar: el repaso espaciado las pide en las próximas 24 h.
 * Sin repetidas. Las que no encajan en ninguna regla no entran.
 */
export function pickSmartReview<T extends FocusProgress>(
  entries: readonly T[],
  now: number,
  size = SMART_REVIEW_SIZE,
): { entry: T; reason: SmartReason }[] {
  const errorRate = (e: T) => (e.seenCount > 0 ? e.incorrectCount / e.seenCount : 0);
  const studied = entries.filter((e) => e.seenCount > 0);

  const buckets: [SmartReason, T[]][] = [
    [
      'due',
      studied
        .filter((e) => dueAtOf(e) <= now)
        .sort((a, b) => b.incorrectCount - a.incorrectCount || dueAtOf(a) - dueAtOf(b)),
    ],
    [
      'frequent_mistakes',
      studied
        .filter((e) => e.incorrectCount >= 2)
        .sort((a, b) => b.incorrectCount - a.incorrectCount || errorRate(b) - errorRate(a)),
    ],
    [
      'difficult',
      studied
        .filter((e) => errorRate(e) >= 1 / 3 || (e.stage === 0 && e.seenCount >= 3))
        .sort((a, b) => errorRate(b) - errorRate(a) || a.stage - b.stage),
    ],
    [
      'due_soon',
      studied
        .filter((e) => dueAtOf(e) > now && dueAtOf(e) <= now + DUE_SOON_MS)
        .sort((a, b) => dueAtOf(a) - dueAtOf(b)),
    ],
  ];

  const picked = new Set<string>();
  const result: { entry: T; reason: SmartReason }[] = [];
  for (const [reason, list] of buckets) {
    for (const entry of list) {
      if (result.length >= size) return result;
      if (picked.has(entry.word.id)) continue;
      picked.add(entry.word.id);
      result.push({ entry, reason });
    }
  }
  return result;
}

/**
 * Repaso por tema: sólo palabras estudiadas de una unidad. Primero las vencidas, después las que más
 * errores tienen, después las de etapa más baja; si sobran, las que menos tiempo falta para repasar.
 */
export function pickTopicReview<T extends FocusProgress>(
  entries: readonly T[],
  unitId: string,
  now: number,
  size = TOPIC_REVIEW_SIZE,
): T[] {
  return entries
    .filter((e) => e.seenCount > 0 && e.word.unit_id === unitId)
    .sort(
      (a, b) =>
        Number(isDue(b, now)) - Number(isDue(a, now)) ||
        b.incorrectCount - a.incorrectCount ||
        a.stage - b.stage ||
        dueAtOf(a) - dueAtOf(b),
    )
    .slice(0, size);
}

export interface TopicUnit {
  id: string;
  level: string;
  title: string;
  emoji: string;
}

export interface TopicSummary {
  unit: TopicUnit;
  /** Palabras de la unidad que ya estudiaste. */
  studied: number;
  /** De esas, cuántas toca repasar ahora. */
  due: number;
  /** De esas, cuántas tienen algún error. */
  withMistakes: number;
}

/** Unidades con palabras estudiadas, en el orden del currículo (sin las que no tienen ninguna). */
export function topicSummaries(
  units: readonly TopicUnit[],
  entries: readonly FocusProgress[],
  now: number,
): TopicSummary[] {
  return units.flatMap((unit) => {
    const mine = entries.filter((e) => e.seenCount > 0 && e.word.unit_id === unit.id);
    if (mine.length === 0) return [];
    return [
      {
        unit,
        studied: mine.length,
        due: mine.filter((e) => isDue(e, now)).length,
        withMistakes: mine.filter((e) => e.incorrectCount > 0).length,
      },
    ];
  });
}

// ---------------------------------------------------------------------------------------------
// Plan del servidor (Edge Function learning-session, start_review con `focus`).

export type FocusRequest = { kind: 'smart' } | { kind: 'topic'; unit_id: string };

/** Ítem del catálogo presentable para la palabra (review_item_candidates, dimensión vocabulario). */
export interface FocusItem {
  item_id: string;
  dimension: string;
  rung: string;
  option_count: number | null;
  last_presented_at: string | null;
  /** Conceptos target del ítem (fase 5). Ausente = sólo el de la palabra. */
  concepts?: string[];
}

export interface FocusCandidate extends FocusProgress {
  items: FocusItem[];
}

/** Lo que devuelve learning_focus_candidates. */
export interface FocusInput {
  now: string;
  words: FocusCandidate[];
  seed: string;
}

export interface FocusPlanItem {
  position: number;
  item_id: string;
  concept_id: string;
  dimension: string;
  rung: string;
  reason: SmartReason | 'topic';
  option_count: number | null;
}

export interface FocusPlan {
  planner_version: string;
  focus: FocusRequest;
  capacity: number;
  status: 'ok' | 'up_to_date';
  items: FocusPlanItem[];
}

/** FNV-1a de 32 bits (desempate determinista por sesión). */
function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/**
 * Ítem para la palabra: el presentado hace más tiempo (o nunca), desempate determinista por sesión.
 * Rota los ítems del catálogo sin elegir por dificultad: Plus no da ventajas en la corrección.
 */
export function pickFocusItem(
  items: readonly FocusItem[],
  seed: string,
  blocked: ReadonlySet<string> = new Set(),
): FocusItem | null {
  const last = (i: FocusItem) =>
    i.last_presented_at === null ? -Infinity : Date.parse(i.last_presented_at);
  return (
    items
      .filter((i) => !(i.concepts ?? []).some((c) => blocked.has(c)))
      .sort(
        (a, b) =>
          last(a) - last(b) ||
          fnv(`${seed}:${a.item_id}`) - fnv(`${seed}:${b.item_id}`) ||
          (a.item_id < b.item_id ? -1 : 1),
      )[0] ?? null
  );
}

/**
 * Plan de un repaso Plus. Mismas reglas que la app vieja, sobre las palabras que el servidor puede
 * presentar y corregir (con al menos un ítem del catálogo): una palabra sin ítem no entra, en lugar de
 * corregirse en el dispositivo. Una entrada por palabra (la RPC de repasos registra una palabra por
 * intento).
 */
export function buildFocusPlan(input: FocusInput, focus: FocusRequest): FocusPlan {
  const now = Date.parse(input.now);
  const presentable = input.words.filter((w) => w.items.length > 0);
  const picked: { entry: FocusCandidate; reason: SmartReason | 'topic' }[] =
    focus.kind === 'smart'
      ? pickSmartReview(presentable, now)
      : pickTopicReview(presentable, focus.unit_id, now).map((entry) => ({
          entry,
          reason: 'topic' as const,
        }));
  const items: FocusPlanItem[] = [];
  const taken = new Set<string>();
  for (const { entry, reason } of picked) {
    if (taken.has(entry.word.id)) continue;
    const item = pickFocusItem(entry.items, input.seed, taken);
    if (!item) continue;
    taken.add(entry.word.id);
    for (const c of item.concepts ?? []) taken.add(c);
    items.push({
      position: items.length + 1,
      item_id: item.item_id,
      concept_id: entry.word.id,
      dimension: item.dimension,
      rung: item.rung,
      reason,
      option_count: item.option_count,
    });
  }
  return {
    planner_version: FOCUS_PLANNER_VERSION,
    focus,
    capacity: focus.kind === 'smart' ? SMART_REVIEW_SIZE : TOPIC_REVIEW_SIZE,
    status: items.length > 0 ? 'ok' : 'up_to_date',
    items,
  };
}

/** Valida el pedido de foco que llega a la Edge Function. */
export function parseFocusRequest(raw: unknown): FocusRequest | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.kind === 'smart') return { kind: 'smart' };
  // El id de la unidad sólo filtra palabras del propio usuario: uno inexistente da un repaso vacío.
  if (r.kind === 'topic' && typeof r.unit_id === 'string' && /^[\w-]{1,100}$/.test(r.unit_id)) {
    return { kind: 'topic', unit_id: r.unit_id };
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Repaso básico autoritativo con el SRS v1 (cierre de la fase 5, docs/LEARNING_PHASE5.md §11). Con el
// SRS v2 apagado el servidor arma el repaso básico con LA MISMA regla que usaba la app
// (src/app/review.tsx, LegacyReviewScreen): palabras vencidas del v1 (`nextReviewAt ≤ ahora`), las de
// más errores primero (empate: la que venció antes, después el id), hasta 10. Se registra con origen
// basic_review y se guarda por record_learning_session; no cambia ningún parámetro del v1.

export const BASIC_REVIEW_SIZE = 10;
export const BASIC_PLANNER_VERSION = 'basic-1.0.0';

export interface BasicPlan {
  planner_version: string;
  focus: { kind: 'basic' };
  capacity: number;
  status: 'ok' | 'up_to_date';
  items: (Omit<FocusPlanItem, 'reason'> & { reason: 'due' })[];
}

/** Orden de la app vieja: vencidas, más errores primero; empate por vencimiento y por id (determinista). */
export function pickBasicReview<T extends FocusProgress>(entries: readonly T[], now: number): T[] {
  return entries
    .filter((e) => e.seenCount > 0 && isDue(e, now))
    .sort(
      (a, b) =>
        b.incorrectCount - a.incorrectCount ||
        dueAtOf(a) - dueAtOf(b) ||
        (a.word.id < b.word.id ? -1 : a.word.id > b.word.id ? 1 : 0),
    );
}

/**
 * Plan del repaso básico sobre las palabras que el servidor puede presentar y corregir. Recorre las
 * vencidas en el orden de la regla y toma hasta 10 con un ítem presentable; una palabra ya cubierta por
 * un ítem de varios conceptos no se repite (cada concepto se actualiza una sola vez por sesión).
 */
export function buildBasicPlan(input: FocusInput): BasicPlan {
  const ordered = pickBasicReview(
    input.words.filter((w) => w.items.length > 0),
    Date.parse(input.now),
  );
  const items: BasicPlan['items'] = [];
  const taken = new Set<string>();
  for (const entry of ordered) {
    if (items.length >= BASIC_REVIEW_SIZE) break;
    if (taken.has(entry.word.id)) continue;
    const item = pickFocusItem(entry.items, input.seed, taken);
    if (!item) continue;
    taken.add(entry.word.id);
    for (const c of item.concepts ?? []) taken.add(c);
    items.push({
      position: items.length + 1,
      item_id: item.item_id,
      concept_id: entry.word.id,
      dimension: item.dimension,
      rung: item.rung,
      reason: 'due',
      option_count: item.option_count,
    });
  }
  return {
    planner_version: BASIC_PLANNER_VERSION,
    focus: { kind: 'basic' },
    capacity: BASIC_REVIEW_SIZE,
    status: items.length > 0 ? 'ok' : 'up_to_date',
    items,
  };
}
