import { lemmaCandidates, taughtTokens, tokensOfText } from './comprehension';
import { COURSES } from './index';
import { AUTHORED_ID } from './ids-lock';
import { CONTENT_PERSONAS } from './personas';
import { PLANNED_PATH, PLANNED_WRITTEN } from './planned';
import type { ExerciseDef, Level, PlannedUnitDef, PlannedWrittenUnitDef, WordDef } from './types';

/**
 * Reglas de las lecciones escritas de las unidades planificadas (fase C.3, docs/LEARNING_PHASE_C.md
 * §C3). Las usan content/__tests__/planned.test.ts y scripts/build-planned-units-sql.ts (que no
 * escribe la migración si hay problemas). Vacío = todo válido.
 *
 * - Mapa: cinco lecciones, con los títulos y los objetivos principales de `plannedLessons`.
 * - Estándar de lección (docs/CONTENT_STANDARD.md): introducción con 2+ ejemplos, 2+ cierres, 6–10
 *   ejercicios, alguno de escucha y los dos últimos de producción sin opciones; id propio en todos.
 * - Palabras: ids nuevos y sin repetir textos de otras palabras del idioma (una palabra que ya existe
 *   se reutiliza con `borrowed`, nunca se duplica); las reutilizadas existen en una unidad posterior a
 *   `after` o en un nivel superior. Toda palabra propia y reutilizada se practica.
 * - Secuencia: una lección sólo evalúa (`words`) lo enseñado hasta `after` o lo que la unidad ya
 *   introdujo en esa lección o en una anterior (una palabra se introduce en la primera lección que la
 *   practica).
 * - Límite de vocabulario: todo el texto en el idioma que se aprende (respuestas, opciones, frases,
 *   audio y ejemplos) usa sólo formas enseñadas hasta `after`, de palabras ya introducidas, nombres
 *   propios declarados o, después de enseñar el alfabeto, letras sueltas (deletreo).
 * - Privacidad (§13.2): un dato de contacto (teléfono, correo) sólo puede ser el de una persona del
 *   catálogo, y todo ejercicio que muestre datos de una persona la cita con `personalData`.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PHONE = /\b\d{3}-\d{4}\b/g;

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .trim()
    .toLowerCase();

/** Texto en el idioma que se aprende de un ejercicio (lo que se lee, se oye o se responde). */
export function targetTexts(e: ExerciseDef): string[] {
  const p = e.payload;
  switch (p.type) {
    case 'image_choice':
      return [e.answer, ...p.options];
    case 'translation_choice':
      return [p.word];
    case 'listen_choice':
      return [p.audioText, ...p.options];
    case 'match_pairs':
      return p.pairs.map((x) => x.left);
    case 'fill_blank':
      return [p.sentence.replace('___', ' '), ...p.options];
    case 'order_words':
      return [e.answer, ...p.tokens];
    case 'short_answer':
      return [p.question, e.answer];
    case 'complete_word':
    case 'translate_write':
      return [e.answer];
    default:
      return [e.answer];
  }
}

/** Todo el texto del ejercicio, en los dos idiomas (para buscar datos personales). */
const allTexts = (e: ExerciseDef) => [
  e.answer,
  ...(e.acceptedAnswers ?? []),
  e.explanation ?? '',
  JSON.stringify(e.payload),
];

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])];
const tokensOfWord = (w: WordDef) => formsOf(w).flatMap(tokensOfText);

function wordsOfLanguage(language: string) {
  const course = COURSES.find((c) => c.language === language);
  return course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? [];
}

/** Ids de palabra enseñados hasta la unidad `upTo` de un nivel (y en los niveles anteriores). */
function taughtIds(language: string, level: Level, upTo: number): Set<string> {
  const course = COURSES.find((c) => c.language === language)!;
  return new Set(
    course.levels
      .filter((l) => l.level <= level)
      .flatMap((l) => (l.level === level ? l.units.filter((u) => u.position <= upTo) : l.units))
      .flatMap((u) => u.words.map((w) => w.id)),
  );
}

/** Unidad y nivel de una palabra ya cargada. */
function homeOf(language: string, wordId: string): { level: Level; unit: number } | undefined {
  const course = COURSES.find((c) => c.language === language);
  for (const l of course?.levels ?? []) {
    const u = l.units.find((x) => x.words.some((w) => w.id === wordId));
    if (u) return { level: l.level, unit: u.position };
  }
  return undefined;
}

export function plannedUnitProblems(
  language: string,
  level: Level,
  meta: PlannedUnitDef,
  def: PlannedWrittenUnitDef,
): string[] {
  const problems: string[] = [];
  const { unit, borrowed, names } = def;
  const where = `${language} ${level} U${unit.position}`;
  const existing = wordsOfLanguage(language);
  const existingById = new Map(existing.map((w) => [w.id, w]));

  // --- Mapa
  if (unit.lessons.length !== meta.plannedLessons.length)
    problems.push(
      `${where}: ${unit.lessons.length} lecciones y el mapa planifica ${meta.plannedLessons.length}`,
    );
  if (def.curriculum.length !== unit.lessons.length)
    problems.push(`${where}: curriculum tiene que tener una entrada por lección`);
  meta.plannedLessons.forEach((planned, i) => {
    const m = /^U(\d+) L(\d+) (.+) \(([^)]+)\)$/.exec(planned);
    const lesson = unit.lessons[i];
    if (!m || !lesson) return;
    if (Number(m[1]) !== unit.position || Number(m[2]) !== i + 1)
      problems.push(`${where}: «${planned}» no es la L${i + 1} de la unidad`);
    if (lesson.title !== m[3])
      problems.push(
        `${where} L${i + 1}: el título tiene que ser «${m[3]}» (mapa), no «${lesson.title}»`,
      );
    const codes = m[4]!.split(/,\s*/);
    if (JSON.stringify(def.curriculum[i]?.primary) !== JSON.stringify(codes))
      problems.push(
        `${where} L${i + 1}: objetivos principales ${JSON.stringify(codes)} según el mapa`,
      );
  });

  // --- Palabras propias y reutilizadas
  const texts = new Map(existing.map((w) => [plain(w.text), w.id]));
  const own = new Set<string>();
  for (const w of unit.words) {
    if (!w.id.startsWith(`${language}-`)) problems.push(`${w.id}: falta el prefijo ${language}-`);
    if (existingById.has(w.id) || own.has(w.id)) problems.push(`${w.id}: id de palabra repetido`);
    own.add(w.id);
    const same = texts.get(plain(w.text));
    if (same && same !== w.id)
      problems.push(
        `${w.id}: «${w.text}» ya es la palabra ${same}: reutilizala (borrowed), no la dupliques`,
      );
    texts.set(plain(w.text), w.id);
    if (!w.translation.trim() || !w.exampleEn.trim() || !w.exampleEs.trim())
      problems.push(`${w.id}: falta traducción o ejemplo`);
    if (language === 'en' && !w.ipa) problems.push(`${w.id}: falta la IPA`);
  }
  for (const id of borrowed) {
    const home = homeOf(language, id);
    if (!home)
      problems.push(`${where}: la palabra reutilizada ${id} no existe en el currículo cargado`);
    else if (home.level === level && home.unit <= meta.after)
      problems.push(
        `${where}: ${id} ya está enseñada hasta U${meta.after}: no es una palabra reutilizada`,
      );
    if (own.has(id)) problems.push(`${where}: ${id} es propia y reutilizada a la vez`);
  }

  // --- Secuencia y límite de vocabulario
  const taught = taughtIds(language, level, meta.after);
  const taughtForms = taughtTokens(language, level, meta.after);
  const usable = new Map<string, WordDef>(
    [...unit.words, ...borrowed.flatMap((id) => existingById.get(id) ?? [])].map((w) => [w.id, w]),
  );
  const introduced = new Set<string>();
  const introducedForms = new Set<string>();
  const allowed = (t: string, forms: ReadonlySet<string>, letters: boolean) =>
    (letters && t.length === 1) ||
    lemmaCandidates(t).some((c) => names.includes(c) || taughtForms.has(c) || forms.has(c));
  const isAlphabet = (id: string) => usable.get(id)?.tags.includes('alphabet') ?? false;

  unit.lessons.forEach((lesson, li) => {
    const at = `${where} L${li + 1} «${lesson.title}»`;
    for (const e of lesson.exercises)
      for (const id of e.words)
        if (usable.has(id) && !introduced.has(id)) {
          introduced.add(id);
          tokensOfWord(usable.get(id)!).forEach((t) => introducedForms.add(t));
        }
    const letters = [...introduced].some(isAlphabet);
    lesson.exercises.forEach((e, ei) => {
      const ex = `${at} e${ei + 1}`;
      if (!e.words.length) problems.push(`${ex}: sin palabras target`);
      for (const id of e.words)
        if (!taught.has(id) && !introduced.has(id))
          problems.push(
            `${ex}: evalúa ${id}, que no se enseñó hasta U${meta.after} ni en la unidad`,
          );
      const bad = [...new Set(targetTexts(e).flatMap(tokensOfText))].filter(
        (t) => !allowed(t, introducedForms, letters),
      );
      if (bad.length) problems.push(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
    });
    const badIntro = [
      ...new Set((lesson.intro?.examples ?? []).flatMap((x) => tokensOfText(x.target))),
    ].filter((t) => !allowed(t, introducedForms, letters));
    if (badIntro.length)
      problems.push(`${at}: los ejemplos usan vocabulario no enseñado: ${badIntro.join(', ')}`);

    // --- Estándar de lección
    const n = lesson.exercises.length;
    if (n < 6 || n > 10) problems.push(`${at}: ${n} ejercicios (6–10)`);
    if (!lesson.intro?.explanation.trim() || (lesson.intro?.examples.length ?? 0) < 2)
      problems.push(`${at}: falta la introducción con dos ejemplos`);
    if ((lesson.takeaways?.length ?? 0) < 2) problems.push(`${at}: faltan los cierres`);
    if (!lesson.exercises.some((e) => e.skill === 'listening')) problems.push(`${at}: sin escucha`);
    if (!lesson.exercises.slice(-2).every((e) => PRODUCTION.has(e.type)))
      problems.push(`${at}: los dos últimos ejercicios tienen que ser de producción`);
    lesson.exercises.forEach((e, ei) => {
      if (!e.id || !AUTHORED_ID.test(e.id)) problems.push(`${at} e${ei + 1}: falta el id propio`);
    });
  });

  const practiced = new Set(unit.lessons.flatMap((l) => l.exercises.flatMap((e) => e.words)));
  for (const id of usable.keys())
    if (!practiced.has(id)) problems.push(`${where}: la palabra ${id} no se practica`);

  // Ejemplos de las palabras y consolidación generada: vocabulario de toda la unidad.
  const unitForms = new Set([...usable.values()].flatMap(tokensOfWord));
  const generated = PLANNED_PATH.find(
    (p) => p.language === language && p.level === level && p.unit.position === unit.position,
  );
  const extra = [
    ...unit.words.map((w) => ({ at: `${w.id} (ejemplo)`, texts: [w.exampleEn] })),
    ...(generated?.lessons ?? [])
      .filter((l) => l.kind !== 'lesson')
      .flatMap((l) =>
        l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: targetTexts(e) })),
      ),
  ];
  for (const { at, texts: t } of extra) {
    const bad = [...new Set(t.flatMap(tokensOfText))].filter((x) => !allowed(x, unitForms, true));
    if (bad.length) problems.push(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
  }

  // --- Privacidad: datos de contacto sólo de personas del catálogo, siempre citadas.
  unit.lessons.forEach((lesson, li) =>
    lesson.exercises.forEach((e, ei) => {
      const ex = `${where} L${li + 1} e${ei + 1}`;
      if (e.personalData === 'learner') {
        problems.push(`${ex}: pide datos del alumno (P4)`);
        return;
      }
      const persona = e.personalData
        ? CONTENT_PERSONAS.find((p) => p.id === (e.personalData as { persona: string }).persona)
        : undefined;
      if (e.personalData && (!persona || persona.language !== language))
        problems.push(`${ex}: persona inexistente o de otro idioma`);
      const text = allTexts(e).join(' ');
      for (const m of [...text.matchAll(EMAIL), ...text.matchAll(PHONE)]) {
        if (!persona || (m[0] !== persona.email && m[0] !== persona.phone))
          problems.push(`${ex}: dato de contacto ${m[0]} que no es de la persona citada`);
      }
      for (const p of CONTENT_PERSONAS.filter((x) => x.language === language)) {
        const shows = [p.email, p.phone, p.displayName].some((v) => text.includes(v));
        const first = p.displayName.split(' ')[0]!;
        if ((shows || new RegExp(`\\b${first}\\b`).test(text)) && persona?.id !== p.id)
          problems.push(`${ex}: muestra datos de ${p.id} y no la cita con personalData`);
      }
    }),
  );
  return problems;
}

/** Problemas de todas las unidades planificadas con lecciones escritas. */
export function plannedProblems(): string[] {
  return PLANNED_WRITTEN.flatMap(({ language, level, planned, units }) => {
    const ids = units.flatMap((u) => u.unit.words.map((w) => w.id));
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    return [
      ...(dup ? [`${language} ${level}: palabra ${dup} en dos unidades planificadas`] : []),
      ...units.flatMap((def) => {
        const meta = planned.find((p) => p.position === def.unit.position);
        return meta
          ? plannedUnitProblems(language, level, meta, def)
          : [`${language} ${level} U${def.unit.position}: no es una unidad planificada`];
      }),
    ];
  });
}
