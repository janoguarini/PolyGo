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
  'pt-BR': {
    loading: 'Carregando missões…',
    title: 'Recompensa diária',
    today: 'MISSÕES DE HOJE',
    resetHint: 'As missões mudam todos os dias à meia-noite.',
    missionA11y: (title: string, progress: number, target: number, done: boolean, polys: number) =>
      `${title}: ${progress} de ${target}${done ? ', concluída' : ''}. Dá ${polys} Polys`,
  },
  it: {
    loading: 'Caricamento missioni…',
    title: 'Ricompensa giornaliera',
    today: 'MISSIONI DI OGGI',
    resetHint: 'Le missioni cambiano ogni giorno a mezzanotte.',
    missionA11y: (title: string, progress: number, target: number, done: boolean, polys: number) =>
      `${title}: ${progress} su ${target}${done ? ', completata' : ''}. Dà ${polys} Polys`,
  },
  fr: {
    loading: 'Chargement des missions…',
    title: 'Récompense du jour',
    today: 'MISSIONS DU JOUR',
    resetHint: 'Les missions changent tous les jours à minuit.',
    missionA11y: (title: string, progress: number, target: number, done: boolean, polys: number) =>
      `${title} : ${progress} sur ${target}${done ? ', terminée' : ''}. Rapporte ${polys} Polys`,
  },
});
