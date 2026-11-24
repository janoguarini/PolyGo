import { defineStrings } from '..';
import { languageName } from '../languages';

type ReviewMode = 'review' | 'practice' | 'mistakes' | 'smart' | 'topic';

/** Repasos y práctica (src/app/review.tsx). */
export const reviewStrings = defineStrings({
  es: {
    titles: {
      review: 'Repaso de vocabulario',
      practice: 'Práctica libre',
      mistakes: 'Tus puntos débiles',
      smart: 'Repaso inteligente',
      topic: 'Repaso por tema',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} es de PolyGo Plus`,
    topicUpsell:
      'Repasá sólo las palabras de la unidad que elijas. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.',
    smartUpsell:
      'Arma cada sesión con tus errores frecuentes, las palabras que te cuestan y las que estás por olvidar. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.',
    discoverPlus: 'Conocé PolyGo Plus',
    back: 'Volver',
    verifyError: 'No pudimos verificar tu suscripción.',
    preparing: 'Preparando repaso…',
    previousSaveError:
      'No pudimos guardar tu repaso anterior. Sus respuestas no se pierden: podés reintentar.',
    prepareError:
      'No pudimos preparar el repaso. Lo que ya respondiste no se pierde: podés reintentar.',
    unavailableTitle: 'Repasos en preparación',
    unavailableMessage: (code: string) =>
      `Todavía no hay ejercicios de repaso para ${languageName(code, 'es')}. Tu progreso en este idioma se guarda igual; los repasos llegan cuando su contenido esté publicado.`,
    exhaustedTitle: 'Ya repasaste lo de hoy',
    nothingToReview: 'Nada para repasar',
    upToDate: 'Estás al día',
    exhaustedMessage: 'Cubriste tu meta diaria de repasos. Lo que falta vuelve mañana, en orden.',
    smartEmpty:
      'No hay palabras vencidas, con errores frecuentes ni por olvidar. Completá lecciones y volvé más tarde.',
    topicEmpty: 'Todavía no hay palabras de esta unidad para repasar.',
    reviewEmpty:
      'No tenés nada para repasar ahora. Lo que estudies volverá cuando toque repasarlo.',
    exitReviewTitle: '¿Salir del repaso?',
    exitReviewMessage:
      'Las respuestas que ya comprobaste quedan guardadas: podés retomar este repaso hoy.',
    stay: 'Seguir',
    leave: 'Salir',
    done: 'Listo',
    strugglingOverline: 'TE ESTÁ COSTANDO',
    strugglingBody:
      'Estas palabras se te resisten. Volver a la explicación de la lección suele ayudar.',
    seeExplanation: (word: string) => 'Ver la explicación · ' + word,
    preparingPractice: 'Preparando práctica…',
    practiceError: 'No pudimos preparar la práctica.',
    nothingToPractice: 'Nada para practicar',
    nothingToPracticeMessage: 'Completá lecciones para sumar palabras a tu práctica.',
    exitPracticeTitle: '¿Salir de la práctica?',
    exitPracticeMessage: 'Podés volver cuando quieras.',
    practiceMistakesHint:
      'Esta práctica no cambia tus repasos: seguí con el repaso espaciado para fijarlas.',
  },
  en: {
    titles: {
      review: 'Vocabulary review',
      practice: 'Free practice',
      mistakes: 'Your weak spots',
      smart: 'Smart review',
      topic: 'Review by topic',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} is part of PolyGo Plus`,
    topicUpsell:
      'Review only the words from the unit you choose. Spaced review, free practice and your weak spots stay free.',
    smartUpsell:
      'Build each session from your frequent mistakes, the words you find hard and the ones you’re about to forget. Spaced review, free practice and your weak spots stay free.',
    discoverPlus: 'Discover PolyGo Plus',
    back: 'Back',
    verifyError: 'We couldn’t verify your subscription.',
    preparing: 'Getting your review ready…',
    previousSaveError:
      'We couldn’t save your previous review. Its answers aren’t lost. You can try again.',
    prepareError:
      'We couldn’t prepare the review. What you’ve already answered isn’t lost. You can try again.',
    unavailableTitle: 'Reviews coming soon',
    unavailableMessage: (code: string) =>
      `There are no review exercises for ${languageName(code, 'en')} yet. Your progress in this language is still saved, and reviews will arrive once their content is published.`,
    exhaustedTitle: 'You’ve done today’s reviews',
    nothingToReview: 'Nothing to review',
    upToDate: 'You’re all caught up',
    exhaustedMessage: 'You hit your daily review goal. The rest comes back tomorrow, in order.',
    smartEmpty:
      'No words are due, frequently missed or about to be forgotten. Complete lessons and come back later.',
    topicEmpty: 'There are no words from this unit to review yet.',
    reviewEmpty:
      'You have nothing to review right now. What you study will come back when it’s time to review it.',
    exitReviewTitle: 'Leave the review?',
    exitReviewMessage:
      'Answers you’ve already checked are saved. You can pick this review back up today.',
    stay: 'Keep going',
    leave: 'Leave',
    done: 'Done',
    strugglingOverline: 'GIVING YOU TROUBLE',
    strugglingBody:
      'These words are giving you trouble. Going back to the lesson explanation usually helps.',
    seeExplanation: (word: string) => 'See the explanation · ' + word,
    preparingPractice: 'Getting your practice ready…',
    practiceError: 'We couldn’t prepare the practice.',
    nothingToPractice: 'Nothing to practice',
    nothingToPracticeMessage: 'Complete lessons to add words to your practice.',
    exitPracticeTitle: 'Leave practice?',
    exitPracticeMessage: 'You can come back anytime.',
    practiceMistakesHint:
      'This practice doesn’t change your reviews. Keep up your spaced review to make them stick.',
  },
});

/** Repaso por tema (src/app/review-topics.tsx). */
export const reviewTopicsStrings = defineStrings({
  es: {
    title: 'Repaso por tema',
    loading: 'Buscando tus temas…',
    verifyError: 'No pudimos verificar tu suscripción.',
    plusTitle: 'Repaso por tema es de PolyGo Plus',
    plusMessage:
      'Elegí una unidad que ya estudiaste y repasá sólo sus palabras, empezando por las que te tocan y las que más te costaron. El repaso espaciado y la práctica libre siguen siendo gratis.',
    discoverPlus: 'Conocé PolyGo Plus',
    loadError: 'No pudimos cargar tus temas.',
    emptyTitle: 'Todavía no hay temas',
    emptyMessage:
      'Completá lecciones: cada unidad en la que estudies palabras aparece acá para repasarla.',
    goToPath: 'Ir a mi camino',
    intro:
      'Hasta 15 palabras del tema: primero las que te tocan repasar y las que más te costaron. Cuenta para tu repaso espaciado y no usa energía.',
    level: (level: string) => `NIVEL ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'palabra' : 'palabras'}`,
    due: (n: number) => `${n} para repasar`,
    withMistakes: (n: number) => `${n} con errores`,
  },
  en: {
    title: 'Review by topic',
    loading: 'Finding your topics…',
    verifyError: 'We couldn’t verify your subscription.',
    plusTitle: 'Review by topic is part of PolyGo Plus',
    plusMessage:
      'Choose a unit you’ve already studied and review only its words, starting with the ones that are due and the ones you found hardest. Spaced review and free practice stay free.',
    discoverPlus: 'Discover PolyGo Plus',
    loadError: 'We couldn’t load your topics.',
    emptyTitle: 'No topics yet',
    emptyMessage: 'Complete lessons: every unit where you study words shows up here for review.',
    goToPath: 'Go to my path',
    intro:
      'Up to 15 words from the topic: first the ones due for review and the ones you found hardest. It counts toward your spaced review and doesn’t use energy.',
    level: (level: string) => `LEVEL ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'word' : 'words'}`,
    due: (n: number) => `${n} to review`,
    withMistakes: (n: number) => `${n} with mistakes`,
  },
});
