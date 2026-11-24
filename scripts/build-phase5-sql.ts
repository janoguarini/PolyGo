/**
 * Genera la sección «funciones reemplazadas» de
 * supabase/migrations/20261111120000_learning_phase5.sql (fase 5, docs/LEARNING_PHASE5.md).
 *
 * Cada función se copia TAL CUAL de la última migración que la define y se le aplican parches
 * puntuales; cada parche tiene que encontrar exactamente una vez su texto (si no, el script falla).
 * Así la migración no transcribe a mano funciones largas y el cambio queda auditable aquí.
 *
 *   npx tsx scripts/build-phase5-sql.ts            → escribe la sección entre los marcadores
 *   npx tsx scripts/build-phase5-sql.ts --check    → falla si la migración no está al día
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(__dirname, '..', 'supabase', 'migrations');
const TARGET = join(DIR, '20261111120000_learning_phase5.sql');
const BEGIN = '-- >>> generado por scripts/build-phase5-sql.ts (no editar a mano)';
const END = '-- <<< fin de lo generado';

function extract(file: string, name: string): string {
  const text = readFileSync(join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const head = `create or replace function public.${name}(`;
  const start = text.lastIndexOf(head);
  if (start < 0) throw new Error(`${name} no está en ${file}`);
  const end = text.indexOf('\n$$;', start);
  if (end < 0) throw new Error(`${name}: sin fin en ${file}`);
  return text.slice(start, end + 4);
}

function patch(src: string, name: string, pairs: [string, string][]): string {
  let out = src;
  for (const [from, to] of pairs) {
    const n = out.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: el parche aparece ${n} veces: ${from.slice(0, 80)}`);
    out = out.replace(from, () => to);
  }
  return out;
}

// Ítem presentable para este usuario: todos sus conceptos target ya los vio (no se acredita ni se
// introduce un concepto nuevo desde un repaso) y no comparte conceptos con otra entrada del plan.
const KNOWN_SRS = `public.review_item_known(p_user, r.item_id, 'srs')`;
const KNOWN_V1 = `public.review_item_known(p_user, r.item_id, 'v1')`;
const CONCEPTS_OF = (item: string) =>
  `(select coalesce(jsonb_agg(distinct x.concept_id), '[]'::jsonb) from public.item_concepts x where x.item_id = ${item} and x.role = 'target')`;
// Un concepto target en una sola entrada del plan (también los secundarios de un ítem de varios).
const NO_SHARED_CONCEPTS = `
     or (select count(*) from (select distinct x ->> 'item_id' as item_id, ic.concept_id
                               from jsonb_array_elements(p_plan -> 'items') x
                               join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') t)
        <> (select count(distinct ic.concept_id) from jsonb_array_elements(p_plan -> 'items') x
            join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target')`;

const sections: { why: string; sql: string }[] = [
  {
    why: `review_item_candidates: ítems con VARIOS conceptos target (antes: uno solo). Todos sus conceptos
-- target tienen que estar activos; devuelve una fila por cada concepto léxico con palabra publicada
-- (así un ítem de varios conceptos es candidato de cada uno). pair_set sigue afuera: su payload ya
-- trae las parejas resueltas (la respuesta) y no hay formato de presentación que las oculte.`,
    sql: patch(
      extract('20261110120000_learning_phase4.sql', 'review_item_candidates'),
      'review_item_candidates',
      [
        [
          `    -- Un único CONCEPTO target (los ítems de producción lo marcan en vocabulario y en producción).
    and (select count(distinct x.concept_id) from public.item_concepts x where x.item_id = i.id and x.role = 'target') = 1`,
          `    -- Fase 5: uno o varios conceptos target, todos activos (record_learning_session los registra).
    and not exists (select 1 from public.item_concepts x
                    left join public.concepts xc on xc.id = x.concept_id and xc.status = 'active'
                    where x.item_id = i.id and x.role = 'target' and xc.id is null)`,
        ],
      ],
    ),
  },
  {
    why: `learning_review_candidates: cada ítem de una unidad lleva sus conceptos y sólo entra si el
-- usuario ya tiene estado en el SRS v2 para todos ellos (review_item_known 'srs').`,
    sql: patch(
      extract('20261110140000_learning_phase4_close.sql', 'learning_review_candidates'),
      'learning_review_candidates',
      [
        [
          `'input_modality', r.input_modality, 'option_count', r.option_count,`,
          `'input_modality', r.input_modality, 'option_count', r.option_count,
                                                               'concepts', ${CONCEPTS_OF('r.item_id')},`,
        ],
        [
          `where r.concept_id = s.concept_id and r.dimension = s.dimension), '[]'::jsonb))`,
          `where r.concept_id = s.concept_id and r.dimension = s.dimension
                             and ${KNOWN_SRS}), '[]'::jsonb))`,
        ],
      ],
    ),
  },
  {
    why: `learning_start_review: la misma validación + ítem conocido + sin conceptos compartidos entre entradas.`,
    sql: patch(
      extract('20261110140000_learning_phase4_close.sql', 'learning_start_review'),
      'learning_start_review',
      [
        [
          `  from public.review_item_candidates(p_lang) r
  where r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x);`,
          `  from public.review_item_candidates(p_lang) r
  where r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and ${KNOWN_SRS};`,
        ],
        [
          `     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n then`,
          `     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n${NO_SHARED_CONCEPTS} then`,
        ],
      ],
    ),
  },
  {
    why: `learning_focus_candidates (Plus): igual, con «conocido» = palabras ya estudiadas en el v1.`,
    sql: patch(
      extract('20261110140000_learning_phase4_close.sql', 'learning_focus_candidates'),
      'learning_focus_candidates',
      [
        [
          `'item_id', r.item_id, 'dimension', r.dimension, 'rung', r.rung, 'option_count', r.option_count,`,
          `'item_id', r.item_id, 'dimension', r.dimension, 'rung', r.rung, 'option_count', r.option_count,
                        'concepts', ${CONCEPTS_OF('r.item_id')},`,
        ],
        [
          `from cand r where r.concept_id = c.id), '[]'::jsonb))`,
          `from cand r where r.concept_id = c.id and ${KNOWN_V1}), '[]'::jsonb))`,
        ],
      ],
    ),
  },
  {
    why: `learning_start_focus_review (Plus): misma validación + ítem conocido + sin conceptos compartidos.`,
    sql: patch(
      extract('20261110140000_learning_phase4_close.sql', 'learning_start_focus_review'),
      'learning_start_focus_review',
      [
        [
          `  where r.dimension = 'vocabulary'
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x);`,
          `  where r.dimension = 'vocabulary'
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and ${KNOWN_V1};`,
        ],
        [
          `     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n then`,
          `     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n${NO_SHARED_CONCEPTS} then`,
        ],
      ],
    ),
  },
  {
    why: `learning_review_content: agrega 'words' (todas las palabras de los conceptos léxicos target del
-- ítem, la del plan primero) para que la app muestre lecturas y audio de cada una.`,
    sql: patch(
      extract('20261110140000_learning_phase4_close.sql', 'learning_review_content'),
      'learning_review_content',
      [
        [
          `           'word', to_jsonb(w),`,
          `           'word', to_jsonb(w),
           'words', (select jsonb_agg(to_jsonb(ww) order by (ww.id <> w.id), ww.id)
                     from public.words ww
                     where ww.id in (select xc.word_id from public.item_concepts x
                                     join public.concepts xc on xc.id = x.concept_id and xc.kind = 'lexical'
                                     where x.item_id = p.item_id and x.role = 'target')),`,
        ],
      ],
    ),
  },
  {
    why: `srs_v2_migrate_user_locked (15.3): la verificación del v1 también atribuye los intentos de
-- record_learning_session (sin ejercicio ni palabra: por su corrección → item_concepts → palabra), y
-- esos intentos ya no cuentan como categoría C. Sin esto, un usuario que repasó ítems de varios
-- conceptos antes del corte quedaría «sin reconstruir».`,
    sql: patch(
      extract('20261109120000_srs_v2.sql', 'srs_v2_migrate_user_locked'),
      'srs_v2_migrate_user_locked',
      [
        [
          `count(*) filter (where (a.exercise_id is null and a.word_id is null)`,
          `count(*) filter (where (a.exercise_id is null and a.word_id is null
                               and not exists (select 1 from public.exercise_attempt_gradings g where g.attempt_id = a.id))`,
        ],
        [
          `                and e.updated_at <= a.created_at and p.created_at <= ls.completed_at)))`,
          `                and e.updated_at <= a.created_at and p.created_at <= ls.completed_at))
        or (a.word_id is null and a.exercise_id is null and exists (
              select 1 from public.exercise_attempt_gradings g
              join public.item_concepts ic on ic.item_id = g.item_id and ic.role = 'target'
              join public.concepts c on c.id = ic.concept_id and c.kind = 'lexical'
              where g.attempt_id = a.id and c.word_id = p.word_id)))`,
        ],
      ],
    ),
  },
];

// Cierre de la fase 5: repaso básico autoritativo con el SRS v1 (v2 apagado). Se deriva de la función
// de Plus ya parcheada: mismo registro de plan y presentaciones, sin exigir Plus, origen basic_review y
// la regla del repaso básico de siempre (palabras VENCIDAS del v1, hasta 10, motivo 'due').
const focusSql = sections.find((s) =>
  s.sql.includes('function public.learning_start_focus_review('),
)!.sql;
sections.push({
  why: `learning_start_basic_review (cierre de la fase 5): repaso básico armado por el servidor con las
-- reglas del SRS v1 cuando el v2 está apagado. Igual que learning_start_focus_review salvo: no exige Plus
-- (el básico es de todos), origen basic_review, foco {kind: 'basic'}, hasta 10 entradas, cada palabra
-- estudiada y VENCIDA en el v1 ahora, motivo 'due'.`,
  sql: patch(focusSql, 'learning_start_basic_review', [
    [
      'create or replace function public.learning_start_focus_review(',
      'create or replace function public.learning_start_basic_review(',
    ],
    [
      `  if v_kind is null or v_kind not in ('smart', 'topic') or (v_kind = 'topic' and v_unit is null) then`,
      `  if v_kind is distinct from 'basic' then`,
    ],
    [`    if v_source <> 'focus_review' then`, `    if v_source <> 'basic_review' then`],
    [
      `  -- El beneficio lo decide el servidor, nunca la app (mismas reglas comerciales de siempre).
  if not public.has_plus(p_user) then
    raise exception 'plus_required' using errcode = '42501';
  end if;
`,
      `  -- El repaso básico es de todos: sin comprobación de Plus.
`,
    ],
    [`  if v_n > 15 then`, `  if v_n > 10 then`],
    [
      `join public.user_word_progress p on p.word_id = c.word_id and p.user_id = p_user and p.seen_count > 0`,
      `join public.user_word_progress p on p.word_id = c.word_id and p.user_id = p_user and p.seen_count > 0
                                                and p.next_review_at <= now()`,
    ],
    [`(v_kind = 'smart' or w.unit_id = v_unit))`, `true)`],
    [
      `     or (v_kind = 'smart' and coalesce(x ->> 'reason', '') not in ('due', 'frequent_mistakes', 'difficult', 'due_soon'))
     or (v_kind = 'topic' and x ->> 'reason' is distinct from 'topic');`,
      `     or x ->> 'reason' is distinct from 'due';`,
    ],
    [
      `p_lang, 'focus_review', coalesce(p_plan ->> 'planner_version', 'focus-1.0.0'),`,
      `p_lang, 'basic_review', coalesce(p_plan ->> 'planner_version', 'basic-1.0.0'),`,
    ],
    [
      `    case when v_kind = 'topic' then jsonb_build_object('kind', 'topic', 'unit_id', v_unit)
         else jsonb_build_object('kind', 'smart') end);`,
      `    jsonb_build_object('kind', 'basic'));`,
    ],
  ]),
});

const generated = [BEGIN, ...sections.map((s) => `\n-- ${s.why}\n${s.sql}\n`), END].join('\n');

const current = readFileSync(TARGET, 'utf8').replace(/\r\n/g, '\n');
const a = current.indexOf(BEGIN);
const b = current.indexOf(END);
if (a < 0 || b < a) throw new Error('marcadores no encontrados en la migración');
const next = current.slice(0, a) + generated + current.slice(b + END.length);

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error(
      '20261111120000_learning_phase5.sql no está al día: npx tsx scripts/build-phase5-sql.ts',
    );
    process.exit(1);
  }
  console.log('learning_phase5.sql al día');
} else {
  writeFileSync(TARGET, next);
  console.log('escrito', TARGET);
}
