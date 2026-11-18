import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { Exercise, UserAnswer } from '@shared/exercises';

import { COMPREHENSION_PATH } from '../../../../content/comprehension';
import { pathExerciseId } from '../../../../content/path';
import type { ExerciseDef } from '../../../../content/types';
import { resetStimulusAutoplay } from '../components/ContextStimulus';
import { SessionPlayer, type RemoteGrade } from '../components/SessionPlayer';
import type { PlayerState } from '../player';
import { parseExercise } from '../schema';
import { speakDialogue } from '../speech';

/**
 * Lecciones «En contexto» (fase C) en el reproductor de siempre: estímulo separado de la pregunta,
 * audio con dos voces que se puede repetir, transcripción recién después de responder, feedback con
 * la evidencia del texto, errores, reanudación y fin de sesión.
 */

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
}));

const dialogue = speakDialogue as jest.Mock;

const lesson = COMPREHENSION_PATH.find((p) => p.unit.position === 7)!.lessons[0]!;
function toExercise(def: ExerciseDef, i: number): Exercise {
  return {
    id: pathExerciseId(lesson.id, i),
    lessonId: lesson.id,
    position: i + 1,
    type: def.type,
    skill: def.skill,
    prompt: def.prompt,
    payload: def.payload,
    answer: def.answer,
    acceptedAnswers: [],
    explanation: def.explanation ?? null,
    difficulty: 2,
    recommendedSeconds: 60,
    wordIds: [],
  };
}
const all = lesson.exercises.map(toExercise);
const kindOf = (e: Exercise) =>
  e.payload.type === 'context_choice' ? e.payload.stimulus.kind : null;
const reading = all.filter((e) => kindOf(e) === 'reading');
const listening = all.filter((e) => kindOf(e) === 'listening');
const payload = (e: Exercise) => {
  if (e.payload.type !== 'context_choice') throw new Error('no es context_choice');
  return e.payload;
};

async function setup(
  exercises: Exercise[],
  extra: Partial<Parameters<typeof SessionPlayer>[0]> = {},
) {
  const onFinished = jest.fn<void, [PlayerState]>();
  await render(
    <SessionPlayer
      exercises={exercises}
      words={{}}
      seed="s"
      onClose={jest.fn()}
      onFinished={onFinished}
      {...extra}
    />,
  );
  return onFinished;
}

const choose = (text: string) => fireEvent.press(screen.getByRole('radio', { name: text }));
const check = () => fireEvent.press(screen.getByRole('button', { name: 'Comprobar' }));
const next = async () =>
  fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wrongOf = (e: Exercise) => payload(e).options.find((o) => o !== e.answer)!;

beforeEach(() => {
  dialogue.mockClear();
  dialogue.mockImplementation(() => jest.fn());
  resetStimulusAutoplay();
});

describe('lectura en contexto', () => {
  it('muestra la situación, el documento y la pregunta por separado; feedback con evidencia', async () => {
    const [first] = reading;
    const p = payload(first!);
    if (p.stimulus.kind !== 'reading') throw new Error('lectura');
    const onFinished = await setup([first!]);
    expect(screen.getByText(p.stimulus.setting)).toBeTruthy();
    expect(screen.getByText('MENÚ')).toBeTruthy();
    for (const line of p.stimulus.lines) expect(screen.getByText(line)).toBeTruthy();
    expect(screen.getByText('PREGUNTA')).toBeTruthy();
    expect(screen.getByText(p.question)).toBeTruthy();
    // Un texto no suena solo.
    expect(dialogue).not.toHaveBeenCalled();
    await choose(first!.answer);
    await check();
    expect(await screen.findByText('¡Correcto!')).toBeTruthy();
    expect(screen.getByText(first!.explanation!)).toBeTruthy();
    await next();
    expect(onFinished).toHaveBeenCalledTimes(1);
    expect(onFinished.mock.calls[0]![0].attempts[0]).toMatchObject({ correct: true, firstTry: true });
  });

  it('una respuesta equivocada vuelve al final y el reintento no cuenta como primer intento', async () => {
    const [a, b] = reading;
    const onFinished = await setup([a!, b!]);
    await choose(wrongOf(a!));
    await check();
    expect(await screen.findByText('Respuesta incorrecta')).toBeTruthy();
    await next();
    await choose(b!.answer);
    await check();
    await next();
    await choose(a!.answer);
    await check();
    await next();
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts.map((x) => [x.exerciseId, x.correct, x.firstTry])).toEqual([
      [a!.id, false, true],
      [b!.id, true, true],
      [a!.id, true, false],
    ]);
  });
});

describe('escucha en contexto', () => {
  it('suena sola una vez por estímulo, con dos voces y la velocidad A1; sin transcripción antes', async () => {
    const [first, second] = listening;
    const p = payload(first!);
    if (p.stimulus.kind !== 'listening') throw new Error('escucha');
    // El motor termina de decir el mensaje enseguida.
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onDone?.();
      return jest.fn();
    });
    await setup([first!, second!]);
    expect(dialogue).toHaveBeenCalledTimes(1);
    const [lines, rate, handlers] = dialogue.mock.calls[0]!;
    expect(rate).toBe(p.stimulus.rate);
    expect(handlers.slow).toBe(false);
    expect(new Set(lines.map((l: { voice: string }) => l.voice))).toEqual(new Set(['a', 'b']));
    expect(lines.map((l: { text: string }) => l.text)).toEqual(p.stimulus.lines.map((l) => l.text));
    // La transcripción no se muestra antes de responder.
    expect(screen.queryByText('TRANSCRIPCIÓN')).toBeNull();
    for (const l of p.stimulus.lines)
      expect(screen.queryByText(new RegExp(escape(l.text)))).toBeNull();
    expect(screen.getByText(/voz sintetizada/)).toBeTruthy();

    // Repetir y repetir despacio.
    await fireEvent.press(screen.getByRole('button', { name: 'Escuchar el audio (voz sintetizada)' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Escuchar más despacio (voz sintetizada)' }));
    expect(dialogue).toHaveBeenCalledTimes(3);
    expect(dialogue.mock.calls[2]![2].slow).toBe(true);

    // Después de responder: transcripción para revisar.
    await choose(first!.answer);
    await check();
    expect(await screen.findByText('TRANSCRIPCIÓN')).toBeTruthy();
    for (const l of p.stimulus.lines)
      expect(screen.getByText(new RegExp(`${escape(l.speaker)}:\\s+${escape(l.text)}`))).toBeTruthy();

    // La segunda pregunta del mismo audio no lo vuelve a reproducir sola.
    await next();
    expect(screen.getByText(payload(second!).question)).toBeTruthy();
    expect(dialogue).toHaveBeenCalledTimes(3);
    expect(screen.queryByText('TRANSCRIPCIÓN')).toBeNull();
  });

  it('muestra el progreso mientras suena y se puede detener', async () => {
    const stop = jest.fn();
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onLine?.(1);
      return stop;
    });
    await setup([listening[0]!]);
    expect(screen.getByText(/Reproduciendo… 2 de/)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Detener el audio' }));
    expect(stop).toHaveBeenCalled();
    expect(screen.getByText('Podés volver a escucharlo las veces que quieras.')).toBeTruthy();
  });

  it('si el audio falla, lo dice y se puede reintentar', async () => {
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onError?.(new Error('tts'));
      return jest.fn();
    });
    await setup([listening[0]!]);
    expect(screen.getByText(/No se pudo reproducir el audio/)).toBeTruthy();
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onDone?.();
      return jest.fn();
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Escuchar el audio (voz sintetizada)' }));
    expect(screen.queryByText(/No se pudo reproducir el audio/)).toBeNull();
  });

  it('con una sola voz no promete dos: avisa que sólo cambia el tono', async () => {
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onVoices?.({ available: true, distinct: false });
      return jest.fn();
    });
    await setup([listening[0]!]);
    expect(screen.getByText(/una sola voz en inglés.*sólo con\s+otro tono/s)).toBeTruthy();
  });

  it('con dos voces distintas no muestra el aviso; sin voz en inglés, avisa', async () => {
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onVoices?.({ available: true, distinct: true });
      return jest.fn();
    });
    await setup([listening[0]!]);
    expect(screen.queryByText(/una sola voz en inglés/)).toBeNull();
    expect(screen.queryByText(/no tiene una voz en inglés/)).toBeNull();
  });

  it('sin voz en inglés instalada, lo dice', async () => {
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onVoices?.({ available: false, distinct: false });
      return jest.fn();
    });
    await setup([listening[0]!]);
    expect(screen.getByText(/no tiene una voz en inglés instalada/)).toBeTruthy();
  });
});

describe('sesión de una lección «En contexto»', () => {
  it('se completa de punta a punta: seis preguntas, lectura y escucha', async () => {
    const onFinished = await setup(all);
    for (const e of all) {
      expect(screen.getByText(payload(e).question)).toBeTruthy();
      await choose(e.answer);
      await check();
      await next();
    }
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts).toHaveLength(all.length);
    expect(attempts.every((a) => a.correct && a.firstTry)).toBe(true);
  });

  it('reanudación: lo ya respondido no se vuelve a preguntar', async () => {
    const [a, b] = reading;
    const onFinished = await setup([a!, b!], {
      answered: [
        {
          exerciseId: a!.id,
          answer: a!.answer,
          correct: true,
          firstTry: true,
          responseMs: 900,
          response: { kind: 'option', value: a!.answer },
        },
      ],
    });
    expect(screen.queryByText(payload(a!).question)).toBeNull();
    expect(screen.getByText(payload(b!).question)).toBeTruthy();
    await choose(b!.answer);
    await check();
    await next();
    expect(onFinished.mock.calls[0]![0].attempts.map((x) => x.exerciseId)).toEqual([a!.id, b!.id]);
  });

  it('sin conexión con el corrector del servidor: queda pendiente y Reintentar manda la misma respuesta', async () => {
    const [a] = reading;
    const grader = jest
      .fn<Promise<RemoteGrade>, [Exercise, UserAnswer, unknown]>()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        verdict: { correct: true, typo: false, expected: a!.answer },
        response: { kind: 'option', value: a!.answer },
        responseMs: 800,
        explanation: a!.explanation,
      });
    await setup([a!], { grade: grader as never });
    await choose(a!.answer);
    await check();
    expect(await screen.findByText(/No pudimos comprobar tu respuesta/)).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));
    });
    expect(await screen.findByText('¡Correcto!')).toBeTruthy();
    expect(grader).toHaveBeenCalledTimes(2);
    expect(grader.mock.calls[1]![1]).toEqual(grader.mock.calls[0]![1]);
  });
});

describe('payload desde la base', () => {
  const row = (payloadValue: unknown) => ({
    id: 'a1-u07-context-e01',
    lesson_id: 'a1-u07-context',
    position: 1,
    type: 'context_choice',
    skill: 'reading',
    prompt_es: 'Leé el texto y respondé.',
    payload: payloadValue,
    answer: 'x',
    accepted_answers: [],
    explanation_es: null,
    difficulty: 2,
    recommended_seconds: 60,
  });

  it('valida el estímulo y la pregunta', () => {
    const e = parseExercise(row(all[0]!.payload), []);
    expect(e.payload).toEqual(all[0]!.payload);
    expect(e.skill).toBe('reading');
  });

  it('rechaza estímulos incompletos o un audio acelerado', () => {
    const p = payload(all[0]!);
    expect(() => parseExercise(row({ ...p, stimulus: { ...p.stimulus, lines: [] } }), [])).toThrow();
    expect(() => parseExercise(row({ ...p, question: '' }), [])).toThrow();
    const l = payload(listening[0]!);
    expect(() => parseExercise(row({ ...l, stimulus: { ...l.stimulus, rate: 1.5 } }), [])).toThrow();
  });
});

describe('fase C.2: U13 (registro en un hotel) y U14 (cliente y vendedor)', () => {
  const lessonOf = (unit: number) => COMPREHENSION_PATH.find((p) => p.unit.position === unit)!.lessons[0]!;
  const exercisesOf = (unit: number) => {
    const l = lessonOf(unit);
    return l.exercises.map((def, i) => ({ ...toExercise(def, i), id: pathExerciseId(l.id, i), lessonId: l.id }));
  };
  const u13 = exercisesOf(13);
  const u14 = exercisesOf(14);
  const dbRow = (e: Exercise) => ({
    id: e.id,
    lesson_id: e.lessonId!,
    position: e.position,
    type: e.type,
    skill: e.skill,
    prompt_es: e.prompt,
    payload: e.payload,
    answer: e.answer,
    accepted_answers: [],
    explanation_es: e.explanation,
    difficulty: 2,
    recommended_seconds: 60,
  });

  it('el payload de la base de todas sus preguntas pasa la validación de la app (también «form»)', () => {
    for (const e of [...u13, ...u14]) expect(parseExercise(dbRow(e), []).payload).toEqual(e.payload);
  });

  it('U13: la ficha se muestra como FORMULARIO, con los datos ficticios de la huésped', async () => {
    const [first] = u13;
    const p = payload(first!);
    if (p.stimulus.kind !== 'reading') throw new Error('lectura');
    await setup([first!]);
    expect(screen.getByText('FORMULARIO')).toBeTruthy();
    expect(screen.getByText(p.stimulus.title!)).toBeTruthy();
    for (const line of p.stimulus.lines) expect(screen.getByText(line)).toBeTruthy();
    expect(screen.getByText('Email: sofia.ruiz@example.com')).toBeTruthy();
    expect(dialogue).not.toHaveBeenCalled();
  });

  it('U13: el recepcionista te habla con una sola voz; las opciones en inglés no se pronuncian antes', async () => {
    const listen = u13.filter((e) => kindOf(e) === 'listening');
    const p = payload(listen[0]!);
    if (p.stimulus.kind !== 'listening') throw new Error('escucha');
    await setup(listen);
    expect(dialogue).toHaveBeenCalledTimes(1);
    const [lines, rate] = dialogue.mock.calls[0]!;
    expect(rate).toBe(p.stimulus.rate);
    expect(new Set(lines.map((l: { voice: string }) => l.voice))).toEqual(new Set(['a']));
    expect(lines.map((l: { text: string }) => l.text)).toEqual(p.stimulus.lines.map((l) => l.text));
    // Un monólogo no muestra el aviso de los dos hablantes.
    expect(screen.queryByText(/los dos hablantes/)).toBeNull();
  });

  it('U14: el diálogo cliente–vendedor suena con dos voces y el anuncio con una', async () => {
    dialogue.mockImplementation((_lines, _rate, h) => {
      h.onDone?.();
      return jest.fn();
    });
    const listen = u14.filter((e) => kindOf(e) === 'listening');
    const firstOf = (id: string) => listen.find((e) => payload(e).stimulus.id === id)!;
    await setup([
      firstOf('en.stim.a1-u14-at-the-shop'),
      firstOf('en.stim.a1-u14-supermarket-announcement'),
    ]);
    const voices = () =>
      new Set(dialogue.mock.calls.at(-1)![0].map((l: { voice: string }) => l.voice));
    expect(voices()).toEqual(new Set(['a', 'b']));
    await choose(listen[0]!.answer);
    await check();
    await next();
    expect(dialogue).toHaveBeenCalledTimes(2);
    expect(voices()).toEqual(new Set(['a']));
  });

  it.each([
    ['U13', u13],
    ['U14', u14],
  ])('%s se completa de punta a punta con el reproductor de siempre', async (_unit, exercises) => {
    const onFinished = await setup(exercises);
    for (const e of exercises) {
      expect(screen.getByText(payload(e).question)).toBeTruthy();
      await choose(e.answer);
      await check();
      await next();
    }
    const { attempts } = onFinished.mock.calls[0]![0];
    expect(attempts).toHaveLength(exercises.length);
    expect(attempts.every((a) => a.correct && a.firstTry)).toBe(true);
    // Una sesión completa (hasta 9 preguntas) supera los 5 s por defecto con la suite entera en paralelo.
  }, 30_000);
});
