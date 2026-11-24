// Herramientas de solo lectura para la integración incremental (docs/DB_RECONCILIATION_PLAN.md §8.1).
// - snapshotSql(tables): UN SELECT que devuelve una fila `snap` (jsonb) con conteos de tablas, historial,
//   huella del esquema, estado S1 y totales publicados.
// - postcheckSql(pre, expected): UN SELECT que compara el estado actual contra la instantánea previa
//   más los cambios esperados (medidos en el ensayo PGlite).
// Funcionan igual en producción (vía `supabase db query --read-only`) y en PGlite.

const q = (s) => `$q$${s}$q$`;

/** Consulta que lista las tablas a contar (esquemas public y ranked_legacy, más auth.users). */
export const TABLES_SQL = `select coalesce(json_agg(n.nspname || '.' || c.relname order by n.nspname, c.relname), '[]'::json) as tables
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p') and n.nspname in ('public', 'ranked_legacy')`;

/** Partes de la huella del esquema (cada una es un md5). La restricción de nivel va aparte. */
const FP = {
  functions: `select md5(coalesce(string_agg(n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')=' || md5(p.prosrc) || ':' || p.prosecdef || ':' || coalesce(array_to_string(p.proconfig, ';'), ''), ',' order by n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)), ''))
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'ranked_legacy')`,
  policies: `select md5(coalesce(string_agg(tablename || '.' || policyname || ':' || cmd || ':' || roles::text || ':' || coalesce(qual, '') || ':' || coalesce(with_check, ''), ',' order by tablename, policyname), ''))
    from pg_policies where schemaname = 'public'`,
  triggers: `select md5(coalesce(string_agg(pg_get_triggerdef(t.oid), ',' order by c.relname, t.tgname), ''))
    from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and not t.tgisinternal`,
  indexes: `select md5(coalesce(string_agg(indexdef, ',' order by tablename, indexname), '')) from pg_indexes where schemaname = 'public'`,
  constraints: `select md5(coalesce(string_agg(c.conrelid::regclass::text || '.' || c.conname || '=' || pg_get_constraintdef(c.oid), ',' order by c.conrelid::regclass::text, c.conname), ''))
    from pg_constraint c join pg_namespace n on n.oid = c.connamespace
    where n.nspname = 'public' and c.conname <> 'curriculum_units_level_check'`,
  columns: `select md5(coalesce(string_agg(table_name || '.' || column_name || ':' || data_type || ':' || is_nullable || ':' || coalesce(column_default, ''), ',' order by table_name, ordinal_position), ''))
    from information_schema.columns where table_schema = 'public'`,
  grants: `select md5(coalesce(string_agg(grantee || ':' || table_name || ':' || privilege_type, ',' order by table_name, grantee, privilege_type), ''))
    from information_schema.role_table_grants where table_schema = 'public'`,
};

const LEVEL_CHECK = `select pg_get_constraintdef(oid) from pg_constraint where conname = 'curriculum_units_level_check'`;

const HARD = (name) =>
  `(select md5(p.prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = '${name}')`;
const S1 = `select case when ${HARD('srs_apply_me_hint')} = '8581ce6e7e0ba2939aa26a071d9e781b'
  and ${HARD('mastery_process_queue_safe')} = 'a397e5236498af73cd92de0933542344'
  and (select count(*) from supabase_migrations.schema_migrations where version = '20261118120000') = 1 then 'S1' else 'NO S1' end`;

const PUBLISHED = `select json_build_object(
  'units', (select count(*) from public.curriculum_units where is_published),
  'words', (select count(*) from public.words where is_published),
  'lessons', (select count(*) from public.lessons where is_published),
  'exercises', (select count(*) from public.exercises where is_published),
  'items_active', (select count(*) from public.exercise_items where status = 'active'),
  'concepts_active', (select count(*) from public.concepts where status = 'active'))`;

export function snapshotSql(tables) {
  const pairs = [
    ...tables.map((t) => {
      const [s, n] = t.split('.');
      return `${q(t)}, (select count(*) from "${s}"."${n}")`;
    }),
    `'auth.users', (select count(*) from auth.users)`,
  ];
  // jsonb_build_object admite hasta 100 argumentos: de a 40 pares, concatenados.
  const chunks = [];
  for (let i = 0; i < pairs.length; i += 40)
    chunks.push(`jsonb_build_object(\n    ${pairs.slice(i, i + 40).join(',\n    ')})`);
  return `-- Instantánea de solo lectura (ops/db-reconciliation/lib.mjs). Un único SELECT.
select json_build_object(
  'taken_at', now(),
  'tables', ${chunks.join('\n  || ')},
  'history', (select json_agg(version order by version) from supabase_migrations.schema_migrations),
  'fp', json_build_object(${Object.entries(FP)
    .map(([k, s]) => `${q(k)}, (${s})`)
    .join(',\n    ')}),
  'level_check', (${LEVEL_CHECK}),
  's1', (${S1}),
  'published', (${PUBLISHED})
) as snap;
`;
}

/**
 * POSTCHECK: `pre` es la instantánea previa; `expected` = { tableDeltas: {tabla: n}, newVersions:
 * [[version, name]], levelCheck: 'CHECK (...)' }. Toda tabla sin delta tiene que quedar igual.
 */
export function postcheckSql(pre, expected) {
  const rows = [];
  const add = (id, descr, expectedText, actualSql, okSql) =>
    rows.push(
      `select ${q(id)} as id, ${q(descr)} as descripcion, ${q(expectedText)} as esperado, (${actualSql})::text as obtenido, coalesce((${okSql}), false) as ok`,
    );
  // Tablas: conteo = previo + delta (0 si no figura).
  const tables = Object.keys(pre.tables).sort();
  for (const t of Object.keys(expected.tableDeltas))
    if (!tables.includes(t))
      throw new Error(`delta para una tabla que no está en la instantánea: ${t}`);
  let i = 0;
  for (const t of tables) {
    const want = pre.tables[t] + (expected.tableDeltas[t] ?? 0);
    const src = t === 'auth.users' ? 'auth.users' : `"${t.split('.')[0]}"."${t.split('.')[1]}"`;
    const delta = expected.tableDeltas[t] ?? 0;
    add(
      `T${String(++i).padStart(3, '0')}`,
      `${t}: ${pre.tables[t]} ${delta ? `+ ${delta}` : '(sin cambios)'}`,
      String(want),
      `select count(*) from ${src}`,
      `select count(*) = ${want} from ${src}`,
    );
  }
  // Historial: las filas previas, intactas, más exactamente las nuevas.
  const prevVersions = pre.history;
  const newVersions = expected.newVersions.map(([v]) => v);
  const allVersions = [...prevVersions, ...newVersions].sort();
  add(
    'H01',
    `Historial: ${prevVersions.length} previas + ${newVersions.length} nuevas`,
    String(allVersions.length),
    'select count(*) from supabase_migrations.schema_migrations',
    `select count(*) = ${allVersions.length} from supabase_migrations.schema_migrations`,
  );
  add(
    'H02',
    'Historial: exactamente las versiones previas más las nuevas',
    'ok',
    `select case when array_agg(version order by version) = array[${allVersions.map(q).join(',')}]::text[] then 'ok' else 'distinto' end from supabase_migrations.schema_migrations`,
    `select array_agg(version order by version) = array[${allVersions.map(q).join(',')}]::text[] from supabase_migrations.schema_migrations`,
  );
  for (const [v, name] of expected.newVersions)
    add(
      `H-${v}`,
      `Fila ${v}_${name} registrada una vez, con su nombre`,
      '1',
      `select count(*) from supabase_migrations.schema_migrations where version = ${q(v)} and name = ${q(name)}`,
      `select count(*) = 1 from supabase_migrations.schema_migrations where version = ${q(v)} and name = ${q(name)}`,
    );
  // Huella del esquema: igual en todo salvo la restricción de nivel.
  for (const [k, s] of Object.entries(FP))
    add(`F-${k}`, `Huella de ${k} sin cambios`, pre.fp[k], s, `(${s}) = ${q(pre.fp[k])}`);
  add(
    'F-level',
    'CHECK de nivel con el valor esperado',
    expected.levelCheck,
    LEVEL_CHECK,
    `(${LEVEL_CHECK}) = ${q(expected.levelCheck)}`,
  );
  add('S1', 'Learning Machine sigue en S1', 'S1', S1, `(${S1}) = 'S1'`);
  add(
    'PUB',
    'Nada nuevo publicado (totales publicados y activos sin cambios)',
    JSON.stringify(pre.published),
    PUBLISHED,
    `(${PUBLISHED})::jsonb = ${q(JSON.stringify(pre.published))}::jsonb`,
  );
  return `-- POSTCHECK de solo lectura (ops/db-reconciliation/lib.mjs). Un único SELECT.
-- Instantánea previa tomada: ${pre.taken_at}
with c as (
${rows.join('\nunion all\n')}
)
select * from c
union all
select 'VEREDICTO', 'GO si todas dan ok', 'GO',
  case when bool_and(ok) then 'GO' else 'NO-GO: ' || string_agg(id, ',') filter (where not ok) end,
  bool_and(ok)
from c
order by 1;
`;
}
