import { z } from 'zod';

/**
 * Estado de compatibilidad de esta build según el servidor (app_client_status, fase C.5).
 *   ok               al día.
 *   update_required  por debajo del mínimo: se muestra el aviso de actualización y se bloquea.
 *   unknown          hay un mínimo pero esta build no informa una versión legible: no se bloquea.
 *   unavailable      el servidor no respondió o no tiene la función: no se bloquea (la protección
 *                    del recorrido vive en el servidor, no depende de esta comprobación).
 */
export type CompatStatus = 'ok' | 'update_required' | 'unknown' | 'unavailable';

export interface ClientCompatibility {
  status: CompatStatus;
  installedVersion: string | null;
  minVersion: string | null;
  curriculumApi: number;
  minCurriculumApi: number;
  message: string | null;
  updateUrl: string | null;
}

const serverSchema = z.object({
  status: z.enum(['ok', 'update_required', 'unknown']),
  installed_version: z.string().nullable(),
  min_version: z.string().nullable(),
  curriculum_api: z.number().int(),
  min_curriculum_api: z.number().int(),
  message: z.string().nullable(),
  update_url: z.string().nullable(),
});

export const DEFAULT_UPDATE_MESSAGE =
  'Hay una versión nueva de PolyGo. Actualizala desde la tienda para seguir aprendiendo.';

/** Estado cuando no hay respuesta válida del servidor: nunca bloquea. */
export function unavailableCompatibility(
  installedVersion: string | null,
  curriculumApi: number,
): ClientCompatibility {
  return {
    status: 'unavailable',
    installedVersion,
    minVersion: null,
    curriculumApi,
    minCurriculumApi: 0,
    message: null,
    updateUrl: null,
  };
}

/** Interpreta la respuesta del servidor; cualquier forma inesperada → unavailable (no bloquea). */
export function parseCompatibility(
  data: unknown,
  installedVersion: string | null,
  curriculumApi: number,
): ClientCompatibility {
  const parsed = serverSchema.safeParse(data);
  if (!parsed.success) return unavailableCompatibility(installedVersion, curriculumApi);
  const s = parsed.data;
  const updateUrl = s.update_url && /^https:\/\//.test(s.update_url) ? s.update_url : null;
  return {
    status: s.status,
    installedVersion: s.installed_version,
    minVersion: s.min_version,
    curriculumApi: s.curriculum_api,
    minCurriculumApi: s.min_curriculum_api,
    message: s.status === 'update_required' ? (s.message ?? DEFAULT_UPDATE_MESSAGE) : null,
    updateUrl,
  };
}

/** Sólo un rechazo explícito del servidor bloquea la app. */
export const mustUpdate = (c: ClientCompatibility | undefined) => c?.status === 'update_required';
