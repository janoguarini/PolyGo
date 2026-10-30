/**
 * Genera los efectos de sonido de la app (assets/sounds/*.wav) por síntesis, sin muestras
 * de terceros. Ejecutar: npx tsx scripts/generate-sounds.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RATE = 44_100;

interface Note {
  /** Hz */
  freq: number;
  /** Inicio y duración en segundos. */
  start: number;
  duration: number;
  gain: number;
  /** Mezcla de armónicos: [amplitud del 2.º, del 3.º]. */
  harmonics?: [number, number];
}

function render(notes: Note[]): Float32Array {
  const length = Math.ceil(Math.max(...notes.map((n) => n.start + n.duration)) * RATE) + 1;
  const out = new Float32Array(length);
  for (const n of notes) {
    const [h2, h3] = n.harmonics ?? [0.25, 0.1];
    const first = Math.floor(n.start * RATE);
    const count = Math.floor(n.duration * RATE);
    for (let i = 0; i < count; i++) {
      const t = i / RATE;
      // Ataque de 6 ms (sin clic) y caída exponencial hasta ~0 al final de la nota.
      const env = Math.min(1, t / 0.006) * Math.exp((-5 * t) / n.duration);
      const w = 2 * Math.PI * n.freq * t;
      out[first + i] =
        (out[first + i] ?? 0) +
        n.gain * env * (Math.sin(w) + h2 * Math.sin(2 * w) + h3 * Math.sin(3 * w));
    }
  }
  return out;
}

function wav(samples: Float32Array): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) =>
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32_767), i * 2),
  );
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const sounds: Record<string, Note[]> = {
  // Dos notas brillantes ascendentes (Mi6 → La6).
  correct: [
    { freq: 1318.5, start: 0, duration: 0.12, gain: 0.32 },
    { freq: 1760, start: 0.085, duration: 0.32, gain: 0.34 },
  ],
  // Dos notas graves y suaves descendentes: avisa sin castigar.
  incorrect: [
    { freq: 233.1, start: 0, duration: 0.16, gain: 0.3, harmonics: [0.4, 0.2] },
    { freq: 185, start: 0.13, duration: 0.3, gain: 0.3, harmonics: [0.4, 0.2] },
  ],
  // Arpegio Do-Mi-Sol-Do al terminar una sesión.
  complete: [
    { freq: 523.3, start: 0, duration: 0.2, gain: 0.22 },
    { freq: 659.3, start: 0.1, duration: 0.2, gain: 0.22 },
    { freq: 784, start: 0.2, duration: 0.24, gain: 0.22 },
    { freq: 1046.5, start: 0.3, duration: 0.7, gain: 0.26 },
    { freq: 1318.5, start: 0.3, duration: 0.7, gain: 0.12 },
  ],
};

const dir = join(import.meta.dirname, '..', 'assets', 'sounds');
mkdirSync(dir, { recursive: true });
for (const [name, notes] of Object.entries(sounds)) {
  writeFileSync(join(dir, `${name}.wav`), wav(render(notes)));
  console.log(`assets/sounds/${name}.wav`);
}
