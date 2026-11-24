import type { InterfaceLanguage } from '@/i18n';
import { callPendingRpc, isMissingRpc, isMissingTable } from '@/lib/pendingRpc';
import { requireSupabase } from '@/lib/supabase';

import type { CourseEnrollment } from './level';

/**
 * Modelo de cursos (20261223120000_course_model, sin aplicar en producción). Cada función tolera que la
 * migración no exista: devuelve null o no hace nada, y la app sigue con el modelo anterior.
 * Al aplicarla: regenerar database.generated.ts y tipar estas llamadas (ver src/lib/pendingRpc.ts).
 */

type UntypedFrom = (table: string) => {
  select: (columns: string) => {
    eq: (
      column: string,
      value: string,
    ) => PromiseLike<{ data: unknown; error: { code?: string; message: string } | null }>;
  };
};

const ENROLLMENT_COLUMNS =
  'course_code, start_level, placement_level, placement_completed_at, enrolled_at, last_selected_at';

/** Cursos del usuario; null = la tabla todavía no existe (modelo anterior). */
export async function fetchMyCourses(userId: string): Promise<CourseEnrollment[] | null> {
  const client = requireSupabase();
  const from = client.from.bind(client) as unknown as UntypedFrom;
  const { data, error } = await from('user_courses')
    .select(ENROLLMENT_COLUMNS)
    .eq('user_id', userId);
  if (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
  return (data as CourseEnrollment[]) ?? [];
}

/**
 * Guarda el idioma de la interfaz en el perfil. false = la migración no está aplicada (queda sólo en
 * el dispositivo).
 */
export async function saveInterfaceLanguage(language: InterfaceLanguage): Promise<boolean> {
  try {
    await callPendingRpc('set_interface_language', { p_language: language });
    return true;
  } catch (error) {
    if (isMissingRpc(error)) return false;
    throw error;
  }
}

/** Cambia el curso activo. null = sin migración (usar set_target_language). */
export async function setActiveCourse(courseCode: string): Promise<unknown> {
  try {
    return await callPendingRpc('set_active_course', { p_course_code: courseCode });
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

/** Resultado del test de nivel tal como se guarda (docs/PLACEMENT_TEST.md). */
export interface PlacementSubmission {
  level: string;
  correct: number;
  total: number;
  version: string;
}

/** Respuesta de start_course (20261224120000_course_placement). */
export interface StartCourseResult {
  /** false = ya estaba inscripto: se conservó su nivel y su resultado anterior. */
  created: boolean;
  course_code: string;
  start_level: string;
  placement_level: string | null;
  placement_completed_at: string | null;
}

/**
 * Empieza un curso nuevo con un nivel (y, si lo hizo, el resultado del test) y lo deja activo, en una
 * sola transacción. Un curso ya empezado no se pisa (`created: false`). null = la migración no está
 * aplicada.
 */
export async function startCourse(
  courseCode: string,
  startLevel: string,
  placement: PlacementSubmission | null,
): Promise<StartCourseResult | null> {
  try {
    return await callPendingRpc<StartCourseResult>('start_course', {
      p_course_code: courseCode,
      p_start_level: startLevel,
      p_placement_level: placement?.level ?? null,
      p_placement_correct: placement?.correct ?? null,
      p_placement_total: placement?.total ?? null,
      p_placement_version: placement?.version ?? null,
    });
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

/** Nivel desde el que empieza un curso del usuario (no marca lecciones ni da XP). */
export async function setCourseStartLevel(
  courseCode: string,
  level: string,
): Promise<CourseEnrollment | null> {
  try {
    return await callPendingRpc<CourseEnrollment>('set_course_start_level', {
      p_course_code: courseCode,
      p_level: level,
    });
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}
