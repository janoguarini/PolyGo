/// <reference types="node" />
// Lee las migraciones generadas: necesita los tipos de Node.
import { applyNeutralPatch } from '../../scripts/neutral-patch';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { contentDocument } from '../../scripts/content-document';
import { checkAnswer } from '../../shared/answers';
import {
  answerKindFor,
  EXERCISE_TYPES,
  type Exercise,
  type ExercisePayload,
  type UserAnswer,
} from '../../shared/exercises';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { CURRICULUM_PATH } from '..';
import { canonicalHash, canonicalJson } from '../canonical-json';
import { INLINE_OPTION_ITEMS } from '../inline-option-items';
import { VARIABLE_OPTION_ITEMS } from '../variable-options';
import {
  buildVersions,
  contentsByItem,
  GENERATORS,
  hashInputOf,
  optionsOutsideVersion,
  versionHash,
  type VersionRow,
  versionContentOf,
  withoutOptions,
} from '../versions';

/**
 * Versiones de los ítems (decisiones V1–V6, docs/EXERCISE_ITEM_VERSIONS_PENDING.md): serialización
 * canónica, hash, deduplicación, copias de la consolidación, distractores variables (V5), migraciones generadas
 * y equivalencia del corrector por grading_spec con checkAnswer en todas las versiones.
 */

/**
 * Tipos del currículo publicado. `context_choice` (fase C) no está en CURRICULUM_PATH a propósito: sus
 * versiones y la equivalencia gradeWithSpec ≡ checkAnswer las prueba content/__tests__/comprehension.test.ts.
 */
const CURRICULUM_TYPES = EXERCISE_TYPES.filter((t) => t !== 'context_choice');

const MIGRATIONS = join(__dirname, '..', '..', 'supabase', 'migrations');
const VERSION_FILES = ['en', 'it', 'pt', 'zh'].map(
  (l, i) => `2026110812010${i + 1}_learning_item_versions_${l}.sql`,
);

const document = contentDocument(CURRICULUM_PATH);
const { catalog, exercises, versions } = document;
const items = new Map(catalog.items.map((i) => [i.id, i]));
const rows = new Map(exercises.map((e) => [e.id, e]));
const placementOf = new Map(catalog.placements.map((p) => [p.exercise_id, p]));

// --- JSON canónico (V3) -------------------------------------------------------------------------

describe('JSON canónico RFC 8785', () => {
  it('ejemplo de RFC 8785 §3.2.2', () => {
    const input = JSON.parse(
      '{"numbers":[333333333.33333329,1E30,4.50,2e-3,0.000000000000000000000000001],' +
        '"string":"\\u20ac$\\u000F\\u000aA\'\\u0042\\u0022\\u005c\\\\\\"\\/","literals":[null,true,false]}',
    );
    expect(canonicalJson(input)).toBe(
      '{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],' +
        '"string":"€$\\u000f\\nA\'B\\"\\\\\\\\\\"/"}',
    );
  });

  it('ordena las claves por unidades de código UTF-16 (RFC 8785 §3.2.3), después de NFC', () => {
    const cp = (...points: number[]) => String.fromCodePoint(...points);
    const [euro, cr, dalet, one, smile, c80, oUml] = [
      cp(0x20ac),
      cp(0x0d),
      cp(0xfb33), // NFC: U+05D3 U+05BC (exclusión de composición)
      '1',
      cp(0x1f600),
      cp(0x80),
      cp(0xf6),
    ];
    const obj = Object.fromEntries([euro, cr, dalet, one, smile, c80, oUml].map((k, i) => [k, i]));
    const nfcDalet = cp(0x5d3, 0x5bc);
    const expected: [string, number][] = [
      [cr, 1],
      [one, 3],
      [c80, 5],
      [oUml, 6],
      [nfcDalet, 2],
      [euro, 0],
      [smile, 4],
    ];
    const text = (entries: [string, number][]) =>
      `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${v}`).join(',')}}`;
    expect(canonicalJson(obj)).toBe(text(expected));
    // Sin la clave que NFC cambia, es el orden exacto del ejemplo de la RFC.
    const { [dalet]: _, ...rfc } = obj;
    expect(canonicalJson(rfc)).toBe(text(expected.filter(([k]) => k !== nfcDalet)));
  });

  it('NFC, null explícito, arrays en orden; rechaza undefined, no finitos y sustitutos sueltos', () => {
    expect(canonicalHash({ a: 'é' })).toBe(canonicalHash({ a: 'é' }));
    const composed = String.fromCodePoint(0xe9);
    const decomposed = String.fromCodePoint(0x65, 0x301);
    expect(canonicalHash({ a: decomposed })).toBe(canonicalHash({ a: composed }));
    expect(canonicalJson({ [decomposed]: decomposed })).toBe(`{"${composed}":"${composed}"}`);
    expect(canonicalJson({ a: null })).toBe('{"a":null}');
    expect(canonicalHash({ a: null })).not.toBe(canonicalHash({}));
    expect(canonicalHash(['a', 'b'])).not.toBe(canonicalHash(['b', 'a']));
    expect(canonicalJson(-0)).toBe('0');
    expect(() => canonicalJson({ a: undefined })).toThrow(/undefined/);
    expect(() => canonicalJson(Number.NaN)).toThrow(/finito/);
    expect(() => canonicalJson('\ud800')).toThrow(/sustituto/);
    expect(() => canonicalJson(new Date())).toThrow(/no es JSON/);
    expect(canonicalHash({ a: 1 })).toMatch(/^v1:[0-9a-f]{64}$/);
  });
});

// --- Contenido del hash (V3, V6) ----------------------------------------------------------------

describe('qué entra en el hash', () => {
  const v = versions.versions.find((x) => x.accepted_answers.length > 1)!;
  const spec = v.grading_spec;

  it('los siete campos de §5 y grading_spec, nada más', () => {
    expect(Object.keys(hashInputOf(v, spec))).toEqual([
      'prompt_es',
      'payload',
      'answer',
      'accepted_answers',
      'explanation_es',
      'difficulty',
      'recommended_seconds',
      'grading_spec',
    ]);
  });

  it('cada campo cambia el hash; ubicación, skill, ids y procedencia no', () => {
    const base = versionHash(v, spec);
    const changes: Partial<VersionRow>[] = [
      { prompt_es: v.prompt_es + ' ' },
      { payload: { ...(v.payload as object), extra: null } },
      { answer: v.answer + 'x' },
      { accepted_answers: [...v.accepted_answers, 'x'] },
      { explanation_es: v.explanation_es === null ? 'x' : null },
      { difficulty: v.difficulty + 1 },
      { recommended_seconds: v.recommended_seconds + 1 },
    ];
    for (const c of changes) expect(versionHash({ ...v, ...c }, spec)).not.toBe(base);
    expect(versionHash(v, { ...spec, mode_version: 2 } as never)).not.toBe(base);
    const extra = {
      ...v,
      id: 'otro',
      lesson_id: 'x',
      position: 9,
      skill: 'grammar',
      is_published: false,
    };
    expect(versionHash(extra, spec)).toBe(base);
    const provenance: VersionRow = { ...v, generator: 'x', generator_version: '9' };
    expect(versionHash(provenance, spec)).toBe(base);
  });

  it('accepted_answers conserva el orden fuente; answer sigue siendo la principal', () => {
    const reordered = { ...v, accepted_answers: [...v.accepted_answers].reverse() };
    expect(versionHash(reordered, spec)).not.toBe(versionHash(v, spec));
    const ex = rows.get(
      versions.placement_versions.find((p) => p.item_id === v.item_id)!.exercise_id,
    )!;
    expect(v.accepted_answers).toEqual(ex.accepted_answers);
    expect(v.answer).toBe(ex.answer);
  });
});

// --- Versiones del currículo --------------------------------------------------------------------

describe('versiones de los 4.198 ítems', () => {
  const variable = new Set(VARIABLE_OPTION_ITEMS);
  const variablePlacements = versions.variable_options.reduce((n, h) => n + h.exercises.length, 0);

  it('una versión por ítem, también los 176 de distractores variables con sus 371 ubicaciones', () => {
    expect(catalog.items).toHaveLength(4198);
    expect(versions.versions).toHaveLength(4198);
    expect(versions.current_versions).toHaveLength(4198);
    expect(versions.variable_options).toHaveLength(176);
    expect(variablePlacements).toBe(371);
    expect(versions.placement_versions).toHaveLength(5410);
    const keys = versions.versions.map((v) => `${v.item_id}|${v.content_hash}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(versions.versions.map((v) => v.item_id)).size).toBe(4198);
    expect(versions.variable_options.map((h) => h.item_id).sort()).toEqual(
      [...VARIABLE_OPTION_ITEMS].sort(),
    );
  });

  it('V5 (a): la versión de los 176 no tiene payload.options; el resto sí, si es de elección', () => {
    for (const v of versions.versions) {
      const payload = v.payload as Record<string, unknown>;
      const choice = gradingSpecFor(items.get(v.item_id)!.type).mode === 'exact_option';
      expect('options' in payload).toBe(choice && !variable.has(v.item_id));
    }
    // Fuera de las opciones, todas las ubicaciones de cada uno publican lo mismo.
    for (const h of versions.variable_options) {
      const shapes = new Set(
        h.exercises.map((id) => JSON.stringify(withoutOptions(versionContentOf(rows.get(id)!)))),
      );
      expect(shapes.size).toBe(1);
    }
  });

  it('la lista retenida es exactamente la medida: ítems generados con más de un contenido', () => {
    const byItem = contentsByItem(catalog, exercises);
    const multi = [...byItem].filter(([, c]) => c.length > 1);
    expect(multi.map(([id]) => id).sort()).toEqual([...VARIABLE_OPTION_ITEMS].sort());
    const tally = (xs: string[]) =>
      xs.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {});
    expect(tally(multi.map(([id]) => items.get(id)!.type))).toEqual({
      translation_choice: 89,
      listen_choice: 87,
    });
    expect(tally(multi.map(([, c]) => String(c.length)))).toEqual({
      '2': 161,
      '3': 13,
      '4': 1,
      '6': 1,
    });
    for (const [id] of multi) expect(items.get(id)!.origin).toBe('generated');
  });

  it('cobertura por tipo de ejercicio y origen (las 4.198)', () => {
    const coverage: Record<string, number> = {};
    for (const v of versions.versions) {
      const i = items.get(v.item_id)!;
      coverage[`${i.origin} ${i.type}`] = (coverage[`${i.origin} ${i.type}`] ?? 0) + 1;
    }
    expect(coverage).toEqual({
      'authored complete_word': 26,
      'authored fill_blank': 513,
      'authored image_choice': 250,
      'authored listen_choice': 345,
      'authored match_pairs': 139,
      'authored order_words': 191,
      'authored short_answer': 96,
      'authored translate_write': 459,
      'authored translation_choice': 391,
      'generated complete_word': 205,
      'generated listen_choice': 546,
      'generated match_pairs': 300,
      'generated translate_write': 325,
      'generated translation_choice': 412,
    });
    for (const t of CURRICULUM_TYPES) {
      expect(versions.versions.some((v) => items.get(v.item_id)!.type === t)).toBe(true);
    }
  });

  it('la versión es la copia exacta de cada ubicación, con el grading_spec de su tipo', () => {
    const byHash = new Map(versions.versions.map((v) => [`${v.item_id}|${v.content_hash}`, v]));
    for (const p of versions.placement_versions) {
      const v = byHash.get(`${p.item_id}|${p.content_hash}`)!;
      const e = rows.get(p.exercise_id)!;
      expect(placementOf.get(p.exercise_id)!.item_id).toBe(p.item_id);
      const published = variable.has(p.item_id) ? withoutOptions(e) : e;
      expect({
        prompt_es: v.prompt_es,
        payload: v.payload,
        answer: v.answer,
        accepted_answers: v.accepted_answers,
        explanation_es: v.explanation_es,
        difficulty: v.difficulty,
        recommended_seconds: v.recommended_seconds,
      }).toEqual(
        JSON.parse(
          JSON.stringify({
            prompt_es: published.prompt_es,
            payload: published.payload,
            answer: published.answer,
            accepted_answers: published.accepted_answers,
            explanation_es: published.explanation_es,
            difficulty: published.difficulty,
            recommended_seconds: published.recommended_seconds,
          }),
        ),
      );
      const item = items.get(p.item_id)!;
      expect(v.grading_spec).toEqual(gradingSpecFor(item.type, item.assessment_mode));
    }
    for (const c of versions.current_versions) {
      expect(byHash.has(`${c.item_id}|${c.content_hash}`)).toBe(true);
    }
  });

  it('las 948 copias de la consolidación comparten la versión de su escrito original', () => {
    const hashOf = new Map(versions.placement_versions.map((p) => [p.exercise_id, p.content_hash]));
    const authoredAt = new Map(
      catalog.placements
        .filter((p) => p.kind === 'authored')
        .map((p) => [p.item_id, p.exercise_id]),
    );
    const copies = catalog.placements.filter((p) => p.kind === 'copy');
    expect(copies).toHaveLength(948);
    for (const c of copies) {
      const original = authoredAt.get(c.item_id)!;
      expect(hashOf.get(c.exercise_id)).toBeDefined();
      expect(hashOf.get(c.exercise_id)).toBe(hashOf.get(original));
    }
  });

  it('procedencia: sólo los generados tienen generator y generator_version (V6)', () => {
    for (const v of versions.versions) {
      const i = items.get(v.item_id)!;
      if (i.origin === 'authored') expect([v.generator, v.generator_version]).toEqual([null, null]);
      else {
        expect(v.generator).toBe(GENERATORS[i.type]!.generator);
        expect(v.generator_version).toBe(GENERATORS[i.type]!.version);
      }
    }
  });

  it('un ítem con dos contenidos que conserva las opciones en la versión hace fallar la construcción', () => {
    // Sin la lista, los 176 caerían en la regla de los generados de elección: para probar el guardia
    // se los trata como si conservaran las opciones en la versión (como los 782).
    expect(() =>
      buildVersions(catalog, exercises, [], [...INLINE_OPTION_ITEMS, ...VARIABLE_OPTION_ITEMS]),
    ).toThrow(/contenidos publicados a la vez/);
  });

  it('es determinista', () => {
    expect(JSON.stringify(buildVersions(catalog, exercises))).toBe(JSON.stringify(versions));
  });
});

// --- Migraciones generadas (V4) ------------------------------------------------------------------

describe('migraciones de versiones', () => {
  // Lo que dejan en la base las cargas históricas más la corrección de español neutro
  // (scripts/neutral-patch.ts, 20270104120000_neutral_spanish_content).
  const payloads = VERSION_FILES.map(
    (f) =>
      applyNeutralPatch(
        JSON.parse(
          /\$content\$([\s\S]*?)\$content\$/.exec(readFileSync(join(MIGRATIONS, f), 'utf8'))![1]!,
        ),
      ).catalog as {
        versions: VersionRow[];
        current_versions: { item_id: string; content_hash: string }[];
        placement_versions: { exercise_id: string; item_id: string; content_hash: string }[];
      },
  );
  const written = {
    versions: payloads.flatMap((p) => p.versions),
    current_versions: payloads.flatMap((p) => p.current_versions),
    placement_versions: payloads.flatMap((p) => p.placement_versions),
  };

  it('traen exactamente las versiones del contenido actual', () => {
    const sortBy = <T>(xs: T[], key: (x: T) => string) =>
      [...xs].sort((a, b) => (key(a) < key(b) ? -1 : 1));
    expect(sortBy(written.versions, (v) => v.item_id)).toEqual(
      sortBy(versions.versions, (v) => v.item_id),
    );
    expect(sortBy(written.current_versions, (v) => v.item_id)).toEqual(
      sortBy(versions.current_versions, (v) => v.item_id),
    );
    expect(sortBy(written.placement_versions, (p) => p.exercise_id)).toEqual(
      sortBy(versions.placement_versions, (p) => p.exercise_id),
    );
  });

  it('cada hash se recalcula igual desde la fila escrita (Node, sin SQL)', () => {
    for (const v of written.versions) expect(versionHash(v, v.grading_spec)).toBe(v.content_hash);
  });
});

// --- Equivalencia del corrector (V1) --------------------------------------------------------------

/** Respuestas de prueba de una versión, del tipo que corresponde al ejercicio. */
function answersFor(
  v: VersionRow,
  type: (typeof EXERCISE_TYPES)[number],
  other: string,
): UserAnswer[] {
  const p = v.payload as ExercisePayload;
  switch (answerKindFor(type)) {
    case 'option': {
      const options = 'options' in p ? p.options : [];
      return [...options, v.answer, `${v.answer} `, v.answer.toUpperCase(), other, ''].map(
        (value) => ({
          kind: 'option' as const,
          value,
        }),
      );
    }
    case 'text': {
      const variants = [v.answer, ...v.accepted_answers];
      const out = variants.flatMap((a) => {
        const mid = Math.floor(a.length / 2);
        return [
          a,
          a.toUpperCase(),
          `¿${a}?`,
          `${a}.`,
          `  ${a.replace(/ /g, '  ')}  `,
          a.slice(0, -1),
          a.slice(0, mid) + 'q' + a.slice(mid + 1),
          a.slice(0, mid) + a.slice(mid + 1),
          a.replace(/'/g, '’'),
          a.normalize('NFD'),
        ];
      });
      return [...out, other, '', ' '].map((value) => ({ kind: 'text' as const, value }));
    }
    case 'tokens': {
      const tokens = 'tokens' in p ? p.tokens : [];
      const words = v.answer.split(' ');
      return [tokens, words, [...words].reverse(), words.slice(0, -1), [...words, 'x'], []].map(
        (value) => ({ kind: 'tokens' as const, value }),
      );
    }
    case 'pairs': {
      const pairs = 'pairs' in p ? p.pairs : [];
      const rotated = pairs.map((x, i) => ({
        left: x.left,
        right: pairs[(i + 1) % pairs.length]!.right,
      }));
      return [pairs, [...pairs].reverse(), rotated, pairs.slice(1), [...pairs, pairs[0]!], []].map(
        (value) => ({ kind: 'pairs' as const, value }),
      );
    }
  }
}

describe('grading_spec ≡ checkAnswer en todas las versiones', () => {
  it('mismo veredicto para cada respuesta de prueba, en los nueve tipos', () => {
    let checked = 0;
    const byType: Record<string, number> = {};
    const others = versions.versions.map((v) => v.answer);
    versions.versions.forEach((v, n) => {
      const item = items.get(v.item_id)!;
      const exercise: Exercise = {
        id: v.item_id,
        lessonId: null,
        position: 1,
        type: item.type,
        skill: 'vocabulary',
        prompt: v.prompt_es,
        payload: v.payload as ExercisePayload,
        answer: v.answer,
        acceptedAnswers: v.accepted_answers,
        explanation: v.explanation_es,
        difficulty: v.difficulty,
        recommendedSeconds: v.recommended_seconds,
        wordIds: [],
      };
      const other = others[(n + 1) % others.length]!;
      for (const a of answersFor(v, item.type, other)) {
        const expected = checkAnswer(exercise, a);
        const actual = gradeWithSpec(v.grading_spec, v, a);
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(
            `${v.item_id} ${JSON.stringify(a)}: spec ${JSON.stringify(actual)} ≠ checkAnswer ${JSON.stringify(expected)}`,
          );
        }
        checked++;
        byType[item.type] = (byType[item.type] ?? 0) + 1;
      }
    });
    expect(Object.keys(byType).sort()).toEqual([...CURRICULUM_TYPES].sort());
    expect(checked).toBeGreaterThan(40000);
  });

  it('las respuestas de prueba incluyen correctas, tipeos e incorrectas en cada modo', () => {
    const seen = new Set<string>();
    for (const v of versions.versions) {
      const item = items.get(v.item_id)!;
      for (const a of answersFor(v, item.type, 'zzz')) {
        const r = gradeWithSpec(v.grading_spec, v, a);
        seen.add(`${v.grading_spec.mode}:${r.correct ? (r.typo ? 'typo' : 'ok') : 'no'}`);
      }
    }
    expect([...seen].sort()).toEqual([
      'exact_option:no',
      'exact_option:ok',
      'normalized_text:no',
      'normalized_text:ok',
      'normalized_text:typo',
      'pair_set:no',
      'pair_set:ok',
    ]);
  });
});

// --- Generados de elección futuros (decisión del 2026-11-08) -------------------------------------

describe('generados de elección: opciones fuera de la versión salvo los 782 ya cargados', () => {
  const variable = new Set(VARIABLE_OPTION_ITEMS);
  const inline = new Set(INLINE_OPTION_ITEMS);
  const isChoice = (id: string) => gradingSpecFor(items.get(id)!.type).mode === 'exact_option';

  it('la lista congelada: 782 ids ordenados y únicos, generados de elección con opciones en su versión', () => {
    expect(INLINE_OPTION_ITEMS).toHaveLength(782);
    expect(inline.size).toBe(782);
    expect([...INLINE_OPTION_ITEMS].sort()).toEqual(INLINE_OPTION_ITEMS);
    const versionOf = new Map(versions.versions.map((v) => [v.item_id, v]));
    for (const id of INLINE_OPTION_ITEMS) {
      expect(items.get(id)?.origin).toBe('generated');
      expect(isChoice(id)).toBe(true);
      expect(variable.has(id)).toBe(false);
      expect(Array.isArray((versionOf.get(id)!.payload as { options?: unknown }).options)).toBe(
        true,
      );
    }
    // Cada generado de elección de hoy está en una de las dos listas: la regla no cambia nada cargado.
    const generatedChoice = catalog.items.filter((i) => i.origin === 'generated' && isChoice(i.id));
    expect(generatedChoice).toHaveLength(958);
    for (const i of generatedChoice) expect(inline.has(i.id) !== variable.has(i.id)).toBe(true);
  });

  it('optionsOutsideVersion: generado de elección nuevo sí; escritos, otros tipos y los 782, no', () => {
    const none = new Set<string>();
    const gen = (type: (typeof catalog.items)[number]['type']) => ({
      id: 'en.gen.x.new',
      origin: 'generated' as const,
      type,
    });
    for (const t of [
      'image_choice',
      'translation_choice',
      'fill_blank',
      'listen_choice',
    ] as const) {
      expect(optionsOutsideVersion(gen(t), none, inline)).toBe(true);
      expect(optionsOutsideVersion({ ...gen(t), origin: 'authored' }, none, inline)).toBe(false);
    }
    for (const t of ['translate_write', 'complete_word', 'match_pairs', 'order_words'] as const) {
      expect(optionsOutsideVersion(gen(t), none, inline)).toBe(false);
    }
    const legacy = items.get(INLINE_OPTION_ITEMS[0]!)!;
    expect(optionsOutsideVersion(legacy, variable, inline)).toBe(false);
    expect(optionsOutsideVersion(items.get(VARIABLE_OPTION_ITEMS[0]!)!, variable, inline)).toBe(
      true,
    );
  });

  it('un generado de elección fuera de la lista recibe una versión sin payload.options', () => {
    // El mismo ítem, como si fuera nuevo (lista vacía): la versión pierde las opciones y su hash es el
    // del contenido sin ellas; con la lista congelada, el hash cargado no cambia.
    const id = INLINE_OPTION_ITEMS[0]!;
    const sub = {
      items: catalog.items.filter((i) => i.id === id),
      placements: catalog.placements.filter((p) => p.item_id === id),
    };
    const kept = buildVersions(sub, exercises).versions[0]!;
    const fresh = buildVersions(sub, exercises, VARIABLE_OPTION_ITEMS, []).versions[0]!;
    expect(kept.content_hash).toBe(versions.versions.find((v) => v.item_id === id)!.content_hash);
    expect('options' in (fresh.payload as object)).toBe(false);
    expect(fresh.content_hash).not.toBe(kept.content_hash);
    expect(fresh.content_hash).toBe(versionHash(withoutOptions(kept), specOf(id)));
  });

  const specOf = (id: string) => gradingSpecFor(items.get(id)!.type);
});
