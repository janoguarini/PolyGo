import { USERNAME_REGEX, suggestUsernames } from '../profile';

/** Azar fijo: los tests no dependen de Math.random. */
const fixed = () => 0.5;

describe('sugerencias de nombre de usuario', () => {
  it('propone variantes parecidas, válidas y distintas del nombre pedido', () => {
    const out = suggestUsernames('juan', fixed);
    expect(out.length).toBeGreaterThanOrEqual(6);
    expect(new Set(out).size).toBe(out.length);
    for (const s of out) {
      expect(s).toMatch(USERNAME_REGEX);
      expect(s).not.toBe('juan');
      expect(s).toContain('juan');
    }
    expect(out).toEqual(expect.arrayContaining(['juan_pro', 'the_juan', 'juan_fox']));
  });

  it('nunca pasa de 20 caracteres (recorta el nombre, no el agregado)', () => {
    const out = suggestUsernames('abcdefghijklmnopqrst', fixed);
    for (const s of out) expect(s.length).toBeLessThanOrEqual(20);
    expect(out).toContain('abcdefghijklmnop_pro');
  });

  it('normaliza tildes, mayúsculas y símbolos', () => {
    const out = suggestUsernames('  José-María! ', fixed);
    for (const s of out) expect(s).toMatch(USERNAME_REGEX);
    expect(out).toContain('josemaria_pro');
  });

  it('con un nombre muy corto igual arma sugerencias válidas', () => {
    for (const s of suggestUsernames('jo', fixed)) expect(s).toMatch(USERNAME_REGEX);
  });
});
