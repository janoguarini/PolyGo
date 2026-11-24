/**
 * Ids de ítem de los ejercicios escritos y registro content/ids.lock.json (content/ids-lock.ts;
 * reglas en docs/LEARNING_CATALOG_PHASE1.md, §2). Es el único que escribe el registro.
 *
 *   npm run content:ids
 *       1. Reemplaza cada marcador '<idioma>.ex.new' de content/**\/*.ts por un id nuevo
 *          ('<idioma>.ex.' + 14 caracteres [0-9a-z]), único frente al registro y al contenido.
 *       2. Registra los ítems nuevos, los reemplazos y la ubicación nueva de los escritos que se
 *          movieron con su id (sólo `exercise`). No toca nada si hay un cambio de identidad,
 *          un id que desapareció, un id retirado reutilizado o un ejercicio escrito nuevo sin id.
 *   npm run content:ids -- check                         sólo informa (sale con 1 si hay problemas)
 *   npm run content:ids -- withdraw <id> --reason "…"    retira un id que ya no está en el contenido
 *   npm run content:ids -- restore <id>                  reactiva un id retirado con la misma identidad
 *   npm run content:ids -- --init                        primer registro (sólo con el registro vacío)
 *
 * Los ids nuevos se sortean acá, una sola vez, y quedan escritos en el contenido: ningún build
 * genera ids.
 */
import { randomInt } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { readIdsLock, writeIdsLock } from './ids-lock-io';

const CONTENT_DIR = join(__dirname, '..', 'content');
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const PLACEHOLDER = /(['"])([a-z]{2,3})\.ex\.new\1/g;

function contentFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : contentFiles(path);
    return name.endsWith('.ts') ? [path] : [];
  });
}

/** Reemplaza los marcadores por ids nuevos. Devuelve los ids escritos. */
function mintPlaceholders(): string[] {
  const lock = readIdsLock();
  const files = contentFiles(CONTENT_DIR);
  const taken = new Set(Object.keys(lock.items));
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(/[a-z]{2,3}\.ex\.[0-9a-z]{14}/g))
      taken.add(m[0]);
  }
  const minted: string[] = [];
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    if (!PLACEHOLDER.test(text)) continue;
    PLACEHOLDER.lastIndex = 0;
    const next = text.replace(PLACEHOLDER, (_, quote: string, language: string) => {
      let id: string;
      do {
        id = `${language}.ex.${Array.from({ length: 14 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')}`;
      } while (taken.has(id));
      taken.add(id);
      minted.push(id);
      console.log(`${relative(process.cwd(), f)}: ${id}`);
      return `${quote}${id}${quote}`;
    });
    writeFileSync(f, next, 'utf8');
  }
  return minted;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args.find((a) => !a.startsWith('--')) ?? 'lock';
  const minted = command === 'lock' ? mintPlaceholders() : [];
  // El contenido se importa después de escribir los ids nuevos.
  // El registro cubre el currículo y las lecciones «En contexto» de la fase C.
  const { ITEM_REGISTRY_PATH } = await import('../content/comprehension');
  const { buildCatalog } = await import('../content/catalog');
  const ids = await import('../content/ids-lock');
  const catalog = buildCatalog(ITEM_REGISTRY_PATH);
  const lock = readIdsLock();

  if (command === 'check') {
    const problems = ids.checkIdsLock(catalog, lock);
    for (const p of problems) console.log(`- ${p.message}`);
    console.log(
      problems.length ? `${problems.length} problemas` : 'OK: el contenido respeta el registro',
    );
    process.exit(problems.length ? 1 : 0);
  }
  if (command === 'withdraw' || command === 'restore') {
    const r = args.indexOf('--reason');
    const reason = r >= 0 ? (args[r + 1] ?? '') : '';
    const targets = args.filter((a, i) => a !== command && !a.startsWith('--') && i !== r + 1);
    if (!targets.length) throw new Error(`Uso: npm run content:ids -- ${command} <id> [<id> …]`);
    let next = lock;
    for (const id of targets) {
      next =
        command === 'withdraw'
          ? ids.withdrawId(catalog, next, id, reason)
          : ids.restoreId(catalog, next, id);
    }
    writeIdsLock(next);
    console.log(`OK ${command}: ${targets.join(', ')}`);
    return;
  }
  if (command !== 'lock') throw new Error(`Comando desconocido: ${command}`);
  const {
    lock: next,
    added,
    replaced,
    moved,
  } = ids.updateIdsLock(catalog, lock, {
    init: args.includes('--init'),
  });
  writeIdsLock(next);
  console.log(
    `OK content/ids.lock.json: ${Object.keys(next.items).length} ids, ${added.length} nuevos ` +
      `(${minted.length} sorteados), ${replaced.length} reemplazados, ${moved.length} movidos`,
  );
  for (const id of moved)
    console.log(`  ubicación actualizada: ${id} → ${next.items[id]!.exercise}`);
  for (const id of replaced)
    console.log(`  retirado por reemplazo: ${id} → ${next.items[id]!.withdrawn!.replacedBy}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
