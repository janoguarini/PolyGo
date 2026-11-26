import { annualSavings, formatPerMonth, outcomeOfError, type StorePlan } from '../store';
import { parseEntitlements } from '../entitlements';

jest.mock('@/lib/supabase', () => ({ requireSupabase: jest.fn() }));
jest.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ session: null }) }));

const plan = (price: number, currencyCode = 'USD'): StorePlan => ({
  packageId: 'p',
  productId: 'x',
  priceString: `${currencyCode} ${price}`,
  price,
  currencyCode,
});

describe('ahorro del plan anual (precios reales de la tienda)', () => {
  it('compara contra 12 meses del mensual, sin redondear a favor', () => {
    // USD 4,99/mes y 29,99/año: 59,88 → ahorro 49,9 % → 49 %.
    expect(annualSavings(plan(4.99), plan(29.99))).toEqual({ percent: 49, perMonth: 2.49 });
  });

  it('no inventa un descuento: monedas distintas, falta un plan o no hay ahorro', () => {
    expect(annualSavings(plan(4.99, 'USD'), plan(29.99, 'EUR'))).toBeNull();
    expect(annualSavings(null, plan(29.99))).toBeNull();
    expect(annualSavings(plan(4.99), null)).toBeNull();
    expect(annualSavings(plan(1), plan(12))).toBeNull();
    expect(annualSavings(plan(0), plan(10))).toBeNull();
  });

  it('formatea el precio mensual equivalente en la moneda del usuario', () => {
    expect(formatPerMonth(2.49, 'USD', 'en-US')).toBe('$2.49');
    expect(formatPerMonth(2.49, 'NOT_A_CURRENCY', 'en-US')).toBeNull();
  });
});

describe('resultado de una compra', () => {
  it('clasifica los errores de RevenueCat', () => {
    expect(outcomeOfError({ code: '1', userCancelled: true })).toBe('cancelled');
    expect(outcomeOfError({ userCancelled: true })).toBe('cancelled');
    expect(outcomeOfError({ code: '10' })).toBe('offline');
    expect(outcomeOfError({ code: '35' })).toBe('offline');
    expect(outcomeOfError({ code: '20' })).toBe('pending');
    expect(outcomeOfError({ code: '3' })).toBe('not_allowed');
    expect(outcomeOfError({ code: '5' })).toBe('error');
    expect(outcomeOfError(new Error('x'))).toBe('error');
    expect(outcomeOfError(null)).toBe('error');
  });
});

describe('get_entitlements', () => {
  it('lee lo que devuelve el servidor', () => {
    expect(
      parseEntitlements({
        server_now: '2026-11-25T00:00:00Z',
        plus: true,
        ad_free: true,
        plus_detail: {
          source: 'app_store',
          product_id: 'polygo_plus_annual',
          expires_at: '2027-11-25T00:00:00Z',
          will_renew: false,
          billing_issue: false,
        },
      }),
    ).toEqual({
      plus: true,
      adFree: true,
      serverNow: '2026-11-25T00:00:00Z',
      detail: {
        source: 'app_store',
        productId: 'polygo_plus_annual',
        expiresAt: '2027-11-25T00:00:00Z',
        willRenew: false,
        billingIssue: false,
      },
    });
  });

  it('sin datos o con basura: nada de Plus', () => {
    const r = parseEntitlements(null);
    expect(r.plus).toBe(false);
    expect(r.adFree).toBe(false);
    expect(r.detail).toBeNull();
    // Un booleano «truthy» que no es true no da Plus.
    expect(parseEntitlements({ plus: 'true', ad_free: 1 }).plus).toBe(false);
  });
});
