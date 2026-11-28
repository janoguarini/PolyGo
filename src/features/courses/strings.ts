import { defineStrings } from '@/i18n';

import type { SourceLanguage } from '@shared/courses';

/**
 * Selector de cursos agrupado por idioma de origen (CoursePicker): registro y «Agregar curso» en «Tus
 * cursos». Los títulos de sección son fijos por origen (en francés, «hispanophones», «lusophones»…).
 */
export const coursePickerStrings = defineStrings({
  es: {
    section: {
      es: 'Idiomas para hablantes de español',
      en: 'Idiomas para hablantes de inglés',
      pt: 'Idiomas para hablantes de portugués',
      it: 'Idiomas para hablantes de italiano',
      fr: 'Idiomas para hablantes de francés',
    } satisfies Record<SourceLanguage, string>,
    courseCount: (n: number) => (n === 1 ? '1 curso' : `${n} cursos`),
    mine: 'Ya lo estudias',
    active: 'Curso actual',
    sectionA11y: (title: string, n: number) => `${title}, ${n === 1 ? '1 curso' : `${n} cursos`}`,
    courseA11y: (target: string, levels: string, mine: boolean) =>
      mine ? `${target}, ${levels}, ya lo estudias` : `${target}, ${levels}`,
    expandHint: 'Muestra u oculta los cursos de este idioma.',
    addCourse: 'Agregar curso',
    addCourseHint: 'Muestra todos los cursos, agrupados por el idioma que hablas.',
  },
  en: {
    section: {
      es: 'For Spanish speakers',
      en: 'For English speakers',
      pt: 'For Portuguese speakers',
      it: 'For Italian speakers',
      fr: 'For French speakers',
    } satisfies Record<SourceLanguage, string>,
    courseCount: (n: number) => (n === 1 ? '1 course' : `${n} courses`),
    mine: 'Already learning',
    active: 'Current course',
    sectionA11y: (title: string, n: number) => `${title}, ${n === 1 ? '1 course' : `${n} courses`}`,
    courseA11y: (target: string, levels: string, mine: boolean) =>
      mine ? `${target}, ${levels}, already learning` : `${target}, ${levels}`,
    expandHint: 'Shows or hides the courses for this language.',
    addCourse: 'Add a course',
    addCourseHint: 'Shows every course, grouped by the language you speak.',
  },
  'pt-BR': {
    section: {
      es: 'Para quem fala espanhol',
      en: 'Para quem fala inglês',
      pt: 'Para quem fala português',
      it: 'Para quem fala italiano',
      fr: 'Para quem fala francês',
    } satisfies Record<SourceLanguage, string>,
    courseCount: (n: number) => (n === 1 ? '1 curso' : `${n} cursos`),
    mine: 'Você já estuda',
    active: 'Curso atual',
    sectionA11y: (title: string, n: number) => `${title}, ${n === 1 ? '1 curso' : `${n} cursos`}`,
    courseA11y: (target: string, levels: string, mine: boolean) =>
      mine ? `${target}, ${levels}, você já estuda` : `${target}, ${levels}`,
    expandHint: 'Mostra ou esconde os cursos deste idioma.',
    addCourse: 'Adicionar curso',
    addCourseHint: 'Mostra todos os cursos, agrupados pelo idioma que você fala.',
  },
  it: {
    section: {
      es: 'Per chi parla spagnolo',
      en: 'Per chi parla inglese',
      pt: 'Per chi parla portoghese',
      it: 'Per chi parla italiano',
      fr: 'Per chi parla francese',
    } satisfies Record<SourceLanguage, string>,
    courseCount: (n: number) => (n === 1 ? '1 corso' : `${n} corsi`),
    mine: 'Lo stai già studiando',
    active: 'Corso attuale',
    sectionA11y: (title: string, n: number) => `${title}, ${n === 1 ? '1 corso' : `${n} corsi`}`,
    courseA11y: (target: string, levels: string, mine: boolean) =>
      mine ? `${target}, ${levels}, lo stai già studiando` : `${target}, ${levels}`,
    expandHint: 'Mostra o nasconde i corsi di questa lingua.',
    addCourse: 'Aggiungi un corso',
    addCourseHint: 'Mostra tutti i corsi, raggruppati per la lingua che parli.',
  },
  fr: {
    section: {
      es: 'Pour les hispanophones',
      en: 'Pour les anglophones',
      pt: 'Pour les lusophones',
      it: 'Pour les italophones',
      fr: 'Pour les francophones',
    } satisfies Record<SourceLanguage, string>,
    courseCount: (n: number) => (n === 1 ? '1 cours' : `${n} cours`),
    mine: 'Tu l’apprends déjà',
    active: 'Cours actuel',
    sectionA11y: (title: string, n: number) => `${title}, ${n} cours`,
    courseA11y: (target: string, levels: string, mine: boolean) =>
      mine ? `${target}, ${levels}, tu l’apprends déjà` : `${target}, ${levels}`,
    expandHint: 'Affiche ou masque les cours de cette langue.',
    addCourse: 'Ajouter un cours',
    addCourseHint: 'Affiche tous les cours, regroupés selon la langue que tu parles.',
  },
});
