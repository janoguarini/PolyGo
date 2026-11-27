import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { buildCourseList, type CourseList } from '@/features/courses/catalog';
import type { CourseEnrollment } from '@/features/courses/level';
import { __setInterfaceLanguageForTests } from '@/i18n';

import CoursesScreen from '../courses';

const mockBack = jest.fn();
const mockMutate = jest.fn();
const mockPush = jest.fn();
let mockState: {
  list: CourseList | null;
  isPending: boolean;
  isError: boolean;
  progressError: boolean;
};

jest.mock('expo-router', () => ({
  router: { back: () => mockBack(), push: (...args: unknown[]) => mockPush(...args) },
}));
jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn() }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/features/profile/components/LanguagesRow', () => ({
  usePrefetchLanguagePaths: () => undefined,
}));
jest.mock('@/features/courses/useCourseList', () => ({
  useCourseList: () => ({ ...mockState, progressPending: false, refetch: jest.fn() }),
}));
jest.mock('@/features/courses/hooks', () => ({
  useSwitchCourse: () => ({ mutate: mockMutate, isPending: false }),
}));

const enrollment = (course_code: string, start_level: string): CourseEnrollment => ({
  course_code,
  start_level,
  placement_level: null,
  placement_completed_at: null,
  enrolled_at: '2026-11-21T00:00:00Z',
  last_selected_at: null,
});

/** Estudia inglés A2 (3/120) e italiano A1 (40/120); el resto se puede empezar. */
const sampleList = () =>
  buildCourseList({
    profile: { target_language: 'en', start_level: 'A2', active_course_code: 'en-from-es' },
    enrollments: [enrollment('en-from-es', 'A2'), enrollment('it-from-es', 'A1')],
    progressByLanguage: new Map([
      ['en', { progress: { level: 'A2', completed: 3, total: 120, ratio: 0.025 }, started: true }],
      ['it', { progress: { level: 'A1', completed: 40, total: 120, ratio: 1 / 3 }, started: true }],
    ]),
    isTester: false,
  });

beforeEach(() => {
  __setInterfaceLanguageForTests('es');
  mockBack.mockClear();
  mockMutate.mockClear();
  mockPush.mockClear();
  mockState = { list: sampleList(), isPending: false, isError: false, progressError: false };
});

afterAll(() => __setInterfaceLanguageForTests('es'));

it('muestra el curso activo, desde qué idioma se aprende y su nivel', async () => {
  await render(<CoursesScreen />);
  expect(screen.getByText('ESTÁS APRENDIENDO')).toBeTruthy();
  expect(screen.getByLabelText('Curso actual: Inglés desde español, nivel A2')).toBeTruthy();
  expect(screen.getByText('Nivel A2 · 3 de 120 lecciones')).toBeTruthy();
  expect(screen.getByText(/mismos en todos los cursos/)).toBeTruthy();
});

it('mis cursos muestra cada curso con su propio nivel y progreso', async () => {
  await render(<CoursesScreen />);
  expect(screen.getByText('MIS CURSOS')).toBeTruthy();
  expect(
    screen.getByRole('button', { name: 'Italiano desde español, nivel A1, 33 por ciento' }),
  ).toBeTruthy();
});

it('los cursos para empezar van por idioma de origen: test de nivel o desde A1', async () => {
  await render(<CoursesScreen />);
  expect(screen.getByText('EMPEZAR UN CURSO NUEVO')).toBeTruthy();
  expect(screen.getByText(/Para hablantes de español/)).toBeTruthy();
  // Todos los cursos tienen A1 y A2: francés, portugués y chino (desde español) y español (desde
  // inglés) ofrecen el test de nivel.
  expect(screen.getAllByText(/Test de nivel o desde A1/).length).toBe(4);
  expect(screen.queryByText(/Empiezas desde A1/)).toBeNull();
  expect(screen.getByText(/Para hablantes de inglés/)).toBeTruthy();
});

it('tocar uno de mis cursos lo elige y vuelve a Aprender; uno nuevo abre por dónde empezar', async () => {
  await render(<CoursesScreen />);
  await fireEvent.press(
    screen.getByRole('button', { name: 'Italiano desde español, nivel A1, 33 por ciento' }),
  );
  expect(mockMutate).toHaveBeenCalledTimes(1);
  expect(mockMutate.mock.calls[0][0]).toMatchObject({ code: 'it-from-es', target: 'it' });
  expect(mockBack).toHaveBeenCalledTimes(1);

  // Un curso nuevo no se elige directo (Fase 4): se abre la elección entre test y A1.
  await fireEvent.press(
    screen.getByRole('button', { name: /Chino mandarín desde español, nivel A1$/ }),
  );
  expect(mockMutate).toHaveBeenCalledTimes(1);
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/course-start/[code]',
    params: { code: 'zh-from-es' },
  });
  expect(
    screen.getByRole('button', { name: /Francés desde español/ }).props.accessibilityHint,
  ).toMatch(/test de nivel/);
});

it('si el cambio falla, avisa que el progreso está a salvo', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  mockMutate.mockImplementation((_course, options: { onError: () => void }) => options.onError());
  await render(<CoursesScreen />);
  await fireEvent.press(
    screen.getByRole('button', { name: 'Italiano desde español, nivel A1, 33 por ciento' }),
  );
  expect(alert).toHaveBeenCalledWith(
    'No pudimos cambiar de curso',
    'Tu progreso está a salvo. Vuelve a intentarlo en un rato.',
  );
  alert.mockRestore();
});

it('sin cursos para empezar lo dice en vez de dejar la sección vacía', async () => {
  mockState.list = { ...sampleList(), available: [] };
  await render(<CoursesScreen />);
  expect(screen.getByText(/Ya estás en todos los cursos disponibles/)).toBeTruthy();
});

it('estado de carga', async () => {
  mockState = { list: null, isPending: true, isError: false, progressError: false };
  await render(<CoursesScreen />);
  expect(screen.getByText('Cargando tus cursos…')).toBeTruthy();
});

it('estado de error', async () => {
  mockState = { list: null, isPending: false, isError: true, progressError: false };
  await render(<CoursesScreen />);
  expect(screen.getByText('No pudimos cargar tus cursos.')).toBeTruthy();
});

it('en inglés: textos, idiomas y etiquetas de accesibilidad en inglés', async () => {
  __setInterfaceLanguageForTests('en');
  await render(<CoursesScreen />);
  expect(screen.getByText(/YOU’RE LEARNING/)).toBeTruthy();
  expect(screen.getByLabelText('Current course: English from Spanish, level A2')).toBeTruthy();
  expect(screen.getByText(/For Spanish speakers/)).toBeTruthy();
  expect(
    screen.getByRole('button', { name: 'Italian from Spanish, level A1, 33 percent' }),
  ).toBeTruthy();
  expect(screen.queryByText(/Starts at A1/)).toBeNull();
  expect(screen.getAllByText(/Placement test or start at A1/).length).toBe(4);
  expect(screen.getByText('Keep learning')).toBeTruthy();
});
