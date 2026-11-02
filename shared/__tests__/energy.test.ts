import { ENERGY, formatEnergyWait, projectEnergy, type EnergySnapshot } from '../energy';

const H = 3600 * 1000;
const NOW = Date.parse('2026-11-01T12:00:00Z');

const snap = (over: Partial<EnergySnapshot> = {}): EnergySnapshot => ({
  plus: false,
  plus_expires_at: null,
  energy: 2,
  max: ENERGY.max,
  regen_seconds: ENERGY.regenSeconds,
  lesson_cost: ENERGY.lessonCost,
  next_unit_at: new Date(NOW + H).toISOString(),
  full_at: new Date(NOW + 7 * H).toISOString(),
  server_now: new Date(NOW).toISOString(),
  ...over,
});

describe('projectEnergy', () => {
  it('cuenta regresiva hasta la próxima unidad y hasta llenarse', () => {
    const v = projectEnergy(snap(), NOW);
    expect(v).toMatchObject({ energy: 2, msToNext: H, msToFull: 7 * H, canStartLesson: true });
  });

  it('suma las unidades recuperadas desde la lectura sin pasarse del máximo', () => {
    expect(projectEnergy(snap(), NOW + H).energy).toBe(3);
    expect(projectEnergy(snap(), NOW + H).msToNext).toBe(3 * H);
    expect(projectEnergy(snap(), NOW + 4 * H + 1).energy).toBe(4);
    const full = projectEnergy(snap(), NOW + 100 * H);
    expect(full).toMatchObject({ energy: ENERGY.max, msToNext: null, msToFull: null });
  });

  it('sin energía no deja empezar una lección', () => {
    const v = projectEnergy(snap({ energy: 0 }), NOW);
    expect(v.canStartLesson).toBe(false);
    expect(projectEnergy(snap({ energy: 0 }), NOW + H).canStartLesson).toBe(true);
  });

  it('con Plus siempre se puede y no hay reloj', () => {
    const v = projectEnergy(snap({ plus: true, energy: 0, next_unit_at: null }), NOW);
    expect(v).toMatchObject({ plus: true, canStartLesson: true, msToNext: null });
  });
});

describe('formatEnergyWait', () => {
  it.each([
    [0, 'menos de 1 min'],
    [30_000, '1 min'],
    [40 * 60_000, '40 min'],
    [2 * H, '2 h'],
    [2 * H + 15 * 60_000, '2 h 15 min'],
  ])('%d ms → %s', (ms, text) => {
    expect(formatEnergyWait(ms)).toBe(text);
  });
});
