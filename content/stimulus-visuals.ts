import {
  STIMULUS_VISUAL_DISPLAYS,
  STIMULUS_VISUAL_ID,
  STIMULUS_VISUAL_KINDS,
  STIMULUS_VISUAL_LIMITS,
  visualAspectOk,
  type ContextStimulus,
  type StimulusVisual,
} from '../shared/exercises';

/**
 * Soporte visual de los estímulos de comprensión (fase C.9.1, docs/LEARNING_PHASE_C9_VISUALS.md).
 *
 * Cada entrada es la ficha técnica de una imagen: id estable, tipo, cuándo se muestra, descripción
 * accesible, tamaño del maestro y archivo bajo `assets/stimuli/`. El estímulo la lleva en su payload
 * (y por lo tanto en su versión inmutable y su `content_hash`) recién cuando el recurso definitivo
 * existe y se anota su `sha256`. Mientras `sha256` es `null` el estímulo se arma exactamente como
 * antes: ninguna versión ni hash cargado cambia por preparar el soporte.
 *
 * Para integrar una imagen definitiva:
 *   1. Guardar el archivo en `assets/stimuli/<file>` con el tamaño exacto de la ficha.
 *   2. `npm run content:visual -- assets/stimuli/<file>` imprime su sha256 y su tamaño.
 *   3. Anotar el sha256 acá y registrar el `require` en src/features/learning/stimulusImages.ts.
 *   4. Las pruebas (content/__tests__/stimulus-visuals.test.ts) verifican archivo, hash, tamaño, peso
 *      y registro. El cambio de payload es una versión nueva de cada ítem de ese estímulo: se publica
 *      con su migración de contenido, como cualquier otra corrección.
 */
export interface StimulusVisualSpec {
  /** Estímulos que la muestran (el mismo recurso puede servir a dos estímulos de la misma situación). */
  stimuli: string[];
  /** Archivo bajo `assets/stimuli/` (minúsculas, `.jpg` para fotos, `.png` para planos y mapas). */
  file: string;
  /** `null` mientras no existe el recurso definitivo: el estímulo va sin imagen. */
  sha256: string | null;
  visual: Omit<StimulusVisual, 'sha256'>;
}

export const STIMULUS_VISUAL_SPECS: readonly StimulusVisualSpec[] = [
  // U2 · ficha de la clase (lectura, cR03). Antes de responder: no puede mostrar quién es el profesor
  // ni cómo está cada uno.
  {
    stimuli: ['en.stim.a1-u02-class-card'],
    file: 'en/a1/u02-class-card.jpg',
    sha256: null,
    visual: {
      id: 'en.img.a1-u02-class-card',
      kind: 'photo',
      display: 'with_stimulus',
      alt: 'Foto de dos adultos de edad parecida sentados uno al lado del otro en un aula, frente a una mesa con cuadernos: a la izquierda un hombre, Sam; a la derecha una mujer, Mia. Los dos miran a la cámara con expresión neutra.',
      width: 1600,
      height: 1200,
    },
  },
  // U4 · la foto de la que hablan Tom y Ana (escucha, cL05). Antes de responder: toda la familia, sin
  // señalar a nadie, para que «Who is he?» se resuelva escuchando.
  {
    stimuli: ['en.stim.a1-u04-family-photo'],
    file: 'en/a1/u04-family-photo.jpg',
    sha256: null,
    visual: {
      id: 'en.img.a1-u04-family-photo',
      kind: 'photo',
      display: 'with_stimulus',
      alt: 'Foto de una familia grande al aire libre: nueve personas de distintas edades, cuatro hombres, cuatro mujeres y un bebé en brazos de una mujer mayor. Nadie señala a nadie ni lleva ropa de trabajo.',
      width: 1800,
      height: 1200,
    },
  },
  // U5 · la mesa que ordenan Leo y Kim (escucha, cL01). Antes de responder: están los tres objetos de
  // las opciones y no está el teléfono blanco de Kim.
  {
    stimuli: ['en.stim.a1-u05-whose-cup'],
    file: 'en/a1/u05-meeting-table.jpg',
    sha256: null,
    visual: {
      id: 'en.img.a1-u05-meeting-table',
      kind: 'photo',
      display: 'with_stimulus',
      alt: 'Foto de una mesa de reunión vista desde arriba, sin personas: un teléfono negro, una taza amarilla, una computadora portátil cerrada y unas hojas sueltas.',
      width: 1600,
      height: 1200,
    },
  },
  // U6 · plano del departamento (lectura cR03 y escucha cL04, la misma casa). Muestra exactamente lo
  // que se pregunta: va después de responder.
  {
    stimuli: ['en.stim.a1-u06-rental-ad', 'en.stim.a1-u06-house-tour'],
    file: 'en/a1/u06-apartment-plan.png',
    sha256: null,
    visual: {
      id: 'en.img.a1-u06-apartment-plan',
      kind: 'floor_plan',
      display: 'after_answer',
      alt: 'Plano del departamento visto desde arriba. A la izquierda, una cocina grande con una mesa y unas llaves sobre la mesa. En el centro, el living, con un sofá y la puerta de entrada. A la derecha, dos dormitorios con el baño entre los dos. La cocina sólo comparte pared con el living. No hay jardín ni balcón.',
      width: 1600,
      height: 1200,
    },
  },
  // U10 · recorrido de la estación al museo (lectura, cR06). Muestra el recorrido: después de responder.
  {
    stimuli: ['en.stim.a1-u10-way-to-the-museum'],
    file: 'en/a1/u10-way-to-the-museum.png',
    sha256: null,
    visual: {
      id: 'en.img.a1-u10-way-to-the-museum',
      kind: 'map',
      display: 'after_answer',
      alt: 'Mapa del recorrido. Desde la estación, abajo, una línea de puntos sigue derecho hacia arriba hasta la esquina del supermercado, dobla a la izquierda y sigue derecho hasta el museo, que está del lado derecho de la calle, al lado de la biblioteca.',
      width: 1200,
      height: 1500,
    },
  },
];

/** El recurso listo (con hash) que corresponde a un estímulo, si lo hay. */
export function visualFor(
  stimulusId: string,
  specs: readonly StimulusVisualSpec[] = STIMULUS_VISUAL_SPECS,
): StimulusVisual | undefined {
  const spec = specs.find((s) => s.stimuli.includes(stimulusId));
  return spec?.sha256 ? { ...spec.visual, sha256: spec.sha256 } : undefined;
}

/**
 * El estímulo con su imagen, si el recurso está listo; si no, el mismo objeto sin tocar (mismo JSON,
 * mismo hash). La imagen se declara sólo acá: un estímulo escrito con `visual` a mano es un error.
 */
export function withVisual<S extends ContextStimulus>(
  stimulus: S,
  specs: readonly StimulusVisualSpec[] = STIMULUS_VISUAL_SPECS,
): S {
  if (stimulus.visual)
    throw new Error(`${stimulus.id}: la imagen se declara en content/stimulus-visuals.ts`);
  const visual = visualFor(stimulus.id, specs);
  return visual ? { ...stimulus, visual } : stimulus;
}

const FILE = /^[a-z]{2}\/[a-z0-9]+\/[a-z0-9-]+\.(jpg|png)$/;

/** Reglas de las fichas que no dependen del archivo (el archivo lo verifican las pruebas). */
export function visualSpecProblems(
  specs: readonly StimulusVisualSpec[],
  stimuli: ReadonlyMap<string, ContextStimulus['kind']>,
): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const files = new Set<string>();
  const used = new Set<string>();
  for (const { stimuli: targets, file, sha256, visual: v } of specs) {
    const at = v.id;
    if (!STIMULUS_VISUAL_ID.test(v.id)) problems.push(`${at}: id inválido (<idioma>.img.<slug>)`);
    if (ids.has(v.id)) problems.push(`${at}: id repetido`);
    ids.add(v.id);
    if (!FILE.test(file))
      problems.push(`${at}: archivo ${file} fuera de <idioma>/<nivel>/<slug>.jpg|png`);
    if (files.has(file)) problems.push(`${at}: archivo repetido`);
    files.add(file);
    if (!file.startsWith(`${v.id.slice(0, 2)}/`))
      problems.push(`${at}: el archivo no es del idioma del id`);
    if (v.kind === 'photo' && !file.endsWith('.jpg')) problems.push(`${at}: una foto va en .jpg`);
    if (v.kind !== 'photo' && !file.endsWith('.png'))
      problems.push(`${at}: un plano o mapa va en .png`);
    if (!STIMULUS_VISUAL_KINDS.includes(v.kind)) problems.push(`${at}: tipo ${String(v.kind)}`);
    if (!STIMULUS_VISUAL_DISPLAYS.includes(v.display))
      problems.push(`${at}: display ${String(v.display)}`);
    // Un plano o un mapa muestra los lugares y el recorrido exactos: revelaría la respuesta.
    if ((v.kind === 'floor_plan' || v.kind === 'map') && v.display !== 'after_answer')
      problems.push(`${at}: un plano o mapa se muestra después de responder`);
    if (v.alt.trim().length < STIMULUS_VISUAL_LIMITS.minAlt)
      problems.push(`${at}: descripción accesible corta`);
    if (v.alt !== v.alt.normalize('NFC')) problems.push(`${at}: descripción fuera de NFC`);
    if (/https?:|www\./i.test(JSON.stringify(v)) || /^[a-z]+:/i.test(file))
      problems.push(`${at}: no puede apuntar a recursos remotos`);
    const side = (n: number) =>
      Number.isInteger(n) &&
      n >= STIMULUS_VISUAL_LIMITS.minSide &&
      n <= STIMULUS_VISUAL_LIMITS.maxSide;
    if (!side(v.width) || !side(v.height)) problems.push(`${at}: tamaño ${v.width}×${v.height}`);
    if (!visualAspectOk(v.width, v.height)) problems.push(`${at}: proporción fuera de 3:4–16:9`);
    if (sha256 !== null && !/^[0-9a-f]{64}$/.test(sha256)) problems.push(`${at}: sha256 inválido`);
    if (!targets.length) problems.push(`${at}: sin estímulos`);
    for (const s of targets) {
      if (!stimuli.has(s)) problems.push(`${at}: el estímulo ${s} no existe`);
      if (used.has(s)) problems.push(`${at}: ${s} ya tiene otra imagen`);
      used.add(s);
    }
  }
  return problems;
}
