// Gancho de resolución de módulos de Node para cargar una Edge Function SIN Deno (fase C.8).
//
// Las funciones importan con especificadores de Deno (`npm:@supabase/supabase-js@2`). Node no los
// entiende: aquí se traducen al paquete instalado en node_modules (sin la versión). Nada más cambia.
// Lo registra supabase/tests/edge/runEdgeFunction.mjs con module.registerHooks (sincrónico).
//
// IMPORTANTE: esto NO es el Edge Runtime. Resuelve el supabase-js del proyecto (no el del registro que
// usaría Deno) y corre sobre Node. La prueba real en Deno es supabase/tests/deno/learning-session.e2e.mjs.
export function resolve(specifier, context, nextResolve) {
  const m = /^npm:((?:@[^/@]+\/)?[^/@]+)(?:@[^/]*)?(\/.*)?$/.exec(specifier);
  if (m) return nextResolve(m[1] + (m[2] ?? ''), context);
  return nextResolve(specifier, context);
}
