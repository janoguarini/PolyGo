import { z } from 'zod';

/** Reglas de perfil compartidas entre formularios y backend (el SQL replica estas reglas). */

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_REGEX, 'Usá de 3 a 20 caracteres: letras minúsculas, números o "_".');

export const DAILY_GOALS = [5, 10, 15, 20] as const;
export type DailyGoalMinutes = (typeof DAILY_GOALS)[number];

/** Países seleccionables (profiles.region, ISO 3166-1 alfa-2). Primero los hispanohablantes. */
export const COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CU', name: 'Cuba' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'ES', name: 'España' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'MX', name: 'México' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Perú' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'IT', name: 'Italia' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Alemania' },
] as const;

/** Bandera emoji de un código de país de dos letras (indicadores regionales Unicode). */
export function flagEmoji(code: string | null | undefined): string | null {
  if (!code || !/^[A-Z]{2}$/.test(code)) return null;
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/**
 * Niveles MCER del registro: el elegido define qué camino ves primero en Aprender. Los que tienen
 * `available: false` todavía no tienen contenido y se muestran como «Próximamente» (al habilitar
 * uno, ampliar también el CHECK de profiles.start_level).
 */
export const START_LEVELS = [
  {
    id: 'A1',
    title: 'Desde cero',
    description: 'Nunca estudié inglés o recuerdo muy poco.',
    available: true,
  },
  {
    id: 'A2',
    title: 'Sé lo básico',
    description: 'Ya me presento, hablo de mi rutina y hago preguntas simples.',
    available: true,
  },
  {
    id: 'B1',
    title: 'Me defiendo',
    description: 'Me las arreglo de viaje y cuento experiencias y planes.',
    available: false,
  },
  {
    id: 'B2',
    title: 'Hablo con soltura',
    description: 'Sigo series y charlas sin problema y opino sobre muchos temas.',
    available: false,
  },
  {
    id: 'C1',
    title: 'Avanzado',
    description: 'Uso el idioma con fluidez en el trabajo o el estudio.',
    available: false,
  },
  {
    id: 'C2',
    title: 'Casi nativo',
    description: 'Entiendo prácticamente todo y me expreso con precisión.',
    available: false,
  },
] as const;

/** Nivel MCER siguiente a `level` (o null si es C2 o no existe). */
export function nextStartLevel(level: string): (typeof START_LEVELS)[number] | null {
  const i = START_LEVELS.findIndex((l) => l.id === level);
  return i >= 0 ? (START_LEVELS[i + 1] ?? null) : null;
}

/**
 * Avatares predefinidos: tres zorros. Los ids son heredados de los primeros avatares (la base los
 * acepta sin cambiar su CHECK): 'bolt' = violeta (predeterminado), 'crown' = amarillo,
 * 'flame' = rojo. Las imágenes están en assets/avatars y las resuelve el componente Avatar.
 */
export const AVATARS = [
  { id: 'bolt', name: 'Zorro violeta', color: '#8B5CF6' },
  { id: 'crown', name: 'Zorro amarillo', color: '#F5C542' },
  { id: 'flame', name: 'Zorro rojo', color: '#F43F5E' },
] as const;

export type AvatarId = (typeof AVATARS)[number]['id'];
export const AVATAR_IDS = AVATARS.map((a) => a.id) as [AvatarId, ...AvatarId[]];
export const DEFAULT_AVATAR: AvatarId = 'bolt';
