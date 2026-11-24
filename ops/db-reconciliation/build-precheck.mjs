// PRECHECK de solo lectura para la integración incremental (docs/DB_RECONCILIATION_PLAN.md §8, paso 0b).
//
//   node ops/db-reconciliation/build-precheck.mjs <dir con migrations/ y pending/> <salida.sql>
//
// Genera UN solo SELECT (sin funciones con efectos), pensado para ejecutarse con
//   npx supabase db query --remote=<ref> --read-only -f <salida.sql>
// Cada fila es una comprobación: id, descripción, esperado, obtenido y ok. La última fila es el veredicto.
// El francés queda FUERA: sólo se comprueba que no esté cargado (B1–B11 pendientes).
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const [root, out] = process.argv.slice(2);
if (!root || !out) throw new Error('uso: build-precheck.mjs <dir> <salida.sql>');

// Las 8 cargas a integrar (sin francés ni español), en el orden del plan.
const LOADS = [
  ['20261113120300_planned_lessons_en_a1_u13_u14.sql', '5d240802266e72c6'],
  ['20261119120000_a1_en_closure.sql', '2d37a8dec8da25fc'],
  ['20261120120000_a2_en_completion.sql', '86dc9a9fa4d9b1ff'],
  ['20261122120000_b1_en.sql', 'b566e927bf796d08'],
  ['20261124120000_b2_en.sql', 'f06ef4b44820e1f4'],
  ['20261126120000_pt_a1_a2.sql', 'aa16bcb79e87e227'],
  ['20261128120000_it_a1_a2.sql', '3bcb320f5cd966c4'],
  ['20261130120000_zh_a1_a2.sql', 'f416450cb77c945a'],
];

// Historial de producción leído el 2026-11-21 (110 versiones).
const PROD_VERSIONS =
  `20261029010416 20261029010511 20261029021909 20261029022122 20261029022239 20261029134056
20261029140504 20261029144242 20261030025417 20261030025602 20261030025732 20261030025909 20261030030041
20261030030212 20261030030341 20261030030514 20261030030645 20261030030654 20261030140941 20261030141219
20261030141517 20261030141748 20261030142018 20261030142335 20261030142602 20261030142829 20261030143104
20261030143334 20261030143604 20261030143835 20261030144109 20261030151223 20261030153550 20261030153635
20261030173136 20261030173210 20261030173305 20261030180553 20261030210514 20261030213841 20261030221420
20261031002005 20261031014123 20261031025105 20261031150231 20261031150329 20261031191426 20261031193836
20261101025216 20261101025309 20261101033312 20261101033456 20261101034944 20261101041401 20261101041517
20261101042815 20261101151020 20261102004033 20261102030524 20261104004214 20261104005655 20261104130546
20261106182124 20261106182135 20261107120000 20261107130000 20261107130101 20261107130102 20261107130103
20261107130104 20261107140000 20261107140100 20261107150000 20261107150100 20261107160000 20261107170000
20261107180000 20261108120000 20261108120101 20261108120102 20261108120103 20261108120104 20261108130000
20261108130101 20261108130102 20261108130103 20261108130104 20261108140000 20261108150000 20261109120000
20261109130000 20261109140000 20261110120000 20261110130000 20261110140000 20261111120000 20261112120000
20261113120000 20261113120100 20261113120200 20261114120000 20261115120000 20261115153056 20261115220003
20261116120000 20261116120001 20261117120000 20261118120000 20261209120000 20261213100000`
    .split(/\s+/)
    .filter(Boolean)
    .sort();
const versionsMd5 = createHash('md5').update(PROD_VERSIONS.join(',')).digest('hex');

const grab = (f) => {
  const t = readFileSync(f, 'utf8');
  const tag = '$content$';
  const a = t.indexOf(tag) + tag.length;
  return { text: t, d: JSON.parse(t.slice(a, t.indexOf(tag, a))) };
};
const sha = (t) => createHash('sha256').update(t).digest('hex');
const q = (s) => `$q$${s}$q$`;
const arr = (xs) => `array[${xs.map(q).join(',')}]::text[]`;

const docs = LOADS.map(([f, expect]) => {
  const { text, d } = grab(join(root, 'migrations', f));
  const got = sha(text).slice(0, 16);
  if (got !== expect) throw new Error(`${f}: SHA-256 ${got} ≠ ${expect}`);
  return { f, d };
});

// Filas que ya existen en producción y que las cargas comparan (lecciones planificadas y cierre de A1).
const PROD_UNITS = new Set();
const PROD_LESSONS = new Set();
{
  const p2 = (n) => String(n).padStart(2, '0');
  const std = ['final', 'l01', 'l02', 'l03', 'l04', 'l05', 'listen', 'rev1', 'rev2', 'words'];
  for (let i = 1; i <= 14; i++) PROD_UNITS.add(`a1-u${p2(i)}`);
  for (let i = 1; i <= 12; i++) {
    PROD_UNITS.add(`a2-u${p2(i)}`);
    for (const g of ['it', 'pt', 'zh']) PROD_UNITS.add(`${g}-a1-u${p2(i)}`);
    for (const s of [...std, 'context']) PROD_LESSONS.add(`a1-u${p2(i)}-${s}`);
    for (const s of std) {
      PROD_LESSONS.add(`a2-u${p2(i)}-${s}`);
      for (const g of ['it', 'pt', 'zh']) PROD_LESSONS.add(`${g}-a1-u${p2(i)}-${s}`);
    }
  }
  PROD_LESSONS.add('a1-u13-context');
  PROD_LESSONS.add('a1-u14-context');
}
const overlapUnits = [];
const overlapLessons = [];
for (const { f, d } of docs) {
  for (const u of d.units)
    if (PROD_UNITS.has(u.id)) overlapUnits.push({ ...u, _from: f.slice(0, 14) });
  for (const l of d.lessons)
    if (PROD_LESSONS.has(l.id)) overlapLessons.push({ ...l, _from: f.slice(0, 14) });
}

// Dependencias externas: palabras y conceptos que las cargas enlazan sin crearlos.
const own = docs.map(({ d }) => ({
  words: new Set(d.words.map((w) => w.id)),
  concepts: new Set(d.catalog.concepts.map((c) => c.id)),
}));
const allOwnWords = new Set(own.flatMap((o) => [...o.words]));
const allOwnConcepts = new Set(own.flatMap((o) => [...o.concepts]));
const extWords = new Set();
const extConcepts = new Set();
for (const { d } of docs) {
  for (const e of d.exercises)
    for (const w of e.words ?? []) if (!allOwnWords.has(w)) extWords.add(w);
  for (const c of d.catalog.item_concepts)
    if (!allOwnConcepts.has(c.concept_id)) extConcepts.add(c.concept_id);
}

// Ids nuevos que NO deben existir todavía (salvo los solapes intencionales de unidades y lecciones).
const newWords = docs.flatMap(({ d }) => d.words.map((w) => w.id));
const newExercises = docs.flatMap(({ d }) => d.exercises.map((e) => e.id));
const newItems = docs.flatMap(({ d }) => d.catalog.items.map((i) => i.id));
const newLessons = docs
  .flatMap(({ d }) => d.lessons.map((l) => l.id))
  .filter((id) => !PROD_LESSONS.has(id));
const newUnits = docs
  .flatMap(({ d }) => d.units.map((u) => u.id))
  .filter((id) => !PROD_UNITS.has(id));

const unitsJson = JSON.stringify(overlapUnits);
const lessonsJson = JSON.stringify(overlapLessons);
if (unitsJson.includes('$u$') || lessonsJson.includes('$l$'))
  throw new Error('delimitador en el JSON');

const checks = [];
const add = (id, descr, expected, actualSql, okSql) =>
  checks.push(
    `select ${q(id)} as id, ${q(descr)} as descripcion, ${q(expected)} as esperado, (${actualSql})::text as obtenido, coalesce((${okSql}), false) as ok`,
  );

add(
  'P01',
  'Historial: 110 filas',
  '110',
  'select count(*) from supabase_migrations.schema_migrations',
  'select count(*) = 110 from supabase_migrations.schema_migrations',
);
add(
  'P02',
  'Historial: mismas versiones que el 2026-11-21 (md5 de la lista)',
  versionsMd5,
  "select md5(string_agg(version, ',' order by version)) from supabase_migrations.schema_migrations",
  `select md5(string_agg(version, ',' order by version)) = ${q(versionsMd5)} from supabase_migrations.schema_migrations`,
);
add(
  'P03',
  'Ninguna versión de las 8 cargas registrada',
  '0',
  `select count(*) from supabase_migrations.schema_migrations where version = any(${arr(LOADS.map(([f]) => f.slice(0, 14)))})`,
  `select count(*) = 0 from supabase_migrations.schema_migrations where version = any(${arr(LOADS.map(([f]) => f.slice(0, 14)))})`,
);
const hard = `select md5(p.prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname =`;
add(
  'P04',
  'Learning Machine en S1 (hardening 20261118120000)',
  'S1',
  `select case when (${hard} 'srs_apply_me_hint') = '8581ce6e7e0ba2939aa26a071d9e781b' and (${hard} 'mastery_process_queue_safe') = 'a397e5236498af73cd92de0933542344' and (select count(*) from supabase_migrations.schema_migrations where version = '20261118120000') = 1 then 'S1' else 'NO S1' end`,
  `select (${hard} 'srs_apply_me_hint') = '8581ce6e7e0ba2939aa26a071d9e781b' and (${hard} 'mastery_process_queue_safe') = 'a397e5236498af73cd92de0933542344' and (select count(*) from supabase_migrations.schema_migrations where version = '20261118120000') = 1`,
);
const infra = `select format('tablas=%s funciones=%s politicas=%s triggers=%s indices=%s buckets=%s',
  (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind in ('r','p')),
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'),
  (select count(*) from pg_policies where schemaname = 'public'),
  (select count(*) from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal),
  (select count(*) from pg_indexes where schemaname = 'public'),
  (select count(*) from storage.buckets))`;
add(
  'P05',
  'Infraestructura igual a la línea base',
  'tablas=107 funciones=262 politicas=36 triggers=69 indices=256 buckets=1',
  infra,
  `${infra} = 'tablas=107 funciones=262 politicas=36 triggers=69 indices=256 buckets=1'`,
);
add(
  'P06',
  'CHECK de nivel todavía A1/A2 (B1 y B2 lo amplían)',
  "CHECK ((level = ANY (ARRAY['A1'::text, 'A2'::text])))",
  "select pg_get_constraintdef(oid) from pg_constraint where conname = 'curriculum_units_level_check'",
  "select pg_get_constraintdef(oid) = 'CHECK ((level = ANY (ARRAY[''A1''::text, ''A2''::text])))' from pg_constraint where conname = 'curriculum_units_level_check'",
);
const content = `select string_agg(format('%s/%s=%s/%s', language_code, level, n, p), ' ' order by language_code, level) from (select language_code, level, count(*) n, count(*) filter (where is_published) p from public.curriculum_units group by 1, 2) z`;
const contentExpected = 'en/A1=14/12 en/A2=12/12 it/A1=12/12 pt/A1=12/12 zh/A1=12/12';
add(
  'P07',
  'Unidades por idioma/nivel (total/publicadas)',
  contentExpected,
  content,
  `(${content}) = ${q(contentExpected)}`,
);
const items = `select string_agg(format('%s/%s=%s', language_code, status, n), ' ' order by language_code, status) from (select language_code, status, count(*) n from public.exercise_items group by 1, 2) z`;
const itemsExpected = 'en/active=1681 en/draft=91 it/active=844 pt/active=842 zh/active=831';
add('P08', 'Ítems por idioma/estado', itemsExpected, items, `(${items}) = ${q(itemsExpected)}`);
add(
  'P09',
  'Ninguna unidad nueva de las cargas existe',
  '0',
  `select count(*) from public.curriculum_units where id = any(${arr(newUnits)})`,
  `select count(*) = 0 from public.curriculum_units where id = any(${arr(newUnits)})`,
);
add(
  'P10',
  'Ninguna lección nueva de las cargas existe',
  '0',
  `select count(*) from public.lessons where id = any(${arr(newLessons)})`,
  `select count(*) = 0 from public.lessons where id = any(${arr(newLessons)})`,
);
add(
  'P11',
  'Ninguna palabra nueva de las cargas existe',
  '0',
  `select count(*) from public.words where id = any(${arr(newWords)})`,
  `select count(*) = 0 from public.words where id = any(${arr(newWords)})`,
);
add(
  'P12',
  'Ningún ejercicio nuevo de las cargas existe',
  '0',
  `select count(*) from public.exercises where id = any(${arr(newExercises)})`,
  `select count(*) = 0 from public.exercises where id = any(${arr(newExercises)})`,
);
add(
  'P13',
  'Ningún ítem nuevo de las cargas existe',
  '0',
  `select count(*) from public.exercise_items where id = any(${arr(newItems)})`,
  `select count(*) = 0 from public.exercise_items where id = any(${arr(newItems)})`,
);
add(
  'P14',
  `Palabras enlazadas por las cargas existen y están publicadas (${extWords.size})`,
  String(extWords.size),
  `select count(*) from public.words where is_published and id = any(${arr([...extWords])})`,
  `select count(*) = ${extWords.size} from public.words where is_published and id = any(${arr([...extWords])})`,
);
add(
  'P15',
  `Conceptos enlazados por las cargas existen (${extConcepts.size})`,
  String(extConcepts.size),
  `select count(*) from public.concepts where id = any(${arr([...extConcepts])})`,
  `select count(*) = ${extConcepts.size} from public.concepts where id = any(${arr([...extConcepts])})`,
);
const unitDiff = `select coalesce(string_agg(x.id, ','), '') from jsonb_to_recordset($u$${unitsJson}$u$::jsonb)
  as x(id text, language_code text, level text, position smallint, title_es text, title_en text, description_es text,
       emoji text, objective_es text, grammar jsonb, review_status text)
  left join public.curriculum_units u on u.id = x.id
  where u.id is null or (u.language_code, u.level, u.position, u.title_es, u.title_en, u.description_es, u.emoji, u.objective_es,
       u.grammar, u.review_status)
   is distinct from (x.language_code, x.level, x.position, x.title_es, x.title_en, x.description_es, x.emoji,
       x.objective_es, x.grammar, x.review_status)`;
add(
  'P16',
  `Unidades existentes que comparan las cargas, idénticas (${overlapUnits.length})`,
  '(ninguna distinta)',
  unitDiff,
  `(${unitDiff}) = ''`,
);
const lessonDiff = `select coalesce(string_agg(x.id, ','), '') from jsonb_to_recordset($l$${lessonsJson}$l$::jsonb)
  as x(id text, unit_id text, position smallint, title_es text, objective_es text, intro jsonb, takeaways text[])
  left join public.lessons l on l.id = x.id
  where l.id is null or (l.unit_id, l.position, l.title_es, l.objective_es, l.intro, l.takeaways)
   is distinct from (x.unit_id, x.position, x.title_es, x.objective_es, x.intro, x.takeaways)`;
add(
  'P17',
  `Lecciones existentes que compara el cierre de A1, idénticas (${overlapLessons.length})`,
  '(ninguna distinta)',
  lessonDiff,
  `(${lessonDiff}) = ''`,
);
add(
  'P18',
  'Francés fuera: sin unidades, palabras ni versiones',
  '0/0/0',
  "select format('%s/%s/%s', (select count(*) from public.curriculum_units where language_code = 'fr'), (select count(*) from public.words where language_code = 'fr'), (select count(*) from supabase_migrations.schema_migrations where version in ('20261202120000','20261203120000')))",
  "select (select count(*) from public.curriculum_units where language_code = 'fr') = 0 and (select count(*) from public.words where language_code = 'fr') = 0 and (select count(*) from supabase_migrations.schema_migrations where version in ('20261202120000','20261203120000')) = 0",
);
const langs = `select string_agg(format('%s:%s:%s', code, content_status, case when ranked_available then 'true' else 'false' end), ' ' order by code) from public.languages`;
const langsExpected =
  'en:available:true es:soon:false fr:hidden:false it:available:true pt:available:true zh:available:true';
add(
  'P19',
  'Idiomas sin cambios (fr sigue hidden)',
  langsExpected,
  langs,
  `(${langs}) = ${q(langsExpected)}`,
);
const users =
  "select format('auth.users=%s profiles=%s', (select count(*) from auth.users), (select count(*) from public.profiles))";
add(
  'P20',
  'Datos de usuario: una sola cuenta',
  'auth.users=1 profiles=1',
  users,
  `(${users}) = 'auth.users=1 profiles=1'`,
);
const other =
  "select count(*) from pg_stat_activity where datname = current_database() and pid <> pg_backend_pid() and state <> 'idle' and backend_type = 'client backend'";
add('P21', 'Sin otras sesiones activas en la base (informativo)', '0', other, `(${other}) = 0`);
add(
  'P22',
  'Sin transacciones abiertas de más de 60 s',
  '0',
  "select count(*) from pg_stat_activity where xact_start < now() - interval '60 seconds' and pid <> pg_backend_pid()",
  "select count(*) = 0 from pg_stat_activity where xact_start < now() - interval '60 seconds' and pid <> pg_backend_pid()",
);

// P21 es informativo: no entra en el veredicto.
const sql = `-- PRECHECK de solo lectura (docs/DB_RECONCILIATION_PLAN.md §8, paso 0b). Generado por
-- ops/db-reconciliation/build-precheck.mjs desde las migraciones de PolyGo. NO editar a mano: regenerar.
-- Ejecutar SOLO con: npx supabase db query --remote=<ref> --read-only -f <este archivo>
-- Un único SELECT: no escribe, no crea objetos, no llama funciones con efectos.
with c as (
${checks.join('\nunion all\n')}
)
select * from c
union all
select 'VEREDICTO', 'GO si todas las comprobaciones (salvo P21, informativa) dan ok', 'GO',
  case when bool_and(ok) filter (where id <> 'P21') then 'GO' else 'NO-GO: ' || string_agg(id, ',') filter (where not ok and id <> 'P21') end,
  bool_and(ok) filter (where id <> 'P21')
from c
order by 1;
`;
writeFileSync(out, sql, 'utf8');
console.log(
  `${out}: ${checks.length} comprobaciones · ${overlapUnits.length} unidades y ${overlapLessons.length} lecciones comparadas · ` +
    `${extWords.size} palabras y ${extConcepts.size} conceptos externos · ${newExercises.length} ejercicios y ${newItems.length} ítems nuevos · ` +
    `${Buffer.byteLength(sql)} bytes · sha256 ${sha(sql)}`,
);
