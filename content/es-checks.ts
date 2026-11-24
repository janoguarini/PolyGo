import { writingTaskProblems, writingTokens } from '../shared/writing';
import { ES_COURSE, ES_PATH } from './es-course';
import { ES_WRITING_TASKS } from './es/writing';
import { AUTHORED_ID } from './ids-lock';
import type { PathUnit } from './index';
import { englishTexts, gradingProblems } from './supplement-checks';
import type { ExerciseDef, WordDef } from './types';

/**
 * Reglas del español A1 U1–U17 y A2 U1–U12 (content/es-course.ts, docs/ES_A1_A2.md) y de su escritura
 * (content/es/writing.ts). Las usan content/__tests__/es.test.ts y scripts/build-es-sql.ts (que no
 * escribe si hay problemas). Vacío = válido. Son las reglas del francés adaptadas al español, con el
 * inglés como idioma de apoyo:
 *
 * - Estándar de lección (introducción con dos ejemplos, cierres, 6–10 ejercicios, escucha, los dos
 *   últimos de producción), ids propios, 14–20 palabras por unidad, objetivo y gramática declarados.
 * - Palabras: ids con prefijo es-, traducción al inglés y ejemplo; ningún texto repite otro ni coincide
 *   con la traducción de otra palabra; todas se practican.
 * - Vocabulario: todo el español (respuestas, opciones, audio, estímulos, ejemplos y repasos generados)
 *   usa formas enseñadas antes, palabras ya introducidas en la unidad, nombres declarados o el apoyo de
 *   la unidad. Acepta el plural y el femenino regulares de lo enseñado (casas, colores, ciudades, luces,
 *   argentina, profesora, inglesa, jóvenes); las formas verbales nuevas se enseñan o se declaran.
 * - Variante: español neutro de Latinoamérica, con tú y ustedes. Ni voseo (vos, sos, tenés, hablás,
 *   doblá…) ni vosotros (sois, habláis…) ni léxico rioplatense (colectivo, che, dale…) en lo que se
 *   muestra o se escucha, salvo las formas que una unidad declara en `contrast` para compararlas, y
 *   sólo en sus ejemplos. Las respuestas aceptadas sí pueden incluir el voseo.
 * - Ortografía: los signos de pregunta y de exclamación se abren y se cierran (¿…?, ¡…!).
 * - Escucha: las opciones de listen_choice no pueden sonar igual en el español latinoamericano
 *   (seseo, yeísmo, b = v, h muda: casa / caza, vaca / baca, calló / cayó no se distinguen de oído).
 * - Corrección del servidor (`gradeWithSpec`), context_choice sin `words`, con conceptos, pregunta con
 *   «?» y explicación; repasos generados sin cognados en traducciones; order_words sin ¿ ni ¡ (la
 *   primera ficha delataría el orden).
 * - Vínculos: sólo palabras del español.
 */

const PRODUCTION = new Set(['translate_write', 'short_answer']);
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}-\d{4}\b|https?:\/\//i;
const MIN_WORDS = 14;
const MAX_WORDS = 20;
/**
 * Palabras cuyo texto coincide con la traducción de otra sólo si se ignoran las tildes (en pantalla se
 * distinguen y los repasos nunca las ponen como opciones juntas). Por ahora, ninguna.
 */
const ACCENT_ONLY_CLASHES = new Set<string>([]);

/** Marcador de redacción ('es.ex.' + 'new'), armado por partes para que content:ids no lo reemplace. */
const ID_PLACEHOLDER = ['es', 'ex', 'new'].join('.');

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

/** Fichas de un texto en español: letras (con tildes y ñ). */
export const esTokens = (text: string): string[] =>
  text
    .normalize('NFC')
    .toLowerCase()
    .match(/\p{L}+/gu) ?? [];

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');

/**
 * Formas de las que puede venir una ficha: ella misma, el singular y el masculino regulares
 * (casas → casa, colores → color, ciudades → ciudad, luces → luz, lecciones → lección, ingleses →
 * inglés, alemanes → alemán, jóvenes → joven; argentina → argentino, profesora → profesor, inglesa →
 * inglés) y el femenino de una forma enseñada en masculino (argentino → argentina).
 */
export function esLemmas(token: string): string[] {
  const out = new Set([token]);
  const add = (s: string) => {
    if (s.length > 1) out.add(s);
  };
  const singular = new Set([token]);
  if (token.length > 3) {
    if (token.endsWith('s')) singular.add(token.slice(0, -1));
    if (token.endsWith('es')) {
      const stem = token.slice(0, -2);
      singular.add(stem);
      singular.add(stripAccents(stem));
      if (stem.endsWith('c')) singular.add(`${stem.slice(0, -1)}z`);
      if (stem.endsWith('ion')) singular.add(`${stem.slice(0, -3)}ión`);
      if (stem.endsWith('es')) singular.add(`${stem.slice(0, -2)}és`);
      if (stem.endsWith('an')) singular.add(`${stem.slice(0, -2)}án`);
    }
  }
  for (const s of singular) {
    add(s);
    if (s.endsWith('o')) add(`${s.slice(0, -1)}a`);
    if (s.length <= 3) continue;
    const swap = (from: string, to: string) => {
      if (s.endsWith(from)) add(`${s.slice(0, -from.length)}${to}`);
    };
    swap('a', 'o');
    swap('ora', 'or');
    swap('esa', 'és');
    swap('ana', 'án');
  }
  return [...out];
}

/**
 * Voseo y vosotros: lo que el curso no muestra (la variante enseñada es el español neutro de
 * Latinoamérica, con tú y ustedes). Formas de vos del presente, del imperativo y con enclíticos.
 */
const VOSEO = new Set([
  'vos',
  'sos',
  'tenés',
  'querés',
  'podés',
  'sabés',
  'venís',
  'decís',
  'hacés',
  'ponés',
  'salís',
  'pedís',
  'dormís',
  'volvés',
  'pensás',
  'entendés',
  'encontrás',
  'conocés',
  'necesitás',
  'llegás',
  'comprás',
  'pagás',
  'viajás',
  'cocinás',
  'caminás',
  'preguntás',
  'ayudás',
  'olvidás',
  'recordás',
  'llamás',
  'trabajás',
  'dedicás',
  'comés',
  'preferís',
  'quedás',
  'jugás',
  'usás',
  'sentís',
  'levantás',
  'buscás',
  'acostás',
  'empezás',
  'vivís',
  'escuchás',
  'hablás',
  'terminás',
  'cenás',
  'bailás',
  'tocás',
  'estudiás',
  'contás',
  'mandás',
  'llevás',
  'acabás',
  'devolvés',
  'traés',
  'mirás',
  'tomás',
  'leés',
  'escribís',
  'abrís',
  'doblá',
  'tomá',
  'traé',
  'mandá',
  'disculpá',
  'descansá',
  'mirá',
  'esperá',
  'vení',
  'andá',
  'poné',
  'hacé',
  'decí',
  'probá',
  'preguntá',
  'llamá',
  'tomés',
  'llamame',
  'decime',
  'contame',
  'fijate',
  'sentate',
  'acordate',
  'avisame',
  'pasame',
  'escribime',
  'vosotros',
  'vosotras',
  'os',
  'sois',
]);

/**
 * Léxico propio del Río de la Plata que el curso reemplaza por el panhispánico (autobús, metro,
 * bolígrafo, chaqueta, maleta, mesero, dinero, talla, resfriado, adiós…). Puede ir en las respuestas
 * aceptadas, no en lo que se muestra o se escucha, salvo en `contrast`.
 */
const REGIONAL = new Set([
  'che',
  'dale',
  'colectivo',
  'colectivos',
  'subte',
  'lapicera',
  'campera',
  'valija',
  'mozo',
  'moza',
  'medialuna',
  'medialunas',
  'pileta',
  'heladera',
  'frutilla',
  'frutillas',
  'manteca',
  'palta',
  'remera',
  'pollera',
  'living',
  'morocho',
  'laburo',
  'pibe',
  'plata',
  'talle',
  'resfrío',
  'jugoso',
  'chau',
]);

/**
 * ¿Es voseo, vosotros o léxico rioplatense? La lista fija, las terminaciones de vosotros (habláis,
 * tenéis) y el voseo regular de una forma de tú ya enseñada (hablas → hablás, comes → comés, vives →
 * vivís), salvo que la forma acentuada sea otra palabra conocida (estás, inglés, después) o un nombre.
 */
function isVoseo(token: string, known: (t: string) => boolean, names: ReadonlySet<string>) {
  if (names.has(token)) return false;
  if (VOSEO.has(token) || REGIONAL.has(token)) return true;
  if (/(áis|éis)$/.test(token)) return true;
  if (token.length < 5 || known(token)) return false;
  const tu = token.endsWith('ás')
    ? `${token.slice(0, -2)}as`
    : token.endsWith('és') || token.endsWith('ís')
      ? `${token.slice(0, -2)}es`
      : null;
  return tu !== null && known(tu);
}

/**
 * Cómo suena una opción en el español latinoamericano: sin tildes de escritura que no cambian el sonido no
 * se tocan (papá / papa se distinguen), pero h muda, b = v, seseo (z, ce, ci = s), yeísmo (ll = y),
 * qu / c = k y gue / gui = g. Dos opciones con la misma clave no se distinguen de oído.
 */
export function soundKey(text: string): string {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[¿?¡!.,;:«»"]/g, '')
    .replace(/ch/g, '§')
    .replace(/h/g, '')
    .replace(/§/g, 'ch')
    .replace(/v/g, 'b')
    .replace(/z/g, 's')
    .replace(/qu([eéií])/g, 'k$1')
    .replace(/gu([eéií])/g, 'G$1')
    .replace(/c([eéií])/g, 's$1')
    .replace(/c/g, 'k')
    .replace(/ll/g, 'y')
    .replace(/g([eéií])/g, 'j$1')
    .replace(/G/g, 'g')
    .replace(/y\b/g, 'i')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Los signos de pregunta y de exclamación se abren y se cierran. */
function badMarks(text: string): string | null {
  const count = (re: RegExp) => (text.match(re) ?? []).length;
  if (count(/¿/g) !== count(/\?/g)) return 'falta abrir o cerrar la pregunta (¿…?)';
  if (count(/¡/g) !== count(/!/g)) return 'falta abrir o cerrar la exclamación (¡…!)';
  return null;
}

const isEsToken = (token: string, known: (form: string) => boolean) => esLemmas(token).some(known);

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(esTokens);

/** Texto en español de un ejercicio (sin las aclaraciones en inglés entre paréntesis). */
const esTexts = (e: ExerciseDef) => englishTexts(e);

function addPathForms(out: Set<string>, p: PathUnit) {
  p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
  p.unit.words.flatMap((w) => esTokens(w.exampleEn)).forEach((t) => out.add(t));
  for (const l of p.lessons) {
    for (const x of l.intro?.examples ?? []) esTokens(x.target).forEach((t) => out.add(t));
    for (const e of l.exercises)
      esTexts(e)
        .flatMap(esTokens)
        .forEach((t) => out.add(t));
  }
}

/** Orden de las unidades: A1 U1–U17 y después A2 U1–U12 (0…28). */
const ORDER = ES_COURSE.flatMap((l) =>
  l.units.map((u) => ({ level: l.level, position: u.unit.position, def: u })),
);
const indexOf = (level: string, position: number) =>
  ORDER.findIndex((o) => o.level === level && o.position === position);
const pathOf = (level: string, position: number) =>
  ES_PATH.find((p) => p.level === level && p.unit.position === position);

/** Formas enseñadas antes de la unidad número `index` (0 = A1 U1): las unidades anteriores. */
export function esTaughtFormsBefore(index: number): Set<string> {
  const out = new Set<string>();
  ORDER.slice(0, Math.max(0, index)).forEach((o) => {
    const p = pathOf(o.level, o.position);
    if (p) addPathForms(out, p);
    o.def.support.forEach((s) => esTokens(s).forEach((t) => out.add(t)));
    o.def.names.forEach((s) => esTokens(s).forEach((t) => out.add(t)));
  });
  return out;
}

const cognate = (w: WordDef) =>
  [w.translation, ...(w.acceptedTranslations ?? [])].map(plain).includes(plain(w.text));

/** Problemas de las unidades. Con `only` (p. ej. «es A1 U5»), sólo los de esa unidad. */
export function esProblems(only?: string): string[] {
  const problems: string[] = [];
  const byId = new Map<string, WordDef>();
  const linkable = new Set(
    ES_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words.map((w) => w.id))),
  );
  const texts = new Map<string, string>();
  const translations = new Map<string, string>();
  const stimuli = new Map<string, string>();

  for (const { level, first, units } of ES_COURSE)
    units.forEach(({ unit, names: unitNames, support, contrast = [] }, ui) => {
      const where = `es ${level} U${unit.position}`;
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
        if (!w.id.startsWith('es-')) report(`${w.id}: falta el prefijo es-`);
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
      const taught = esTaughtFormsBefore(index);
      const supportSet = new Set(support.map((s) => s.normalize('NFC').toLowerCase()));
      if (supportSet.size !== support.length) report(`${where}: apoyo con formas repetidas`);
      const ownForms = new Set([...own.values()].flatMap(formsOf));
      for (const s of supportSet) {
        if (esTokens(s).join(' ') !== s)
          report(`${where}: «${s}» en el apoyo tiene que ser una sola forma (sin apóstrofo)`);
        if (taught.has(s)) report(`${where}: «${s}» ya está enseñada (sacarla del apoyo)`);
        if (ownForms.has(s)) report(`${where}: «${s}» es palabra de la unidad (sacarla del apoyo)`);
      }

      const names = new Set(unitNames.flatMap(esTokens));
      const allowed = (t: string, forms: ReadonlySet<string>) =>
        isEsToken(t, (c) => taught.has(c) || forms.has(c) || names.has(c) || supportSet.has(c));
      // Variante: voseo, vosotros y léxico rioplatense (lista fija y voseo regular de lo enseñado).
      const contrastSet = new Set(contrast.flatMap(esTokens));
      const knownForm = (t: string) =>
        isEsToken(t, (c) => taught.has(c) || ownForms.has(c) || supportSet.has(c));
      const voseoIn = (texts: string[], allowContrast: boolean) =>
        [...new Set(texts.flatMap(esTokens))].filter(
          (t) => isVoseo(t, knownForm, names) && !(allowContrast && contrastSet.has(t)),
        );
      const marksIn = (texts: string[]) =>
        texts.map(badMarks).find((m): m is string => m !== null) ?? null;
      for (const c of contrastSet)
        if (!isVoseo(c, knownForm, new Set()))
          report(`${where}: «${c}» en contrast no es voseo, vosotros ni léxico rioplatense`);
      const introduced = new Set<string>();
      const introducedForms = new Set<string>();
      const unitTokens = new Set<string>();
      const stimulusPrefix = `es.stim.${level.toLowerCase()}-u${unit.position}-`;

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
            !e.id.startsWith('es.')
          )
            report(`${ex}: falta el id propio`);
          if (e.personalData) report(`${ex}: muestra o pide datos personales`);
          const targets = [...e.words, ...(e.concepts ?? [])];
          if (!targets.length) report(`${ex}: sin palabras ni conceptos target`);
          for (const id of targets) {
            if (!byId.has(id)) report(`${ex}: palabra ${id} inexistente`);
            else if (!linkable.has(id)) report(`${ex}: enlaza ${id}, que no es de español`);
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
          const targetTexts = esTexts(e);
          const voseo = voseoIn(targetTexts, false);
          if (voseo.length)
            report(
              `${ex}: voseo, vosotros o regionalismo (el curso enseña tú): ${voseo.join(', ')}`,
            );
          const marks = marksIn([...targetTexts, ...(e.acceptedAnswers ?? [])]);
          if (marks) report(`${ex}: ${marks}`);
          if (e.type === 'order_words' && /^[¿¡]/.test(e.answer))
            report(`${ex}: order_words sin ¿ ni ¡ (la primera ficha delataría el orden)`);
          if (e.type === 'listen_choice') {
            const p = e.payload as { options: string[] };
            const sounds = new Map<string, string>();
            for (const o of p.options) {
              const k = soundKey(o);
              const prev = sounds.get(k);
              if (prev !== undefined)
                report(`${ex}: «${prev}» y «${o}» suenan igual en el español latinoamericano`);
              sounds.set(k, o);
            }
          }
          const tokens = [...new Set(targetTexts.flatMap(esTokens))];
          tokens.forEach((t) => unitTokens.add(t));
          const bad = tokens.filter((t) => !allowed(t, introducedForms));
          if (bad.length) report(`${ex}: vocabulario no enseñado todavía: ${bad.join(', ')}`);
          const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
          if (CONTACT.test(text)) report(`${ex}: dato de contacto`);
          gradingProblems(e, ex).forEach(report);
        });

        const introTokens = [
          ...new Set((lesson.intro?.examples ?? []).flatMap((x) => esTokens(x.target))),
        ];
        introTokens.forEach((t) => unitTokens.add(t));
        const introTexts = (lesson.intro?.examples ?? []).map((x) => x.target);
        const introVoseo = voseoIn(introTexts, true);
        if (introVoseo.length)
          report(
            `${at}: ejemplos con voseo o regionalismo sin declarar en contrast: ${introVoseo.join(', ')}`,
          );
        const introMarks = marksIn(introTexts);
        if (introMarks) report(`${at}: ejemplos: ${introMarks}`);
        const badIntro = introTokens
          .filter((t) => !(contrastSet.has(t) && introTexts.some((x) => esTokens(x).includes(t))))
          .filter((t) => !allowed(t, introducedForms));
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
            l.exercises.map((e, i) => ({ at: `${l.id} e${i + 1}`, texts: esTexts(e) })),
          ),
      ];
      for (const w of unit.words) {
        const m = marksIn([w.text, w.exampleEn, ...(w.acceptedTexts ?? [])]);
        if (m) report(`${w.id}: ${m}`);
        const vo = voseoIn([w.text, w.exampleEn], false);
        if (vo.length)
          report(`${w.id}: voseo o regionalismo en la palabra o el ejemplo: ${vo.join(', ')}`);
      }
      const grammarTexts = (unit.grammar?.examples ?? []).map((x) => x.target);
      const grammarVoseo = voseoIn(grammarTexts, true);
      if (grammarVoseo.length)
        report(
          `${where} gramática: voseo o regionalismo sin declarar en contrast: ${grammarVoseo.join(', ')}`,
        );
      const grammarMarks = marksIn(grammarTexts);
      if (grammarMarks) report(`${where} gramática: ${grammarMarks}`);
      for (const l of generated?.lessons ?? [])
        if (l.kind !== 'lesson')
          l.exercises.forEach((e, i) => {
            const vo = voseoIn(esTexts(e), false);
            if (vo.length) report(`${l.id} e${i + 1}: voseo o regionalismo: ${vo.join(', ')}`);
          });
      for (const { at, texts: t } of extra) {
        const toks = [...new Set(t.flatMap(esTokens))];
        toks.forEach((x) => unitTokens.add(x));
        const bad = toks
          .filter((x) => !(at.endsWith('gramática') && contrastSet.has(x)))
          .filter((x) => !allowed(x, ownForms));
        if (bad.length) report(`${at}: vocabulario fuera de la unidad: ${bad.join(', ')}`);
      }

      // Repasos generados: sin traducir cognados (no → no no enseña nada).
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

      const used = new Set([...unitTokens].flatMap((t) => esLemmas(t)));
      for (const s of supportSet)
        if (!used.has(s)) report(`${where}: la forma de apoyo «${s}» no se usa`);
    });
  return problems;
}

/** Lo enseñado hasta la unidad de la lección tras la que se ofrece una tarea (incluida). */
function taughtForLesson(lesson: string): Set<string> | null {
  const m = /^es-(a[12])-u(\d{2})-/.exec(lesson);
  if (!m) return null;
  const index = indexOf(m[1]!.toUpperCase(), Number(m[2]));
  return index >= 0 ? esTaughtFormsBefore(index + 1) : null;
}

/** Problemas de la escritura: definición, lección existente y vocabulario enseñado. */
export function esWritingProblems(): string[] {
  const problems: string[] = [];
  const lessons = new Set(ES_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
  const ids = new Set<string>();
  for (const task of ES_WRITING_TASKS) {
    problems.push(...writingTaskProblems(task));
    if (ids.has(task.id)) problems.push(`${task.id}: id repetido`);
    ids.add(task.id);
    if (task.language !== 'es' || !/^es\.a[12]\.wt\./.test(task.id))
      problems.push(`${task.id}: no es una tarea de español A1/A2`);
    if (!task.lesson || !lessons.has(task.lesson)) {
      problems.push(`${task.id}: la lección ${task.lesson} no existe`);
      continue;
    }
    if (!task.id.startsWith(`es.${task.lesson.slice(3, 5)}.`))
      problems.push(`${task.id}: el nivel del id no es el de su lección`);
    const taught = taughtForLesson(task.lesson)!;
    const glossary = new Set(
      (task.glossary ?? []).flatMap((g) => writingTokens(g.term)).flatMap(esTokens),
    );
    const bad = [...new Set([task.model, ...task.prompts].flatMap(esTokens))].filter(
      (t) => !glossary.has(t) && !isEsToken(t, (c) => taught.has(c)),
    );
    if (bad.length) problems.push(`${task.id}: vocabulario no enseñado: ${bad.join(', ')}`);
    const known = (t: string) => isEsToken(t, (c) => taught.has(c) || glossary.has(c));
    const voseo = [...new Set([task.model, ...task.prompts].flatMap(esTokens))].filter((t) =>
      isVoseo(t, known, new Set()),
    );
    if (voseo.length)
      problems.push(`${task.id}: voseo o regionalismo (el curso enseña tú): ${voseo.join(', ')}`);
  }
  return problems;
}
