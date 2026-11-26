import { getStrings } from '@/i18n';

import { smartStrings } from './smartStrings';

/**
 * Push inteligente (lógica pura, sin notificaciones): CUÁNDO mandarlo (tu horario de oro, la hora en
 * que más practicás) y QUÉ decir (el mensaje más fuerte que tengas ese día, según una prioridad que
 * se ajusta desde PostHog con lo que más se abre).
 */

export type SmartType =
  'streak' | 'reviews' | 'mission' | 'chest' | 'rank' | 'lesson' | 'word' | 'comeback';

/** Prioridad por defecto (la propuesta); PostHog la puede reemplazar (flag smart-push-priority). */
export const DEFAULT_PRIORITY: readonly SmartType[] = [
  'streak',
  'reviews',
  'mission',
  'rank',
  'chest',
  'lesson',
  'word',
  'comeback',
];

const ALL_TYPES = new Set<SmartType>(DEFAULT_PRIORITY);

/** Pantalla que abre cada aviso al tocarlo. */
export const SMART_ROUTES: Record<SmartType, string> = {
  streak: '/',
  reviews: '/review',
  mission: '/missions',
  chest: '/missions',
  rank: '/ranked',
  lesson: '/',
  word: '/practice',
  comeback: '/',
};

/**
 * Una prioridad que llega de afuera (PostHog) se valida: sólo tipos conocidos, sin repetir, y los
 * que falten se agregan al final en el orden por defecto. Cualquier otra cosa: la de siempre.
 */
export function normalizePriority(raw: unknown): SmartType[] {
  if (!Array.isArray(raw)) return [...DEFAULT_PRIORITY];
  const picked = [
    ...new Set(
      raw.filter((t): t is SmartType => typeof t === 'string' && ALL_TYPES.has(t as SmartType)),
    ),
  ];
  return [...picked, ...DEFAULT_PRIORITY.filter((t) => !picked.includes(t))];
}

/** Lo que se sabe del usuario al programar (se recalcula cada vez que abre la app). */
export interface SmartContext {
  streakDays: number;
  activeToday: boolean;
  /** Palabras con repaso programado (texto y cuándo vence, en ms). */
  dueWords: readonly { text: string; dueAt: number }[];
  /** Lo que falta de la misión más avanzada de hoy (null si ninguna está cerca). */
  missionLeft: number | null;
  /** Misiones completas y cofre sin abrir. */
  chestReady: boolean;
  /** Puntos de ELO que faltan para el siguiente rango (null si está lejos o sin Ranked). */
  rankGap: { points: number; next: string } | null;
  /** Título de la próxima lección. */
  nextLesson: string | null;
  wordOfDay: string | null;
  /** Idioma que estudia: nombre (en minúscula, para el texto) y bandera. */
  language: { name: string; flag: string };
}

/** Un ELO a esta distancia del siguiente rango ya se siente alcanzable. */
export const RANK_GAP_MAX = 30;
/** Con menos palabras vencidas que esto, no vale un aviso de repaso. */
export const MIN_DUE_WORDS = 3;

export interface SmartMessage {
  type: SmartType;
  variant: 'a' | 'b';
  title: string;
  body: string;
  route: string;
}

/** Variante estable para ese día y tipo (alterna a/b entre días: la prueba A/B). */
function variantFor(date: Date, type: SmartType): 0 | 1 {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}:${type}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return (Math.abs(h) % 2) as 0 | 1;
}

/**
 * El mensaje del día `day` (0 = hoy) para la fecha `date`. Lo que cambia día a día (racha, misiones,
 * cofre, palabra del día) sólo cuenta hoy; las palabras vencidas se proyectan a esa fecha; a partir
 * del día 2 sin abrir la app aparece «te extraño». null: nada para decir.
 */
export function pickSmartMessage(input: {
  ctx: SmartContext;
  day: number;
  date: Date;
  priority?: readonly SmartType[];
  exclude?: readonly SmartType[];
}): SmartMessage | null {
  const { ctx, day, date, priority = DEFAULT_PRIORITY, exclude = [] } = input;
  const t = getStrings(smartStrings);
  const due = ctx.dueWords
    .filter((w) => w.dueAt <= date.getTime())
    .sort((a, b) => a.dueAt - b.dueAt);

  const build = (
    type: SmartType,
  ): [{ title: string; body: string }, { title: string; body: string }] | null => {
    switch (type) {
      case 'streak':
        return day === 0 && ctx.streakDays >= 2 && !ctx.activeToday
          ? t.streak(ctx.streakDays)
          : null;
      case 'reviews': {
        if (due.length < MIN_DUE_WORDS) return null;
        const names = due
          .slice(0, 2)
          .map((w) => w.text)
          .join(', ');
        return t.reviews(names, due.length - 2);
      }
      case 'mission':
        return day === 0 && ctx.missionLeft !== null && ctx.missionLeft > 0
          ? t.mission(ctx.missionLeft)
          : null;
      case 'chest':
        return day === 0 && ctx.chestReady ? t.chest() : null;
      case 'rank':
        return day <= 1 && ctx.rankGap && ctx.rankGap.points <= RANK_GAP_MAX
          ? t.rank(ctx.rankGap.points, ctx.rankGap.next)
          : null;
      case 'lesson':
        return ctx.nextLesson ? t.lesson(ctx.nextLesson, ctx.language.name) : null;
      case 'word':
        return day === 0 && ctx.wordOfDay ? t.word(ctx.language.flag, ctx.wordOfDay) : null;
      case 'comeback':
        return day >= 2 ? t.comeback(ctx.language.name) : null;
    }
  };

  for (const type of normalizePriority(priority)) {
    if (exclude.includes(type)) continue;
    const variants = build(type);
    if (!variants) continue;
    const v = variantFor(date, type);
    return { type, variant: v === 0 ? 'a' : 'b', ...variants[v], route: SMART_ROUTES[type] };
  }
  return null;
}

/** Ventana de prácticas que se miran para el horario de oro. */
export const GOLDEN_WINDOW_DAYS = 21;
/** Prácticas mínimas para confiar en el horario de oro. */
export const GOLDEN_MIN_SAMPLES = 3;
/** Horario permitido para el push inteligente (nunca de noche). */
export const QUIET = { from: 9, to: 21 } as const;

/**
 * Tu horario de oro: la hora local en la que más practicaste en las últimas semanas (con empate, la
 * más reciente). null si todavía no hay datos suficientes.
 */
export function goldenHour(practiceTimes: readonly number[], now: Date): number | null {
  const since = now.getTime() - GOLDEN_WINDOW_DAYS * 86_400_000;
  const recent = practiceTimes.filter((t) => t >= since && t <= now.getTime());
  if (recent.length < GOLDEN_MIN_SAMPLES) return null;
  const count = new Map<number, { n: number; last: number }>();
  for (const t of recent) {
    const h = new Date(t).getHours();
    const c = count.get(h) ?? { n: 0, last: 0 };
    count.set(h, { n: c.n + 1, last: Math.max(c.last, t) });
  }
  let best: [number, { n: number; last: number }] | null = null;
  for (const entry of count) {
    if (
      !best ||
      entry[1].n > best[1].n ||
      (entry[1].n === best[1].n && entry[1].last > best[1].last)
    ) {
      best = entry;
    }
  }
  return best ? best[0] : null;
}

/**
 * Hora del push inteligente: 10 minutos antes de tu horario de oro (para que llegue cuando estás por
 * practicar). Sin datos, una hora distinta del recordatorio elegido. Nunca a menos de 2 horas del
 * recordatorio elegido (serían dos avisos seguidos) ni fuera de 9–21 h.
 */
export function smartSendTime(
  golden: number | null,
  reminderHour: number | null,
): {
  hour: number;
  minute: number;
} {
  const away = (h: number) => (h >= 15 ? h - 6 : h + 6);
  let h = golden ?? (reminderHour !== null ? away(reminderHour) : 19);
  if (reminderHour !== null && Math.abs(h - reminderHour) < 2) h = away(reminderHour);
  h = Math.min(QUIET.to, Math.max(QUIET.from + 1, h));
  return { hour: h - 1, minute: 50 };
}
