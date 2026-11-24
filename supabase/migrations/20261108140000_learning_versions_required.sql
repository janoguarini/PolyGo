-- V8 + V8.1: referencias obligatorias del catálogo (arquitectura de datos rev. 8, §5; decisiones V8
-- y V8.1 aprobadas el 2026-11-08, docs/EXERCISE_ITEM_VERSIONS_PENDING.md §6). Última pieza de
-- versiones de la fase 1. Va después de 20261108130104_learning_option_sets_zh.sql.
--
-- Qué hace:
--   1. Verifica que no queda ninguna fila incompleta: ítem sin versión vigente (o con una vigente que
--      no es suya), ubicación sin ítem o sin versión, o ubicación de elección (image_choice,
--      translation_choice, fill_blank, listen_choice) sin conjunto de opciones. Si queda alguna,
--      aborta y nombra hasta 10.
--   2. exercises.item_id y exercises.item_version_id: CHECK … NOT VALID, VALIDATE CONSTRAINT y
--      ALTER COLUMN … SET NOT NULL (que se apoya en el CHECK validado), en todas las filas (también
--      las despublicadas).
--   3. CHECK validado de que toda ubicación de elección tiene conjunto (exercises.option_set_id): no es
--      una columna NOT NULL porque el resto de los tipos no lleva conjunto.
--   4. exercise_items.current_version_id (V8.1): SIN NOT NULL, porque sería circular (el ítem tiene
--      que existir antes que su versión por la FK item_id, y la versión antes que el puntero). En su
--      lugar, un constraint trigger DEFERRABLE INITIALLY DEFERRED en INSERT y UPDATE que, al confirmar
--      la transacción, relee la fila y rechaza un ítem sin current_version_id o con uno que no es una
--      versión de ese mismo ítem. Así un ítem nuevo se inserta sin versión, recibe su primera versión
--      y su puntero en la misma transacción, y ninguna transacción confirma un ítem sin vigente. La FK
--      compuesta diferible exercise_items_current_version_fkey (20261107150000) sigue igual: el
--      trigger la repite como comprobación propia, no la reemplaza. Sólo lee: no toca las versiones,
--      que siguen inmutables.
--
-- El trigger relee la fila (no usa NEW): un INSERT sin puntero seguido de un UPDATE que lo pone deja
-- dos eventos, y el del INSERT tiene que ver el estado final. Es security definer para que RLS no
-- oculte la fila a quien la escribe (sin la fila no habría nada que comprobar y pasaría en silencio).
-- Con `set constraints … immediate` se comprueba al final de cada sentencia (más estricto). Como todo
-- trigger, no corre con session_replication_role = replica ni si un dueño lo desactiva.
--
-- Los CHECK y el trigger quedan: quitarlos sería una sentencia destructiva. Idempotente. No borra ni
-- modifica filas; sólo agrega restricciones. No toca el SRS v1 ni Ranked.
--
-- Compatibilidad: content:sql y content:diff insertan cada ejercicio nuevo ya con su ítem, su versión y
-- su conjunto (scripts/catalog-sql.ts, EXERCISE_CATALOG_*), y los ítems nuevos con su versión y su
-- puntero en la misma transacción (supabase/tests/items.test.mjs lo prueba con una unidad nueva).
--
-- ESTADO: probada en PGlite (supabase/tests/versions.test.mjs, items.test.mjs). NO aplicada en
-- producción.

-- Las FK y triggers diferidos se comprueban ya: ALTER TABLE no admite eventos pendientes.
set constraints all immediate;

do $$
declare
  v_bad text;
begin
  select string_agg(what, ', ') into v_bad from (
    select what from (
      select 'ítem ' || i.id || case when i.current_version_id is null then ' sin versión vigente'
                                     else ' con una versión vigente ajena' end what
      from public.exercise_items i
      where i.current_version_id is null
         or not exists (select 1 from public.exercise_item_versions v
                        where v.id = i.current_version_id and v.item_id = i.id)
      union all
      select 'ubicación ' || e.id || case when e.item_id is null then ' sin ítem' else ' sin versión' end
      from public.exercises e where e.item_id is null or e.item_version_id is null
      union all
      select 'ubicación ' || e.id || ' sin conjunto de opciones'
      from public.exercises e
      where e.type in ('image_choice', 'translation_choice', 'fill_blank', 'listen_choice')
        and e.option_set_id is null
    ) z order by what limit 10
  ) y;
  if v_bad is not null then
    raise exception 'versions_required: el backfill de versiones no está completo: %', v_bad;
  end if;
end;
$$;

-- 2 y 3. Ubicaciones.

do $$
declare
  c record;
begin
  for c in select * from (values
    ('exercises', 'item_id', 'exercises_item_id_not_null'),
    ('exercises', 'item_version_id', 'exercises_item_version_id_not_null')
  ) as t(tbl, col, con)
  loop
    if not exists (select 1 from pg_constraint
                   where conrelid = ('public.' || c.tbl)::regclass and conname = c.con) then
      execute format('alter table public.%I add constraint %I check (%I is not null) not valid',
                     c.tbl, c.con, c.col);
    end if;
    execute format('alter table public.%I validate constraint %I', c.tbl, c.con);
    execute format('alter table public.%I alter column %I set not null', c.tbl, c.col);
  end loop;

  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.exercises'::regclass and conname = 'exercises_choice_option_set_check') then
    alter table public.exercises
      add constraint exercises_choice_option_set_check
      check (type not in ('image_choice', 'translation_choice', 'fill_blank', 'listen_choice')
             or option_set_id is not null) not valid;
  end if;
  alter table public.exercises validate constraint exercises_choice_option_set_check;
end;
$$;

-- 4. Versión vigente obligatoria al confirmar (V8.1).

create or replace function public.exercise_items_check_current_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current bigint;
begin
  select i.current_version_id into v_current from public.exercise_items i where i.id = new.id;
  if not found then
    return null; -- la fila ya no existe con ese id (borrada, o cambió de id: su propio evento la mira)
  end if;
  if v_current is null then
    raise exception 'exercise_items: el ítem % no tiene versión vigente (current_version_id) al confirmar', new.id
      using errcode = 'not_null_violation';
  end if;
  if not exists (select 1 from public.exercise_item_versions v
                 where v.id = v_current and v.item_id = new.id) then
    raise exception 'exercise_items: la versión vigente % no es una versión del ítem %', v_current, new.id
      using errcode = 'foreign_key_violation';
  end if;
  return null;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.exercise_items'::regclass
      and tgname = 'exercise_items_require_current_version'
  ) then
    create constraint trigger exercise_items_require_current_version
      after insert or update on public.exercise_items
      deferrable initially deferred
      for each row execute function public.exercise_items_check_current_version();
  end if;
end;
$$;

revoke execute on function public.exercise_items_check_current_version()
  from public, anon, authenticated;
