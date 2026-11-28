/**
 * Ranked compartido entre cursos del mismo idioma (docs/RANKED_SHARED_POOL.md).
 *
 * Una partida se arma con el contenido del curso CANÓNICO del idioma (el por defecto: en-from-es para el
 * inglés): mismo inglés, mismo orden, misma respuesta para todos. A cada palabra y frase canónica se le
 * agregan (`support`) los textos de apoyo de los cursos de los otros asientos, cruzando por el inglés:
 *   · palabras: mismo `text` (sin mayúsculas ni espacios de más), prefiriendo la de la misma posición
 *     curricular (a1-u03 ↔ ept-a1-u03) cuando el texto se repite;
 *   · frases: mismo id (las del banco de Word Rush son las mismas filas) o, en las de lecciones, misma
 *     respuesta (canonicalForm).
 * Lo que no se encuentra queda sin `support` para ese curso: ese asiento ve el texto canónico, y quien
 * llama lo registra (`missing`).
 *
 * Funciones puras: sin Supabase ni reloj.
 */
import { canonicalForm } from '../../shared/answers';
import type { ArcadeSentence } from '../../shared/arcade';
import type { RushWord } from '../../shared/wordRush';
import type { CourseInfo, PlayerInfo } from './types';

/** Posición curricular de una unidad, sin el prefijo de idioma o curso: 'ept-a1-u03' → 'a1-u03'. */
export function unitKey(unitId: string | null | undefined): string | null {
  const match = /^(?:[a-z]{2,3}-)?([a-z]\d-u\d+)$/i.exec(unitId ?? '');
  return match ? match[1]!.toLowerCase() : null;
}

const wordKey = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

const addSupport = <T extends { support?: Readonly<Record<string, string>> }>(
  item: T,
  course: string,
  text: string,
): T => ({ ...item, support: { ...item.support, [course]: text } });

/**
 * Agrega a cada palabra canónica la traducción del curso `course` (ver cabecera). `missing` = ids
 * canónicos sin traducción en ese curso.
 */
export function withWordSupport(
  canonical: readonly RushWord[],
  course: string,
  courseWords: readonly RushWord[],
): { words: RushWord[]; missing: string[] } {
  const byText = new Map<string, RushWord>();
  const byTextAndUnit = new Map<string, RushWord>();
  // Orden estable (por id) para que dos cargas iguales den lo mismo.
  for (const w of [...courseWords].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
    if (!w.translationEs?.trim()) continue;
    const key = wordKey(w.text);
    if (!byText.has(key)) byText.set(key, w);
    const unit = unitKey(w.unitId);
    if (unit && !byTextAndUnit.has(`${key}|${unit}`)) byTextAndUnit.set(`${key}|${unit}`, w);
  }
  const missing: string[] = [];
  const words = canonical.map((w) => {
    const key = wordKey(w.text);
    const match = byTextAndUnit.get(`${key}|${unitKey(w.unitId)}`) ?? byText.get(key);
    if (!match) {
      missing.push(w.id);
      return w;
    }
    return addSupport(w, course, match.translationEs);
  });
  return { words, missing };
}

/**
 * Agrega a cada frase canónica la consigna del curso `course` (ver cabecera). `missing` = ids canónicos
 * sin consigna en ese curso.
 */
export function withSentenceSupport(
  canonical: readonly ArcadeSentence[],
  course: string,
  courseSentences: readonly ArcadeSentence[],
): { sentences: ArcadeSentence[]; missing: string[] } {
  const byId = new Map<string, ArcadeSentence>();
  const byAnswer = new Map<string, ArcadeSentence>();
  for (const s of courseSentences) {
    if (!s.translation?.trim()) continue;
    if (!byId.has(s.id)) byId.set(s.id, s);
    const key = canonicalForm(s.answer);
    if (key && !byAnswer.has(key)) byAnswer.set(key, s);
  }
  const missing: string[] = [];
  const sentences = canonical.map((s) => {
    const match = byId.get(s.id) ?? byAnswer.get(canonicalForm(s.answer));
    if (!match) {
      missing.push(s.id);
      return s;
    }
    return addSupport(s, course, match.translation);
  });
  return { sentences, missing };
}

/** El curso canónico de un idioma (el por defecto), o null si el catálogo no lo tiene. */
export function canonicalCourse(
  catalog: readonly CourseInfo[] | null,
  languageCode: string,
): CourseInfo | null {
  return catalog?.find((c) => c.targetLanguage === languageCode && c.isDefault) ?? null;
}

/**
 * Curso de apoyo de un asiento: el suyo si es un curso conocido de ese idioma y no es el canónico;
 * null = textos canónicos (el curso canónico, bots, catálogo sin leer o curso desconocido).
 */
export function seatCourse(
  catalog: readonly CourseInfo[] | null,
  languageCode: string,
  player: Pick<PlayerInfo, 'courseCode' | 'isBot'>,
): CourseInfo | null {
  if (player.isBot || !player.courseCode || !catalog) return null;
  const course = catalog.find(
    (c) => c.code === player.courseCode && c.targetLanguage === languageCode,
  );
  return course && !course.isDefault ? course : null;
}
