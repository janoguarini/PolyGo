-- Avatares: tres zorros predeterminados y foto propia subida a Storage.

-- ---------- zorros ----------
-- Se reutilizan ids que el CHECK original ya aceptaba (reemplazarlo exigiría DROP CONSTRAINT):
--   'bolt' = zorro violeta (predeterminado), 'crown' = zorro amarillo, 'flame' = zorro rojo.
-- Ver AVATARS en shared/profile.ts. Este CHECK adicional los acota a los tres.
update public.profiles set avatar_id = 'bolt' where avatar_id not in ('bolt', 'crown', 'flame');
alter table public.profiles add constraint profiles_avatar_fox_check
  check (avatar_id in ('bolt', 'crown', 'flame'));

-- ---------- foto propia ----------
-- Objeto del bucket 'avatars' en la carpeta del propio usuario, con versión para evitar cachés:
-- '<uuid>/avatar.jpg?v=<milisegundos>'. Cada usuario tiene un único archivo que se sobrescribe.
alter table public.profiles add column avatar_path text constraint profiles_avatar_path_check
  check (avatar_path is null or avatar_path ~ ('^' || id::text || '/avatar\.jpg\?v=[0-9]{1,15}$'));

grant update (avatar_path) on public.profiles to authenticated;

-- Bucket público (las fotos de perfil se ven en clasificaciones y perfiles) con escritura sólo en
-- la carpeta propia. En la base de tests (PGlite) no existe el esquema storage: se omite.
do $storage$
begin
  if to_regclass('storage.buckets') is null then
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('avatars', 'avatars', true, 1048576, array['image/jpeg'])
  on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and policyname = 'avatars: subir a la carpeta propia') then
    execute $p$create policy "avatars: subir a la carpeta propia" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)$p$;
  end if;
  -- Sobrescribir (upsert) requiere además leer y actualizar el objeto propio.
  if not exists (select 1 from pg_policies where schemaname = 'storage' and policyname = 'avatars: leer la carpeta propia') then
    execute $p$create policy "avatars: leer la carpeta propia" on storage.objects
      for select to authenticated
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)$p$;
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and policyname = 'avatars: actualizar la carpeta propia') then
    execute $p$create policy "avatars: actualizar la carpeta propia" on storage.objects
      for update to authenticated
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)$p$;
  end if;
end
$storage$;
