import { lemmaCandidates, tokensOfText } from './comprehension';
import { ITEM_REGISTRY_PATH } from './comprehension';
import {
  EN_A1_BLOCKS,
  EN_A1_MAP,
  EN_A1_RETIRED_CODES,
  mapObjective,
  type MapDimension,
  type MapFormat,
} from './curriculum-map';
import {
  EN_A1_ASSESSMENTS,
  type AssessmentFormDef,
  type AssessmentItemDef,
  type AssessmentSection,
} from './en/a1/assessment';
import { EN_A1_WRITING_TASKS } from './en/a1/writing';
import { COURSES } from './index';
import { CONTENT_PERSONAS } from './personas';
import { PLANNED_PATH } from './planned';
import { englishTexts, gradingProblems, mapFormatOf, taughtFormsUpTo } from './supplement-checks';
import { SUPPLEMENTS } from './supplement';
import type { ExerciseDef } from './types';

/**
 * Reglas de los puntos de control y de la evaluación final de inglés A1 (mapa §4; docs/A1_EN_CLOSURE.md
 * §7). Vacío = válido. Las usa content/__tests__/assessment.test.ts.
 */

export const SECTION_OF: Record<MapDimension, AssessmentSection> = {
  V: 'vocabulary',
  G: 'grammar',
  C: 'comprehension',
  P: 'production',
};

/** Tipos con que se puede dar cada formato de evaluación (sin tipos nuevos). */
const FORMAT_TYPES: Partial<Record<MapFormat, ExerciseDef['type'][]>> = {
  PW: ['short_answer'],
  TR: ['short_answer'],
  GW: ['short_answer'],
  FF: ['short_answer'],
  SIT: ['fill_blank'],
  FB: ['fill_blank'],
  RQ: ['context_choice'],
  LQ: ['context_choice'],
  LM: ['context_choice'],
  TW: ['translate_write'],
};

/** Nombres propios que aparecen en los bancos (no son vocabulario). */
const NAMES = new Set(
  'ana tom kate mia leo gomez rosa max lily sam paul sofia ruiz puebla juan nina jack kim emma dan ben joe ann lucy lee park ms mr london sol'.split(
    ' ',
  ),
);

const contentKey = (e: ExerciseDef) => JSON.stringify([e.type, e.payload, e.answer]);

/** Todo ejercicio de las lecciones (currículo, «En contexto», U13/U14 y el cierre). */
function lessonKeys(): Set<string> {
  return new Set(
    ITEM_REGISTRY_PATH.flatMap((p) => p.lessons.flatMap((l) => l.exercises.map(contentKey))),
  );
}

function lessonStimuli(): Set<string> {
  const out = new Set<string>();
  for (const p of ITEM_REGISTRY_PATH)
    for (const l of p.lessons)
      for (const e of l.exercises)
        if (e.payload.type === 'context_choice') out.add(e.payload.stimulus.id);
  return out;
}

function knownWordIds(): Set<string> {
  return new Set([
    ...COURSES.filter((c) => c.language === 'en').flatMap((c) =>
      c.levels.flatMap((l) => l.units.flatMap((u) => u.words.map((w) => w.id))),
    ),
    ...PLANNED_PATH.flatMap((p) => p.unit.words.map((w) => w.id)),
    ...SUPPLEMENTS.flatMap((s) => s.units.flatMap((u) => u.words.map((w) => w.id))),
  ]);
}

function itemProblems(
  f: AssessmentFormDef,
  it: AssessmentItemDef,
  known: Set<string>,
  taught: Set<string>,
) {
  const problems: string[] = [];
  const at = `${f.id} ${it.key}`;
  const e = it.exercise;
  const m = mapObjective(it.code);
  if (EN_A1_RETIRED_CODES.includes(it.code)) problems.push(`${at}: código retirado ${it.code}`);
  if (!m) {
    problems.push(`${at}: el código ${it.code} no existe en el mapa`);
    return problems;
  }
  if (!m.assess.includes(it.format))
    problems.push(
      `${at}: ${it.format} no está en «Evaluar» de ${it.code} (${m.assess.join(', ')})`,
    );
  if (!FORMAT_TYPES[it.format]?.includes(e.type))
    problems.push(`${at}: ${it.format} no se da con ${e.type}`);
  const actual = mapFormatOf(e);
  const compatible =
    actual === it.format ||
    (it.format === 'GW' && (actual === 'SA' || actual === 'PW')) ||
    (it.format === 'FF' && (actual === 'SA' || actual === 'PW')) ||
    (it.format === 'TR' && actual === 'SA') ||
    (it.format === 'FB' && actual === 'FB');
  if (!compatible) problems.push(`${at}: declara ${it.format} pero el ejercicio es ${actual}`);
  if (it.format === 'FF') {
    const persona =
      e.personalData && e.personalData !== 'learner'
        ? CONTENT_PERSONAS.find((p) => p.id === (e.personalData as { persona: string }).persona)
        : undefined;
    if (!persona) problems.push(`${at}: FF exige una persona ficticia del catálogo`);
  } else if (e.personalData) problems.push(`${at}: sólo FF usa datos de una persona`);
  if (e.personalData === 'learner') problems.push(`${at}: pide datos del alumno (P4)`);
  const targets = [...e.words, ...(e.concepts ?? [])];
  if (!targets.length) problems.push(`${at}: sin palabras ni conceptos target`);
  for (const id of targets) if (!known.has(id)) problems.push(`${at}: palabra ${id} inexistente`);
  if (e.type === 'context_choice' && !e.explanation) problems.push(`${at}: falta la explicación`);
  const bad = [...new Set(englishTexts(e).flatMap(tokensOfText))].filter(
    (t) => !lemmaCandidates(t).some((c) => taught.has(c) || NAMES.has(c)),
  );
  if (bad.length)
    problems.push(`${at}: vocabulario no enseñado hasta U${f.upToUnit}: ${bad.join(', ')}`);
  problems.push(...gradingProblems(e, at));
  return problems;
}

/** Códigos cubiertos por ítems y por tareas de escritura de una forma. */
export function coverageOf(f: AssessmentFormDef) {
  const items = new Set(f.items.map((i) => i.code));
  const writing = new Set(
    f.writing.flatMap((id) => EN_A1_WRITING_TASKS.find((t) => t.id === id)?.codes ?? []),
  );
  return { items, writing, all: new Set([...items, ...writing]) };
}

export function sectionCounts(f: AssessmentFormDef): Record<AssessmentSection, number> {
  const out: Record<AssessmentSection, number> = {
    vocabulary: 0,
    grammar: 0,
    comprehension: 0,
    production: 0,
  };
  for (const i of f.items) {
    const m = mapObjective(i.code);
    if (m) out[SECTION_OF[m.dimension]]++;
  }
  return out;
}

export function assessmentProblems(
  forms: readonly AssessmentFormDef[] = EN_A1_ASSESSMENTS,
): string[] {
  const problems: string[] = [];
  const known = knownWordIds();
  const seenLessons = lessonKeys();
  const lessonStims = lessonStimuli();
  const keys = new Map<string, string>();
  const contents = new Map<string, string>();
  const stimuli = new Map<string, string>();

  for (const f of forms) {
    const taught = taughtFormsUpTo('en', f.upToUnit);
    for (const w of f.writing)
      if (!EN_A1_WRITING_TASKS.some((t) => t.id === w))
        problems.push(`${f.id}: tarea ${w} inexistente`);
    for (const it of f.items) {
      if (keys.has(it.key)) problems.push(`${it.key}: clave repetida (${keys.get(it.key)})`);
      keys.set(it.key, f.id);
      const key = contentKey(it.exercise);
      if (seenLessons.has(key))
        problems.push(`${f.id} ${it.key}: el ítem ya aparece en una lección`);
      if (contents.has(key))
        problems.push(`${f.id} ${it.key}: repite el ítem ${contents.get(key)}`);
      contents.set(key, it.key);
      const p = it.exercise.payload;
      if (p.type === 'context_choice') {
        if (lessonStims.has(p.stimulus.id))
          problems.push(`${it.key}: el estímulo ${p.stimulus.id} es de una lección`);
        const s = JSON.stringify(p.stimulus);
        const prev = stimuli.get(p.stimulus.id);
        if (prev !== undefined && prev !== `${f.id}|${s}`)
          problems.push(
            `${it.key}: el estímulo ${p.stimulus.id} se usa en otra forma o con otro contenido`,
          );
        stimuli.set(p.stimulus.id, `${f.id}|${s}`);
      }
      problems.push(...itemProblems(f, it, known, taught));
    }

    const cov = coverageOf(f);
    const required =
      f.kind === 'checkpoint'
        ? [...(EN_A1_BLOCKS.find((b) => b.block === f.block)?.checkpoint ?? [])]
        : EN_A1_MAP.map((m) => m.code);
    for (const c of required) if (!cov.all.has(c)) problems.push(`${f.id}: no evalúa ${c}`);
    const counts = sectionCounts(f);
    for (const [section, n] of Object.entries(counts))
      if (n === 0 && !(section === 'production' && f.writing.length))
        problems.push(`${f.id}: sin ítems de ${section}`);
    const kinds = new Set(
      f.items.flatMap((i) =>
        i.exercise.payload.type === 'context_choice' ? [i.exercise.payload.stimulus.kind] : [],
      ),
    );
    if (!kinds.has('reading') || !kinds.has('listening'))
      problems.push(`${f.id}: la comprensión tiene que tener lectura y escucha`);
    if (!f.writing.length) problems.push(`${f.id}: falta la tarea de escritura`);
  }

  // Formas paralelas del examen final: mismos objetivos con los mismos formatos, ítems distintos.
  const finals = forms.filter((f) => f.kind === 'final');
  const profile = (f: AssessmentFormDef) =>
    f.items
      .map((i) => `${i.code}:${i.format}`)
      .sort()
      .join(',');
  if (finals.length < 2) problems.push('La evaluación final necesita dos formas paralelas');
  for (const f of finals.slice(1))
    if (profile(f) !== profile(finals[0]!))
      problems.push(`${f.id}: no es paralela a ${finals[0]!.id} (objetivos o formatos distintos)`);
  return problems;
}
