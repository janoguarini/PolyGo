import { useSyncExternalStore } from 'react';

import { deviceStorage } from '@/lib/secureStorage';

/**
 * Idioma de la interfaz (docs/MULTILINGUAL_ONBOARDING_PLAN.md §3.2–3.3). Es independiente del idioma
 * de origen del aprendizaje y del idioma que se aprende: lo elige el onboarding (Español → es,
 * English → en) y se puede cambiar en Ajustes.
 *
 * Sin librerías: cada área declara sus textos con `defineStrings({ es, en, 'pt-BR', it, fr })` junto a su
 * código, y TypeScript exige que cada idioma tenga exactamente las claves (y las firmas de las
 * funciones) de `es`. Las pantallas los leen con `useStrings(def)`; el código que no es React, con
 * `getStrings(def)`.
 *
 * Los códigos son los mismos que guarda la base (profiles.interface_language): 'es', 'en', 'pt-BR',
 * 'it', 'fr'. Los valores viejos ('es' / 'en') siguen valiendo tal cual.
 */

export const INTERFACE_LANGUAGES = ['es', 'en', 'pt-BR', 'it', 'fr'] as const;
export type InterfaceLanguage = (typeof INTERFACE_LANGUAGES)[number];

/** Cada idioma, en su propia lengua (así se reconoce en cualquier interfaz). */
export const INTERFACE_LANGUAGE_LABELS: Record<InterfaceLanguage, string> = {
  es: 'Español',
  en: 'English',
  'pt-BR': 'Português (Brasil)',
  it: 'Italiano',
  fr: 'Français',
};

/** Bandera de cada idioma de interfaz (selector de Ajustes y del registro). */
export const INTERFACE_LANGUAGE_FLAGS: Record<InterfaceLanguage, string> = {
  es: '🇪🇸',
  en: '🇺🇸',
  'pt-BR': '🇧🇷',
  it: '🇮🇹',
  fr: '🇫🇷',
};

export const isInterfaceLanguage = (v: unknown): v is InterfaceLanguage =>
  typeof v === 'string' && (INTERFACE_LANGUAGES as readonly string[]).includes(v);

/** Locale para fechas y números (`toLocaleDateString`, `Intl.NumberFormat`). */
export const LOCALES: Record<InterfaceLanguage, string> = {
  es: 'es',
  en: 'en',
  'pt-BR': 'pt-BR',
  it: 'it',
  fr: 'fr',
};

/**
 * Idioma de interfaz para una etiqueta BCP 47 del sistema («pt-PT», «it_IT», «en-GB»…). Todo el
 * portugués va a pt-BR (es la única variante que hay); lo que no se soporta, a español.
 */
export function interfaceLanguageForLocale(
  tag: string | null | undefined,
): InterfaceLanguage | null {
  const lang = (tag ?? '').toLowerCase().replace('_', '-').split('-')[0];
  switch (lang) {
    case 'es':
      return 'es';
    case 'en':
      return 'en';
    case 'pt':
      return 'pt-BR';
    case 'it':
      return 'it';
    case 'fr':
      return 'fr';
    default:
      return null;
  }
}

/** Idiomas preferidos del sistema, en orden (expo-localization; si falta, Intl de Hermes). */
function deviceLocaleTags(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getLocales } = require('expo-localization') as typeof import('expo-localization');
    const tags = getLocales()
      .map((l) => l.languageTag || l.languageCode || '')
      .filter(Boolean);
    if (tags.length) return tags;
  } catch {
    // Sin el módulo nativo (tests, web vieja): seguimos con Intl.
  }
  try {
    return [Intl.DateTimeFormat().resolvedOptions().locale ?? ''];
  } catch {
    return [];
  }
}

/**
 * Sugerencia a partir del sistema: el primer idioma preferido que soportamos (un iPhone en «it, en»
 * queda en italiano; uno en «de, en», en inglés). Si ninguno se soporta, español.
 */
export function deviceInterfaceLanguage(tags: string[] = deviceLocaleTags()): InterfaceLanguage {
  for (const tag of tags) {
    const lang = interfaceLanguageForLocale(tag);
    if (lang) return lang;
  }
  return 'es';
}

// --- Estado global (una sola fuente para React y para el código que no es React)

const STORAGE_KEY = 'polygo.interface-language';
/**
 * Elección manual que todavía no llegó a la base (sin conexión, error del servidor o, para pt-BR / it,
 * la migración 20270103120000_interface_languages_pt_it sin aplicar). Mientras exista, el perfil no la
 * pisa y se reintenta guardarla (src/features/courses/interfaceLanguageSync.ts). Es de una cuenta:
 * si entra otra, se descarta.
 */
const PENDING_KEY = 'polygo.interface-language.pending';

export interface PendingInterfaceLanguage {
  lang: InterfaceLanguage;
  /** Cuenta que eligió el idioma (null: sin sesión; la adopta la primera cuenta que sincroniza). */
  owner: string | null;
}

let current: InterfaceLanguage = 'es';
let pending: PendingInterfaceLanguage | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getInterfaceLanguage = (): InterfaceLanguage => current;
export const isInterfaceLanguageHydrated = () => hydrated;

/** Cambia el idioma en memoria y lo guarda en el dispositivo (la base lo guarda aparte, en el perfil). */
export async function setInterfaceLanguage(lang: InterfaceLanguage): Promise<void> {
  if (current !== lang) {
    current = lang;
    emit();
  }
  try {
    await deviceStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Sin almacenamiento (web privada, error del llavero): el idioma vale para esta sesión.
  }
}

/**
 * Al abrir la app: lo guardado (elección manual o del perfil, siempre gana) o, si no hay nada, la
 * sugerencia del sistema. Un valor guardado desconocido (p. ej. de una build futura) se ignora.
 */
export async function hydrateInterfaceLanguage(): Promise<InterfaceLanguage> {
  let stored: string | null = null;
  let rawPending: string | null = null;
  try {
    stored = await deviceStorage.getItem(STORAGE_KEY);
    rawPending = await deviceStorage.getItem(PENDING_KEY);
  } catch {
    stored = null;
  }
  current = isInterfaceLanguage(stored) ? stored : deviceInterfaceLanguage();
  const parsed = parsePending(rawPending);
  // Sólo vale si coincide con el idioma guardado (si no, quedó de un estado anterior).
  pending = parsed && parsed.lang === current ? parsed : null;
  hydrated = true;
  emit();
  return current;
}

function parsePending(raw: string | null): PendingInterfaceLanguage | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { lang?: unknown; owner?: unknown };
    if (!isInterfaceLanguage(v.lang)) return null;
    return { lang: v.lang, owner: typeof v.owner === 'string' ? v.owner : null };
  } catch {
    return null;
  }
}

export const getPendingInterfaceLanguage = (): PendingInterfaceLanguage | null => pending;

/**
 * Marca (o limpia, con null) la elección pendiente de guardar en la base. La memoria cambia en el
 * acto (antes de cualquier await): desde ese momento el perfil ya no la puede pisar.
 */
export async function setPendingInterfaceLanguage(
  next: PendingInterfaceLanguage | null,
): Promise<void> {
  if (pending?.lang !== next?.lang || pending?.owner !== next?.owner) {
    pending = next;
    emit();
  }
  try {
    if (next) await deviceStorage.setItem(PENDING_KEY, JSON.stringify(next));
    else await deviceStorage.removeItem(PENDING_KEY);
  } catch {
    // Sin almacenamiento: vale para esta sesión.
  }
}

export function usePendingInterfaceLanguage(): PendingInterfaceLanguage | null {
  return useSyncExternalStore(subscribe, getPendingInterfaceLanguage, getPendingInterfaceLanguage);
}

/** Sólo para pruebas. */
export function __setInterfaceLanguageForTests(lang: InterfaceLanguage) {
  current = lang;
  hydrated = true;
  emit();
}

export function useInterfaceLanguage(): InterfaceLanguage {
  return useSyncExternalStore(subscribe, getInterfaceLanguage, getInterfaceLanguage);
}

export function useInterfaceLanguageHydrated(): boolean {
  return useSyncExternalStore(subscribe, isInterfaceLanguageHydrated, isInterfaceLanguageHydrated);
}

export const useLocale = () => LOCALES[useInterfaceLanguage()];
export const getLocale = () => LOCALES[current];

// --- Textos

export interface StringsDef<T> {
  es: T;
  en: NoInfer<T>;
  'pt-BR': NoInfer<T>;
  it: NoInfer<T>;
  fr: NoInfer<T>;
}

/** Declara los textos de un área. Cada idioma debe tener la misma forma que `es`. */
export function defineStrings<T>(def: StringsDef<T>): StringsDef<T> {
  return def;
}

/**
 * Textos de `def` en `lang`. TypeScript y src/i18n/__tests__/strings.test.ts exigen los cinco
 * idiomas; el respaldo en español sólo cubre un objeto armado a mano fuera de `defineStrings`.
 */
export function stringsFor<T>(def: StringsDef<T>, lang: InterfaceLanguage): T {
  return def[lang] ?? def.es;
}

export function useStrings<T>(def: StringsDef<T>): T {
  return stringsFor(def, useInterfaceLanguage());
}

export function getStrings<T>(def: StringsDef<T>): T {
  return stringsFor(def, current);
}

/** Elige según el idioma sin declarar un área (para un caso aislado). */
export const pick = <T>(lang: InterfaceLanguage, values: Record<InterfaceLanguage, T>): T =>
  values[lang] ?? values.es;
