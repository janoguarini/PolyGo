// Ranked compartido entre cursos del mismo idioma (docs/RANKED_SHARED_POOL.md), probado SÓLO en PGlite:
//   · supabase/migrations/20270110120000_ranked_shared_pool.sql (rush_* por curso, unidades canónicas);
//   · supabase/pending/20270110120100_word_rush_sentence_translations.sql (consignas pt/it/fr del banco).
//
// Cubre: para los cursos de siempre no cambia nada (mismas unidades comunes antes y después, también
// idempotente); una pareja mixta es + pt encuentra unidades comunes (antes no compartía A1); todo lo que
// devuelve rush_common_unit_ids es del curso canónico; la partida contra bots en el teléfono sigue con
// el curso propio; la tabla de consignas (datos, permisos, trigger, idempotencia, rollback); y una
// partida mixta por Socket.IO con el servidor real leyendo la base (cursos, palabras, unidades).
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

import { io as connect } from 'socket.io-client';

import { createDb, createUser, as } from './harness.mjs';
import { startEmulator } from './edge/postgrestEmulator.mjs';
import { ARCADE } from '../../shared/arcade.ts';
import { ARCADE_PROTOCOL_VERSION } from '../../shared/protocol.ts';
import { createBattleServer } from '../../server/src/server.ts';
import {
  createServiceClient,
  createSupabaseStore,
  loadBankSupport,
} from '../../server/src/supabaseStore.ts';
import { silentLogger } from '../../server/src/types.ts';
import { FakeStore, player, seededRandom } from '../../server/test/helpers.ts';
import { WORD_RUSH_BANKS } from '../../content/word-rush/index.ts';
import { EN_WORD_RUSH_SUPPORT } from '../../content/word-rush/en-support.ts';

const MIGRATION = '20270110120000_ranked_shared_pool.sql';
const migrationSql = readFileSync(new URL(`../migrations/${MIGRATION}`, import.meta.url), 'utf8');
const rollbackSql = readFileSync(
  new URL('../rollback/20270110120000_ranked_shared_pool.down.sql', import.meta.url),
  'utf8',
);
const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');
const TRANSLATIONS = pending('20270110120100_word_rush_sentence_translations.sql');
const TRANSLATIONS_DOWN = readFileSync(
  new URL('../rollback/20270110120100_word_rush_sentence_translations.down.sql', import.meta.url),
  'utf8',
);
const beforeFiles = readdirSync(new URL('../migrations/', import.meta.url))
  .filter((f) => f.endsWith('.sql') && f < MIGRATION)
  .sort();
// Como producción: las publicaciones y el banco de Word Rush (supabase/pending/, ya aplicados).
const PUBLISHED = [
  '20261121120000_publish_en_a2_u13_u17.sql',
  '20261123120000_publish_en_b1.sql',
  '20261125120000_publish_en_b2.sql',
  '20261127120000_publish_pt_a1_a2.sql',
  '20261129120000_publish_it_a1_a2.sql',
  '20261201120000_publish_zh_a1_a2.sql',
  '20261203120000_publish_fr_a1_a2.sql',
  '20261203130000_enable_fr.sql',
  '20261205120000_publish_es_a1_a2.sql',
  '20261226120000_ranked_all_courses.sql',
  '20261227120000_word_rush_bank.sql',
  '20261227120100_word_rush_bank_data.sql',
];
const SERVICE_KEY = 'service-key-shared-pool';
const ANON_KEY = 'anon-key-shared-pool';

const rows = async (db, sql, params = []) => (await db.query(sql, params)).rows;
const one = async (db, sql, params = []) => (await rows(db, sql, params))[0];
const service = (db, sql, params = []) => as(db, 'service_role', null, () => rows(db, sql, params));

/** Unidades de los cursos nuevos de inglés (ids con su prefijo). */
const FOREIGN = /^e(?:pt|it|fr)-/;
/** Una foto de las funciones sin las unidades de los cursos nuevos. */
const defaultOnly = (snap) =>
  Object.fromEntries(
    Object.entries(snap).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.filter((u) => !FOREIGN.test(u)) : v,
    ]),
  );

let n = 0;
async function onboard(db, language = 'en') {
  n += 1;
  const u = await createUser(db, `rsp${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, 'A1', 10::smallint)`, [
      `rsp_user_${n}`,
      language,
    ]),
  );
  return u;
}

const common = async (db, language, players, apis = null) =>
  (
    await service(db, `select public.rush_common_unit_ids($1, $2::uuid[], $3::smallint[]) r`, [
      language,
      players,
      apis,
    ])
  )[0].r;
const mine = (db, u, language) =>
  as(db, 'authenticated', u, () =>
    rows(db, `select r from public.rush_my_unit_ids($1) r`, [language]),
  ).then((r) => r.map((x) => x.r));

describe('ranked compartido', () => {
  let db;
  let es1; // inglés desde español, con A1 U1 completa
  let es2; // inglés desde español, recién empieza
  let pt; // inglés desde portugués (en-from-pt)
  let it; // italiano (un curso por idioma)
  let beforeSnap;
  let mixedBefore;
  let foreignBefore;
  let emu;

  /** Lo que devuelven las funciones de Ranked para los cursos de siempre. */
  const snapshot = async () => ({
    pair: await common(db, 'en', [es1, es2]),
    pairApi: await common(db, 'en', [es1, es2], [1, 0]),
    solo: await common(db, 'en', [es1]),
    soloNew: await common(db, 'en', [es2]),
    withBot: await common(db, 'en', [es1, null]),
    none: await common(db, 'en', [null]),
    it: await common(db, 'it', [it]),
    mineEs: await mine(db, es1, 'en'),
    mineIt: await mine(db, it, 'it'),
    fallback: (await service(db, `select public.rush_fallback_unit_ids('en') r`))[0].r,
    fallbackIt: (await service(db, `select public.rush_fallback_unit_ids('it') r`))[0].r,
  });

  before(async () => {
    db = await createDb({ files: beforeFiles });
    for (const file of PUBLISHED) await db.exec(pending(file));
    es1 = await onboard(db, 'en');
    es2 = await onboard(db, 'en');
    it = await onboard(db, 'it');
    pt = await onboard(db, 'en');
    await db.query(
      `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
         last_accuracy, first_completed_at, last_completed_at)
       select $1, l.id, 1, 1, 1, now(), now() from public.lessons l
       where l.unit_id = 'a1-u01' and l.is_published`,
      [es1],
    );
    beforeSnap = await snapshot();
    // Antes, las funciones de Ranked devolvían también unidades de los cursos nuevos (sin publicar):
    // no aportaban contenido (sus palabras no estaban publicadas). Lo que hay que conservar es lo demás.
    foreignBefore = (
      await rows(
        db,
        `select id from public.curriculum_units u join public.courses c on c.code = u.course_code
         where not c.is_default and (u.is_published
           or exists (select 1 from public.words w where w.unit_id = u.id and w.is_published))`,
      )
    ).map((r) => r.id);
    // en-from-pt como quedaría publicado (en producción sigue oculto y sin publicar).
    await db.exec(`
      update public.courses set status = 'available' where code = 'en-from-pt';
      update public.curriculum_units set is_published = true where course_code = 'en-from-pt';
      update public.lessons set is_published = true
        where unit_id in (select id from public.curriculum_units where course_code = 'en-from-pt');
      update public.words set is_published = true where course_code = 'en-from-pt';
    `);
    await as(db, 'authenticated', pt, () =>
      db.query(`select public.set_active_course('en-from-pt')`),
    );
    mixedBefore = await common(db, 'en', [es1, pt]);
    await db.exec(migrationSql);
  });

  after(async () => {
    await emu?.close();
  });

  test('el curso de cada uno: es1/es2 en en-from-es, pt en en-from-pt', async () => {
    const course = async (u) =>
      (await service(db, `select public.user_course_for($1, 'en') c`, [u]))[0].c;
    assert.equal(await course(es1), 'en-from-es');
    assert.equal(await course(pt), 'en-from-pt');
  });

  test('para los cursos de siempre no cambia nada (y la migración es idempotente)', async () => {
    assert.ok(beforeSnap.pair.length > 0 && beforeSnap.it.length > 0);
    assert.equal(beforeSnap.none, null);
    assert.deepEqual(foreignBefore, [], 'los cursos nuevos no aportaban nada publicado');
    // Igual que antes, sin las unidades (vacías) de los cursos nuevos; y ahora en-from-pt está
    // publicado y aun así no entra en las partidas de en-from-es.
    const expected = defaultOnly(beforeSnap);
    assert.deepEqual(await snapshot(), expected);
    await db.exec(migrationSql);
    assert.deepEqual(await snapshot(), expected);
  });

  test('unidad canónica: misma posición curricular en el curso por defecto', async () => {
    const canon = async (u) =>
      (await service(db, `select public.rush_canonical_unit_id($1) c`, [u]))[0].c;
    assert.equal(await canon('ept-a1-u03'), 'a1-u03');
    assert.equal(await canon('ept-b1-u12'), 'b1-u12');
    assert.equal(await canon('a1-u03'), 'a1-u03');
    assert.equal(await canon('it-a1-u03'), 'it-a1-u03');
    assert.equal(await canon('no-existe'), null);
    // Todas las unidades de en-from-pt tienen su par canónico.
    const orphans = await rows(
      db,
      `select id from public.curriculum_units where course_code = 'en-from-pt'
         and public.rush_canonical_unit_id(id) is null`,
    );
    assert.deepEqual(orphans, []);
    // Nadie de la app la llama.
    await assert.rejects(
      as(db, 'authenticated', es1, () =>
        db.query(`select public.rush_canonical_unit_id('a1-u01')`),
      ),
      /permission denied/,
    );
  });

  test('pareja mixta es + pt: unidades comunes canónicas (antes no compartían A1)', async () => {
    const mixed = await common(db, 'en', [es1, pt]);
    assert.ok(mixed.length > 0);
    assert.ok(
      mixed.every((u) => !u.startsWith('ept-')),
      'sólo unidades del curso canónico',
    );
    const a1 = mixed.filter((u) => u.startsWith('a1-'));
    assert.ok(a1.includes('a1-u01'), 'A1 U1, la que es1 desbloqueó, es común');
    assert.ok(!(mixedBefore ?? []).some((u) => u.startsWith('a1-')), 'antes: ninguna A1 en común');
    // Simétrica y con bot (el bot no cuenta).
    assert.deepEqual(await common(db, 'en', [pt, es1]), mixed);
    assert.deepEqual(await common(db, 'en', [pt, es1, null], [1, 0, 0]), mixed);
    // pt solo: el equivalente canónico de cada unidad de su curso.
    const ptSolo = await common(db, 'en', [pt]);
    const expected = (
      await rows(
        db,
        `select public.rush_canonical_unit_id(id) c from public.curriculum_units
         where course_code = 'en-from-pt' order by 1`,
      )
    ).map((r) => r.c);
    assert.deepEqual(ptSolo, expected);
    // pt (curso sin rutas) puede usar todo su curso (A1–B1): lo común es lo de es1 dentro de eso.
    const ptSet = new Set(ptSolo);
    assert.deepEqual(
      mixed,
      defaultOnly(beforeSnap).solo.filter((u) => ptSet.has(u)),
    );
    // Dos brasileños: lo mismo (cada uno su curso, todo canónico).
    const pt2 = await onboard(db, 'en');
    await as(db, 'authenticated', pt2, () =>
      db.query(`select public.set_active_course('en-from-pt')`),
    );
    assert.deepEqual(await common(db, 'en', [pt, pt2]), ptSolo);
  });

  test('partida contra bots en el teléfono: el brasileño sigue con las unidades de su curso', async () => {
    const units = await mine(db, pt, 'en');
    assert.ok(units.length > 0);
    assert.ok(units.every((u) => u.startsWith('ept-')));
    assert.deepEqual(await mine(db, es1, 'en'), defaultOnly(beforeSnap).mineEs);
  });

  test('consignas del banco: datos, permisos, trigger, idempotencia y rollback', async () => {
    await db.exec(TRANSLATIONS);
    const bank = WORD_RUSH_BANKS.en.sentences;
    const counts = await rows(
      db,
      `select source_language, count(*)::int n from public.word_rush_sentence_translations
       group by 1 order by 1`,
    );
    assert.deepEqual(counts, [
      { source_language: 'fr', n: bank.length },
      { source_language: 'it', n: bank.length },
      { source_language: 'pt', n: bank.length },
    ]);
    // Lo cargado es el contenido local, frase por frase.
    const loaded = await rows(
      db,
      `select sentence_id, source_language, translation from public.word_rush_sentence_translations`,
    );
    for (const r of loaded) {
      assert.equal(r.translation, EN_WORD_RUSH_SUPPORT.get(r.sentence_id)[r.source_language]);
    }
    // Idempotente.
    const hash = `select md5(string_agg(sentence_id || source_language || translation, '|'
                    order by sentence_id, source_language)) h from public.word_rush_sentence_translations`;
    const h1 = (await one(db, hash)).h;
    await db.exec(TRANSLATIONS);
    assert.equal((await one(db, hash)).h, h1);
    // Sólo el servidor lee; la app no ve nada.
    assert.equal(
      (await service(db, `select count(*)::int n from public.word_rush_sentence_translations`))[0]
        .n,
      bank.length * 3,
    );
    await assert.rejects(
      as(db, 'authenticated', es1, () =>
        db.query(`select * from public.word_rush_sentence_translations limit 1`),
      ),
      /permission denied/,
    );
    await assert.rejects(
      as(db, 'service_role', null, () =>
        db.query(
          `insert into public.word_rush_sentence_translations values ('${bank[0].id}', 'es', 'x')`,
        ),
      ),
      /permission denied/,
    );
    // Nunca en el idioma de la frase; nunca de una frase inexistente.
    await assert.rejects(
      db.query(
        `insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
         values ($1, 'en', 'Hello')`,
        [bank[0].id],
      ),
      /idioma de la frase/,
    );
    await assert.rejects(
      db.query(
        `insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
         values ('en.wr.no-existe', 'pt', 'Olá')`,
      ),
      /foreign key/,
    );
    // Rollback y vuelta a aplicar.
    await db.exec(TRANSLATIONS_DOWN);
    assert.equal(
      (await one(db, `select to_regclass('public.word_rush_sentence_translations') t`)).t,
      null,
    );
    await db.exec(TRANSLATIONS);
    assert.equal((await one(db, hash)).h, h1);
  });

  test('servidor real contra la base: partida mixta es + pt con el mismo inglés', async () => {
    emu = await startEmulator(db, { serviceKey: SERVICE_KEY, anonKey: ANON_KEY });
    const real = createSupabaseStore(createServiceClient(emu.url, SERVICE_KEY), silentLogger);

    // Lo que el servidor lee de la base: catálogo, palabras por curso y consignas del banco.
    const courses = await real.courses();
    assert.ok(courses.some((c) => c.code === 'en-from-es' && c.isDefault));
    const ptCourse = courses.find((c) => c.code === 'en-from-pt');
    assert.equal(ptCourse?.sourceLanguage, 'pt');
    const ptWords = await real.loadWords('en', 'en-from-pt');
    assert.ok(ptWords.length > 0 && ptWords.every((w) => w.id.startsWith('ept-')));
    const esWords = await real.loadWords('en', 'en-from-es');
    assert.ok(esWords.length > 0 && esWords.every((w) => !w.id.startsWith('ept-')));
    const bankPt = await loadBankSupport(createServiceClient(emu.url, SERVICE_KEY), 'en', 'pt');
    assert.equal(bankPt.length, WORD_RUSH_BANKS.en.sentences.length);
    assert.ok(bankPt.every((s) => s.translation === EN_WORD_RUSH_SUPPORT.get(s.id).pt));

    // Partida por Socket.IO: lo curricular de la base, el resto en memoria (como curriculumPropagation).
    const store = new FakeStore();
    store.add({ ...player(es1, 100), courseCode: 'en-from-es' });
    store.add({ ...player(pt, 100), courseCode: 'en-from-pt' });
    store.courses = () => real.courses();
    store.loadWords = (lang, course) => real.loadWords(lang, course);
    store.rushUnits = (lang, players) => real.rushUnits(lang, players);
    store.loadSentences = async () => [];
    const warnings = [];
    const server = createBattleServer({
      store,
      verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
      logger: { ...silentLogger, warn: (m, d) => warnings.push({ m, d }) },
      arcadeRules: { ...ARCADE, countdownMs: 20, durationMs: 800, frenzyMs: 200 },
      tickMs: 20,
      random: seededRandom(3),
      botAfterMs: null,
      wordCacheMs: 0,
    });
    await new Promise((resolve) => server.http.listen(0, resolve));
    const url = `http://127.0.0.1:${server.http.address().port}`;
    const open = (u) =>
      connect(url, {
        transports: ['websocket'],
        auth: { token: `tok-${u}`, protocolVersion: ARCADE_PROTOCOL_VERSION },
        reconnection: false,
        forceNew: true,
      });
    const a = open(es1);
    const b = open(pt);
    try {
      await Promise.all(
        [a, b].map(
          (s) => new Promise((r, j) => (s.once('connect', r), s.once('connect_error', j))),
        ),
      );
      const views = { a: [], b: [] };
      a.on('arcade:challenge', (v) => views.a.push(v));
      b.on('arcade:challenge', (v) => views.b.push(v));
      const found = new Promise((r) => a.once('match:found', r));
      await a.emitWithAck('queue:join', { mode: 'ranked' });
      await b.emitWithAck('queue:join', { mode: 'ranked' });
      const snap = await found;
      await a.emitWithAck('match:ready', { battleId: snap.battleId });
      await b.emitWithAck('match:ready', { battleId: snap.battleId });
      await new Promise((r) => setTimeout(r, 300));
      assert.equal(views.a.length, 2);
      assert.deepEqual(
        views.b.map((v) => [v.index, v.kind, v.prompt ?? v.left]),
        views.a.map((v) => [v.index, v.kind, v.prompt ?? v.left]),
        'mismo inglés, mismo orden',
      );
      // Cada texto de apoyo del brasileño es la traducción de en-from-pt de esa misma palabra inglesa.
      const ptOf = new Map(ptWords.map((w) => [w.text.trim().toLowerCase(), w.translationEs]));
      const esOf = new Map(esWords.map((w) => [w.translationEs, w.text.trim().toLowerCase()]));
      for (const [va, vb] of views.a.map((v, i) => [v, views.b[i]])) {
        if (va.kind === 'audio') {
          assert.deepEqual(
            vb.options,
            va.options.map((o) => ptOf.get(esOf.get(o)) ?? o),
          );
        } else if (va.kind === 'connect') {
          assert.deepEqual(
            vb.right,
            va.right.map((o) => ptOf.get(esOf.get(o)) ?? o),
          );
        }
      }
      // Misma corrección para la misma respuesta.
      const v = views.a[0];
      const answer =
        v.kind === 'swipe'
          ? { kind: 'swipe', accept: true }
          : v.kind === 'audio'
            ? { kind: 'audio', option: 0 }
            : v.kind === 'connect'
              ? { kind: 'connect', left: 0, right: 0 }
              : { kind: 'sentence', order: v.tokens.map((_, i) => i) };
      await new Promise((r) => setTimeout(r, 250));
      const ra = await a.emitWithAck('arcade:answer', {
        battleId: snap.battleId,
        challengeIndex: 0,
        answer,
      });
      const rb = await b.emitWithAck('arcade:answer', {
        battleId: snap.battleId,
        challengeIndex: 0,
        answer,
      });
      assert.ok(ra.ok && rb.ok);
      assert.equal(ra.data.correct, rb.data.correct);
      assert.equal(ra.data.done, rb.data.done);
      assert.equal(ra.data.correctOption, rb.data.correctOption);
      await new Promise((r) => a.once('battle:finish', r));
      // Lo que no tenga traducción en en-from-pt se registra (no bloquea la partida).
      const missing = warnings.filter((w) => w.m === 'shared_pool_support_missing');
      assert.ok(missing.every((w) => w.d.course === 'en-from-pt'));
    } finally {
      a.disconnect();
      b.disconnect();
      await server.close();
    }
  });

  test('rollback: vuelven los cuerpos anteriores (y lo de siempre sigue igual)', async () => {
    await db.exec(rollbackSql);
    assert.equal(
      (await one(db, `select to_regprocedure('public.rush_canonical_unit_id(text)') p`)).p,
      null,
    );
    assert.deepEqual(
      (await common(db, 'en', [es1, es2])).filter((u) => !FOREIGN.test(u)),
      defaultOnly(beforeSnap).pair,
    );
    assert.deepEqual(await common(db, 'en', [es1, pt]), mixedBefore);
    await db.exec(migrationSql);
    assert.deepEqual(await snapshot(), defaultOnly(beforeSnap));
  });
});
