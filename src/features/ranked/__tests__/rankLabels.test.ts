import { TIERS, getRank } from '@shared/ranking';

import { rankLabel, rankLabelForRating, tierName, unplacedLabel } from '@/features/ranked/strings';
import { INTERFACE_LANGUAGES } from '@/i18n';
import { languageName, languageShortName } from '@/i18n/languages';

/**
 * Los rangos se muestran en el idioma de la interfaz por id de tier; shared/ranking.ts (que usa el
 * servidor de partidas) sigue en español y no cambia.
 */
describe('nombres de rango en los cuatro idiomas', () => {
  const expected = {
    es: ['Bronce', 'Plata', 'Oro', 'Platino', 'Esmeralda', 'Diamante', 'Maestro', 'Gran Maestro'],
    en: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster'],
    'pt-BR': [
      'Bronze',
      'Prata',
      'Ouro',
      'Platina',
      'Esmeralda',
      'Diamante',
      'Mestre',
      'Grão-Mestre',
    ],
    it: ['Bronzo', 'Argento', 'Oro', 'Platino', 'Smeraldo', 'Diamante', 'Maestro', 'Gran Maestro'],
  } as const;

  it.each(INTERFACE_LANGUAGES)('%s', (ui) => {
    expect(TIERS.map((t) => tierName(t.id, ui))).toEqual(expected[ui]);
  });

  it('la fuente compartida sigue en español', () => {
    expect(TIERS.map((t) => t.name)).toEqual(expected.es);
    expect(getRank(450).label).toBe('Plata III');
  });

  it('las divisiones se conservan', () => {
    const rank = getRank(450);
    expect(rankLabel(rank, 'pt-BR')).toBe('Prata III');
    expect(rankLabel(rank, 'it')).toBe('Argento III');
    expect(rankLabelForRating(2300, 'pt-BR')).toBe('Grão-Mestre');
  });

  it('sin posicionar', () => {
    expect(INTERFACE_LANGUAGES.map((ui) => unplacedLabel(ui))).toEqual([
      'Sin posicionar',
      'Unranked',
      'Sem classificação',
      'Non classificato',
    ]);
  });
});

describe('nombres de idiomas según la interfaz', () => {
  it('traduce el idioma que se aprende', () => {
    expect(INTERFACE_LANGUAGES.map((ui) => languageName('en', ui))).toEqual([
      'Inglés',
      'English',
      'Inglês',
      'Inglese',
    ]);
    expect(INTERFACE_LANGUAGES.map((ui) => languageShortName('zh', ui))).toEqual([
      'Chino',
      'Chinese',
      'Chinês',
      'Cinese',
    ]);
    expect(languageName('es', 'it')).toBe('Spagnolo');
  });
});
