/**
 * Comprueba las variables EXPO_PUBLIC_* antes de una build (fase C.5). Nunca imprime valores.
 *
 *   npm run env:check                         # entorno actual + .env (desarrollo)
 *   npm run env:check -- --production         # reglas de producción (todas obligatorias, https)
 *   npm run env:check -- --file otra.env      # otro archivo
 *   npm run env:check -- --profile preview    # lo que aporta ese perfil de eas.json (con extends)
 *
 * Con --profile: las reglas son de producción salvo en perfiles de desarrollo (developmentClient), y
 * el .env local NO se usa, porque EAS Build no lo recibe (está en .gitignore). Las variables que no
 * están en eas.json (Supabase) tienen que venir del entorno de EAS, que este script no lee: para
 * revisarlas, exportarlas al proceso (por ejemplo con `eas env:pull` a un archivo y --file).
 *
 * Prioridad: entorno del proceso > eas.json (--profile) > archivo. Sale con código 1 si hay problemas.
 */
import { existsSync, readFileSync } from 'node:fs';

import { PUBLIC_ENV, checkPublicEnv } from '../shared/publicEnv';

const args = process.argv.slice(2);
const argValue = (flag: string): string | undefined => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const profile = argValue('--profile');
const fileArg = argValue('--file');
// Con --profile sólo se lee un archivo si se pide explícitamente (EAS no recibe el .env local).
const file: string | null = fileArg ?? (profile ? null : '.env');

function readEnvFile(path: string | null): Record<string, string> {
  if (!path || !existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || line.trimStart().startsWith('#')) continue;
    out[m[1]!] = m[2]!.replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

interface EasProfile {
  extends?: string;
  developmentClient?: boolean;
  env?: Record<string, string>;
}

/** env y developmentClient del perfil, resolviendo `extends` (el perfil hijo gana). */
function readEasProfile(name: string): { env: Record<string, string>; development: boolean } {
  const eas = JSON.parse(readFileSync('eas.json', 'utf8')) as {
    build?: Record<string, EasProfile>;
  };
  const chain: EasProfile[] = [];
  const seen = new Set<string>();
  for (let cur: string | undefined = name; cur; cur = eas.build?.[cur]?.extends) {
    if (seen.has(cur)) throw new Error(`eas.json: extends circular en ${cur}`);
    seen.add(cur);
    const p = eas.build?.[cur];
    if (!p) throw new Error(`eas.json: no existe el perfil de build «${cur}»`);
    chain.unshift(p);
  }
  const env: Record<string, string> = {};
  let development = false;
  for (const p of chain) {
    Object.assign(env, p.env ?? {});
    if (p.developmentClient !== undefined) development = p.developmentClient;
  }
  return { env, development };
}

const eas = profile ? readEasProfile(profile) : null;
const production = args.includes('--production') || (eas !== null && !eas.development);

const fromFile = readEnvFile(file);
const values: Record<string, string | undefined> = {};
const source: Record<string, string> = {};
for (const v of PUBLIC_ENV) {
  const candidates: [string | undefined, string][] = [
    [process.env[v.name], 'proceso'],
    [eas?.env[v.name], 'eas.json'],
    [fromFile[v.name], 'archivo'],
  ];
  const hit = candidates.find(([value]) => value);
  if (hit) [values[v.name], source[v.name]] = hit;
}

// eas.json está versionado: sólo variables públicas conocidas (los valores se validan abajo).
const easProblems: string[] = [];
if (eas) {
  const known = new Set(PUBLIC_ENV.map((v) => v.name));
  for (const name of Object.keys(eas.env)) {
    if (!known.has(name)) easProblems.push(`${name}: no es una variable pública conocida`);
  }
}

const problems = checkPublicEnv(values, { production });
const label = { missing: 'falta', invalid: 'inválida', secret: 'ES UNA CLAVE SECRETA' } as const;

console.log(
  `Variables EXPO_PUBLIC_* (${production ? 'producción' : 'desarrollo'}` +
    `${profile ? `; perfil EAS: ${profile}` : ''}; archivo: ${file && existsSync(file) ? file : 'ninguno'})`,
);
for (const v of PUBLIC_ENV) {
  const p = problems.find((x) => x.name === v.name);
  const state = p ? label[p.problem] : values[v.name] ? 'ok' : 'vacía (opcional)';
  const from = source[v.name] ? ` [${source[v.name]}]` : '';
  console.log(`  ${p ? '✗' : '✓'} ${v.name}: ${state}${from}`);
}
for (const p of easProblems) console.log(`  ✗ eas.json ${p}`);
if (problems.length + easProblems.length > 0) {
  console.error(`\n${problems.length + easProblems.length} problema(s). Ver docs/ENVIRONMENT.md.`);
  process.exit(1);
}
