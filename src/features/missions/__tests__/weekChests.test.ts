import { buildWeek, isoWeekRef, weekDays } from '../weekChests';

describe('semana de cofres', () => {
  it('va de lunes a domingo', () => {
    // 2026-11-21 es sábado.
    expect(weekDays('2026-11-21')).toEqual([
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
      '2026-11-19',
      '2026-11-20',
      '2026-11-21',
      '2026-11-22',
    ]);
    expect(weekDays('2026-11-16')[0]).toBe('2026-11-16');
    expect(weekDays('2026-11-22')[0]).toBe('2026-11-16');
  });

  it('la semana ISO coincide con to_char(fecha, IYYY-IW)', () => {
    expect(isoWeekRef('2026-11-21')).toBe('2026-47');
    expect(isoWeekRef('2026-01-01')).toBe('2026-01');
    // El 1 de enero de 2027 es viernes: pertenece a la semana 53 de 2026.
    expect(isoWeekRef('2027-01-01')).toBe('2026-53');
    expect(isoWeekRef('2024-12-30')).toBe('2025-01');
  });

  it('marca los cofres reales de la semana y el bonus cobrado', () => {
    const week = buildWeek('2026-11-21', [
      { reason: 'chest', ref: '2026-11-16', amount: 14 },
      { reason: 'chest', ref: '2026-11-18', amount: 50 },
      { reason: 'chest', ref: '2026-11-09', amount: 12 },
      { reason: 'weekly', ref: '2026-47', amount: 50 },
    ]);
    expect(week.days.map((d) => d.polys)).toEqual([14, null, 50, null, null, null, null]);
    expect(week.weeklyBonus).toBe(50);
  });

  it('sin bonus de esta semana, null', () => {
    expect(buildWeek('2026-11-21', [{ reason: 'weekly', ref: '2026-46', amount: 50 }]).weeklyBonus).toBeNull();
  });
});
