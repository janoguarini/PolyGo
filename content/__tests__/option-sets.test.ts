import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { contentDocument } from '../../scripts/content-document';
import { EXERCISE_TYPES } from '../../shared/exercises';
import { readingDictionary, segmentReadings } from '../../shared/readings';
import { CURRICULUM_PATH } from '..';
import {
  buildOptionSets,
  isChoiceType,
  OPTION_SET_FORMAT,
  optionSetHash,
  type OptionSetPlan,
} from '../option-sets';
import { VARIABLE_OPTION_ITEMS } from '../variable-options';
import { GENERATORS } from '../versions';

/**
 * Conjuntos de opciones inmutables (decisiones V5.1–V5.3, docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5;
 * content/option-sets.ts): formato, hash, pinyin fotografiado, cobertura, distractores variables,
 * determinismo y migraciones generadas = contenido actual. La base: supabase/tests/presentations.test.mjs.
 */

const MIGRATIONS = join(__dirname, '..', '..', 'supabase', 'migrations');
const SET_FILES = ['en', 'it', 'pt', 'zh'].map(
  (l, i) => `2026110813010${i + 1}_learning_option_sets_${l}.sql`,
);

const doc = contentDocument(CURRICULUM_PATH);
const { catalog, versions, optionSets } = doc;
const items = new Map(catalog.items.map((i) => [i.id, i]));
const rows = new Map(doc.exercises.map((e) => [e.id, e]));
const variable = new Set(VARIABLE_OPTION_ITEMS);
const setOf = new Map(optionSets.option_sets.map((s) => [`${s.item_id}@${s.options_hash}`, s]));

describe('conjuntos de opciones del currículo', () => {
  it('2.652 conjuntos, uno en cada una de las 3.139 ubicaciones de elección', () => {
    const choice = catalog.placements.filter((p) => isChoiceType(items.get(p.item_id)!.type));
    expect(choice).toHaveLength(3139);
    expect(optionSets.placement_option_sets).toHaveLength(3139);
    expect(optionSets.option_sets).toHaveLength(2652);
    expect(new Set(optionSets.placement_option_sets.map((p) => p.exercise_id)).size).toBe(3139);
    // context_choice (fase C) también es de elección; sus conjuntos los prueba comprehension.test.mjs.
    expect(EXERCISE_TYPES.filter(isChoiceType).sort()).toEqual([
      'context_choice',
      'fill_blank',
      'image_choice',
      'listen_choice',
      'translation_choice',
    ]);
    const keys = optionSets.option_sets.map(
      (s) => `${s.item_id}@${s.version_hash}@${s.options_hash}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('cada conjunto es la copia literal de las opciones publicadas, con la respuesta en answer_index', () => {
    const versionOf = new Map(
      versions.placement_versions.map((p) => [p.exercise_id, p.content_hash]),
    );
    for (const p of optionSets.placement_option_sets) {
      const s = setOf.get(`${p.item_id}@${p.options_hash}`)!;
      const e = rows.get(p.exercise_id)!;
      const payload = e.payload as { options: string[] };
      expect(s.options.map((o) => o.text)).toEqual(payload.options);
      expect(s.options[s.answer_index]!.text).toBe(e.answer);
      expect(s.version_hash).toBe(versionOf.get(p.exercise_id));
      expect(s.format).toBe(OPTION_SET_FORMAT);
      for (const o of s.options) {
        expect(Object.keys(o).sort()).toEqual(['audio', 'image', 'reading', 'text']);
        expect(o.audio).toBeNull();
        expect(o.image).toBeNull();
      }
    }
  });

  it('options_hash = v1 + sha256 del JSON canónico de {format, options, answer_index}', () => {
    for (const s of optionSets.option_sets) {
      expect(s.options_hash).toMatch(/^v1:[0-9a-f]{64}$/);
      expect(optionSetHash(s)).toBe(s.options_hash);
    }
    const s = optionSets.option_sets[0]!;
    expect(optionSetHash({ ...s, answer_index: s.answer_index + 1 })).not.toBe(s.options_hash);
    expect(optionSetHash({ ...s, options: [...s.options].reverse() })).not.toBe(s.options_hash);
  });

  it('en chino, el pinyin de cada opción queda fotografiado con el diccionario del curso', () => {
    const zhWords = CURRICULUM_PATH.filter((p) => p.language === 'zh').flatMap((p) =>
      p.unit.words.map((w) => ({ text: w.text, romanization: w.romanization ?? null })),
    );
    const dict = readingDictionary(zhWords);
    let withReading = 0;
    for (const s of optionSets.option_sets) {
      const zh = items.get(s.item_id)!.language_code === 'zh';
      for (const o of s.options) {
        if (!zh) {
          expect(o.reading).toBeNull();
          continue;
        }
        if (o.reading) {
          withReading++;
          expect(o.reading).toEqual(segmentReadings(o.text, dict));
          expect(o.reading.map((r) => r.text).join('')).toBe(o.text);
          // Todo carácter chino tiene lectura (como exige el test de contenido).
          for (const r of o.reading)
            if (/\p{Script=Han}/u.test(r.text)) expect(r.reading).not.toBeNull();
        } else {
          expect(/\p{Script=Han}/u.test(o.text)).toBe(false);
        }
      }
    }
    expect(withReading).toBeGreaterThan(0);
  });

  it('los 176 de distractores variables: un conjunto distinto por cada una de sus 371 ubicaciones, de una misma versión', () => {
    const placements = optionSets.placement_option_sets.filter((p) => variable.has(p.item_id));
    expect(placements).toHaveLength(371);
    const sets = optionSets.option_sets.filter((s) => variable.has(s.item_id));
    expect(sets).toHaveLength(371);
    for (const id of variable) {
      const own = sets.filter((s) => s.item_id === id);
      expect(own.length).toBeGreaterThanOrEqual(2);
      expect(new Set(own.map((s) => s.version_hash)).size).toBe(1);
    }
  });

  it('procedencia: sólo los generados tienen generator y generator_version', () => {
    for (const s of optionSets.option_sets) {
      const i = items.get(s.item_id)!;
      if (i.origin === 'authored') expect([s.generator, s.generator_version]).toEqual([null, null]);
      else
        expect([s.generator, s.generator_version]).toEqual([
          GENERATORS[i.type]!.generator,
          GENERATORS[i.type]!.version,
        ]);
      expect(s.origin).toBe('catalog');
    }
  });

  it('es determinista y no depende del tramo que se genere', () => {
    const again = buildOptionSets(
      catalog,
      doc.exercises,
      versions,
      doc.words.map((w) => ({
        language_code: w.language_code,
        text: w.text,
        romanization: w.romanization,
      })),
    );
    expect(JSON.stringify(again)).toBe(JSON.stringify(optionSets));
    // Una sola unidad en chino produce los mismos conjuntos para sus ubicaciones.
    const unit = CURRICULUM_PATH.find((p) => p.language === 'zh' && p.unit.position === 3)!;
    const part = contentDocument([unit]).optionSets;
    expect(part.option_sets.length).toBeGreaterThan(0);
    for (const s of part.option_sets)
      expect(setOf.get(`${s.item_id}@${s.options_hash}`)).toEqual(s);
  });

  it('falla si una ubicación de elección repite opciones o no incluye la respuesta', () => {
    const p = optionSets.placement_option_sets[0]!;
    const e = rows.get(p.exercise_id)!;
    const only = {
      items: [items.get(p.item_id)!],
      placements: catalog.placements.filter((x) => x.exercise_id === p.exercise_id),
    };
    const payload = e.payload as { options: string[] };
    const build = (options: string[], answer = e.answer) =>
      buildOptionSets(
        only,
        [{ ...e, answer, payload: { ...payload, options } }],
        { versions: [], placement_versions: versions.placement_versions },
        [],
      );
    expect(() => build([payload.options[0]!, payload.options[0]!])).toThrow(/repetidas/);
    expect(() => build(payload.options, 'no-está')).toThrow(/respuesta/);
  });
});

describe('migraciones de conjuntos', () => {
  const written: OptionSetPlan = { option_sets: [], placement_option_sets: [] };
  for (const f of SET_FILES) {
    const c = JSON.parse(
      /\$content\$([\s\S]*?)\$content\$/.exec(readFileSync(join(MIGRATIONS, f), 'utf8'))![1]!,
    ).catalog as OptionSetPlan;
    written.option_sets.push(...c.option_sets);
    written.placement_option_sets.push(...c.placement_option_sets);
  }

  it('traen exactamente los conjuntos del contenido actual', () => {
    const sortBy = <T>(xs: T[], key: (x: T) => string) =>
      [...xs].sort((a, b) => (key(a) < key(b) ? -1 : 1));
    expect(sortBy(written.option_sets, (s) => `${s.item_id}@${s.options_hash}`)).toEqual(
      sortBy(optionSets.option_sets, (s) => `${s.item_id}@${s.options_hash}`),
    );
    expect(sortBy(written.placement_option_sets, (p) => p.exercise_id)).toEqual(
      sortBy(optionSets.placement_option_sets, (p) => p.exercise_id),
    );
  });

  it('cada options_hash se recalcula igual desde la fila escrita', () => {
    for (const s of written.option_sets) expect(optionSetHash(s)).toBe(s.options_hash);
  });
});
