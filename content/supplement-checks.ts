import { gradeWithSpec, gradingSpecFor } from '../shared/grading';
import type { ExerciseDef, WordDef } from './types';
import { lemmaCandidates, stimulusText, tokensOfText } from './comprehension';
import {
  EN_A1_RETIRED_CODES,
  EN_A1_ROUTE_ORDER,
  mapObjective,
  type MapFormat,
} from './curriculum-map';
import { AUTHORED_ID } from './ids-lock';
import { COURSES, CURRICULUM_PATH } from './index';
import { targetTexts } from './planned-checks';
import { PLANNED_PATH } from './planned';
import { SUPPLEMENTS, baseUnit } from './supplement';

/**
 * Reglas del cierre de inglés A1 (docs/A1_EN_CLOSURE.md). Las usan content/__tests__/closure.test.ts
 * y scripts/build-a1-closure-sql.ts (que no escribe la migración si hay problemas). Vacío = válido.
 *
 * - Códigos del mapa: existen (content/curriculum-map.ts) y ninguno es retirado (cR04, v13, p12, g24).
 * - Cada ejercicio tiene un objetivo identificable: su formato del mapa (`mapFormatOf`) está en
 *   «Practicar» o «Evaluar» de alguno de los objetivos de su lección.
 * - Vocabulario: todo el inglés usa lo enseñado hasta esa unidad EN EL ORDEN DE LA RUTA v2 (U13 después
 *   de U3, U14 después de U7): palabras, formas que ya aparecen en las lecciones cargadas hasta ahí, las
 *   palabras nuevas de los agregados hasta esa unidad, las palabras target del propio ejercicio
 *   (adelantadas: quedan listadas en `advancedWords()` para la revisión) y nombres declarados.
 * - Ambigüedad: opciones únicas (sin mayúsculas, tildes ni puntuación), la respuesta una sola vez, y
 *   corrección del servidor (`gradeWithSpec`) correcta para la respuesta y las aceptadas, incorrecta
 *   para cada distractor.
 * - Lecciones nuevas: estándar de docs/CONTENT_STANDARD.md (introducción, cierres, 6–10 ejercicios,
 *   escucha, los dos últimos de producción). Palabras nuevas: ids y textos sin repetir, con IPA, y
 *   practicadas.
 * - Privacidad: ningún dato de contacto ni datos del alumno (P4).
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
/** Mapa §5: IC, TC, MP, FB, CW, OW y LC se conservan como práctica, y TW como recuperación. */
const GENERAL_PRACTICE = new Set<MapFormat>(['IC', 'TC', 'MP', 'FB', 'CW', 'OW', 'LC', 'TW', 'SA']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const PICTO = /\p{Extended_Pictographic}/u;

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!.,'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Formato del mapa (§2) que cumple un ejercicio con los tipos existentes (closure.ts). */
export function mapFormatOf(e: ExerciseDef): MapFormat {
  const p = e.payload;
  switch (p.type) {
    case 'image_choice':
      return 'IC';
    case 'translation_choice':
      return 'TC';
    case 'match_pairs':
      return 'MP';
    case 'fill_blank':
      return p.translation.startsWith('Situación') ? 'SIT' : 'FB';
    case 'listen_choice':
      return 'LC';
    case 'complete_word':
      return 'CW';
    case 'translate_write':
      return 'TW';
    case 'order_words':
      return 'OW';
    case 'short_answer':
      if (/^Escribí la oración (en negativa|como pregunta)/.test(p.translation)) return 'TR';
      return PICTO.test(p.question) || /^\d+$/.test(p.question.trim()) ? 'PW' : 'SA';
    case 'context_choice':
      if (p.stimulus.kind === 'reading') return 'RQ';
      // LM: una frase corta (escuchar → significado); LQ: un mensaje, anuncio o diálogo en contexto.
      return p.stimulus.lines.length === 1 && tokensOfText(p.stimulus.lines[0]!.text).length <= 4
        ? 'LM'
        : 'LQ';
  }
}

/** Texto en inglés de un ejercicio (lo que se lee, se oye o se responde). */
export function englishTexts(e: ExerciseDef): string[] {
  if (e.payload.type === 'context_choice') return [stimulusText(e.payload.stimulus)];
  // Las aclaraciones entre paréntesis de una pregunta van en español («(Sí, tengo uno.)»).
  return targetTexts(e).map((t) => t.replace(/\([^)]*\)/g, ' '));
}

/** Opciones que se muestran (para la ambigüedad). */
export function optionsOf(e: ExerciseDef): string[] | null {
  const p = e.payload;
  return 'options' in p ? p.options : null;
}

/** Problemas de corrección: la respuesta y las aceptadas son correctas; los distractores, no. */
export function gradingProblems(e: ExerciseDef, at: string): string[] {
  const problems: string[] = [];
  const spec = gradingSpecFor(e.type, e.mode);
  const content = {
    answer: e.answer,
    accepted_answers: e.acceptedAnswers ?? [],
    payload: e.payload,
  };
  const options = optionsOf(e);
  if (options) {
    const seen = new Set<string>();
    for (const o of options) {
      if (seen.has(plain(o))) problems.push(`${at}: opciones repetidas («${o}»)`);
      seen.add(plain(o));
    }
    if (options.filter((o) => o === e.answer).length !== 1)
      problems.push(`${at}: la respuesta tiene que estar una sola vez entre las opciones`);
    if (options.length < 3 || options.length > 4) problems.push(`${at}: 3–4 opciones`);
    for (const o of options) {
      const v = gradeWithSpec(spec, content, { kind: 'option', value: o });
      if (v.correct !== (o === e.answer))
        problems.push(`${at}: la corrección de «${o}» no es la esperada`);
    }
    return problems;
  }
  if (e.type === 'match_pairs') return problems;
  if (e.type === 'order_words') {
    const p = e.payload as { tokens: string[] };
    const v = gradeWithSpec(spec, content, { kind: 'tokens', value: p.tokens });
    if (v.correct && p.tokens.join(' ') !== e.answer.replace(/[.!?]$/, ''))
      problems.push(`${at}: las fichas ya vienen en orden`);
    return problems;
  }
  for (const a of [e.answer, ...(e.acceptedAnswers ?? [])]) {
    const v = gradeWithSpec(spec, content, { kind: 'text', value: a });
    if (!v.correct) problems.push(`${at}: «${a}» no se corrige como correcta`);
  }
  return problems;
}

function wordsOfLanguage(language: string): WordDef[] {
  const course = COURSES.find((c) => c.language === language);
  const planned = PLANNED_PATH.filter((p) => p.language === language).flatMap((p) => p.unit.words);
  return [...(course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? []), ...planned];
}

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(tokensOfText);

/** Unidades hasta `unit` (incluida) en el orden de la ruta v2. */
const routeUpTo = (unit: number) => EN_A1_ROUTE_ORDER.slice(0, EN_A1_ROUTE_ORDER.indexOf(unit) + 1);

/** Formas enseñadas hasta `unit`: palabras y todo el inglés de las lecciones ya cargadas. */
export function taughtFormsUpTo(language: string, unit: number): Set<string> {
  const units = new Set(routeUpTo(unit));
  const out = new Set<string>();
  for (const p of [...CURRICULUM_PATH, ...PLANNED_PATH]) {
    if (p.language !== language || p.level !== 'A1' || !units.has(p.unit.position)) continue;
    p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
    for (const l of p.lessons)
      for (const e of l.exercises)
        englishTexts(e)
          .flatMap(tokensOfText)
          .forEach((t) => out.add(t));
  }
  // Las palabras nuevas de los agregados y las que sus ejercicios practican (las adelantadas, p. ej.
  // las profesiones de U2): desde esa unidad, cuentan como enseñadas.
  const byId = new Map(wordsOfLanguage(language).map((w) => [w.id, w]));
  for (const s of SUPPLEMENTS.filter((x) => x.language === language))
    for (const u of s.units.filter((x) => units.has(x.unit))) {
      u.words.flatMap(formsOf).forEach((t) => out.add(t));
      for (const e of [
        ...u.appendices.flatMap((a) => a.exercises),
        ...u.lessons.flatMap((l) => l.exercises),
      ])
        for (const id of [...e.words, ...(e.concepts ?? [])]) {
          const w = byId.get(id);
          if (w) formsOf(w).forEach((t) => out.add(t));
        }
    }
  return out;
}

/** Palabras target de un agregado que se enseñan en una unidad posterior de la ruta (o en A2). */
export function advancedWords(): { unit: number; word: string; at: string }[] {
  const out: { unit: number; word: string; at: string }[] = [];
  for (const { language, units } of SUPPLEMENTS) {
    const all = wordsOfLanguage(language);
    for (const s of units) {
      const before = new Set(routeUpTo(s.unit));
      const ownIds = new Set(
        SUPPLEMENTS.flatMap((x) => x.units)
          .filter((u) => before.has(u.unit))
          .flatMap((u) => u.words.map((w) => w.id)),
      );
      const taught = new Set(
        [...CURRICULUM_PATH, ...PLANNED_PATH]
          .filter((p) => p.language === language && p.level === 'A1' && before.has(p.unit.position))
          .flatMap((p) => p.unit.words.map((w) => w.id)),
      );
      for (const l of [
        ...s.appendices.map((a) => ({ id: a.lesson, exercises: a.exercises })),
        ...s.lessons,
      ])
        for (const e of l.exercises)
          for (const id of [...e.words, ...(e.concepts ?? [])])
            if (!taught.has(id) && !ownIds.has(id) && all.some((w) => w.id === id))
              out.push({ unit: s.unit, word: id, at: l.id });
    }
  }
  return out;
}

export function supplementProblems(): string[] {
  const problems: string[] = [];
  for (const { language, level, units } of SUPPLEMENTS) {
    const existing = wordsOfLanguage(language);
    const byId = new Map(existing.map((w) => [w.id, w]));
    const texts = new Map(existing.map((w) => [plain(w.text), w.id]));
    const stimuli = new Map<string, string>();
    const newIds = new Set<string>();

    for (const s of units) {
      const where = `${language} ${level} U${s.unit}`;
      if (!EN_A1_ROUTE_ORDER.includes(s.unit)) problems.push(`${where}: unidad fuera del mapa`);
      const base = baseUnit(language, level, s.unit);
      for (const w of s.words) {
        if (byId.has(w.id) || newIds.has(w.id)) problems.push(`${w.id}: id de palabra repetido`);
        newIds.add(w.id);
        const same = texts.get(plain(w.text));
        if (same && same !== w.id) problems.push(`${w.id}: «${w.text}» ya es la palabra ${same}`);
        texts.set(plain(w.text), w.id);
        byId.set(w.id, w);
        if (!w.ipa) problems.push(`${w.id}: falta la IPA`);
        if (!w.translation.trim() || !w.exampleEn.trim())
          problems.push(`${w.id}: falta traducción o ejemplo`);
      }
      const taught = taughtFormsUpTo(language, s.unit);
      const names = new Set(s.names.map((n) => n.toLowerCase()));
      const allowed = (t: string, own: ReadonlySet<string>) =>
        lemmaCandidates(t).some((c) => taught.has(c) || own.has(c) || names.has(c));

      const groups = [
        ...s.appendices.map((a) => ({
          id: a.lesson,
          curriculum: a.curriculum,
          exercises: a.exercises,
          isNew: false,
          mapChange: a.mapChange,
        })),
        ...s.lessons.map((l) => ({ ...l, isNew: true, mapChange: 'N' })),
      ];
      for (const g of groups) {
        const at = `${where} ${g.id}`;
        if (!g.mapChange.trim()) problems.push(`${at}: falta qué pide el mapa`);
        const codes = [...g.curriculum.primary, ...g.curriculum.secondary];
        if (!g.curriculum.primary.length) problems.push(`${at}: sin objetivo principal`);
        for (const c of codes) {
          if (EN_A1_RETIRED_CODES.includes(c)) problems.push(`${at}: usa el código retirado ${c}`);
          else if (!mapObjective(c)) problems.push(`${at}: el código ${c} no existe en el mapa`);
        }
        // Producción (P): escribir a partir de una situación con datos dados (PW) es el andamiaje de
        // la producción guiada; la autoevaluación GW/FW va en content/en/a1/writing.ts.
        const formats = new Set(
          codes.flatMap((c) => [
            ...(mapObjective(c)?.practice ?? []),
            ...(mapObjective(c)?.assess ?? []),
            ...(mapObjective(c)?.dimension === 'P' ? (['PW'] as const) : []),
          ]),
        );
        if (!g.isNew && !base.lessons.some((l) => l.id === g.id))
          problems.push(`${at}: la lección no existe en la unidad`);
        g.exercises.forEach((e, i) => {
          const ex = `${at} +${i + 1}`;
          if (!e.id || !AUTHORED_ID.test(e.id)) problems.push(`${ex}: falta el id propio`);
          if (e.personalData) problems.push(`${ex}: pide datos personales (P4)`);
          const format = mapFormatOf(e);
          if (!formats.has(format) && !GENERAL_PRACTICE.has(format))
            problems.push(`${ex}: el formato ${format} no evalúa ni practica ${codes.join(', ')}`);
          const targets = [...e.words, ...(e.concepts ?? [])];
          if (!targets.length) problems.push(`${ex}: sin palabras ni conceptos target`);
          for (const id of targets)
            if (!byId.has(id)) problems.push(`${ex}: palabra ${id} inexistente`);
          if (e.type === 'context_choice') {
            if (e.words.length) problems.push(`${ex}: context_choice va sin words (SRS v1)`);
            const p = e.payload as Extract<ExerciseDef['payload'], { type: 'context_choice' }>;
            if (!p.question.endsWith('?')) problems.push(`${ex}: la pregunta termina en «?»`);
            const key = JSON.stringify(p.stimulus);
            const prev = stimuli.get(p.stimulus.id);
            if (prev && prev !== key) problems.push(`${ex}: ${p.stimulus.id} con otro contenido`);
            stimuli.set(p.stimulus.id, key);
            if (!e.explanation) problems.push(`${ex}: falta la explicación con la evidencia`);
          }
          const own = new Set(
            targets.flatMap((id) => (byId.get(id) ? formsOf(byId.get(id)!) : [])),
          );
          const bad = [...new Set(englishTexts(e).flatMap(tokensOfText))].filter(
            (t) => !allowed(t, own),
          );
          if (bad.length)
            problems.push(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) problems.push(`${ex}: dato de contacto`);
          problems.push(...gradingProblems(e, ex));
        });
      }
      const unitTargetForms = new Set(
        [...s.appendices.flatMap((a) => a.exercises), ...s.lessons.flatMap((l) => l.exercises)]
          .flatMap((e) => [...e.words, ...(e.concepts ?? [])])
          .flatMap((id) => (byId.get(id) ? formsOf(byId.get(id)!) : [])),
      );
      for (const l of s.lessons) {
        const at = `${where} ${l.id}`;
        if (
          !new RegExp(
            `^${base.unit.position < 10 ? 'a1-u0' : 'a1-u'}${base.unit.position}-l\\d{2}$`,
          ).test(l.id)
        )
          problems.push(`${at}: id de lección inesperado`);
        if (base.lessons.some((x) => x.id === l.id)) problems.push(`${at}: la lección ya existe`);
        const n = l.exercises.length;
        if (n < 6 || n > 10) problems.push(`${at}: ${n} ejercicios (6–10)`);
        if (!l.intro?.explanation.trim() || (l.intro?.examples.length ?? 0) < 2)
          problems.push(`${at}: falta la introducción con dos ejemplos`);
        if ((l.takeaways?.length ?? 0) < 2) problems.push(`${at}: faltan los cierres`);
        if (!l.exercises.some((e) => e.skill === 'listening' && e.type !== 'context_choice'))
          problems.push(`${at}: sin escucha`);
        if (!l.exercises.slice(-2).every((e) => PRODUCTION.has(e.type)))
          problems.push(`${at}: los dos últimos ejercicios tienen que ser de producción`);
        const examples = (l.intro?.examples ?? []).flatMap((x) => tokensOfText(x.target));
        const ownForms = unitTargetForms;
        const badIntro = [...new Set(examples)].filter((t) => !allowed(t, ownForms));
        if (badIntro.length)
          problems.push(`${at}: ejemplos con vocabulario no enseñado: ${badIntro.join(', ')}`);
      }
      const practiced = new Set(
        [
          ...s.appendices.flatMap((a) => a.exercises),
          ...s.lessons.flatMap((l) => l.exercises),
        ].flatMap((e) => [...e.words, ...(e.concepts ?? [])]),
      );
      for (const w of s.words) if (!practiced.has(w.id)) problems.push(`${w.id}: no se practica`);
      for (const w of s.words) {
        const bad = tokensOfText(w.exampleEn).filter((t) => !allowed(t, unitTargetForms));
        if (bad.length)
          problems.push(`${w.id} (ejemplo): vocabulario no enseñado: ${bad.join(', ')}`);
      }
    }
  }
  return problems;
}
