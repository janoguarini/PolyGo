-- Voces neurales pregeneradas (shared/tts.ts, scripts/build-tts.ts).
--
-- Bucket público `tts` de Supabase Storage: un MP3 por texto del contenido y un manifest.json por
-- idioma. Público = se lee por URL sin sesión (la app lo baja y lo guarda en caché); no se puede
-- listar ni escribir desde la app: sólo sube el script, con la service_role key (que se salta RLS).
-- Límite de 1 MB por archivo (una frase en MP3 pesa ~10–40 KB) y sólo MP3 o JSON.
--
-- Sólo agrega el bucket; no toca tablas ni políticas.
--
-- Rollback (borra también los audios):
--   delete from storage.objects where bucket_id = 'tts';
--   delete from storage.buckets where id = 'tts';

-- En la base de tests (PGlite) no existe el esquema storage: se omite (como 20261030173136_avatars.sql).
do $storage$
begin
  if to_regclass('storage.buckets') is null then
    return;
  end if;
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('tts', 'tts', true, 1048576, array['audio/mpeg', 'application/json'])
  on conflict (id) do nothing;
end
$storage$;
