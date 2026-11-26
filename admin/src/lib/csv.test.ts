import assert from 'node:assert/strict';
import { test } from 'node:test';

import { csvCell, toCsv } from './csv.ts';

test('CSV: neutraliza fórmulas (un username puede ser «=HYPERLINK(...)»)', () => {
  assert.equal(csvCell('=HYPERLINK("http://x")'), `"'=HYPERLINK(""http://x"")"`);
  assert.equal(csvCell('+1'), "'+1");
  assert.equal(csvCell('-2'), "'-2");
  assert.equal(csvCell('@cmd'), "'@cmd");
  assert.equal(csvCell(-2), '-2', 'los números negativos reales no se tocan');
});

test('CSV: comillas, comas, saltos y vacíos', () => {
  assert.equal(csvCell('a,b'), '"a,b"');
  assert.equal(csvCell('di "hola"'), '"di ""hola"""');
  assert.equal(csvCell('a\nb'), '"a\nb"');
  assert.equal(csvCell(null), '');
  assert.equal(
    toCsv([{ key: 'u', label: 'Usuario' }, { key: 'n', label: 'N' }], [{ u: 'ana', n: 3 }, { u: null, n: 0 }]),
    'Usuario,N\r\nana,3\r\n,0',
  );
});
