import { HAN } from './languages';

/**
 * Pinyin encima de los caracteres chinos. El texto se segmenta con el diccionario de palabras del
 * curso (texto → romanización), tomando siempre la palabra más larga que coincide. Lo que no está
 * en el diccionario (nombres propios, ejemplos de tonos) va en EXTRA_READINGS; un test verifica que
 * todo el contenido en chino tenga lectura.
 */

export const EXTRA_READINGS: Readonly<Record<string, string>> = {
  王明: 'Wáng Míng',
  妈: 'mā',
  麻: 'má',
  马: 'mǎ',
  骂: 'mà',
  // Partícula que aparece suelta como opción (en el vocabulario va dentro de 你呢).
  呢: 'ne',
  // Suelto como opción (en el vocabulario va dentro de 没有 y 没关系).
  没: 'méi',
};

export interface ReadingSegment {
  text: string;
  /** Pinyin del segmento; null si no es chino o no se conoce. */
  reading: string | null;
}

export type ReadingDictionary = ReadonlyMap<string, string>;

export function readingDictionary(
  words: readonly { text: string; romanization?: string | null }[],
): ReadingDictionary {
  const dict = new Map(Object.entries(EXTRA_READINGS));
  for (const w of words) if (w.romanization && HAN.test(w.text)) dict.set(w.text, w.romanization);
  return dict;
}

export const hasHan = (text: string) => HAN.test(text);

export function segmentReadings(text: string, dict: ReadingDictionary): ReadingSegment[] {
  const longest = Math.max(1, ...[...dict.keys()].map((k) => k.length));
  const out: ReadingSegment[] = [];
  const pushPlain = (s: string) => {
    const last = out.at(-1);
    if (last && last.reading === null) last.text += s;
    else out.push({ text: s, reading: null });
  };
  let i = 0;
  while (i < text.length) {
    if (!HAN.test(text[i]!)) {
      pushPlain(text[i]!);
      i += 1;
      continue;
    }
    let matched = false;
    for (let len = Math.min(longest, text.length - i); len > 0; len--) {
      const piece = text.slice(i, i + len);
      const reading = dict.get(piece);
      if (reading) {
        out.push({ text: piece, reading });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push({ text: text[i]!, reading: null });
      i += 1;
    }
  }
  return out;
}

/** Caracteres chinos del texto que el diccionario no sabe leer. */
export function unreadHan(text: string, dict: ReadingDictionary): string[] {
  return segmentReadings(text, dict)
    .filter((s) => s.reading === null && hasHan(s.text))
    .map((s) => s.text);
}
