import { coachTrialRemaining, FREE_LIMITS, resolveEntitlements } from '../plus';

describe('resolveEntitlements', () => {
  it('Free: ningún beneficio', () => {
    const e = resolveEntitlements({ plus: false, adFree: false });
    expect(Object.values(e).every((v) => v === false)).toBe(true);
  });

  it('Plus: todos los beneficios, incluido sin publicidad', () => {
    const e = resolveEntitlements({ plus: true, adFree: false });
    expect(Object.values(e).every((v) => v === true)).toBe(true);
  });

  it('Sin publicidad (compra única) sólo quita anuncios', () => {
    const e = resolveEntitlements({ plus: false, adFree: true });
    expect(e.noAds).toBe(true);
    expect(e.isPlus).toBe(false);
    expect(e.unlimitedEnergy).toBe(false);
    expect(e.unlimitedCoach).toBe(false);
  });

  it('mientras no se sabe, no se asume nada', () => {
    const e = resolveEntitlements({ plus: undefined, adFree: undefined });
    expect(Object.values(e).every((v) => v === undefined)).toBe(true);
    // Plus confirmado alcanza para quitar anuncios aunque falte Sin publicidad.
    expect(resolveEntitlements({ plus: true, adFree: undefined }).noAds).toBe(true);
    expect(resolveEntitlements({ plus: false, adFree: undefined }).noAds).toBeUndefined();
  });

  it('perder Plus vuelve a las reglas gratis', () => {
    const before = resolveEntitlements({ plus: true, adFree: false });
    const after = resolveEntitlements({ plus: false, adFree: false });
    expect(before.unlimitedEnergy).toBe(true);
    expect(after.unlimitedEnergy).toBe(false);
  });

  it('no existe ningún permiso de Ranked: pagar nunca cambia las partidas', () => {
    const keys = Object.keys(resolveEntitlements({ plus: true, adFree: true }));
    expect(keys.some((k) => /rank|elo|battle|match/i.test(k))).toBe(false);
  });
});

describe('sesiones de prueba del Coach', () => {
  it('2 por cuenta y nunca negativo', () => {
    expect(FREE_LIMITS.coachTrialSessions).toBe(2);
    expect(coachTrialRemaining(0)).toBe(2);
    expect(coachTrialRemaining(1)).toBe(1);
    expect(coachTrialRemaining(2)).toBe(0);
    expect(coachTrialRemaining(5)).toBe(0);
    expect(coachTrialRemaining(-1)).toBe(2);
  });
});
