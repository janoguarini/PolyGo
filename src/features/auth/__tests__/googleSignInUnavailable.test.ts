import { toUserMessage } from '@/lib/errors';

import { signIn, signInWithGoogle } from '../api';

/**
 * Build anterior a expo-web-browser (p. ej. la Development Build instalada hoy): el import del
 * paquete falla al no encontrar el módulo nativo ExpoWebBrowser. Antes eso rompía toda la app al
 * arrancar; ahora sólo se desactiva el inicio con Google.
 */
jest.mock('expo-web-browser', () => {
  throw new Error("Cannot find native module 'ExpoWebBrowser'");
});

const mockAuth = { signInWithOAuth: jest.fn(), signInWithPassword: jest.fn() };
jest.mock('@/lib/supabase', () => ({ requireSupabase: () => ({ auth: mockAuth }) }));
jest.mock('@/features/friends/pushToken', () => ({ unregisterPush: jest.fn() }));
jest.mock('expo-linking', () => ({ createURL: () => 'polygo://auth-callback' }));

it('Google avisa que hay que actualizar la app, sin pedirle nada a Supabase', async () => {
  const error = await signInWithGoogle().catch((e: unknown) => e);
  expect(error).toMatchObject({ code: 'oauth_unavailable' });
  expect(toUserMessage(error)).toBe(
    'Esta versión de la app todavía no permite entrar con Google. Actualizala o usá tu email.',
  );
  expect(mockAuth.signInWithOAuth).not.toHaveBeenCalled();
});

it('el login por email sigue funcionando en esa build', async () => {
  mockAuth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
  await signIn({ email: 'a@b.com', password: 'secreto' });
  expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
    email: 'a@b.com',
    password: 'secreto',
  });
});
