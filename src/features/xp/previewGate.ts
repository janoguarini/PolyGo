import type * as XpPreviewModule from './preview';

/**
 * Compuerta del modo PREVIEW de XP (QA visual en un build de desarrollo; docs/PROFILE_XP_LEVELS.md §Q).
 *
 * Se activa sólo si se cumplen LAS DOS condiciones:
 *   1. `__DEV__` (Metro en modo desarrollo; en un build de release es la constante `false`), y
 *   2. `EXPO_PUBLIC_XP_PREVIEW=1` al iniciar Metro.
 *
 * La expresión tiene que quedar LITERAL en este archivo, junto al `require`: en un bundle de release
 * Metro reemplaza `__DEV__` por `false`, pliega la condición y elimina la rama entera, así que el
 * módulo `./preview` ni siquiera entra al bundle de producción (verificado exportando un bundle de
 * release con la variable puesta). No convertirlo en un `import` estático ni mover la condición a
 * otro archivo.
 *
 * Con el modo activo: no se llama a sync_xp (el XP es ficticio y está marcado PREVIEW) y se
 * deshabilitan las acciones del perfil que escribirían en la base (ver `qaReadOnly`).
 */
export const xpPreview: typeof XpPreviewModule | null =
  __DEV__ && process.env.EXPO_PUBLIC_XP_PREVIEW === '1'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- carga condicional (ver arriba)
      (require('./preview') as typeof XpPreviewModule)
    : null;

/**
 * QA de sólo lectura: con PREVIEW activo, guardar el perfil, comprar cosméticos y cambiar de idioma
 * desde el perfil quedan deshabilitados (el build de desarrollo usa la base de producción).
 */
export const qaReadOnly = xpPreview !== null;

/** La misma regla que `xpPreview`, como función pura (para los tests). */
export function isXpPreviewAllowed(dev: boolean, flag: string | undefined): boolean {
  return dev === true && flag === '1';
}
