import { formatReminderTime, planReminders } from '../schedule';

const prefs = { enabled: true, hour: 20, minute: 0 };
// 29/10/2026 a las 15:00, hora local.
const now = new Date(2026, 9, 29, 15);

describe('planReminders', () => {
  it('desactivado no programa nada', () => {
    expect(
      planReminders({
        now,
        prefs: { ...prefs, enabled: false },
        streakDays: 3,
        activeToday: false,
      }),
    ).toEqual([]);
  });

  it('sin práctica hoy avisa hoy que la racha está en riesgo y luego avisos genéricos', () => {
    const plan = planReminders({ now, prefs, streakDays: 3, activeToday: false });
    expect(plan).toHaveLength(7);
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 29, 20));
    expect(plan[0]!.body).toContain('racha de 3 días');
    expect(plan[1]!.date).toEqual(new Date(2026, 9, 30, 20));
    expect(plan[1]!.title).not.toContain('racha');
  });

  it('si hoy ya practicaste, saltea hoy y mañana avisa por la racha', () => {
    const plan = planReminders({ now, prefs, streakDays: 1, activeToday: true });
    expect(plan).toHaveLength(6);
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 30, 20));
    expect(plan[0]!.body).toContain('racha de 1 día.');
  });

  it('si la hora de hoy ya pasó, arranca mañana', () => {
    const late = new Date(2026, 9, 29, 21);
    const plan = planReminders({ now: late, prefs, streakDays: 0, activeToday: false });
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 30, 20));
    expect(plan.every((r) => !r.title.includes('racha'))).toBe(true);
  });

  it('cruza fin de mes', () => {
    const plan = planReminders({ now, prefs, streakDays: 0, activeToday: true, days: 4 });
    expect(plan.map((r) => r.date.getDate())).toEqual([30, 31, 1]);
  });
});

it('formatReminderTime', () => {
  expect(formatReminderTime({ hour: 8, minute: 5 })).toBe('08:05');
});
