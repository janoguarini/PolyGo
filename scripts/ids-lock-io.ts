import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { emptyIdsLock, parseIdsLock, serializeIdsLock, type IdsLock } from '../content/ids-lock';

/**
 * Lectura y escritura de content/ids.lock.json, sin importar el contenido: scripts/content-ids.ts
 * escribe los ids nuevos en content/ antes de cargarlo, así que no puede depender de un módulo que
 * importe el currículo (scripts/ids-lock-file.ts lo hace).
 */
export const IDS_LOCK_FILE = join(__dirname, '..', 'content', 'ids.lock.json');

export function readIdsLock(file = IDS_LOCK_FILE): IdsLock {
  return existsSync(file) ? parseIdsLock(readFileSync(file, 'utf8')) : emptyIdsLock();
}

export function writeIdsLock(lock: IdsLock, file = IDS_LOCK_FILE) {
  writeFileSync(file, serializeIdsLock(lock), 'utf8');
}
