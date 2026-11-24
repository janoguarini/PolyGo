import { defineStrings } from '..';

/** Aprender: el mapa de inicio (src/app/(tabs)/index.tsx). */
export const learnStrings = defineStrings({
  es: {
    loading: 'Cargando tu camino…',
    studying: (name: string, beta: boolean) => `Estudiando ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Abre tus cursos para ver tu progreso o cambiar de curso',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `Racha de ${streak} días${activeToday ? '' : ', todavía no estudiaste hoy'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'protector' : 'protectores'}` : ''
      }`,
    lostStreakA11y: (days: string) => `Perdiste tu racha de ${days}. Recuperala en la tienda.`,
    lostStreak: (days: string) => `Perdiste tu racha de ${days}`,
    recoverable: 'Todavía la podés recuperar con Polys.',
    missionsA11y: 'Completaste las misiones del día. Abrí tu cofre de Polys.',
    missionsDone: '¡Misiones completas!',
    openChest: 'Abrí tu cofre y ganá Polys.',
    goToLesson: 'Ir a mi lección actual',
    myLesson: 'Mi lección',
    noUnits: 'Todavía no hay unidades publicadas',
    cefr: 'El contenido sigue el MCER como referencia; completarlo no equivale a una certificación oficial.',
  },
  en: {
    loading: 'Loading your path…',
    studying: (name: string, beta: boolean) => `Studying ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Opens your courses to see your progress or switch courses',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `${streak}-day streak${activeToday ? '' : ', you haven’t studied today yet'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'streak freeze' : 'streak freezes'}` : ''
      }`,
    lostStreakA11y: (days: string) => `You lost a streak of ${days}. Get it back in the shop.`,
    lostStreak: (days: string) => `You lost a streak of ${days}`,
    recoverable: 'You can still get it back with Polys.',
    missionsA11y: 'You completed today’s missions. Open your Polys chest.',
    missionsDone: 'Missions complete!',
    openChest: 'Open your chest and earn Polys.',
    goToLesson: 'Go to my current lesson',
    myLesson: 'My lesson',
    noUnits: 'No units published yet',
    cefr: 'The content uses the CEFR as a reference. Completing it isn’t an official certification.',
  },
});
