import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { Exercise } from '@shared/exercises';

import { SessionPlayer } from '../components/SessionPlayer';
import { pickSpeakingExercises } from '../speaking';
import {
  PAUSE_MINUTES,
  __resetSpeakingPause,
  pauseSpeaking,
  speakingPaused,
} from '../speakingPause';
import { bestTranscript } from '../speechRecognition';

/**
 * «Dilo en voz alta»: qué ejercicios se hablan, cómo se elige la transcripción, la pausa de 15 minutos
 * («Ahora no puedo hablar») y el reproductor mostrando el micrófono sólo cuando corresponde.
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
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
}));
let mockAvailable = true;
const mockModule = {
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  abort: jest.fn(),
  stop: jest.fn(),
  start: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
};
jest.mock('../speechRecognition', () => ({
  ...jest.requireActual('../speechRecognition'),
  speechModule: () => (mockAvailable ? mockModule : null),
  speechRecognitionAvailable: () => mockAvailable,
}));

function translate(id: string, answer: string): Exercise {
  return {
    id,
    lessonId: 'l1',
    position: 1,
    type: 'translate_write',
    skill: 'translation',
    prompt: 'Traduce al inglés',
    payload: { type: 'translate_write', source: 'Quiero un café' },
    answer,
    acceptedAnswers: [],
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 30,
    wordIds: [],
  };
}

function choice(id: string): Exercise {
  return {
    ...translate(id, 'hola'),
    type: 'translation_choice',
    payload: { type: 'translation_choice', word: 'hello', options: ['hola', 'chau'] },
  };
}

describe('pickSpeakingExercises', () => {
  it('elige hasta 2 ejercicios de traducir de 2 a 8 palabras, siempre los mismos por sesión', () => {
    const list = [
      translate('a', 'I want a coffee'),
      translate('b', 'Hello'),
      translate('c', 'one two three four five six seven eight nine'),
      translate('d', 'She is my sister'),
      translate('e', 'We live here'),
      choice('f'),
    ];
    const picked = pickSpeakingExercises(list, 'session-1');
    expect(picked.size).toBe(2);
    for (const id of picked) expect(['a', 'd', 'e']).toContain(id);
    expect([...pickSpeakingExercises(list, 'session-1')]).toEqual([...picked]);
    expect(pickSpeakingExercises([choice('x')], 's').size).toBe(0);
  });
});

describe('bestTranscript', () => {
  it('se queda con la alternativa más parecida a una respuesta válida', () => {
    expect(bestTranscript(['I want a copy', 'I want a coffee'], ['I want a coffee'])).toBe(
      'I want a coffee',
    );
    expect(bestTranscript(['hello there'], ['I want a coffee'])).toBe('hello there');
  });
});

describe('pausa de hablar', () => {
  beforeEach(() => __resetSpeakingPause());

  it(`dura ${PAUSE_MINUTES} minutos`, () => {
    const now = Date.now();
    pauseSpeaking(now);
    expect(speakingPaused(now + 14 * 60_000)).toBe(true);
    expect(speakingPaused(now + 15 * 60_000 + 1)).toBe(false);
  });
});

describe('SessionPlayer con ejercicios de hablar', () => {
  beforeEach(() => {
    __resetSpeakingPause();
    mockAvailable = true;
  });

  const exercises = [translate('a', 'I want a coffee')];

  it('muestra el micrófono y «Dilo en …» sólo en los ejercicios elegidos', async () => {
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        speakingIds={new Set(['a'])}
        onClose={jest.fn()}
        onFinished={jest.fn()}
      />,
    );
    expect(screen.getByText(/^Dilo en /)).toBeTruthy();
    expect(screen.getByLabelText('Hablar')).toBeTruthy();
  });

  it('sin speakingIds (nivelación) se responde escrito', async () => {
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        onClose={jest.fn()}
        onFinished={jest.fn()}
      />,
    );
    expect(screen.queryByLabelText('Hablar')).toBeNull();
    expect(screen.getByText('Traduce al inglés')).toBeTruthy();
  });

  it('«Usar el teclado» pasa ese ejercicio a escrito', async () => {
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        speakingIds={new Set(['a'])}
        onClose={jest.fn()}
        onFinished={jest.fn()}
      />,
    );
    await fireEvent.press(screen.getByText('Usar el teclado'));
    expect(screen.queryByLabelText('Hablar')).toBeNull();
  });

  it('«Ahora no puedo hablar» pausa los ejercicios de hablar', async () => {
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        speakingIds={new Set(['a'])}
        onClose={jest.fn()}
        onFinished={jest.fn()}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByText('Ahora no puedo hablar'));
    });
    expect(speakingPaused()).toBe(true);
    expect(screen.queryByLabelText('Hablar')).toBeNull();
  });

  it('al decir bien la frase se comprueba sola y se marca como hablada', async () => {
    const onFinished = jest.fn();
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        speakingIds={new Set(['a'])}
        maxRetries={0}
        onClose={jest.fn()}
        onFinished={onFinished}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Hablar'));
    });
    expect(mockModule.start).toHaveBeenCalledWith(expect.objectContaining({ lang: 'en-US' }));
    const listeners = mockModule.addListener.mock.calls as unknown as [
      string,
      (e: unknown) => void,
    ][];
    const onResult = listeners.filter(([name]) => name === 'result').at(-1)![1];
    await act(async () => {
      onResult({
        isFinal: true,
        results: [{ transcript: 'I want a copy' }, { transcript: 'I want a coffee' }],
      });
    });
    expect(screen.queryByLabelText('Hablar')).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByText(/^Continuar$/));
    });
    const attempt = onFinished.mock.calls[0][0].attempts[0];
    expect(attempt).toMatchObject({ correct: true, answer: 'I want a coffee' });
    expect(attempt.assists).toMatchObject({ spoken: true, speech_attempts: 1 });
  });

  it('en un teléfono sin reconocimiento de voz se responde escrito', async () => {
    mockAvailable = false;
    await render(
      <SessionPlayer
        exercises={exercises}
        words={{}}
        seed="s"
        speakingIds={new Set(['a'])}
        onClose={jest.fn()}
        onFinished={jest.fn()}
      />,
    );
    expect(screen.queryByLabelText('Hablar')).toBeNull();
  });
});
