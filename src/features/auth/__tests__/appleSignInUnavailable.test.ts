import { Platform } from 'react-native';

import { toUserMessage } from '@/lib/errors';

import { signInWithApple } from '../apple';

/**
 * Build anterior a expo-apple-authentication / expo-crypto (p. ej. la Development Build de hoy):
 * importar expo-crypto falla al no encontrar su módulo nativo. La app debe abrir igual y sólo el
 * botón de Apple avisa que hay que actualizar.
 */
jest.mock('expo-crypto', () => {
  throw new Error("Cannot find native module 'ExpoCrypto'");
});
const mockAuth = { signInWithIdToken: jest.fn() };
jest.mock('@/lib/supabase', () => ({ requireSupabase: () => ({ auth: mockAuth }) }));

it('Apple avisa que hay que actualizar la app, sin llamar a Supabase', async () => {
  Object.defineProperty(Platform, 'OS', { value: 'ios' });
  const error = await signInWithApple().catch((e: unknown) => e);
  expect(error).toMatchObject({ code: 'apple_unavailable' });
  expect(toUserMessage(error)).toBe(
    'Esta versión de la app todavía no permite entrar con Apple. Actualízala o usa tu email.',
  );
  expect(mockAuth.signInWithIdToken).not.toHaveBeenCalled();
});
