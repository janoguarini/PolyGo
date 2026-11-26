import { accountsInWebhook, isAccountId, snapshotFromRevenueCat } from '../storeEntitlements';

const USER = '0b9e6a4e-6f0e-4f38-9b8a-1f2a3b4c5d6e';
const OTHER = '11111111-2222-4333-8444-555555555555';

describe('snapshotFromRevenueCat', () => {
  it('suscripción activa de App Store', () => {
    const s = snapshotFromRevenueCat({
      subscriber: {
        entitlements: {
          polygo_pro: {
            product_identifier: 'polygo_plus_annual',
            expires_date: '2027-01-01T00:00:00Z',
            purchase_date: '2026-01-01T00:00:00Z',
          },
        },
        subscriptions: {
          polygo_plus_annual: { store: 'app_store', store_transaction_id: 'tx' },
        },
      },
    });
    expect(s.plus).toEqual({
      source: 'app_store',
      product_id: 'polygo_plus_annual',
      starts_at: '2026-01-01T00:00:00Z',
      expires_at: '2027-01-01T00:00:00Z',
      will_renew: true,
      billing_issue_at: null,
      external_id: 'tx',
    });
    expect(s.ad_free).toBeNull();
  });

  it('cancelada, con gracia y con reembolso', () => {
    const base = (sub: object, ent: object = {}) =>
      snapshotFromRevenueCat({
        subscriber: {
          entitlements: {
            polygo_pro: { product_identifier: 'm', expires_date: '2026-02-01T00:00:00Z', ...ent },
          },
          subscriptions: { m: { store: 'play_store', ...sub } },
        },
      }).plus!;
    expect(base({ unsubscribe_detected_at: '2026-01-10T00:00:00Z' }).will_renew).toBe(false);
    expect(
      base(
        { billing_issues_detected_at: '2026-02-01T00:00:00Z' },
        { grace_period_expires_date: '2026-02-08T00:00:00Z' },
      ),
    ).toMatchObject({
      expires_at: '2026-02-08T00:00:00Z',
      billing_issue_at: '2026-02-01T00:00:00Z',
    });
    expect(base({ refunded_at: '2026-01-15T00:00:00Z' })).toMatchObject({
      expires_at: '2026-01-15T00:00:00Z',
      will_renew: false,
    });
  });

  it('compra única Sin publicidad (sin vencimiento)', () => {
    const s = snapshotFromRevenueCat({
      subscriber: {
        entitlements: { ad_free: { product_identifier: 'polygo_remove_ads', expires_date: null } },
        non_subscriptions: { polygo_remove_ads: [{ id: 'n1', store: 'play_store' }] },
      },
    });
    expect(s.ad_free).toMatchObject({ source: 'play_store', expires_at: null, external_id: 'n1' });
    expect(s.plus).toBeNull();
  });

  it('tiendas que PolyGo no vende no otorgan nada', () => {
    const s = snapshotFromRevenueCat({
      subscriber: {
        entitlements: { polygo_pro: { product_identifier: 'p', expires_date: null } },
        subscriptions: { p: { store: 'stripe' } },
      },
    });
    expect(s.plus).toBeNull();
  });

  it('respuesta vacía: no tiene nada', () => {
    expect(snapshotFromRevenueCat({})).toEqual({ plus: null, ad_free: null });
  });
});

describe('webhook', () => {
  it('sólo toma ids de cuentas PolyGo, sin anónimos ni repetidos', () => {
    expect(
      accountsInWebhook({
        event: {
          type: 'TRANSFER',
          app_user_id: USER,
          original_app_user_id: '$RCAnonymousID:abc',
          aliases: [USER.toUpperCase()],
          transferred_from: [OTHER],
          transferred_to: [USER],
        },
      }),
    ).toEqual([USER, OTHER]);
    expect(accountsInWebhook(null)).toEqual([]);
    expect(accountsInWebhook({ event: 'x' })).toEqual([]);
    expect(isAccountId('not-a-uuid')).toBe(false);
  });
});
