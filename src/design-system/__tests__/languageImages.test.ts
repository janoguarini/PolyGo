import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { LANGUAGES } from '@shared/languages';

import { LANGUAGE_BACKGROUNDS, languageBackground } from '../languageImages';

const ROOT = join(__dirname, '../../..');

describe('fondos de Aprender por idioma', () => {
  // Un idioma nuevo puede no tener escena (usa el fondo predeterminado), pero cada escena debe ser
  // de un idioma que existe.
  it('cada fondo es de un idioma de Polygo', () => {
    const codes = LANGUAGES.map((l) => l.code);
    for (const code of Object.keys(LANGUAGE_BACKGROUNDS)) expect(codes).toContain(code);
  });

  it.each(Object.keys(LANGUAGE_BACKGROUNDS))('%s: el archivo existe', (code) => {
    expect(existsSync(join(ROOT, `assets/languages/${code}.webp`))).toBe(true);
  });

  it('un código desconocido no tiene fondo (queda la cordillera)', () => {
    expect(languageBackground('xx')).toBeUndefined();
    expect(languageBackground(null)).toBeUndefined();
    expect(languageBackground('fr')).toBe(LANGUAGE_BACKGROUNDS.fr);
  });
});
