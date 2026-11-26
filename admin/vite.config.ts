import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Panel Superadmin: SÓLO local. El servidor escucha en 127.0.0.1 (no en la red) y no hay deploy.
// Lee del .env de la raíz únicamente la URL y la anon key de Supabase (ya son públicas: son las
// mismas que lleva la app). Ningún secreto llega al navegador.
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  plugins: [react()],
  envDir: repoRoot,
  envPrefix: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    fs: { strict: true },
  },
  preview: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
  },
  build: {
    sourcemap: false,
  },
});
