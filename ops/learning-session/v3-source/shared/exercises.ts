/**
 * Contrato de los ejercicios. El contenido (content/), la base de datos (exercises.payload)
 * y el motor de la app usan estos tipos.
 */

export const EXERCISE_TYPES = [
  'image_choice', //       imagen → palabra en inglés
  'translation_choice', // palabra inglesa → traducción
  'translate_write', //    español → inglés escrito
  'complete_word', //      completar una palabra (ortografía)
  'fill_blank', //         completar una frase / palabra en contexto
  'order_words', //        ordenar palabras para formar una oración
  'listen_choice', //      escuchar y elegir
  'match_pairs', //        relacionar vocabulario con significado
  'short_answer', //       respuesta breve escrita
  'context_choice', //     leer o escuchar un mensaje en contexto y responder sobre su significado
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const SKILLS = [
  'vocabulary',
  'translation',
  'listening',
  'grammar',
  'sentence_building',
  'reading',
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  vocabulary: 'Vocabulario',
  translation: 'Traducción',
  listening: 'Comprensión auditiva',
  grammar: 'Gramática',
  sentence_building: 'Construcción de frases',
  reading: 'Comprensión lectora',
};

/**
 * Estímulos de comprensión en contexto (fase C, docs/LEARNING_PHASE_C.md). Viajan dentro del
 * payload de cada pregunta: la versión inmutable del ítem guarda el texto o la transcripción exactos
 * que se mostraron o se dijeron. Las preguntas de un mismo estímulo comparten `id`.
 */
export const READING_DOCUMENTS = [
  'message', //     mensaje de texto o chat
  'email', //       correo breve
  'post', //        publicación en una red social
  'notice', //      aviso o anuncio escrito
  'sign', //        cartel
  'menu', //        menú
  'schedule', //    horario o programa
  'description', // descripción
  'directions', //  indicaciones
  'postcard', //    postal
  'ad', //          anuncio clasificado
  'form', //        formulario o ficha de registro (fase C.2)
] as const;
export type ReadingDocument = (typeof READING_DOCUMENTS)[number];

/**
 * Soporte visual de un estímulo (fase C.9.1, docs/LEARNING_PHASE_C9_VISUALS.md). Va dentro del
 * estímulo, así que forma parte de su versión inmutable y de su `content_hash`: cambiar la imagen
 * (otro `sha256`) es una versión nueva del ítem. La imagen viaja empaquetada en la app (sin URL ni
 * almacenamiento remoto); el payload sólo la nombra. Una app que no tiene ese recurso con ese mismo
 * hash muestra el estímulo sin imagen: el texto o el audio alcanzan siempre para responder.
 */
export const STIMULUS_VISUAL_KINDS = ['photo', 'illustration', 'floor_plan', 'map'] as const;
export type StimulusVisualKind = (typeof STIMULUS_VISUAL_KINDS)[number];

/**
 * Cuándo se muestra. `with_stimulus`: junto al texto o el audio, antes de responder (la imagen no
 * puede dar la respuesta). `after_answer`: recién después de responder, como la transcripción (para
 * planos y mapas que muestran exactamente lo que se pregunta).
 */
export const STIMULUS_VISUAL_DISPLAYS = ['with_stimulus', 'after_answer'] as const;
export type StimulusVisualDisplay = (typeof STIMULUS_VISUAL_DISPLAYS)[number];

/** `<idioma>.img.<slug>`. */
export const STIMULUS_VISUAL_ID = /^[a-z]{2}\.img\.[a-z0-9-]+$/;

/**
 * Límites del recurso. Proporción (ancho / alto) de 3:4 a 16:9: entra entera en el ancho de un
 * teléfono sin dejar una franja ilegible ni ocupar más de una pantalla. Peso máximo del archivo para
 * no inflar el paquete de la app (cada imagen viaja en la build y en las actualizaciones OTA).
 */
export const STIMULUS_VISUAL_LIMITS = {
  minAspect: 3 / 4,
  maxAspect: 16 / 9,
  minSide: 320,
  maxSide: 4096,
  minAlt: 20,
  maxBytes: 450 * 1024,
} as const;

export const visualAspectOk = (width: number, height: number) =>
  width / height >= STIMULUS_VISUAL_LIMITS.minAspect - 1e-9 &&
  width / height <= STIMULUS_VISUAL_LIMITS.maxAspect + 1e-9;

export interface StimulusVisual {
  /** `<idioma>.img.<slug>`: estable; clave del recurso empaquetado (src/features/learning/stimulusImages.ts). */
  id: string;
  kind: StimulusVisualKind;
  display: StimulusVisualDisplay;
  /** Descripción accesible en español para el lector de pantalla. Con `with_stimulus`, sin la respuesta. */
  alt: string;
  /** Tamaño en píxeles del archivo maestro: fija la proporción con la que se dibuja. */
  width: number;
  height: number;
  /** SHA-256 (hex) de los bytes del archivo: la versión apunta a esa imagen exacta. */
  sha256: string;
}

/** Texto escrito: lo que el estudiante lee. `lines` en el idioma que se aprende. */
export interface ReadingStimulus {
  kind: 'reading';
  /** `<idioma>.stim.<slug>`: estable; lo comparten las preguntas del mismo texto. */
  id: string;
  document: ReadingDocument;
  /** Situación en español («Ana le escribe a una amiga»). No da la respuesta. */
  setting: string;
  title?: string;
  /** Emisor y destinatario ficticios (sólo nombres de pila; nunca datos de contacto). */
  from?: string;
  to?: string;
  lines: string[];
  /** Imagen de apoyo (fase C.9.1). Sin ella, el estímulo se muestra como siempre. */
  visual?: StimulusVisual;
}

/** Voz del motor de síntesis: `a` y `b` son dos voces distintas del dispositivo (o tono distinto). */
export type StimulusVoice = 'a' | 'b';

/**
 * Audio sintetizado en el dispositivo (expo-speech, voz del sistema; no son grabaciones). No hay
 * archivo: `lines` es a la vez lo que se dice y la transcripción de referencia (corrección,
 * accesibilidad y auditoría). La app no la muestra antes de responder.
 */
export interface ListeningStimulus {
  kind: 'listening';
  id: string;
  setting: string;
  /** Hablantes ficticios y la voz de cada uno. Diálogo: dos voces distintas. */
  speakers: { name: string; voice: StimulusVoice }[];
  /** Velocidad del motor (1 = normal). A1: entre 0.75 y 0.9, nunca acelerado. */
  rate: number;
  lines: { speaker: string; text: string }[];
  /** Imagen de apoyo (fase C.9.1): p. ej. la foto de la que hablan. */
  visual?: StimulusVisual;
}

export type ContextStimulus = ReadingStimulus | ListeningStimulus;

/** Datos específicos de cada tipo (columna exercises.payload). */
export type ExercisePayload =
  | { type: 'image_choice'; emoji: string; options: string[] }
  | { type: 'translation_choice'; word: string; options: string[] }
  | { type: 'translate_write'; source: string }
  | { type: 'complete_word'; masked: string; hint: string }
  | { type: 'fill_blank'; sentence: string; translation: string; options: string[] }
  | { type: 'order_words'; tokens: string[]; translation: string }
  | { type: 'listen_choice'; audioText: string; options: string[] }
  | { type: 'match_pairs'; pairs: { left: string; right: string }[] }
  | { type: 'short_answer'; question: string; translation: string }
  /** Pregunta y opciones en español: se evalúa la comprensión del mensaje, no la del enunciado. */
  | { type: 'context_choice'; stimulus: ContextStimulus; question: string; options: string[] };

/** Ejercicio tal como lo recibe el motor de la app. */
export interface Exercise {
  id: string;
  lessonId: string | null;
  position: number;
  type: ExerciseType;
  skill: Skill;
  /** Enunciado en español. */
  prompt: string;
  payload: ExercisePayload;
  /** Respuesta canónica. En match_pairs no se usa (las parejas son la respuesta). */
  answer: string;
  /** Variantes aceptadas explícitamente además de `answer`. */
  acceptedAnswers: string[];
  explanation: string | null;
  difficulty: number;
  recommendedSeconds: number;
  wordIds: string[];
}

/** Respuesta del usuario según el tipo de ejercicio. */
export type UserAnswer =
  | { kind: 'text'; value: string }
  | { kind: 'option'; value: string }
  | { kind: 'tokens'; value: string[] }
  | { kind: 'pairs'; value: { left: string; right: string }[] };

export function answerKindFor(type: ExerciseType): UserAnswer['kind'] {
  switch (type) {
    case 'image_choice':
    case 'translation_choice':
    case 'fill_blank':
    case 'listen_choice':
    case 'context_choice':
      return 'option';
    case 'order_words':
      return 'tokens';
    case 'match_pairs':
      return 'pairs';
    case 'translate_write':
    case 'complete_word':
    case 'short_answer':
      return 'text';
  }
}
