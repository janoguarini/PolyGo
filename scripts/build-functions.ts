/**
 * Empaqueta el código compartido que usan las Edge Functions (Deno no resuelve los imports sin
 * extensión de shared/). Salida determinista y versionada en el repositorio; la prueba
 * supabase/tests/attempts.test.mjs falla si quedó desactualizada.
 *
 *   npm run functions:build          escribe los paquetes
 *   npm run functions:build -- --check  sólo compara
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildSync } from 'esbuild';

const ROOT = join(__dirname, '..');

export const FUNCTION_BUNDLES = [
  {
    entry: 'shared/learningSession.ts',
    out: 'supabase/functions/learning-session/core.generated.js',
  },
  {
    entry: 'shared/adaptivePlanner.ts',
    out: 'supabase/functions/learning-session/planner.generated.js',
  },
  {
    entry: 'shared/focusReview.ts',
    out: 'supabase/functions/learning-session/focus.generated.js',
  },
  {
    entry: 'shared/storeEntitlements.ts',
    out: 'supabase/functions/plus-store/store.generated.js',
  },
] as const;

const BANNER =
  '// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.\n';

export function bundle(entry: string): string {
  const result = buildSync({
    entryPoints: [join(ROOT, entry)],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    write: false,
    legalComments: 'none',
    charset: 'utf8',
  });
  return BANNER + result.outputFiles[0]!.text;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  let stale = 0;
  for (const { entry, out } of FUNCTION_BUNDLES) {
    const text = bundle(entry);
    const path = join(ROOT, out);
    let current = '';
    try {
      current = readFileSync(path, 'utf8');
    } catch {
      // no existe todavía
    }
    if (current === text) continue;
    if (check) {
      console.error(`${out} está desactualizado (npm run functions:build)`);
      stale++;
    } else {
      writeFileSync(path, text);
      console.log(`escrito ${out}`);
    }
  }
  if (stale) process.exit(1);
}
