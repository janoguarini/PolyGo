/// <reference types="node" />
// Usa node:crypto: sólo lo importan los scripts y las pruebas, nunca la app.
import { createHash } from 'node:crypto';

/**
 * Serialización canónica y hash del contenido de una versión (decisiones V3 y V4,
 * docs/EXERCISE_ITEM_VERSIONS_PENDING.md). Sólo se calcula en Node: la base guarda el hash y su
 * unique, y no repite el algoritmo en SQL.
 *
 * - JSON canónico RFC 8785 (JCS): claves de objeto ordenadas por unidades de código UTF-16, sin
 *   espacios, números con la serialización de ECMAScript, cadenas con el escape de JSON.stringify.
 *   Los arrays conservan su orden (fichas, opciones, parejas, `accepted_answers`).
 * - Antes de serializar, toda cadena (claves y valores) pasa a Unicode NFC.
 * - `null` explícito: una clave con null se serializa; `undefined` no existe en JSON y se rechaza.
 * - Hash: `v1:` + SHA-256 en hexadecimal del texto canónico en UTF-8.
 */

const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

function serialize(value: unknown, at: string): string {
  if (value === null) return 'null';
  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      if (!Number.isFinite(value)) throw new Error(`${at}: número no finito`);
      // ECMAScript Number→String (RFC 8785 §3.2.2.3); -0 se serializa "0".
      return JSON.stringify(value);
    case 'string': {
      const s = value.normalize('NFC');
      if (LONE_SURROGATE.test(s)) throw new Error(`${at}: sustituto UTF-16 suelto`);
      return JSON.stringify(s);
    }
    case 'object': {
      if (Array.isArray(value)) {
        return `[${value.map((v, i) => serialize(v, `${at}[${i}]`)).join(',')}]`;
      }
      const proto = Object.getPrototypeOf(value);
      if (proto !== Object.prototype && proto !== null) throw new Error(`${at}: no es JSON`);
      const entries = Object.entries(value as Record<string, unknown>).map(
        ([k, v]) => [k.normalize('NFC'), v] as const,
      );
      const keys = entries.map(([k]) => k);
      if (new Set(keys).size !== keys.length) throw new Error(`${at}: claves repetidas tras NFC`);
      // Orden por unidades de código UTF-16: el orden por defecto de Array.prototype.sort.
      entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      return `{${entries.map(([k, v]) => `${serialize(k, at)}:${serialize(v, `${at}.${k}`)}`).join(',')}}`;
    }
    default:
      throw new Error(`${at}: ${typeof value} no es JSON`);
  }
}

/** JSON canónico (RFC 8785) con las cadenas en NFC. */
export function canonicalJson(value: unknown): string {
  return serialize(value, '$');
}

export const HASH_PREFIX = 'v1:';

/** `v1:` + sha256 hex del JSON canónico. */
export function canonicalHash(value: unknown): string {
  return HASH_PREFIX + createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}
