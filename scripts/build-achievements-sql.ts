/**
 * Genera la migración del catálogo de logros desde shared/achievements.ts.
 * Uso: npx tsx scripts/build-achievements-sql.ts supabase/migrations/<timestamp>_achievements_catalog.sql
 *
 * Idempotente y sin sentencias destructivas: upsert de todos los niveles y desactivación de los que
 * ya no estén en el catálogo (los desbloqueos se conservan).
 */
import { writeFileSync } from 'node:fs';

import { achievementRows } from '../shared/achievements';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npx tsx scripts/build-achievements-sql.ts <archivo.sql>');
  process.exit(1);
}

const rows = achievementRows();
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const values = rows
  .map(
    (r) =>
      `  (${q(r.id)}, ${q(r.category)}, ${q(r.metric)}, ${r.threshold}, ${q(r.title_es)}, ${q(
        r.description_es,
      )}, ${q(r.icon)}, ${r.position})`,
  )
  .join(',\n');

const sql = `-- =====================================================================
-- Catálogo de logros generado por scripts/build-achievements-sql.ts desde shared/achievements.ts.
-- NO editar el catálogo a mano: editar shared/achievements.ts y regenerar.
-- ${rows.length} niveles
-- =====================================================================

-- Las posiciones son únicas: se corren fuera de rango antes de reordenar.
update public.achievements set position = position + 1000 where position < 1000;

insert into public.achievements (id, category, metric, threshold, title_es, description_es, icon, position, is_active) values
${values.replace(/\)(,?)$/gm, ', true)$1')}
on conflict (id) do update set
  category = excluded.category, metric = excluded.metric, threshold = excluded.threshold,
  title_es = excluded.title_es, description_es = excluded.description_es, icon = excluded.icon,
  position = excluded.position, is_active = true;

-- Niveles retirados del catálogo: se desactivan (quien los tenía los conserva en su historial).
update public.achievements set is_active = false
where id not in (${rows.map((r) => q(r.id)).join(', ')});

-- Logros ya alcanzados por usuarios existentes (p. ej. niveles nuevos por debajo de los que tenían).
select public.evaluate_achievements(id) from public.profiles;
`;

writeFileSync(out, sql, 'utf8');
console.log(`OK ${out}: ${rows.length} niveles, ${Buffer.byteLength(sql)} bytes`);
