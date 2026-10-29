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
