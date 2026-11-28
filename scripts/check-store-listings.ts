/**
 * Comprueba los límites de las fichas de tienda de docs/STORE_LISTINGS.md (App Store y Google Play).
 * Uso: npx tsx scripts/check-store-listings.ts
 *
 * Límites: App Store nombre 30, subtítulo 30, palabras clave 100 (sin espacios después de las comas),
 * texto promocional 170, descripción 4000; Google Play título 30, descripción corta 80, completa 4000.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LIMITS: [RegExp, number][] = [
  [/^(Nome|Nombre|Nom) \(30\)$/, 30],
  [/^(Subtítulo|Sottotitolo|Sous-titre) \(30\)$/, 30],
  [/^(Palavras-chave|Parole chiave|Mots-clés) \(100\)$/, 100],
  [/^(Texto promocional|Testo promozionale|Texte promotionnel) \(170\)$/, 170],
  [/^(Título|Titolo|Titre) \(30\)$/, 30],
  [/^(Descrição curta|Descrizione breve|Description courte) \(80\)$/, 80],
];

const doc = readFileSync(join(__dirname, '..', 'docs', 'STORE_LISTINGS.md'), 'utf8');
const problems: string[] = [];
let section = '';
let checked = 0;

for (const line of doc.split('\n')) {
  if (line.startsWith('## ')) section = line.slice(3);
  const row = /^\| ([^|]+?) \| (.+?) \|$/.exec(line);
  if (!row) continue;
  const [, field, value] = row as unknown as [string, string, string];
  const limit = LIMITS.find(([re]) => re.test(field))?.[1];
  if (!limit) continue;
  checked++;
  const length = [...value].length;
  if (length > limit) problems.push(`${section} · ${field}: ${length} > ${limit} «${value}»`);
  if (/Palavras|Parole|Mots/.test(field) && /,\s/.test(value))
    problems.push(`${section} · ${field}: espacio después de una coma (gasta caracteres)`);
}

// Descripciones (bloques de código): máximo 4000.
for (const block of doc.matchAll(/```\n([\s\S]*?)```/g)) {
  const text = block[1]!;
  if ([...text].length > 4000) problems.push(`descripción de ${[...text].length} caracteres (> 4000)`);
}

for (const p of problems) console.log(`- ${p}`);
console.log(`${checked} campos revisados · ${problems.length} problemas`);
process.exit(problems.length ? 1 : 0);
