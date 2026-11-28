import { defineStrings } from '..';

/** Aprender: el mapa de inicio (src/app/(tabs)/index.tsx). */
export const learnStrings = defineStrings({
  es: {
    loading: 'Cargando tu camino…',
    studying: (name: string, beta: boolean) => `Estudiando ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Muestra tus idiomas para cambiar de curso o agregar otro',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `Racha de ${streak} días${activeToday ? '' : ', todavía no estudiaste hoy'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'protector' : 'protectores'}` : ''
      }`,
    lostStreakA11y: (days: string) => `Perdiste tu racha de ${days}. Recupérala en la tienda.`,
    lostStreak: (days: string) => `Perdiste tu racha de ${days}`,
    recoverable: 'Todavía puedes recuperarla con Polys.',
    missionsA11y: 'Completaste las misiones del día. Abre tu cofre de Polys.',
    missionsDone: '¡Misiones completas!',
    openChest: 'Abre tu cofre y gana Polys.',
    goToLesson: 'Ir a mi lección actual',
    myLesson: 'Mi lección',
    noUnits: 'Todavía no hay unidades publicadas',
    cefr: 'El contenido sigue el MCER como referencia; completarlo no equivale a una certificación oficial.',
  },
  en: {
    loading: 'Loading your path…',
    studying: (name: string, beta: boolean) => `Studying ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Shows your languages to switch courses or add another one',
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
  'pt-BR': {
    loading: 'Carregando sua trilha…',
    studying: (name: string, beta: boolean) => `Estudando ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Mostra seus idiomas para trocar de curso ou adicionar outro',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `Sequência de ${streak} dias${activeToday ? '' : ', você ainda não estudou hoje'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'protetor' : 'protetores'}` : ''
      }`,
    lostStreakA11y: (days: string) => `Você perdeu sua sequência de ${days}. Recupere-a na loja.`,
    lostStreak: (days: string) => `Você perdeu sua sequência de ${days}`,
    recoverable: 'Você ainda pode recuperá-la com Polys.',
    missionsA11y: 'Você completou as missões do dia. Abra seu baú de Polys.',
    missionsDone: 'Missões completas!',
    openChest: 'Abra seu baú e ganhe Polys.',
    goToLesson: 'Ir para minha lição atual',
    myLesson: 'Minha lição',
    noUnits: 'Ainda não há unidades publicadas',
    cefr: 'O conteúdo usa o QECR como referência; concluí-lo não equivale a uma certificação oficial.',
  },
  it: {
    loading: 'Caricamento del tuo percorso…',
    studying: (name: string, beta: boolean) => `Stai studiando ${name}${beta ? ', beta' : ''}`,
    languagesHint: 'Mostra le tue lingue per cambiare corso o aggiungerne un’altra',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `Serie di ${streak} giorni${activeToday ? '' : ', oggi non hai ancora studiato'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'protezione' : 'protezioni'}` : ''
      }`,
    lostStreakA11y: (days: string) => `Hai perso la tua serie di ${days}. Recuperala nel negozio.`,
    lostStreak: (days: string) => `Hai perso la tua serie di ${days}`,
    recoverable: 'Puoi ancora recuperarla con i Polys.',
    missionsA11y: 'Hai completato le missioni del giorno. Apri il tuo forziere di Polys.',
    missionsDone: 'Missioni completate!',
    openChest: 'Apri il forziere e guadagna Polys.',
    goToLesson: 'Vai alla mia lezione attuale',
    myLesson: 'La mia lezione',
    noUnits: 'Non ci sono ancora unità pubblicate',
    cefr: 'Il contenuto usa il QCER come riferimento; completarlo non equivale a una certificazione ufficiale.',
  },
  fr: {
    loading: 'Chargement de ton parcours…',
    studying: (name: string, beta: boolean) => `Langue étudiée : ${name}${beta ? ', bêta' : ''}`,
    languagesHint: 'Affiche tes langues pour changer de cours ou en ajouter une autre',
    streakA11y: (streak: number, activeToday: boolean, freezes: number) =>
      `Série de ${streak} ${streak <= 1 ? 'jour' : 'jours'}${activeToday ? '' : ', tu n’as pas encore étudié aujourd’hui'}${
        freezes ? `, ${freezes} ${freezes === 1 ? 'protection' : 'protections'}` : ''
      }`,
    lostStreakA11y: (days: string) =>
      `Tu as perdu ta série de ${days}. Récupère-la dans la boutique.`,
    lostStreak: (days: string) => `Tu as perdu ta série de ${days}`,
    recoverable: 'Tu peux encore la récupérer avec des Polys.',
    missionsA11y: 'Tu as terminé les missions du jour. Ouvre ton coffre de Polys.',
    missionsDone: 'Missions terminées !',
    openChest: 'Ouvre ton coffre et gagne des Polys.',
    goToLesson: 'Aller à ma leçon actuelle',
    myLesson: 'Ma leçon',
    noUnits: 'Aucune unité publiée pour l’instant',
    cefr: 'Le contenu s’appuie sur le CECRL comme référence ; le terminer n’équivaut pas à une certification officielle.',
  },
});
