/**
 * Genera la sección «funciones reemplazadas» de
 * supabase/migrations/20261117120000_curriculum_isolation.sql (fase C.7, docs/LEARNING_PHASE_C.md §C7).
 *
 * Igual que scripts/build-phase5-sql.ts: cada función se copia TAL CUAL de la última migración que la
 * define y se le aplican parches puntuales; cada parche tiene que encontrar exactamente una vez su texto
 * (si no, el script falla). Lo único que cambia en cada función es el filtro curricular: ni reglas de
 * aprendizaje, ni orden, ni puntuación, ni fórmulas.
 *
 *   npx tsx scripts/build-c7-sql.ts            → escribe la sección entre los marcadores
 *   npx tsx scripts/build-c7-sql.ts --check    → falla si la migración no está al día
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(__dirname, '..', 'supabase', 'migrations');
const C7_MIGRATION = '20261117120000_curriculum_isolation.sql';
const TARGET = join(DIR, C7_MIGRATION);
const BEGIN = '-- >>> generado por scripts/build-c7-sql.ts (no editar a mano)';
const END = '-- <<< fin de lo generado';

/** Fuente de cada función: la última migración que la define (anterior a la C.7). */
const C7_SOURCES = {
  review_item_known: '20261111120000_learning_phase5.sql',
  learning_review_candidates: '20261111120000_learning_phase5.sql',
  rush_questions_3: '20261104004214_ranked_all_languages.sql',
  rush_questions_2: '20261030221420_human_matches.sql',
  join_human_queue: '20261031190000_rush_levels.sql',
  accept_friend_challenge: '20261101041517_friends_social.sql',
  get_learning_mastery: '20261110120000_learning_phase4.sql',
} as const;

function extract(file: string, head: string): string {
  const text = readFileSync(join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const start = text.lastIndexOf(head);
  if (start < 0) throw new Error(`${head} no está en ${file}`);
  const end = text.indexOf('\n$$;', start);
  if (end < 0) throw new Error(`${head}: sin fin en ${file}`);
  return text.slice(start, end + 4);
}

const fn = (name: string) => `create or replace function public.${name}(`;

function patch(src: string, name: string, pairs: [string, string][]): string {
  let out = src;
  for (const [from, to] of pairs) {
    const n = out.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: el parche aparece ${n} veces: ${from.slice(0, 80)}`);
    out = out.replace(from, () => to);
  }
  return out;
}

/** Unidad visible para el usuario del repaso con el nivel de cliente del request (C.5). */
const VISIBLE_FOR_USER = (unit: string) =>
  `public.curriculum_unit_visible_for(p_user, ${unit}, public.request_curriculum_api())`;

const NULL_UNITS = `  -- C.7: sin conjunto de unidades no hay preguntas (nunca «todas»).
  if p_units is null then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
`;

const sections: { why: string; sql: string }[] = [
  {
    why: `review_item_known: además de lo de siempre (el usuario ya vio todos los conceptos target), el ítem
-- tiene que venir de un ejercicio publicado de una unidad de la ruta visible del usuario
-- (review_item_in_route). Es la puerta común de las cinco funciones que arman o validan candidatos de
-- repaso (learning_review_candidates, learning_start_review, learning_focus_candidates,
-- learning_start_focus_review, learning_start_basic_review): ninguna lo saltea.`,
    sql: patch(
      extract(C7_SOURCES.review_item_known, fn('review_item_known')),
      'review_item_known',
      [
        [
          `    else false end\n$$;`,
          `    else false end\n    -- C.7: procedencia curricular (ejercicio → lección → unidad en la ruta visible).
    and public.review_item_in_route(p_user, p_item)\n$$;`,
        ],
      ],
    ),
  },
  {
    why: `learning_review_candidates: la lección de explicación de una unidad (intro_lesson_id, AL17) sólo
-- puede ser una lección de la ruta visible del usuario. El resto, sin cambios.`,
    sql: patch(
      extract(C7_SOURCES.learning_review_candidates, fn('learning_review_candidates')),
      'learning_review_candidates',
      [
        [
          `           join public.curriculum_units cu on cu.id = l.unit_id
           where oc.concept_id = s.concept_id order by`,
          `           join public.curriculum_units cu on cu.id = l.unit_id
           where oc.concept_id = s.concept_id and ${VISIBLE_FOR_USER('cu.id')} order by`,
        ],
        [
          `           where ew.word_id = c.word_id order by`,
          `           where ew.word_id = c.word_id and ${VISIBLE_FOR_USER('cu.id')} order by`,
        ],
      ],
    ),
  },
  {
    why: `rush_questions_in_units (Ranked): copia exacta de rush_questions(texto, cantidad, rating) con un único
-- cambio: palabras y distractores sólo de las unidades de p_units (rush_common_unit_ids: lo común a
-- todos los jugadores de la partida). Mismo mazo, mismas reglas de niveles, escritura y opciones.`,
    sql: patch(extract(C7_SOURCES.rush_questions_3, fn('rush_questions')), 'rush_questions(3)', [
      [
        `create or replace function public.rush_questions(p_language text, p_count integer, p_rating integer)`,
        `create or replace function public.rush_questions_in_units(p_language text, p_count integer, p_rating integer,
                                                           p_units text[])`,
      ],
      [`begin\n  -- Sin palabras suficientes`, `begin\n${NULL_UNITS}  -- Sin palabras suficientes`],
      [
        `where w.language_code = p_language and w.is_published and u.level = any (levels)) < 4 then`,
        `where w.language_code = p_language and w.is_published and u.level = any (levels)
        and w.unit_id = any (p_units)) < 4 then`,
      ],
      [
        `where w.language_code = p_language and w.is_published and u.level = any (levels)
        order by`,
        `where w.language_code = p_language and w.is_published and u.level = any (levels)
          and w.unit_id = any (p_units)
        order by`,
      ],
      [
        `            and u.level = any (levels)\n`,
        `            and u.level = any (levels)\n            and w.unit_id = any (p_units)\n`,
      ],
    ]),
  },
  {
    why: `rush_questions_in_units (amistosos): copia exacta de rush_questions(texto, cantidad), la que usan los
-- desafíos entre amigos (sin niveles), con el mismo único cambio.`,
    sql: patch(
      extract(
        C7_SOURCES.rush_questions_2,
        `create or replace function public.rush_questions(p_language text, p_count integer)`,
      ),
      'rush_questions(2)',
      [
        [
          `create or replace function public.rush_questions(p_language text, p_count integer)`,
          `create or replace function public.rush_questions_in_units(p_language text, p_count integer, p_units text[])`,
        ],
        [`begin\n  while i < p_count loop`, `begin\n${NULL_UNITS}  while i < p_count loop`],
        [
          `where language_code = p_language and is_published\n`,
          `where language_code = p_language and is_published and unit_id = any (p_units)\n`,
        ],
        [
          `where w.language_code = p_language and w.is_published and w.id <> word.id\n`,
          `where w.language_code = p_language and w.is_published and w.id <> word.id
            and w.unit_id = any (p_units)\n`,
        ],
      ],
    ),
  },
  {
    why: `join_human_queue: la cola guarda el nivel curricular del cliente de cada jugador (cabecera del
-- request, C.5) y las preguntas salen de lo común a los dos. Emparejamiento, ventana, ELO y partida:
-- sin cambios.`,
    sql: patch(extract(C7_SOURCES.join_human_queue, fn('join_human_queue')), 'join_human_queue', [
      [
        `  insert into public.ranked_queue as rq (user_id, language_code, rating)
  values (uid, prof.target_language, r.rating)`,
        `  insert into public.ranked_queue as rq (user_id, language_code, rating, curriculum_api)
  values (uid, prof.target_language, r.rating, public.request_curriculum_api())`,
      ],
      [
        `    active = true\n  returning * into q;`,
        `    active = true,\n    curriculum_api = excluded.curriculum_api\n  returning * into q;`,
      ],
      [
        `         public.rush_questions(q.language_code, 40, least(q.rating, opp.rating))`,
        `         public.rush_questions_in_units(q.language_code, 40, least(q.rating, opp.rating),
           public.rush_common_unit_ids(q.language_code, array[uid, opp.user_id],
                                       array[q.curriculum_api, opp.curriculum_api]))`,
      ],
    ]),
  },
  {
    why: `accept_friend_challenge: preguntas de lo común al anfitrión (nivel guardado al crear el desafío,
-- friend_challenges.host_curriculum_api) y al invitado (cabecera de este request). Resto sin cambios.`,
    sql: patch(
      extract(C7_SOURCES.accept_friend_challenge, fn('accept_friend_challenge')),
      'accept_friend_challenge',
      [
        [
          `         public.rush_questions(c.language_code, 40)`,
          `         public.rush_questions_in_units(c.language_code, 40,
           public.rush_common_unit_ids(c.language_code, array[c.host_id, uid],
                                       array[c.host_curriculum_api, public.request_curriculum_api()]))`,
        ],
      ],
    ),
  },
  {
    why: `get_learning_mastery: la lista de unidades sólo trae unidades publicadas de la ruta visible del
-- cliente que pregunta (curriculum_unit_visible, C.6), y la de débiles omite palabras de unidades que ese
-- cliente no ve. Dimensiones, retención, velocidad, estados y fórmulas: sin cambios.`,
    sql: patch(
      extract(C7_SOURCES.get_learning_mastery, fn('get_learning_mastery')),
      'get_learning_mastery',
      [
        [
          `          where uc.unit_id = cu.id) x on x.total > 0
        where cu.language_code = p_language), '[]'::jsonb),`,
          `          where uc.unit_id = cu.id) x on x.total > 0
        where cu.language_code = p_language
          and cu.is_published and public.curriculum_unit_visible(cu.id)), '[]'::jsonb),`,
        ],
        [
          `(select * from st where state = 'weak' order by mastery, last_exposed_at, concept_id limit 10) s`,
          `(select * from st where state = 'weak'
              and not exists (select 1 from public.concepts xc join public.words xw on xw.id = xc.word_id
                              where xc.id = st.concept_id and not public.curriculum_unit_visible(xw.unit_id))
              order by mastery, last_exposed_at, concept_id limit 10) s`,
        ],
      ],
    ),
  },
];

function c7GeneratedSql(): string {
  return [BEGIN, ...sections.map((s) => `\n-- ${s.why}\n${s.sql}\n`), END].join('\n');
}

function main() {
  const current = readFileSync(TARGET, 'utf8').replace(/\r\n/g, '\n');
  const a = current.indexOf(BEGIN);
  const b = current.indexOf(END);
  if (a < 0 || b < a) throw new Error(`${C7_MIGRATION}: faltan los marcadores`);
  const next = current.slice(0, a) + c7GeneratedSql() + current.slice(b + END.length);
  if (process.argv.includes('--check')) {
    if (next !== current) {
      console.error(`${C7_MIGRATION} no está al día: npx tsx scripts/build-c7-sql.ts`);
      process.exit(1);
    }
    console.log(`${C7_MIGRATION}: al día`);
    return;
  }
  writeFileSync(TARGET, next);
  console.log(`${C7_MIGRATION}: escrita`);
}

main();
