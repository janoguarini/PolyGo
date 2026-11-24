/**
 * Orígenes de la práctica (arquitectura de datos rev. 8, §6.1; tabla `practice_sources`, migración
 * 20261107170000_practice_sources.sql, que tiene que cargar exactamente estas filas: lo comprueba
 * supabase/tests/catalog.test.mjs).
 *
 * Sólo los orígenes con todas sus columnas definidas en §6.1. Pendientes de decisión
 * (docs/LEARNING_CATALOG_PHASE1.md, §9): `assessment` y `level_exam` («Progreso: según el caso»),
 * `placement` («puede desbloquear») y `srs_review_legacy` («Selección: desconocida»). Los orígenes del
 * SRS v2 (`adaptive_review`, `focus_review`) van aparte, en SRS_V2_PRACTICE_SOURCES (fase 3).
 */

export type SelectionMode = 'fixed' | 'client_proposed' | 'server';
export type EvidenceClass = 'learning' | 'retrieval' | 'assessment';
export type RewardKind = 'lesson' | 'review';

export interface PracticeSource {
  id: string;
  selection_mode: SelectionMode;
  affects_srs: boolean;
  affects_lesson_progress: boolean;
  consumes_energy: boolean;
  counts_for_streak: boolean;
  evidence_class: EvidenceClass;
  /** `lesson` y `consolidation` → lesson; los cinco de repaso y práctica → review (§6.1). */
  reward_kind: RewardKind | null;
  /** Sólo informativa: nunca cambia cómo se registra (§2). */
  plus_feature: string | null;
  active: boolean;
}

const source = (
  id: string,
  selection_mode: SelectionMode,
  [affects_srs, affects_lesson_progress, consumes_energy, counts_for_streak]: [
    boolean,
    boolean,
    boolean,
    boolean,
  ],
  evidence_class: EvidenceClass,
  reward_kind: RewardKind | null,
  plus_feature: string | null = null,
): PracticeSource => ({
  id,
  selection_mode,
  affects_srs,
  affects_lesson_progress,
  consumes_energy,
  counts_for_streak,
  evidence_class,
  reward_kind,
  plus_feature,
  active: true,
});

/** §6.1: «—» en la tabla = no. Columnas: SRS, progreso, energía, racha. */
export const PRACTICE_SOURCES: readonly PracticeSource[] = [
  source('lesson', 'fixed', [true, true, true, true], 'learning', 'lesson'),
  source('consolidation', 'fixed', [true, true, true, true], 'retrieval', 'lesson'),
  source('srs_review', 'client_proposed', [true, false, false, true], 'retrieval', 'review'),
  source(
    'smart_review',
    'client_proposed',
    [true, false, false, true],
    'retrieval',
    'review',
    'smart_review',
  ),
  source(
    'topic_review',
    'client_proposed',
    [true, false, false, true],
    'retrieval',
    'review',
    'topic_review',
  ),
  // D3: práctica libre y «Tus errores» no modifican el SRS.
  source('free_practice', 'client_proposed', [false, false, false, true], 'retrieval', 'review'),
  source(
    'mistakes_practice',
    'client_proposed',
    [false, false, false, true],
    'retrieval',
    'review',
  ),
];

/** G1 (§6.1): toda evaluación la elige el servidor. */
export function practiceSourceProblems(sources: readonly PracticeSource[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const s of sources) {
    if (ids.has(s.id)) problems.push(`${s.id}: repetido`);
    ids.add(s.id);
    if (s.evidence_class === 'assessment' && s.selection_mode !== 'server')
      problems.push(`${s.id}: una evaluación tiene que tener selection_mode = 'server' (G1)`);
    if (s.id === 'ranked') problems.push('ranked no es un origen de la práctica (§14)');
  }
  return problems;
}

/**
 * Orígenes del SRS v2 (docs/ADAPTIVE_LEARNING_DESIGN.md §11, AL10): filas nuevas de la migración
 * 20261109120000_srs_v2.sql. Los elige el servidor (G1); `focus_review` es la herramienta de foco de Plus
 * (AL11), con las mismas reglas que el resto.
 */
export const SRS_V2_PRACTICE_SOURCES: readonly PracticeSource[] = [
  source('adaptive_review', 'server', [true, false, false, true], 'retrieval', 'review'),
  source(
    'focus_review',
    'server',
    [true, false, false, true],
    'retrieval',
    'review',
    'focus_review',
  ),
];

/**
 * Cierre de la fase 5 (docs/LEARNING_PHASE5.md §11): repaso básico armado por el servidor con las reglas
 * del SRS v1 cuando el v2 está apagado (migración 20261111120000_learning_phase5.sql). Mismas banderas que
 * `srs_review` (la app vieja), pero lo elige el servidor.
 */
export const PHASE5_PRACTICE_SOURCES: readonly PracticeSource[] = [
  source('basic_review', 'server', [true, false, false, true], 'retrieval', 'review'),
];
