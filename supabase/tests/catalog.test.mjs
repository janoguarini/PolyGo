// Resto del catálogo de la fase 1 (arquitectura de datos rev. 8, §4.5, §6.1, §13.2 y §18), probado en
// PGlite: orígenes de la práctica (20261107170000_practice_sources.sql), objetivos y sus relaciones
// (20261107160000_learning_objectives.sql) y personas ficticias (20261107180000_content_personas.sql).
// Objetivos y personas no tienen filas reales (falta la definición editorial): se cargan definiciones
// de prueba por el generador real (contentSql) dentro de transacciones que se revierten.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { CURRICULUM_PATH } from '../../content/index.ts';
import { PHASE5_PRACTICE_SOURCES, PRACTICE_SOURCES, SRS_V2_PRACTICE_SOURCES } from '../../content/practice-sources.ts';
import { contentSql } from '../../scripts/content-sql.ts';
import { COMPREHENSION_OBJECTIVES } from '../../content/comprehension.ts';
import { PLANNED_OBJECTIVES } from '../../content/planned-objectives.ts';

// Los únicos objetivos que traen las migraciones: los 24 propuestos (draft) de la fase C
// (20261113120100_comprehension_en_a1.sql, docs/LEARNING_PHASE_C.md). content/objectives.ts sigue vacío.
// La C.3 (20261113120300) no crea objetivos: amplía las relaciones de cuatro (PLANNED_OBJECTIVES).
const LOADED = COMPREHENSION_OBJECTIVES.map((o) => PLANNED_OBJECTIVES.find((p) => p.id === o.id) ?? o);
const PHASE_C = {
  objectives: LOADED.length,
  objective_concepts: LOADED.reduce((n, o) => n + o.concepts.length, 0),
  lesson_objectives: LOADED.reduce((n, o) => n + o.lessons.length, 0),
  item_objectives: LOADED.reduce((n, o) => n + o.items.length, 0),
};

let db;
let alice;

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');

async function inRollback(fn) {
  await db.exec('begin');
  try {
    return await fn();
  } finally {
    await db.exec('rollback');
  }
}

/** Error de una sentencia (con los triggers diferidos comprobados), dentro de un savepoint. */
async function failure(sql) {
  await db.exec('savepoint s');
  try {
    await db.exec(sql);
    await db.exec('set constraints all immediate');
    await db.exec('release savepoint s');
    return null;
  } catch (err) {
    await db.exec('rollback to savepoint s');
    return err;
  }
}

const UNIT = CURRICULUM_PATH.find(
  (p) => p.language === 'en' && p.level === 'A1' && p.unit.position === 1,
);
const IT_UNIT = CURRICULUM_PATH.find(
  (p) => p.language === 'it' && p.level === 'A1' && p.unit.position === 1,
);

/** Objetivo de prueba: no es contenido pedagógico, sólo ejercita el esquema y el generador. */
const OBJ = {
  id: 'en.a1.obj.zz-test-greet',
  language: 'en',
  level: 'A1',
  cefrActivity: 'interaction',
  canDo: 'Prueba: objetivo de prueba',
  position: 1,
  status: 'draft',
  concepts: [
    { concept: 'en-hello', role: 'core' },
    { concept: 'en-hi', role: 'support' },
  ],
  lessons: [{ lesson: 'a1-u01-l01', role: 'introduce' }],
  items: ['a1-u01-l01-e01'],
};

/** Persona de prueba (datos ficticios evidentes). */
const PERSONA = {
  id: 'en.persona.zz-test',
  language: 'en',
  displayName: 'Zz Test',
  age: 30,
  city: 'Testville',
  country: 'Testland',
  phone: '000-0000',
  email: 'zz.test@example.com',
};

const load = (defs) => db.exec(contentSql([UNIT], defs).sql);

const counts = () =>
  one(`select
    (select count(*)::int from public.learning_objectives) objectives,
    (select count(*)::int from public.objective_concepts) objective_concepts,
    (select count(*)::int from public.lesson_objectives) lesson_objectives,
    (select count(*)::int from public.item_objectives) item_objectives,
    (select count(*)::int from public.content_personas) personas,
    (select count(*)::int from public.practice_sources) sources`);

// --- practice_sources (§6.1) --------------------------------------------------------------------

test('practice_sources: exactamente las filas de content/practice-sources.ts', async () => {
  const rows =
    await all(`select id, selection_mode, affects_srs, affects_lesson_progress, consumes_energy,
      counts_for_streak, evidence_class, reward_kind, plus_feature, active
    from public.practice_sources order by id`);
  // Fase 1 (§6.1) + los dos orígenes del SRS v2 (fase 3, §11 del diseño de Adaptive) + basic_review (fase 5).
  const expected = [...PRACTICE_SOURCES, ...SRS_V2_PRACTICE_SOURCES, ...PHASE5_PRACTICE_SOURCES].sort((a, b) => (a.id < b.id ? -1 : 1));
  assert.deepEqual(rows, expected);
  // D3: práctica libre y «Tus errores» no tocan el SRS; ningún origen es Ranked (§14).
  assert.deepEqual(
    rows.filter((r) => !r.affects_srs).map((r) => r.id),
    ['free_practice', 'mistakes_practice'],
  );
  assert.ok(!rows.some((r) => /ranked/.test(r.id)));
  // Pendientes de decisión: no se cargan.
  for (const id of ['assessment', 'level_exam', 'placement', 'srs_review_legacy']) {
    assert.ok(!rows.some((r) => r.id === id), id);
  }
});

test('practice_sources: G1 (evaluación ⇒ server), unique (id, selection_mode) y migración idempotente', async () => {
  const insert = (id, mode, evidence) =>
    `insert into public.practice_sources (id, selection_mode, affects_srs, affects_lesson_progress,
       consumes_energy, counts_for_streak, evidence_class, reward_kind, plus_feature, active)
     values ('${id}', '${mode}', false, false, false, true, '${evidence}', null, null, false)`;
  await inRollback(async () => {
    assert.match(
      String((await failure(insert('zz_exam', 'client_proposed', 'assessment')))?.message),
      /g1_check/,
    );
    assert.match(
      String((await failure(insert('zz_exam', 'fixed', 'assessment')))?.message),
      /g1_check/,
    );
    assert.equal(await failure(insert('zz_exam', 'server', 'assessment')), null);
    assert.match(
      String((await failure(insert('zz_x', 'random', 'retrieval')))?.message),
      /selection_mode_check/,
    );
    assert.match(
      String((await failure(insert('Zz-X', 'server', 'retrieval')))?.message),
      /id_check/,
    );
  });
  const key = await one(`select pg_get_constraintdef(oid) def from pg_constraint
    where conname = 'practice_sources_id_selection_mode_key'`);
  assert.match(key.def, /UNIQUE \(id, selection_mode\)/);
  const before = await all('select * from public.practice_sources order by id');
  await db.exec(migration('20261107170000_practice_sources.sql'));
  assert.deepEqual(await all('select * from public.practice_sources order by id'), before);
});

// --- Objetivos (§4.5) ---------------------------------------------------------------------------

test('objetivos: el esquema existe y sólo están los propuestos de la fase C, en draft (§18 y P8)', async () => {
  const { objectives, objective_concepts, lesson_objectives, item_objectives } = await counts();
  assert.deepEqual({ objectives, objective_concepts, lesson_objectives, item_objectives }, PHASE_C);
  const loaded = await all(`select id, status from public.learning_objectives order by id`);
  assert.deepEqual(
    loaded,
    COMPREHENSION_OBJECTIVES.map((o) => ({ id: o.id, status: 'draft' })).sort((a, b) => (a.id < b.id ? -1 : 1)),
  );
  const cons = await all(`select conname from pg_constraint
    where conrelid in ('public.learning_objectives'::regclass, 'public.objective_concepts'::regclass,
                       'public.item_objectives'::regclass)
      and contype = 'f' order by conname`);
  assert.deepEqual(
    cons.map((r) => r.conname),
    [
      'item_objectives_item_fkey',
      'item_objectives_objective_fkey',
      'learning_objectives_cefr_activity_fkey',
      'learning_objectives_language_code_fkey',
      'learning_objectives_level_fkey',
      'objective_concepts_concept_fkey',
      'objective_concepts_objective_fkey',
    ],
  );
});

test('objetivos: content:sql carga objetivos y relaciones desde content/ y es idempotente', async () => {
  await inRollback(async () => {
    await load({ objectives: [OBJ] });
    await db.exec('set constraints all immediate');
    assert.deepEqual(
      await one(`select id, language_code, level, cefr_activity, can_do_es, description_es, cefr_ref, group_key,
          position, status from public.learning_objectives where id = '${OBJ.id}'`),
      {
        id: OBJ.id,
        language_code: 'en',
        level: 'A1',
        cefr_activity: 'interaction',
        can_do_es: OBJ.canDo,
        description_es: null,
        cefr_ref: null,
        group_key: null,
        position: 1,
        status: 'draft',
      },
    );
    assert.deepEqual(
      await all(
        `select objective_id, concept_id, role, language_code from public.objective_concepts
         where objective_id = '${OBJ.id}' order by concept_id`,
      ),
      [
        { objective_id: OBJ.id, concept_id: 'en-hello', role: 'core', language_code: 'en' },
        { objective_id: OBJ.id, concept_id: 'en-hi', role: 'support', language_code: 'en' },
      ],
    );
    assert.deepEqual(
      await all(`select lesson_id, objective_id, role from public.lesson_objectives where objective_id = '${OBJ.id}'`),
      [{ lesson_id: 'a1-u01-l01', objective_id: OBJ.id, role: 'introduce' }],
    );
    assert.deepEqual(
      await all(`select item_id, objective_id, language_code from public.item_objectives where objective_id = '${OBJ.id}'`),
      [{ item_id: 'a1-u01-l01-e01', objective_id: OBJ.id, language_code: 'en' }],
    );
    const once = await counts();
    await load({ objectives: [OBJ] });
    assert.deepEqual(await counts(), once);
    // Textos, estado y roles se actualizan; la identidad (idioma, nivel, actividad) no.
    await load({
      objectives: [
        {
          ...OBJ,
          canDo: 'Prueba: otro texto',
          status: 'active',
          concepts: [{ concept: 'en-hello', role: 'support' }, OBJ.concepts[1]],
        },
      ],
    });
    assert.deepEqual(await one(`select can_do_es, status from public.learning_objectives where id = '${OBJ.id}'`), {
      can_do_es: 'Prueba: otro texto',
      status: 'active',
    });
    assert.equal(
      (await one(`select role from public.objective_concepts where objective_id = '${OBJ.id}' and concept_id = 'en-hello'`)).role,
      'support',
    );
    const identity = await failure(
      contentSql([UNIT], { objectives: [{ ...OBJ, cefrActivity: 'speaking' }] }).sql,
    );
    assert.match(String(identity?.message), /otro idioma, nivel o actividad/);
    // Sin DELETE: quitar una relación del contenido aborta.
    for (const change of [{ concepts: [OBJ.concepts[0]] }, { lessons: [] }, { items: [] }]) {
      const err = await failure(contentSql([UNIT], { objectives: [{ ...OBJ, ...change }] }).sql);
      assert.match(
        String(err?.message),
        /relaciones que el contenido ya no tiene/,
        JSON.stringify(change),
      );
    }
  });
  assert.equal((await counts()).objectives, PHASE_C.objectives);
});

test('objetivos: idioma, id, actividad, roles y group_key se validan en la base', async () => {
  const itWord = IT_UNIT.unit.words[0].id;
  await inRollback(async () => {
    await load({ objectives: [OBJ] });
    const cases = [
      // La lección es de otro idioma (trigger de §4.5).
      [
        `insert into public.lesson_objectives values ('it-a1-u01-l01', '${OBJ.id}', 'practice')`,
        /idiomas distintos/,
      ],
      // Concepto e ítem de otro idioma (FK compuestas).
      [
        `insert into public.objective_concepts values ('${OBJ.id}', '${itWord}', 'core', 'en')`,
        /objective_concepts_concept_fkey/,
      ],
      [
        `insert into public.objective_concepts values ('${OBJ.id}', '${itWord}', 'core', 'it')`,
        /objective_concepts_objective_fkey/,
      ],
      [
        `insert into public.item_objectives values ('it-a1-u01-l01-e01', '${OBJ.id}', 'en')`,
        /item_objectives_item_fkey/,
      ],
      [
        `insert into public.objective_concepts values ('${OBJ.id}', 'en-yes', 'main', 'en')`,
        /role_check/,
      ],
      [
        `insert into public.lesson_objectives values ('a1-u01-l02', '${OBJ.id}', 'teach')`,
        /role_check/,
      ],
    ];
    const objective = (id, language, level, extra = {}) => {
      const o = { cefr_activity: 'reading', group_key: null, ...extra };
      return `insert into public.learning_objectives (id, language_code, level, cefr_activity, can_do_es,
        group_key, position, status) values ('${id}', '${language}', '${level}',
        ${o.cefr_activity === null ? 'null' : `'${o.cefr_activity}'`}, 'x',
        ${o.group_key === null ? 'null' : `'${o.group_key}'`}, 1, 'draft')`;
    };
    cases.push(
      [objective('it.a1.obj.zz-x', 'en', 'A1'), /learning_objectives_id_check/],
      [objective('en.a2.obj.zz-x', 'en', 'A1'), /learning_objectives_id_check/],
      [objective('en.a1.zz-x', 'en', 'A1'), /learning_objectives_id_check/],
      [objective('en.a1.obj.zz-x', 'en', 'A1', { cefr_activity: null }), /cefr_activity/],
      [objective('en.a1.obj.zz-x', 'en', 'A1', { cefr_activity: 'singing' }), /cefr_activity_fkey/],
      [
        `${objective('en.a1.obj.zz-x', 'en', 'A1', { group_key: 'g1' })};
        ${objective('en.a1.obj.zz-y', 'en', 'A1', { group_key: 'g1' })}`,
        /group_key_language_key/,
      ],
    );
    for (const [sql, expected] of cases) {
      assert.match(String((await failure(sql))?.message), expected, sql);
    }
    // El mismo group_key en otro idioma sí vale: es la equivalencia (D5).
    assert.equal(
      await failure(`${objective('en.a1.obj.zz-x', 'en', 'A1', { group_key: 'g1' })};
        ${objective('it.a1.obj.zz-x', 'it', 'A1', { group_key: 'g1' })}`),
      null,
    );
  });
});

// --- Personas (§13.2) ---------------------------------------------------------------------------

test('personas: sólo la de U13 (fase C.2); content:sql las carga y una persona no cambia', async () => {
  // La única fila que traen las migraciones: la huésped ficticia de U13 «En contexto»
  // (20261113120200_comprehension_en_a1_u13_u14.sql, docs/LEARNING_PHASE_C.md §C2).
  assert.equal((await counts()).personas, 1);
  assert.deepEqual(await all('select id, fictional from public.content_personas'), [
    { id: 'en.persona.sofia-ruiz', fictional: true },
  ]);
  await inRollback(async () => {
    await load({ personas: [PERSONA] });
    await load({ personas: [PERSONA] });
    assert.deepEqual(await all(`select * from public.content_personas where id = '${PERSONA.id}'`), [
      {
        id: PERSONA.id,
        language_code: 'en',
        display_name: 'Zz Test',
        age: 30,
        city: 'Testville',
        country: 'Testland',
        phone: '000-0000',
        email: 'zz.test@example.com',
        fictional: true,
      },
    ]);
    const changed = await failure(contentSql([UNIT], { personas: [{ ...PERSONA, age: 31 }] }).sql);
    assert.match(String(changed?.message), /una persona no cambia/);
    // Una persona de otro idioma no entra en el tramo inglés.
    await load({
      personas: [
        PERSONA,
        {
          ...PERSONA,
          id: 'it.persona.zz-test',
          language: 'it',
          email: 'zz.it@example.com',
          phone: '000-0001',
        },
      ],
    });
    assert.equal((await counts()).personas, 2);
  });
});

test('personas: privacidad validada en la base (example.com, fictional, id del idioma, sin repetidos)', async () => {
  const persona = (over = {}) => {
    const p = {
      id: 'en.persona.zz-a',
      language_code: 'en',
      email: 'a@example.com',
      phone: '1',
      fictional: true,
      ...over,
    };
    return `insert into public.content_personas (id, language_code, display_name, age, city, country, phone,
      email, fictional) values ('${p.id}', '${p.language_code}', 'Zz A', 20, 'C', 'P', '${p.phone}', '${p.email}', ${p.fictional})`;
  };
  await inRollback(async () => {
    for (const [sql, expected] of [
      [persona({ email: 'a@gmail.com' }), /email_check/],
      [persona({ email: 'a@example.com.ar' }), /email_check/],
      [persona({ fictional: false }), /fictional_check/],
      [persona({ id: 'it.persona.zz-a' }), /id_check/],
      [persona({ id: 'en.zz-a' }), /id_check/],
      [`${persona()}; ${persona({ id: 'en.persona.zz-b', phone: '2' })}`, /email_key/],
      [`${persona()}; ${persona({ id: 'en.persona.zz-b', email: 'b@example.com' })}`, /phone_key/],
    ]) {
      assert.match(String((await failure(sql))?.message), expected, sql);
    }
    assert.equal(await failure(persona()), null);
  });
});

// --- Seguridad y límites ------------------------------------------------------------------------

test('anon y authenticated no pueden leer ni escribir las tablas nuevas', async () => {
  const tables = [
    'learning_objectives',
    'objective_concepts',
    'lesson_objectives',
    'item_objectives',
    'practice_sources',
    'content_personas',
  ];
  for (const table of tables) {
    for (const [role, user] of [
      ['anon', null],
      ['authenticated', alice],
    ]) {
      await assert.rejects(
        as(db, role, user, () => db.query(`select 1 from public.${table} limit 1`)),
        /permission denied/,
        `${role} lee ${table}`,
      );
    }
  }
  const rls = await all(
    `select relname from pg_class where relnamespace = 'public'::regnamespace and relname = any($1)
       and relrowsecurity`,
    [tables],
  );
  assert.equal(rls.length, tables.length);
  for (const role of ['anon', 'authenticated']) {
    const r = await one(
      `select has_function_privilege($1, 'public.lesson_objectives_check_language()', 'execute') ok`,
      [role],
    );
    assert.equal(r.ok, false);
  }
});

test('el SRS v1 y learning_sessions no cambian; nada existente referencia las tablas nuevas', async () => {
  const defs = await all(`select p.proname, pg_get_functiondef(p.oid) def from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname in ('submit_learning_session', 'apply_word_result', 'srs_config')`);
  assert.equal(defs.length, 3);
  for (const d of defs) assert.ok(!/practice_sources|objective|persona/.test(d.def), d.proname);
  const cols = await all(`select column_name from information_schema.columns
    where table_schema = 'public' and table_name = 'learning_sessions' and column_name in ('source', 'selection_mode')`);
  assert.deepEqual(cols, []);
  const fks = await all(`select conrelid::regclass::text t from pg_constraint
    where contype = 'f' and confrelid in ('public.practice_sources'::regclass, 'public.learning_objectives'::regclass,
                                          'public.content_personas'::regclass)
    order by 1`);
  // Ninguna tabla existente las referencia; desde la fase 3, también las tablas nuevas del SRS v2
  // (el origen de cada sesión aplicada y de cada plan).
  assert.deepEqual(
    fks.map((r) => r.t),
    ['item_objectives', 'lesson_objectives', 'objective_concepts', 'srs_applied_sessions', 'srs_session_plans'],
  );
});
