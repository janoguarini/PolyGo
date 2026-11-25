import { shuffle } from '../../src/features/learning/random';
import { choiceSeed, SHUFFLE_V1, shuffleOrderV1 } from '../shuffle';

/**
 * `polygo.shuffle.v1` (shared/shuffle.ts) congelado: un cambio de salida exige `polygo.shuffle.v2`.
 * Es el algoritmo que usa la app para ordenar las opciones (src/features/learning/random.ts).
 */
describe('polygo.shuffle.v1', () => {
  it('nombre del algoritmo', () => {
    expect(SHUFFLE_V1).toBe('polygo.shuffle.v1');
  });

  it('salidas congeladas', () => {
    const frozen: [number, string, number[]][] = [
      [4, 'a:b', [2, 3, 0, 1]],
      [4, '00000000-0000-4000-8000-000000000000:a1-u01-l01-e01', [3, 2, 0, 1]],
      [3, 'x', [2, 0, 1]],
      [5, 'seed', [2, 1, 3, 0, 4]],
      [6, '会话:练习', [2, 3, 4, 5, 0, 1]],
      [2, '', [0, 1]],
    ];
    for (const [n, seed, order] of frozen) expect(shuffleOrderV1(n, seed)).toEqual(order);
  });

  it('es el shuffle de la app: mismo orden para cualquier semilla y cantidad', () => {
    for (let n = 0; n <= 8; n++) {
      const items = Array.from({ length: n }, (_, i) => `op${i}`);
      for (let k = 0; k < 300; k++) {
        const seed = choiceSeed(`s-${k}`, `e-${n}-${k * 7}`);
        expect(shuffleOrderV1(n, seed).map((i) => items[i])).toEqual(shuffle(items, seed));
      }
    }
  });

  it('devuelve una permutación de 0..n-1 y rechaza n inválido', () => {
    const order = shuffleOrderV1(7, 'p');
    expect([...order].sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(() => shuffleOrderV1(-1, 'p')).toThrow();
    expect(() => shuffleOrderV1(1.5, 'p')).toThrow();
  });

  it('la semilla de la app es <sesión>:<ejercicio>', () => {
    expect(choiceSeed('abc', 'a1-u01-l01-e01')).toBe('abc:a1-u01-l01-e01');
  });
});
