import { PLUS_PLANS, annualDeal, formatUsd } from '../purchases';

describe('planes de Plus', () => {
  it('el anual sale de los precios: por mes, descuento y ahorro', () => {
    expect(PLUS_PLANS.monthly.amount).toBe(4.99);
    expect(PLUS_PLANS.annual.amount).toBe(34.99);
    expect(annualDeal()).toEqual({ perMonth: 2.92, discountPercent: 42, savings: 24.89 });
  });

  it('formatea con el código adelante y el separador del idioma', () => {
    expect(formatUsd(4.99, 'en')).toBe('USD 4.99');
    expect(formatUsd(4.99, 'es')).toMatch(/^USD 4[,.]99$/);
  });
});
