import type {
  AchievementUnlock,
  CalibrationInfo,
  MatchRating,
  PlayerResult,
} from '../../shared/protocol';
import { computeRatingChange, isPlaced } from '../../shared/ranking';
import { decideOutcomes } from '../../shared/wordRush';
import type { Battle } from './battle';
import { StaleRatingError, type BattleStore, type SettlementPlayer } from './types';

export interface SettledBattle {
  players: PlayerResult[];
  achievements: Record<string, AchievementUnlock[]>;
  duplicate: boolean;
  /** Si movió el ELO (competitiva o calibración) o fue práctica. */
  rating: MatchRating;
  calibration: CalibrationInfo | null;
}

/**
 * Decide el resultado, calcula el ELO con shared/ranking.ts y lo escribe con settle_battle.
 * Si otro proceso cambió un rating entre la lectura y la escritura, la base lo rechaza entero
 * (stale_rating) y se recalcula con datos frescos. Lo que no mueve el ELO (práctica sola o contra
 * bot) no se guarda; un bot fuera del cupo de calibración se cierra sin rating.
 */
export async function settleBattle(
  store: BattleStore,
  battle: Battle,
  status: 'completed' | 'forfeited',
  maxAttempts = 3,
): Promise<SettledBattle> {
  const lines = battle.finalLines();

  // Práctica (sola o contra un bot): no se guarda nada.
  if (battle.mode !== 'ranked') {
    const outcomes = lines.length === 2 ? decideOutcomes(lines[0]!, lines[1]!) : null;
    return {
      duplicate: false,
      achievements: {},
      rating: 'unrated',
      calibration: null,
      players: lines.map((l, i) => ({
        slot: l.slot,
        username: l.info.username,
        isBot: l.info.isBot ?? false,
        score: l.score,
        correct: l.correct,
        answered: l.answered,
        outcome: outcomes ? outcomes[i]! : null,
        forfeited: l.forfeited,
        ratingBefore: null,
        ratingAfter: null,
      })),
    };
  }

  const outcomes = decideOutcomes(lines[0]!, lines[1]!);

  for (let attempt = 1; ; attempt++) {
    const context = await store.settlementContext(battle.id);
    const bySlot = (slot: 1 | 2) => context.find((c) => c.slot === slot);
    // La base manda: una partida contra bot fuera del cupo quedó guardada como no ranked.
    const rated = context.every((c) => c.isRanked) && battle.rating !== 'unrated';

    const players: SettlementPlayer[] = lines.map((line, i) => {
      const me = bySlot(line.slot);
      const opponent = bySlot(line.slot === 1 ? 2 : 1);
      // El bot no tiene fila de rating: su rating es el que se le asignó al crear la partida.
      const opponentLine = lines.find((l) => l.slot !== line.slot)!;
      const opponentRating =
        opponent?.rating ?? (opponentLine.info.isBot ? opponentLine.info.rating : null);
      const outcome = outcomes[i]!;
      const base = {
        slot: line.slot,
        score: line.score,
        correct: line.correct,
        answered: line.answered,
        result: outcome,
        forfeited: line.forfeited,
      };
      // Sin ELO, o cuenta borrada durante la partida: queda sin rating.
      if (!rated || !me?.userId || me.rating === null || me.gamesPlayed === null) {
        return { ...base, rating_before: null, games_played_before: null, rating_after: null };
      }
      const change = computeRatingChange({
        rating: me.rating,
        opponentRating: opponentRating ?? me.rating,
        outcome,
        // Sin posicionar (0 victorias), perder o empatar no mueve el rating.
        placed: isPlaced({ wins: me.wins ?? 0 }),
        matchesAgainstOpponentInWindow: me.matchesInWindow,
      });
      return {
        ...base,
        rating_before: me.rating,
        games_played_before: me.gamesPlayed,
        rating_after: change.after,
      };
    });

    try {
      const response = await store.settleBattle(battle.id, status, players);
      // Ya estaba liquidada: este cálculo salió de un contexto posterior y la base no lo aplicó.
      // No se muestra ninguna variación de ELO (sería ficticia).
      const shownRating = !response.duplicate;
      return {
        duplicate: response.duplicate,
        achievements: response.achievements,
        rating: rated ? battle.rating : 'unrated',
        calibration: rated ? battle.calibration : null,
        players: players.map((p, i) => ({
          slot: p.slot,
          username: lines[i]!.info.username,
          isBot: lines[i]!.info.isBot ?? false,
          score: p.score,
          correct: p.correct,
          answered: p.answered,
          outcome: p.result,
          forfeited: p.forfeited,
          ratingBefore: shownRating ? p.rating_before : null,
          ratingAfter: shownRating ? p.rating_after : null,
          placedBefore:
            rated && shownRating ? isPlaced({ wins: bySlot(p.slot)?.wins ?? 0 }) : undefined,
        })),
      };
    } catch (err) {
      if (err instanceof StaleRatingError && attempt < maxAttempts) continue;
      throw err;
    }
  }
}
