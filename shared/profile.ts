import { z } from 'zod';

/** Reglas de perfil compartidas entre formularios y backend (el SQL replica estas reglas). */

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_REGEX, 'Usa de 3 a 20 caracteres: letras minúsculas, números o "_".');

/**
 * Nombres parecidos a `raw` para sugerir cuando el elegido ya existe: el mismo nombre normalizado
 * (sin tildes ni símbolos) con números o un toque de juego (_pro, the_…, _fox). Todos cumplen
 * USERNAME_REGEX y ninguno es el nombre pedido. `random` es inyectable para los tests.
 */
export function suggestUsernames(raw: string, random: () => number = Math.random): string[] {
  let base = raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  if (base.length < 3) base = `${base}poly`;
  const fit = (prefix: string, suffix: string) =>
    prefix + base.slice(0, 20 - prefix.length - suffix.length) + suffix;
  const digits = (n: number) => String(10 ** (n - 1) + Math.floor(random() * 9 * 10 ** (n - 1)));
  const candidates = [
    fit('', digits(2)),
    fit('', '_pro'),
    fit('the_', ''),
    fit('', '_fox'),
    fit('', digits(3)),
    fit('poly_', ''),
    fit('', '_go'),
    fit('', `_${digits(2)}`),
    fit('real_', ''),
    fit('', digits(4)),
  ];
  const original = raw.trim().toLowerCase();
  return [...new Set(candidates)].filter((c) => USERNAME_REGEX.test(c) && c !== original);
}

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
 * `available: false` todavía no tienen contenido y se muestran como «Próximamente». Uno habilitado
 * igual sólo se ofrece si el curso elegido lo publica (courseLevels). profiles.start_level sigue en
 * A1 / A2: el nivel de un curso nuevo vive en user_courses (complete_onboarding_v2).
 */
export const START_LEVELS = [
  {
    id: 'A1',
    title: 'Desde cero',
    description: 'Nunca estudié el idioma o recuerdo muy poco.',
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
    // Se abre sólo en los cursos que publican B1 (onboarding: levelOpen = available y courseLevels del
    // curso): hoy en-from-pt / it / fr. Se guarda en user_courses vía complete_onboarding_v2.
    available: true,
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
 * Avatares predefinidos. Los zorros conservan los ids heredados de los primeros avatares:
 * 'bolt' = violeta (predeterminado), 'crown' = amarillo, 'flame' = rojo. El resto son
 * '<animal>-<color>'. La base acepta exactamente estos ids (profiles_avatar_check, migración
 * 20261206120000_avatar_animals): al agregar uno, ampliar también ese CHECK. Las imágenes están en
 * assets/avatars y las resuelve el componente Avatar.
 */
export const AVATARS = [
  { id: 'bolt', name: 'Zorro violeta', color: '#8B5CF6' },
  { id: 'crown', name: 'Zorro amarillo', color: '#F5C542' },
  { id: 'flame', name: 'Zorro rojo', color: '#F43F5E' },
  { id: 'panda-violet', name: 'Panda violeta', color: '#8B5CF6' },
  { id: 'panda-yellow', name: 'Panda amarillo', color: '#F5C542' },
  { id: 'panda-red', name: 'Panda rojo', color: '#F43F5E' },
  { id: 'dog-violet', name: 'Perro violeta', color: '#8B5CF6' },
  { id: 'dog-yellow', name: 'Perro amarillo', color: '#F5C542' },
  { id: 'dog-red', name: 'Perro rojo', color: '#F43F5E' },
  { id: 'cat-violet', name: 'Gato violeta', color: '#8B5CF6' },
  { id: 'cat-yellow', name: 'Gato amarillo', color: '#F5C542' },
  { id: 'cat-red', name: 'Gato rojo', color: '#F43F5E' },
  { id: 'lion-violet', name: 'León violeta', color: '#8B5CF6' },
  { id: 'lion-yellow', name: 'León amarillo', color: '#F5C542' },
  { id: 'lion-red', name: 'León rojo', color: '#F43F5E' },
] as const;

export type AvatarId = (typeof AVATARS)[number]['id'];
export const AVATAR_IDS = AVATARS.map((a) => a.id) as [AvatarId, ...AvatarId[]];
export const DEFAULT_AVATAR: AvatarId = 'bolt';
