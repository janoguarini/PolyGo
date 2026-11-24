import assert from 'node:assert/strict';
import { test } from 'node:test';

import { Matchmaker } from '../src/matchmaking';

const entry = (userId: string, rating: number, joinedAt = 0, languageCode = 'en') => ({
  userId,
  rating,
  joinedAt,
  languageCode,
});

test('la ventana arranca en ±100 y se amplía +50 cada 5 s hasta ±400', () => {
  const mm = new Matchmaker();
  const e = entry('a', 1000, 0);
  assert.equal(mm.windowFor(e, 0), 100);
  assert.equal(mm.windowFor(e, 4_999), 100);
  assert.equal(mm.windowFor(e, 5_000), 150);
  assert.equal(mm.windowFor(e, 30_000), 400);
  assert.equal(mm.windowFor(e, 600_000), 400);
});

test('empareja dentro de la ventana y saca a ambos de la cola', () => {
  const mm = new Matchmaker();
  mm.join(entry('a', 1000));
  mm.join(entry('b', 1080));
  const pairs = mm.takePairs(0);
  assert.deepEqual(
    pairs.map(([x, y]) => [x.userId, y.userId]),
    [['a', 'b']],
  );
  assert.equal(mm.size, 0);
});

test('fuera de la ventana espera a que se amplíe para ambos', () => {
  const mm = new Matchmaker();
  mm.join(entry('a', 1000, 0));
  mm.join(entry('b', 1180, 0));
  assert.equal(mm.takePairs(0).length, 0);
  assert.equal(mm.takePairs(10_000).length, 1, '±200 a los 10 s');
});

test('quien recién entra no recibe un rival lejano aunque el otro espere hace rato', () => {
  const mm = new Matchmaker();
  mm.join(entry('veteran', 1000, 0));
  mm.join(entry('newbie', 1300, 30_000));
  assert.equal(mm.takePairs(30_000).length, 0);
  assert.equal(mm.takePairs(60_000).length, 1);
});

test('elige al rival más cercano y prioriza al que más espera', () => {
  const mm = new Matchmaker();
  mm.join(entry('a', 1000, 0));
  mm.join(entry('far', 1090, 1));
  mm.join(entry('near', 1010, 2));
  const [pair] = mm.takePairs(10);
  assert.deepEqual([pair![0].userId, pair![1].userId], ['a', 'near']);
  assert.ok(mm.get('far'));
});

test('no mezcla idiomas', () => {
  const mm = new Matchmaker();
  mm.join(entry('a', 1000, 0, 'en'));
  mm.join(entry('b', 1000, 0, 'pt'));
  assert.equal(mm.takePairs(60_000).length, 0);
});

test('reentrar no reinicia la espera; salir quita de la cola', () => {
  const mm = new Matchmaker();
  mm.join(entry('a', 1000, 0));
  mm.join(entry('a', 1010, 20_000));
  assert.equal(mm.get('a')!.joinedAt, 0);
  assert.equal(mm.get('a')!.rating, 1010);
  assert.equal(mm.leave('a'), true);
  assert.equal(mm.leave('a'), false);
  assert.equal(mm.size, 0);
});

test('con muchos jugadores arma varios pares sin repetir a nadie', () => {
  const mm = new Matchmaker();
  for (let i = 0; i < 9; i++) mm.join(entry(`p${i}`, 1000 + i * 10, i));
  const pairs = mm.takePairs(100);
  const ids = pairs.flat().map((e) => e.userId);
  assert.equal(pairs.length, 4);
  assert.equal(new Set(ids).size, 8);
  assert.equal(mm.size, 1);
});

test('seis cursos en la cola a la vez: cada pareja es del mismo idioma y nadie queda con otro curso', () => {
  const mm = new Matchmaker();
  const languages = ['en', 'fr', 'it', 'pt', 'zh', 'es'];
  // Dos jugadores por idioma, todos con el mismo rating: el idioma es lo único que los separa.
  for (const language of languages) {
    mm.join(entry(`${language}-1`, 500, 0, language));
    mm.join(entry(`${language}-2`, 500, 0, language));
  }
  // Uno más en francés, solo: aunque espere mucho, no se lo empareja con otro idioma.
  mm.join(entry('fr-solo', 500, 0, 'fr'));

  const pairs = mm.takePairs(600_000);
  assert.equal(pairs.length, languages.length);
  for (const [a, b] of pairs) assert.equal(a.languageCode, b.languageCode);
  assert.deepEqual(pairs.map(([a]) => a.languageCode).sort(), [...languages].sort());
  assert.equal(mm.size, 1);
  assert.equal(mm.takePairs(10 * 600_000).length, 0);
  // Sin rival de su curso, pasa al bot (si tiene cupo de calibración) después de la espera.
  assert.deepEqual(
    mm.takeWaitingLongerThan(1, 600_001).map((e) => [e.userId, e.languageCode]),
    [['fr-solo', 'fr']],
  );
});
