import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { courseByCode } from '@shared/courses';
import { currentItem, replayPlacement } from '@shared/placement';

import { placementBankFor } from '@/features/placement/session';
import { PlacementUnsupportedError } from '@/features/placement/startCourse';
import { __setInterfaceLanguageForTests } from '@/i18n';

import PlacementScreen from '../placement/[code]';
import { LANGUAGES } from '@shared/languages';

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

/** El banco de en-from-es (A1–B2 publicados: 8 bandas, hasta 24 preguntas). */
const fullBank = placementBankFor(courseByCode('en-from-es')!)!;
/** El banco que tiene la pantalla (un test puede acotar los niveles publicados). */
let bank = fullBank;
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
      // La ficha libre del banco (va después de la oración). Las ya elegidas también son botones (al
      // tocarlas vuelven al banco), y una palabra puede repetirse (p. ej. «the» dos veces en B2).
      const enabled = screen
        .getAllByRole('button', { name: token })
        .filter((b) => !b.props.accessibilityState?.disabled)
        .at(-1);
      await fireEvent.press(enabled!);
    }
  } else if (p.type === 'short_answer') {
    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe aquí…'),
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
  bank = fullBank;
  given = [];
  mockMutate.mockReset();
  for (const fn of Object.values(mockRouter)) fn.mockClear();
});

afterAll(() => __setInterfaceLanguageForTests('es'));

/** Cambia por un momento la configuración de un idioma (niveles publicados o estado). */
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

it('bienvenida: qué se evalúa, cómo funciona y cuánto dura', async () => {
  await render(<PlacementScreen />);
  expect(screen.getByText('¿Cuánto sabes?')).toBeTruthy();
  for (const label of [
    'Vocabulario',
    'Gramática',
    'Comprensión de frases',
    'Estructura de oraciones',
    'Uso en contexto',
  ]) {
    expect(screen.getByText(label)).toBeTruthy();
  }
  expect(screen.getByText('Hasta 24 preguntas · unos 6 minutos')).toBeTruthy();
  expect(screen.getByText(/Si sales, no se guarda nada/)).toBeTruthy();
});

it('progreso visible y preguntas de a una, con el nivel de la pregunta', async () => {
  await begin();
  expect(screen.getByLabelText('Pregunta 1, como máximo 24')).toBeTruthy();
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

it('todo bien: sube nivel por nivel hasta B2 (el máximo publicado) y se puede elegir A1', async () => {
  await begin();
  let finished = false;
  const levelUps = new Set<string>();
  while (!finished) {
    finished = await answer(true);
    for (const level of ['A2', 'B1', 'B2']) {
      if (screen.queryByText(`¡Subes al nivel ${level}!`)) levelUps.add(level);
    }
    await next();
  }
  expect([...levelUps]).toEqual(['A2', 'B1', 'B2']);
  // Dos aciertos por banda alcanzan para superarla: 8 bandas, 16 preguntas.
  expect(screen.getByLabelText('Tu nivel estimado es B2, Intermedio alto')).toBeTruthy();
  expect(screen.getByText(/el nivel más alto disponible/)).toBeTruthy();
  expect(screen.getByText('16 de 16 respuestas correctas')).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: 'Prefiero empezar desde A1' }));
  expect(mockMutate.mock.calls[0][0]).toMatchObject({
    startLevel: 'A1',
    placement: { level: 'B2', correct: 16, total: 16 },
  });
});

it('si el curso publica sólo A1–A2, el test termina en A2 aunque el banco traiga más', async () => {
  await withLanguage('en', { levels: ['A1', 'A2'] }, async () => {
    bank = placementBankFor(courseByCode('en-from-es')!)!;
    expect(bank.bands.map((b) => b.level)).toEqual(['A1', 'A1', 'A2', 'A2']);
    await render(<PlacementScreen />);
    expect(screen.getByText('Hasta 12 preguntas · unos 3 minutos')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Empezar el desafío' }));
    let finished = false;
    while (!finished) {
      finished = await answer(true);
      expect(screen.queryByText('¡Subes al nivel B1!')).toBeNull();
      await next();
    }
    expect(screen.getByLabelText('Tu nivel estimado es A2, Básico')).toBeTruthy();
    expect(screen.getByText(/el nivel más alto disponible/)).toBeTruthy();
    expect(screen.getByText('8 de 8 respuestas correctas')).toBeTruthy();
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
  expect(screen.getByText(/tus respuestas siguen aquí/)).toBeTruthy();
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
  expect(screen.getByText('¿Cuánto sabes?')).toBeTruthy();
  expect(mockMutate).not.toHaveBeenCalled();
});

it('un curso sin test (un solo nivel) no muestra preguntas', async () => {
  mockCode = 'it-from-es';
  await withLanguage('it', { levels: ['A1'] }, async () => {
    await render(<PlacementScreen />);
    expect(screen.getByText('Este curso no tiene test de nivel')).toBeTruthy();
  });
});

it('en inglés: instrucciones y resultado en el idioma de la interfaz; las preguntas, del curso', async () => {
  __setInterfaceLanguageForTests('en');
  await render(<PlacementScreen />);
  expect(screen.getByText('How much do you know?')).toBeTruthy();
  expect(screen.getByText('Up to 24 questions · about 6 minutes')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Start the challenge' }));
  expect(screen.getByLabelText('Question 1, up to 24')).toBeTruthy();
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
