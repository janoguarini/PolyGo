import { missionDestination, missionTitle } from '../missions';

// Que la base sólo elija misiones con texto en la app: supabase/tests/missions.test.mjs.
describe('misiones diarias', () => {
  it('textos en singular y plural', () => {
    expect(missionTitle('lessons', 1)).toBe('Completá 1 lección');
    expect(missionTitle('lessons', 3)).toBe('Completá 3 lecciones');
    expect(missionTitle('ranked_play', 1)).toBe('Jugá 1 partida ranked');
    expect(missionTitle('ranked_play', 2)).toBe('Jugá 2 partidas ranked');
    expect(missionTitle('minutes', 10)).toBe('Estudiá 10 minutos');
  });

  it('las de ranked llevan a Ranked y el resto a Aprender', () => {
    expect(missionDestination('ranked_win')).toBe('ranked');
    expect(missionDestination('perfect')).toBe('learn');
  });
});
