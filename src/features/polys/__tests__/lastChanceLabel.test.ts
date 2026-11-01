import { lastChanceLabel } from '../lastChance';

describe('lastChanceLabel', () => {
  const now = new Date(2026, 10, 2, 15, 0); // lunes 2 de noviembre de 2026

  it('hoy, mañana o el día de la semana', () => {
    expect(lastChanceLabel('2026-11-02', now)).toBe('hoy');
    expect(lastChanceLabel('2026-11-03', now)).toBe('mañana');
    expect(lastChanceLabel('2026-11-04', now)).toBe('el miércoles');
  });
});
