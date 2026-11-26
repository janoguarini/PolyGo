import { act, renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useBattleStore } from '../store';
import { useBattleSession } from '../useBattleSession';

/** Socket falso: guarda lo emitido y deja disparar eventos del servidor. */
class FakeSocket {
  connected = true;
  active = true;
  emitted: { event: string; payload: unknown }[] = [];
  handlers = new Map<string, ((...args: unknown[]) => void)[]>();
  replies: Record<string, unknown> = {};
  on(event: string, fn: (...args: unknown[]) => void) {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), fn]);
    return this;
  }
  once(event: string, fn: (...args: unknown[]) => void) {
    return this.on(event, fn);
  }
  fire(event: string, ...args: unknown[]) {
    for (const fn of this.handlers.get(event) ?? []) fn(...args);
  }
  timeout() {
    return this;
  }
  emitWithAck(event: string, payload?: unknown) {
    this.emitted.push({ event, payload });
    return Promise.resolve(this.replies[event] ?? { ok: true, data: payload ?? null });
  }
  connect() {}
  disconnect() {}
}

let mockSocket: FakeSocket;
const mockCreate = jest.fn();
const mockStatus = jest.fn();
const mockCancel = jest.fn();
const mockNotify = jest.fn();

jest.mock('../client', () => ({
  connectBattleSocket: () => mockSocket,
  connectErrorCode: () => 'connection',
}));
jest.mock('../humanMatchApi', () => ({
  humanMatchApi: {
    createChallenge: (...a: unknown[]) => mockCreate(...a),
    challengeStatus: (...a: unknown[]) => mockStatus(...a),
    cancelChallenge: (...a: unknown[]) => mockCancel(...a),
  },
}));
jest.mock('@/features/friends/push', () => ({
  notifyBattleInvite: (...a: unknown[]) => mockNotify(...a),
}));
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: {},
  ImpactFeedbackStyle: {},
}));
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);
const flush = () => act(async () => await new Promise((r) => setTimeout(r, 0)));

beforeEach(() => {
  mockSocket = new FakeSocket();
  mockCreate.mockReset().mockResolvedValue({ code: 'ABC123', expires_at: Date.now() + 120_000 });
  mockStatus.mockReset().mockResolvedValue({ status: 'waiting', battle_id: null });
  mockCancel.mockReset().mockResolvedValue(undefined);
  mockNotify.mockReset();
  useBattleStore.getState().dispatch({ type: 'reset' });
});

describe('desafío a un amigo por el servidor de partidas (= Ranked, sin ELO)', () => {
  it('anfitrión: crea el desafío, avisa al amigo y espera en el servidor con el código', async () => {
    const { result } = await renderHook(() => useBattleSession(), { wrapper });
    await act(async () => result.current.start('ranked', { role: 'host', inviteeId: 'beto' }));
    await flush();

    expect(mockCreate).toHaveBeenCalledWith('beto');
    expect(mockNotify).toHaveBeenCalledWith('ABC123');
    expect(mockSocket.emitted).toContainEqual({
      event: 'challenge:host',
      payload: { code: 'ABC123' },
    });
    const state = useBattleStore.getState();
    expect(state.friendly).toBe(true);
    expect(state.phase).toBe('searching');
    expect(state.challenge?.code).toBe('ABC123');
    // Nunca entra a la cola de Ranked.
    expect(mockSocket.emitted.some((e) => e.event === 'queue:join')).toBe(false);
  });

  it('al reconectarse vuelve a anunciarse con su código (no a la cola de Ranked)', async () => {
    const { result } = await renderHook(() => useBattleSession(), { wrapper });
    await act(async () => result.current.start('ranked', { role: 'host' }));
    await flush();
    mockSocket.emitted = [];
    await act(async () => mockSocket.fire('connect'));
    await flush();
    expect(mockSocket.emitted).toEqual([{ event: 'challenge:host', payload: { code: 'ABC123' } }]);
  });

  it('salir de la espera anula el desafío', async () => {
    const { result } = await renderHook(() => useBattleSession(), { wrapper });
    await act(async () => result.current.start('ranked', { role: 'host' }));
    await flush();
    await act(async () => result.current.leave());
    expect(mockCancel).toHaveBeenCalledWith('ABC123');
    expect(mockSocket.emitted.some((e) => e.event === 'queue:leave')).toBe(true);
  });

  it('amigo: entra con el código; si el anfitrión ya no está, lo dice', async () => {
    mockSocket.replies['challenge:join'] = { ok: false, code: 'host_gone' };
    const { result } = await renderHook(() => useBattleSession(), { wrapper });
    await act(async () => result.current.start('ranked', { role: 'guest', code: 'ABC123' }));
    await flush();
    expect(mockSocket.emitted).toContainEqual({
      event: 'challenge:join',
      payload: { code: 'ABC123' },
    });
    expect(mockCreate).not.toHaveBeenCalled();
    const state = useBattleStore.getState();
    expect(state.phase).toBe('error');
    expect(state.errorCode).toBe('host_gone');
  });

  it('Ranked sigue igual: a la cola', async () => {
    const { result } = await renderHook(() => useBattleSession(), { wrapper });
    await act(async () => result.current.start('ranked'));
    await flush();
    expect(mockSocket.emitted).toContainEqual({ event: 'queue:join', payload: { mode: 'ranked' } });
    expect(useBattleStore.getState().friendly).toBe(false);
  });
});
