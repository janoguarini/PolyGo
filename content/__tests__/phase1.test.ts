/// <reference types="node" />
// Lee las pruebas de la base y las migraciones generadas: necesita los tipos de Node.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { contentDocument } from '../../scripts/content-document';
import { CURRICULUM_PATH } from '..';
import { buildCatalog, objectiveScopeOf } from '../catalog';
import { LEARNING_OBJECTIVES, objectiveProblems, type ObjectiveDef } from '../objectives';
import { CONTENT_PERSONAS, personaPrivacyProblems, type PersonaDef } from '../personas';
import { PRACTICE_SOURCES, practiceSourceProblems } from '../practice-sources';
import { contentsByItem, VERSION_CONTENT_FIELDS, versionContentOf } from '../versions';

/**
 * Resto de la fase 1 del catálogo (docs/LEARNING_CATALOG_PHASE1.md §7–§10): objetivos, personas,
 * orígenes de la práctica, ubicaciones y lo determinado de las versiones.
 */

const ROOT = join(__dirname, '..', '..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const document = contentDocument(CURRICULUM_PATH);
const catalog = document.catalog;
const items = new Map(catalog.items.map((i) => [i.id, i]));

/** Documento jsonb de una migración generada. */
const payloadOf = (file: string) =>
  JSON.parse(
    /\$content\$([\s\S]*?)\$content\$/.exec(readFileSync(join(MIGRATIONS, file), 'utf8'))![1]!,
  ) as {
    catalog: { placements: { exercise_id: string; item_id: string }[] };
  };

// --- Ubicaciones (§5) ---------------------------------------------------------------------------

describe('ubicaciones: exercises.item_id', () => {
  it('la migración de ubicaciones tiene exactamente las del catálogo (5.410)', () => {
    const written = payloadOf('20261107150100_learning_item_placements.sql').catalog.placements;
    expect(written).toEqual(
      catalog.placements.map((p) => ({ exercise_id: p.exercise_id, item_id: p.item_id })),
    );
    expect(written).toHaveLength(5410);
  });

  it('content:sql, content:diff y content:catalog toman las ubicaciones del mismo catálogo', () => {
    // content:sql y content:diff usan contentDocument; content:catalog, buildCatalog.
    expect(contentDocument(CURRICULUM_PATH).catalog.placements).toEqual(
      buildCatalog(CURRICULUM_PATH).placements,
    );
    // Cada ejercicio del documento tiene exactamente una ubicación, en el mismo orden.
    expect(catalog.placements.map((p) => p.exercise_id)).toEqual(
      document.exercises.map((e) => e.id),
    );
  });

  it('las copias apuntan al escrito original, del mismo tipo e idioma', () => {
    const rows = new Map(document.exercises.map((e) => [e.id, e]));
    const copies = catalog.placements.filter((p) => p.kind === 'copy');
    expect(copies).toHaveLength(948);
    for (const p of copies) {
      const item = items.get(p.item_id)!;
      expect(item.origin).toBe('authored');
      expect(item.type).toBe(rows.get(p.exercise_id)!.type);
    }
  });
});

// --- Versiones: lo determinado (§5) -------------------------------------------------------------

describe('versiones: contenido de cada ítem', () => {
  const byItem = contentsByItem(catalog, document.exercises);

  it('la versión copia exactamente los campos publicados de §5', () => {
    const row = document.exercises[0]!;
    expect(Object.keys(versionContentOf(row))).toEqual([...VERSION_CONTENT_FIELDS]);
    expect(versionContentOf({ ...row, id: 'x' } as typeof row)).toEqual(versionContentOf(row));
  });

  it('cada ítem escrito tiene un solo contenido publicado, también con sus copias de la consolidación', () => {
    let withCopies = 0;
    for (const item of catalog.items.filter((i) => i.origin === 'authored')) {
      const contents = byItem.get(item.id)!;
      expect(contents).toHaveLength(1);
      if (contents[0]!.exercises.length > 1) withCopies++;
    }
    expect(withCopies).toBeGreaterThan(0);
    expect(byItem.size).toBe(catalog.items.length);
  });

  it('los ítems generados con varios contenidos publicados sólo difieren en las opciones (decisión V5)', () => {
    const multi = [...byItem].filter(
      ([id, c]) => items.get(id)!.origin === 'generated' && c.length > 1,
    );
    expect(multi.length).toBeGreaterThan(0);
    for (const [, contents] of multi) {
      const first = contents[0]!.content;
      for (const { content } of contents) {
        expect({ ...content, payload: null }).toEqual({ ...first, payload: null });
        const { options: _a, ...rest } = content.payload as { options?: unknown };
        const { options: _b, ...firstRest } = first.payload as { options?: unknown };
        expect(rest).toEqual(firstRest);
      }
    }
  });
});

// --- Objetivos (§4.5) ---------------------------------------------------------------------------

const OBJ: ObjectiveDef = {
  id: 'en.a1.obj.zz-test-greet',
  language: 'en',
  level: 'A1',
  cefrActivity: 'interaction',
  canDo: 'Prueba',
  position: 1,
  status: 'draft',
  concepts: [{ concept: 'en-hello', role: 'core' }],
  lessons: [
    { lesson: 'a1-u01-l01', role: 'introduce' },
    { lesson: 'a1-u02-l01', role: 'practice' },
  ],
  items: ['a1-u01-l01-e01', 'a1-u02-l01-e01'],
};

describe('objetivos de aprendizaje', () => {
  const scope = objectiveScopeOf(CURRICULUM_PATH, catalog);

  it('no hay objetivos escritos: falta la definición editorial (§18, P8)', () => {
    expect(LEARNING_OBJECTIVES).toEqual([]);
    expect(objectiveProblems(LEARNING_OBJECTIVES, scope)).toEqual([]);
    expect(catalog.objectives).toEqual([]);
  });

  it('un objetivo válido no tiene problemas', () => {
    expect(objectiveProblems([OBJ], scope)).toEqual([]);
  });

  it('detecta ids, actividades, roles, repetidos y relaciones inválidas', () => {
    const itWord = CURRICULUM_PATH.find((p) => p.language === 'it')!.unit.words[0]!.id;
    const cases: [Partial<ObjectiveDef>, RegExp][] = [
      [{ id: 'it.a1.obj.x' }, /prefijo/],
      [{ id: 'en.a2.obj.x' }, /prefijo/],
      [{ id: 'en.a1.x' }, /<idioma>.<nivel>.obj.<slug>/],
      [{ cefrActivity: 'singing' as never }, /actividad/],
      [{ status: 'published' as never }, /estado/],
      [{ canDo: ' ' }, /canDo/],
      [{ position: 0 }, /posición/],
      [{ concepts: [{ concept: 'en-hello', role: 'main' as never }] }, /rol main/],
      [{ lessons: [{ lesson: 'a1-u01-l01', role: 'teach' as never }] }, /rol teach/],
      [
        {
          concepts: [
            { concept: 'en-hello', role: 'core' },
            { concept: 'en-hello', role: 'support' },
          ],
        },
        /repetido/,
      ],
      [{ concepts: [{ concept: 'en-zz-nope', role: 'core' }] }, /inexistente/],
      [{ concepts: [{ concept: itWord, role: 'core' }] }, /es de it/],
      [{ lessons: [{ lesson: 'it-a1-u01-l01', role: 'practice' }] }, /es de it/],
      [{ items: ['it-a1-u01-l01-e01'] }, /es de it/],
    ];
    for (const [over, expected] of cases) {
      expect(objectiveProblems([{ ...OBJ, ...over }], scope).join('\n')).toMatch(expected);
    }
    expect(objectiveProblems([OBJ, OBJ], scope).join()).toMatch(/duplicado/);
    const g = { ...OBJ, groupKey: 'g' };
    expect(objectiveProblems([g, { ...g, id: 'en.a1.obj.zz-other' }], scope).join()).toMatch(
      /groupKey g repetido/,
    );
    // El mismo groupKey en otro idioma es una equivalencia válida (D5).
    expect(
      objectiveProblems(
        [g, { ...g, id: 'it.a1.obj.zz-x', language: 'it', concepts: [], lessons: [], items: [] }],
        scope,
      ),
    ).toEqual([]);
  });

  it('el catálogo de un tramo lleva los objetivos de su idioma y nivel, y sólo sus lecciones e ítems', () => {
    const it2: ObjectiveDef = {
      ...OBJ,
      id: 'it.a1.obj.zz-x',
      language: 'it',
      concepts: [],
      lessons: [],
      items: [],
    };
    const a2: ObjectiveDef = { ...OBJ, id: 'en.a2.obj.zz-x', level: 'A2', lessons: [], items: [] };
    const unit1 = CURRICULUM_PATH.filter(
      (p) => p.language === 'en' && p.level === 'A1' && p.unit.position === 1,
    );
    const c = buildCatalog(unit1, [], [OBJ, it2, a2]);
    expect(c.objectives.map((o) => o.id)).toEqual([OBJ.id]);
    expect(c.objective_concepts).toEqual([
      { objective_id: OBJ.id, concept_id: 'en-hello', role: 'core', language_code: 'en' },
    ]);
    expect(c.lesson_objectives).toEqual([
      { lesson_id: 'a1-u01-l01', objective_id: OBJ.id, role: 'introduce' },
    ]);
    expect(c.item_objectives).toEqual([
      { item_id: 'a1-u01-l01-e01', objective_id: OBJ.id, language_code: 'en' },
    ]);
    expect(c.lessons).toEqual(unit1.flatMap((p) => p.lessons.map((l) => l.id)));
    // El currículo completo lleva todas las relaciones.
    const full = buildCatalog(CURRICULUM_PATH, [], [OBJ]);
    expect(full.lesson_objectives).toHaveLength(2);
    expect(full.item_objectives).toHaveLength(2);
    // Un objetivo inválido o de otro idioma que su lección no se carga.
    expect(() => buildCatalog(unit1, [], [{ ...OBJ, id: 'en.a1.x' }])).toThrow(/obj/);
    expect(() =>
      buildCatalog(unit1, [], [{ ...OBJ, lessons: [], items: ['a1-u01-l01-e01'], language: 'en' }]),
    ).not.toThrow();
  });
});

// --- Personas (§13.2) ---------------------------------------------------------------------------

/** Correos de los usuarios de prueba de supabase/tests y server/: ninguna persona puede usarlos. */
function testUserEmails(): string[] {
  const dirs = [join(ROOT, 'supabase', 'tests'), join(ROOT, 'server', 'src')];
  const files = dirs.flatMap((d) => {
    try {
      return readdirSync(d, { recursive: true, encoding: 'utf8' })
        .filter((f) => /\.(m?js|ts)$/.test(f))
        .map((f) => join(d, f));
    } catch {
      return [];
    }
  });
  const emails = new Set<string>();
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(
      /['"`]([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]+)['"`]/gi,
    ))
      emails.add(m[1]!.toLowerCase());
  }
  return [...emails];
}

const PERSONA: PersonaDef = {
  id: 'en.persona.zz-test',
  language: 'en',
  displayName: 'Zz Test',
  age: 30,
  city: 'Testville',
  country: 'Testland',
  phone: '000-0000',
  email: 'zz.jest@example.com',
};

describe('personas ficticias', () => {
  const testEmails = testUserEmails();

  it('sólo la persona de U13 (fase C.2), y no puede coincidir con usuarios de prueba', () => {
    expect(CONTENT_PERSONAS.map((p) => p.id)).toEqual(['en.persona.sofia-ruiz']);
    expect(testEmails.length).toBeGreaterThan(10);
    expect(personaPrivacyProblems(CONTENT_PERSONAS, testEmails)).toEqual([]);
  });

  it('detecta datos inválidos, repetidos y coincidencias con la lista de exclusión', () => {
    expect(personaPrivacyProblems([PERSONA], testEmails)).toEqual([]);
    const used = testEmails.find((e) => e.endsWith('@example.com'));
    expect(used).toBeDefined();
    expect(personaPrivacyProblems([{ ...PERSONA, email: used! }], testEmails).join()).toMatch(
      /usuario de prueba/,
    );
    expect(personaPrivacyProblems([PERSONA], ['ZZ  test']).join()).toMatch(/displayName coincide/);
    const other = { ...PERSONA, id: 'en.persona.zz-other' };
    const dup = personaPrivacyProblems([PERSONA, other]).join('\n');
    expect(dup).toMatch(/email repetido/);
    expect(dup).toMatch(/phone repetido/);
    expect(dup).toMatch(/displayName repetido/);
    expect(personaPrivacyProblems([{ ...PERSONA, email: 'zz@gmail.com' }]).join()).toMatch(
      /example\.com/,
    );
    expect(personaPrivacyProblems([{ ...PERSONA, email: 'zz@example.com.ar' }]).join()).toMatch(
      /example\.com/,
    );
  });

  it('el catálogo carga sólo las personas de los idiomas del tramo y rechaza las inválidas', () => {
    const unit1 = CURRICULUM_PATH.filter(
      (p) => p.language === 'en' && p.unit.position === 1 && p.level === 'A1',
    );
    const it = { ...PERSONA, id: 'it.persona.zz-test', language: 'it' };
    expect(buildCatalog(unit1, [PERSONA, it]).personas.map((p) => p.id)).toEqual([PERSONA.id]);
    expect(() => buildCatalog(unit1, [{ ...PERSONA, age: 0 }])).toThrow(/edad/);
  });

  it('los 13 candidatos a fictional siguen open_text: no hay persona definida para ninguno', () => {
    const candidates = [
      'a1-u03-l04-e06',
      'a1-u03-l05-e08',
      'a1-u12-l05-e01',
      'a1-u12-l05-e02',
      'it-a1-u01-l04-e07',
      'it-a1-u03-l04-e07',
      'it-a1-u04-l05-e06',
      'pt-a1-u01-l04-e07',
      'pt-a1-u03-l04-e07',
      'pt-a1-u03-l05-e06',
      'pt-a1-u04-l05-e06',
      'pt-a1-u08-l04-e07',
      'pt-a1-u12-l03-e08',
    ];
    for (const id of candidates) expect(items.get(id)?.response_privacy).toBe('open_text');
    expect(catalog.items.filter((i) => i.response_privacy === 'fictional')).toEqual([]);
  });
});

// --- Orígenes de la práctica (§6.1) -------------------------------------------------------------

describe('orígenes de la práctica', () => {
  it('cumplen G1 y no incluyen Ranked ni los pendientes', () => {
    expect(practiceSourceProblems(PRACTICE_SOURCES)).toEqual([]);
    expect(PRACTICE_SOURCES.map((s) => s.id).sort()).toEqual([
      'consolidation',
      'free_practice',
      'lesson',
      'mistakes_practice',
      'smart_review',
      'srs_review',
      'topic_review',
    ]);
    const bad = { ...PRACTICE_SOURCES[0]!, id: 'zz_exam', evidence_class: 'assessment' as const };
    expect(practiceSourceProblems([bad]).join()).toMatch(/G1/);
    expect(practiceSourceProblems([PRACTICE_SOURCES[0]!, PRACTICE_SOURCES[0]!]).join()).toMatch(
      /repetido/,
    );
  });
});
