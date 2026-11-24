import { celebrationFor, daysLabel, monthGrid, monthRange, streakWeek } from '../streak';

const day = (streak_days: number, active_today: boolean, today_seconds = 0) => ({
  streak_days,
  active_today,
  today_seconds,
});

describe('celebrationFor', () => {
  it('festeja la primera sesión del día', () => {
    expect(celebrationFor(day(4, false), day(5, true, 120), 10)).toEqual({
      streakDays: 5,
      streakExtended: true,
      goalMet: false,
      goalMinutes: 10,
    });
  });

  it('festeja cumplir el objetivo aunque la racha ya hubiera sumado hoy', () => {
    const c = celebrationFor(day(5, true, 400), day(5, true, 620), 10);
    expect(c).toMatchObject({ streakExtended: false, goalMet: true });
  });

  it('festeja las dos cosas a la vez', () => {
    const c = celebrationFor(day(0, false), day(1, true, 700), 10);
    expect(c).toMatchObject({ streakDays: 1, streakExtended: true, goalMet: true });
  });

  it('no festeja de nuevo si ya estaban la racha y el objetivo', () => {
    expect(celebrationFor(day(5, true, 700), day(5, true, 900), 10)).toBeNull();
  });
});

describe('streakWeek', () => {
  // Jueves 29/10/2026.
  const today = new Date(2026, 9, 29, 15);

  it('termina hoy y marca los días de la racha', () => {
    const week = streakWeek(3, true, today);
    expect(week.map((d) => d.label)).toEqual(['Vi', 'Sá', 'Do', 'Lu', 'Ma', 'Mi', 'Ju']);
    expect(week.map((d) => d.active)).toEqual([false, false, false, false, true, true, true]);
    expect(week[6]!.isToday).toBe(true);
  });

  it('si hoy no hubo práctica, la racha termina ayer', () => {
    const week = streakWeek(2, false, today);
    expect(week.map((d) => d.active)).toEqual([false, false, false, false, true, true, false]);
  });
});

it('daysLabel usa singular y plural', () => {
  expect(daysLabel(1)).toBe('1 día');
  expect(daysLabel(7)).toBe('7 días');
});

describe('streakWeek con protector', () => {
  // Jueves 29/10/2026: el martes 27 lo cubrió un protector.
  const today = new Date(2026, 9, 29, 15);

  it('el día cubierto no cuenta como estudiado pero no corta la racha', () => {
    const week = streakWeek(3, true, today, ['2026-10-27']);
    expect(week.map((d) => d.active)).toEqual([false, false, false, true, false, true, true]);
    expect(week.map((d) => d.frozen)).toEqual([false, false, false, false, true, false, false]);
  });
});

describe('calendario de racha', () => {
  // Lunes 23/11/2026.
  const today = new Date(2026, 10, 23, 12);

  it('rango del mes, incluido febrero', () => {
    expect(monthRange(2026, 10)).toEqual({ from: '2026-11-01', to: '2026-11-30' });
    expect(monthRange(2028, 1)).toEqual({ from: '2028-02-01', to: '2028-02-29' });
  });

  it('semanas desde el lunes, con casillas vacías alrededor del mes', () => {
    // Noviembre 2026 empieza un domingo: seis casillas vacías antes del 1.
    const weeks = monthGrid(2026, 10, [], [], today);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]!.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(weeks[0]![6]!.day).toBe(1);
    const days = weeks.flat().filter((d) => d !== null);
    expect(days).toHaveLength(30);
  });

  it('marca sólo los días reales: estudiados, protegidos, hoy y futuros', () => {
    const days = monthGrid(
      2026,
      10,
      ['2026-11-20', '2026-11-23', '2026-10-31'],
      ['2026-11-21', '2026-11-23'],
      today,
    )
      .flat()
      .filter((d) => d !== null);
    const byDay = (n: number) => days.find((d) => d.day === n)!;
    expect(days.filter((d) => d.studied).map((d) => d.day)).toEqual([20, 23]);
    expect(byDay(21)).toMatchObject({ studied: false, frozen: true });
    // Un día estudiado no se muestra como protegido.
    expect(byDay(23)).toMatchObject({ studied: true, frozen: false, isToday: true });
    expect(byDay(22)).toMatchObject({ studied: false, frozen: false, isFuture: false });
    expect(byDay(24).isFuture).toBe(true);
  });
});
