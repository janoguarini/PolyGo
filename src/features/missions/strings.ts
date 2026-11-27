import { missionTitle, type MissionId } from '@shared/missions';

import { defineStrings } from '@/i18n';

const s = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Títulos en inglés por id de misión (shared/missions.ts queda en español: lo replica la base). */
function missionTitleEn(id: MissionId, target: number): string {
  switch (id) {
    case 'lessons':
      return `Complete ${target} ${s(target, 'lesson', 'lessons')}`;
    case 'minutes':
      return `Study for ${target} minutes`;
    case 'correct':
      return `Get ${target} answers right`;
    case 'perfect':
      return 'Finish a lesson with no mistakes';
    case 'ranked_play':
      return `Play ${target} ranked ${s(target, 'match', 'matches')}`;
    case 'ranked_win':
      return 'Win a ranked match';
  }
}

/** Títulos en portugués (Brasil) por id de misión. */
function missionTitlePt(id: MissionId, target: number): string {
  switch (id) {
    case 'lessons':
      return `Complete ${target} ${s(target, 'lição', 'lições')}`;
    case 'minutes':
      return `Estude por ${target} minutos`;
    case 'correct':
      return `Acerte ${target} respostas`;
    case 'perfect':
      return 'Termine uma lição sem erros';
    case 'ranked_play':
      return `Jogue ${target} ${s(target, 'partida', 'partidas')} Ranked`;
    case 'ranked_win':
      return 'Vença uma partida Ranked';
  }
}

/** Títulos en italiano por id de misión. */
function missionTitleIt(id: MissionId, target: number): string {
  switch (id) {
    case 'lessons':
      return `Completa ${target} ${s(target, 'lezione', 'lezioni')}`;
    case 'minutes':
      return `Studia per ${target} minuti`;
    case 'correct':
      return `Dai ${target} risposte corrette`;
    case 'perfect':
      return 'Finisci una lezione senza errori';
    case 'ranked_play':
      return `Gioca ${target} ${s(target, 'partita', 'partite')} Ranked`;
    case 'ranked_win':
      return 'Vinci una partita Ranked';
  }
}

export const missionStrings = defineStrings({
  es: {
    title: (id: MissionId, target: number) => missionTitle(id, target),
  },
  en: {
    title: (id: MissionId, target: number) => missionTitleEn(id, target),
  },
  'pt-BR': {
    title: (id: MissionId, target: number) => missionTitlePt(id, target),
  },
  it: {
    title: (id: MissionId, target: number) => missionTitleIt(id, target),
  },
});

/** Cofre del día y semana (DailyRewardCard). Los días van de lunes a domingo. */
export const dailyRewardStrings = defineStrings({
  es: {
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    intro: (total: number, days: number, bonus: number) =>
      `Completa las ${total} misiones y abre el cofre del día.\nÁbrelo ${days} días de la semana y gana ${bonus} Polys extra.`,
    weekA11y: (opened: number) => `Cofres de esta semana: ${opened} abiertos`,
    dayA11y: (day: string, today: boolean, open: boolean, polys: number | null, past: boolean) =>
      `${day}${today ? ', hoy' : ''}: ${
        open ? `cofre abierto, ${polys} Polys` : past ? 'sin abrir' : 'cofre de 10 a 20 Polys'
      }`,
    weekError: 'No pudimos cargar tu semana. El cofre de hoy se puede abrir igual.',
    weeklyClaimed: (bonus: number) => `Bonus semanal cobrado: +${bonus} Polys`,
    weeklyProgress: (opened: number, days: number) => `Bonus semanal: ${opened}/${days} cofres`,
    weeklyA11y: 'Progreso del bonus semanal',
    jackpot: '¡Cofre de la suerte!',
    includesWeekly: (bonus: number) => `Incluye el bonus semanal (+${bonus})`,
    opened: '¡Cofre abierto!',
    alreadyOpened: 'Ya abriste el cofre de hoy. ¡Mañana hay misiones nuevas!',
    claim: 'Reclamar recompensa',
    completeMissions: (done: number, total: number) => `Completa las misiones · ${done}/${total}`,
  },
  en: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    intro: (total: number, days: number, bonus: number) =>
      `Complete all ${total} missions and open today’s chest.\nOpen it ${days} days this week to earn ${bonus} extra Polys.`,
    weekA11y: (opened: number) => `Chests this week: ${opened} opened`,
    dayA11y: (day: string, today: boolean, open: boolean, polys: number | null, past: boolean) =>
      `${day}${today ? ', today' : ''}: ${
        open ? `chest opened, ${polys} Polys` : past ? 'not opened' : '10 to 20 Polys chest'
      }`,
    weekError: 'We couldn’t load your week. You can still open today’s chest.',
    weeklyClaimed: (bonus: number) => `Weekly bonus claimed: +${bonus} Polys`,
    weeklyProgress: (opened: number, days: number) => `Weekly bonus: ${opened}/${days} chests`,
    weeklyA11y: 'Weekly bonus progress',
    jackpot: 'Lucky chest!',
    includesWeekly: (bonus: number) => `Includes the weekly bonus (+${bonus})`,
    opened: 'Chest opened!',
    alreadyOpened: 'You already opened today’s chest. New missions tomorrow!',
    claim: 'Claim reward',
    completeMissions: (done: number, total: number) => `Complete the missions · ${done}/${total}`,
  },
  'pt-BR': {
    days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    intro: (total: number, days: number, bonus: number) =>
      `Complete as ${total} missões e abra o baú do dia.\nAbra ${days} dias na semana e ganhe ${bonus} Polys extras.`,
    weekA11y: (opened: number) => `Baús desta semana: ${opened} abertos`,
    dayA11y: (day: string, today: boolean, open: boolean, polys: number | null, past: boolean) =>
      `${day}${today ? ', hoje' : ''}: ${
        open ? `baú aberto, ${polys} Polys` : past ? 'não aberto' : 'baú de 10 a 20 Polys'
      }`,
    weekError: 'Não conseguimos carregar sua semana. Você ainda pode abrir o baú de hoje.',
    weeklyClaimed: (bonus: number) => `Bônus semanal resgatado: +${bonus} Polys`,
    weeklyProgress: (opened: number, days: number) => `Bônus semanal: ${opened}/${days} baús`,
    weeklyA11y: 'Progresso do bônus semanal',
    jackpot: 'Baú da sorte!',
    includesWeekly: (bonus: number) => `Inclui o bônus semanal (+${bonus})`,
    opened: 'Baú aberto!',
    alreadyOpened: 'Você já abriu o baú de hoje. Amanhã tem missões novas!',
    claim: 'Resgatar recompensa',
    completeMissions: (done: number, total: number) => `Complete as missões · ${done}/${total}`,
  },
  it: {
    days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    intro: (total: number, days: number, bonus: number) =>
      `Completa tutte le ${total} missioni e apri il forziere del giorno.\nAprilo ${days} giorni a settimana e ottieni ${bonus} Polys extra.`,
    weekA11y: (opened: number) => `Forzieri di questa settimana: ${opened} aperti`,
    dayA11y: (day: string, today: boolean, open: boolean, polys: number | null, past: boolean) =>
      `${day}${today ? ', oggi' : ''}: ${
        open ? `forziere aperto, ${polys} Polys` : past ? 'non aperto' : 'forziere da 10 a 20 Polys'
      }`,
    weekError:
      'Non siamo riusciti a caricare la tua settimana. Puoi comunque aprire il forziere di oggi.',
    weeklyClaimed: (bonus: number) => `Bonus settimanale riscattato: +${bonus} Polys`,
    weeklyProgress: (opened: number, days: number) =>
      `Bonus settimanale: ${opened}/${days} forzieri`,
    weeklyA11y: 'Progressi del bonus settimanale',
    jackpot: 'Forziere fortunato!',
    includesWeekly: (bonus: number) => `Include il bonus settimanale (+${bonus})`,
    opened: 'Forziere aperto!',
    alreadyOpened: 'Hai già aperto il forziere di oggi. Domani ci sono nuove missioni!',
    claim: 'Riscatta ricompensa',
    completeMissions: (done: number, total: number) => `Completa le missioni · ${done}/${total}`,
  },
});
