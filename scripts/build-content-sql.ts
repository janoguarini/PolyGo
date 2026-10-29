/**
 * Genera una migración SQL idempotente con el contenido de content/a1.
 * Uso: npm run content:sql -- supabase/migrations/<timestamp>_content_a1.sql
 *
 * El contenido viaja como un único documento JSON y se aplica con upserts por conjuntos.
 * - Unidades, lecciones, palabras y ejercicios quedan publicados con review_status = 'draft'.
 * - Los ejercicios que ya no estén en el contenido se despublican (no se borran: conservan intentos).
 */
import { writeFileSync } from 'node:fs';

import { A1_UNITS, exerciseId, lessonId, unitId } from '../content/a1';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:sql -- <archivo.sql>');
  process.exit(1);
}

const document = {
  units: A1_UNITS.map((u) => ({
    id: unitId(u),
    position: u.position,
    title_es: u.title,
    title_en: u.titleEn,
    description_es: u.description,
    emoji: u.emoji,
  })),
  words: A1_UNITS.flatMap((u) =>
    u.words.map((w) => ({
      id: w.id,
      unit_id: unitId(u),
      text: w.text,
      translation_es: w.translation,
      accepted_translations: w.acceptedTranslations ?? [],
      ipa: w.ipa,
      emoji: w.emoji ?? null,
      example_en: w.exampleEn,
      example_es: w.exampleEs,
      difficulty: w.difficulty ?? 1,
      tags: w.tags,
    })),
  ),
  lessons: A1_UNITS.flatMap((u) =>
    u.lessons.map((l, li) => ({
      id: lessonId(u, li),
      unit_id: unitId(u),
      position: li + 1,
      title_es: l.title,
      objective_es: l.objective,
    })),
  ),
  exercises: A1_UNITS.flatMap((u) =>
    u.lessons.flatMap((l, li) =>
      l.exercises.map((e, ei) => ({
        id: exerciseId(u, li, ei),
        lesson_id: lessonId(u, li),
        position: ei + 1,
        type: e.type,
        skill: e.skill,
        prompt_es: e.prompt,
        payload: e.payload,
        answer: e.answer,
        accepted_answers: e.acceptedAnswers ?? [],
        explanation_es: e.explanation ?? null,
        difficulty: e.difficulty ?? 1,
        recommended_seconds: e.recommendedSeconds ?? 20,
        words: e.words,
      })),
    ),
  ),
};

const payload = JSON.stringify(document);
if (payload.includes('$content$'))
  throw new Error('El contenido no puede incluir el delimitador $content$');

const sql = `-- =====================================================================
-- Contenido A1 generado por scripts/build-content-sql.ts. NO editar a mano:
-- editar content/a1/*.ts, correr los tests (npm test) y regenerar.
-- ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios
-- =====================================================================

create temporary table content_doc on commit drop as
select $content$${payload}$content$::jsonb as d;

insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
select x.id, 'en', 'A1', x.position, x.title_es, x.title_en, x.description_es, x.emoji, true
from content_doc, jsonb_to_recordset(d -> 'units')
  as x(id text, position smallint, title_es text, title_en text, description_es text, emoji text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es, title_en = excluded.title_en,
  description_es = excluded.description_es, emoji = excluded.emoji, is_published = true;

insert into public.words (id, language_code, unit_id, text, translation_es, accepted_translations, ipa, emoji,
  example_en, example_es, difficulty, tags, is_published)
select x.id, 'en', x.unit_id, x.text, x.translation_es, x.accepted_translations, x.ipa, x.emoji,
  x.example_en, x.example_es, x.difficulty, x.tags, true
from content_doc, jsonb_to_recordset(d -> 'words')
  as x(id text, unit_id text, text text, translation_es text, accepted_translations text[], ipa text, emoji text,
       example_en text, example_es text, difficulty smallint, tags text[])
on conflict (id) do update set unit_id = excluded.unit_id, text = excluded.text, translation_es = excluded.translation_es,
  accepted_translations = excluded.accepted_translations, ipa = excluded.ipa, emoji = excluded.emoji,
  example_en = excluded.example_en, example_es = excluded.example_es, difficulty = excluded.difficulty,
  tags = excluded.tags, is_published = true;

insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published)
select x.id, x.unit_id, x.position, x.title_es, x.objective_es, true
from content_doc, jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es,
  objective_es = excluded.objective_es, is_published = true;

-- Las posiciones son únicas por lección: liberarlas antes de reordenar.
update public.exercises set position = position + 1000
where lesson_id in (select x ->> 'id' from content_doc, jsonb_array_elements(d -> 'lessons') x);

insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, accepted_answers,
  explanation_es, difficulty, recommended_seconds, is_published)
select x.id, x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
  x.explanation_es, x.difficulty, x.recommended_seconds, true
from content_doc, jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)
on conflict (id) do update set lesson_id = excluded.lesson_id, position = excluded.position, type = excluded.type,
  skill = excluded.skill, prompt_es = excluded.prompt_es, payload = excluded.payload, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, explanation_es = excluded.explanation_es,
  difficulty = excluded.difficulty, recommended_seconds = excluded.recommended_seconds, is_published = true;

-- Ejercicios retirados del contenido: se despublican y se corre su posición fuera del rango usado.
update public.exercises set is_published = false
where lesson_id in (select x ->> 'id' from content_doc, jsonb_array_elements(d -> 'lessons') x)
  and id not in (select x ->> 'id' from content_doc, jsonb_array_elements(d -> 'exercises') x);

delete from public.exercise_words
where exercise_id in (select x ->> 'id' from content_doc, jsonb_array_elements(d -> 'exercises') x);

insert into public.exercise_words (exercise_id, word_id)
select x ->> 'id', w
from content_doc, jsonb_array_elements(d -> 'exercises') x, jsonb_array_elements_text(x -> 'words') w;
`;

writeFileSync(out, sql, 'utf8');
console.log(
  `OK ${out}: ${document.units.length} unidades, ${document.lessons.length} lecciones, ` +
    `${document.words.length} palabras, ${document.exercises.length} ejercicios, ${Buffer.byteLength(sql)} bytes`,
);
