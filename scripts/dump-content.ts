/**
 * Guarda el contenido actual (con la forma de las filas de la base) en un JSON. Correrlo antes de
 * editar content/ para después generar la migración diferencial:
 *   npm run content:dump -- antes.json
 *   (editar content/, correr los tests)
 *   npm run content:diff -- antes.json supabase/migrations/<timestamp>_content_fix.sql
 */
import { writeFileSync } from 'node:fs';

import { contentDocument } from './content-document';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:dump -- <archivo.json>');
  process.exit(1);
}
writeFileSync(out, JSON.stringify(contentDocument()), 'utf8');
console.log(`OK ${out}`);
