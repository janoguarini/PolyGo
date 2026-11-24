import {
  COMPREHENSION_PATH,
  CONTEXT_LESSONS,
  lemmaCandidates,
  stimulusNames,
  stimulusText,
  taughtTokens,
  tokensOfText,
} from './comprehension';
import {
  COMPREHENSION_CODES,
  EN_A1_COMPREHENSION_MAP,
  RETIRED_COMPREHENSION_CODES,
} from './comprehension-map';
import { COURSES, type PathUnit } from './index';
import { CONTENT_PERSONAS, personaProblems } from './personas';
import {
  STIMULUS_VISUAL_SPECS,
  visualFor,
  visualSpecProblems,
  type StimulusVisualSpec,
} from './stimulus-visuals';
import type { Level } from './types';

const STIMULUS_ID = /^([a-z]{2,3})\.stim\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Datos de contacto que un estímulo nunca muestra (§13.2): correos, teléfonos, direcciones web. */
const CONTACT_DATA = /@|https?:|www\.|\d[\d\s-]{5,}\d/i;
const nfc = (s: string) => s === s.normalize('NFC');
const plainEs = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,:;«»"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Velocidad admitida para A1: un poco más lenta que la normal, nunca acelerada. */
export const A1_RATE_RANGE = [0.75, 0.9] as const;

/**
 * Problemas del contenido de la fase C (vacío = válido). Lo usan
 * content/__tests__/comprehension.test.ts y scripts/build-comprehension-sql.ts antes de escribir la
 * migración. Reglas en docs/LEARNING_PHASE_C.md §6.
 */
export function comprehensionProblems(
  path: readonly PathUnit[] = COMPREHENSION_PATH,
  contextLessons: typeof CONTEXT_LESSONS = CONTEXT_LESSONS,
  visualSpecs: readonly StimulusVisualSpec[] = STIMULUS_VISUAL_SPECS,
): string[] {
  const problems: string[] = [];
  const stimuli = new Map<string, string>();
  const wordUnit = new Map<string, { language: string; level: Level; unit: number }>();
  for (const { language, levels } of COURSES) {
    for (const { level, units } of levels) {
      for (const u of units) {
        for (const w of u.words) wordUnit.set(w.id, { language, level, unit: u.position });
      }
    }
  }

  for (const { language, level, unit, lessons } of path) {
    const def = contextLessons.find(
      (c) => c.language === language && c.level === level,
    )?.lessons.find((l) => l.unit === unit.position);
    const lessonsOf = contextLessons.find((c) => c.language === language && c.level === level);
    const planned = lessonsOf?.plannedUnits.find((u) => u.position === unit.position);
    // Vocabulario enseñado: hasta la propia unidad, o hasta la que precede a una planificada.
    const through = planned?.after ?? unit.position;
    if (planned && planned.after >= unit.position)
      problems.push(`U${unit.position}: tiene que ir después de una unidad anterior (after)`);
    const writtenUnits =
      COURSES.find((c) => c.language === language)?.levels.find((l) => l.level === level)?.units ??
      [];
    if (planned && writtenUnits.some((u) => u.position === unit.position))
      problems.push(`U${unit.position}: planificada, pero ya tiene lecciones escritas`);
    if (planned && !writtenUnits.some((u) => u.position === planned.after))
      problems.push(`U${unit.position}: after = U${planned.after} no es una unidad escrita`);

    // Persona ficticia de la lección (C.2): existe, es del idioma y pasa la revisión de privacidad.
    const persona = def?.persona ? CONTENT_PERSONAS.find((p) => p.id === def.persona) : undefined;
    if (def?.persona && !persona)
      problems.push(`${def.persona}: la persona de la lección no está en content/personas.ts`);
    if (persona && persona.language !== language)
      problems.push(`${persona.id}: la persona no es de ${language}`);
    if (persona) problems.push(...personaProblems(persona));
    const personaTokens = new Set(persona ? tokensOfText(persona.displayName) : []);
    for (const t of personaTokens)
      if (!(def?.names ?? []).flatMap(tokensOfText).includes(t))
        problems.push(`${persona!.id}: el nombre «${t}» no está declarado en names`);
    /** El texto sin los datos de contacto y la ciudad de la persona (son datos, no vocabulario). */
    const withoutPersonaContact = (text: string) =>
      persona
        ? [persona.email, persona.phone, persona.city].reduce((t, v) => t.split(v).join(' '), text)
        : text;

    for (const lesson of lessons) {
      const where = lesson.id;
      if (lesson.kind !== 'context') problems.push(`${where}: no es una lección «En contexto»`);
      if (!def) problems.push(`${where}: sin definición`);
      if (def && def.status !== 'draft') problems.push(`${where}: sólo se admite el estado draft`);
      const n = lesson.exercises.length;
      if (n < 6 || n > 10) problems.push(`${where}: ${n} ejercicios (6–10)`);
      const byStimulus = new Map<string, number>();
      const kindOf = new Map<string, 'reading' | 'listening'>();
      const seenTokens = new Set<string>();

      lesson.exercises.forEach((e, i) => {
        const at = `${where}-e${String(i + 1).padStart(2, '0')}`;
        const p = e.payload;
        if (e.type !== 'context_choice' || p.type !== 'context_choice') {
          problems.push(`${at}: sólo ejercicios context_choice`);
          return;
        }
        const s = p.stimulus;
        kindOf.set(s.id, s.kind);
        const reading = s.kind === 'reading';
        const mode = reading ? 'reading_comprehension' : 'listening_comprehension';
        if (e.mode !== mode) problems.push(`${at}: modo ${String(e.mode)}, se esperaba ${mode}`);
        if (e.skill !== (reading ? 'reading' : 'listening'))
          problems.push(`${at}: skill ${e.skill} no corresponde al estímulo`);
        if (e.words.length)
          problems.push(`${at}: words tiene que estar vacío (no alimenta el SRS léxico)`);
        // Datos personales: sólo los de la persona ficticia de la lección (C.2), nunca del alumno.
        if (persona) {
          const cited = e.personalData;
          if (!cited || cited === 'learner' || cited.persona !== persona.id)
            problems.push(`${at}: tiene que citar la persona de la lección (${persona.id})`);
        } else if (e.personalData) problems.push(`${at}: no pide datos personales`);
        if (!e.explanation?.trim())
          problems.push(`${at}: falta la explicación (evidencia en el estímulo)`);

        // Conceptos target: palabras del idioma y nivel, ya enseñadas en esta unidad o antes.
        const concepts = e.concepts ?? [];
        if (!concepts.length) problems.push(`${at}: sin conceptos target`);
        if (new Set(concepts).size !== concepts.length) problems.push(`${at}: conceptos repetidos`);
        for (const c of concepts) {
          const w = wordUnit.get(c);
          if (!w) problems.push(`${at}: concepto ${c} inexistente`);
          else if (w.language !== language || w.level !== level || w.unit > through)
            problems.push(
              `${at}: concepto ${c} no está enseñado hasta ${language} ${level} U${through}`,
            );
        }

        // Opciones: 3–4, únicas (también sin tildes ni mayúsculas), con la respuesta una sola vez.
        const opts = p.options;
        if (opts.length < 3 || opts.length > 4) problems.push(`${at}: ${opts.length} opciones (3–4)`);
        if (new Set(opts.map(plainEs)).size !== opts.length)
          problems.push(`${at}: opciones repetidas`);
        if (opts.filter((o) => o === e.answer).length !== 1)
          problems.push(`${at}: la respuesta no está exactamente una vez entre las opciones`);
        if (!p.question.trim().endsWith('?'))
          problems.push(`${at}: la pregunta tiene que terminar en «?»`);

        // Comprensión, no búsqueda de una cadena: si la respuesta aparece tal cual en el estímulo,
        // al menos un distractor también aparece (hay que entender cuál corresponde).
        const text = stimulusText(s).toLowerCase();
        const inText = (o: string) => text.includes(o.toLowerCase());
        if (inText(e.answer) && !opts.some((o) => o !== e.answer && inText(o)))
          problems.push(`${at}: la respuesta se encuentra copiando el estímulo`);

        // Texto: NFC y sin datos de contacto.
        const all = [
          p.question,
          e.answer,
          e.prompt,
          e.explanation ?? '',
          ...opts,
          s.setting,
          stimulusText(s),
          ...stimulusNames(s),
        ];
        if (!all.every(nfc)) problems.push(`${at}: texto fuera de NFC`);
        // Los únicos datos de contacto admitidos son los de la persona ficticia de la lección.
        const shown = withoutPersonaContact(stimulusText(s));
        if (CONTACT_DATA.test(shown) || CONTACT_DATA.test(stimulusNames(s).join(' ')))
          problems.push(`${at}: el estímulo muestra datos de contacto`);

        // Estímulo: id estable; mismo id ⇔ mismo contenido.
        const m = STIMULUS_ID.exec(s.id);
        if (!m || m[1] !== language) problems.push(`${at}: id de estímulo ${s.id} inválido`);
        const key = JSON.stringify(s);
        const prev = stimuli.get(s.id);
        if (prev !== undefined && prev !== key)
          problems.push(`${at}: el estímulo ${s.id} cambia entre preguntas`);
        stimuli.set(s.id, key);

        // Imagen de apoyo (fase C.9.1): sólo la de su ficha, con el hash del recurso definitivo. Si se
        // ve antes de responder, su descripción no da la respuesta (misma regla que el texto). La
        // ficha se revisa aunque el recurso todavía no exista.
        if (s.visual && JSON.stringify(s.visual) !== JSON.stringify(visualFor(s.id, visualSpecs)))
          problems.push(`${at}: la imagen no es la de content/stimulus-visuals.ts`);
        const spec = visualSpecs.find((v) => v.stimuli.includes(s.id));
        if (spec?.visual.display === 'with_stimulus') {
          const alt = plainEs(spec.visual.alt);
          const inAlt = (o: string) => alt.includes(plainEs(o));
          if (inAlt(e.answer) && !opts.some((o) => o !== e.answer && inAlt(o)))
            problems.push(`${at}: la descripción de la imagen da la respuesta`);
        }
        byStimulus.set(s.id, (byStimulus.get(s.id) ?? 0) + 1);
        if (!s.setting.trim()) problems.push(`${at}: falta la situación del estímulo`);

        if (s.kind === 'reading') {
          if (!s.lines.length || s.lines.some((l) => !l.trim())) problems.push(`${at}: texto vacío`);
        } else {
          const names = s.speakers.map((x) => x.name);
          if (new Set(names).size !== names.length) problems.push(`${at}: hablantes repetidos`);
          if (s.lines.some((l) => !names.includes(l.speaker)))
            problems.push(`${at}: una línea es de un hablante que no está en speakers`);
          if (names.length > 1 && new Set(s.speakers.map((x) => x.voice)).size < 2)
            problems.push(`${at}: un diálogo usa dos voces distintas`);
          if (s.rate < A1_RATE_RANGE[0] || s.rate > A1_RATE_RANGE[1])
            problems.push(`${at}: velocidad ${s.rate} fuera de A1 (${A1_RATE_RANGE.join('–')})`);
          if (!s.lines.length || s.lines.some((l) => !l.text.trim()))
            problems.push(`${at}: transcripción vacía`);
        }

        const names = new Set([...stimulusNames(s), ...(def?.names ?? [])].flatMap(tokensOfText));
        for (const t of tokensOfText(shown)) if (!names.has(t)) seenTokens.add(t);
        // Cada nombre que aparece (emisor, destinatario, hablante) está declarado en `names`.
        const declared = new Set((def?.names ?? []).flatMap(tokensOfText));
        for (const n of stimulusNames(s).flatMap(tokensOfText))
          if (!declared.has(n) && n !== 'ms' && n !== 'anuncio')
            problems.push(`${at}: el nombre «${n}» no está declarado en names`);
      });

      for (const [id, count] of byStimulus)
        if (count < 2 || count > 4)
          problems.push(`${where}: el estímulo ${id} tiene ${count} preguntas (2–4)`);

      // Mapa curricular: objetivos principales, objetivo de cada estímulo y número de lección.
      if (def) {
        const primary = def.curriculum.primary;
        if (!primary.length) problems.push(`${where}: sin objetivos principales del mapa`);
        if (new Set(primary).size !== primary.length)
          problems.push(`${where}: objetivos principales repetidos`);
        for (const code of primary) {
          if (RETIRED_COMPREHENSION_CODES.includes(code))
            problems.push(`${where}: ${code} está retirado y no se reutiliza`);
          else if (!(COMPREHENSION_CODES as readonly string[]).includes(code))
            problems.push(`${where}: objetivo ${code} inexistente en el mapa`);
        }
        const assigned = new Set<string>();
        for (const [stimulus, code] of Object.entries(def.stimulusObjectives)) {
          const kind = kindOf.get(stimulus);
          if (!kind) {
            problems.push(`${where}: stimulusObjectives nombra un estímulo que no está (${stimulus})`);
            continue;
          }
          assigned.add(stimulus);
          if (!primary.includes(code))
            problems.push(`${where}: ${stimulus} evalúa ${code}, que no es principal en el mapa`);
          else if (EN_A1_COMPREHENSION_MAP[code]?.activity !== kind)
            problems.push(`${where}: ${stimulus} es de ${kind} y ${code} no`);
        }
        for (const s of kindOf.keys())
          if (!assigned.has(s)) problems.push(`${where}: el estímulo ${s} no tiene objetivo del mapa`);
        for (const code of primary)
          if (!Object.values(def.stimulusObjectives).includes(code))
            problems.push(`${where}: el objetivo principal ${code} no tiene ningún estímulo`);
        const written =
          COURSES.find((c) => c.language === language)
            ?.levels.find((l) => l.level === level)
            ?.units.find((u) => u.position === unit.position)?.lessons.length ?? 0;
        const expected = written + 1 + def.plannedBefore.length;
        if (planned && JSON.stringify(def.plannedBefore) !== JSON.stringify(planned.plannedLessons))
          problems.push(`${where}: plannedBefore no coincide con las lecciones planificadas de la unidad`);
        if (def.curriculumLesson !== expected)
          problems.push(
            `${where}: es L${def.curriculumLesson} en el mapa, pero sigue a ${written} lecciones escritas y ${def.plannedBefore.length} planificadas (L${expected})`,
          );
      }

      // Vocabulario: lo no enseñado hasta esta unidad tiene que estar declarado en `untaught`.
      if (def) {
        const taught = taughtTokens(language, level, through);
        const missing = [...seenTokens]
          .filter((t) => !lemmaCandidates(t).some((c) => taught.has(c)))
          .sort();
        const declared = [...def.untaught].sort();
        if (JSON.stringify(missing) !== JSON.stringify(declared))
          problems.push(
            `${where}: untaught tiene que ser ${JSON.stringify(missing)} (declarado: ${JSON.stringify(declared)})`,
          );
      }
    }
  }
  return problems;
}

/**
 * Fichas de imágenes (fase C.9.1) contra los estímulos que existen. Aparte de comprehensionProblems,
 * que también se usa con recorridos parciales en las pruebas.
 */
export function stimulusVisualProblems(path: readonly PathUnit[] = COMPREHENSION_PATH): string[] {
  const kinds = new Map<string, 'reading' | 'listening'>();
  for (const { lessons } of path)
    for (const l of lessons)
      for (const e of l.exercises)
        if (e.payload.type === 'context_choice')
          kinds.set(e.payload.stimulus.id, e.payload.stimulus.kind);
  return visualSpecProblems(STIMULUS_VISUAL_SPECS, kinds);
}
