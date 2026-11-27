import { ARCADE } from '@shared/arcade';
import { ARCADE_PROTOCOL_VERSION, PROTOCOL_VERSION, WORD_RUSH } from '@shared/protocol';

import { arcadeStrings } from '@/features/battle/arcade/strings';
import { usesArcadeShell } from '@/features/battle/format';
import { INTERFACE_LANGUAGES } from '@/i18n';
import { battleScreenStrings } from '@/i18n/screens/battle';

/**
 * Qué pantalla y qué reglas ve cada partida. Lo que pasa en el servidor (amistosos de protocolo 3 en
 * Arcade) lo prueba server/test/friendly.test.ts; acá, que la app muestre el formato que llega.
 */
const base = {
  arcadeCapable: true,
  friendly: false,
  hasArcade: false,
  rankedSearch: false,
} as const;

describe('formato de la partida y sus reglas', () => {
  it('la app nueva habla el protocolo de Arcade', () => {
    expect(PROTOCOL_VERSION).toBe(ARCADE_PROTOCOL_VERSION);
  });

  it('las duraciones no cambian: Arcade 60 s, Word Rush clásico 75 s (builds anteriores)', () => {
    expect(ARCADE.durationMs).toBe(60_000);
    expect(WORD_RUSH.durationMs).toBe(75_000);
  });

  it('amistoso con servidor: en cuanto llegan los datos Arcade, pantalla Arcade', () => {
    for (const phase of ['found', 'countdown', 'playing'] as const)
      expect(usesArcadeShell({ ...base, friendly: true, hasArcade: true, phase })).toBe(true);
  });

  it('amistoso sin datos Arcade (servidor clásico o build anterior): pantalla clásica', () => {
    for (const phase of ['found', 'countdown', 'playing'] as const)
      expect(usesArcadeShell({ ...base, friendly: true, hasArcade: false, phase })).toBe(false);
  });

  it('partida local (sin servidor de partidas): siempre pantalla clásica', () => {
    for (const friendly of [false, true])
      for (const phase of ['found', 'countdown', 'playing'] as const)
        expect(
          usesArcadeShell({ ...base, arcadeCapable: false, friendly, hasArcade: false, phase }),
        ).toBe(false);
  });

  it('Ranked Arcade: pantalla Arcade desde la búsqueda, la cuenta regresiva y el juego', () => {
    expect(usesArcadeShell({ ...base, phase: 'searching', rankedSearch: true })).toBe(true);
    expect(usesArcadeShell({ ...base, phase: 'countdown' })).toBe(true);
    expect(usesArcadeShell({ ...base, phase: 'found', hasArcade: true })).toBe(true);
    expect(usesArcadeShell({ ...base, phase: 'playing', hasArcade: true })).toBe(true);
    expect(usesArcadeShell({ ...base, phase: 'finished', hasArcade: true })).toBe(false);
  });

  it.each(INTERFACE_LANGUAGES)('%s: cada pantalla muestra la duración de su formato', (ui) => {
    // Arcade (ArcadeLobby) habla de 60 s; la clásica, de 75 s. Nunca al revés.
    const arcadeRules = arcadeStrings[ui].rules;
    const classicRules = battleScreenStrings[ui].rules;
    expect(arcadeRules).toContain(String(ARCADE.durationMs / 1000));
    expect(arcadeRules).not.toContain(String(WORD_RUSH.durationMs / 1000));
    expect(classicRules).toContain(String(WORD_RUSH.durationMs / 1000));
  });
});
