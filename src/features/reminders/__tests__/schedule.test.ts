import { formatReminderTime, planReminders, planStreakAlert } from '../schedule';

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

  it('sin práctica hoy avisa hoy y los días siguientes a la hora elegida', () => {
    const plan = planReminders({ now, prefs, streakDays: 3, activeToday: false });
    expect(plan).toHaveLength(7);
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 29, 20));
    expect(plan[1]!.date).toEqual(new Date(2026, 9, 30, 20));
  });

  it('si hoy ya practicaste, saltea hoy', () => {
    const plan = planReminders({ now, prefs, streakDays: 1, activeToday: true });
    expect(plan).toHaveLength(6);
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 30, 20));
  });

  it('omite el recordatorio que caería después del aviso de racha ese día', () => {
    const late = { ...prefs, hour: 22 };
    const plan = planReminders({ now, prefs: late, streakDays: 3, activeToday: false });
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 30, 22));
    // Sin racha no hay aviso, así que el recordatorio de hoy se mantiene.
    const none = planReminders({ now, prefs: late, streakDays: 0, activeToday: false });
    expect(none[0]!.date).toEqual(new Date(2026, 9, 29, 22));
  });

  it('si la hora de hoy ya pasó, arranca mañana', () => {
    const late = new Date(2026, 9, 29, 21);
    const plan = planReminders({ now: late, prefs, streakDays: 0, activeToday: false });
    expect(plan[0]!.date).toEqual(new Date(2026, 9, 30, 20));
  });

  it('cruza fin de mes', () => {
    const plan = planReminders({ now, prefs, streakDays: 0, activeToday: true, days: 4 });
    expect(plan.map((r) => r.date.getDate())).toEqual([30, 31, 1]);
  });
});

describe('planStreakAlert', () => {
  const state = { streakDays: 3, activeToday: false, streakFreezes: 0, freezePending: 0 };

  it('sin práctica hoy avisa 3 horas antes de medianoche', () => {
    const alert = planStreakAlert({ now, ...state });
    expect(alert!.date).toEqual(new Date(2026, 9, 29, 21));
    expect(alert!.body).toContain('no perder tu racha de 3 días');
  });

  it('si hoy ya practicaste, avisa mañana', () => {
    const alert = planStreakAlert({ now, ...state, activeToday: true });
    expect(alert!.date).toEqual(new Date(2026, 9, 30, 21));
  });

  it('sin racha no avisa', () => {
    expect(planStreakAlert({ now, ...state, streakDays: 0 })).toBeNull();
  });

  it('si ya pasaron las 21 no avisa', () => {
    expect(planStreakAlert({ now: new Date(2026, 9, 29, 21, 30), ...state })).toBeNull();
  });

  it('con un protector libre aclara que se usa', () => {
    expect(planStreakAlert({ now, ...state, streakFreezes: 1 })!.body).toContain('protector');
    const busy = planStreakAlert({ now, ...state, streakFreezes: 1, freezePending: 1 });
    expect(busy!.body).not.toContain('protector');
  });
});

it('formatReminderTime', () => {
  expect(formatReminderTime({ hour: 8, minute: 5 })).toBe('08:05');
});
