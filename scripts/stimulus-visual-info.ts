/**
 * Datos de un recurso visual para su ficha (fase C.9.1, content/stimulus-visuals.ts).
 *
 * Uso: npm run content:visual -- assets/stimuli/en/a1/u02-class-card.jpg
 *
 * Imprime formato, tamaño, peso y sha256, y lo compara con la ficha que nombra ese archivo. No
 * escribe nada: el sha256 se copia a mano en la ficha (revisión humana del recurso definitivo).
 */
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { STIMULUS_VISUAL_LIMITS } from '../shared/exercises';
import { STIMULUS_VISUAL_SPECS } from '../content/stimulus-visuals';
import { imageInfo } from './image-info';

const arg = process.argv[2];
if (!arg) {
  console.error('Uso: npm run content:visual -- assets/stimuli/<idioma>/<nivel>/<archivo>');
  process.exit(1);
}
const info = imageInfo(readFileSync(arg));
const file = relative(resolve('assets/stimuli'), resolve(arg)).replace(/\\/g, '/');
console.log(
  `${file}: ${info.format} ${info.width}×${info.height} · ${Math.round(info.bytes / 1024)} KB`,
);
console.log(`sha256: ${info.sha256}`);

const spec = STIMULUS_VISUAL_SPECS.find((s) => s.file === file);
if (!spec) {
  console.error('Ninguna ficha de content/stimulus-visuals.ts nombra este archivo.');
  process.exit(1);
}
const problems = [
  info.width !== spec.visual.width || info.height !== spec.visual.height
    ? `tamaño ${info.width}×${info.height}, la ficha pide ${spec.visual.width}×${spec.visual.height}`
    : null,
  info.bytes > STIMULUS_VISUAL_LIMITS.maxBytes
    ? `pesa ${Math.round(info.bytes / 1024)} KB (máximo ${STIMULUS_VISUAL_LIMITS.maxBytes / 1024} KB)`
    : null,
  (spec.visual.kind === 'photo') !== (info.format === 'jpeg')
    ? `formato ${info.format} para ${spec.visual.kind}`
    : null,
].filter(Boolean);
if (problems.length) {
  console.error(
    `No cumple la ficha ${spec.visual.id}:\n${problems.map((p) => `- ${p}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(
  spec.sha256 === info.sha256
    ? `Coincide con la ficha ${spec.visual.id}.`
    : `Cumple la ficha ${spec.visual.id}. Anotá este sha256 en content/stimulus-visuals.ts y registrá el require en src/features/learning/stimulusImages.ts.`,
);
