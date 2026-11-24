import { syncXp, useXp } from '../api';

const mockCall = jest.fn();
jest.mock('@/lib/pendingRpc', () => ({
  callPendingRpc: (...args: unknown[]) => mockCall(...args),
  isMissingRpc: (e: { code?: string }) => e?.code === 'PGRST202',
}));
jest.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ session: null }) }));

describe('sincronización real de XP (sin PREVIEW)', () => {
  beforeEach(() => mockCall.mockReset());

  it('useXp es la consulta real a sync_xp', () => {
    expect(useXp.name).toBe('useServerXp');
  });

  it('llama a sync_xp sin parámetros (el cliente nunca manda XP)', async () => {
    const state = { total: 60, level: 2 };
    mockCall.mockResolvedValue(state);
    await expect(syncXp()).resolves.toBe(state);
    expect(mockCall).toHaveBeenCalledWith('sync_xp');
    expect(mockCall.mock.calls[0]).toHaveLength(1);
  });

  it('sin la migración (PGRST202) no inventa XP: devuelve null', async () => {
    mockCall.mockRejectedValue({ code: 'PGRST202' });
    await expect(syncXp()).resolves.toBeNull();
  });

  it('otros errores se propagan', async () => {
    mockCall.mockRejectedValue({ code: '500' });
    await expect(syncXp()).rejects.toEqual({ code: '500' });
  });
});
