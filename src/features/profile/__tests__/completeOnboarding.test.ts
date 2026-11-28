import { __setInterfaceLanguageForTests } from '@/i18n';

import { completeOnboarding, type OnboardingInput } from '../api';

const mockCall = jest.fn();
const mockRpc = jest.fn();
jest.mock('@/lib/pendingRpc', () => ({
  callPendingRpc: (...args: unknown[]) => mockCall(...args),
}));
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => ({ rpc: (...args: unknown[]) => mockRpc(...args) }),
}));

const base: OnboardingInput = {
  username: 'polyfan',
  avatarId: 'classic',
  targetLanguage: 'en',
  startLevel: 'A2',
  dailyGoalMinutes: 15,
};
const profile = { id: 'u1' };

beforeEach(() => {
  __setInterfaceLanguageForTests('es');
  mockCall.mockReset().mockResolvedValue(profile);
  mockRpc.mockReset().mockResolvedValue({ data: profile, error: null });
});

describe('completeOnboarding', () => {
  it('curso por defecto y A2: complete_onboarding (v1), como siempre', async () => {
    await expect(completeOnboarding(base)).resolves.toBe(profile);
    expect(mockCall).not.toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledWith('complete_onboarding', {
      p_username: 'polyfan',
      p_avatar_id: 'classic',
      p_target_language: 'en',
      p_start_level: 'A2',
      p_daily_goal_minutes: 15,
    });
  });

  it('curso por defecto y B1: v2 con el código del curso por defecto (en-from-es)', async () => {
    await expect(completeOnboarding({ ...base, startLevel: 'B1' })).resolves.toBe(profile);
    expect(mockRpc).not.toHaveBeenCalled();
    expect(mockCall).toHaveBeenCalledWith('complete_onboarding_v2', {
      p_username: 'polyfan',
      p_avatar_id: 'classic',
      p_course_code: 'en-from-es',
      p_start_level: 'B1',
      p_daily_goal_minutes: 15,
      p_interface_language: 'es',
    });
  });

  it('curso por defecto y B2: también v2 (profiles.start_level no admite B2)', async () => {
    await completeOnboarding({ ...base, startLevel: 'B2' });
    expect(mockRpc).not.toHaveBeenCalled();
    expect(mockCall).toHaveBeenCalledWith(
      'complete_onboarding_v2',
      expect.objectContaining({ p_course_code: 'en-from-es', p_start_level: 'B2' }),
    );
  });

  it('un curso que no es el por defecto va por v2 con su código, aunque el nivel sea A1', async () => {
    await completeOnboarding({ ...base, startLevel: 'A1', courseCode: 'en-from-pt' });
    expect(mockRpc).not.toHaveBeenCalled();
    expect(mockCall).toHaveBeenCalledWith(
      'complete_onboarding_v2',
      expect.objectContaining({ p_course_code: 'en-from-pt', p_start_level: 'A1' }),
    );
  });

  it('v1: un error del servidor se propaga', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    await expect(completeOnboarding(base)).rejects.toEqual({ message: 'boom' });
  });
});
