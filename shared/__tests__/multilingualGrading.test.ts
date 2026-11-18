/**
 * Fase 5 (C): cómo corrige `polygo.answers.v1` en cada idioma del catálogo. No cambia el normalizador
 * (congelado, V2): fija su comportamiento con Unicode, acentos y escritura china para que un cambio
 * accidental falle acá. Las diferencias que pedirían otra política (D-P8-2) están en
 * docs/LEARNING_PHASE5.md §4.
 */
import { canonicalForm, normalizeAnswer } from '../answers';
import { gradeWithSpec, gradingSpecFor } from '../grading';

const text = (value: string) => ({ kind: 'text' as const, value });
const tokens = (...value: string[]) => ({ kind: 'tokens' as const, value });
const write = gradingSpecFor('translate_write');
const order = gradingSpecFor('order_words');
const grade = (answer: string, given: string, accepted: string[] = [], spec = write) =>
  gradeWithSpec(spec, { answer, accepted_answers: accepted, payload: null }, text(given));

describe('Unicode y NFC', () => {
  it('NFD y NFC son la misma respuesta en todos los idiomas', () => {
    for (const s of ['perché', 'você está', 'café', 'ça va', 'nǐ hǎo', 'mañana']) {
      const nfd = s.normalize('NFD');
      expect(nfd).not.toBe(s);
      expect(normalizeAnswer(nfd)).toBe(normalizeAnswer(s));
      expect(grade(s, nfd)).toMatchObject({ correct: true, typo: false });
    }
  });

  it('mayúsculas con acento se pliegan (È, Ç, Ã)', () => {
    expect(grade('è', 'È')).toMatchObject({ correct: true });
    expect(grade('ação', 'AÇÃO')).toMatchObject({ correct: true });
  });
});

describe('acentos: cuentan (política estricta de v1)', () => {
  it('italiano: «perche» no es «perché» (palabra corta: sin tipeo)', () => {
    expect(grade('perché', 'perche')).toMatchObject({ correct: false });
  });

  it('portugués: un acento faltante en una frase larga es tipeo, nunca «correcta»', () => {
    expect(grade('você está bem', 'voce está bem')).toMatchObject({ correct: true, typo: true });
    expect(grade('não', 'nao')).toMatchObject({ correct: false });
  });

  it('español y francés (sin contenido publicado): mismas reglas', () => {
    expect(grade('mañana', 'manana')).toMatchObject({ correct: false });
    expect(grade('¿Cómo estás?', 'como estas')).toMatchObject({ correct: false });
    expect(grade('¿Cómo estás?', 'cómo estás')).toMatchObject({ correct: true, typo: false });
    expect(grade('ça va', 'ca va')).toMatchObject({ correct: false });
  });
});

describe('chino: sin asumir espacios entre palabras', () => {
  it('los espacios junto a caracteres Han no cuentan; la puntuación china = la latina', () => {
    expect(grade('我叫王明。', '我 叫 王明')).toMatchObject({ correct: true, typo: false });
    expect(grade('你好，我是学生。', '你好, 我是学生')).toMatchObject({ correct: true });
  });

  it('ordenar fichas en chino: las fichas unidas sin espacios son la misma frase', () => {
    expect(
      gradeWithSpec(
        order,
        { answer: '我是学生', accepted_answers: [], payload: null },
        tokens('我', '是', '学生'),
      ),
    ).toMatchObject({ correct: true, typo: false });
    expect(
      gradeWithSpec(
        order,
        { answer: '我是学生', accepted_answers: [], payload: null },
        tokens('是', '我', '学生'),
      ),
    ).toMatchObject({ correct: false });
  });

  it('pinyin: números de tono = marcas; sin tonos es otra respuesta', () => {
    expect(canonicalForm('ni3 hao3')).toBe(canonicalForm('nǐ hǎo'));
    expect(grade('nǐ hǎo', 'ni3 hao3')).toMatchObject({ correct: true });
    expect(grade('nǐ hǎo', 'ni hao')).toMatchObject({ correct: false });
    expect(grade('lǜ', 'lv4')).toMatchObject({ correct: true });
  });

  it('un carácter distinto nunca es tipeo en una respuesta corta', () => {
    expect(grade('我是学生', '我是学王')).toMatchObject({ correct: false });
  });
});

describe('respuestas alternativas (accepted_answers)', () => {
  it('cualquier alternativa aceptada vale, con la misma normalización', () => {
    expect(grade('Mi chiamo Luca.', 'mi chamo luca', ['Sono Luca.'])).toMatchObject({
      correct: true,
      typo: true,
    });
    expect(grade('Mi chiamo Luca.', 'Sono Luca!', ['Sono Luca.'])).toMatchObject({
      correct: true,
      typo: false,
    });
    expect(grade('Mi chiamo Luca.', 'Io sono Luca', ['Sono Luca.'])).toMatchObject({
      correct: false,
    });
  });
});
