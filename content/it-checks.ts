import { writingTaskProblems, writingTokens } from '../shared/writing';
import { AUTHORED_ID } from './ids-lock';
import { COURSES, CURRICULUM_PATH, type PathUnit } from './index';
import { IT_COURSE, IT_PATH } from './it-course';
import { IT_WRITING_TASKS } from './it/writing';
import { englishTexts, gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';

/**
 * Reglas del italiano A1 U13–U16 y A2 U1–U12 (content/it-course.ts, docs/IT_A1_A2.md) y de
 * su escritura (content/it/writing.ts). Las usan content/__tests__/it.test.ts y scripts/build-it-sql.ts
 * (que no escribe si hay problemas). Vacío = válido. Son las reglas del inglés B1/B2 adaptadas al
 * italiano:
 *
 * - Estándar de lección (introducción con dos ejemplos, cierres, 6–10 ejercicios, escucha, los dos
 *   últimos de producción), ids propios, 14–20 palabras por unidad, objetivo y gramática declarados.
 * - Palabras: ids nuevos con prefijo it-, traducción y ejemplo; ningún texto repite otro ni coincide
 *   con la traducción de otra palabra; todas se practican.
 * - Vocabulario: todo el italiano (respuestas, opciones, audio, estímulos, ejemplos y repasos
 *   generados) usa formas enseñadas antes (todo el piloto, las unidades nuevas anteriores y su
 *   apoyo), palabras ya introducidas en la unidad, nombres declarados o el apoyo de la unidad. Acepta
 *   el plural y el femenino regulares de lo enseñado (stanca, stanchi, amiche, stazioni); las formas
 *   verbales nuevas se enseñan o se declaran.
 * - Corrección del servidor (`gradeWithSpec`), context_choice sin `words`, con conceptos, pregunta
 *   con «?» y explicación; repasos generados sin cognados en traducciones.
 * - Vínculos: palabras publicadas del italiano (piloto) o propias de estas unidades.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const MIN_WORDS = 14;
const MAX_WORDS = 20;
const MAX_SUPPORT = 90;

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Fichas de un texto en italiano: letras (con tildes); apóstrofos y guiones separan (l'acqua → l, acqua). */
export const itTokens = (text: string): string[] =>
  text
    .normalize('NFC')
    .toLowerCase()
    .match(/\p{L}+/gu) ?? [];

/**
 * Formas de las que puede venir una ficha: ella misma, el singular y el masculino regulares
 * (amiche → amica → amico, bianchi → bianco, studenti → studente, stazioni → stazione, piccolo → piccola,
 * cameriera → cameriere, rosse → rossa → rosso, figli → figlio).
 */
export function itLemmas(token: string): string[] {
  const out = new Set([token]);
  const add = (s: string) => {
    if (s.length > 1) out.add(s);
  };
  const singular = new Set([token]);
  const stem = (n: number) => token.slice(0, -n);
  if (token.length > 3) {
    if (token.endsWith('chi')) singular.add(`${stem(3)}co`);
    if (token.endsWith('ghi')) singular.add(`${stem(3)}go`);
    if (token.endsWith('che')) singular.add(`${stem(3)}ca`);
    if (token.endsWith('ghe')) singular.add(`${stem(3)}ga`);
    if (token.endsWith('ci')) singular.add(`${stem(2)}co`);
    if (token.endsWith('i')) ['o', 'e', 'a', 'io'].forEach((v) => singular.add(`${stem(1)}${v}`));
    if (token.endsWith('e')) singular.add(`${stem(1)}a`);
  }
  for (const s of singular) {
    add(s);
    if (s.endsWith('a')) {
      add(`${s.slice(0, -1)}o`);
      add(`${s.slice(0, -1)}e`);
    }
    if (s.endsWith('o')) add(`${s.slice(0, -1)}a`);
  }
  return [...out];
}

const isItToken = (token: string, known: (form: string) => boolean) => itLemmas(token).some(known);

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(itTokens);

/** Texto en italiano de un ejercicio (sin las aclaraciones en español entre paréntesis). */
const itTexts = (e: ExerciseDef) => englishTexts(e);

function addPathForms(out: Set<string>, p: PathUnit) {
  p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
  p.unit.words.flatMap((w) => itTokens(w.exampleEn)).forEach((t) => out.add(t));
  for (const l of p.lessons) {
    for (const x of l.intro?.examples ?? []) itTokens(x.target).forEach((t) => out.add(t));
    for (const e of l.exercises)
      itTexts(e)
        .flatMap(itTokens)
        .forEach((t) => out.add(t));
  }
}

/** Orden de las unidades nuevas: A1 U13–U16 y después A2 U1–U12 (0…15). */
const ORDER = IT_COURSE.flatMap((l) =>
  l.units.map((u) => ({ level: l.level, position: u.unit.position, def: u })),
);
const indexOf = (level: string, position: number) =>
  ORDER.findIndex((o) => o.level === level && o.position === position);
const pathOf = (level: string, position: number) =>
  IT_PATH.find((p) => p.level === level && p.unit.position === position);

/** Formas enseñadas antes de la unidad nueva número `index` (0 = A1 U13): piloto y anteriores. */
export function itTaughtFormsBefore(index: number): Set<string> {
  const out = new Set<string>();
  for (const p of CURRICULUM_PATH) if (p.language === 'it') addPathForms(out, p);
  ORDER.slice(0, Math.max(0, index)).forEach((o) => {
    const p = pathOf(o.level, o.position);
    if (p) addPathForms(out, p);
    o.def.support.forEach((s) => out.add(s.toLowerCase()));
    o.def.names.forEach((s) => itTokens(s).forEach((t) => out.add(t)));
  });
  return out;
}

/** Todas las palabras de italiano ya cargadas (el piloto). */
const pilotWords = (): WordDef[] =>
  COURSES.find((c) => c.language === 'it')?.levels.flatMap((l) =>
    l.units.flatMap((u) => u.words),
  ) ?? [];

const cognate = (w: WordDef) =>
  [w.translation, ...(w.acceptedTranslations ?? [])].map(plain).includes(plain(w.text));

export function itProblems(): string[] {
  const problems: string[] = [];
  const existing = pilotWords();
  const byId = new Map(existing.map((w) => [w.id, w]));
  const linkable = new Set([
    ...existing.map((w) => w.id),
    ...IT_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words.map((w) => w.id))),
  ]);
  const texts = new Map(existing.map((w) => [plain(w.text), w.id]));
  const translations = new Map<string, string>();
  for (const w of existing)
    for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
      translations.set(plain(t), w.id);
  const stimuli = new Map<string, string>();

  for (const { level, first, units } of IT_COURSE)
    units.forEach(({ unit, names: unitNames, support }, ui) => {
      const where = `it ${level} U${unit.position}`;
      const index = indexOf(level, unit.position);
      if (unit.position !== first + ui) problems.push(`${where}: las unidades van seguidas`);
      if (!unit.objective?.trim()) problems.push(`${where}: falta el objetivo comunicativo`);
      if (!unit.grammar) problems.push(`${where}: falta la estructura principal`);
      if (unit.review?.status !== 'draft') problems.push(`${where}: tiene que estar en draft`);
      if (unit.lessons.length !== 5)
        problems.push(`${where}: ${unit.lessons.length} lecciones (5)`);
      const n = unit.words.length;
      if (n < MIN_WORDS || n > MAX_WORDS)
        problems.push(`${where}: ${n} palabras (${MIN_WORDS}–${MAX_WORDS})`);
      if (support.length > MAX_SUPPORT)
        problems.push(`${where}: ${support.length} formas de apoyo (máximo ${MAX_SUPPORT})`);

      // --- Palabras propias
      const own = new Map<string, WordDef>();
      for (const w of unit.words) {
        if (!w.id.startsWith('it-')) problems.push(`${w.id}: falta el prefijo it-`);
        if (byId.has(w.id) || own.has(w.id)) problems.push(`${w.id}: id de palabra repetido`);
        own.set(w.id, w);
        const same = texts.get(plain(w.text));
        if (same && same !== w.id) problems.push(`${w.id}: «${w.text}» ya es la palabra ${same}`);
        const asTranslation = translations.get(plain(w.text));
        if (asTranslation && asTranslation !== w.id && !cognate(w))
          problems.push(`${w.id}: «${w.text}» es la traducción de ${asTranslation}`);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])]) {
          const clash = texts.get(plain(t));
          if (clash && clash !== w.id && !cognate(w))
            problems.push(`${w.id}: la traducción «${t}» es el texto de ${clash}`);
          const twin = translations.get(plain(t));
          if (twin && twin !== w.id && own.has(twin))
            problems.push(`${w.id}: la traducción «${t}» repite la de ${twin}`);
        }
        if (!w.translation.trim() || !w.exampleEn.trim() || !w.exampleEs.trim())
          problems.push(`${w.id}: falta traducción o ejemplo`);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
          translations.set(plain(t), w.id);
      }
      for (const w of unit.words) {
        texts.set(plain(w.text), w.id);
        byId.set(w.id, w);
      }

      // --- Vocabulario de apoyo: usado, no enseñado ya, no repetido como palabra.
      const taught = itTaughtFormsBefore(index);
      const supportSet = new Set(support.map((s) => s.toLowerCase()));
      if (supportSet.size !== support.length) problems.push(`${where}: apoyo con formas repetidas`);
      const ownForms = new Set([...own.values()].flatMap(formsOf));
      for (const s of supportSet) {
        if (taught.has(s)) problems.push(`${where}: «${s}» ya está enseñada (sacarla del apoyo)`);
        if (ownForms.has(s))
          problems.push(`${where}: «${s}» es palabra de la unidad (sacarla del apoyo)`);
      }

      const names = new Set(unitNames.flatMap(itTokens));
      const allowed = (t: string, forms: ReadonlySet<string>) =>
        isItToken(t, (c) => taught.has(c) || forms.has(c) || names.has(c) || supportSet.has(c));
      const introduced = new Set<string>();
      const introducedForms = new Set<string>();
      const unitTokens = new Set<string>();
      const stimulusPrefix = `it.stim.${level.toLowerCase()}-u${unit.position}-`;

      unit.lessons.forEach((lesson, li) => {
        const at = `${where} L${li + 1} «${lesson.title}»`;
        for (const e of lesson.exercises)
          for (const id of [...e.words, ...(e.concepts ?? [])])
            if (own.has(id) && !introduced.has(id)) {
              introduced.add(id);
              formsOf(own.get(id)!).forEach((t) => introducedForms.add(t));
            }

        lesson.exercises.forEach((e, ei) => {
          const ex = `${at} e${ei + 1}`;
          if (!e.id || !AUTHORED_ID.test(e.id) || !e.id.startsWith('it.'))
            problems.push(`${ex}: falta el id propio`);
          if (e.personalData) problems.push(`${ex}: muestra o pide datos personales`);
          const targets = [...e.words, ...(e.concepts ?? [])];
          if (!targets.length) problems.push(`${ex}: sin palabras ni conceptos target`);
          for (const id of targets) {
            if (!byId.has(id)) problems.push(`${ex}: palabra ${id} inexistente`);
            else if (!linkable.has(id)) problems.push(`${ex}: enlaza ${id}, que no es de italiano`);
          }
          if (e.type === 'context_choice') {
            if (e.words.length) problems.push(`${ex}: context_choice va sin words (SRS v1)`);
            const p = e.payload as Extract<ExerciseDef['payload'], { type: 'context_choice' }>;
            if (!p.question.endsWith('?')) problems.push(`${ex}: la pregunta termina en «?»`);
            if (!p.stimulus.id.startsWith(stimulusPrefix))
              problems.push(`${ex}: el estímulo ${p.stimulus.id} no es de la unidad`);
            const key = JSON.stringify(p.stimulus);
            const prev = stimuli.get(p.stimulus.id);
            if (prev && prev !== key) problems.push(`${ex}: ${p.stimulus.id} con otro contenido`);
            stimuli.set(p.stimulus.id, key);
            if (!e.explanation) problems.push(`${ex}: falta la explicación con la evidencia`);
            if (
              p.stimulus.kind === 'listening' &&
              (p.stimulus.rate < 0.75 || p.stimulus.rate > 0.9)
            )
              problems.push(`${ex}: velocidad del audio fuera de 0.75–0.9`);
          }
          const tokens = [...new Set(itTexts(e).flatMap(itTokens))];
          tokens.forEach((t) => unitTokens.add(t));
          const bad = tokens.filter((t) => !allowed(t, introducedForms));
          if (bad.length)
            problems.push(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) problems.push(`${ex}: dato de contacto`);
          problems.push(...gradingProblems(e, ex));
        });

        const introTokens = [
          ...new Set((lesson.intro?.examples ?? []).flatMap((x) => itTokens(x.target))),
        ];
        introTokens.forEach((t) => unitTokens.add(t));
        const badIntro = introTokens.filter((t) => !allowed(t, introducedForms));
        if (badIntro.length)
          problems.push(`${at}: ejemplos con vocabulario no enseñado: ${badIntro.join(', ')}`);

        // --- Estándar de lección
        const count = lesson.exercises.length;
        if (count < 6 || count > 10) problems.push(`${at}: ${count} ejercicios (6–10)`);
        if (!lesson.intro?.explanation.trim() || (lesson.intro?.examples.length ?? 0) < 2)
          problems.push(`${at}: falta la introducción con dos ejemplos`);
        if ((lesson.takeaways?.length ?? 0) < 2) problems.push(`${at}: faltan los cierres`);
        if (!lesson.exercises.some((e) => e.type === 'listen_choice'))
          problems.push(`${at}: sin escucha`);
        if (!lesson.exercises.slice(-2).every((e) => PRODUCTION.has(e.type)))
          problems.push(`${at}: los dos últimos ejercicios tienen que ser de producción`);
      });

      for (const id of own.keys())
        if (!introduced.has(id)) problems.push(`${where}: la palabra ${id} no se practica`);

      // Ejemplos de las palabras, gramática y consolidación generada: vocabulario de toda la unidad.
      const generated = pathOf(level, unit.position);
      if (generated?.lessons.length !== 10)
        problems.push(`${where}: el camino tiene ${generated?.lessons.length} lecciones (10)`);
      const extra = [
        ...unit.words.map((w) => ({ at: `${w.id} (ejemplo)`, texts: [w.exampleEn] })),
        ...(unit.grammar?.examples ?? []).map((x) => ({
          at: `${where} gramática`,
          texts: [x.target],
        })),
        ...(generated?.lessons ?? [])
          .filter((l) => l.kind !== 'lesson')
          .flatMap((l) =>
            l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: itTexts(e) })),
          ),
      ];
      for (const { at, texts: t } of extra) {
        const toks = [...new Set(t.flatMap(itTokens))];
        toks.forEach((x) => unitTokens.add(x));
        const bad = toks.filter((x) => !allowed(x, ownForms));
        if (bad.length) problems.push(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
      }

      // Repasos generados: sin traducir cognados (hotel → hotel no enseña nada).
      for (const l of generated?.lessons ?? [])
        if (l.kind !== 'lesson')
          l.exercises.forEach((e, i) => {
            if (
              ['translation_choice', 'translate_write', 'complete_word', 'match_pairs'].includes(
                e.type,
              ) &&
              e.words.some((id) => {
                const w = byId.get(id);
                return w && cognate(w);
              })
            )
              problems.push(`${l.id} e${i + 1}: el repaso traduce un cognado`);
          });

      const used = new Set([...unitTokens].flatMap((t) => itLemmas(t)));
      for (const s of supportSet)
        if (!used.has(s)) problems.push(`${where}: la forma de apoyo «${s}» no se usa`);
    });
  return problems;
}

/** Unidad nueva (índice en ORDER) o del piloto (-1) de la lección tras la que se ofrece una tarea. */
function taughtForLesson(lesson: string): Set<string> | null {
  const m = /^it-(a[12])-u(\d{2})-/.exec(lesson);
  if (!m) return null;
  const level = m[1]!.toUpperCase();
  const position = Number(m[2]);
  const index = indexOf(level, position);
  if (index >= 0) return itTaughtFormsBefore(index + 1);
  // Piloto (A1 U1–U12): lo enseñado hasta esa unidad, incluida.
  const out = new Set<string>();
  for (const p of CURRICULUM_PATH)
    if (p.language === 'it' && p.level === 'A1' && p.unit.position <= position)
      addPathForms(out, p);
  return out;
}

/** Problemas de la escritura: definición, lección existente y vocabulario enseñado. */
export function itWritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(
    [...CURRICULUM_PATH.filter((p) => p.language === 'it'), ...IT_PATH].flatMap((p) =>
      p.lessons.map((l) => l.id),
    ),
  );
  const ids = new Set<string>();
  for (const task of IT_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (task.language !== 'it' || !/^it\.a[12]\.wt\./.test(task.id))
      problems.push(`${task.id}: no es una tarea de italiano A1/A2`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe`);
      continue;
    }
    if (!task.id.startsWith(`it.${task.lesson.slice(3, 5)}.`))
      problems.push(`${task.id}: el nivel del id no es el de su lección`);
    const taught = taughtForLesson(task.lesson)!;
    const glossary = new Set((task.glossary ?? []).flatMap((g) => writingTokens(g.term)));
    const bad = [...new Set([task.model, ...task.prompts].flatMap(itTokens))].filter(
      (t) => !glossary.has(t) && !isItToken(t, (c) => taught.has(c)),
    );
    if (bad.length) problems.push(`${task.id}: vocabulario no enseñado: ${bad.join(', ')}`);
  }
  return problems;
}
