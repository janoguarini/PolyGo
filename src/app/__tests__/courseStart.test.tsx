import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import type { CourseEnrollment } from '@/features/courses/level';
import { __setInterfaceLanguageForTests } from '@/i18n';

import CourseStartScreen from '../course-start/[code]';
import { LANGUAGES } from '@shared/languages';

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  canDismiss: jest.fn(() => true),
  dismissAll: jest.fn(),
  navigate: jest.fn(),
};
let mockCode = 'fr-from-es';
let mockCourses: {
  data: CourseEnrollment[] | null | undefined;
  isPending: boolean;
  isError: boolean;
};
const mockStart = jest.fn();
const mockSwitch = jest.fn();

jest.mock('expo-router', () => ({
  get router() {
    return mockRouter;
  },
  useLocalSearchParams: () => ({ code: mockCode }),
}));
jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn() }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/features/courses/hooks', () => ({
  useMyCourses: () => ({ ...mockCourses, refetch: jest.fn() }),
  useSwitchCourse: () => ({ mutate: mockSwitch, isPending: false }),
}));
jest.mock('@/features/profile/hooks', () => ({
  useIsContentTester: () => ({ data: false, isPending: false }),
}));
jest.mock('@/features/placement/startCourse', () => ({
  useStartCourse: () => ({ mutate: mockStart, isPending: false }),
}));

const enrollment = (course_code: string, start_level: string): CourseEnrollment => ({
  course_code,
  start_level,
  placement_level: null,
  placement_completed_at: null,
  enrolled_at: '2026-11-21T00:00:00Z',
  last_selected_at: null,
});

beforeEach(() => {
  __setInterfaceLanguageForTests('es');
  mockCode = 'fr-from-es';
  mockCourses = { data: [enrollment('en-from-es', 'A2')], isPending: false, isError: false };
  mockStart.mockReset();
  mockSwitch.mockReset();
  for (const fn of Object.values(mockRouter)) fn.mockClear();
});

afterAll(() => __setInterfaceLanguageForTests('es'));

/** Cambia por un momento la configuración de un idioma (hoy todos tienen A1 y A2 y están disponibles). */
async function withLanguage(
  code: string,
  patch: { levels?: string[]; status?: string },
  fn: () => Promise<void>,
) {
  const config = LANGUAGES.find((l) => l.code === code) as unknown as Record<string, unknown>;
  const saved = { levels: config.levels, status: config.status };
  Object.assign(config, patch);
  try {
    await fn();
  } finally {
    Object.assign(config, saved);
  }
}

it('ofrece los dos caminos: el test de nivel y empezar desde A1', async () => {
  await render(<CourseStartScreen />);
  expect(screen.getByText('Francés')).toBeTruthy();
  expect(screen.getByText('desde español')).toBeTruthy();
  expect(screen.getByText('¿Por dónde quieres empezar?')).toBeTruthy();
  expect(
    screen.getByRole('button', {
      name: 'Hacer el test de nivel. Un desafío corto para ubicarte entre A1 – A2. Hasta 12 preguntas, unos 3 minutos.',
    }),
  ).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Prefiero empezar desde A1' })).toBeTruthy();
  expect(screen.getByText('Desde la primera unidad: «Saludos y presentaciones».')).toBeTruthy();
  expect(screen.getByText(/tus otros cursos no cambian/)).toBeTruthy();
});

it('el test abre la pantalla del test de ese curso (sin guardar nada)', async () => {
  await render(<CourseStartScreen />);
  await fireEvent.press(screen.getByRole('button', { name: /^Hacer el test de nivel/ }));
  expect(mockRouter.push).toHaveBeenCalledWith({
    pathname: '/placement/[code]',
    params: { code: 'fr-from-es' },
  });
  expect(mockStart).not.toHaveBeenCalled();
});

it('«Prefiero empezar desde A1» guarda A1 sin resultado y va a Aprender', async () => {
  mockStart.mockImplementation((_input, o: { onSuccess: () => void }) => o.onSuccess());
  await render(<CourseStartScreen />);
  await fireEvent.press(screen.getByRole('button', { name: 'Prefiero empezar desde A1' }));
  expect(mockStart).toHaveBeenCalledTimes(1);
  expect(mockStart.mock.calls[0][0]).toMatchObject({
    course: { code: 'fr-from-es' },
    startLevel: 'A1',
    placement: null,
  });
  expect(mockRouter.dismissAll).toHaveBeenCalled();
  expect(mockRouter.navigate).toHaveBeenCalledWith('/');
});

it('si falla, avisa que no cambió nada y ofrece reintentar', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  mockStart.mockImplementationOnce((_input, o: { onError: () => void }) => o.onError());
  await render(<CourseStartScreen />);
  await fireEvent.press(screen.getByRole('button', { name: 'Prefiero empezar desde A1' }));
  expect(alert.mock.calls[0]![0]).toBe('No pudimos empezar el curso');
  expect(alert.mock.calls[0]![1]).toMatch(/No se cambió nada/);
  const retry = (alert.mock.calls[0]![2] as { text: string; onPress?: () => void }[]).find(
    (b) => b.text === 'Reintentar',
  )!;
  await act(async () => retry.onPress!());
  expect(mockStart).toHaveBeenCalledTimes(2);
  expect(mockRouter.navigate).not.toHaveBeenCalled();
  alert.mockRestore();
});

it('un curso con un solo nivel no ofrece test: empieza desde el principio', async () => {
  mockCode = 'it-from-es';
  await withLanguage('it', { levels: ['A1'] }, async () => {
    await render(<CourseStartScreen />);
    expect(screen.getByText(/tiene sólo el nivel A1/)).toBeTruthy();
    expect(screen.queryByText('Hacer el test de nivel')).toBeNull();
    expect(screen.getByRole('button', { name: 'Prefiero empezar desde A1' })).toBeTruthy();
  });
});

it('italiano, portugués, chino y español (A1 y A2) ofrecen el test de nivel', async () => {
  for (const code of ['it-from-es', 'pt-from-es', 'zh-from-es', 'es-from-en']) {
    mockCode = code;
    const view = await render(<CourseStartScreen />);
    expect(screen.getByRole('button', { name: /^Hacer el test de nivel/ })).toBeTruthy();
    await view.unmount();
  }
});

it('sin el modelo de cursos aplicado, el test no se ofrece como botón', async () => {
  mockCourses = { data: null, isPending: false, isError: false };
  await render(<CourseStartScreen />);
  expect(screen.getByText(/próxima actualización del servidor/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: /^Hacer el test de nivel/ })).toBeNull();
  expect(screen.getByRole('button', { name: 'Prefiero empezar desde A1' })).toBeTruthy();
});

it('un curso en el que ya está inscripto no se vuelve a empezar: conserva su nivel', async () => {
  mockCourses = {
    data: [enrollment('en-from-es', 'A2'), enrollment('fr-from-es', 'A2')],
    isPending: false,
    isError: false,
  };
  await render(<CourseStartScreen />);
  expect(screen.getByText('Ya estás en este curso')).toBeTruthy();
  expect(screen.getByText('Conservas tu nivel (A2) y tu progreso.')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Ir al curso' }));
  expect(mockSwitch.mock.calls[0][0]).toMatchObject({ code: 'fr-from-es' });
  expect(mockStart).not.toHaveBeenCalled();
});

it('cursos «Próximamente», ocultos o inexistentes no se pueden empezar', async () => {
  await withLanguage('es', { status: 'soon' }, async () => {
    for (const code of ['es-from-en', 'xx-from-es']) {
      mockCode = code;
      const view = await render(<CourseStartScreen />);
      expect(screen.getByText('Curso no disponible')).toBeTruthy();
      expect(screen.queryByRole('button', { name: /empezar desde/ })).toBeNull();
      await view.unmount();
    }
  });
});

it('carga y error', async () => {
  mockCourses = { data: undefined, isPending: true, isError: false };
  const view = await render(<CourseStartScreen />);
  expect(screen.getByText('Preparando el curso…')).toBeTruthy();
  await view.unmount();
  mockCourses = { data: undefined, isPending: false, isError: true };
  await render(<CourseStartScreen />);
  expect(screen.getByRole('button', { name: /Reintentar/ })).toBeTruthy();
});

it('en inglés', async () => {
  __setInterfaceLanguageForTests('en');
  await render(<CourseStartScreen />);
  expect(screen.getByText('Where do you want to start?')).toBeTruthy();
  expect(screen.getByRole('button', { name: /^Take the placement test/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'I’d rather start from A1' })).toBeTruthy();
  expect(screen.getByText('from Spanish')).toBeTruthy();
});
