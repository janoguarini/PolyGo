import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { AnswerVerdict } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { SessionPlayer, type InstantGrader, type RemoteGrade } from '../components/SessionPlayer';
import type { PlayerState } from '../player';

/**
 * Corrección instantánea en el reproductor (repasos con clave): el feedback sale al tocar Comprobar,
 * sin «Comprobando…»; la respuesta se registra en segundo plano una vez por intento y la corrección del
 * servidor prevalece. Sin clave, se espera al servidor como antes.
 */

jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('@/features/learning/speech', () => ({ speak: jest.fn(), stopSpeaking: jest.fn() }));

function exercise(id: string): Exercise {
  return {
    id,
    lessonId: null,
    position: 1,
    type: 'translation_choice',
    skill: 'vocabulary',
    prompt: 'Elegí la traducción',
    payload: { type: 'translation_choice', word: 'ciao', options: ['hola', 'chau', 'sí'] },
    answer: '',
    acceptedAnswers: [],
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 20,
    wordIds: [],
  };
}

const verdictFor = (value: string): AnswerVerdict =>
  value === 'hola'
    ? { correct: true, typo: false, expected: 'hola' }
    : { correct: false, expected: 'hola' };

const serverGrade = (correct: boolean, response: UserAnswer): RemoteGrade => ({
  verdict: correct
    ? { correct: true, typo: false, expected: 'hola' }
    : { correct: false, expected: 'hola' },
  response,
  responseMs: 800,
  explanation: 'Ciao = hola.',
});

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Clave para todos los ejercicios salvo los de `withoutKey`. */
function instantGrader(record: jest.Mock, withoutKey: string[] = []): InstantGrader {
  return {
    grade: (e, a) =>
      withoutKey.includes(e.id) || a.kind !== 'option'
        ? null
        : { verdict: verdictFor(a.value), explanation: 'Ciao = hola.' },
    record,
  };
}

async function setup(exercises: Exercise[], instant: InstantGrader, grade: jest.Mock = jest.fn()) {
  const onFinished = jest.fn<void, [PlayerState]>();
  await render(
    <SessionPlayer
      exercises={exercises}
      words={{}}
      seed="s"
      shownOptions={Object.fromEntries(exercises.map((e) => [e.id, ['hola', 'chau', 'sí']]))}
      grade={grade}
      instant={instant}
      onClose={jest.fn()}
      onFinished={onFinished}
    />,
  );
  return onFinished;
}

async function doubleTap(name: string) {
  type Fiber = { memoizedProps?: { onPress?: unknown }; return: Fiber | null };
  let fiber = (screen.getByRole('button', { name }) as unknown as { unstable_fiber: Fiber })
    .unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  const press = fiber?.memoizedProps?.onPress as () => void;
  await act(async () => {
    press();
    press();
  });
}

const choose = (text: string) => fireEvent.press(screen.getByRole('radio', { name: text }));
const check = () => fireEvent.press(screen.getByRole('button', { name: 'Comprobar' }));
const proceed = () => fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

describe('SessionPlayer con corrección instantánea', () => {
  it('el feedback aparece al tocar Comprobar, sin esperar al servidor ni «Comprobando…»', async () => {
    const pending = deferred<RemoteGrade>();
    const record = jest.fn().mockReturnValue(pending.promise);
    const grade = jest.fn();
    await setup(
      [exercise('presentation-1'), exercise('presentation-2')],
      instantGrader(record),
      grade,
    );
    await choose('hola');
    await check();
    // El servidor todavía no respondió: el veredicto ya está en pantalla.
    expect(screen.getByText('¡Correcto!')).toBeTruthy();
    // Al acertar el feedback es breve: la explicación sólo aparece al equivocarse.
    expect(screen.queryByText('Ciao = hola.')).toBeNull();
    expect(screen.queryByText('Comprobando…')).toBeNull();
    expect(grade).not.toHaveBeenCalled();
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0]![1]).toEqual({ kind: 'option', value: 'hola' });
    expect(record.mock.calls[0]![2]).toMatchObject({
      attemptNo: 1,
      verdict: { correct: true },
    });
    // Se puede seguir sin esperar el registro.
    await proceed();
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeTruthy();
    await act(async () => pending.resolve(serverGrade(true, { kind: 'option', value: 'hola' })));
  });

  it('doble toque en Comprobar: un solo intento y un solo registro', async () => {
    const record = jest
      .fn()
      .mockResolvedValue(serverGrade(true, { kind: 'option', value: 'hola' }));
    const onFinished = await setup([exercise('presentation-1')], instantGrader(record));
    await choose('hola');
    await doubleTap('Comprobar');
    expect(record).toHaveBeenCalledTimes(1);
    await proceed();
    expect(onFinished.mock.calls[0]![0].attempts).toHaveLength(1);
  });

  it('el servidor corrige distinto con el feedback en pantalla: prevalece y cambia la cola', async () => {
    const server = deferred<RemoteGrade>();
    const record = jest
      .fn()
      .mockReturnValueOnce(server.promise)
      .mockResolvedValue(serverGrade(true, { kind: 'option', value: 'hola' }));
    const onFinished = await setup([exercise('presentation-1')], instantGrader(record));
    await choose('hola');
    await check();
    expect(screen.getByText('¡Correcto!')).toBeTruthy();
    await act(async () => server.resolve(serverGrade(false, { kind: 'option', value: 'hola' })));
    expect(screen.getByText('Respuesta incorrecta')).toBeTruthy();
    // Con el veredicto del servidor, el error se repite (P4) como intento 2.
    await proceed();
    expect(onFinished).not.toHaveBeenCalled();
    await choose('hola');
    await check();
    expect(record.mock.calls[1]![2]).toMatchObject({ attemptNo: 2 });
    await proceed();
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts.map((a) => [a.correct, a.firstTry])).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  it('error que el servidor da por bueno después de seguir: no se vuelve a preguntar', async () => {
    const server = deferred<RemoteGrade>();
    const record = jest
      .fn()
      .mockReturnValueOnce(server.promise)
      .mockResolvedValue(serverGrade(true, { kind: 'option', value: 'hola' }));
    const onFinished = await setup(
      [exercise('presentation-1'), exercise('presentation-2')],
      instantGrader(record),
    );
    await choose('chau');
    await check();
    expect(screen.getByText('Respuesta incorrecta')).toBeTruthy();
    await proceed();
    await act(async () => server.resolve(serverGrade(true, { kind: 'option', value: 'chau' })));
    await choose('hola');
    await check();
    await proceed();
    // presentation-1 no vuelve: la sesión termina con dos intentos, los dos correctos.
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts.map((a) => [a.exerciseId, a.correct])).toEqual([
      ['presentation-1', true],
      ['presentation-2', true],
    ]);
  });

  it('un registro rechazado no rompe la sesión: queda el veredicto de la app', async () => {
    const record = jest.fn().mockRejectedValue(new Error('presentation_not_found'));
    const onFinished = await setup([exercise('presentation-1')], instantGrader(record));
    await choose('hola');
    await check();
    await act(async () => {});
    expect(screen.getByText('¡Correcto!')).toBeTruthy();
    await proceed();
    expect(onFinished.mock.calls[0]![0].attempts[0]).toMatchObject({ correct: true });
  });

  it('servidor anterior (sin clave): «Comprobando…» y el veredicto del servidor, como antes', async () => {
    const pending = deferred<RemoteGrade>();
    const record = jest.fn();
    const grade = jest.fn().mockReturnValue(pending.promise);
    await setup([exercise('presentation-1')], instantGrader(record, ['presentation-1']), grade);
    await choose('chau');
    await check();
    expect(await screen.findByText('Comprobando…')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    expect(record).not.toHaveBeenCalled();
    await act(async () => pending.resolve(serverGrade(true, { kind: 'option', value: 'chau' })));
    expect(await screen.findByText('¡Correcto!')).toBeTruthy();
  });
});
