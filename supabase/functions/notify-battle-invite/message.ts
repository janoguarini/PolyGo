// Texto del aviso de desafío (sin dependencias: lo usa la Edge Function y lo prueba Jest).
// Llamativo y con datos reales: la bandera del idioma del duelo y el historial entre los dos.
// `variant` viaja en el aviso para medir en PostHog qué texto se abre más.

export interface ChallengeContext {
  host: string;
  languageCode?: string | null;
  h2h?: { host_wins: number; invitee_wins: number } | null;
  /**
   * Idioma de la interfaz del invitado (profiles.interface_language, desde
   * 20270103120000_interface_languages_pt_it). null / ausente = no lo eligió.
   */
  interfaceLanguage?: string | null;
}

export interface ChallengeMessage {
  title: string;
  body: string;
  variant: string;
}

export type PushLanguage = 'es' | 'en' | 'pt-BR' | 'it' | 'fr';

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
 * Idioma del aviso: el de la interfaz del invitado. Si no lo eligió (perfiles viejos o una base sin
 * la migración), la regla de antes: el curso de español se estudia desde el inglés, así que a esos
 * jugadores se les escribe en inglés; al resto, en español.
 */
export function pushLanguage(
  ctx: Pick<ChallengeContext, 'languageCode' | 'interfaceLanguage'>,
): PushLanguage {
  const ui = ctx.interfaceLanguage;
  if (ui === 'es' || ui === 'en' || ui === 'pt-BR' || ui === 'it' || ui === 'fr') return ui;
  return ctx.languageCode === 'es' ? 'en' : 'es';
}

type Texts = {
  lead: (host: string, iw: number, hw: number) => [string, string];
  behind: (host: string, hw: number, iw: number) => [string, string];
  tie: (host: string, hw: number, iw: number) => [string, string];
  newA: (host: string, flag: string) => [string, string];
  newB: (host: string, flag: string) => [string, string];
};

const TEXTS: Record<PushLanguage, Texts> = {
  es: {
    lead: (h, iw, hw) => [
      `😤 ${h} quiere la revancha`,
      `Le ganas ${iw}–${hw}. ¿Defiendes el título? 🏆`,
    ],
    behind: (h, hw, iw) => [
      `⚔️ ${h} te desafió otra vez`,
      `Te gana ${hw}–${iw}. ¿Te animas? 💪`,
    ],
    tie: (h, hw, iw) => [
      `⚖️ Desempate con ${h}`,
      `Van ${hw}–${iw}. Este duelo define quién manda.`,
    ],
    newA: (h, f) => [
      `⚔️ ${h} te desafió a un duelo`,
      `${f} ${SECONDS} segundos cara a cara. ¿Aceptas o te escondes?`,
    ],
    newB: (h, f) => [
      `🔥 ${h} quiere jugar contigo`,
      `${f} Duelo de ${SECONDS} segundos. ¡Toca y demuestra quién sabe más!`,
    ],
  },
  en: {
    lead: (h, iw, hw) => [`😤 ${h} wants a rematch`, `You lead ${iw}–${hw}. Defend your title! 🏆`],
    behind: (h, hw, iw) => [
      `⚔️ ${h} challenged you again`,
      `They lead ${hw}–${iw}. Can you take it? 💪`,
    ],
    tie: (h, hw, iw) => [
      `⚖️ Tiebreaker with ${h}`,
      `It’s ${hw}–${iw}. This duel decides who’s boss.`,
    ],
    newA: (h, f) => [
      `⚔️ ${h} challenged you to a duel`,
      `${f} ${SECONDS} seconds, head to head. Accept or hide?`,
    ],
    newB: (h, f) => [
      `🔥 ${h} wants to play with you`,
      `${f} A ${SECONDS}-second duel. Tap and show who knows more!`,
    ],
  },
  'pt-BR': {
    lead: (h, iw, hw) => [
      `😤 ${h} quer revanche`,
      `Você lidera por ${iw}–${hw}. Defenda o título! 🏆`,
    ],
    behind: (h, hw, iw) => [
      `⚔️ ${h} te desafiou de novo`,
      `Você está perdendo de ${hw}–${iw}. Vai encarar? 💪`,
    ],
    tie: (h, hw, iw) => [
      `⚖️ Desempate com ${h}`,
      `Está ${hw}–${iw}. Este duelo decide quem manda.`,
    ],
    newA: (h, f) => [
      `⚔️ ${h} te desafiou para um duelo`,
      `${f} ${SECONDS} segundos, frente a frente. Aceita ou vai fugir?`,
    ],
    newB: (h, f) => [
      `🔥 ${h} quer jogar com você`,
      `${f} Duelo de ${SECONDS} segundos. Toque e mostre quem sabe mais!`,
    ],
  },
  it: {
    lead: (h, iw, hw) => [
      `😤 ${h} vuole la rivincita`,
      `Sei avanti ${iw}–${hw}. Difendi il titolo! 🏆`,
    ],
    behind: (h, hw, iw) => [
      `⚔️ ${h} ti ha sfidato di nuovo`,
      `Ti batte ${hw}–${iw}. Accetti la sfida? 💪`,
    ],
    tie: (h, hw, iw) => [
      `⚖️ Spareggio con ${h}`,
      `Siete ${hw}–${iw}. Questo duello decide chi comanda.`,
    ],
    newA: (h, f) => [
      `⚔️ ${h} ti ha sfidato a duello`,
      `${f} ${SECONDS} secondi, testa a testa. Accetti o ti nascondi?`,
    ],
    newB: (h, f) => [
      `🔥 ${h} vuole giocare con te`,
      `${f} Duello da ${SECONDS} secondi. Tocca e dimostra chi ne sa di più!`,
    ],
  },
  fr: {
    lead: (h, iw, hw) => [
      `😤 ${h} veut sa revanche`,
      `Tu mènes ${iw}–${hw}. Défends ton titre ! 🏆`,
    ],
    behind: (h, hw, iw) => [
      `⚔️ ${h} te défie encore`,
      `${h} mène ${hw}–${iw}. Tu relèves le défi ? 💪`,
    ],
    tie: (h, hw, iw) => [
      `⚖️ Match décisif contre ${h}`,
      `Vous êtes à ${hw}–${iw}. Ce duel décide qui est le boss.`,
    ],
    newA: (h, f) => [
      `⚔️ ${h} te défie en duel`,
      `${f} ${SECONDS} secondes, face à face. Tu acceptes ou tu te caches ?`,
    ],
    newB: (h, f) => [
      `🔥 ${h} veut jouer avec toi`,
      `${f} Duel de ${SECONDS} secondes. Touche et montre qui en sait le plus !`,
    ],
  },
};

const message = ([title, body]: [string, string], variant: string): ChallengeMessage => ({
  title,
  body,
  variant,
});

/** `pick` (0 o 1) elige entre dos textos cuando no hay historial: la prueba A/B. */
export function challengeMessage(ctx: ChallengeContext, pick: 0 | 1): ChallengeMessage {
  const host = `@${ctx.host}`;
  const flag = FLAGS[ctx.languageCode ?? ''] ?? '⚔️';
  const hw = ctx.h2h?.host_wins ?? 0;
  const iw = ctx.h2h?.invitee_wins ?? 0;
  const t = TEXTS[pushLanguage(ctx)];

  if (hw + iw > 0) {
    if (iw > hw) return message(t.lead(host, iw, hw), 'h2h_lead');
    if (hw > iw) return message(t.behind(host, hw, iw), 'h2h_behind');
    return message(t.tie(host, hw, iw), 'h2h_tie');
  }
  return pick === 0 ? message(t.newA(host, flag), 'new_a') : message(t.newB(host, flag), 'new_b');
}
