import { existsSync, readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join } from 'node:path';

import type { ContextStimulus, ExercisePayload } from '@shared/exercises';
import { STIMULUS_VISUAL_LIMITS } from '@shared/exercises';
import { gradingSpecFor } from '@shared/grading';

import { payloadSchema } from '../../src/features/learning/schema';
import { STIMULUS_IMAGES } from '../../src/features/learning/stimulusImages';
import { imageInfo } from '../../scripts/image-info';
import { canonicalHash } from '../canonical-json';
import { COMPREHENSION_PATH } from '../comprehension';
import { comprehensionProblems, stimulusVisualProblems } from '../comprehension-checks';
import {
  STIMULUS_VISUAL_SPECS,
  visualFor,
  visualSpecProblems,
  withVisual,
  type StimulusVisualSpec,
} from '../stimulus-visuals';
import type { ExerciseDef } from '../types';
import { versionHash, type VersionContent } from '../versions';

/**
 * Fase C.9.1: soporte visual de los estímulos de comprensión. Contrato, fichas, versión inmutable y
 * hash, integridad de los archivos empaquetados y regresión de U1–U14 (los recursos todavía no
 * existen: ningún payload cambia).
 */

const ASSETS = join(__dirname, '..', '..', 'assets', 'stimuli');
const SHA_A = 'a'.repeat(64);
const SHA_B = 'b'.repeat(64);

type ContextPayload = Extract<ExercisePayload, { type: 'context_choice' }>;
const exercises = COMPREHENSION_PATH.flatMap((p) =>
  p.lessons[0]!.exercises.map((e) => ({ e, unit: p.unit.position })),
);
const payloadOf = (e: ExerciseDef) => e.payload as ContextPayload;
const stimulusById = new Map<string, ContextStimulus>(
  exercises.map(({ e }) => [payloadOf(e).stimulus.id, payloadOf(e).stimulus]),
);
/** Las fichas como si los recursos definitivos ya existieran. */
const ready = (sha = SHA_A): StimulusVisualSpec[] =>
  STIMULUS_VISUAL_SPECS.map((s) => ({ ...s, sha256: sha }));

const contentOf = (e: ExerciseDef, payload: unknown): VersionContent => ({
  prompt_es: e.prompt,
  payload,
  answer: e.answer,
  accepted_answers: [],
  explanation_es: e.explanation ?? null,
  difficulty: e.difficulty ?? 2,
  recommended_seconds: e.recommendedSeconds ?? 60,
});

describe('fichas de los recursos visuales', () => {
  it('las cinco previstas: U2, U4, U5, U6 y U10, una por unidad', () => {
    expect(
      STIMULUS_VISUAL_SPECS.map((s) => [s.visual.id, s.visual.kind, s.visual.display, s.stimuli]),
    ).toEqual([
      ['en.img.a1-u02-class-card', 'photo', 'with_stimulus', ['en.stim.a1-u02-class-card']],
      ['en.img.a1-u04-family-photo', 'photo', 'with_stimulus', ['en.stim.a1-u04-family-photo']],
      ['en.img.a1-u05-meeting-table', 'photo', 'with_stimulus', ['en.stim.a1-u05-whose-cup']],
      [
        'en.img.a1-u06-apartment-plan',
        'floor_plan',
        'after_answer',
        ['en.stim.a1-u06-rental-ad', 'en.stim.a1-u06-house-tour'],
      ],
      [
        'en.img.a1-u10-way-to-the-museum',
        'map',
        'after_answer',
        ['en.stim.a1-u10-way-to-the-museum'],
      ],
    ]);
  });

  it('son válidas contra los estímulos que existen', () => {
    expect(stimulusVisualProblems()).toEqual([]);
  });

  it('con los recursos listos, el contenido de la fase C sigue siendo válido (descripciones sin la respuesta)', () => {
    const path = COMPREHENSION_PATH.map((p) => ({
      ...p,
      lessons: p.lessons.map((l) => ({
        ...l,
        exercises: l.exercises.map((e) => {
          const pl = payloadOf(e);
          return { ...e, payload: { ...pl, stimulus: withVisual(pl.stimulus, ready()) } };
        }),
      })),
    }));
    expect(comprehensionProblems(path, undefined, ready())).toEqual([]);
  });

  it('detecta una descripción que da la respuesta en una imagen previa a responder', () => {
    const leaky = ready().map((s) =>
      s.visual.id === 'en.img.a1-u02-class-card'
        ? { ...s, visual: { ...s.visual, alt: 'Foto de Sam, que está cansado, en el aula.' } }
        : s,
    );
    const problems = comprehensionProblems(undefined, undefined, leaky);
    expect(problems.some((p) => p.includes('la descripción de la imagen da la respuesta'))).toBe(
      true,
    );
  });

  it('rechaza planos o mapas antes de responder, recursos remotos, estímulos inexistentes y duplicados', () => {
    const kinds = new Map([...stimulusById].map(([id, s]) => [id, s.kind]));
    const base = STIMULUS_VISUAL_SPECS[3]!;
    const problems = visualSpecProblems(
      [
        { ...base, visual: { ...base.visual, display: 'with_stimulus' } },
        { ...base, file: 'https://example.com/x.png', visual: { ...base.visual, id: 'en.img.x' } },
        {
          ...base,
          stimuli: ['en.stim.nope'],
          file: 'en/a1/y.png',
          visual: { ...base.visual, id: 'en.img.y' },
        },
        {
          ...base,
          file: 'en/a1/z.png',
          visual: { ...base.visual, id: 'en.img.z', width: 2000, height: 600 },
        },
      ],
      kinds,
    );
    for (const expected of [
      'un plano o mapa se muestra después de responder',
      'no puede apuntar a recursos remotos',
      'el estímulo en.stim.nope no existe',
      'ya tiene otra imagen',
      'proporción fuera de 3:4–16:9',
    ])
      expect(problems.some((p) => p.includes(expected))).toBe(true);
  });

  it('el plano y el mapa describen exactamente los espacios y el recorrido de sus ejercicios', () => {
    const plan = STIMULUS_VISUAL_SPECS.find((s) => s.visual.kind === 'floor_plan')!.visual.alt;
    for (const piece of [
      'cocina grande',
      'mesa',
      'llaves sobre la mesa',
      'living',
      'sofá',
      'dos dormitorios',
      'baño entre los dos',
      'No hay jardín',
    ])
      expect(plan).toContain(piece);
    const map = STIMULUS_VISUAL_SPECS.find((s) => s.visual.kind === 'map')!.visual.alt;
    // En el orden de las indicaciones escritas.
    const steps = [
      'estación',
      'derecho',
      'supermercado',
      'izquierda',
      'derecho hasta el museo',
      'lado derecho',
      'al lado de la biblioteca',
    ];
    const at = steps.map((s) => map.indexOf(s));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });
});

describe('regresión U1–U14: sin recursos definitivos nada cambia', () => {
  it('ninguna ficha tiene hash todavía y ningún estímulo lleva imagen', () => {
    expect(STIMULUS_VISUAL_SPECS.every((s) => s.sha256 === null)).toBe(true);
    expect(exercises.length).toBe(91);
    expect(exercises.filter(({ e }) => 'visual' in payloadOf(e).stimulus)).toEqual([]);
    expect(Object.keys(STIMULUS_IMAGES)).toEqual([]);
  });

  it('withVisual devuelve el mismo objeto (mismo JSON, mismo hash) si el recurso no está listo', () => {
    for (const s of stimulusById.values()) expect(withVisual(s)).toBe(s);
  });

  it('la imagen no se escribe a mano en un estímulo', () => {
    const s = stimulusById.get('en.stim.a1-u02-class-card')!;
    expect(() => withVisual({ ...s, visual: visualFor(s.id, ready())! })).toThrow(
      /stimulus-visuals/,
    );
  });
});

describe('versión inmutable y hash', () => {
  const tour = exercises.find(
    ({ e }) => payloadOf(e).stimulus.id === 'en.stim.a1-u06-house-tour',
  )!.e;
  const spec = gradingSpecFor('context_choice');
  const withImage = (sha: string) => ({
    ...payloadOf(tour),
    stimulus: withVisual(payloadOf(tour).stimulus, ready(sha)),
  });

  it('la imagen viaja dentro del estímulo y no toca pregunta, opciones ni respuesta', () => {
    const p = withImage(SHA_A);
    expect(p.stimulus.visual).toEqual({ ...STIMULUS_VISUAL_SPECS[3]!.visual, sha256: SHA_A });
    const { visual, ...rest } = p.stimulus;
    expect(visual).toBeDefined();
    expect(rest).toEqual(payloadOf(tour).stimulus);
    expect(p.question).toBe(payloadOf(tour).question);
    expect(p.options).toEqual(payloadOf(tour).options);
  });

  it('el hash cambia con la imagen y con cada byte de la imagen (sha256), y es determinista', () => {
    const none = versionHash(contentOf(tour, payloadOf(tour)), spec);
    const a = versionHash(contentOf(tour, withImage(SHA_A)), spec);
    const b = versionHash(contentOf(tour, withImage(SHA_B)), spec);
    expect(new Set([none, a, b]).size).toBe(3);
    expect(versionHash(contentOf(tour, withImage(SHA_A)), spec)).toBe(a);
    // Cualquier campo de la ficha forma parte de la versión.
    for (const change of [
      { alt: 'Otra descripción del plano, distinta.' },
      { width: 1500 },
      { display: 'with_stimulus' },
    ]) {
      const p = withImage(SHA_A);
      const changed = {
        ...p,
        stimulus: { ...p.stimulus, visual: { ...p.stimulus.visual!, ...change } },
      };
      expect(versionHash(contentOf(tour, changed), spec)).not.toBe(a);
    }
  });

  it('las preguntas del mismo estímulo comparten exactamente la misma imagen', () => {
    const same = exercises
      .filter(({ e }) => payloadOf(e).stimulus.id === 'en.stim.a1-u06-house-tour')
      .map(({ e }) => canonicalHash(withVisual(payloadOf(e).stimulus, ready())));
    expect(same.length).toBe(3);
    expect(new Set(same).size).toBe(1);
  });
});

describe('esquema del payload', () => {
  const s = stimulusById.get('en.stim.a1-u04-family-photo')!;
  const payload = (stimulus: unknown) => ({
    type: 'context_choice',
    stimulus,
    question: '¿Quién?',
    options: ['a', 'b', 'c'],
  });
  const visual = visualFor(s.id, ready())!;

  it('acepta el estímulo sin imagen, igual que antes', () => {
    const parsed = payloadSchema.parse(payload(s)) as ContextPayload;
    expect(parsed.stimulus).toEqual(s);
    expect('visual' in parsed.stimulus).toBe(false);
  });

  it('acepta el estímulo con imagen y la conserva entera', () => {
    const parsed = payloadSchema.parse(payload({ ...s, visual })) as ContextPayload;
    expect(parsed.stimulus.visual).toEqual(visual);
  });

  it('una imagen mal formada se descarta y el ejercicio sigue siendo válido (fallback al texto)', () => {
    for (const bad of [
      { ...visual, sha256: 'xyz' },
      { ...visual, alt: '' },
      { ...visual, alt: 'Foto.' },
      { ...visual, width: 3000, height: 600 },
      { ...visual, width: 100 },
      { ...visual, id: 'https://example.com/a.jpg' },
      { ...visual, kind: 'video' },
      { ...visual, display: 'sometimes' },
      'en.img.a1-u04-family-photo',
    ]) {
      const parsed = payloadSchema.parse(payload({ ...s, visual: bad })) as ContextPayload;
      expect(parsed.stimulus.visual).toBeUndefined();
      expect(parsed.stimulus.lines).toEqual(s.lines);
    }
  });

  it('los campos desconocidos de la imagen (p. ej. una URL) no llegan a la app', () => {
    const parsed = payloadSchema.parse(
      payload({ ...s, visual: { ...visual, uri: 'https://x/y.jpg' } }),
    ) as ContextPayload;
    expect(parsed.stimulus.visual).toEqual(visual);
  });
});

/** PNG mínimo válido (IHDR + IDAT + IEND) para probar la lectura de cabeceras. */
function tinyPng(width: number, height: number) {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    return Buffer.concat([len, Buffer.from(type), data, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.alloc((width + 1) * height))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** JPEG mínimo: SOI, APP0 y SOF0 con el tamaño. */
function tinyJpegHeader(width: number, height: number) {
  const app0 = Buffer.from([0xff, 0xe0, 0x00, 0x04, 0x00, 0x00]);
  const sof = Buffer.from([
    0xff,
    0xc0,
    0x00,
    0x0b,
    0x08,
    height >> 8,
    height & 255,
    width >> 8,
    width & 255,
    0x01,
    0x01,
    0x11,
    0x00,
  ]);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, sof, Buffer.from([0xff, 0xd9])]);
}

describe('integridad de los recursos empaquetados', () => {
  it('lee formato, tamaño y sha256 de PNG y JPEG; rechaza otros formatos', () => {
    const png = imageInfo(tinyPng(1600, 1200));
    expect(png).toMatchObject({ format: 'png', width: 1600, height: 1200 });
    expect(png.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(imageInfo(tinyJpegHeader(1800, 1200))).toMatchObject({
      format: 'jpeg',
      width: 1800,
      height: 1200,
    });
    expect(() => imageInfo(Buffer.from('RIFF0000WEBPVP8 '))).toThrow(/PNG o JPEG/);
  });

  // Vacía mientras no haya recursos definitivos; con cada uno que se integre verifica todo esto.
  it('cada ficha lista: archivo local, hash, tamaño, formato, peso y registro de la app', () => {
    for (const s of STIMULUS_VISUAL_SPECS.filter((x) => x.sha256)) {
      const path = join(ASSETS, s.file);
      expect(existsSync(path)).toBe(true);
      const info = imageInfo(readFileSync(path));
      expect(info.sha256).toBe(s.sha256);
      expect([info.width, info.height]).toEqual([s.visual.width, s.visual.height]);
      expect(info.format).toBe(s.visual.kind === 'photo' ? 'jpeg' : 'png');
      expect(info.bytes).toBeLessThanOrEqual(STIMULUS_VISUAL_LIMITS.maxBytes);
      expect(STIMULUS_IMAGES[s.visual.id]?.sha256).toBe(s.sha256);
    }
  });

  it('el registro de la app sólo tiene imágenes con ficha lista y el mismo hash', () => {
    for (const [id, entry] of Object.entries(STIMULUS_IMAGES)) {
      const s = STIMULUS_VISUAL_SPECS.find((x) => x.visual.id === id);
      expect(s?.sha256).toBe(entry.sha256);
    }
  });

  it('ninguna ficha apunta fuera de assets/stimuli ni a la red', () => {
    for (const s of STIMULUS_VISUAL_SPECS) {
      expect(s.file).toMatch(/^en\/a1\/[a-z0-9-]+\.(jpg|png)$/);
      expect(JSON.stringify(s)).not.toMatch(/https?:|www\./);
    }
  });
});
