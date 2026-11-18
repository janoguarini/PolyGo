import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { Exercise, ExercisePayload } from '@shared/exercises';

import { COMPREHENSION_PATH } from '../../../../content/comprehension';
import { pathExerciseId } from '../../../../content/path';
import { STIMULUS_VISUAL_SPECS, withVisual } from '../../../../content/stimulus-visuals';
import type { ExerciseDef } from '../../../../content/types';
import { resetStimulusAutoplay } from '../components/ContextStimulus';
import { SessionPlayer } from '../components/SessionPlayer';
import type { PlayerState } from '../player';
import { payloadSchema } from '../schema';

/**
 * Fase C.9.1: imágenes de apoyo en ContextStimulus. Se muestran en su momento (antes o después de
 * responder), con descripción accesible y proporción propia, salen del paquete de la app (sin red) y,
 * si faltan, el estímulo se ve como siempre.
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

/** Registro de imágenes empaquetadas de la prueba: `source` numérico, como un `require` de Metro. */
const mockRegistry: Record<string, { source: number; sha256: string }> = {};
jest.mock('../stimulusImages', () => {
  const actual = jest.requireActual('../stimulusImages');
  return {
    ...actual,
    STIMULUS_IMAGES: mockRegistry,
    stimulusImageSource: (v: { id: string; sha256: string }) =>
      actual.stimulusImageSource(v, mockRegistry),
  };
});

const SHA = 'c'.repeat(64);
const ready = STIMULUS_VISUAL_SPECS.map((s) => ({ ...s, sha256: SHA }));
const specOf = (id: string) => STIMULUS_VISUAL_SPECS.find((s) => s.visual.id === id)!.visual;

function bundleAll() {
  STIMULUS_VISUAL_SPECS.forEach((s, i) => {
    mockRegistry[s.visual.id] = { source: 100 + i, sha256: SHA };
  });
}

type ContextPayload = Extract<ExercisePayload, { type: 'context_choice' }>;

/** Las preguntas de una unidad como las recibe la app: con la imagen lista y pasadas por el esquema. */
function lessonOf(unit: number, withImages = true): Exercise[] {
  const lesson = COMPREHENSION_PATH.find((p) => p.unit.position === unit)!.lessons[0]!;
  return lesson.exercises.map((def: ExerciseDef, i) => {
    const p = def.payload as ContextPayload;
    const payload = withImages ? { ...p, stimulus: withVisual(p.stimulus, ready) } : p;
    return {
      id: pathExerciseId(lesson.id, i),
      lessonId: lesson.id,
      position: i + 1,
      type: def.type,
      skill: def.skill,
      prompt: def.prompt,
      payload: payloadSchema.parse(JSON.parse(JSON.stringify(payload))),
      answer: def.answer,
      acceptedAnswers: [],
      explanation: def.explanation ?? null,
      difficulty: 2,
      recommendedSeconds: 60,
      wordIds: [],
    };
  });
}
const stimulusOf = (e: Exercise) => (e.payload as ContextPayload).stimulus;
const ofStimulus = (unit: number, id: string, withImages = true) =>
  lessonOf(unit, withImages).filter((e) => stimulusOf(e).id === id);

async function setup(exercises: Exercise[]) {
  const onFinished = jest.fn<void, [PlayerState]>();
  await render(
    <SessionPlayer
      exercises={exercises}
      words={{}}
      seed="s"
      onClose={jest.fn()}
      onFinished={onFinished}
    />,
  );
  return onFinished;
}
const choose = (text: string) => fireEvent.press(screen.getByRole('radio', { name: text }));
const check = () => fireEvent.press(screen.getByRole('button', { name: 'Comprobar' }));
const next = async () => fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
const imageOf = (id: string) => screen.queryByTestId(`stimulus-image-${id}`);
const styleOf = (el: { props: Record<string, unknown> }) =>
  Object.assign({}, ...[el.props.style].flat(Infinity).filter(Boolean)) as Record<string, unknown>;

const fetchSpy = jest.fn(() => {
  throw new Error('sin conexión');
});

beforeEach(() => {
  for (const k of Object.keys(mockRegistry)) delete mockRegistry[k];
  resetStimulusAutoplay();
  fetchSpy.mockClear();
  globalThis.fetch = fetchSpy as unknown as typeof fetch;
});

describe('imagen junto al estímulo (antes de responder)', () => {
  it('U2: la foto de la ficha, accesible, con su proporción, antes de responder', async () => {
    bundleAll();
    const [first] = ofStimulus(2, 'en.stim.a1-u02-class-card');
    await setup([first!]);
    const v = specOf('en.img.a1-u02-class-card');
    const img = imageOf(v.id)!;
    expect(img).toBeTruthy();
    expect(img.props.accessibilityRole).toBe('image');
    expect(img.props.accessible).toBe(true);
    expect(screen.getByLabelText(v.alt)).toBe(img);
    expect(styleOf(img)).toMatchObject({ width: '100%', aspectRatio: 4 / 3 });
    expect(img.props.resizeMode).toBe('contain');
    // El texto sigue entero: la imagen acompaña, no reemplaza.
    for (const line of (stimulusOf(first!) as { lines: string[] }).lines)
      expect(screen.getByText(line)).toBeTruthy();
  });

  it('U4 y U5: la foto acompaña al audio (escucha) desde el principio', async () => {
    bundleAll();
    for (const [unit, stim, img, ratio] of [
      [4, 'en.stim.a1-u04-family-photo', 'en.img.a1-u04-family-photo', 1.5],
      [5, 'en.stim.a1-u05-whose-cup', 'en.img.a1-u05-meeting-table', 4 / 3],
    ] as const) {
      const [first] = ofStimulus(unit, stim);
      const view = await render(
        <SessionPlayer
          exercises={[first!]}
          words={{}}
          seed="s"
          onClose={jest.fn()}
          onFinished={jest.fn()}
        />,
      );
      expect(styleOf(imageOf(img)!)).toMatchObject({ aspectRatio: ratio });
      expect(screen.getByText('CONVERSACIÓN')).toBeTruthy();
      await view.unmount();
      resetStimulusAutoplay();
    }
  });
});

describe('imagen después de responder (plano y mapa)', () => {
  it('U6: el plano no aparece antes de responder; después, con su encabezado', async () => {
    bundleAll();
    const v = specOf('en.img.a1-u06-apartment-plan');
    for (const stim of ['en.stim.a1-u06-rental-ad', 'en.stim.a1-u06-house-tour']) {
      const [first] = ofStimulus(6, stim);
      const view = await render(
        <SessionPlayer
          exercises={[first!]}
          words={{}}
          seed="s"
          onClose={jest.fn()}
          onFinished={jest.fn()}
        />,
      );
      expect(imageOf(v.id)).toBeNull();
      expect(screen.queryByText('PLANO')).toBeNull();
      await choose(first!.answer);
      await check();
      expect(await screen.findByText('PLANO')).toBeTruthy();
      expect(screen.getByLabelText(v.alt)).toBe(imageOf(v.id));
      await view.unmount();
      resetStimulusAutoplay();
    }
  });

  it('U10: el mapa del recorrido, vertical 4:5, recién después de responder (también si se equivoca)', async () => {
    bundleAll();
    const [first] = ofStimulus(10, 'en.stim.a1-u10-way-to-the-museum');
    await setup([first!]);
    const v = specOf('en.img.a1-u10-way-to-the-museum');
    expect(imageOf(v.id)).toBeNull();
    const wrong = (first!.payload as ContextPayload).options.find((o) => o !== first!.answer)!;
    await choose(wrong);
    await check();
    expect(await screen.findByText('MAPA')).toBeTruthy();
    expect(styleOf(imageOf(v.id)!)).toMatchObject({ aspectRatio: 0.8 });
  });
});

describe('fallback', () => {
  it('sin el recurso en la app: ni imagen ni encabezado; el estímulo se ve como siempre', async () => {
    const [first] = ofStimulus(6, 'en.stim.a1-u06-house-tour');
    await setup([first!]);
    await choose(first!.answer);
    await check();
    await screen.findByText('¡Correcto!');
    expect(screen.queryByText('PLANO')).toBeNull();
    expect(screen.queryByTestId(/stimulus-image-/)).toBeNull();
    expect(screen.getByText('TRANSCRIPCIÓN')).toBeTruthy();
  });

  it('con otra versión del recurso (otro sha256): no muestra una imagen que no corresponde', async () => {
    mockRegistry['en.img.a1-u02-class-card'] = { source: 7, sha256: 'd'.repeat(64) };
    const [first] = ofStimulus(2, 'en.stim.a1-u02-class-card');
    await setup([first!]);
    expect(imageOf('en.img.a1-u02-class-card')).toBeNull();
    expect(screen.getByText('Sam is a teacher.')).toBeTruthy();
  });

  it('si la imagen no carga, desaparece sin romper la pregunta', async () => {
    bundleAll();
    const [first] = ofStimulus(2, 'en.stim.a1-u02-class-card');
    await setup([first!]);
    await act(async () => fireEvent(imageOf('en.img.a1-u02-class-card')!, 'error'));
    expect(imageOf('en.img.a1-u02-class-card')).toBeNull();
    await choose(first!.answer);
    await check();
    expect(await screen.findByText('¡Correcto!')).toBeTruthy();
  });

  it('estímulos sin ficha (U7) no muestran imágenes aunque el registro tenga otras', async () => {
    bundleAll();
    await setup(lessonOf(7));
    expect(screen.queryByTestId(/stimulus-image-/)).toBeNull();
    expect(screen.getByText('MENÚ')).toBeTruthy();
  });
});

describe('sin conexión', () => {
  it.each([2, 4, 5, 6, 10])(
    'U%i: la lección completa se juega sin red, con imágenes del paquete',
    async (unit) => {
      bundleAll();
      const exercises = lessonOf(unit);
      const onFinished = await setup(exercises);
      const shown = new Set<unknown>();
      for (const e of exercises) {
        await choose(e.answer);
        await check();
        await screen.findByText('¡Correcto!');
        for (const img of screen.queryAllByTestId(/stimulus-image-/)) {
          expect(typeof img.props.source).toBe('number');
          shown.add(img.props.testID);
        }
        await next();
      }
      expect(onFinished).toHaveBeenCalledTimes(1);
      expect(onFinished.mock.calls[0]![0].attempts.every((a) => a.correct)).toBe(true);
      expect(shown.size).toBe(1);
      expect(fetchSpy).not.toHaveBeenCalled();
    },
  );
});
