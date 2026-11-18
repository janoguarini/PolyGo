/**
 * Pinyin para el validador del chino (content/zh-checks.ts): divide en sílabas, separa el tono y
 * alinea sílabas con caracteres. Sólo se usa en content/ (no viaja con la app).
 */

const FINALS_BY_INITIAL: Record<string, string> = {
  '': 'a ai an ang ao e ei en eng er o ou',
  b: 'a ai an ang ao ei en eng i ian iao ie in ing o u',
  p: 'a ai an ang ao ei en eng i ian iao ie in ing o ou u',
  m: 'a ai an ang ao e ei en eng i ian iao ie in ing iu o ou u',
  f: 'a an ang ei en eng o ou u',
  d: 'a ai an ang ao e ei en eng i ia ian iao ie ing iu ong ou u uan ui un uo',
  t: 'a ai an ang ao e eng i ian iao ie ing ong ou u uan ui un uo',
  n: 'a ai an ang ao e ei en eng i ian iang iao ie in ing iu ong ou u uan uo ü üe',
  l: 'a ai an ang ao e ei eng i ia ian iang iao ie in ing iu o ong ou u uan un uo ü üe',
  g: 'a ai an ang ao e ei en eng ong ou u ua uai uan uang ui un uo',
  k: 'a ai an ang ao e ei en eng ong ou u ua uai uan uang ui un uo',
  h: 'a ai an ang ao e ei en eng ong ou u ua uai uan uang ui un uo',
  j: 'i ia ian iang iao ie in ing iong iu u uan ue un',
  q: 'i ia ian iang iao ie in ing iong iu u uan ue un',
  x: 'i ia ian iang iao ie in ing iong iu u uan ue un',
  zh: 'a ai an ang ao e ei en eng i ong ou u ua uai uan uang ui un uo',
  ch: 'a ai an ang ao e en eng i ong ou u ua uai uan uang ui un uo',
  sh: 'a ai an ang ao e ei en eng i ou u ua uai uan uang ui un uo',
  r: 'an ang ao e en eng i ong ou u ua uan ui un uo',
  z: 'a ai an ang ao e ei en eng i ong ou u uan ui un uo',
  c: 'a ai an ang ao e en eng i ong ou u uan ui un uo',
  s: 'a ai an ang ao e en eng i ong ou u uan ui un uo',
  y: 'a an ang ao e i in ing o ong ou u uan ue un',
  w: 'a ai an ang ei en eng o u',
};

/** Sílabas válidas sin tono (ü escrita como ü). */
export const SYLLABLES: ReadonlySet<string> = new Set(
  Object.entries(FINALS_BY_INITIAL).flatMap(([initial, finals]) =>
    finals.split(' ').map((f) => initial + f),
  ),
);

const TONE_MARKS: Record<string, number> = { '̄': 1, '́': 2, '̌': 3, '̀': 4 };

export interface Syllable {
  /** Sin tono, en minúsculas («hao», «lü»); «r» es el sufijo de 儿. */
  base: string;
  /** 1–4; 5 = neutro. */
  tone: number;
}

/** Quita las marcas de tono (conserva la ü) y devuelve el tono de la palabra (el último que aparece). */
function splitTone(text: string): { base: string; tones: number[] } {
  const tones: number[] = [];
  const base = [...text.normalize('NFD')]
    .map((ch) => {
      const t = TONE_MARKS[ch];
      if (t) {
        tones.push(t);
        return '';
      }
      return ch;
    })
    .join('')
    .normalize('NFC')
    .toLowerCase();
  return { base, tones };
}

/**
 * Divide una palabra de pinyin (sin espacios) en sílabas. Prueba primero las sílabas más largas y
 * retrocede si el resto no se puede dividir. Con «r» final (erhua: nǎr, yìdiǎnr) agrega la sílaba «r».
 * Devuelve null si no es pinyin válido.
 */
function splitWord(word: string): Syllable[] | null {
  // Posición de cada marca de tono en la palabra sin tonos.
  const marks: { at: number; tone: number }[] = [];
  let plainWord = '';
  for (const ch of word.normalize('NFD')) {
    const t = TONE_MARKS[ch];
    if (t) marks.push({ at: plainWord.normalize('NFC').length - 1, tone: t });
    else plainWord += ch;
  }
  const plain = plainWord.normalize('NFC').toLowerCase();
  const toneAt = (start: number, end: number) =>
    marks.filter((m) => m.at >= start && m.at < end).map((m) => m.tone);

  const go = (i: number): Syllable[] | null => {
    if (i === plain.length) return [];
    for (let len = Math.min(6, plain.length - i); len > 0; len--) {
      const piece = plain.slice(i, i + len);
      const erhua = piece === 'r' && i > 0;
      // Dentro de una palabra, una sílaba que empieza con a, e u o va tras un apóstrofo (Xī'ān).
      if (i > 0 && /^[aeo]/.test(piece)) continue;
      if (!SYLLABLES.has(piece) && !erhua) continue;
      const tones = toneAt(i, i + len);
      if (tones.length > 1) continue;
      const rest = go(i + len);
      if (rest) return [{ base: piece, tone: tones[0] ?? 5 }, ...rest];
    }
    return null;
  };
  return go(0);
}

/** Sílabas de un texto en pinyin (palabras separadas por espacios, apóstrofos, guiones o puntuación). */
export function syllables(pinyin: string): Syllable[] | null {
  const words = pinyin
    .replace(/[’']/g, ' ')
    .split(/[\s,.!?;:，。！？、…—\-()]+/)
    .filter(Boolean);
  const out: Syllable[] = [];
  for (const w of words) {
    const s = splitWord(w);
    if (!s) return null;
    out.push(...s);
  }
  return out;
}

/** Sílabas sin tono pegadas: para comparar pinyin escrito con o sin espacios. */
export const toneless = (pinyin: string) => splitTone(pinyin).base.replace(/[^a-zü]/g, '');

/**
 * Forma comparable de un pinyin: minúsculas, sin espacios ni puntuación, y con 不 y 一 en su tono de
 * diccionario (bú → bù; yí, yì → yī), para no marcar como error el cambio de tono.
 */
export function comparablePinyin(pinyin: string): string {
  const parts = syllables(pinyin);
  if (!parts) return `?${pinyin}`;
  return parts
    .map(({ base, tone }) => {
      if (base === 'bu' && (tone === 2 || tone === 4)) return 'bu4';
      if (base === 'yi' && tone !== 3 && tone !== 5) return 'yi1';
      return `${base}${tone}`;
    })
    .join('');
}

/**
 * ¿Dos pinyin dicen las mismas sílabas? Ignora espacios, mayúsculas y puntuación; el tono neutro
 * coincide con cualquier tono (两个 liǎng ge frente a 个 gè) y 不 / 一 se comparan sin su cambio de
 * tono (comparablePinyin).
 */
/** Vocal que lleva la marca: a o e; si no hay, la o de «ou»; si no, la última vocal (liù, guì). */
function toneVowelIndex(base: string): number {
  for (const v of ['a', 'e']) if (base.includes(v)) return base.indexOf(v);
  if (base.includes('ou')) return base.indexOf('o');
  for (let i = base.length - 1; i >= 0; i--) if ('iouü'.includes(base[i]!)) return i;
  return -1;
}

/**
 * Sílabas con la marca de tono sobre la vocal equivocada («haǒ» por «hǎo», «lìu» por «liù»). Devuelve
 * las palabras mal marcadas; vacío si todas están bien o si el texto no es pinyin (lo informa syllables).
 */
export function misplacedToneMarks(pinyin: string): string[] {
  const bad: string[] = [];
  for (const word of pinyin
    .replace(/[’']/g, ' ')
    .split(/[\s,.!?;:，。！？、…—\-()]+/)
    .filter(Boolean)) {
    const parts = splitWord(word);
    if (!parts) continue;
    // Posición de cada marca en la palabra sin tonos.
    const marks: number[] = [];
    let plain = '';
    for (const ch of word.normalize('NFD')) {
      if (TONE_MARKS[ch]) marks.push(plain.normalize('NFC').length - 1);
      else plain += ch;
    }
    let start = 0;
    for (const p of parts) {
      const end = start + p.base.length;
      const mark = marks.find((m) => m >= start && m < end);
      if (mark !== undefined && p.base !== 'r' && mark - start !== toneVowelIndex(p.base)) {
        bad.push(word);
        break;
      }
      start = end;
    }
  }
  return bad;
}

export function samePinyin(a: string, b: string): boolean {
  const x = syllables(a);
  const y = syllables(b);
  if (!x || !y || x.length !== y.length) return false;
  return x.every((s, i) => {
    const t = y[i]!;
    if (s.base !== t.base) return false;
    if (s.tone === t.tone || s.tone === 5 || t.tone === 5) return true;
    if (s.base === 'bu' && [2, 4].includes(s.tone) && [2, 4].includes(t.tone)) return true;
    if (s.base === 'yi' && [1, 2, 4].includes(s.tone) && [1, 2, 4].includes(t.tone)) return true;
    return false;
  });
}
