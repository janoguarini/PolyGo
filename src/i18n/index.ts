import { useSyncExternalStore } from 'react';

import { deviceStorage } from '@/lib/secureStorage';

/**
 * Idioma de la interfaz (docs/MULTILINGUAL_ONBOARDING_PLAN.md §3.2–3.3). Es independiente del idioma
 * de origen del aprendizaje y del idioma que se aprende: lo elige el onboarding (Español → es,
 * English → en) y se puede cambiar en Ajustes.
 *
 * Sin librerías: cada área declara sus textos con `defineStrings({ es, en })` junto a su código, y
 * TypeScript exige que `en` tenga exactamente las claves (y las firmas de las funciones) de `es`. Las
 * pantallas los leen con `useStrings(def)`; el código que no es React, con `getStrings(def)`.
 */

export const INTERFACE_LANGUAGES = ['es', 'en'] as const;
export type InterfaceLanguage = (typeof INTERFACE_LANGUAGES)[number];

/** Cada idioma, en su propia lengua (así se reconoce en cualquier interfaz). */
export const INTERFACE_LANGUAGE_LABELS: Record<InterfaceLanguage, string> = {
  es: 'Español',
  en: 'English',
};

export const isInterfaceLanguage = (v: unknown): v is InterfaceLanguage => v === 'es' || v === 'en';

/** Locale para fechas y números (`toLocaleDateString`, `Intl.NumberFormat`). */
export const LOCALES: Record<InterfaceLanguage, string> = { es: 'es', en: 'en' };

/** Sugerencia a partir del idioma del sistema (Hermes expone Intl): inglés → en; el resto → es. */
export function deviceInterfaceLanguage(): InterfaceLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    return locale.toLowerCase().startsWith('en') ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

// --- Estado global (una sola fuente para React y para el código que no es React)

const STORAGE_KEY = 'polygo.interface-language';
let current: InterfaceLanguage = 'es';
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

/** Al abrir la app: lo guardado o, si no hay nada, la sugerencia del sistema. */
export async function hydrateInterfaceLanguage(): Promise<InterfaceLanguage> {
  let stored: string | null = null;
  try {
    stored = await deviceStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  current = isInterfaceLanguage(stored) ? stored : deviceInterfaceLanguage();
  hydrated = true;
  emit();
  return current;
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
}

/** Declara los textos de un área. `en` debe tener la misma forma que `es`. */
export function defineStrings<T>(def: StringsDef<T>): StringsDef<T> {
  return def;
}

export function useStrings<T>(def: StringsDef<T>): T {
  return def[useInterfaceLanguage()];
}

export function getStrings<T>(def: StringsDef<T>): T {
  return def[current];
}

/** Elige según el idioma actual sin declarar un área (para un caso aislado). */
export const pick = <T>(lang: InterfaceLanguage, es: T, en: T): T => (lang === 'en' ? en : es);
