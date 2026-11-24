import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { courseByCode } from '@shared/courses';
import { currentItem, replayPlacement } from '@shared/placement';

import { placementBankFor } from '@/features/placement/session';
import { PlacementUnsupportedError } from '@/features/placement/startCourse';
import { __setInterfaceLanguageForTests } from '@/i18n';

import PlacementScreen from '../placement/[code]';

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  canDismiss: jest.fn(() => true),
  dismissAll: jest.fn(),
  navigate: jest.fn(),
};
let mockCode = 'en-from-es';
const mockMutate = jest.fn();

jest.mock('expo-router', () => ({
  // Getter: el mock se arma antes de que se inicialice mockRouter.
  get router() {
    return mockRouter;
  },
  useLocalSearchParams: () => ({ code: mockCode }),
}));
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('@/features/learning/speech', () => ({
  speak: jest.fn(),
  stopSpeaking: jest.fn(),
  speakDialogue: jest.fn(() => jest.fn()),
  spokenText: (text: string) => text,
  useSpeechLanguage: jest.fn(),
}));
jest.mock('@/features/placement/startCourse', () => {
  const actual = jest.requireActual('@/features/placement/startCourse');
  return {
    ...actual,
    useStartCourse: () => ({ mutate: mockMutate, isPending: false }),
  };
});

const bank = placementBankFor(courseByCode('en-from-es')!)!;
/** Respuestas dadas hasta ahora (para saber qué pregunta hay en pantalla). */
let given: boolean[] = [];

/** Responde la pregunta en pantalla bien o mal, como un usuario, y pasa a la siguiente. */
async function answer(correct: boolean) {
  const item = currentItem(replayPlacement(bank, given))!;
  const e = item.exercise;
  const p = e.payload;
  if (p.type === 'order_words') {
    const target = e.answer.replace(/[.?!]$/, '').split(' ');
    const order = correct ? target : [...target].reverse();
    for (const token of order) {
      const enabled = screen
        .getAllByRole('button', { name: token })
        .find((b) => !b.props.accessibilityState?.disabled);
      await fireEvent.press(enabled!);
    }
  } else if (p.type === 'short_answer') {
    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribí acá…'),
      correct ? e.answer : 'zzz qqq',
    );
  } else if ('options' in p) {
    const option = correct ? e.answer : p.options.find((o) => o !== e.answer)!;
    await fireEvent.press(screen.getByRole('radio', { name: option }));
  }
  await fireEvent.press(screen.getByRole('button', { name: 'Comprobar' }));
  given = [...given, correct];
  return replayPlacement(bank, given).finished;
}

async function next() {
  const finished = replayPlacement(bank, given).finished;
  await fireEvent.press(
    screen.getByRole('button', { name: finished ? 'Ver mi resultado' : 'Siguiente' }),
  );
}

async function begin() {
  await render(<PlacementScreen />);
  await fireEvent.press(screen.getByRole('button', { name: 'Empezar el desafío' }));
}

beforeEach(() => {
  __setInterfaceLanguageForTests('es');
  mockCode = 'en-from-es';
  given = [];
  mockMutate.mockReset();
  for (const fn of Object.values(mockRouter)) fn.mockClear();
});

afterAll(() => __setInterfaceLanguageForTests('es'));

it('bienvenida: qué se evalúa, cómo funciona y cuánto dura', async () => {
  await render(<PlacementScreen />);
  expect(screen.getByText('¿Cuánto sabés?')).toBeTruthy();
  for (const label of [
    'Vocabulario',
    'Gramática',
    'Comprensión de frases',
    'Estructura de oraciones',
    'Uso en contexto',
  ]) {
    expect(screen.getByText(label)).toBeTruthy();
  }
  expect(screen.getByText('Hasta 12 preguntas · unos 3 minutos')).toBeTruthy();
  expect(screen.getByText(/Si salís, no se guarda nada/)).toBeTruthy();
});

it('progreso visible y preguntas de a una, con el nivel de la pregunta', async () => {
  await begin();
  expect(screen.getByLabelText('Pregunta 1, como máximo 12')).toBeTruthy();
  expect(screen.getByText('Pregunta 1')).toBeTruthy();
  expect(screen.getByText('Nivel A1')).toBeTruthy();
  await answer(true);
  expect(screen.getByText('¡Correcto!')).toBeTruthy();
  await next();
  expect(screen.getByText('Pregunta 2')).toBeTruthy();
});

it('dos errores al principio: A1, y «Comenzar curso» guarda el resultado en este curso', async () => {
  await begin();
  await answer(false);
  expect(screen.getByText('No era esa')).toBeTruthy();
  await next();
  await answer(false);
  await next();
  expect(screen.getByText('Tu nivel estimado es')).toBeTruthy();
  expect(screen.getByLabelText('Tu nivel estimado es A1, Principiante')).toBeTruthy();
  expect(screen.getByText('0 de 2 respuestas correctas')).toBeTruthy();
  expect(screen.getByText(/no un certificado oficial/)).toBeTruthy();
  expect(screen.getByText('Nivel A1 · Unidad 1: «Saludos y presentaciones»')).toBeTruthy();
  // Ya es A1: no hace falta «empezar desde A1».
  expect(screen.queryByRole('button', { name: 'Prefiero empezar desde A1' })).toBeNull();
  expect(mockMutate).not.toHaveBeenCalled();

  mockMutate.mockImplementation((_input, o: { onSuccess: (x: unknown) => void }) =>
    o.onSuccess({ created: true, startLevel: 'A1', legacy: false }),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Comenzar curso' }));
  expect(mockMutate.mock.calls[0][0]).toMatchObject({
    course: { code: 'en-from-es' },
    startLevel: 'A1',
    placement: { level: 'A1', correct: 0, total: 2, version: 'placement-v1' },
  });
  expect(mockRouter.dismissAll).toHaveBeenCalled();
  expect(mockRouter.navigate).toHaveBeenCalledWith('/');
});

it('todo bien: sube a A2, termina en A2 (el máximo publicado) y se puede elegir A1', async () => {
  await begin();
  let finished = false;
  let sawLevelUp = false;
  while (!finished) {
    finished = await answer(true);
    if (screen.queryByText('¡Subís al nivel A2!')) sawLevelUp = true;
    await next();
  }
  expect(sawLevelUp).toBe(true);
  expect(screen.getByLabelText('Tu nivel estimado es A2, Básico')).toBeTruthy();
  expect(screen.getByText(/el nivel más alto disponible/)).toBeTruthy();
  expect(screen.getByText('8 de 8 respuestas correctas')).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: 'Prefiero empezar desde A1' }));
  expect(mockMutate.mock.calls[0][0]).toMatchObject({
    startLevel: 'A1',
    placement: { level: 'A2', correct: 8, total: 8 },
  });
});

it('salir a mitad del test pide confirmación y no guarda nada', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  await begin();
  await answer(true);
  await fireEvent.press(screen.getByRole('button', { name: 'Salir del test' }));
  expect(alert).toHaveBeenCalledWith('¿Salir del test?', expect.any(String), expect.any(Array));
  const buttons = alert.mock.calls[0]![2] as { text: string; onPress?: () => void }[];
  await act(async () => buttons.find((b) => b.text === 'Salir')!.onPress!());
  expect(mockRouter.back).toHaveBeenCalled();
  expect(mockMutate).not.toHaveBeenCalled();
  alert.mockRestore();
});

it('si falla el guardado, muestra el error y reintenta con el mismo resultado', async () => {
  await begin();
  await answer(false);
  await next();
  await answer(false);
  await next();
  mockMutate.mockImplementationOnce((_input, o: { onError: (e: unknown) => void }) =>
    o.onError(new Error('network')),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Comenzar curso' }));
  expect(screen.getByText(/tus respuestas siguen acá/)).toBeTruthy();
  // El resultado sigue en pantalla.
  expect(screen.getByLabelText('Tu nivel estimado es A1, Principiante')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));
  expect(mockMutate).toHaveBeenCalledTimes(2);
  expect(mockMutate.mock.calls[1][0]).toEqual(mockMutate.mock.calls[0][0]);
});

it('sin la migración del test: lo explica y permite empezar desde A1 sin resultado', async () => {
  await begin();
  for (let i = 0; i < 4; i += 1) {
    await answer(true);
    await next();
  }
  // A2·1 perdida → A2.
  await answer(false);
  await next();
  await answer(false);
  await next();
  mockMutate.mockImplementationOnce((_input, o: { onError: (e: unknown) => void }) =>
    o.onError(new PlacementUnsupportedError()),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Comenzar curso' }));
  expect(screen.getByText(/hace falta una actualización del servidor/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Comenzar curso' })).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Prefiero empezar desde A1' }));
  expect(mockMutate.mock.calls[1][0]).toMatchObject({ startLevel: 'A1', placement: null });
});

it('si ya tenía el curso, avisa que se conservan su nivel y su progreso', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  await begin();
  await answer(false);
  await next();
  await answer(false);
  await next();
  mockMutate.mockImplementation((_input, o: { onSuccess: (x: unknown) => void }) =>
    o.onSuccess({ created: false, startLevel: 'A2', legacy: false }),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Comenzar curso' }));
  expect(alert).toHaveBeenCalledWith(
    'Ya tenías este curso',
    expect.stringContaining('Conservamos tu nivel (A2)'),
    expect.any(Array),
  );
  alert.mockRestore();
});

it('repetir el test vuelve a la bienvenida sin guardar', async () => {
  await begin();
  await answer(false);
  await next();
  await answer(false);
  await next();
  await fireEvent.press(screen.getByRole('button', { name: 'Hacer el test de nuevo' }));
  expect(screen.getByText('¿Cuánto sabés?')).toBeTruthy();
  expect(mockMutate).not.toHaveBeenCalled();
});

it('un curso sin test (un solo nivel) no muestra preguntas', async () => {
  mockCode = 'it-from-es';
  await render(<PlacementScreen />);
  expect(screen.getByText('Este curso no tiene test de nivel')).toBeTruthy();
});

it('en inglés: instrucciones y resultado en el idioma de la interfaz; las preguntas, del curso', async () => {
  __setInterfaceLanguageForTests('en');
  await render(<PlacementScreen />);
  expect(screen.getByText('How much do you know?')).toBeTruthy();
  expect(screen.getByText('Up to 12 questions · about 3 minutes')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Start the challenge' }));
  expect(screen.getByLabelText('Question 1, up to 12')).toBeTruthy();
  // La consigna es contenido del curso (en su idioma de origen), no de la interfaz.
  expect(screen.getByText(bank.bands[0]!.items[0]!.exercise.prompt)).toBeTruthy();
  const first = bank.bands[0]!.items[0]!.exercise;
  const wrong = (first.payload as { options: string[] }).options.find((o) => o !== first.answer)!;
  await fireEvent.press(screen.getByRole('radio', { name: wrong }));
  await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
  expect(screen.getByText('Not that one')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Next' }));
  const second = bank.bands[0]!.items[1]!.exercise;
  const wrong2 = (second.payload as { options: string[] }).options.find(
    (o) => o !== second.answer,
  )!;
  await fireEvent.press(screen.getByRole('radio', { name: wrong2 }));
  await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
  await fireEvent.press(screen.getByRole('button', { name: 'See my result' }));
  expect(screen.getByLabelText('Your estimated level is A1, Beginner')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Start course' })).toBeTruthy();
  expect(screen.getByText(/not an official certificate/)).toBeTruthy();
});
