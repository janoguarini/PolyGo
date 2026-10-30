/**
 * Genera una migración SQL idempotente con el contenido de content/a1.
 * Uso: npm run content:sql -- supabase/migrations/<timestamp>_content_a1.sql [--unit N]
 *
 * El contenido viaja como un único documento JSON dentro de un bloque DO, sin sentencias destructivas.
 * - Unidades, lecciones, palabras y ejercicios quedan publicados con review_status = 'draft'.
 * - Los ejercicios que ya no estén en el contenido se despublican (no se borran: conservan intentos).
 */
import { writeFileSync } from 'node:fs';

import { A1_PATH } from '../content/a1';
import { contentDocument } from './content-document';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:sql -- <archivo.sql>');
  process.exit(1);
}

// --unit N genera sólo esa unidad (migraciones más chicas; aplicar en orden).
const unitArg = process.argv.indexOf('--unit');
const onlyUnit = unitArg > 0 ? Number(process.argv[unitArg + 1]) : null;
const PATH = onlyUnit ? A1_PATH.filter((p) => p.unit.position === onlyUnit) : A1_PATH;
const UNITS = PATH.map((p) => p.unit);
if (UNITS.length === 0) throw new Error(`Unidad ${onlyUnit} inexistente`);

const document = contentDocument(PATH);

const payload = JSON.stringify(document);
if (payload.includes('$content$') || payload.includes('$polygo_content$'))
  throw new Error('El contenido no puede incluir los delimitadores $content$ ni $polygo_content$');

const sql = `-- =====================================================================
-- Contenido A1 generado por scripts/build-content-sql.ts. NO editar a mano:
-- editar content/a1/*.ts, correr los tests (npm test) y regenerar.
-- ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin

insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
select x.id, 'en', 'A1', x.position, x.title_es, x.title_en, x.description_es, x.emoji, true
from jsonb_to_recordset(d -> 'units')
  as x(id text, position smallint, title_es text, title_en text, description_es text, emoji text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es, title_en = excluded.title_en,
  description_es = excluded.description_es, emoji = excluded.emoji, is_published = true;

insert into public.words (id, language_code, unit_id, text, translation_es, accepted_translations, ipa, emoji,
  example_en, example_es, difficulty, tags, is_published)
select x.id, 'en', x.unit_id, x.text, x.translation_es, x.accepted_translations, x.ipa, x.emoji,
  x.example_en, x.example_es, x.difficulty, x.tags, true
from jsonb_to_recordset(d -> 'words')
  as x(id text, unit_id text, text text, translation_es text, accepted_translations text[], ipa text, emoji text,
       example_en text, example_es text, difficulty smallint, tags text[])
on conflict (id) do update set unit_id = excluded.unit_id, text = excluded.text, translation_es = excluded.translation_es,
  accepted_translations = excluded.accepted_translations, ipa = excluded.ipa, emoji = excluded.emoji,
  example_en = excluded.example_en, example_es = excluded.example_es, difficulty = excluded.difficulty,
  tags = excluded.tags, is_published = true;

-- Las posiciones son únicas por unidad: liberarlas antes de reordenar (se intercalan lecciones).
update public.lessons set position = position + 1000
where id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x) and position < 1000;

insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published)
select x.id, x.unit_id, x.position, x.title_es, x.objective_es, true
from jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es,
  objective_es = excluded.objective_es, is_published = true;

-- Las posiciones son únicas por lección: liberarlas antes de reordenar.
update public.exercises set position = position + 1000
where lesson_id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x);

insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, accepted_answers,
  explanation_es, difficulty, recommended_seconds, is_published)
select x.id, x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
  x.explanation_es, x.difficulty, x.recommended_seconds, true
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)
on conflict (id) do update set lesson_id = excluded.lesson_id, position = excluded.position, type = excluded.type,
  skill = excluded.skill, prompt_es = excluded.prompt_es, payload = excluded.payload, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, explanation_es = excluded.explanation_es,
  difficulty = excluded.difficulty, recommended_seconds = excluded.recommended_seconds, is_published = true;

-- Ejercicios retirados del contenido: se despublican y se corre su posición fuera del rango usado.
update public.exercises set is_published = false
where lesson_id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x)
  and id not in (select x ->> 'id' from jsonb_array_elements(d -> 'exercises') x);

-- Sin sentencias destructivas: sólo se agregan vínculos. Si se quita una palabra de un ejercicio,
-- el vínculo viejo debe borrarse con una migración escrita a mano.
insert into public.exercise_words (exercise_id, word_id)
select x ->> 'id', w
from jsonb_array_elements(d -> 'exercises') x, jsonb_array_elements_text(x -> 'words') w
on conflict do nothing;

end
$polygo_content$;
`;

writeFileSync(out, sql, 'utf8');
console.log(
  `OK ${out}: ${document.units.length} unidades, ${document.lessons.length} lecciones, ` +
    `${document.words.length} palabras, ${document.exercises.length} ejercicios, ${Buffer.byteLength(sql)} bytes`,
);
