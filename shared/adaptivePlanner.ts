/**
 * Armador de sesiones de repaso (`planner-2.1.0`, docs/ADAPTIVE_LEARNING_DESIGN.md rev. 4.2, 8.1–8.4,
 * 7.2–7.3, AL7, AL8, AL19, AL21). Puro y determinista: recibe el estado del servidor
 * (learning_review_candidates) y devuelve el plan con motivos. Lo ejecuta la Edge Function
 * learning-session; la app nunca decide qué concepto ni qué ítem se repasa.
 *
 * Reglas:
 *  - Presupuesto estricto (AL21): ningún plan supera lo que queda de B ni el tamaño S.
 *  - Reserva para lecciones 20 % (⌊(B + 2)/5⌋), 0 % con deuda > 1·B o con AL19 activa (AL7, AL19).
 *  - Vencidos del SRS primero, por due_at (8.3). Nunca una unidad vista hoy (I3b).
 *  - Plaza mínima semanal para un débil o un sondeo (AL8), dentro de B, alternando.
 *  - Lugares libres: R5 débiles, R3 sondeos, R4 fluidez; adelantos del motor (≤ ⌈0,2·S⌉, I7);
 *    recién aprendidas (n ≤ 2); por vencer (≤ 2 días, R ascendente).
 *  - El motor sólo entra si su versión está habilitada para Adaptive; nunca cambia S ni D.
 *  - Escalón: el k de la unidad; dominada o sondeo → escalón objetivo (8.4). Si no hay ítem en ese
 *    escalón, la unidad no entra (sigue vencida): no se sustituye por otro escalón.
 *
 * planner-2.1.0 (fase 4, docs/LEARNING_PHASE4.md §5): completa R5 tal como está aprobada (7.3):
 *  - respaldo sin motor: D ≥ 6,85 **o ≥ 2 errores plenos en 30 días** (historial srs_unit_updates);
 *  - máximo 2 débiles por objetivo por sesión (sólo cuando la unidad tiene objetivos `core`; hoy el
 *    catálogo no tiene objetivos y la regla no recorta nada);
 *  - un concepto entra una sola vez por sesión aunque tenga varias dimensiones (la RPC de repasos
 *    registra una palabra por intento);
 *  - AL17: `persistentUnits` marca las unidades con λ ≥ 4 en 30 días y D ≥ 8,2 (19.3, provisional,
 *    F9) para ofrecer la explicación de la lección. No cambia el plan.
 */
import {
  addDays,
  type Dimension,
  effectiveDueMs,
  lessonReserve,
  localDate,
  retrievability,
  type Rung,
  SRS_PLANNER_VERSION,
  targetRung,
} from './srs2';

/**
 * planner-2.0.0 (fase 3) → 2.1.0: R5 completa, tope por objetivo y un concepto por sesión.
 * 2.1.0 → 2.2.0 (fase 5, docs/LEARNING_PHASE5.md): ítems de varios conceptos. Un concepto sigue
 * apareciendo en una sola entrada por sesión, contando también los conceptos secundarios de cada ítem
 * (sin doble evidencia en la misma sesión); un ítem cuyo concepto ya está tomado no se elige.
 */
export const PLANNER_VERSION = 'planner-2.2.0';
/** Versión de la capa del SRS a la que pertenece el armador (srs2.ts). */
export const PLANNER_SRS_LAYER = SRS_PLANNER_VERSION;

export const PLANNER = {
  version: PLANNER_VERSION,
  sessionSize: 15,
  weakDifficulty: 6.85,
  probeConfidence: 0.35,
  probeMinN: 3,
  fluencyRatio: 1.5,
  fluencyMastery: 0.7,
  advancedShare: 0.2,
  dueSoonDays: 2,
  /** R5, respaldo del SRS: errores plenos en 30 días (7.3). */
  weakErrors30d: 2,
  /** R5: máximo de débiles por objetivo y sesión (7.3). */
  weakPerObjective: 2,
  /** AL17 (19.3, provisional; F9): λ en 30 días y D. */
  persistentErrors30d: 4,
  persistentDifficulty: 8.2,
  al8Days: 7,
  recentDays: 7,
} as const;

export type PlanReason =
  'due' | 'weak' | 'probe' | 'fluency' | 'me_advanced' | 'recent' | 'due_soon';

export interface PlannerItem {
  item_id: string;
  rung: Rung;
  item_type: string;
  input_modality: string;
  /** Opciones del conjunto del catálogo (ítems de elección); nulo en los de texto. */
  option_count?: number | null;
  /** Última vez que este usuario vio el ítem (cualquier sesión); nulo si nunca. */
  last_presented_at: string | null;
  /** Conceptos target del ítem (fase 5). Ausente = sólo el de la unidad. */
  concepts?: string[];
}

/** Conceptos que un ítem acredita: los suyos, o sólo el de la unidad si no vienen. */
export const itemConcepts = (i: { concepts?: string[] }, unitConcept: string) =>
  i.concepts && i.concepts.length > 0 ? i.concepts : [unitConcept];

export interface PlannerMastery {
  enabled: boolean;
  status: 'insufficient' | 'in_progress' | 'mastered';
  mastery: number | null;
  confidence: number | null;
  weak: boolean;
  recall_speed: number | null;
  transfer_met: boolean;
}

export interface PlannerUnit {
  concept_id: string;
  dimension: Dimension;
  level: string;
  due_at: string;
  due_effective_at: string;
  me_hint_expires_at: string | null;
  last_seen_at: string;
  t_last: string | null;
  stability: number | null;
  difficulty: number | null;
  n: number;
  rung: Rung;
  mastery: PlannerMastery | null;
  items: PlannerItem[];
  /** Errores plenos en los 30 días anteriores a `now` (srs_unit_updates). Ausente = 0. */
  errors_30d?: number;
  /** Falso si la ventana de 30 días no está cubierta por el historial (unidad convertida, 15.3). */
  errors_window_complete?: boolean;
  /** Objetivos `core` activos de la unidad (R5: máximo 2 por objetivo). */
  objective_ids?: string[];
  /** Lección con la explicación del concepto (AL17); nula si no hay ninguna publicada. */
  intro_lesson_id?: string | null;
}

export interface PlannerInput {
  now: string;
  time_zone: string;
  seed: string;
  budget: {
    B: number;
    /** Primeros intentos de repasos (adaptive_review y de la app vieja) del día local. */
    reviews_today: number;
    /** Primeros intentos de cualquier sesión del día local. */
    all_today: number;
    /** Adelantos del motor ya servidos hoy. */
    advanced_today: number;
    /** No hubo ningún adaptive_review hoy (la plaza de AL8 va en la primera sesión del día). */
    first_review_today: boolean;
  };
  debt: { al19_active: boolean; debt_items: number };
  al8: { last_attended_date: string | null; last_kind: 'weak' | 'probe' | null };
  user_median_speed: number | null;
  units: PlannerUnit[];
}

export interface PlanItem {
  position: number;
  concept_id: string;
  dimension: Dimension;
  item_id: string;
  option_count: number | null;
  rung: Rung;
  reason: PlanReason;
  prio: number;
  due: string;
}

export interface Plan {
  planner_version: string;
  status: 'ok' | 'up_to_date' | 'budget_exhausted';
  capacity: number;
  reserve: number;
  recommend_lesson: boolean;
  items: PlanItem[];
  skipped: { concept_id: string; dimension: Dimension; reason: 'no_item_at_rung' }[];
}

const DAY = 86_400_000;

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const key = (u: { concept_id: string; dimension: string }) => `${u.concept_id}|${u.dimension}`;
const ms = (s: string) => Date.parse(s);

function daysBetween(a: string, b: string): number {
  return Math.round(
    (Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) -
      Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) /
      DAY,
  );
}

function motor(u: PlannerUnit): PlannerMastery | null {
  return u.mastery && u.mastery.enabled ? u.mastery : null;
}

export function isWeak(u: PlannerUnit): boolean {
  const m = motor(u);
  if (m) return m.status !== 'insufficient' && m.weak;
  return (
    (u.difficulty !== null && u.difficulty >= PLANNER.weakDifficulty) ||
    (u.errors_30d ?? 0) >= PLANNER.weakErrors30d
  );
}

/**
 * AL17: unidades persistentes (λ ≥ 4 en 30 días y D ≥ 8,2; umbrales provisionales de 19.3, F9). Con la
 * ventana incompleta (unidad convertida hace menos de 30 días) no se marca: faltaría historial.
 */
export function isPersistent(u: PlannerUnit): boolean {
  return (
    u.errors_window_complete !== false &&
    (u.errors_30d ?? 0) >= PLANNER.persistentErrors30d &&
    u.difficulty !== null &&
    u.difficulty >= PLANNER.persistentDifficulty
  );
}

export interface PersistentUnit {
  concept_id: string;
  dimension: Dimension;
  errors_30d: number;
  difficulty: number;
  intro_lesson_id: string | null;
}

/** AL17: lo que la app ofrece («volver a la explicación»). No forma parte del plan. */
export function persistentUnits(input: PlannerInput): PersistentUnit[] {
  return input.units
    .filter(isPersistent)
    .sort((a, b) => (b.errors_30d ?? 0) - (a.errors_30d ?? 0) || (key(a) < key(b) ? -1 : 1))
    .map((u) => ({
      concept_id: u.concept_id,
      dimension: u.dimension,
      errors_30d: u.errors_30d ?? 0,
      difficulty: u.difficulty ?? 0,
      intro_lesson_id: u.intro_lesson_id ?? null,
    }));
}

export function isProbe(u: PlannerUnit): boolean {
  const m = motor(u);
  return (
    !!m &&
    u.n >= PLANNER.probeMinN &&
    (m.status === 'insufficient' || (m.confidence ?? 0) < PLANNER.probeConfidence)
  );
}

export function isFluency(u: PlannerUnit, median: number | null): boolean {
  const m = motor(u);
  return (
    !!m &&
    median !== null &&
    m.recall_speed !== null &&
    m.mastery !== null &&
    m.recall_speed >= PLANNER.fluencyRatio * median &&
    m.mastery >= PLANNER.fluencyMastery
  );
}

/** Ítem para la unidad (8.4): escalón k (objetivo si dominada o sondeo); null si no hay. */
export function chooseItem(
  u: PlannerUnit,
  reason: PlanReason,
  nowMs: number,
  seed: string,
  prevModality: string | null,
  blocked: ReadonlySet<string> = new Set(),
): PlannerItem | null {
  const m = motor(u);
  const rung =
    m?.status === 'mastered' || reason === 'probe' ? targetRung(u.dimension, u.level) : u.rung;
  const pool = u.items.filter(
    (i) => i.rung === rung && !itemConcepts(i, u.concept_id).some((c) => blocked.has(c)),
  );
  if (pool.length === 0) return null;
  const wantNew = u.n >= 3 && !!m && !m.transfer_met;
  const score = (i: PlannerItem) => {
    const recent =
      i.last_presented_at !== null && nowMs - ms(i.last_presented_at) < PLANNER.recentDays * DAY;
    return [
      recent ? 1 : 0,
      wantNew && i.last_presented_at !== null ? 1 : 0,
      prevModality !== null && i.input_modality === prevModality ? 1 : 0,
      fnv(`${seed}:${i.item_id}`),
    ];
  };
  return [...pool].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    for (let k = 0; k < sa.length; k++) if (sa[k] !== sb[k]) return sa[k]! - sb[k]!;
    return a.item_id < b.item_id ? -1 : 1;
  })[0]!;
}

/** Intercalado (8.4): primero y último de R alta; ≤ 2 seguidos del mismo tipo; ≥ 3 entre conceptos iguales. */
function interleave(
  chosen: (PlanItem & { R: number; type: string })[],
): (PlanItem & { R: number; type: string })[] {
  if (chosen.length <= 2) return chosen;
  const byR = [...chosen].sort((a, b) => b.R - a.R || (key(a) < key(b) ? -1 : 1));
  const first = byR[0]!;
  const last = byR[1]!;
  const middle = chosen.filter((x) => x !== first && x !== last);
  const out = [first];
  const rest = [...middle];
  while (rest.length) {
    const ok = (x: (typeof rest)[number]) => {
      const n = out.length;
      const sameType = n >= 2 && out[n - 1]!.type === x.type && out[n - 2]!.type === x.type;
      const near = out.slice(-3).some((y) => y.concept_id === x.concept_id);
      return !sameType && !near;
    };
    const i = rest.findIndex(ok);
    out.push(rest.splice(i >= 0 ? i : 0, 1)[0]!);
  }
  out.push(last);
  return out;
}

export function buildReviewPlan(input: PlannerInput): Plan {
  const nowMs = ms(input.now);
  const tz = input.time_zone;
  const today = localDate(nowMs, tz);
  const { B } = input.budget;
  const reserve = input.debt.al19_active || input.debt.debt_items > B ? 0 : lessonReserve(B);
  const remaining = Math.min(B - reserve - input.budget.reviews_today, B - input.budget.all_today);
  const capacity = Math.max(0, Math.min(PLANNER.sessionSize, remaining));
  const base: Plan = {
    planner_version: PLANNER.version,
    status: 'ok',
    capacity,
    reserve,
    recommend_lesson: reserve > 0,
    items: [],
    skipped: [],
  };

  const eligible = input.units
    .filter((u) => localDate(ms(u.last_seen_at), tz) !== today)
    .sort((a, b) => ms(a.due_at) - ms(b.due_at) || (key(a) < key(b) ? -1 : 1));
  const isDue = (u: PlannerUnit) => localDate(ms(u.due_at), tz) <= today;
  const due = eligible.filter(isDue);
  if (capacity <= 0) return { ...base, status: due.length ? 'budget_exhausted' : 'up_to_date' };

  const taken = new Set<string>();
  // Un concepto por sesión, contando los secundarios de los ítems de varios conceptos (2.2.0).
  const takenConcepts = new Set<string>();
  // R5: débiles por objetivo en esta sesión.
  const weakByObjective = new Map<string, number>();
  const objectiveFull = (u: PlannerUnit) =>
    (u.objective_ids ?? []).some((o) => (weakByObjective.get(o) ?? 0) >= PLANNER.weakPerObjective);
  const chosen: (PlanItem & { R: number; type: string })[] = [];
  let prevModality: string | null = null;
  const take = (u: PlannerUnit, reason: PlanReason, prio: number): boolean => {
    if (taken.has(key(u)) || takenConcepts.has(u.concept_id)) return false;
    if (reason === 'weak' && objectiveFull(u)) return false;
    const item = chooseItem(u, reason, nowMs, input.seed, prevModality, takenConcepts);
    if (!item) {
      if (!base.skipped.some((s) => key(s) === key(u)))
        base.skipped.push({
          concept_id: u.concept_id,
          dimension: u.dimension,
          reason: 'no_item_at_rung',
        });
      return false;
    }
    taken.add(key(u));
    takenConcepts.add(u.concept_id);
    for (const c of itemConcepts(item, u.concept_id)) takenConcepts.add(c);
    if (reason === 'weak') {
      for (const o of u.objective_ids ?? [])
        weakByObjective.set(o, (weakByObjective.get(o) ?? 0) + 1);
    }
    prevModality = item.input_modality;
    const R =
      u.stability !== null && u.t_last !== null
        ? retrievability((nowMs - ms(u.t_last)) / DAY, u.stability)
        : 0;
    chosen.push({
      position: 0,
      concept_id: u.concept_id,
      dimension: u.dimension,
      item_id: item.item_id,
      option_count: item.option_count ?? null,
      rung: item.rung,
      reason,
      prio,
      due: u.due_at,
      R,
      type: item.item_type,
    });
    return true;
  };
  const fill = (list: PlannerUnit[], reason: PlanReason, limit: number, prio: number) => {
    let n = 0;
    for (const u of list) {
      if (chosen.length >= capacity || n >= limit) break;
      if (take(u, reason, prio)) n++;
    }
    return n;
  };

  // 0. AL8: plaza mínima semanal (primer adaptive_review del día, ≥ 7 días naturales).
  // R5 (7.3): con el motor, menor m y exposición más vieja primero; sin él, mayor D y más errores.
  const weak = eligible
    .filter((u) => isWeak(u))
    .sort((a, b) => {
      const ma = motor(a);
      const mb = motor(b);
      // Orden total: primero las estimadas por el motor, después las del respaldo del SRS.
      if (!!ma !== !!mb) return ma ? -1 : 1;
      if (ma && mb) {
        return (
          (ma.mastery ?? 0) - (mb.mastery ?? 0) ||
          ms(a.last_seen_at) - ms(b.last_seen_at) ||
          (key(a) < key(b) ? -1 : 1)
        );
      }
      return (
        (b.difficulty ?? 0) - (a.difficulty ?? 0) ||
        (b.errors_30d ?? 0) - (a.errors_30d ?? 0) ||
        (key(a) < key(b) ? -1 : 1)
      );
    });
  const probes = eligible.filter((u) => isProbe(u));
  const al8Due =
    input.budget.first_review_today &&
    (weak.length > 0 || probes.length > 0) &&
    (input.al8.last_attended_date === null ||
      daysBetween(input.al8.last_attended_date, today) >= PLANNER.al8Days);
  let slot: { u: PlannerUnit; reason: PlanReason } | null = null;
  if (al8Due) {
    const order: ('weak' | 'probe')[] =
      input.al8.last_kind === 'weak' ? ['probe', 'weak'] : ['weak', 'probe'];
    for (const kind of order) {
      const list = kind === 'weak' ? weak : probes;
      const u = list.find((x) => chooseItem(x, kind, nowMs, input.seed, null) !== null);
      if (u) {
        slot = { u, reason: kind };
        break;
      }
    }
  }

  // 1. Vencidos del SRS, dejando la plaza de AL8 dentro de B (reemplaza al último vencido).
  const dueCap = slot ? capacity - 1 : capacity;
  for (const u of due) {
    if (chosen.length >= dueCap) break;
    if (slot && key(slot.u) === key(u)) continue;
    take(u, 'due', 1);
  }
  if (slot) take(slot.u, slot.reason, 0);

  // 2. Lugares libres.
  fill(weak, 'weak', Infinity, 2);
  fill(probes, 'probe', Infinity, 3);
  fill(
    eligible.filter((u) => isFluency(u, input.user_median_speed)),
    'fluency',
    Infinity,
    4,
  );
  const advanced = eligible.filter(
    (u) =>
      !isDue(u) &&
      localDate(
        effectiveDueMs(
          ms(u.due_at),
          ms(u.due_effective_at),
          u.me_hint_expires_at ? ms(u.me_hint_expires_at) : null,
          nowMs,
        ),
        tz,
      ) <= today,
  );
  const advCap = Math.max(
    0,
    Math.min(
      Math.ceil(PLANNER.advancedShare * PLANNER.sessionSize),
      Math.floor(PLANNER.advancedShare * Math.max(0, B - reserve)) - input.budget.advanced_today,
    ),
  );
  fill(advanced, 'me_advanced', advCap, 5);
  fill(
    eligible.filter((u) => !isDue(u) && u.n <= 2),
    'recent',
    Infinity,
    6,
  );
  const soon = eligible
    .filter((u) => !isDue(u) && localDate(ms(u.due_at), tz) <= addDays(today, PLANNER.dueSoonDays))
    .map((u) => ({
      u,
      R:
        u.stability !== null && u.t_last !== null
          ? retrievability((nowMs - ms(u.t_last)) / DAY, u.stability)
          : 0,
    }))
    .sort((a, b) => a.R - b.R || (key(a.u) < key(b.u) ? -1 : 1))
    .map((x) => x.u);
  fill(soon, 'due_soon', Infinity, 7);

  if (chosen.length === 0) return { ...base, status: 'up_to_date' };
  const ordered = interleave(chosen).slice(0, capacity);
  return {
    ...base,
    items: ordered.map(({ R: _r, type: _t, ...p }, i) => ({ ...p, position: i + 1 })),
  };
}
