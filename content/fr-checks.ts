import { writingTaskProblems, writingTokens } from '../shared/writing';
import { FR_COURSE, FR_PATH } from './fr-course';
import { FR_WRITING_TASKS } from './fr/writing';
import { AUTHORED_ID } from './ids-lock';
import type { PathUnit } from './index';
import { englishTexts, gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';

/**
 * Reglas del francés A1 U1–U17 y A2 U1–U13 (content/fr-course.ts, docs/FR_A1_A2.md) y de su escritura
 * (content/fr/writing.ts). Las usan content/__tests__/fr.test.ts y scripts/build-fr-sql.ts (que no
 * escribe si hay problemas). Vacío = válido. Son las reglas del italiano adaptadas al francés, que no
 * tiene piloto:
 *
 * - Estándar de lección (introducción con dos ejemplos, cierres, 6–10 ejercicios, escucha, los dos
 *   últimos de producción), ids propios, 14–20 palabras por unidad, objetivo y gramática declarados.
 * - Palabras: ids con prefijo fr-, traducción y ejemplo; ningún texto repite otro ni coincide con la
 *   traducción de otra palabra; todas se practican.
 * - Vocabulario: todo el francés (respuestas, opciones, audio, estímulos, ejemplos y repasos generados)
 *   usa formas enseñadas antes (las unidades anteriores y su apoyo), palabras ya introducidas en la
 *   unidad, nombres declarados o el apoyo de la unidad. La elisión y los guiones separan (j'ai → j, ai;
 *   qu'est-ce que → qu, est, ce, que). Acepta el plural y el femenino regulares de lo enseñado
 *   (amies, grandes, italienne, vendeuse, sportive, chevaux); las formas verbales nuevas se enseñan o
 *   se declaran.
 * - Corrección del servidor (`gradeWithSpec`), context_choice sin `words`, con conceptos, pregunta con
 *   «?» y explicación; repasos generados sin cognados en traducciones.
 * - Vínculos: sólo palabras del francés.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const MIN_WORDS = 14;
const MAX_WORDS = 20;
/**
 * Palabras cuyo texto coincide con la traducción de otra sólo si se ignoran las tildes: «très»
 * (muy) frente a «tres» (trois). En pantalla se distinguen y los repasos nunca las ponen como
 * opciones juntas, así que no son un choque real.
 */
const ACCENT_ONLY_CLASHES = new Set(['fr-tres']);

/** Marcador de redacción ('fr.ex.' + 'new'), armado por partes para que content:ids no lo reemplace. */
const ID_PLACEHOLDER = ['fr', 'ex', 'new'].join('.');

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

/** Fichas de un texto en francés: letras (con tildes); apóstrofos y guiones separan (l'eau → l, eau). */
export const frTokens = (text: string): string[] =>
  text
    .normalize('NFC')
    .toLowerCase()
    .match(/\p{L}+/gu) ?? [];

/**
 * Formas de las que puede venir una ficha: ella misma, el singular y el masculino regulares
 * (amies → amie → ami, grandes → grand, chevaux → cheval, italienne → italien, vendeuse → vendeur,
 * sportive → sportif, boulangère → boulanger, heureuse → heureux, bonne → bon, gentille → gentil) y el
 * femenino de una forma enseñada en masculino (ami → amie).
 */
export function frLemmas(token: string): string[] {
  const out = new Set([token]);
  const add = (s: string) => {
    if (s.length > 1) out.add(s);
  };
  const singular = new Set([token]);
  if (token.length > 3) {
    if (token.endsWith('aux')) singular.add(`${token.slice(0, -3)}al`);
    if (token.endsWith('s') || token.endsWith('x')) singular.add(token.slice(0, -1));
  }
  for (const s of singular) {
    add(s);
    add(`${s}e`);
    if (s.length <= 3) continue;
    const swap = (from: string, to: string) => {
      if (s.endsWith(from)) add(`${s.slice(0, -from.length)}${to}`);
    };
    swap('e', '');
    swap('euse', 'eur');
    swap('euse', 'eux');
    swap('trice', 'teur');
    swap('ive', 'if');
    swap('enne', 'en');
    swap('onne', 'on');
    swap('elle', 'el');
    swap('ette', 'et');
    swap('ère', 'er');
    swap('lle', 'l');
  }
  return [...out];
}

const isFrToken = (token: string, known: (form: string) => boolean) => frLemmas(token).some(known);

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(frTokens);

/** Texto en francés de un ejercicio (sin las aclaraciones en español entre paréntesis). */
const frTexts = (e: ExerciseDef) => englishTexts(e);

function addPathForms(out: Set<string>, p: PathUnit) {
  p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
  p.unit.words.flatMap((w) => frTokens(w.exampleEn)).forEach((t) => out.add(t));
  for (const l of p.lessons) {
    for (const x of l.intro?.examples ?? []) frTokens(x.target).forEach((t) => out.add(t));
    for (const e of l.exercises)
      frTexts(e)
        .flatMap(frTokens)
        .forEach((t) => out.add(t));
  }
}

/** Orden de las unidades: A1 U1–U17 y después A2 U1–U13 (0…29). */
const ORDER = FR_COURSE.flatMap((l) =>
  l.units.map((u) => ({ level: l.level, position: u.unit.position, def: u })),
);
const indexOf = (level: string, position: number) =>
  ORDER.findIndex((o) => o.level === level && o.position === position);
const pathOf = (level: string, position: number) =>
  FR_PATH.find((p) => p.level === level && p.unit.position === position);

/** Formas enseñadas antes de la unidad número `index` (0 = A1 U1): las unidades anteriores. */
export function frTaughtFormsBefore(index: number): Set<string> {
  const out = new Set<string>();
  ORDER.slice(0, Math.max(0, index)).forEach((o) => {
    const p = pathOf(o.level, o.position);
    if (p) addPathForms(out, p);
    o.def.support.forEach((s) => frTokens(s).forEach((t) => out.add(t)));
    o.def.names.forEach((s) => frTokens(s).forEach((t) => out.add(t)));
  });
  return out;
}

const cognate = (w: WordDef) =>
  [w.translation, ...(w.acceptedTranslations ?? [])].map(plain).includes(plain(w.text));

/** Problemas de las unidades. Con `only` (p. ej. «fr A1 U5»), sólo los de esa unidad. */
export function frProblems(only?: string): string[] {
  const problems: string[] = [];
  const byId = new Map<string, WordDef>();
  const linkable = new Set(
    FR_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words.map((w) => w.id))),
  );
  const texts = new Map<string, string>();
  const translations = new Map<string, string>();
  const stimuli = new Map<string, string>();

  for (const { level, first, units } of FR_COURSE)
    units.forEach(({ unit, names: unitNames, support }, ui) => {
      const where = `fr ${level} U${unit.position}`;
      const report = (p: string) => {
        if (!only || where === only) problems.push(p);
      };
      const index = indexOf(level, unit.position);
      if (unit.position !== first + ui) report(`${where}: las unidades van seguidas`);
      if (!unit.objective?.trim()) report(`${where}: falta el objetivo comunicativo`);
      if (!unit.grammar) report(`${where}: falta la estructura principal`);
      if (unit.review?.status !== 'draft') report(`${where}: tiene que estar en draft`);
      if (unit.lessons.length !== 5) report(`${where}: ${unit.lessons.length} lecciones (5)`);
      const n = unit.words.length;
      if (n < MIN_WORDS || n > MAX_WORDS)
        report(`${where}: ${n} palabras (${MIN_WORDS}–${MAX_WORDS})`);
      if (support.length > MAX_SUPPORT)
        report(`${where}: ${support.length} formas de apoyo (máximo ${MAX_SUPPORT})`);

      // --- Palabras propias
      const own = new Map<string, WordDef>();
      for (const w of unit.words) {
        if (!w.id.startsWith('fr-')) report(`${w.id}: falta el prefijo fr-`);
        if (byId.has(w.id) || own.has(w.id)) report(`${w.id}: id de palabra repetido`);
        own.set(w.id, w);
        const same = texts.get(plain(w.text));
        if (same && same !== w.id) report(`${w.id}: «${w.text}» ya es la palabra ${same}`);
        const asTranslation = translations.get(plain(w.text));
        if (
          asTranslation &&
          asTranslation !== w.id &&
          !cognate(w) &&
          !ACCENT_ONLY_CLASHES.has(w.id)
        )
          report(`${w.id}: «${w.text}» es la traducción de ${asTranslation}`);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])]) {
          const clash = texts.get(plain(t));
          if (clash && clash !== w.id && !cognate(w))
            report(`${w.id}: la traducción «${t}» es el texto de ${clash}`);
          const twin = translations.get(plain(t));
          if (twin && twin !== w.id && own.has(twin))
            report(`${w.id}: la traducción «${t}» repite la de ${twin}`);
        }
        if (!w.translation.trim() || !w.exampleEn.trim() || !w.exampleEs.trim())
          report(`${w.id}: falta traducción o ejemplo`);
        if (w.ipa) report(`${w.id}: sin IPA (la pronunciación se explica en las lecciones)`);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
          translations.set(plain(t), w.id);
      }
      for (const w of unit.words) {
        texts.set(plain(w.text), w.id);
        byId.set(w.id, w);
      }

      // --- Vocabulario de apoyo: usado, no enseñado ya, no repetido como palabra.
      const taught = frTaughtFormsBefore(index);
      const supportSet = new Set(support.map((s) => s.normalize('NFC').toLowerCase()));
      if (supportSet.size !== support.length) report(`${where}: apoyo con formas repetidas`);
      const ownForms = new Set([...own.values()].flatMap(formsOf));
      for (const s of supportSet) {
        if (frTokens(s).join(' ') !== s)
          report(`${where}: «${s}» en el apoyo tiene que ser una sola forma (sin apóstrofo)`);
        if (taught.has(s)) report(`${where}: «${s}» ya está enseñada (sacarla del apoyo)`);
        if (ownForms.has(s)) report(`${where}: «${s}» es palabra de la unidad (sacarla del apoyo)`);
      }

      const names = new Set(unitNames.flatMap(frTokens));
      const allowed = (t: string, forms: ReadonlySet<string>) =>
        isFrToken(t, (c) => taught.has(c) || forms.has(c) || names.has(c) || supportSet.has(c));
      const introduced = new Set<string>();
      const introducedForms = new Set<string>();
      const unitTokens = new Set<string>();
      const stimulusPrefix = `fr.stim.${level.toLowerCase()}-u${unit.position}-`;

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
          if (
            !e.id ||
            !(AUTHORED_ID.test(e.id) || e.id === ID_PLACEHOLDER) ||
            !e.id.startsWith('fr.')
          )
            report(`${ex}: falta el id propio`);
          if (e.personalData) report(`${ex}: muestra o pide datos personales`);
          const targets = [...e.words, ...(e.concepts ?? [])];
          if (!targets.length) report(`${ex}: sin palabras ni conceptos target`);
          for (const id of targets) {
            if (!byId.has(id)) report(`${ex}: palabra ${id} inexistente`);
            else if (!linkable.has(id)) report(`${ex}: enlaza ${id}, que no es de francés`);
          }
          if (e.type === 'context_choice') {
            if (e.words.length) report(`${ex}: context_choice va sin words (SRS v1)`);
            const p = e.payload as Extract<ExerciseDef['payload'], { type: 'context_choice' }>;
            if (!p.question.endsWith('?')) report(`${ex}: la pregunta termina en «?»`);
            if (!p.stimulus.id.startsWith(stimulusPrefix))
              report(`${ex}: el estímulo ${p.stimulus.id} no es de la unidad`);
            const key = JSON.stringify(p.stimulus);
            const prev = stimuli.get(p.stimulus.id);
            if (prev && prev !== key) report(`${ex}: ${p.stimulus.id} con otro contenido`);
            stimuli.set(p.stimulus.id, key);
            if (!e.explanation) report(`${ex}: falta la explicación con la evidencia`);
            if (
              p.stimulus.kind === 'listening' &&
              (p.stimulus.rate < 0.75 || p.stimulus.rate > 0.9)
            )
              report(`${ex}: velocidad del audio fuera de 0.75–0.9`);
          }
          const tokens = [...new Set(frTexts(e).flatMap(frTokens))];
          tokens.forEach((t) => unitTokens.add(t));
          const bad = tokens.filter((t) => !allowed(t, introducedForms));
          if (bad.length) report(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) report(`${ex}: dato de contacto`);
          gradingProblems(e, ex).forEach(report);
        });

        const introTokens = [
          ...new Set((lesson.intro?.examples ?? []).flatMap((x) => frTokens(x.target))),
        ];
        introTokens.forEach((t) => unitTokens.add(t));
        const badIntro = introTokens.filter((t) => !allowed(t, introducedForms));
        if (badIntro.length)
          report(`${at}: ejemplos con vocabulario no enseñado: ${badIntro.join(', ')}`);

        // --- Estándar de lección
        const count = lesson.exercises.length;
        if (count < 6 || count > 10) report(`${at}: ${count} ejercicios (6–10)`);
        if (!lesson.intro?.explanation.trim() || (lesson.intro?.examples.length ?? 0) < 2)
          report(`${at}: falta la introducción con dos ejemplos`);
        if ((lesson.takeaways?.length ?? 0) < 2) report(`${at}: faltan los cierres`);
        if (!lesson.exercises.some((e) => e.type === 'listen_choice')) report(`${at}: sin escucha`);
        if (!lesson.exercises.slice(-2).every((e) => PRODUCTION.has(e.type)))
          report(`${at}: los dos últimos ejercicios tienen que ser de producción`);
      });

      for (const id of own.keys())
        if (!introduced.has(id)) report(`${where}: la palabra ${id} no se practica`);

      // Ejemplos de las palabras, gramática y consolidación generada: vocabulario de toda la unidad.
      const generated = pathOf(level, unit.position);
      if (generated?.lessons.length !== 10)
        report(`${where}: el camino tiene ${generated?.lessons.length} lecciones (10)`);
      const extra = [
        ...unit.words.map((w) => ({ at: `${w.id} (ejemplo)`, texts: [w.exampleEn] })),
        ...(unit.grammar?.examples ?? []).map((x) => ({
          at: `${where} gramática`,
          texts: [x.target],
        })),
        ...(generated?.lessons ?? [])
          .filter((l) => l.kind !== 'lesson')
          .flatMap((l) =>
            l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: frTexts(e) })),
          ),
      ];
      for (const { at, texts: t } of extra) {
        const toks = [...new Set(t.flatMap(frTokens))];
        toks.forEach((x) => unitTokens.add(x));
        const bad = toks.filter((x) => !allowed(x, ownForms));
        if (bad.length) report(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
      }

      // Repasos generados: sin traducir cognados (hôtel → hotel no enseña nada).
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
              report(`${l.id} e${i + 1}: el repaso traduce un cognado`);
          });

      const used = new Set([...unitTokens].flatMap((t) => frLemmas(t)));
      for (const s of supportSet)
        if (!used.has(s)) report(`${where}: la forma de apoyo «${s}» no se usa`);
    });
  return problems;
}

/** Lo enseñado hasta la unidad de la lección tras la que se ofrece una tarea (incluida). */
function taughtForLesson(lesson: string): Set<string> | null {
  const m = /^fr-(a[12])-u(\d{2})-/.exec(lesson);
  if (!m) return null;
  const index = indexOf(m[1]!.toUpperCase(), Number(m[2]));
  return index >= 0 ? frTaughtFormsBefore(index + 1) : null;
}

/** Problemas de la escritura: definición, lección existente y vocabulario enseñado. */
export function frWritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(FR_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
  const ids = new Set<string>();
  for (const task of FR_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (task.language !== 'fr' || !/^fr\.a[12]\.wt\./.test(task.id))
      problems.push(`${task.id}: no es una tarea de francés A1/A2`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe`);
      continue;
    }
    if (!task.id.startsWith(`fr.${task.lesson.slice(3, 5)}.`))
      problems.push(`${task.id}: el nivel del id no es el de su lección`);
    const taught = taughtForLesson(task.lesson)!;
    const glossary = new Set(
      (task.glossary ?? []).flatMap((g) => writingTokens(g.term)).flatMap(frTokens),
    );
    const bad = [...new Set([task.model, ...task.prompts].flatMap(frTokens))].filter(
      (t) => !glossary.has(t) && !isFrToken(t, (c) => taught.has(c)),
    );
    if (bad.length) problems.push(`${task.id}: vocabulario no enseñado: ${bad.join(', ')}`);
  }
  return problems;
}
