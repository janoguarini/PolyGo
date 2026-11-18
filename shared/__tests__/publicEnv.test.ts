import { checkPublicEnv, rankedBackendFor, resolveBattleServer } from '../publicEnv';

const RAILWAY = 'https://battle-server-production-e40e9e40.up.railway.app';

describe('resolveBattleServer', () => {
  it('vacía o sólo espacios = missing', () => {
    expect(resolveBattleServer(undefined, { production: true })).toEqual({ status: 'missing' });
    expect(resolveBattleServer('   ', { production: false })).toEqual({ status: 'missing' });
  });

  it('https vale en los dos entornos', () => {
    for (const production of [true, false]) {
      expect(resolveBattleServer(RAILWAY, { production })).toEqual({
        status: 'configured',
        url: RAILWAY,
      });
    }
  });

  it('http sólo en desarrollo (servidor en la red local)', () => {
    const local = 'http://192.168.0.10:3001';
    expect(resolveBattleServer(local, { production: false }).status).toBe('configured');
    expect(resolveBattleServer(local, { production: true })).toEqual({ status: 'invalid' });
  });

  it('basura o protocolos raros = invalid', () => {
    for (const raw of ['railway.app', 'not a url', 'ftp://x.org', 'ws://x.org']) {
      expect(resolveBattleServer(raw, { production: false })).toEqual({ status: 'invalid' });
    }
  });
});

describe('rankedBackendFor', () => {
  const configured = { status: 'configured', url: RAILWAY } as const;

  it('con URL válida siempre usa el servidor de partidas', () => {
    expect(rankedBackendFor(configured, { production: true })).toBe('server');
    expect(rankedBackendFor(configured, { production: false })).toBe('server');
  });

  it('sin URL: legacy sólo en desarrollo; en preview/production se deshabilita (nunca legacy)', () => {
    expect(rankedBackendFor({ status: 'missing' }, { production: false })).toBe('legacy');
    expect(rankedBackendFor({ status: 'missing' }, { production: true })).toBe('disabled');
  });

  it('URL inválida: deshabilitado en cualquier entorno (no cae al legacy)', () => {
    expect(rankedBackendFor({ status: 'invalid' }, { production: false })).toBe('disabled');
    expect(rankedBackendFor({ status: 'invalid' }, { production: true })).toBe('disabled');
  });
});

describe('checkPublicEnv y el servidor de partidas', () => {
  const base = {
    EXPO_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_0123456789abcdef',
    EXPO_PUBLIC_PRIVACY_POLICY_URL: 'https://example.org/privacidad',
  };

  it('una URL inválida del servidor sólo marca esa variable', () => {
    const problems = checkPublicEnv(
      { ...base, EXPO_PUBLIC_BATTLE_SERVER_URL: 'http://insegura.example.org' },
      { production: true },
    );
    expect(problems).toEqual([{ name: 'EXPO_PUBLIC_BATTLE_SERVER_URL', problem: 'invalid' }]);
  });

  it('producción exige la URL; desarrollo no', () => {
    expect(checkPublicEnv(base, { production: true })).toEqual([
      { name: 'EXPO_PUBLIC_BATTLE_SERVER_URL', problem: 'missing' },
    ]);
    expect(checkPublicEnv(base, { production: false })).toEqual([]);
  });
});
