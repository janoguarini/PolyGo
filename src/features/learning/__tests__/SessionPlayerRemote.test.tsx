import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { Exercise, UserAnswer } from '@shared/exercises';

import { SessionPlayer, type RemoteGrade } from '../components/SessionPlayer';
import type { PlayerState } from '../player';

/**
 * Reproductor con corrector remoto (repasos del servidor): el veredicto sale sólo del servidor, una
 * respuesta a la vez (doble toque), sin red queda pendiente con «Reintentar» y la misma respuesta.
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

/** Como llega un ítem del repaso: sin la respuesta (`answer` vacío hasta que corrige el servidor). */
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

const grade = (correct: boolean, response: UserAnswer, expected = 'hola'): RemoteGrade => ({
  verdict: correct ? { correct: true, typo: false, expected } : { correct: false, expected },
  response,
  responseMs: 800,
  explanation: null,
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

async function setup(exercises: Exercise[], grader: jest.Mock) {
  const onFinished = jest.fn<void, [PlayerState]>();
  await render(
    <SessionPlayer
      exercises={exercises}
      words={{}}
      seed="s"
      shownOptions={Object.fromEntries(exercises.map((e) => [e.id, ['hola', 'chau', 'sí']]))}
      grade={grader}
      onClose={jest.fn()}
      onFinished={onFinished}
    />,
  );
  return onFinished;
}

/**
 * Dos toques antes de que React vuelva a renderizar (el botón todavía está habilitado): el manejador
 * del botón se llama dos veces dentro de un mismo act.
 */
async function doubleTap(name: string) {
  // Como fireEvent: el onPress más cercano subiendo por el árbol de componentes.
  type Fiber = { memoizedProps?: { onPress?: unknown }; return: Fiber | null };
  let fiber = (screen.getByRole('button', { name }) as unknown as { unstable_fiber: Fiber })
    .unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  const press = fiber?.memoizedProps?.onPress as () => void;
  expect(typeof press).toBe('function');
  await act(async () => {
    press();
    press();
  });
}

const choose = (text: string) => fireEvent.press(screen.getByRole('radio', { name: text }));
const check = () => fireEvent.press(screen.getByRole('button', { name: 'Comprobar' }));

describe('SessionPlayer con corrección del servidor', () => {
  it('el veredicto es el del servidor, aunque en el dispositivo no coincida', async () => {
    // Localmente «chau» no coincide con la respuesta (vacía); el servidor dice que es correcta.
    const grader = jest.fn().mockResolvedValue(grade(true, { kind: 'option', value: 'chau' }));
    const onFinished = await setup([exercise('presentation-1')], grader);
    await choose('chau');
    await check();
    await screen.findByRole('button', { name: 'Continuar' });
    expect(grader).toHaveBeenCalledTimes(1);
    expect(grader.mock.calls[0]![1]).toEqual({ kind: 'option', value: 'chau' });
    expect(grader.mock.calls[0]![2]).toMatchObject({ attemptNo: 1 });
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    const state = onFinished.mock.calls[0]![0];
    expect(state.attempts).toEqual([
      expect.objectContaining({ exerciseId: 'presentation-1', correct: true, firstTry: true }),
    ]);
  });

  it('se guarda la respuesta que registró el servidor (duplicada), no la recién enviada', async () => {
    const grader = jest.fn().mockResolvedValue(grade(false, { kind: 'option', value: 'sí' }));
    const onFinished = await setup([exercise('presentation-1')], grader);
    await choose('chau');
    await check();
    await screen.findByRole('button', { name: 'Continuar' });
    expect(onFinished).not.toHaveBeenCalled();
    // Error → repetición (P4) con attempt_no 2; después se acierta.
    grader.mockResolvedValueOnce(grade(true, { kind: 'option', value: 'hola' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await choose('hola');
    await check();
    expect(grader.mock.calls[1]![2]).toMatchObject({ attemptNo: 2 });
    await fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts[0]).toMatchObject({
      response: { kind: 'option', value: 'sí' },
      correct: false,
    });
    expect(attempts[1]).toMatchObject({ firstTry: false, correct: true });
  });

  it('doble toque en Comprobar: una sola corrección en el servidor', async () => {
    const pending = deferred<RemoteGrade>();
    const grader = jest.fn().mockReturnValue(pending.promise);
    await setup([exercise('presentation-1'), exercise('presentation-2')], grader);
    await choose('hola');
    await doubleTap('Comprobar');
    await screen.findByText('Comprobando…');
    expect(grader).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve(grade(true, { kind: 'option', value: 'hola' })));
    await screen.findByRole('button', { name: 'Continuar' });
    expect(grader).toHaveBeenCalledTimes(1);
  });

  it('sin red: queda pendiente; Reintentar (aun con doble toque) reenvía una vez la misma respuesta', async () => {
    const retry = deferred<RemoteGrade>();
    const grader = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to send a request'))
      .mockReturnValueOnce(retry.promise);
    const onFinished = await setup([exercise('presentation-1')], grader);
    await choose('chau');
    await check();
    await screen.findByRole('button', { name: 'Reintentar' });
    expect(screen.getByText('No pudimos comprobar tu respuesta. Revisá tu conexión.')).toBeTruthy();
    // Sin veredicto todavía: nada avanzó.
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    await doubleTap('Reintentar');
    await waitFor(() => expect(grader).toHaveBeenCalledTimes(2));
    expect(grader.mock.calls[1]![1]).toEqual({ kind: 'option', value: 'chau' });
    expect(grader.mock.calls[1]![2]).toMatchObject({ attemptNo: 1 });
    await act(async () => retry.resolve(grade(true, { kind: 'option', value: 'chau' })));
    await fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
    expect(grader).toHaveBeenCalledTimes(2);
    expect(onFinished.mock.calls[0]![0].attempts).toHaveLength(1);
  });

  it('retomar: las presentaciones ya corregidas no se vuelven a mandar', async () => {
    const grader = jest.fn().mockResolvedValue(grade(true, { kind: 'option', value: 'hola' }));
    const onFinished = jest.fn<void, [PlayerState]>();
    await render(
      <SessionPlayer
        exercises={[exercise('presentation-1'), exercise('presentation-2')]}
        words={{}}
        seed="s"
        grade={grader}
        answered={[
          {
            exerciseId: 'presentation-1',
            answer: 'hola',
            correct: true,
            firstTry: true,
            responseMs: 500,
            response: { kind: 'option', value: 'hola' },
          },
        ]}
        onClose={jest.fn()}
        onFinished={onFinished}
      />,
    );
    await choose('hola');
    await check();
    await fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
    expect(grader).toHaveBeenCalledTimes(1);
    expect(grader.mock.calls[0]![0].id).toBe('presentation-2');
    expect(onFinished.mock.calls[0]![0].attempts.map((a) => a.exerciseId)).toEqual([
      'presentation-1',
      'presentation-2',
    ]);
  });
});
