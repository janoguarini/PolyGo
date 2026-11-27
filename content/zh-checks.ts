import { HAN } from '../shared/languages';
import { EXTRA_READINGS, segmentReadings, type ReadingDictionary } from '../shared/readings';
import { writingTaskProblems } from '../shared/writing';
import { ZH_COURSE_READINGS } from '../shared/zh-course-readings';
import { AUTHORED_ID } from './ids-lock';
import { CURRICULUM_PATH, type PathUnit } from './index';
import { gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';
import { ZH_COURSE, ZH_PATH } from './zh-course';
import { misplacedToneMarks, samePinyin, syllables } from './zh-pinyin';
import { ZH_WRITING_TASKS } from './zh/writing';

/**
 * Reglas del chino A1 U13–U16 y A2 U1–U12 (content/zh-course.ts, docs/ZH_A1_A2.md) y de su escritura
 * (content/zh/writing.ts). Las usan content/__tests__/zh.test.ts y scripts/build-zh-sql.ts (que no
 * escribe si hay problemas). Vacío = válido. Son las reglas del italiano adaptadas al chino:
 *
 * - Estándar de lección, ids propios, 14–20 palabras por unidad, objetivo y gramática, draft.
 * - Palabras: ids zh-, pinyin con una sílaba válida por carácter y al menos un tono marcado, ningún
 *   texto repetido; todas se practican.
 * - Caracteres simplificados: ninguno de la lista de tradicionales frecuentes.
 * - Pinyin coherente: cada carácter se lee igual (sin contar el tono) en todo el curso, salvo los
 *   polifónicos declarados.
 * - Vocabulario: todo el chino (respuestas, opciones, audio, estímulos, ejemplos y repasos generados)
 *   se segmenta con lo enseñado antes (piloto, unidades anteriores y su apoyo), las palabras ya
 *   presentadas en la unidad, el apoyo de la unidad y los nombres; ningún carácter queda sin pinyin.
 *   Una palabra de una unidad posterior (o todavía no presentada) no aparece antes de tiempo.
 * - Pinyin de las respuestas: el que se escribe coincide con el que la app muestra encima de los
 *   caracteres (cambio de tono de 不 y 一 aparte).
 * - Corrección del servidor, context_choice sin `words`, con conceptos y explicación.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const MIN_WORDS = 14;
const MAX_WORDS = 20;
const TONE_PROMPT = 'Escucha y elige el tono correcto';

/** Tradicionales frecuentes: ninguno puede aparecer (el curso es en simplificado). */
export const TRADITIONAL = new Set([
  ...'們個這說學書東車電話買賣錢時間見對頭發開門問長還會來後麼國愛樂飯館號歲媽機場飛鐵現點氣節歡習寫讀聽認識誰謝請讓醫藥經過從給熱陽體腦視語漢麵條飲餃蘋貴邊銀園員燒動幾兩覺種歷應該辦參與舊紅藍護沒錯慣變孫鄰鄉單',
]);

/** Caracteres que se leen distinto según la palabra (sin contar el tono). */
const POLYPHONES = new Set([...'了得觉长还行都地只乐便重差着干调数和儿哪那什']);

const HAN_RUN = /[㐀-䶿一-鿿]+/g;
const hanRuns = (text: string) => text.match(HAN_RUN) ?? [];

/** Todo el chino de un ejercicio (opciones, audio, estímulo, respuesta y aceptadas). */
const hanOf = (e: ExerciseDef) =>
  hanRuns([JSON.stringify(e.payload), e.answer, ...(e.acceptedAnswers ?? [])].join(' '));

const zhPilot = () => CURRICULUM_PATH.filter((p) => p.language === 'zh');
const pilotWords = (): WordDef[] => zhPilot().flatMap((p) => p.unit.words);

/** Lecturas del piloto que no son palabras (王明, 妈, 了…): EXTRA_READINGS sin las del curso nuevo. */
const PILOT_EXTRA = Object.fromEntries(
  Object.entries(EXTRA_READINGS).filter(([k]) => !(k in ZH_COURSE_READINGS)),
);

const ORDER = ZH_COURSE.flatMap((l) =>
  l.units.map((u) => ({ level: l.level, position: u.unit.position, def: u })),
);
const indexOf = (level: string, position: number) =>
  ORDER.findIndex((o) => o.level === level && o.position === position);
const pathOf = (level: string, position: number) =>
  ZH_PATH.find((p) => p.level === level && p.unit.position === position);

const reading = (text: string) => ZH_COURSE_READINGS[text];

/** Diccionario (texto → pinyin) de lo enseñado antes de la unidad nueva número `index`. */
export function zhKnownBefore(index: number): Map<string, string> {
  const dict = new Map<string, string>(Object.entries(PILOT_EXTRA));
  for (const w of pilotWords()) if (w.romanization) dict.set(w.text, w.romanization);
  ORDER.slice(0, Math.max(0, index)).forEach((o) => {
    for (const w of o.def.unit.words) if (w.romanization) dict.set(w.text, w.romanization);
    for (const s of [...o.def.support, ...o.def.names]) {
      const r = reading(s);
      if (r) dict.set(s, r);
    }
  });
  return dict;
}

/** Diccionario completo, como el de la app cuando todo esté publicado. */
export function zhFullDictionary(): Map<string, string> {
  const dict = new Map<string, string>(Object.entries(EXTRA_READINGS));
  for (const w of [...pilotWords(), ...ORDER.flatMap((o) => o.def.unit.words)])
    if (w.romanization) dict.set(w.text, w.romanization);
  return dict;
}

/** Pinyin que la app muestra encima de un texto en caracteres. */
export function displayedPinyin(text: string, dict: ReadingDictionary): string {
  return segmentReadings(text, dict)
    .filter((s) => s.reading !== null || HAN.test(s.text))
    .map((s) => s.reading ?? `?${s.text}`)
    .join(' ');
}

/** Problemas de pinyin de una entrada (palabra o lectura de apoyo). */
function pinyinProblems(at: string, text: string, pinyin: string, neutral = false): string[] {
  const s = syllables(pinyin);
  const chars = [...text].filter((c) => HAN.test(c));
  if (!s) return [`${at}: «${pinyin}» no es pinyin válido`];
  if (s.length !== chars.length)
    return [`${at}: «${pinyin}» tiene ${s.length} sílabas para ${chars.length} caracteres`];
  if (!neutral && !s.some((x) => x.tone !== 5) && chars.length > 0)
    return [`${at}: «${pinyin}» no tiene ninguna marca de tono`];
  return toneMarkProblems(at, pinyin);
}

/** Marcas de tono sobre la vocal equivocada («haǒ» por «hǎo»). */
function toneMarkProblems(at: string, pinyin: string): string[] {
  const bad = misplacedToneMarks(pinyin);
  return bad.length ? [`${at}: marca de tono mal ubicada en ${bad.join(', ')}`] : [];
}

/** Lectura de cada carácter en todo el curso (sin tono), para detectar pinyin desalineado. */
export function zhCharReadingProblems(): string[] {
  const problems: string[] = [];
  const seen = new Map<string, Map<string, string>>();
  const entries: [string, string, string][] = [
    ...pilotWords().map((w) => [w.id, w.text, w.romanization ?? ''] as [string, string, string]),
    ...ORDER.flatMap((o) =>
      o.def.unit.words.map((w) => [w.id, w.text, w.romanization ?? ''] as [string, string, string]),
    ),
    ...Object.entries(ZH_COURSE_READINGS).map(
      ([k, v]) => [`lectura ${k}`, k, v] as [string, string, string],
    ),
  ];
  for (const [at, text, pinyin] of entries) {
    const s = syllables(pinyin);
    const chars = [...text].filter((c) => HAN.test(c));
    if (!s || s.length !== chars.length) continue; // lo informa pinyinProblems
    chars.forEach((c, i) => {
      if (POLYPHONES.has(c)) return;
      const base = s[i]!.base;
      const bases = seen.get(c) ?? new Map<string, string>();
      if (bases.size && !bases.has(base))
        problems.push(
          `${at}: «${c}» se lee ${base}, pero en ${[...bases.values()][0]} se lee ${[...bases.keys()][0]}`,
        );
      if (!bases.has(base)) bases.set(base, at);
      seen.set(c, bases);
    });
  }
  return problems;
}

export function zhProblems(): string[] {
  const problems: string[] = [...zhCharReadingProblems()];
  const existing = pilotWords();
  const byId = new Map(existing.map((w) => [w.id, w]));
  const linkable = new Set([
    ...existing.map((w) => w.id),
    ...ORDER.flatMap((o) => o.def.unit.words.map((w) => w.id)),
  ]);
  const texts = new Map(existing.map((w) => [w.text, w.id]));
  const full = zhFullDictionary();
  const laterWords = new Map<string, number>(); // texto → índice de la unidad que la presenta
  ORDER.forEach((o, i) => o.def.unit.words.forEach((w) => laterWords.set(w.text, i)));
  const stimuli = new Map<string, string>();
  const usedReadings = new Set<string>();

  for (const { level, first, units } of ZH_COURSE)
    units.forEach(({ unit, names, support }, ui) => {
      const where = `zh ${level} U${unit.position}`;
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

      // --- Palabras propias
      const own = new Map<string, WordDef>();
      const ownTranslations = new Map<string, string>();
      for (const w of unit.words) {
        if (!w.id.startsWith('zh-')) problems.push(`${w.id}: falta el prefijo zh-`);
        if (byId.has(w.id) || own.has(w.id)) problems.push(`${w.id}: id de palabra repetido`);
        own.set(w.id, w);
        const same = texts.get(w.text);
        if (same && same !== w.id) problems.push(`${w.id}: «${w.text}» ya es la palabra ${same}`);
        if (!w.romanization) problems.push(`${w.id}: falta el pinyin`);
        else
          problems.push(
            ...pinyinProblems(w.id, w.text, w.romanization, w.tags.includes('particle')),
          );
        if (!HAN.test(w.text)) problems.push(`${w.id}: el texto va en caracteres`);
        if (!w.translation.trim() || !w.exampleEn.trim() || !w.exampleEs.trim())
          problems.push(`${w.id}: falta traducción o ejemplo`);
        for (const t of [w.translation, ...(w.acceptedTranslations ?? [])]) {
          const key = t
            .toLowerCase()
            .replace(/[¿?¡!]/g, '')
            .trim();
          const twin = ownTranslations.get(key);
          if (twin && twin !== w.id)
            problems.push(`${w.id}: la traducción «${t}» repite la de ${twin}`);
          ownTranslations.set(key, w.id);
        }
      }
      for (const w of unit.words) {
        texts.set(w.text, w.id);
        byId.set(w.id, w);
      }

      // --- Apoyo y nombres: con lectura, no enseñados ya, no repetidos como palabra.
      const known = zhKnownBefore(index);
      if (new Set(support).size !== support.length) problems.push(`${where}: apoyo repetido`);
      for (const s of [...support, ...names]) {
        usedReadings.add(s);
        const r = reading(s);
        if (!r) problems.push(`${where}: «${s}» no tiene pinyin en shared/zh-course-readings.ts`);
        else problems.push(...pinyinProblems(`${where} «${s}»`, s, r));
      }
      for (const s of support) {
        if (known.has(s)) problems.push(`${where}: «${s}» ya está enseñada (sacarla del apoyo)`);
        if (unit.words.some((w) => w.text === s))
          problems.push(`${where}: «${s}» es palabra de la unidad (sacarla del apoyo)`);
      }

      const base = new Map(known);
      for (const s of [...support, ...names]) {
        const r = reading(s);
        if (r) base.set(s, r);
      }
      const unitHan = new Set<string>();
      const stimulusPrefix = `zh.stim.${level.toLowerCase()}-u${unit.position}-`;

      /** Problemas de vocabulario de un texto con lo que se conoce en ese punto. */
      const vocabulary = (run: string, dict: Map<string, string>, introduced: Set<string>) => {
        unitHan.add(run);
        const bad: string[] = [];
        for (const s of segmentReadings(run, dict))
          if (s.reading === null && HAN.test(s.text)) bad.push(s.text);
        const early: string[] = [];
        for (const s of segmentReadings(run, full)) {
          const at = laterWords.get(s.text);
          if (at === undefined || known.has(s.text)) continue;
          if (at > index || (at === index && !introduced.has(s.text))) early.push(s.text);
        }
        return { bad, early };
      };

      const introducedTexts = new Set<string>();
      unit.lessons.forEach((lesson, li) => {
        const at = `${where} L${li + 1} «${lesson.title}»`;
        for (const e of lesson.exercises)
          for (const id of [...e.words, ...(e.concepts ?? [])])
            if (own.has(id)) introducedTexts.add(own.get(id)!.text);
        const dict = new Map(base);
        for (const w of unit.words)
          if (introducedTexts.has(w.text) && w.romanization) dict.set(w.text, w.romanization);

        lesson.exercises.forEach((e, ei) => {
          const ex = `${at} e${ei + 1}`;
          if (!e.id || !AUTHORED_ID.test(e.id) || !e.id.startsWith('zh.'))
            problems.push(`${ex}: falta el id propio`);
          if (e.personalData) problems.push(`${ex}: muestra o pide datos personales`);
          const targets = [...e.words, ...(e.concepts ?? [])];
          if (!targets.length) problems.push(`${ex}: sin palabras ni conceptos target`);
          for (const id of targets) {
            if (!byId.has(id)) problems.push(`${ex}: palabra ${id} inexistente`);
            else if (!linkable.has(id)) problems.push(`${ex}: enlaza ${id}, que no es de chino`);
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
          const bad = new Set<string>();
          const early = new Set<string>();
          for (const run of hanOf(e)) {
            const r = vocabulary(run, dict, introducedTexts);
            r.bad.forEach((x) => bad.add(x));
            r.early.forEach((x) => early.add(x));
          }
          if (bad.size)
            problems.push(`${ex}: caracteres no enseñados todavía: ${[...bad].join(', ')}`);
          if (early.size)
            problems.push(`${ex}: palabra todavía no presentada: ${[...early].join(', ')}`);

          // Pinyin escrito = pinyin que muestra la app.
          if (PRODUCTION.has(e.type)) {
            const hanzi = (e.acceptedAnswers ?? []).find((a) => HAN.test(a));
            if (!hanzi)
              problems.push(`${ex}: falta la respuesta en caracteres entre las aceptadas`);
            else {
              const shown = displayedPinyin(hanzi, full);
              problems.push(...toneMarkProblems(ex, e.answer));
              if (!samePinyin(e.answer, shown))
                problems.push(
                  `${ex}: el pinyin «${e.answer}» no coincide con ${hanzi} → «${shown}»`,
                );
            }
          }
          if (e.prompt === TONE_PROMPT && e.payload.type === 'listen_choice') {
            const shown = displayedPinyin(e.payload.audioText, full);
            if (!samePinyin(e.answer, shown))
              problems.push(
                `${ex}: el tono «${e.answer}» no es el de ${e.payload.audioText} («${shown}»)`,
              );
            if (new Set(e.payload.options).size !== e.payload.options.length)
              problems.push(`${ex}: opciones repetidas`);
            for (const o of e.payload.options) problems.push(...toneMarkProblems(ex, o));
          }
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) problems.push(`${ex}: dato de contacto`);
          problems.push(
            ...gradingProblems(e, ex).filter(
              (p) =>
                !(e.prompt === TONE_PROMPT && p.includes('opciones repetidas')) &&
                // En chino la respuesta va sin espacios (joinHan): se compara abajo sin ellos.
                !p.includes('las fichas ya vienen en orden'),
            ),
          );
        });

        for (const x of lesson.intro?.examples ?? [])
          for (const run of hanRuns(x.target)) {
            const r = vocabulary(run, dict, introducedTexts);
            if (r.bad.length)
              problems.push(`${at}: ejemplo con caracteres no enseñados: ${r.bad.join(', ')}`);
          }

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

      for (const w of unit.words)
        if (!introducedTexts.has(w.text))
          problems.push(`${where}: la palabra ${w.id} no se practica`);

      // Ejemplos de palabras, gramática y repasos generados: vocabulario de toda la unidad.
      const generated = pathOf(level, unit.position);
      if (generated?.lessons.length !== 10)
        problems.push(`${where}: el camino tiene ${generated?.lessons.length} lecciones (10)`);
      const all = new Map(base);
      for (const w of unit.words) if (w.romanization) all.set(w.text, w.romanization);
      const everything = new Set(unit.words.map((w) => w.text));
      const extra = [
        ...unit.words.map((w) => ({ at: `${w.id} (ejemplo)`, texts: [w.exampleEn, w.text] })),
        ...(unit.grammar?.examples ?? []).map((x) => ({
          at: `${where} gramática`,
          texts: [x.target],
        })),
        ...(generated?.lessons ?? [])
          .filter((l) => l.kind !== 'lesson')
          .flatMap((l) =>
            l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: hanOf(e) })),
          ),
      ];
      for (const { at, texts: t } of extra) {
        const bad = new Set<string>();
        for (const run of t.flatMap(hanRuns))
          vocabulary(run, all, everything).bad.forEach((x) => bad.add(x));
        if (bad.size) problems.push(`${at}: caracteres fuera de la unidad: ${[...bad].join(', ')}`);
      }

      // Simplificados.
      const unitText = [...unitHan, ...unit.words.flatMap((w) => [w.text, w.exampleEn])].join('');
      const trad = [...new Set([...unitText].filter((c) => TRADITIONAL.has(c)))];
      if (trad.length) problems.push(`${where}: caracteres tradicionales: ${trad.join(', ')}`);

      // Apoyo usado.
      const joined = [...unitHan].join('|');
      for (const s of support)
        if (!joined.includes(s)) problems.push(`${where}: la palabra de apoyo «${s}» no se usa`);
    });

  for (const k of Object.keys(ZH_COURSE_READINGS))
    if (!usedReadings.has(k))
      problems.push(`lectura «${k}»: no es apoyo ni nombre de ninguna unidad`);
  return problems;
}

/**
 * Textos del piloto cuya segmentación cambia con las lecturas nuevas (tienen que ser ninguno: el
 * pinyin del piloto, incluido el de los conjuntos de opciones ya cargados, no cambia).
 */
export function zhPilotSegmentationChanges(): string[] {
  const before = new Map<string, string>(Object.entries(PILOT_EXTRA));
  const after = new Map<string, string>(Object.entries(EXTRA_READINGS));
  for (const w of pilotWords())
    if (w.romanization) {
      before.set(w.text, w.romanization);
      after.set(w.text, w.romanization);
    }
  const out: string[] = [];
  for (const p of zhPilot())
    for (const l of p.lessons)
      for (const e of l.exercises)
        for (const run of hanOf(e))
          if (displayedPinyin(run, before) !== displayedPinyin(run, after))
            out.push(`${l.id}: ${run}`);
  return [...new Set(out)];
}

/** Lo enseñado hasta la lección tras la que se ofrece una tarea de escritura. */
function knownForLesson(lesson: string): Map<string, string> | null {
  const m = /^zh-(a[12])-u(\d{2})-/.exec(lesson);
  if (!m) return null;
  const level = m[1]!.toUpperCase();
  const position = Number(m[2]);
  const index = indexOf(level, position);
  if (index >= 0) return zhKnownBefore(index + 1);
  const dict = new Map<string, string>(Object.entries(PILOT_EXTRA));
  for (const p of zhPilot())
    if (p.level === 'A1' && p.unit.position <= position)
      for (const w of p.unit.words) if (w.romanization) dict.set(w.text, w.romanization);
  return dict;
}

/** Problemas de la escritura: definición, lección existente y caracteres enseñados. */
export function zhWritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(
    [...zhPilot(), ...ZH_PATH].flatMap((p: PathUnit) => p.lessons.map((l) => l.id)),
  );
  const ids = new Set<string>();
  for (const task of ZH_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (task.language !== 'zh' || !/^zh\.a[12]\.wt\./.test(task.id))
      problems.push(`${task.id}: no es una tarea de chino A1/A2`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe`);
      continue;
    }
    if (!task.id.startsWith(`zh.${task.lesson.slice(3, 5)}.`))
      problems.push(`${task.id}: el nivel del id no es el de su lección`);
    const dict = knownForLesson(task.lesson)!;
    for (const g of task.glossary ?? []) {
      const r = reading(g.term) ?? zhFullDictionary().get(g.term);
      if (r) dict.set(g.term, r);
    }
    const bad = new Set<string>();
    for (const run of [task.model, ...task.prompts].flatMap(hanRuns))
      for (const s of segmentReadings(run, dict))
        if (s.reading === null && HAN.test(s.text)) bad.add(s.text);
    if (bad.size) problems.push(`${task.id}: caracteres no enseñados: ${[...bad].join(', ')}`);
    if (!task.modelReading) problems.push(`${task.id}: falta el pinyin del modelo`);
    else {
      problems.push(...toneMarkProblems(task.id, task.modelReading));
      const full = zhFullDictionary();
      const shown = hanRuns(task.model)
        .map((run) => displayedPinyin(run, full))
        .join(' ');
      if (!samePinyin(task.modelReading, shown))
        problems.push(
          `${task.id}: el pinyin del modelo no coincide con los caracteres → «${shown}»`,
        );
    }
    const trad = [...task.model].filter((c) => TRADITIONAL.has(c));
    if (trad.length) problems.push(`${task.id}: caracteres tradicionales: ${trad.join(', ')}`);
  }
  return problems;
}
