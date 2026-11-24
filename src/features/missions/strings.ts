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

export const missionStrings = defineStrings({
  es: {
    title: (id: MissionId, target: number) => missionTitle(id, target),
  },
  en: {
    title: (id: MissionId, target: number) => missionTitleEn(id, target),
  },
});

/** Cofre del día y semana (DailyRewardCard). Los días van de lunes a domingo. */
export const dailyRewardStrings = defineStrings({
  es: {
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    intro: (total: number, days: number, bonus: number) =>
      `Completá las ${total} misiones y abrí el cofre del día.\nAbrilo ${days} días de la semana y ganás ${bonus} Polys extra.`,
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
    completeMissions: (done: number, total: number) => `Completá las misiones · ${done}/${total}`,
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
});
