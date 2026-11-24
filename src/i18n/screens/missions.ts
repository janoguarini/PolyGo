import { defineStrings } from '..';

/** Misiones y recompensa diaria (src/app/missions.tsx). */
export const missionsScreenStrings = defineStrings({
  es: {
    loading: 'Cargando misiones…',
    title: 'Recompensa diaria',
    today: 'MISIONES DE HOY',
    resetHint: 'Las misiones cambian todos los días a la medianoche.',
    missionA11y: (title: string, progress: number, target: number, done: boolean, polys: number) =>
      `${title}: ${progress} de ${target}${done ? ', completa' : ''}. Da ${polys} Polys`,
  },
  en: {
    loading: 'Loading missions…',
    title: 'Daily reward',
    today: 'TODAY’S MISSIONS',
    resetHint: 'Missions change every day at midnight.',
    missionA11y: (title: string, progress: number, target: number, done: boolean, polys: number) =>
      `${title}: ${progress} of ${target}${done ? ', complete' : ''}. Earns ${polys} Polys`,
  },
});
