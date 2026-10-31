import type { AchievementUnlock, PlayerResult } from '../../shared/protocol';
import { computeRatingChange } from '../../shared/ranking';
import { decideOutcomes } from '../../shared/wordRush';
import type { Battle } from './battle';
import { StaleRatingError, type BattleStore, type SettlementPlayer } from './types';

export interface SettledBattle {
  players: PlayerResult[];
  achievements: Record<string, AchievementUnlock[]>;
  duplicate: boolean;
}

/**
 * Decide el resultado, calcula el ELO con shared/ranking.ts y lo escribe con settle_battle.
 * Si otro proceso cambió un rating entre la lectura y la escritura, la base lo rechaza entero
 * (stale_rating) y se recalcula con datos frescos.
 */
export async function settleBattle(
  store: BattleStore,
  battle: Battle,
  status: 'completed' | 'forfeited',
  maxAttempts = 3,
): Promise<SettledBattle> {
  const lines = battle.finalLines();

  if (battle.mode === 'practice') {
    return {
      duplicate: false,
      achievements: {},
      players: lines.map((l) => ({
        slot: l.slot,
        username: l.info.username,
        isBot: l.info.isBot ?? false,
        score: l.score,
        correct: l.correct,
        answered: l.answered,
        outcome: null,
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
      // Cuenta borrada durante la partida: queda anonimizada y sin rating.
      if (!me?.userId || me.rating === null || me.gamesPlayed === null) {
        return { ...base, rating_before: null, games_played_before: null, rating_after: null };
      }
      const change = computeRatingChange({
        rating: me.rating,
        opponentRating: opponentRating ?? me.rating,
        outcome,
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
      return {
        duplicate: response.duplicate,
        achievements: response.achievements,
        players: players.map((p, i) => ({
          slot: p.slot,
          username: lines[i]!.info.username,
          isBot: lines[i]!.info.isBot ?? false,
          score: p.score,
          correct: p.correct,
          answered: p.answered,
          outcome: p.result,
          forfeited: p.forfeited,
          ratingBefore: p.rating_before,
          ratingAfter: p.rating_after,
        })),
      };
    } catch (err) {
      if (err instanceof StaleRatingError && attempt < maxAttempts) continue;
      throw err;
    }
  }
}
