import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { AVATAR_BUCKET } from '@/lib/avatarPhoto';
import { requireSupabase } from '@/lib/supabase';

/** Lado de la foto subida: suficiente para el avatar más grande y liviana (< 100 KB). */
const PHOTO_SIZE = 512;

/** Abre la galería con recorte cuadrado. Devuelve la URI local o null si se canceló. */
export async function pickAvatarPhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}

/** Ruta que se guarda en profiles.avatar_path (debe coincidir con su CHECK). */
export const avatarPathFor = (userId: string, version: number) =>
  `${userId}/avatar.jpg?v=${version}`;

/**
 * Achica la foto a 512 px en JPEG y la sube a la carpeta del usuario, sobrescribiendo la anterior.
 * Devuelve el valor para profiles.avatar_path.
 */
export async function uploadAvatarPhoto(userId: string, localUri: string): Promise<string> {
  const context = ImageManipulator.manipulate(localUri);
  context.resize({ width: PHOTO_SIZE, height: null });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
  if (!saved.base64) throw new Error('No se pudo procesar la imagen.');
  const bytes = Uint8Array.from(atob(saved.base64), (c) => c.charCodeAt(0));

  const { error } = await requireSupabase()
    .storage.from(AVATAR_BUCKET)
    .upload(`${userId}/avatar.jpg`, bytes, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return avatarPathFor(userId, Date.now());
}
