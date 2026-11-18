import type { ExerciseType } from '../shared/exercises';
import type { AssessmentMode, Catalog, ResponseFormat, ResponsePrivacy } from './catalog';
import type { Level } from './types';

/**
 * Registro de los ids de ítem publicados: content/ids.lock.json (arquitectura de datos rev. 8, §5:
 * «registra todos los ids publicados, y un test falla si alguno desaparece o cambia de tipo o de
 * modo»). Algoritmo y reglas en docs/LEARNING_CATALOG_PHASE1.md, §2.
 *
 * Es de sólo agregado: un id registrado no se borra, no cambia su identidad y no se reasigna. Lo
 * único que puede cambiar en una entrada es marcarla retirada (`withdrawn`), y sólo con un comando
 * explícito (`npm run content:ids`). La identidad es lo que §5 dice que hace un ítem nuevo: tipo,
 * modo, formato, privacidad, conceptos target, idioma, nivel y origen. La redacción, las opciones y
 * la respuesta no son identidad: cambiarlas será una versión nueva del mismo ítem
 * (`exercise_item_versions`, docs/EXERCISE_ITEM_VERSIONS_PENDING.md).
 *
 * Funciones puras: los scripts leen y escriben el archivo (scripts/ids-lock-file.ts).
 */

export const IDS_LOCK_VERSION = 1;

export interface LockEntry {
  language: string;
  level: Level;
  origin: 'authored' | 'generated';
  type: ExerciseType;
  mode: AssessmentMode;
  format: ResponseFormat;
  privacy: ResponsePrivacy;
  /** Conceptos target, ordenados. */
  targets: string[];
  /** Escritos: la ubicación (`exercises.id`) del ejercicio escrito. */
  exercise?: string;
  /** Retirado del contenido con un comando explícito. El id no se reutiliza. */
  withdrawn?: { reason: string; replacedBy?: string };
}

export interface IdsLock {
  version: typeof IDS_LOCK_VERSION;
  items: Record<string, LockEntry>;
}

/** Campos que definen la identidad de un ítem: si cambia uno, es un ítem nuevo (§5). */
export const IDENTITY_FIELDS = [
  'language',
  'level',
  'origin',
  'type',
  'mode',
  'format',
  'privacy',
  'targets',
] as const;

export type LockProblemKind =
  /** Ítem nuevo con un id válido que todavía no está registrado: lo registra `content:ids`. */
  | 'unregistered'
  /** Ejercicio escrito nuevo sin id propio (sólo tiene el id por posición). */
  | 'legacy_new'
  /** Un id registrado aparece con otra identidad. */
  | 'identity_change'
  /** Un id registrado ya no está en el contenido. */
  | 'absent'
  /** Un id registrado cuya ubicación ahora tiene un ítem nuevo: `content:ids` registra el reemplazo. */
  | 'replaced'
  /**
   * Un escrito registrado que se movió de lección o de posición con el mismo id: `content:ids`
   * actualiza su ubicación (`exercise`). No cambia la identidad ni retira nada.
   */
  | 'moved'
  /** El contenido usa un id retirado. */
  | 'withdrawn_reused';

export interface LockProblem {
  kind: LockProblemKind;
  id: string;
  message: string;
}

/** Id por posición de un ejercicio escrito ya publicado (`a1-u01-l01-e03`, `it-a1-u01-l01-e03`). */
export const LEGACY_AUTHORED_ID = /^(?:[a-z]{2,3}-)?[abc][12]-u\d\d-l\d\d-e\d\d$/;

/** Id propio de un ejercicio escrito nuevo: `<idioma>.ex.` + 14 caracteres [0-9a-z] (§5). */
export const AUTHORED_ID = /^([a-z]{2,3})\.ex\.([0-9a-z]{14})$/;

/** Marcador que se escribe en el contenido para pedir un id nuevo (`npm run content:ids` lo reemplaza). */
export const newIdPlaceholder = (language: string) => `${language}.ex.new`;
export const NEW_ID_PLACEHOLDER = /^([a-z]{2,3})\.ex\.new$/;

/** Entradas que corresponden al catálogo actual (sin `withdrawn`). */
export function lockEntriesOf(catalog: Catalog): Map<string, LockEntry> {
  const targets = new Map<string, Set<string>>();
  for (const r of catalog.item_concepts) {
    if (r.role !== 'target') continue;
    const set = targets.get(r.item_id) ?? new Set<string>();
    set.add(r.concept_id);
    targets.set(r.item_id, set);
  }
  const location = new Map<string, string>();
  for (const p of catalog.placements) {
    if (p.kind === 'authored') location.set(p.item_id, p.exercise_id);
  }
  const out = new Map<string, LockEntry>();
  for (const i of catalog.items) {
    const entry: LockEntry = {
      language: i.language_code,
      level: i.level,
      origin: i.origin,
      type: i.type,
      mode: i.assessment_mode,
      format: i.response_format,
      privacy: i.response_privacy,
      targets: [...(targets.get(i.id) ?? [])].sort(),
    };
    const at = location.get(i.id);
    if (at) entry.exercise = at;
    out.set(i.id, entry);
  }
  return out;
}

const show = (v: unknown) => (Array.isArray(v) ? `[${v.join(', ')}]` : String(v));

function identityMessage(id: string, locked: LockEntry, now: LockEntry, fields: string[]) {
  const what = fields
    .map((f) => {
      const k = f as (typeof IDENTITY_FIELDS)[number];
      return `${f}: ${show(locked[k])} → ${show(now[k])}`;
    })
    .join('; ');
  if (now.origin === 'authored') {
    return (
      `${id} (ejercicio ${now.exercise ?? '?'}) cambió de identidad (${what}). Es un ítem nuevo (§5): ` +
      `poné id: '${newIdPlaceholder(now.language)}' en ese ejercicio y corré npm run content:ids. ` +
      `El id ${id} no se reutiliza ni se borra: conserva su identidad histórica.`
    );
  }
  return (
    `${id} (generado) cambió de identidad (${what}). La plantilla da el mismo id con otra identidad, ` +
    `así que no se resuelve sola: hace falta una plantilla nueva (otro segmento de id, ` +
    `docs/LEARNING_CATALOG_PHASE1.md §1) o retirar el ítem con npm run content:ids -- withdraw ${id} --reason "…".`
  );
}

/** Problemas del catálogo frente al registro. Vacío = el contenido respeta todos los ids publicados. */
export function checkIdsLock(catalog: Catalog, lock: IdsLock): LockProblem[] {
  const current = lockEntriesOf(catalog);
  const problems: LockProblem[] = [];
  for (const [id, entry] of current) {
    const locked = lock.items[id];
    if (!locked) {
      if (entry.origin === 'authored' && LEGACY_AUTHORED_ID.test(id)) {
        problems.push({
          kind: 'legacy_new',
          id,
          message:
            `${entry.exercise ?? id}: ejercicio escrito nuevo sin id propio. Agregale ` +
            `id: '${newIdPlaceholder(entry.language)}' y corré npm run content:ids (el id por ` +
            `posición sólo vale para los ejercicios ya publicados).`,
        });
      } else {
        problems.push({
          kind: 'unregistered',
          id,
          message: `${id}: ítem nuevo sin registrar en content/ids.lock.json. Corré npm run content:ids.`,
        });
      }
      continue;
    }
    if (locked.withdrawn) {
      problems.push({
        kind: 'withdrawn_reused',
        id,
        message:
          `${id} está retirado (${locked.withdrawn.reason}) y un id retirado no se reutiliza. ` +
          (entry.origin === 'authored'
            ? `Poné id: '${newIdPlaceholder(entry.language)}' en el ejercicio ${entry.exercise ?? ''} y corré npm run content:ids.`
            : `Si la plantilla lo vuelve a generar con la misma identidad: npm run content:ids -- restore ${id}.`),
      });
      continue;
    }
    const fields = IDENTITY_FIELDS.filter(
      (f) => JSON.stringify(locked[f]) !== JSON.stringify(entry[f]),
    );
    if (fields.length) {
      problems.push({
        kind: 'identity_change',
        id,
        message: identityMessage(id, locked, entry, fields),
      });
    } else if (entry.exercise !== undefined && locked.exercise !== entry.exercise) {
      // La ubicación registrada es la que usa la detección de reemplazos: si quedara vieja, un ítem
      // nuevo en la posición que el ejercicio dejó parecería su reemplazo.
      problems.push({
        kind: 'moved',
        id,
        message:
          `${id} se movió de ${locked.exercise ?? '?'} a ${entry.exercise}. Corré npm run content:ids ` +
          `para actualizar su ubicación en el registro (la identidad no cambia).`,
      });
    }
  }
  const byLocation = new Map(
    [...current].flatMap(([id, e]) => (e.exercise ? [[e.exercise, id] as const] : [])),
  );
  for (const [id, locked] of Object.entries(lock.items)) {
    if (locked.withdrawn || current.has(id)) continue;
    const successor = locked.exercise ? byLocation.get(locked.exercise) : undefined;
    if (successor && !lock.items[successor]) {
      problems.push({
        kind: 'replaced',
        id,
        message:
          `${id}: el ejercicio ${locked.exercise} ahora es el ítem nuevo ${successor}. ` +
          `Corré npm run content:ids para registrar el reemplazo (${id} queda retirado, sin borrarse).`,
      });
    } else {
      problems.push({
        kind: 'absent',
        id,
        message:
          `${id} desapareció del contenido. Si el ejercicio se movió, poné id: '${id}' en él; ` +
          `si se quitó a propósito: npm run content:ids -- withdraw ${id} --reason "…".`,
      });
    }
  }
  return problems.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

const sortedItems = (items: Record<string, LockEntry>) =>
  Object.fromEntries(Object.entries(items).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

export interface LockUpdate {
  lock: IdsLock;
  added: string[];
  replaced: string[];
  /** Escritos registrados cuya ubicación (`exercise`) se actualizó. */
  moved: string[];
}

/**
 * Registra los ítems nuevos, los reemplazos y las ubicaciones nuevas de los escritos que se movieron
 * (sólo `exercise`: la identidad no cambia y no se retira nada). Falla (sin cambiar nada) ante
 * cualquier otro problema: cambios de identidad, desapariciones, ids retirados o escritos nuevos sin
 * id propio. `init` sólo vale con un registro vacío: registra también los ids por posición (el primer
 * registro). Idempotente: con el registro al día no cambia nada.
 */
export function updateIdsLock(
  catalog: Catalog,
  lock: IdsLock,
  { init = false }: { init?: boolean } = {},
): LockUpdate {
  if (init && Object.keys(lock.items).length > 0) {
    throw new Error('--init sólo vale con content/ids.lock.json vacío');
  }
  const problems = checkIdsLock(catalog, lock);
  const blocking = problems.filter(
    (p) =>
      p.kind !== 'unregistered' &&
      p.kind !== 'replaced' &&
      p.kind !== 'moved' &&
      !(init && p.kind === 'legacy_new'),
  );
  if (blocking.length) {
    throw new Error(
      `content/ids.lock.json no se actualizó:\n${blocking.map((p) => `- ${p.message}`).join('\n')}`,
    );
  }
  const current = lockEntriesOf(catalog);
  const items = { ...lock.items };
  const added: string[] = [];
  const replaced: string[] = [];
  const moved: string[] = [];
  for (const p of problems) {
    if (p.kind === 'unregistered' || p.kind === 'legacy_new') {
      items[p.id] = current.get(p.id)!;
      added.push(p.id);
    } else if (p.kind === 'moved') {
      items[p.id] = { ...items[p.id]!, exercise: current.get(p.id)!.exercise };
      moved.push(p.id);
    }
  }
  const byLocation = new Map(
    [...current].flatMap(([id, e]) => (e.exercise ? [[e.exercise, id] as const] : [])),
  );
  for (const p of problems) {
    if (p.kind !== 'replaced') continue;
    const old = items[p.id]!;
    items[p.id] = {
      ...old,
      withdrawn: { reason: 'replaced', replacedBy: byLocation.get(old.exercise!)! },
    };
    replaced.push(p.id);
  }
  return {
    lock: { version: IDS_LOCK_VERSION, items: sortedItems(items) },
    added,
    replaced,
    moved,
  };
}

/** Marca retirado un id que ya no está en el contenido (explícito: `content:ids -- withdraw`). */
export function withdrawId(catalog: Catalog, lock: IdsLock, id: string, reason: string): IdsLock {
  const entry = lock.items[id];
  if (!entry) throw new Error(`${id} no está en content/ids.lock.json`);
  if (entry.withdrawn) throw new Error(`${id} ya está retirado`);
  if (!reason.trim()) throw new Error('Falta --reason');
  if (lockEntriesOf(catalog).has(id)) throw new Error(`${id} sigue en el contenido: no se retira`);
  return {
    version: IDS_LOCK_VERSION,
    items: sortedItems({ ...lock.items, [id]: { ...entry, withdrawn: { reason: reason.trim() } } }),
  };
}

/** Vuelve a activar un id retirado que el contenido genera otra vez con la misma identidad. */
export function restoreId(catalog: Catalog, lock: IdsLock, id: string): IdsLock {
  const entry = lock.items[id];
  if (!entry?.withdrawn) throw new Error(`${id} no está retirado`);
  const now = lockEntriesOf(catalog).get(id);
  if (!now) throw new Error(`${id} no está en el contenido`);
  const same = IDENTITY_FIELDS.every((f) => JSON.stringify(entry[f]) === JSON.stringify(now[f]));
  if (!same) throw new Error(`${id} vuelve con otra identidad: necesita un id nuevo`);
  const { withdrawn: _, ...rest } = entry;
  return { version: IDS_LOCK_VERSION, items: sortedItems({ ...lock.items, [id]: rest }) };
}

const FIELD_ORDER = [...IDENTITY_FIELDS, 'exercise', 'withdrawn'] as const;

/** Texto determinista: una entrada por línea, ordenadas por id (código de unidad UTF-16). */
export function serializeIdsLock(lock: IdsLock): string {
  const lines = Object.entries(sortedItems(lock.items)).map(([id, e]) => {
    const ordered = Object.fromEntries(
      FIELD_ORDER.filter((f) => e[f] !== undefined).map((f) => [f, e[f]]),
    );
    return `    ${JSON.stringify(id)}: ${JSON.stringify(ordered)}`;
  });
  const items = lines.length ? `{\n${lines.join(',\n')}\n  }` : '{}';
  return `{\n  "version": ${IDS_LOCK_VERSION},\n  "items": ${items}\n}\n`;
}

export function parseIdsLock(text: string): IdsLock {
  const parsed = JSON.parse(text) as IdsLock;
  if (parsed.version !== IDS_LOCK_VERSION || typeof parsed.items !== 'object') {
    throw new Error('content/ids.lock.json: versión o formato desconocido');
  }
  return parsed;
}

export const emptyIdsLock = (): IdsLock => ({ version: IDS_LOCK_VERSION, items: {} });
