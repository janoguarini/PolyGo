import { canonicalForm } from '../shared/answers';
import { writingTaskProblems, writingTokens } from '../shared/writing';
import { A2_EXPANSION, A2_EXPANSION_FIRST_UNIT, A2_EXPANSION_PATH } from './a2-expansion';
import { lemmaCandidates, tokensOfText } from './comprehension';
import { EN_A2_WRITING_TASKS } from './en/a2/writing';
import { AUTHORED_ID } from './ids-lock';
import { COURSES, CURRICULUM_PATH, type PathUnit } from './index';
import { PLANNED_PATH } from './planned';
import { SUPPLEMENT_PATH } from './supplement';
import { englishTexts, gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';

/**
 * Reglas de las unidades nuevas de inglés A2 (U13–U17, content/a2-expansion.ts) y de la escritura A2
 * (content/en/a2/writing.ts). Las usan content/__tests__/a2-expansion.test.ts y
 * scripts/build-a2-expansion-sql.ts (que no escribe la migración si hay problemas). Vacío = válido.
 *
 * - Estándar de lección (docs/CONTENT_STANDARD.md): introducción con 2+ ejemplos, 2+ cierres, 6–10
 *   ejercicios, alguno de escucha (listen_choice) y los dos últimos de producción sin opciones; id
 *   propio (`en.ex.…`) en todos.
 * - Palabras: ids nuevos con prefijo, IPA, traducción y ejemplo; ningún texto repite el de otra
 *   palabra del idioma; ningún texto coincide con la traducción de otra palabra ni al revés (evita
 *   preguntas ambiguas en Word Rush y en los repasos). Toda palabra se practica.
 * - Secuencia: una lección sólo evalúa (`words`, `concepts`) palabras ya existentes, y una palabra de
 *   la unidad se introduce en la primera lección que la practica.
 * - Límite de vocabulario: todo el inglés (respuestas, opciones, frases, audio, estímulos y ejemplos)
 *   usa formas enseñadas antes (A1 completo y A2 hasta la unidad anterior: palabras y todo el inglés
 *   de sus lecciones), palabras ya introducidas en la unidad o nombres declarados. Como el A2 ya
 *   enseñó -ed, -ing y los comparativos, una forma flexionada de algo enseñado también vale.
 * - Corrección del servidor (`gradeWithSpec`): la respuesta y cada aceptada son correctas, cada
 *   distractor no; opciones únicas.
 * - context_choice: sin `words` (SRS v1), con conceptos, pregunta con «?» y explicación con la evidencia.
 * - Privacidad: ningún dato de contacto ni datos del alumno.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Lemas posibles de una forma: los de siempre y, en A2, -ing, -ed, -er y -est. */
export function a2Lemmas(token: string): string[] {
  const out = new Set(lemmaCandidates(token));
  for (const suffix of ['ing', 'ed', 'er', 'est']) {
    if (!token.endsWith(suffix) || token.length <= suffix.length + 1) continue;
    const stem = token.slice(0, -suffix.length);
    out.add(stem);
    out.add(`${stem}e`);
    if (stem.at(-1) === stem.at(-2)) out.add(stem.slice(0, -1));
    if (stem.endsWith('i')) out.add(`${stem.slice(0, -1)}y`);
  }
  return [...out];
}

/**
 * ¿La forma está enseñada? Por su lema o, si es una contracción de la lista cerrada de la corrección
 * (shared/answers.ts: I'll = I will), porque cada palabra de su forma larga lo está.
 */
export function isTaughtToken(token: string, known: (lemma: string) => boolean): boolean {
  if (a2Lemmas(token).some(known)) return true;
  const long = canonicalForm(token);
  return (
    long !== token && long.includes(' ') && long.split(' ').every((t) => a2Lemmas(t).some(known))
  );
}

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(tokensOfText);

function wordsOfLanguage(language: string): WordDef[] {
  const course = COURSES.find((c) => c.language === language);
  return [
    ...(course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? []),
    ...[...PLANNED_PATH, ...SUPPLEMENT_PATH]
      .filter((p) => p.language === language)
      .flatMap((p) => p.unit.words),
  ];
}

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

/**
 * Formas enseñadas antes de la unidad `unit` del A2: todo el A1 (con las unidades planificadas y el
 * cierre), las 12 unidades cargadas del A2 y las unidades nuevas anteriores.
 */
export function taughtFormsBefore(language: string, unit: number): Set<string> {
  const out = new Set<string>();
  for (const p of [...CURRICULUM_PATH, ...PLANNED_PATH, ...SUPPLEMENT_PATH]) {
    if (p.language !== language) continue;
    if (
      p.level === 'A1' ||
      (p.level === 'A2' && p.unit.position < Math.min(unit, A2_EXPANSION_FIRST_UNIT))
    )
      addPathForms(out, p);
  }
  for (const p of A2_EXPANSION_PATH)
    if (p.language === language && p.unit.position < unit) addPathForms(out, p);
  return out;
}

export function a2ExpansionProblems(): string[] {
  const problems: string[] = [];
  for (const { language, level, units } of A2_EXPANSION) {
    const existing = wordsOfLanguage(language);
    const byId = new Map(existing.map((w) => [w.id, w]));
    // Palabras del currículo publicado (COURSES). Las de A1 U13/U14 y del cierre de A1 siguen sin
    // publicar: enlazarlas haría que publicar A2 dependiera de publicar antes esas unidades.
    const published = new Set(
      COURSES.find((c) => c.language === language)?.levels.flatMap((l) =>
        l.units.flatMap((u) => u.words.map((w) => w.id)),
      ) ?? [],
    );
    const ownIds = new Set(units.flatMap((u) => u.unit.words.map((w) => w.id)));
    const texts = new Map(existing.map((w) => [plain(w.text), w.id]));
    const translations = new Map<string, string>();
    for (const w of existing)
      for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
        translations.set(plain(t), w.id);
    const stimuli = new Map<string, string>();

    units.forEach(({ unit, names: unitNames }, ui) => {
      const where = `${language} ${level} U${unit.position}`;
      if (unit.position !== A2_EXPANSION_FIRST_UNIT + ui)
        problems.push(
          `${where}: las unidades nuevas van seguidas desde U${A2_EXPANSION_FIRST_UNIT}`,
        );
      if (!unit.objective?.trim()) problems.push(`${where}: falta el objetivo comunicativo`);
      if (unit.review?.status !== 'draft') problems.push(`${where}: tiene que estar en draft`);
      const n = unit.words.length;
      if (n < 15 || n > 22) problems.push(`${where}: ${n} palabras (15–22)`);

      // --- Palabras propias
      const own = new Map<string, WordDef>();
      for (const w of unit.words) {
        if (!w.id.startsWith(`${language}-`))
          problems.push(`${w.id}: falta el prefijo ${language}-`);
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
        }
        if (!w.ipa) problems.push(`${w.id}: falta la IPA`);
        if (!w.translation.trim() || !w.exampleEn.trim() || !w.exampleEs.trim())
          problems.push(`${w.id}: falta traducción o ejemplo`);
      }
      for (const w of unit.words) {
        texts.set(plain(w.text), w.id);
        byId.set(w.id, w);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])])
          translations.set(plain(t), w.id);
      }

      // --- Secuencia, vocabulario y corrección
      const taught = taughtFormsBefore(language, unit.position);
      const names = new Set(unitNames.map((x) => x.toLowerCase()));
      const allowed = (t: string, forms: ReadonlySet<string>) =>
        isTaughtToken(t, (c) => taught.has(c) || forms.has(c) || names.has(c));
      const introduced = new Set<string>();
      const introducedForms = new Set<string>();

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
            else if (!published.has(id) && !ownIds.has(id))
              problems.push(`${ex}: enlaza ${id}, que todavía no está publicada`);
          }
          if (e.type === 'context_choice') {
            if (e.words.length) problems.push(`${ex}: context_choice va sin words (SRS v1)`);
            const p = e.payload as Extract<ExerciseDef['payload'], { type: 'context_choice' }>;
            if (!p.question.endsWith('?')) problems.push(`${ex}: la pregunta termina en «?»`);
            if (!p.stimulus.id.startsWith(`${language}.stim.a2-u${unit.position}-`))
              problems.push(`${ex}: el estímulo ${p.stimulus.id} no es de la unidad`);
            const key = JSON.stringify(p.stimulus);
            const prev = stimuli.get(p.stimulus.id);
            if (prev && prev !== key) problems.push(`${ex}: ${p.stimulus.id} con otro contenido`);
            stimuli.set(p.stimulus.id, key);
            if (!e.explanation) problems.push(`${ex}: falta la explicación con la evidencia`);
            if (p.stimulus.kind === 'listening' && (p.stimulus.rate < 0.75 || p.stimulus.rate > 1))
              problems.push(`${ex}: velocidad del audio fuera de 0.75–1`);
          }
          const bad = [...new Set(englishTexts(e).flatMap(tokensOfText))].filter(
            (t) => !allowed(t, introducedForms),
          );
          if (bad.length)
            problems.push(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) problems.push(`${ex}: dato de contacto`);
          problems.push(...gradingProblems(e, ex));
        });

        const badIntro = [
          ...new Set((lesson.intro?.examples ?? []).flatMap((x) => tokensOfText(x.target))),
        ].filter((t) => !allowed(t, introducedForms));
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
      const unitForms = new Set([...own.values()].flatMap(formsOf));
      const generated = A2_EXPANSION_PATH.find(
        (p) => p.language === language && p.unit.position === unit.position,
      );
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
        const bad = [...new Set(t.flatMap(tokensOfText))].filter((x) => !allowed(x, unitForms));
        if (bad.length) problems.push(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
      }
    });
  }
  return problems;
}

/** Unidad del A2 de la lección tras la que se ofrece una tarea (a2-u13-l05 → 13). */
const unitOfLesson = (lesson: string) => Number(/^a2-u(\d{2})-/.exec(lesson)?.[1] ?? NaN);

/** Problemas de la escritura A2: definición, lección existente y vocabulario enseñado. */
export function a2WritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(
    [...CURRICULUM_PATH, ...A2_EXPANSION_PATH]
      .filter((p) => p.language === 'en' && p.level === 'A2')
      .flatMap((p) => p.lessons.map((l) => l.id)),
  );
  const ids = new Set<string>();
  for (const task of EN_A2_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (!task.id.startsWith('en.a2.wt.')) problems.push(`${task.id}: no es una tarea del A2`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe en el A2`);
      continue;
    }
    // Lo enseñado hasta esa unidad (incluida): la tarea se ofrece al terminar su lección.
    const taught = taughtFormsBefore('en', unitOfLesson(task.lesson) + 1);
    const glossary = new Set((task.glossary ?? []).flatMap((g) => writingTokens(g.term)));
    const bad = [...new Set([task.model, ...task.prompts].flatMap(tokensOfText))].filter(
      (t) => !glossary.has(t) && !isTaughtToken(t, (c) => taught.has(c)),
    );
    if (bad.length) problems.push(`${task.id}: vocabulario no enseñado: ${bad.join(', ')}`);
  }
  return problems;
}
