import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Almacenamiento de sesión para Supabase Auth.
 * SecureStore (Keychain / Keystore) recomienda valores < 2048 bytes y una sesión de Supabase
 * puede superarlo, así que el valor se guarda en fragmentos.
 * En web no existe SecureStore: se usa localStorage (sólo para desarrollo).
 */

const CHUNK_SIZE = 1800;
const countKey = (key: string) => `${key}__chunks`;
const chunkKey = (key: string, i: number) => `${key}__${i}`;

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export function createChunkedStorage(store: {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}): KeyValueStorage {
  const removeChunks = async (key: string) => {
    const count = Number((await store.getItemAsync(countKey(key))) ?? 0);
    await Promise.all(
      Array.from({ length: count }, (_, i) => store.deleteItemAsync(chunkKey(key, i))),
    );
    await store.deleteItemAsync(countKey(key));
  };

  return {
    async getItem(key) {
      const countRaw = await store.getItemAsync(countKey(key));
      if (countRaw === null) return null;
      const count = Number(countRaw);
      const parts = await Promise.all(
        Array.from({ length: count }, (_, i) => store.getItemAsync(chunkKey(key, i))),
      );
      // Si falta un fragmento la sesión está corrupta: mejor tratarla como inexistente.
      if (parts.some((p) => p === null)) return null;
      return parts.join('');
    },
    async setItem(key, value) {
      await removeChunks(key);
      const chunks = value.match(new RegExp(`[\\s\\S]{1,${CHUNK_SIZE}}`, 'g')) ?? [''];
      await Promise.all(chunks.map((chunk, i) => store.setItemAsync(chunkKey(key, i), chunk)));
      await store.setItemAsync(countKey(key), String(chunks.length));
    },
    async removeItem(key) {
      await removeChunks(key);
    },
  };
}

const webStorage: KeyValueStorage = {
  async getItem(key) {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  },
  async setItem(key, value) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
};

export const sessionStorage: KeyValueStorage =
  Platform.OS === 'web' ? webStorage : createChunkedStorage(SecureStore);
