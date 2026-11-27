import { ACHIEVEMENT_FAMILIES, tierTitle } from '@shared/achievements';

import { achievementTitleFromEs } from '@/features/profile/strings';

describe('logros del feed de amigos (título en español, sin id)', () => {
  const family = ACHIEVEMENT_FAMILIES[0]!;
  const title = tierTitle(family, 2);

  it('en español queda igual', () => {
    expect(achievementTitleFromEs(title, 'es')).toBe(title);
  });

  it.each([
    ['en', 'Level 2'],
    ['pt-BR', 'Nível 2'],
    ['it', 'Livello 2'],
  ] as const)('%s traduce familia y nivel', (ui, level) => {
    const out = achievementTitleFromEs(title, ui);
    expect(out).toContain(level);
    expect(out).not.toContain('Nivel');
  });

  it('un título desconocido queda como vino', () => {
    expect(achievementTitleFromEs('Algo raro', 'it')).toBe('Algo raro');
    expect(achievementTitleFromEs('Nadie · Nivel 9', 'en')).toBe('Nadie · Nivel 9');
  });
});
