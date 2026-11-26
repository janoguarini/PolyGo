// Texto del aviso de desafío (sin dependencias: lo usa la Edge Function y lo prueba Jest).
// Llamativo y con datos reales: la bandera del idioma del duelo y el historial entre los dos.
// `variant` viaja en el aviso para medir en PostHog qué texto se abre más.

export interface ChallengeContext {
  host: string;
  languageCode?: string | null;
  h2h?: { host_wins: number; invitee_wins: number } | null;
}

export interface ChallengeMessage {
  title: string;
  body: string;
  variant: string;
}

const FLAGS: Record<string, string> = {
  en: '🇺🇸',
  it: '🇮🇹',
  pt: '🇧🇷',
  zh: '🇨🇳',
  fr: '🇫🇷',
  es: '🇪🇸',
};

/** Duración del duelo: la misma que Ranked (shared/arcade.ts, ARCADE.durationMs). */
const SECONDS = 60;

/**
 * `pick` (0 o 1) elige entre dos textos cuando no hay historial: la prueba A/B. El curso de español
 * se estudia desde el inglés: a esos jugadores se les escribe en inglés.
 */
export function challengeMessage(ctx: ChallengeContext, pick: 0 | 1): ChallengeMessage {
  const host = `@${ctx.host}`;
  const flag = FLAGS[ctx.languageCode ?? ''] ?? '⚔️';
  const hw = ctx.h2h?.host_wins ?? 0;
  const iw = ctx.h2h?.invitee_wins ?? 0;
  const en = ctx.languageCode === 'es';

  if (hw + iw > 0) {
    if (iw > hw) {
      return en
        ? {
            title: `😤 ${host} wants a rematch`,
            body: `You lead ${iw}–${hw}. Defend your title! 🏆`,
            variant: 'h2h_lead',
          }
        : {
            title: `😤 ${host} quiere la revancha`,
            body: `Le ganás ${iw}–${hw}. ¿Defendés el título? 🏆`,
            variant: 'h2h_lead',
          };
    }
    if (hw > iw) {
      return en
        ? {
            title: `⚔️ ${host} challenged you again`,
            body: `They lead ${hw}–${iw}. Can you take it? 💪`,
            variant: 'h2h_behind',
          }
        : {
            title: `⚔️ ${host} te desafió otra vez`,
            body: `Te gana ${hw}–${iw}. ¿Te la vas a bancar? 💪`,
            variant: 'h2h_behind',
          };
    }
    return en
      ? {
          title: `⚖️ Tiebreaker with ${host}`,
          body: `It’s ${hw}–${iw}. This duel decides who’s boss.`,
          variant: 'h2h_tie',
        }
      : {
          title: `⚖️ Desempate con ${host}`,
          body: `Van ${hw}–${iw}. Este duelo define quién manda.`,
          variant: 'h2h_tie',
        };
  }

  if (en) {
    return pick === 0
      ? {
          title: `⚔️ ${host} challenged you to a duel`,
          body: `${flag} ${SECONDS} seconds, head to head. Accept or hide?`,
          variant: 'new_a',
        }
      : {
          title: `🔥 ${host} wants to play with you`,
          body: `${flag} A ${SECONDS}-second duel. Tap and show who knows more!`,
          variant: 'new_b',
        };
  }
  return pick === 0
    ? {
        title: `⚔️ ${host} te desafió a un duelo`,
        body: `${flag} ${SECONDS} segundos cara a cara. ¿Aceptás o te escondés?`,
        variant: 'new_a',
      }
    : {
        title: `🔥 ${host} quiere jugar con vos`,
        body: `${flag} Duelo de ${SECONDS} segundos. ¡Tocá y demostrá quién sabe más!`,
        variant: 'new_b',
      };
}
