import type PostHog from 'posthog-react-native';

import {
  __resetAnalyticsClient,
  identifyUser,
  resetAnalytics,
  setAnalyticsEnabled,
  track,
  trackScreen,
} from '@/lib/analytics';

import { screenName } from '../AnalyticsBootstrap';

jest.mock('posthog-react-native', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ session: null }) }));
jest.mock('@/features/plus/api', () => ({ usePlus: () => undefined }));
jest.mock('@/features/profile/hooks', () => ({ useMyProfile: () => ({ data: undefined }) }));

function fakeClient() {
  return {
    capture: jest.fn(),
    screen: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    optIn: jest.fn(),
    optOut: jest.fn(),
    optedOut: false,
  };
}

afterEach(() => __resetAnalyticsClient(undefined));

describe('analítica', () => {
  it('sin key (tests, desarrollo) no hace nada y nunca rompe', () => {
    expect(() => {
      track('lesson_started', { lesson_id: 'l1' });
      trackScreen('/review');
      identifyUser('u1');
      resetAnalytics();
      setAnalyticsEnabled(false);
    }).not.toThrow();
  });

  it('manda eventos sin propiedades vacías', () => {
    const c = fakeClient();
    __resetAnalyticsClient(c as unknown as PostHog);
    track('review_completed', { mode: 'review', accuracy: 0.8, extra: undefined });
    expect(c.capture).toHaveBeenCalledWith('review_completed', { mode: 'review', accuracy: 0.8 });
  });

  it('identifica sólo con el id interno y propiedades del producto', () => {
    const c = fakeClient();
    __resetAnalyticsClient(c as unknown as PostHog);
    identifyUser('user-1', { target_language: 'it', plus: true, region: undefined });
    expect(c.identify).toHaveBeenCalledWith('user-1', {
      $set: { target_language: 'it', plus: true },
    });
  });

  it('el interruptor de Ajustes apaga y prende', () => {
    const c = fakeClient();
    __resetAnalyticsClient(c as unknown as PostHog);
    setAnalyticsEnabled(false);
    expect(c.optOut).toHaveBeenCalled();
    setAnalyticsEnabled(true);
    expect(c.optIn).toHaveBeenCalled();
  });

  it('un error del SDK nunca llega a la app', () => {
    const c = fakeClient();
    c.capture.mockImplementation(() => {
      throw new Error('boom');
    });
    __resetAnalyticsClient(c as unknown as PostHog);
    expect(() => track('plus_viewed')).not.toThrow();
  });
});

describe('nombre de pantalla', () => {
  it('saca los grupos de Expo Router y deja los parámetros como plantilla', () => {
    expect(screenName(['(tabs)', 'practice'])).toBe('/practice');
    expect(screenName(['lesson', '[id]'])).toBe('/lesson/[id]');
    expect(screenName(['(tabs)'])).toBe('/');
    expect(screenName(['onboarding'])).toBe('/onboarding');
  });
});
