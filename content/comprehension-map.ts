/**
 * Objetivos de comprensión del mapa curricular de inglés A1
 * (docs/polygo-ingles-a1-mapa-curricular.md §2, tabla «Comprehension»), con su correspondencia
 * con los ids de la base (docs/LEARNING_PHASE_C.md §C1.1).
 *
 * Correspondencia: el mapa fija los códigos `en-a1-cL01` … `en-a1-cR06`; la base exige
 * `<idioma>.<nivel>.obj.<slug>` con slug en minúsculas (CHECK learning_objectives_id_check). El id es
 * el código en minúsculas: `en-a1-cL01` ↔ `en.a1.obj.cl01`. Es biyectiva (cL/cR no chocan en
 * minúsculas) y no depende de posiciones. Un objetivo por capacidad, compartido por todas las
 * lecciones que la practican: nunca uno por lección.
 *
 * `cR04` está retirado por el mapa («queda dentro de cR01»): no se usa ni se reutiliza.
 *
 * Sin imports a propósito: content/types.ts usa ComprehensionCode.
 */

export const COMPREHENSION_CODES = [
  'cL01',
  'cL02',
  'cL03',
  'cL04',
  'cL05',
  'cL06',
  'cR01',
  'cR02',
  'cR03',
  'cR05',
  'cR06',
] as const;

export type ComprehensionCode = (typeof COMPREHENSION_CODES)[number];

/** Retirados por el mapa: nunca vuelven a usarse. */
export const RETIRED_COMPREHENSION_CODES: readonly string[] = ['cR04'];

export interface ComprehensionObjectiveMeta {
  activity: 'listening' | 'reading';
  /** Texto del mapa, columna «Objetivo (el estudiante puede…)». */
  objective: string;
  /** Anclas del mapa (códigos internos del mapa, no oficiales) y escala del MCER. */
  anchors: string;
}

/**
 * Textos y anclas copiados del mapa. Las escalas marcadas † en el mapa tienen la redacción 2020
 * verificada; el resto cita la edición 2018 (pendiente de cotejo con el PDF 2020, mapa §0).
 */
export const EN_A1_COMPREHENSION_MAP: Record<ComprehensionCode, ComprehensionObjectiveMeta> = {
  cL01: {
    activity: 'listening',
    objective: 'Entender el significado de palabras y frases familiares dichas despacio',
    anchors: 'LIS-1 † Overall oral comprehension (CEFR CV 2020)',
  },
  cL02: {
    activity: 'listening',
    objective: 'Entender preguntas e instrucciones dirigidas al alumno',
    anchors: 'INT-1 Understanding an interlocutor (CEFR CV 2018)',
  },
  cL03: {
    activity: 'listening',
    objective: 'Captar números, precios y horas en anuncios y mensajes',
    anchors:
      'LIS-3 Listening to announcements and instructions (CEFR CV 2018); LIS-1 † Overall oral comprehension (CEFR CV 2020)',
  },
  cL04: {
    activity: 'listening',
    objective: 'Seguir indicaciones breves y entender dónde está algo',
    anchors: 'LIS-3 Listening to announcements and instructions (CEFR CV 2018)',
  },
  cL05: {
    activity: 'listening',
    objective:
      'Entender una conversación simple entre otras personas (por ejemplo, cliente y vendedor)',
    anchors: 'LIS-2 Understanding conversation between other speakers (CEFR CV 2018)',
  },
  cL06: {
    activity: 'listening',
    objective: 'Sacar datos concretos de grabaciones breves (mensaje de voz)',
    anchors: 'LIS-4 Listening to audio media and recordings (CEFR CV 2018)',
  },
  cR01: {
    activity: 'reading',
    objective: 'Entender avisos, carteles, menús, horarios, folletos e información práctica',
    anchors: 'REA-3 Reading for orientation (CEFR CV 2018)',
  },
  cR02: {
    activity: 'reading',
    objective:
      'Entender mensajes breves (postal, chat, email) que proponen qué hacer, cuándo y dónde',
    anchors: 'REA-2 Reading correspondence (CEFR CV 2018)',
  },
  cR03: {
    activity: 'reading',
    objective: 'Entender textos descriptivos breves con apoyo visual',
    anchors:
      'REA-4 Reading for information and argument (CEFR CV 2018); REA-1 † Overall reading comprehension (CEFR CV 2020)',
  },
  cR05: {
    activity: 'reading',
    objective: 'Entender el significado de oraciones sueltas',
    anchors: 'REA-1 † Overall reading comprehension (CEFR CV 2020)',
  },
  cR06: {
    activity: 'reading',
    objective: 'Seguir indicaciones escritas para ir de un lugar a otro',
    anchors: 'REA-5 Reading instructions (CEFR CV 2018)',
  },
};

/** `en-a1-cL01` (código del mapa). */
export const curriculumCode = (language: string, level: string, code: ComprehensionCode) =>
  `${language}-${level.toLowerCase()}-${code}`;

/** `en.a1.obj.cl01` (id en learning_objectives). */
export const comprehensionObjectiveId = (
  language: string,
  level: string,
  code: ComprehensionCode,
) => `${language}.${level.toLowerCase()}.obj.${code.toLowerCase()}`;
