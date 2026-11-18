import { checkPublicEnv, looksLikeSecretKey } from '@shared/publicEnv';

import { signUp } from '@/features/auth/api';
import { CURRICULUM_API, clientHeaders } from '@/lib/clientInfo';

import { fetchClientCompatibility } from '../api';
import { mustUpdate, parseCompatibility } from '../status';

/** Fase C.5: compatibilidad de la build con el servidor (la lógica de la política está en SQL). */

const mockConstants = { expoConfig: { version: '1.4.0' } as { version?: string } | null };
jest.mock('expo-constants', () => ({
  __esModule: true,
  get default() {
    return mockConstants;
  },
}));
const mockRpc = jest.fn();
const mockSignUp = jest.fn();
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => ({ rpc: mockRpc, auth: { signUp: mockSignUp } }),
}));
jest.mock('expo-linking', () => ({ createURL: (p: string) => `polygo://${p}` }));
jest.mock('@/features/friends/pushToken', () => ({ unregisterPush: jest.fn() }));

const server = (over: Record<string, unknown> = {}) => ({
  status: 'ok',
  installed_version: '1.4.0',
  min_version: null,
  curriculum_api: 1,
  min_curriculum_api: 0,
  message: null,
  update_url: null,
  ...over,
});

beforeEach(() => {
  mockRpc.mockReset();
  mockSignUp.mockReset();
  mockConstants.expoConfig = { version: '1.4.0' };
});

test('la build declara su nivel curricular en cada request y en el alta', async () => {
  expect(CURRICULUM_API).toBe(1);
  expect(clientHeaders()).toEqual({ 'x-polygo-curriculum-api': '1' });

  mockSignUp.mockResolvedValue({ data: { session: null }, error: null });
  await signUp({ email: 'a@b.dev', password: 'x', confirmPassword: 'x' } as never);
  expect(mockSignUp.mock.calls[0][0].options.data).toEqual({ polygo_curriculum_api: 1 });
});

test('8: versión compatible → ok, sin bloqueo; la consulta manda versión, plataforma y nivel', async () => {
  mockRpc.mockResolvedValue({ data: server(), error: null });
  const c = await fetchClientCompatibility();
  expect(mockRpc).toHaveBeenCalledWith('app_client_status', {
    p_app_version: '1.4.0',
    p_platform: expect.stringMatching(/^(ios|android|web)$/),
    p_curriculum_api: 1,
  });
  expect(c.status).toBe('ok');
  expect(mustUpdate(c)).toBe(false);
});

test('7: versión inferior a la mínima → aviso con mensaje del servidor', async () => {
  mockRpc.mockResolvedValue({
    data: server({
      status: 'update_required',
      installed_version: '1.1.0',
      min_version: '1.2.0',
      message: 'Actualizá',
      update_url: 'https://example.org/app',
    }),
    error: null,
  });
  const c = await fetchClientCompatibility();
  expect(mustUpdate(c)).toBe(true);
  expect(c).toMatchObject({
    minVersion: '1.2.0',
    message: 'Actualizá',
    updateUrl: 'https://example.org/app',
  });
  // Sin mensaje del servidor: uno por defecto; una URL no https no se abre.
  const d = parseCompatibility(
    server({ status: 'update_required', update_url: 'http://x' }),
    '1',
    1,
  );
  expect(d.message).toMatch(/Actualizala/);
  expect(d.updateUrl).toBeNull();
});

test('6: sin versión disponible → se consulta igual y no se bloquea', async () => {
  mockConstants.expoConfig = null;
  mockRpc.mockResolvedValue({
    data: server({ status: 'unknown', installed_version: null }),
    error: null,
  });
  const c = await fetchClientCompatibility();
  expect(mockRpc.mock.calls[0][1].p_app_version).toBeNull();
  expect(c.status).toBe('unknown');
  expect(mustUpdate(c)).toBe(false);
});

test('backend sin la función, caído o con respuesta rara → unavailable, nunca bloquea', async () => {
  mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'function not found' } });
  expect((await fetchClientCompatibility()).status).toBe('unavailable');
  mockRpc.mockRejectedValueOnce(new Error('offline'));
  expect((await fetchClientCompatibility()).status).toBe('unavailable');
  mockRpc.mockResolvedValueOnce({ data: { status: 'blocked' }, error: null });
  const c = await fetchClientCompatibility();
  expect(c.status).toBe('unavailable');
  expect(mustUpdate(c)).toBe(false);
});

describe('variables EXPO_PUBLIC_*', () => {
  const jwt = (role: string) =>
    `x.${btoa(JSON.stringify({ role })).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')}.y`;
  const ok = {
    EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_0123456789abcdef',
    EXPO_PUBLIC_BATTLE_SERVER_URL: 'https://battle.example.org',
    EXPO_PUBLIC_PRIVACY_POLICY_URL: 'https://example.org/privacidad',
  };

  test('desarrollo: sólo Supabase es obligatorio; http permitido', () => {
    expect(
      checkPublicEnv(
        {
          ...ok,
          EXPO_PUBLIC_BATTLE_SERVER_URL: 'http://192.168.0.2:3001',
          EXPO_PUBLIC_PRIVACY_POLICY_URL: '',
        },
        { production: false },
      ),
    ).toEqual([]);
    expect(checkPublicEnv({}, { production: false }).map((p) => p.name)).toEqual([
      'EXPO_PUBLIC_SUPABASE_URL',
      'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    ]);
  });

  test('producción: las cuatro obligatorias y https', () => {
    expect(checkPublicEnv(ok, { production: true })).toEqual([]);
    expect(
      checkPublicEnv({ ...ok, EXPO_PUBLIC_BATTLE_SERVER_URL: undefined }, { production: true }),
    ).toEqual([{ name: 'EXPO_PUBLIC_BATTLE_SERVER_URL', problem: 'missing' }]);
    expect(
      checkPublicEnv(
        { ...ok, EXPO_PUBLIC_BATTLE_SERVER_URL: 'http://x.org' },
        { production: true },
      ),
    ).toEqual([{ name: 'EXPO_PUBLIC_BATTLE_SERVER_URL', problem: 'invalid' }]);
  });

  test('una clave secreta nunca pasa como clave pública', () => {
    expect(looksLikeSecretKey(jwt('service_role'))).toBe(true);
    expect(looksLikeSecretKey('sb_secret_abcdefghijklmnopqrstuvwxyz')).toBe(true);
    expect(looksLikeSecretKey(jwt('anon'))).toBe(false);
    expect(
      checkPublicEnv(
        { ...ok, EXPO_PUBLIC_SUPABASE_ANON_KEY: jwt('service_role') + 'padding-padding' },
        { production: false },
      ),
    ).toEqual([{ name: 'EXPO_PUBLIC_SUPABASE_ANON_KEY', problem: 'secret' }]);
  });
});
