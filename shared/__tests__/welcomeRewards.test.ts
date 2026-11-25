import { readFileSync } from 'fs';
import { join } from 'path';

import { COSMETICS } from '../cosmetics';
import { WELCOME_REWARDS } from '../welcomeRewards';

const SQL = readFileSync(
  join(__dirname, '..', '..', 'supabase', 'migrations', '20261225120000_welcome_rewards.sql'),
  'utf8',
);

describe('recompensa de bienvenida', () => {
  it('la base replica los mismos premios que shared/welcomeRewards.ts', () => {
    const rows = [
      ...SQL.matchAll(
        /jsonb_build_object\('day', (\d+), 'kind', '(\w+)'(?:, 'item', '([\w-]+)')?, 'polys', (\d+)\)/g,
      ),
    ].map(([, day, kind, item, polys]) =>
      kind === 'item'
        ? { day: Number(day), kind, item, polys: Number(polys) }
        : { day: Number(day), kind, polys: Number(polys) },
    );
    expect(rows).toEqual(WELCOME_REWARDS);
  });

  it('los cosméticos existen, tienen arte y un repetido se paga a su precio', () => {
    for (const r of WELCOME_REWARDS) {
      if (r.kind !== 'item') continue;
      const item = COSMETICS.find((c) => c.id === r.item);
      expect(item).toBeDefined();
      expect(item!.available).toBe(true);
      expect(item!.price).toBe(r.polys);
    }
  });

  it('el check de la base conoce el nuevo motivo de Polys', () => {
    expect(SQL).toContain("'welcome_week'");
  });
});
