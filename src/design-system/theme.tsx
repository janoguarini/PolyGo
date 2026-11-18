import * as SecureStore from 'expo-secure-store';
import * as SystemUI from 'expo-system-ui';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

import {
  colors,
  elevation,
  gradients,
  setActiveScheme,
  themeColors,
  withScheme,
  type ColorScheme,
} from './tokens';

/**
 * Tema claro / oscuro con cambio en vivo.
 *
 * - La preferencia (oscuro, claro o la del teléfono) se guarda en el dispositivo y se lee de forma
 *   síncrona al arrancar: la primera pantalla ya sale con el tema correcto.
 * - `colors`, `gradients` y `elevation` (tokens.ts) leen el tema activo, que fija este proveedor
 *   al dibujar. Los componentes se suscriben con `useTheme()` o con un hook de `themedStyles()` y
 *   se vuelven a dibujar al cambiar el tema.
 */
export type ThemePreference = ColorScheme | 'system';

const STORAGE_KEY = 'polygo.theme';
/** Por defecto oscuro (la identidad visual original de Polygo). */
const DEFAULT_PREFERENCE: ThemePreference = 'dark';

function readPreference(): ThemePreference {
  try {
    const raw =
      Platform.OS === 'web'
        ? globalThis.localStorage?.getItem(STORAGE_KEY)
        : SecureStore.getItem(STORAGE_KEY);
    return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function writePreference(pref: ThemePreference) {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(STORAGE_KEY, pref);
    else SecureStore.setItem(STORAGE_KEY, pref);
  } catch {
    // Sin almacenamiento la elección dura hasta cerrar la app.
  }
}

interface ThemeState {
  scheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeState>({
  scheme: 'dark',
  preference: DEFAULT_PREFERENCE,
  setPreference: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>(readPreference);
  const system = useColorScheme();
  const scheme: ColorScheme =
    preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;
  // Antes de dibujar los hijos: así leen los tokens del tema vigente.
  setActiveScheme(scheme);

  useEffect(() => {
    // Teclado, alertas y selectores del sistema siguen al tema de la app.
    try {
      Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
    } catch {
      // Web y plataformas sin soporte: no hace falta.
    }
  }, [preference]);

  useEffect(() => {
    // Fondo nativo detrás de las pantallas (transiciones, teclado en Android): sin destellos.
    void SystemUI.setBackgroundColorAsync(themeColors[scheme].background).catch(() => undefined);
  }, [scheme]);

  const setPreference = useCallback((pref: ThemePreference) => {
    writePreference(pref);
    setPref(pref);
  }, []);

  const value = useMemo(
    () => ({ scheme, preference, setPreference }),
    [scheme, preference, setPreference],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Tema vigente. Llamarlo suscribe el componente: se vuelve a dibujar al cambiar el tema y sus
 * lecturas de `colors` / `gradients` / `elevation` devuelven los valores nuevos.
 */
export function useTheme() {
  const { scheme } = useContext(ThemeContext);
  return { scheme, colors, gradients, elevation };
}

/** Preferencia del usuario (Ajustes → Apariencia). */
export function useThemePreference() {
  const { preference, setPreference, scheme } = useContext(ThemeContext);
  return { preference, setPreference, scheme };
}

/**
 * Estilos que dependen del tema: `const useStyles = themedStyles(() => StyleSheet.create({...}))`
 * y dentro del componente `const styles = useStyles()`. Se calculan una vez por tema.
 */
export function themedStyles<T>(factory: () => T): () => T {
  const cache: Partial<Record<ColorScheme, T>> = {};
  return function useThemedStyles() {
    const { scheme } = useContext(ThemeContext);
    return (cache[scheme] ??= withScheme(scheme, factory));
  };
}
