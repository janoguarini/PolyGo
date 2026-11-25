import { defineStrings } from '@/i18n';

/** Tutorial guiado (AppTour). */
export const tourStrings = defineStrings({
  es: {
    intro: {
      title: '¡Hola!',
      body: 'Te muestro cómo funciona Polygo en menos de un minuto.',
    },
    lesson: {
      title: 'Tu próxima lección',
      body: 'Tocala para empezar. Sin errores ganás 3 estrellas y el círculo queda dorado.',
    },
    stats: {
      title: 'Energía, Polys y racha',
      body: 'Cada lección usa energía, ganás Polys para la tienda y tu racha crece si practicás todos los días.',
    },
    review: {
      title: '¿Se te olvidó una palabra?',
      body: 'Acá repasás lo que ya aprendiste justo antes de olvidarlo. Unos minutos por día alcanzan.',
    },
    ranked: {
      title: 'Ranked',
      body: 'Partidas de 60 segundos contra otros jugadores. Ganá ELO y subí de Bronce hasta la cima.',
    },
    done: {
      title: '¡Todo listo!',
      body: 'Hacé tu primera lección y arrancá tu racha hoy.',
    },
    step: (n: number, total: number) => `${n} DE ${total}`,
    stepA11y: (n: number, total: number) => `Paso ${n} de ${total}`,
    skip: 'Saltar',
    next: 'Siguiente',
    start: '¡Empezar!',
    finish: '¡A jugar!',
  },
  en: {
    intro: {
      title: 'Hi there!',
      body: 'Let me show you how Polygo works in under a minute.',
    },
    lesson: {
      title: 'Your next lesson',
      body: 'Tap it to start. No mistakes earns 3 stars and turns the circle gold.',
    },
    stats: {
      title: 'Energy, Polys and streak',
      body: 'Each lesson uses energy, you earn Polys for the shop, and your streak grows when you practice every day.',
    },
    review: {
      title: 'Forgot a word?',
      body: 'Review what you learned right before you forget it. A few minutes a day is enough.',
    },
    ranked: {
      title: 'Ranked',
      body: '60-second matches against other players. Earn ELO and climb from Bronze to the top.',
    },
    done: {
      title: 'All set!',
      body: 'Do your first lesson and start your streak today.',
    },
    step: (n: number, total: number) => `${n} OF ${total}`,
    stepA11y: (n: number, total: number) => `Step ${n} of ${total}`,
    skip: 'Skip',
    next: 'Next',
    start: 'Let’s go!',
    finish: 'Let’s play!',
  },
});
