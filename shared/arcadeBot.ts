/**
 * Bot de Word Rush (motor Arcade). Juega como una persona del rating que se le asignó (el del jugador
 * ± BOT_CONFIG.ratingJitter, ver pickBot) y por el mismo camino de puntaje que una persona.
 *
 * Qué lo hace creíble sin darle ventajas:
 *   - Habilidad base: botSkill(rating) (precisión y tiempo medio, curva continua sin saltos por rango).
 *   - Forma del día: cada partida es un poco mejor o peor (precisión y ritmo).
 *   - Dificultad por formato: Swipe y Connect le resultan más fáciles que Sentence Rush.
 *   - Rachas: después de acertar acierta un poco más y después de fallar, un poco menos. El efecto está
 *     centrado en su precisión base, así que en promedio no lo hace ni mejor ni peor que su rating.
 *   - Tiempos: log-normales por formato; los errores suelen tardar más (duda), a veces menos (apuro);
 *     después de un error va más lento; de vez en cuando se distrae.
 *   - Feedback: entre un desafío y el siguiente paga la misma demora que una persona (ver el resultado y
 *     que entre el próximo). Nunca responde más rápido que lo que el servidor acepta de una persona.
 *   - Información: sólo «sabe» la respuesta a través de su tirada de acierto; no mira al rival.
 */

import {
  BOT_KIND_FACTOR,
  KIND_RULES,
  gradeArcade,
  type ArcadeAnswer,
  type ArcadeChallenge,
  type ChallengeKind,
} from './arcade';
import { BOT_CONFIG, botSkill } from './bots';

interface Range {
  min: number;
  max: number;
}

export interface ArcadeBotConfig {
  kindLogit: Readonly<Record<ChallengeKind, number>>;
  chance: Readonly<Record<ChallengeKind, number>>;
  formLogitSigma: number;
  formLogitMax: number;
  formTimeSigma: number;
  momentum: { decay: number; hit: number; miss: number; weight: number };
  timeSigma: number;
  missTimeFactor: number;
  rushedMissChance: number;
  rushedMissFactor: number;
  postErrorFactor: number;
  distraction: { chance: number; minMs: number; maxMs: number };
  feedbackMs: Range;
  pairFeedbackMs: Range;
}

/**
 * Calibrado por simulación (shared/__tests__/arcadeBot.test.ts): con la rotación real, la precisión por
 * respuesta queda a ±2,5 puntos de botSkill(rating) en todo el rango, así que el ELO contra el bot sigue
 * midiendo lo mismo que antes.
 */
export const ARCADE_BOT: Readonly<ArcadeBotConfig> = {
  /** Ajuste de dificultad por formato, en logit, sobre la precisión base (≈ 0 en promedio). */
  kindLogit: { swipe: 0.3, audio: 0.05, connect: -0.12, sentence: -0.6 },
  /** Piso de azar por formato: Swipe es verdadero/falso; Audio, una de cuatro. */
  chance: { swipe: 0.5, audio: 0.25, connect: 0, sentence: 0 },
  /** Forma del día: desvío de la precisión (logit) y del ritmo (log) por partida. */
  formLogitSigma: 0.3,
  formLogitMax: 0.6,
  formTimeSigma: 0.12,
  /** Rachas: memoria que decae y empuja la precisión (logit). */
  momentum: { decay: 0.6, hit: 0.35, miss: -0.7, weight: 0.5 },
  /** Dispersión log-normal del tiempo de cada respuesta. */
  timeSigma: 0.32,
  /** Un error suele tardar más (duda) y a veces menos (apuro). */
  missTimeFactor: 1.25,
  rushedMissChance: 0.2,
  rushedMissFactor: 0.65,
  /** Después de un error, la siguiente respuesta va más lenta. */
  postErrorFactor: 1.15,
  /** Distracción ocasional. */
  distraction: { chance: 0.03, minMs: 800, maxMs: 2_500 },
  /** Demora entre desafíos (ver el resultado y que entre el siguiente) y entre parejas de Connect. */
  feedbackMs: { min: 150, max: 330 },
  pairFeedbackMs: { min: 60, max: 140 },
};

const logit = (p: number) => Math.log(p / (1 - p));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

function gaussian(random: () => number): number {
  const u = Math.max(random(), 1e-9);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Nunca más rápido que lo que el servidor acepta de una persona en ese formato. */
export function botMinDelayMs(kind: ChallengeKind): number {
  return Math.max(KIND_RULES[kind].minMs + 150, 350);
}

export interface ArcadeBotPlan {
  /** Si va a intentar acertar. */
  correct: boolean;
  /** Ms desde que el desafío (o la pareja) quedó activo hasta que responde, con el feedback incluido. */
  delayMs: number;
}

/**
 * Estado de un bot durante una partida. `plan` decide la próxima jugada; `observe` le cuenta qué pasó
 * de verdad (lo corrige el servidor), para las rachas y el ritmo.
 */
export class ArcadeBotBrain {
  private readonly baseLogit: number;
  private readonly baseMeanMs: number;
  private readonly formLogit: number;
  private readonly formTime: number;
  /** Centro de la memoria de rachas para la precisión base: el efecto promedio es ~0. */
  private readonly momentumCenter: number;
  private momentum: number;
  private lastWasMiss = false;
  private answers = 0;

  constructor(
    readonly rating: number,
    private readonly random: () => number,
    private readonly config: Readonly<ArcadeBotConfig> = ARCADE_BOT,
  ) {
    const skill = botSkill(rating);
    this.baseLogit = logit(clamp(skill.accuracy, 0.02, 0.98));
    this.baseMeanMs = skill.meanMs;
    this.formLogit = clamp(
      config.formLogitSigma * gaussian(random),
      -config.formLogitMax,
      config.formLogitMax,
    );
    this.formTime = Math.exp(config.formTimeSigma * gaussian(random));
    const p = skill.accuracy;
    const { decay, hit, miss } = config.momentum;
    this.momentumCenter = (p * hit + (1 - p) * miss) / (1 - decay);
    this.momentum = this.momentumCenter;
  }

  /** Probabilidad de acertar el próximo desafío de ese formato (para tests y diagnóstico). */
  accuracyFor(kind: ChallengeKind): number {
    const { weight } = this.config.momentum;
    const q = sigmoid(
      this.baseLogit +
        this.formLogit +
        this.config.kindLogit[kind] +
        weight * (this.momentum - this.momentumCenter),
    );
    return Math.max(this.config.chance[kind], q);
  }

  /**
   * Próxima jugada. `samePair` = sigue en el mismo tablero de Connect (la demora de feedback es menor);
   * en el primer desafío de la partida no hay feedback previo.
   */
  plan(kind: ChallengeKind, samePair = false): ArcadeBotPlan {
    const c = this.config;
    const correct = this.random() < this.accuracyFor(kind);
    let thinking =
      this.baseMeanMs *
      BOT_KIND_FACTOR[kind] *
      this.formTime *
      Math.exp(c.timeSigma * gaussian(this.random));
    if (!correct) {
      thinking *= this.random() < c.rushedMissChance ? c.rushedMissFactor : c.missTimeFactor;
    }
    if (this.lastWasMiss) thinking *= c.postErrorFactor;
    if (this.random() < c.distraction.chance) {
      thinking += c.distraction.minMs + this.random() * (c.distraction.maxMs - c.distraction.minMs);
    }
    const fb = samePair ? c.pairFeedbackMs : c.feedbackMs;
    const feedback = this.answers === 0 ? 0 : fb.min + this.random() * (fb.max - fb.min);
    return { correct, delayMs: Math.round(this.bounded(thinking + feedback, kind)) };
  }

  /**
   * Dentro de [mínimo humano, BOT_CONFIG.maxMs] sin recortar a un valor fijo: un tiempo que se pasa cae
   * en una franja al azar cerca del límite (un recorte duro repetiría exactamente el mismo tiempo).
   */
  private bounded(delay: number, kind: ChallengeKind): number {
    const min = botMinDelayMs(kind);
    const max = BOT_CONFIG.maxMs;
    if (delay < min) return min + this.random() * Math.min(200, max - min);
    if (delay > max) return max - this.random() * Math.min(2_000, max - min);
    return delay;
  }

  /** Lo que corrigió el servidor (puede diferir del plan, p. ej. si no había respuesta incorrecta). */
  observe(correct: boolean): void {
    const { decay, hit, miss } = this.config.momentum;
    this.momentum = decay * this.momentum + (correct ? hit : miss);
    this.lastWasMiss = !correct;
    this.answers += 1;
  }
}

// ---------------------------------------------------------------------------------------------
// Respuestas válidas

export interface BotAnswer {
  answer: ArcadeAnswer;
  /** Lo que va a decir el corrector del servidor de esta respuesta. */
  correct: boolean;
}

/**
 * Lo que «toca» el bot en su desafío actual, siempre válido para gradeArcade (nunca deja la partida
 * trabada). Intenta acertar o fallar según `wantCorrect`; si no existe una respuesta equivocada (p. ej.
 * la última pareja de Connect, o una frase cuyo único orden posible es el correcto), acierta. Devuelve
 * null sólo si el desafío no admite ninguna respuesta válida (contenido roto).
 */
export function botArcadeAnswer(
  challenge: ArcadeChallenge,
  solved: ReadonlyMap<number, number>,
  wantCorrect: boolean,
  random: () => number,
): BotAnswer | null {
  const solvedLeft = new Set(solved.keys());
  const check = (answer: ArcadeAnswer): BotAnswer | null => {
    const outcome = gradeArcade(challenge, answer, solvedLeft);
    return outcome.valid ? { answer, correct: outcome.correct } : null;
  };
  const pick = <T>(items: readonly T[]): T | undefined =>
    items.length > 0 ? items[Math.floor(random() * items.length)] : undefined;

  switch (challenge.kind) {
    case 'swipe':
      return check({
        kind: 'swipe',
        accept: wantCorrect ? challenge.truthful : !challenge.truthful,
      });
    case 'audio': {
      const wrong = challenge.options.map((_, i) => i).filter((i) => i !== challenge.correctOption);
      const option = wantCorrect
        ? challenge.correctOption
        : (pick(wrong) ?? challenge.correctOption);
      return check({ kind: 'audio', option });
    }
    case 'connect': {
      // Una persona no siempre va de arriba hacia abajo.
      const free = challenge.left.map((_, i) => i).filter((i) => !solvedLeft.has(i));
      const left = pick(free);
      if (left === undefined) return null;
      const usedRight = new Set(solved.values());
      const right = challenge.solution[left]!;
      const wrong = challenge.right
        .map((_, r) => r)
        .filter((r) => r !== right && !usedRight.has(r));
      const target = wantCorrect ? right : (pick(wrong) ?? right);
      return check({ kind: 'connect', left, right: target });
    }
    case 'sentence': {
      const correctOrder = sentenceOrder(challenge, true, random);
      if (!correctOrder) return null;
      if (wantCorrect) return check({ kind: 'sentence', order: correctOrder });
      // Un error humano: dos bloques cambiados de lugar; si todo da correcto, cualquier otro orden.
      const wrongOrder = sentenceOrder(challenge, false, random, correctOrder);
      return check({ kind: 'sentence', order: wrongOrder ?? correctOrder });
    }
  }
}

/** Un orden de bloques que el corrector da por correcto (o incorrecto), o null si no hay. */
function sentenceOrder(
  challenge: Extract<ArcadeChallenge, { kind: 'sentence' }>,
  correct: boolean,
  random: () => number,
  from?: readonly number[],
): number[] | null {
  const n = challenge.tokens.length;
  const graded = (order: number[]) => {
    const outcome = gradeArcade(challenge, { kind: 'sentence', order });
    return outcome.valid && outcome.correct === correct;
  };
  if (correct) {
    const greedy = greedyCanonicalOrder(challenge);
    if (greedy && graded(greedy)) return greedy;
  } else if (from) {
    // Cambios chicos primero (lo que haría una persona apurada), en orden al azar.
    const swaps: [number, number][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) swaps.push([i, j]);
    for (let k = swaps.length - 1; k > 0; k--) {
      const r = Math.floor(random() * (k + 1));
      [swaps[k], swaps[r]] = [swaps[r]!, swaps[k]!];
    }
    for (const [i, j] of swaps) {
      const order = [...from];
      [order[i], order[j]] = [order[j]!, order[i]!];
      if (graded(order)) return order;
    }
  }
  // Búsqueda completa (las frases tienen a lo sumo 6 bloques: 720 órdenes).
  if (n > 8) return null;
  for (const order of permutations(n)) if (graded(order)) return order;
  return null;
}

/** Arma la respuesta canónica con los bloques mezclados (mismo criterio que el corrector). */
function greedyCanonicalOrder(
  challenge: Extract<ArcadeChallenge, { kind: 'sentence' }>,
): number[] | null {
  const canonical = challenge.answers[0];
  if (canonical === undefined) return null;
  const remaining = challenge.tokens.map((_, i) => i);
  const order: number[] = [];
  let rest = canonical.trim().toLowerCase();
  while (remaining.length > 0) {
    rest = rest.trimStart();
    // El bloque más largo que encaja primero («an» antes que «a»).
    let best = -1;
    for (const i of remaining) {
      const token = challenge.tokens[i]!.toLowerCase();
      if (rest.startsWith(token) && (best < 0 || token.length > challenge.tokens[best]!.length)) {
        best = i;
      }
    }
    if (best < 0) return null;
    order.push(best);
    remaining.splice(remaining.indexOf(best), 1);
    rest = rest.slice(challenge.tokens[best]!.length);
  }
  return order;
}

function* permutations(n: number): Generator<number[]> {
  const order = Array.from({ length: n }, (_, i) => i);
  const c = new Array<number>(n).fill(0);
  yield [...order];
  let i = 0;
  while (i < n) {
    if (c[i]! < i) {
      const j = i % 2 === 0 ? 0 : c[i]!;
      [order[j], order[i]] = [order[i]!, order[j]!];
      yield [...order];
      c[i]! += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
}
