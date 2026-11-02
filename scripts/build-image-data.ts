/**
 * Incrusta las imágenes de la app (zorros, mascota, resultado de partida) en el bundle de JS como
 * data URIs. Así llegan junto con el código: no hay descarga aparte ni en desarrollo (donde cada
 * imagen venía de Metro por la red y tardaba en aparecer) ni en producción.
 *
 * Uso: npx tsx scripts/build-image-data.ts   (después de cambiar algo en assets/avatars,
 * assets/mascot o assets/images; las imágenes ya deben estar optimizadas en WebP).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'src/design-system/imageData.generated.ts');

const IMAGES: Record<string, string> = {
  avatarViolet: 'assets/avatars/fox-violet.webp',
  avatarYellow: 'assets/avatars/fox-yellow.webp',
  avatarRed: 'assets/avatars/fox-red.webp',
  mascotWave: 'assets/mascot/wave.webp',
  mascotPointDown: 'assets/mascot/point-down.webp',
  mascotPointUp: 'assets/mascot/point-up.webp',
  mascotThinking: 'assets/mascot/thinking.webp',
  foxVictory: 'assets/images/fox-victory.webp',
  foxDefeat: 'assets/images/fox-defeat.webp',
};

let total = 0;
const lines = Object.entries(IMAGES).map(([name, file]) => {
  const data = readFileSync(join(ROOT, file));
  total += data.length;
  return `export const ${name} = { uri: 'data:image/webp;base64,${data.toString('base64')}' };`;
});

writeFileSync(
  OUT,
  `// Generado por scripts/build-image-data.ts — no editar a mano.\n\n${lines.join('\n')}\n`,
);
console.log(`${Object.keys(IMAGES).length} imágenes, ${Math.round(total / 1024)} KB → ${OUT}`);
