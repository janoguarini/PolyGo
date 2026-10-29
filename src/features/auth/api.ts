import * as Linking from 'expo-linking';

import { requireSupabase } from '@/lib/supabase';

import type { SignInValues, SignUpValues } from './schemas';

/**
 * URL a la que vuelven los enlaces de email (confirmación y recuperación).
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
    options: { emailRedirectTo: authRedirectUrl() },
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

/**
 * Canjea el ?code= de un enlace PKCE por una sesión.
 * Si el enlace era de recuperación, supabase-js emite PASSWORD_RECOVERY y AuthProvider lo registra.
 */
export async function exchangeCode(code: string) {
  const { error } = await requireSupabase().auth.exchangeCodeForSession(code);
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
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
