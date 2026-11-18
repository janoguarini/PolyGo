import { orderByRoute, withStatus, type UnitSummary } from '../curriculum';

/** Fase C.4: la app dibuja el camino en el orden de la ruta del usuario (my_curriculum_route). */

const unit = (n: number, lessons = 2): UnitSummary => {
  const id = `a1-u${String(n).padStart(2, '0')}`;
  return {
    id,
    level: 'A1',
    position: n,
    title: id,
    titleEn: id,
    description: '',
    emoji: '',
    lessons: Array.from({ length: lessons }, (_, i) => ({
      id: `${id}-l0${i + 1}`,
      unitId: id,
      position: i + 1,
      title: '',
      objective: '',
      exerciseCount: 10,
    })),
  };
};
const V1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const V2 = [1, 2, 3, 13, 4, 5, 6, 7, 14, 8, 9, 10, 11, 12];
const routeOf = (order: number[]) =>
  new Map(order.map((n, i) => [`a1-u${String(n).padStart(2, '0')}`, i + 1]));
const ids = (units: { id: string }[]) => units.map((u) => Number(u.id.slice(4)));
/** Lo que haría fetchCurriculum: ordenar y tomar la posición de la ruta. */
const apply = (units: UnitSummary[], route: Map<string, number> | null) =>
  orderByRoute(units, route).map((u) => ({ ...u, position: route?.get(u.id) ?? u.position }));
const done = (...unitsDone: number[]) =>
  unitsDone.flatMap((n) =>
    [1, 2].map((i) => ({
      lessonId: `a1-u${String(n).padStart(2, '0')}-l0${i}`,
      timesCompleted: 1,
      bestAccuracy: 1,
    })),
  );

describe('orden del camino por ruta', () => {
  const all = [...V1, 13, 14].map((n) => unit(n));

  it('sin ruta (backend anterior o sin sesión): el orden por posición de siempre', () => {
    expect(
      ids(
        apply(
          V1.map((n) => unit(n)),
          null,
        ),
      ),
    ).toEqual(V1);
  });

  it('ruta v1: U1–U12 en el mismo orden; U13 y U14, aunque estén publicadas, no son parte del camino', () => {
    const units = apply(all, routeOf(V1));
    expect(ids(units)).toEqual(V1);
    expect(units.map((u) => u.position)).toEqual(V1);
  });

  it('ruta v2: U13 después de U3 y U14 después de U7, numeradas por su lugar en la ruta', () => {
    const units = apply(all, routeOf(V2));
    expect(ids(units)).toEqual(V2);
    expect(units.find((u) => u.id === 'a1-u13')!.position).toBe(4);
    expect(units.find((u) => u.id === 'a1-u04')!.position).toBe(5);
  });

  it('v2: al terminar U3 toca U13 y U4 queda bloqueada; al terminar U7 toca U14 y U8 queda bloqueada', () => {
    const units = apply(all, routeOf(V2));
    const at = (progress: ReturnType<typeof done>) => {
      const r = withStatus(units, progress);
      const status = (id: string) =>
        r.units.flatMap((u) => u.lessons).find((l) => l.id === id)!.status;
      return { current: r.currentByLevel.A1?.id, status };
    };
    const u3 = at(done(1, 2, 3));
    expect(u3.current).toBe('a1-u13-l01');
    expect(u3.status('a1-u04-l01')).toBe('locked');
    expect(at(done(1, 2, 3, 13)).current).toBe('a1-u04-l01');
    const u7 = at(done(1, 2, 3, 13, 4, 5, 6, 7));
    expect(u7.current).toBe('a1-u14-l01');
    expect(u7.status('a1-u08-l01')).toBe('locked');
    expect(at(done(1, 2, 3, 13, 4, 5, 6, 7, 14)).current).toBe('a1-u08-l01');
  });

  it('v1: terminar U3 lleva a U4 y terminar U7 a U8, como antes', () => {
    const units = apply(all, routeOf(V1));
    expect(withStatus(units, done(1, 2, 3)).currentByLevel.A1?.id).toBe('a1-u04-l01');
    expect(withStatus(units, done(1, 2, 3, 4, 5, 6, 7)).currentByLevel.A1?.id).toBe('a1-u08-l01');
  });
});
