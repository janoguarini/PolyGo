import * as Linking from 'expo-linking';
import type * as WebBrowserModule from 'expo-web-browser';
import { Platform } from 'react-native';

import { unregisterPush } from '@/features/friends/pushToken';
import { CURRICULUM_API, CURRICULUM_API_SIGNUP_KEY } from '@/lib/clientInfo';
import { requireSupabase } from '@/lib/supabase';

import type { SignInValues, SignUpValues } from './schemas';

/**
 * URL a la que vuelven los enlaces de email (confirmación y recuperación) y el inicio con Google.
 * Debe estar en Supabase → Auth → URL Configuration → Redirect URLs.
 */
export const authRedirectUrl = () => Linking.createURL('/auth-callback');

export async function signIn({ email, password }: SignInValues) {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Devuelve true si el proyecto exige confirmar el email antes de crear la sesión. */
export async function signUp({
  email,
  password,
}: SignUpValues): Promise<{ needsConfirmation: boolean }> {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authRedirectUrl(),
      // Fase C.5: la ruta curricular de la cuenta se decide en el alta según lo que esta build puede
      // dibujar. Sin este dato (builds antiguas) el servidor asigna la ruta de respaldo.
      data: { [CURRICULUM_API_SIGNUP_KEY]: CURRICULUM_API },
    },
  });
  if (error) throw error;
  return { needsConfirmation: !data.session };
}

export async function sendPasswordReset(email: string) {
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: authRedirectUrl(),
  });
  if (error) throw error;
}

/** Canjes ya iniciados, por código: cada código PKCE se canjea una sola vez. */
const exchanges = new Map<string, Promise<void>>();

/**
 * Canjea el ?code= de un enlace PKCE (email o Google) por una sesión. Supabase la guarda y
 * AuthProvider la recibe por onAuthStateChange.
 * Si el enlace era de recuperación, supabase-js emite PASSWORD_RECOVERY y AuthProvider lo registra.
 *
 * Idempotente por código: en Android la vuelta de Google llega a la vez al navegador de
 * signInWithGoogle y a la ruta /auth-callback; los dos comparten el mismo canje (un código sólo
 * sirve una vez y el segundo intento fallaría).
 */
export function exchangeCode(code: string): Promise<void> {
  const running = exchanges.get(code);
  if (running) return running;
  const exchange = (async () => {
    const { error } = await requireSupabase().auth.exchangeCodeForSession(code);
    if (error) throw error;
  })();
  exchanges.set(code, exchange);
  return exchange;
}

/** Sólo para tests. */
export function resetAuthFlowsForTests() {
  exchanges.clear();
  googleFlow = null;
}

/** Error propio del inicio con Google; `code` se traduce en lib/errors.ts. */
export class OAuthError extends Error {
  constructor(
    readonly code:
      'oauth_failed' | 'oauth_invalid_callback' | 'oauth_browser_busy' | 'oauth_unavailable',
    message: string,
  ) {
    super(message);
    this.name = 'OAuthError';
  }
}

/**
 * Parámetros de la URL de vuelta de Supabase. Lee la query y también el fragmento (#), porque
 * Supabase puede devolver los errores en cualquiera de los dos.
 */
export function parseAuthCallbackUrl(url: string): {
  code?: string;
  error?: string;
  errorDescription?: string;
} {
  const params: Record<string, string> = {};
  const hashAt = url.indexOf('#');
  const queryAt = url.indexOf('?');
  const parts = [
    queryAt >= 0 && (hashAt < 0 || queryAt < hashAt)
      ? url.slice(queryAt + 1, hashAt >= 0 ? hashAt : undefined)
      : '',
    hashAt >= 0 ? url.slice(hashAt + 1) : '',
  ];
  for (const part of parts) {
    for (const pair of part.split('&')) {
      if (!pair) continue;
      const eq = pair.indexOf('=');
      const key = eq >= 0 ? pair.slice(0, eq) : pair;
      const value = eq >= 0 ? pair.slice(eq + 1) : '';
      try {
        params[decodeURIComponent(key)] ??= decodeURIComponent(value.replace(/\+/g, ' '));
      } catch {
        // Un parámetro mal codificado no aporta nada: se ignora.
      }
    }
  }
  return {
    code: params.code || undefined,
    error: params.error || params.error_code || undefined,
    errorDescription: params.error_description || undefined,
  };
}

export type GoogleSignInResult =
  /** Sesión creada: el layout principal redirige solo. */
  | { status: 'signed_in' }
  /** El usuario cerró el navegador o rechazó el permiso. No es un error. */
  | { status: 'cancelled' }
  /** Web: la página se va a Google y vuelve a /auth-callback, que termina el canje. */
  | { status: 'redirecting' };

let googleFlow: Promise<GoogleSignInResult> | null = null;

/**
 * Registro / inicio de sesión con Google por OAuth de Supabase en el navegador del sistema
 * (ASWebAuthenticationSession en iOS, Custom Tabs en Android). La vuelta es authRedirectUrl()
 * (polygo://auth-callback en builds nativas) con un ?code= PKCE que se canjea con exchangeCode().
 *
 * Un solo flujo a la vez: un segundo toque mientras el navegador está abierto reutiliza el primero.
 */
export function signInWithGoogle(): Promise<GoogleSignInResult> {
  googleFlow ??= runGoogleFlow().finally(() => {
    googleFlow = null;
  });
  return googleFlow;
}

/**
 * expo-web-browser se carga recién al tocar "Continuar con Google": su import exige el módulo
 * nativo ExpoWebBrowser, y una build anterior a esta dependencia no lo trae. Importarlo arriba
 * rompería toda la app al arrancar en esas builds; así sólo se desactiva el botón de Google.
 */
function loadWebBrowser(): typeof WebBrowserModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-web-browser') as typeof WebBrowserModule;
  } catch {
    return null;
  }
}

async function runGoogleFlow(): Promise<GoogleSignInResult> {
  const redirectTo = authRedirectUrl();
  const web = Platform.OS === 'web';
  // Antes de pedirle nada a Supabase: sin navegador de autenticación no hay flujo posible.
  const WebBrowser = web ? null : loadWebBrowser();
  if (!web && !WebBrowser) {
    throw new OAuthError('oauth_unavailable', 'Esta build no incluye expo-web-browser.');
  }
  const { data, error } = await requireSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      // En nativo la URL se abre a mano con expo-web-browser; en web Supabase navega la página.
      skipBrowserRedirect: !web,
      // Deja elegir cuenta aunque el navegador ya tenga una sesión de Google abierta.
      queryParams: { prompt: 'select_account' },
    },
  });
  if (error) throw error;
  if (web || !WebBrowser) return { status: 'redirecting' };
  if (!data.url) throw new OAuthError('oauth_failed', 'Supabase no devolvió la URL de Google.');

  let result: WebBrowserModule.WebBrowserAuthSessionResult;
  try {
    result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  } catch (e) {
    // Otro navegador de autenticación todavía abierto, u otro fallo al abrirlo.
    throw new OAuthError('oauth_browser_busy', e instanceof Error ? e.message : String(e));
  }

  if (result.type === 'cancel' || result.type === 'dismiss') return { status: 'cancelled' };
  if (result.type !== 'success') {
    throw new OAuthError('oauth_browser_busy', `Navegador de autenticación: ${result.type}`);
  }

  const callback = parseAuthCallbackUrl(result.url);
  // access_denied: el usuario tocó "Cancelar" en la pantalla de permisos de Google.
  if (callback.error === 'access_denied') return { status: 'cancelled' };
  if (callback.error || callback.errorDescription) {
    throw new OAuthError('oauth_failed', callback.errorDescription ?? callback.error ?? '');
  }
  if (!callback.code) {
    throw new OAuthError('oauth_invalid_callback', 'La vuelta de Google no trajo un código.');
  }
  await exchangeCode(callback.code);
  return { status: 'signed_in' };
}

export async function updatePassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  // Antes de perder la sesión: este teléfono deja de recibir avisos de esta cuenta.
  await unregisterPush();
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

/** Texto que la Edge Function exige en el cuerpo: un request accidental no borra nada. */
export const DELETE_ACCOUNT_CONFIRMATION = 'DELETE_MY_ACCOUNT';

/**
 * Borra la cuenta y todos sus datos (Edge Function `delete-account`, con la clave secreta del
 * servidor). Después cierra la sesión local: el token ya no corresponde a ningún usuario.
 */
export async function deleteAccount() {
  const supabase = requireSupabase();
  const { error } = await supabase.functions.invoke('delete-account', {
    body: { confirm: DELETE_ACCOUNT_CONFIRMATION },
  });
  if (error) throw error;
  await supabase.auth.signOut({ scope: 'local' });
}
