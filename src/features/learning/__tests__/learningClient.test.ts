import { LEARNING_CONTRACT } from '@shared/learningSession';

import { learningClient } from '../api';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { version: '0.2.0' } },
}));
jest.mock('@/lib/supabase', () => ({ requireSupabase: jest.fn() }));

test('la app declara su contrato y su versión a la Edge Function (fase 5)', () => {
  const c = learningClient();
  expect(c.contract).toBe(LEARNING_CONTRACT);
  expect(c.app_version).toBe('0.2.0');
  expect(['ios', 'android', 'web']).toContain(c.platform);
});
