import { esB1PublishSql } from '../../scripts/build-es-b1-publish-sql';
import { esB1Sql } from '../../scripts/build-es-b1-sql';
import { ITEM_REGISTRY_PATH } from '../comprehension';
import { ES_B1, ES_B1_PATH, ES_COURSE, ES_PATH } from '../es-course';
import { ES_B1_WRITING_TASKS } from '../es/b1';
import { esProblems, esWritingProblems } from '../es-checks';
import { WRITING_TASKS } from '../writing';

/** Español B1 U1–U12 (docs/ES_B1.md). */
describe('español B1', () => {
  it('12 unidades seguidas, 5 lecciones escritas y 10 en el camino cada una', () => {
    expect(ES_B1.units.map((u) => u.unit.position)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    for (const u of ES_B1.units) expect(u.unit.lessons).toHaveLength(5);
    expect(ES_B1_PATH).toHaveLength(12);
    for (const p of ES_B1_PATH) {
      expect(p.level).toBe('B1');
      expect(p.lessons).toHaveLength(10);
      expect(p.lessons[0]!.id).toBe(`es-b1-u${String(p.unit.position).padStart(2, '0')}-l01`);
    }
  });

  it('el validador del español no encuentra problemas (A1, A2 y B1)', () => {
    // Una sola pasada: cada llamada recorre todo el curso.
    expect(esProblems()).toEqual([]);
    expect(ES_COURSE.map((l) => l.level)).toEqual(['A1', 'A2']);
  });

  it('escritura: una tarea guiada por unidad (L5) y tres libres (U4, U8, U12), válidas y ofrecidas', () => {
    expect(esWritingProblems()).toEqual([]);
    const guided = ES_B1_WRITING_TASKS.filter((t) => t.kind === 'guided');
    const free = ES_B1_WRITING_TASKS.filter((t) => t.kind === 'free');
    expect(guided.map((t) => t.lesson).sort()).toEqual(
      ES_B1.units.map((u) => `es-b1-u${String(u.unit.position).padStart(2, '0')}-l05`),
    );
    expect(free.map((t) => t.lesson).sort()).toEqual([
      'es-b1-u04-final',
      'es-b1-u08-final',
      'es-b1-u12-final',
    ]);
    for (const t of ES_B1_WRITING_TASKS) expect(WRITING_TASKS).toContain(t);
  });

  it('vive en su propio camino: no cambia ES_PATH (carga del A1/A2, nivelación y Ranked)', () => {
    expect(ES_PATH.every((p) => p.level !== 'B1')).toBe(true);
    expect(ES_PATH).toHaveLength(29);
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(ES_B1_PATH));
  });

  it('todos los ejercicios escritos tienen su id definitivo (content:ids)', () => {
    for (const u of ES_B1.units)
      for (const l of u.unit.lessons)
        for (const e of l.exercises) expect(e.id).toMatch(/^es\.ex\.[0-9a-z]{14}$/);
  });

  it('la carga y la publicación son deterministas y sólo tocan el B1', () => {
    const a = esB1Sql();
    expect(esB1Sql().sql).toBe(a.sql);
    expect(a.document.units.map((u) => u.id)).toEqual(
      ES_B1_PATH.map((p) => `es-b1-u${String(p.unit.position).padStart(2, '0')}`),
    );
    expect(a.document.lessons).toHaveLength(120);
    const pub = esB1PublishSql();
    expect(esB1PublishSql().sql).toBe(pub.sql);
    expect(pub.ids.units).toHaveLength(12);
    expect(pub.ids.draft_items.length).toBeGreaterThan(0);
  });
});
