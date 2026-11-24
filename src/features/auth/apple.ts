import type * as AppleAuthModule from 'expo-apple-authentication';
import type * as CryptoModule from 'expo-crypto';
import { Platform } from 'react-native';

import { requireSupabase } from '@/lib/supabase';

/**
 * Sign in with Apple (sólo iOS): hoja nativa de Apple → identity token → Supabase
 * signInWithIdToken. Supabase crea la cuenta la primera vez y después recupera la misma (la
 * identidad se busca por el `sub` estable de Apple, no por el email). La sesión la guarda
 * supabase-js y AuthProvider la recibe por onAuthStateChange: acá no se guarda ningún token.
 *
 * Nonce: se genera uno aleatorio, a Apple se le pasa su SHA-256 y a Supabase el original;
 * Supabase verifica que coincidan, así un token robado no se puede reutilizar.
 */

export class AppleAuthError extends Error {
  constructor(
    readonly code: 'apple_failed' | 'apple_invalid_token' | 'apple_unavailable',
    message: string,
  ) {
    super(message);
    this.name = 'AppleAuthError';
  }
}

export type AppleSignInResult = { status: 'signed_in' } | { status: 'cancelled' };

/** El botón de Apple sólo existe en iOS (en Android y web no se muestra). */
export const appleSignInSupported = () => Platform.OS === 'ios';

/**
 * Los dos paquetes exigen su módulo nativo al importarse. Se cargan recién al tocar el botón: una
 * build anterior a estas dependencias sigue abriendo la app y sólo desactiva el botón de Apple.
 */
function loadNative(): { apple: typeof AppleAuthModule; crypto: typeof CryptoModule } | null {
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const apple = require('expo-apple-authentication') as typeof AppleAuthModule;
    const crypto = require('expo-crypto') as typeof CryptoModule;
    /* eslint-enable @typescript-eslint/no-require-imports */
    return { apple, crypto };
  } catch {
    return null;
  }
}

/** Errores de Supabase que no son del token y conviene mostrar tal cual (lib/errors.ts). */
const PASS_THROUGH = new Set(['provider_disabled', 'over_request_rate_limit']);

let appleFlow: Promise<AppleSignInResult> | null = null;

/** Un solo flujo a la vez: un segundo toque mientras la hoja está abierta reutiliza el primero. */
export function signInWithApple(): Promise<AppleSignInResult> {
  appleFlow ??= runAppleFlow().finally(() => {
    appleFlow = null;
  });
  return appleFlow;
}

/** Sólo para tests. */
export function resetAppleFlowForTests() {
  appleFlow = null;
}

async function runAppleFlow(): Promise<AppleSignInResult> {
  if (!appleSignInSupported()) {
    throw new AppleAuthError('apple_unavailable', 'Sign in with Apple sólo existe en iOS.');
  }
  const native = loadNative();
  if (!native || !(await native.apple.isAvailableAsync())) {
    throw new AppleAuthError('apple_unavailable', 'Esta build no incluye Sign in with Apple.');
  }
  const { apple, crypto } = native;

  const rawNonce = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const hashedNonce = await crypto.digestStringAsync(crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  let credential: AppleAuthModule.AppleAuthenticationCredential;
  try {
    credential = await apple.signInAsync({
      // Apple sólo manda nombre y email la primera vez. El nombre se guarda en los metadatos
      // privados de la cuenta (saveAppleName); el nombre público lo elige el usuario en el
      // onboarding. Con "Ocultar mi email" llega una dirección @privaterelay.appleid.com, que
      // Supabase guarda como el email de la cuenta.
      requestedScopes: [
        apple.AppleAuthenticationScope.FULL_NAME,
        apple.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (e) {
    if ((e as { code?: unknown }).code === 'ERR_REQUEST_CANCELED') return { status: 'cancelled' };
    throw new AppleAuthError('apple_failed', e instanceof Error ? e.message : String(e));
  }

  if (!credential.identityToken) {
    throw new AppleAuthError('apple_invalid_token', 'Apple no devolvió un identity token.');
  }

  const { data, error } = await requireSupabase().auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) {
    // Sin conexión, proveedor apagado o demasiados intentos: el mensaje genérico de lib/errors.
    const code = (error as { code?: unknown }).code;
    if (
      error.name === 'AuthRetryableFetchError' ||
      (typeof code === 'string' && PASS_THROUGH.has(code))
    ) {
      throw error;
    }
    // Token vencido, nonce o audiencia incorrectos, etc. (nunca "email o contraseña incorrectos").
    throw new AppleAuthError('apple_invalid_token', error.message);
  }

  // La sesión ya existe: el nombre se guarda en ESA cuenta (updateUser usa la sesión activa, que
  // es la que acaba de crear signInWithIdToken).
  await saveAppleName(credential.fullName, data.user?.id);
  return { status: 'signed_in' };
}

/** Metadatos de nombre a guardar: sólo los campos con texto (nunca vacíos ni null). */
export function appleNameMetadata(
  fullName: AppleAuthModule.AppleAuthenticationFullName | null | undefined,
): { full_name?: string; given_name?: string; family_name?: string } | null {
  const clean = (v: string | null | undefined) => (v ?? '').trim() || undefined;
  const given = clean(fullName?.givenName);
  const middle = clean(fullName?.middleName);
  const family = clean(fullName?.familyName);
  const full = [given, middle, family].filter(Boolean).join(' ') || undefined;
  if (!full) return null;
  return {
    full_name: full,
    ...(given ? { given_name: given } : {}),
    ...(family ? { family_name: family } : {}),
  };
}

/**
 * Guarda el nombre que Apple manda sólo en la primera autorización, en los metadatos PRIVADOS del
 * usuario de Supabase (auth.users.raw_user_meta_data). No toca profiles.display_name ni el
 * username: el nombre público lo elige el usuario en el onboarding.
 *
 * - Sin nombre (inicios posteriores, o el usuario no lo compartió): no se llama a Supabase.
 * - updateUser combina las claves enviadas con las existentes: como sólo se envían campos con
 *   texto, nunca se pisa un dato guardado con un valor vacío.
 * - Si falla, el inicio de sesión sigue: se registra sólo el tipo de error, sin el nombre.
 */
async function saveAppleName(
  fullName: AppleAuthModule.AppleAuthenticationFullName | null | undefined,
  userId: string | undefined,
) {
  const metadata = appleNameMetadata(fullName);
  if (!metadata || !userId) return;
  try {
    const { error } = await requireSupabase().auth.updateUser({ data: metadata });
    if (error) logNameSaveFailure(error);
  } catch (e) {
    logNameSaveFailure(e);
  }
}

function logNameSaveFailure(error: unknown) {
  const e = error as { code?: unknown; name?: unknown; status?: unknown };
  // Ni el nombre ni el mensaje (podría incluir datos del usuario): sólo código/tipo y estado HTTP.
  console.warn('[apple] No se pudo guardar el nombre en la cuenta', {
    code: typeof e?.code === 'string' ? e.code : undefined,
    name: typeof e?.name === 'string' ? e.name : undefined,
    status: typeof e?.status === 'number' ? e.status : undefined,
  });
}
