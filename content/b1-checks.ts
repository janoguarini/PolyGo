import { canonicalForm } from '../shared/answers';
import { writingTaskProblems, writingTokens } from '../shared/writing';
import { A2_EXPANSION } from './a2-expansion';
import { a2Lemmas, taughtFormsBefore } from './a2-expansion-checks';
import { B1, B1_PATH } from './b1';
import { tokensOfText } from './comprehension';
import { EN_B1_WRITING_TASKS } from './en/b1/writing';
import { AUTHORED_ID } from './ids-lock';
import { COURSES, type PathUnit } from './index';
import { PLANNED_PATH } from './planned';
import { SUPPLEMENT_PATH } from './supplement';
import { englishTexts, gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';

/**
 * Reglas de inglés B1 (content/b1.ts, docs/B1_EN.md) y de su escritura (content/en/b1/writing.ts). Las
 * usan content/__tests__/b1.test.ts y scripts/build-b1-sql.ts (que no escribe si hay problemas).
 * Vacío = válido. Son las del A2 nuevo (content/a2-expansion-checks.ts) con dos diferencias:
 *
 * - Límite de vocabulario: lo enseñado antes (A1 y A2 completos, las unidades B1 anteriores con su
 *   vocabulario de apoyo), las palabras ya introducidas en la unidad, los nombres declarados y el
 *   vocabulario de apoyo de la unidad (`support`). Cada forma de apoyo tiene que usarse y no puede
 *   estar enseñada ya (la lista queda mínima y revisable).
 * - Formas: además de -ing, -ed, -er y -est, el adverbio en -ly y las contracciones (could → couldn't,
 *   would → I'd) de lo enseñado.
 *
 * Vínculos (`words`, `concepts`): palabras propias del B1 o publicadas (COURSES) o del A2 nuevo
 * (U13–U17). Las del cierre de A1 y A1 U13/U14 no: publicar B1 no puede depender de ellas.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const MIN_WORDS = 15;
const MAX_WORDS = 22;
const MAX_SUPPORT = 70;

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Contracciones que la corrección no expande pero que el texto puede usar (forma larga enseñada). */
const CONTRACTION_SUFFIXES: [suffix: string, long: string[]][] = [
  ["n't", ['not']],
  ["'d", ['would', 'had']],
  ["'ve", ['have']],
  ["'ll", ['will']],
  ["'re", ['are']],
  ["'s", ['is', 'has']],
  ["'m", ['am']],
];

/** Lemas posibles de una forma B1: los del A2 y el adverbio en -ly. */
export function b1Lemmas(token: string): string[] {
  const out = new Set(a2Lemmas(token));
  if (token.endsWith('ly') && token.length > 4) {
    const stem = token.slice(0, -2);
    out.add(stem);
    if (stem.endsWith('i')) out.add(`${stem.slice(0, -1)}y`);
    if (token.endsWith('bly')) out.add(`${token.slice(0, -1)}e`);
    if (stem.endsWith('al')) out.add(stem.slice(0, -2));
  }
  return [...out];
}

export function isB1Token(token: string, known: (lemma: string) => boolean): boolean {
  if (b1Lemmas(token).some(known)) return true;
  const long = canonicalForm(token);
  if (long !== token && long.includes(' '))
    return long.split(' ').every((t) => b1Lemmas(t).some(known));
  for (const [suffix, longs] of CONTRACTION_SUFFIXES) {
    if (!token.endsWith(suffix) || token.length <= suffix.length) continue;
    let stem = token.slice(0, -suffix.length);
    if (suffix === "n't") {
      if (stem === 'ca') stem = 'can';
      else if (stem === 'wo') stem = 'will';
      else if (stem === 'sha') stem = 'shall';
    }
    if (b1Lemmas(stem).some(known) && longs.some(known)) return true;
  }
  return false;
}

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(tokensOfText);

function addPathForms(out: Set<string>, p: PathUnit) {
  p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
  p.unit.words.flatMap((w) => tokensOfText(w.exampleEn)).forEach((t) => out.add(t));
  for (const l of p.lessons) {
    for (const x of l.intro?.examples ?? []) tokensOfText(x.target).forEach((t) => out.add(t));
    for (const e of l.exercises)
      englishTexts(e)
        .flatMap(tokensOfText)
        .forEach((t) => out.add(t));
  }
}

/** Formas enseñadas antes de la unidad `unit` del B1: A1 y A2 completos y las unidades B1 anteriores. */
export function b1TaughtFormsBefore(unit: number): Set<string> {
  const out = taughtFormsBefore(B1.language, Number.POSITIVE_INFINITY);
  for (const p of B1_PATH) if (p.unit.position < unit) addPathForms(out, p);
  for (const u of B1.units)
    if (u.unit.position < unit) u.support.forEach((s) => out.add(s.toLowerCase()));
  return out;
}

/** Todas las palabras del idioma antes del B1 (para ids, textos y traducciones repetidos). */
function wordsBeforeB1(language: string): WordDef[] {
  const course = COURSES.find((c) => c.language === language);
  return [
    ...(course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? []),
    ...[...PLANNED_PATH, ...SUPPLEMENT_PATH]
      .filter((p) => p.language === language)
      .flatMap((p) => p.unit.words),
    ...A2_EXPANSION.filter((c) => c.language === language).flatMap((c) =>
      c.units.flatMap((u) => u.unit.words),
    ),
  ];
}

export function b1Problems(): string[] {
  const problems: string[] = [];
  const { language, level, units } = B1;
  const existing = wordsBeforeB1(language);
  const byId = new Map(existing.map((w) => [w.id, w]));
  // Enlazables: publicadas (COURSES), el A2 nuevo (se publica antes que B1) y las propias del B1.
  const linkable = new Set([
    ...(COURSES.find((c) => c.language === language)?.levels.flatMap((l) =>
      l.units.flatMap((u) => u.words.map((w) => w.id)),
    ) ?? []),
    ...A2_EXPANSION.filter((c) => c.language === language).flatMap((c) =>
      c.units.flatMap((u) => u.unit.words.map((w) => w.id)),
    ),
    ...units.flatMap((u) => u.unit.words.map((w) => w.id)),
  ]);
  const texts = new Map(existing.map((w) => [plain(w.text), w.id]));
  const translations = new Map<string, string>();
  for (const w of existing)
    for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
      translations.set(plain(t), w.id);
  const stimuli = new Map<string, string>();

  units.forEach(({ unit, names: unitNames, support }, ui) => {
    const where = `${language} ${level} U${unit.position}`;
    if (unit.position !== ui + 1) problems.push(`${where}: las unidades van seguidas desde U1`);
    if (!unit.objective?.trim()) problems.push(`${where}: falta el objetivo comunicativo`);
    if (!unit.grammar) problems.push(`${where}: falta la estructura principal`);
    if (unit.review?.status !== 'draft') problems.push(`${where}: tiene que estar en draft`);
    const n = unit.words.length;
    if (n < MIN_WORDS || n > MAX_WORDS)
      problems.push(`${where}: ${n} palabras (${MIN_WORDS}–${MAX_WORDS})`);
    if (support.length > MAX_SUPPORT)
      problems.push(`${where}: ${support.length} formas de apoyo (máximo ${MAX_SUPPORT})`);

    // --- Palabras propias
    const own = new Map<string, WordDef>();
    for (const w of unit.words) {
      if (!w.id.startsWith(`${language}-`)) problems.push(`${w.id}: falta el prefijo ${language}-`);
      if (byId.has(w.id) || own.has(w.id)) problems.push(`${w.id}: id de palabra repetido`);
      own.set(w.id, w);
      const same = texts.get(plain(w.text));
      if (same && same !== w.id) problems.push(`${w.id}: «${w.text}» ya es la palabra ${same}`);
      const asTranslation = translations.get(plain(w.text));
      if (asTranslation && asTranslation !== w.id)
        problems.push(`${w.id}: «${w.text}» es la traducción de ${asTranslation}`);
      for (const t of [w.translation, ...(w.acceptedTranslations ?? [])]) {
        const clash = texts.get(plain(t));
        if (clash && clash !== w.id)
          problems.push(`${w.id}: la traducción «${t}» es el texto de ${clash}`);
        const twin = translations.get(plain(t));
        if (twin && twin !== w.id && own.has(twin))
          problems.push(`${w.id}: la traducción «${t}» repite la de ${twin}`);
      }
      if (!w.ipa) problems.push(`${w.id}: falta la IPA`);
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
    const taught = b1TaughtFormsBefore(unit.position);
    const supportSet = new Set(support.map((s) => s.toLowerCase()));
    if (supportSet.size !== support.length) problems.push(`${where}: apoyo con formas repetidas`);
    const ownForms = new Set([...own.values()].flatMap(formsOf));
    for (const s of supportSet) {
      if (taught.has(s)) problems.push(`${where}: «${s}» ya está enseñada (sacarla del apoyo)`);
      if (ownForms.has(s))
        problems.push(`${where}: «${s}» es palabra de la unidad (sacarla del apoyo)`);
    }

    const names = new Set(unitNames.map((x) => x.toLowerCase()));
    const allowed = (t: string, forms: ReadonlySet<string>) =>
      isB1Token(t, (c) => taught.has(c) || forms.has(c) || names.has(c) || supportSet.has(c));
    const introduced = new Set<string>();
    const introducedForms = new Set<string>();
    const unitTokens = new Set<string>();

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
        if (!e.id || !AUTHORED_ID.test(e.id)) problems.push(`${ex}: falta el id propio`);
        if (e.personalData) problems.push(`${ex}: muestra o pide datos personales`);
        const targets = [...e.words, ...(e.concepts ?? [])];
        if (!targets.length) problems.push(`${ex}: sin palabras ni conceptos target`);
        for (const id of targets) {
          if (!byId.has(id)) problems.push(`${ex}: palabra ${id} inexistente`);
          else if (!linkable.has(id)) problems.push(`${ex}: enlaza ${id}, que no está publicada`);
        }
        if (e.type === 'context_choice') {
          if (e.words.length) problems.push(`${ex}: context_choice va sin words (SRS v1)`);
          const p = e.payload as Extract<ExerciseDef['payload'], { type: 'context_choice' }>;
          if (!p.question.endsWith('?')) problems.push(`${ex}: la pregunta termina en «?»`);
          if (!p.stimulus.id.startsWith(`${language}.stim.b1-u${unit.position}-`))
            problems.push(`${ex}: el estímulo ${p.stimulus.id} no es de la unidad`);
          const key = JSON.stringify(p.stimulus);
          const prev = stimuli.get(p.stimulus.id);
          if (prev && prev !== key) problems.push(`${ex}: ${p.stimulus.id} con otro contenido`);
          stimuli.set(p.stimulus.id, key);
          if (!e.explanation) problems.push(`${ex}: falta la explicación con la evidencia`);
          if (p.stimulus.kind === 'listening' && (p.stimulus.rate < 0.75 || p.stimulus.rate > 1))
            problems.push(`${ex}: velocidad del audio fuera de 0.75–1`);
        }
        const tokens = [...new Set(englishTexts(e).flatMap(tokensOfText))];
        tokens.forEach((t) => unitTokens.add(t));
        const bad = tokens.filter((t) => !allowed(t, introducedForms));
        if (bad.length) problems.push(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
        const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
        if (CONTACT.test(text)) problems.push(`${ex}: dato de contacto`);
        problems.push(...gradingProblems(e, ex));
      });

      const introTokens = [
        ...new Set((lesson.intro?.examples ?? []).flatMap((x) => tokensOfText(x.target))),
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

    // Ejemplos de las palabras y consolidación generada: vocabulario de toda la unidad.
    const generated = B1_PATH.find((p) => p.unit.position === unit.position);
    if (generated?.lessons.length !== 10)
      problems.push(`${where}: el camino tiene ${generated?.lessons.length} lecciones (10)`);
    const extra = [
      ...unit.words.map((w) => ({ at: `${w.id} (ejemplo)`, texts: [w.exampleEn] })),
      ...(generated?.lessons ?? [])
        .filter((l) => l.kind !== 'lesson')
        .flatMap((l) =>
          l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: englishTexts(e) })),
        ),
    ];
    for (const { at, texts: t } of extra) {
      const toks = [...new Set(t.flatMap(tokensOfText))];
      toks.forEach((x) => unitTokens.add(x));
      const bad = toks.filter((x) => !allowed(x, ownForms));
      if (bad.length) problems.push(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
    }

    const used = new Set([...unitTokens].flatMap((t) => [t, ...b1Lemmas(t)]));
    for (const s of supportSet)
      if (!used.has(s)) problems.push(`${where}: la forma de apoyo «${s}» no se usa`);
  });
  return problems;
}

/** Unidad del B1 de la lección tras la que se ofrece una tarea (b1-u03-l05 → 3). */
const unitOfLesson = (lesson: string) => Number(/^b1-u(\d{2})-/.exec(lesson)?.[1] ?? NaN);

/** Problemas de la escritura B1: definición, lección existente y vocabulario enseñado. */
export function b1WritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(B1_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
  const ids = new Set<string>();
  for (const task of EN_B1_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (!task.id.startsWith('en.b1.wt.')) problems.push(`${task.id}: no es una tarea del B1`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe en el B1`);
      continue;
    }
    // Lo enseñado hasta esa unidad (incluida, con su apoyo): la tarea se ofrece al terminar su lección.
    const taught = b1TaughtFormsBefore(unitOfLesson(task.lesson) + 1);
    const glossary = new Set((task.glossary ?? []).flatMap((g) => writingTokens(g.term)));
    const bad = [...new Set([task.model, ...task.prompts].flatMap(tokensOfText))].filter(
      (t) => !glossary.has(t) && !isB1Token(t, (c) => taught.has(c)),
    );
    if (bad.length) problems.push(`${task.id}: vocabulario no enseñado: ${bad.join(', ')}`);
  }
  return problems;
}
