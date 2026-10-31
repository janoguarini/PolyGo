import { grantSummary } from '../PolysToast';

describe('grantSummary', () => {
  it('suma y agrupa ganancias del mismo tipo', () => {
    expect(
      grantSummary([
        { reason: 'mission', ref: 'a', amount: 5 },
        { reason: 'mission', ref: 'b', amount: 5 },
      ]),
    ).toEqual({ total: 10, label: 'Misión completada ×2' });
  });

  it('una sola ganancia lleva su texto y varias distintas se resumen', () => {
    expect(grantSummary([{ reason: 'welcome', ref: 'welcome', amount: 100 }])).toEqual({
      total: 100,
      label: 'Regalo de bienvenida',
    });
    expect(
      grantSummary([
        { reason: 'ranked_win', ref: 'x', amount: 3 },
        { reason: 'rank', ref: '1:silver', amount: 50 },
      ]),
    ).toEqual({ total: 53, label: 'Recompensas' });
  });
});
