// Carga una Edge Function (su index.ts real, sin copiarla) dentro de Node, para pruebas (fase C.8).
//
// Emula sólo las dos APIs de Deno que usan nuestras funciones: `Deno.env.get` y `Deno.serve(handler)`
// (se guarda el handler y la prueba lo llama con un Request estándar). Los `npm:` se resuelven con
// ./npmSpecifiers.mjs. Requiere `node --import tsx` (index.ts es TypeScript).
//
// No sustituye a Deno ni al Edge Runtime de Supabase (ver supabase/tests/deno/): diferencias posibles
// en el supabase-js resuelto, en fetch/Request/Response y en la compresión de respuestas.
import module from 'node:module';
import { pathToFileURL } from 'node:url';

import { resolve as npmResolve } from './npmSpecifiers.mjs';

// tsx carga index.ts como CommonJS (el package.json raíz no es "type": "module"), así que hace falta un
// gancho que valga para require e import: module.registerHooks (Node ≥ 22.15, sincrónico).
if (typeof module.registerHooks !== 'function') {
  throw new Error('Hace falta Node ≥ 22.15 (module.registerHooks) para cargar la Edge Function');
}
module.registerHooks({ resolve: npmResolve });

/**
 * Importa la función y devuelve su handler. `env` hace de variables de entorno de Deno (el objeto se
 * lee en cada request: la prueba puede cambiarlo). Una sola función por proceso.
 */
export async function loadEdgeFunction(path, env) {
  if (globalThis.Deno) throw new Error('globalThis.Deno ya existe: ¿hay otra función cargada?');
  let handler = null;
  globalThis.Deno = {
    env: { get: (key) => (Object.hasOwn(env, key) ? env[key] : undefined) },
    serve: (h) => {
      handler = typeof h === 'function' ? h : h?.handler;
      return { finished: Promise.resolve(), shutdown: async () => {} };
    },
  };
  await import(pathToFileURL(path).href);
  if (typeof handler !== 'function') throw new Error(`${path} no llamó a Deno.serve`);
  return handler;
}
