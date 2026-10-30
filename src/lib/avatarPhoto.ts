import { env } from './env';

/** Bucket público de Storage con las fotos de perfil (una por usuario, en su carpeta). */
export const AVATAR_BUCKET = 'avatars';

/**
 * URL pública de una foto de perfil a partir de profiles.avatar_path
 * ('<uuid>/avatar.jpg?v=<ms>': la versión evita que se vea una foto vieja en caché).
 */
export function avatarPhotoUrl(path: string | null | undefined): string | null {
  if (!path || !env) return null;
  const base = env.supabaseUrl.replace(/\/+$/, '');
  return `${base}/storage/v1/object/public/${AVATAR_BUCKET}/${path}`;
}
