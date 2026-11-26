import {
  DEFAULT_PRIORITY,
  goldenHour,
  normalizePriority,
  pickSmartMessage,
  smartSendTime,
  type SmartContext,
} from '../smart';
import { MAX_PER_DAY, planNotifications } from '../schedule';

const at = (d: number, h: number, m = 0) => new Date(2026, 10, d, h, m).getTime();
const NOW = new Date(2026, 10, 26, 8, 0);

const ctx = (over: Partial<SmartContext> = {}): SmartContext => ({
  streakDays: 0,
  activeToday: false,
  missionLeft: null,
  chestReady: false,
  rankGap: null,
  nextLesson: null,
  wordOfDay: null,
  language: { name: 'italiano', flag: '🇮🇹' },
  ...over,
});

describe('horario de oro', () => {
  it('es la hora en que más practicaste las últimas semanas', () => {
    const times = [at(20, 13, 5), at(21, 13, 40), at(22, 20, 10), at(23, 13, 15)];
    expect(goldenHour(times, NOW)).toBe(13);
  });
  it('sin suficientes prácticas recientes no hay horario de oro', () => {
    expect(goldenHour([at(25, 13)], NOW)).toBeNull();
    expect(goldenHour([at(1, 13), at(2, 13), at(3, 13)], NOW)).toBeNull();
  });
  it('llega 10 minutos antes, lejos del recordatorio elegido y nunca de noche', () => {
    expect(smartSendTime(13, 20)).toEqual({ hour: 12, minute: 50 });
    // Pegado al recordatorio de las 20: se corre 6 horas.
    expect(smartSendTime(20, 20)).toEqual({ hour: 13, minute: 50 });
    // Sin datos: lejos del recordatorio.
    expect(smartSendTime(null, 8)).toEqual({ hour: 13, minute: 50 });
    // Madrugada o noche: dentro de 9–21.
    expect(smartSendTime(3, null)).toEqual({ hour: 9, minute: 50 });
    expect(smartSendTime(23, null)).toEqual({ hour: 20, minute: 50 });
  });
});

describe('mensaje del push inteligente', () => {
  const today = new Date(2026, 10, 26, 12, 50);
  it('gana el más fuerte según la prioridad: racha en juego primero', () => {
    const m = pickSmartMessage({
      ctx: ctx({ streakDays: 23, nextLesson: 'En el bar' }),
      day: 0,
      date: today,
    });
    expect(m?.type).toBe('streak');
    expect(m?.title).toContain('23');
    expect(m?.route).toBe('/');
    expect(['a', 'b']).toContain(m?.variant);
  });
  it('ya no hay aviso de repaso: con una lección pendiente, avisa la lección', () => {
    const m = pickSmartMessage({ ctx: ctx({ nextLesson: 'En el bar' }), day: 0, date: today });
    expect(m?.type).toBe('lesson');
    expect(m?.route).toBe('/');
    expect(`${m?.title} ${m?.body}`).not.toMatch(/olvid|repas/i);
  });
  it('lo que cambia día a día sólo vale hoy; desde el día 2 aparece «te extraño»', () => {
    const c = ctx({ streakDays: 5, chestReady: true, wordOfDay: 'magari' });
    expect(pickSmartMessage({ ctx: c, day: 1, date: today })).toBeNull();
    expect(pickSmartMessage({ ctx: c, day: 2, date: today })?.type).toBe('comeback');
  });
  it('PostHog reordena la prioridad (lo que más tracciona va primero)', () => {
    const c = ctx({ streakDays: 9, wordOfDay: 'magari' });
    expect(
      pickSmartMessage({ ctx: c, day: 0, date: today, priority: ['word', 'streak'] })?.type,
    ).toBe('word');
  });
  it('una prioridad remota inválida no rompe nada', () => {
    expect(normalizePriority('basura')).toEqual([...DEFAULT_PRIORITY]);
    expect(normalizePriority(['rank', 'nope', 'rank'])[0]).toBe('rank');
    // Un flag viejo que todavía nombre «reviews» se ignora.
    expect(normalizePriority(['reviews', 'word'])).not.toContain('reviews');
    expect(normalizePriority(['rank'])).toHaveLength(DEFAULT_PRIORITY.length);
  });
});

describe('plan de avisos', () => {
  const prefs = { enabled: true, hour: 20, minute: 0, smart: true };
  const byDay = (plan: { date: Date }[]) => {
    const m = new Map<number, number>();
    for (const p of plan) m.set(p.date.getDate(), (m.get(p.date.getDate()) ?? 0) + 1);
    return m;
  };

  it('el elegido y el inteligente; nunca más de 2 por día', () => {
    const plan = planNotifications({
      now: NOW,
      prefs,
      streakDays: 7,
      activeToday: false,
      streakFreezes: 0,
      freezePending: 0,
      smart: {
        enabled: true,
        ctx: ctx({ streakDays: 7, nextLesson: 'En el bar' }),
        practiceTimes: [at(20, 13), at(21, 13), at(22, 13)],
      },
    });
    const today = plan.filter((p) => p.date.getDate() === 26);
    expect(today.map((p) => p.kind).sort()).toEqual(['daily', 'smart']);
    expect(today.find((p) => p.kind === 'smart')?.date.getHours()).toBe(12);
    for (const n of byDay(plan).values()) expect(n).toBeLessThanOrEqual(MAX_PER_DAY);
  });

  it('sin recordatorio a la noche, el aviso de racha sigue llegando (y no pasa de 2)', () => {
    const plan = planNotifications({
      now: NOW,
      prefs: { ...prefs, hour: 8, minute: 30 },
      streakDays: 7,
      activeToday: false,
      streakFreezes: 0,
      freezePending: 0,
      smart: { enabled: true, ctx: ctx({ streakDays: 7 }), practiceTimes: [] },
    });
    const today = plan.filter((p) => p.date.getDate() === 26);
    expect(today.some((p) => p.kind === 'streak')).toBe(true);
    expect(today.length).toBeLessThanOrEqual(MAX_PER_DAY);
  });

  it('si hoy ya practicaste, hoy no llega nada', () => {
    const plan = planNotifications({
      now: NOW,
      prefs,
      streakDays: 7,
      activeToday: true,
      streakFreezes: 0,
      freezePending: 0,
      smart: {
        enabled: true,
        ctx: ctx({ streakDays: 7, activeToday: true, nextLesson: 'x' }),
        practiceTimes: [],
      },
    });
    expect(plan.filter((p) => p.date.getDate() === 26)).toEqual([]);
  });

  it('con el inteligente apagado sólo queda el elegido', () => {
    const plan = planNotifications({
      now: NOW,
      prefs: { ...prefs, smart: false },
      streakDays: 0,
      activeToday: false,
      streakFreezes: 0,
      freezePending: 0,
      smart: { enabled: false, ctx: ctx({ nextLesson: 'x' }), practiceTimes: [] },
    });
    expect(plan.every((p) => p.kind === 'daily')).toBe(true);
  });
});
