import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { courseByCode } from '@shared/courses';

import { useSwitchCourse } from '../hooks';

const mockSetActiveCourse = jest.fn();
const mockSetTargetLanguage = jest.fn();

jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'u1' } } }),
}));
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setActiveCourse: (code: string) => mockSetActiveCourse(code),
}));
jest.mock('@/features/profile/api', () => ({
  ...jest.requireActual('@/features/profile/api'),
  setTargetLanguage: (language: string) => mockSetTargetLanguage(language),
}));

const meKey = ['profile', 'me', 'u1'];
const xpKey = ['learning', 'xp', 'u1'];
const xp = { total: 1234, level: 7 };

async function setup(profile: Record<string, unknown>) {
  const client = new QueryClient({
    defaultOptions: {
      mutations: { retry: false, gcTime: Infinity },
      queries: { gcTime: Infinity },
    },
  });
  client.setQueryData(meKey, {
    profile: { id: 'u1', target_language: 'en', start_level: 'A2', ...profile },
    rating: { language_code: 'en', rating: 640 },
    settings: null,
  });
  client.setQueryData(xpKey, xp);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...(await renderHook(() => useSwitchCourse(), { wrapper })) };
}

beforeEach(() => {
  mockSetActiveCourse.mockReset();
  mockSetTargetLanguage.mockReset();
});

it('con el modelo de cursos, cambia el curso activo con set_active_course', async () => {
  mockSetActiveCourse.mockResolvedValue({ id: 'u1' });
  const { result, client } = await setup({ active_course_code: 'en-from-es' });
  await act(async () => {
    result.current.mutate(courseByCode('it-from-es')!);
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockSetActiveCourse).toHaveBeenCalledWith('it-from-es');
  expect(mockSetTargetLanguage).not.toHaveBeenCalled();
  const me = client.getQueryData<{ profile: Record<string, unknown>; rating: unknown }>(meKey)!;
  expect(me.profile).toMatchObject({ target_language: 'it', active_course_code: 'it-from-es' });
  // El ELO es por idioma: el de inglés no se muestra en italiano.
  expect(me.rating).toBeNull();
});

it('sin la migración, cae en set_target_language y no inventa la columna del curso', async () => {
  mockSetActiveCourse.mockResolvedValue(null);
  mockSetTargetLanguage.mockResolvedValue({ id: 'u1' });
  const { result, client } = await setup({});
  await act(async () => {
    result.current.mutate(courseByCode('pt-from-es')!);
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockSetTargetLanguage).toHaveBeenCalledWith('pt');
  const me = client.getQueryData<{ profile: Record<string, unknown> }>(meKey)!;
  expect(me.profile.target_language).toBe('pt');
  expect('active_course_code' in me.profile).toBe(false);
});

it('el XP es global: cambiar de curso no lo toca', async () => {
  mockSetActiveCourse.mockResolvedValue({ id: 'u1' });
  const { result, client } = await setup({ active_course_code: 'en-from-es' });
  await act(async () => {
    result.current.mutate(courseByCode('zh-from-es')!);
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(client.getQueryData(xpKey)).toEqual(xp);
});

it('si falla, vuelve al curso anterior', async () => {
  mockSetActiveCourse.mockRejectedValue(new Error('course_unavailable'));
  const { result, client } = await setup({ active_course_code: 'en-from-es' });
  await act(async () => {
    result.current.mutate(courseByCode('fr-from-es')!);
  });
  await waitFor(() => expect(result.current.isError).toBe(true));
  const me = client.getQueryData<{ profile: Record<string, unknown> }>(meKey)!;
  expect(me.profile).toMatchObject({ target_language: 'en', active_course_code: 'en-from-es' });
});
