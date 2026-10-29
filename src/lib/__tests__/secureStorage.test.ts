import { createChunkedStorage } from '../secureStorage';

function memoryStore() {
  const map = new Map<string, string>();
  return {
    map,
    getItemAsync: async (k: string) => map.get(k) ?? null,
    setItemAsync: async (k: string, v: string) => void map.set(k, v),
    deleteItemAsync: async (k: string) => void map.delete(k),
  };
}

describe('createChunkedStorage', () => {
  it('guarda y recupera valores más grandes que un fragmento', async () => {
    const store = memoryStore();
    const storage = createChunkedStorage(store);
    const big = 'x'.repeat(5000) + 'ñ✓';
    await storage.setItem('session', big);
    expect(await storage.getItem('session')).toBe(big);
    // 3 fragmentos + contador; ninguno supera el límite recomendado de SecureStore.
    expect(store.map.size).toBe(4);
    for (const value of store.map.values()) expect(value.length).toBeLessThanOrEqual(2048);
  });

  it('devuelve null si no existe', async () => {
    expect(await createChunkedStorage(memoryStore()).getItem('nope')).toBeNull();
  });

  it('al sobrescribir con un valor más corto no deja fragmentos huérfanos', async () => {
    const store = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem('k', 'a'.repeat(4000));
    await storage.setItem('k', 'short');
    expect(await storage.getItem('k')).toBe('short');
    expect(store.map.size).toBe(2);
  });

  it('removeItem borra todo', async () => {
    const store = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem('k', 'a'.repeat(4000));
    await storage.removeItem('k');
    expect(store.map.size).toBe(0);
  });

  it('trata una sesión con fragmentos faltantes como inexistente', async () => {
    const store = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem('k', 'a'.repeat(4000));
    store.map.delete('k__1');
    expect(await storage.getItem('k')).toBeNull();
  });
});
