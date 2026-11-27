import { withNeutralSpanish } from '../../scripts/neutral-patch';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { B1_LEVEL_SQL, b1Sql } from '../../scripts/build-b1-sql';
import { b1PublishSql } from '../../scripts/build-b1-publish-sql';
import { B1, B1_PATH } from '../b1';
import { b1Lemmas, b1Problems, b1WritingProblems, isB1Token } from '../b1-checks';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { EN_B1_WRITING_TASKS } from '../en/b1/writing';
import { COURSES, CURRICULUM_PATH } from '../index';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Inglés B1 (docs/B1_EN.md): 12 unidades nuevas y escritura B1.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261122120000_b1_en.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261123120000_publish_en_b1.sql'),
  'utf8',
);

const units = B1.units.map((u) => u.unit);
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));

describe('inglés B1 (content/b1.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(b1Problems()).toEqual([]);
  });

  it('son U1–U12 de B1, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(B1.level).toBe('B1');
    expect(units.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(COURSES.flatMap((c) => c.levels.map((l) => l.level))).not.toContain('B1');
    const loaded = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const p of B1_PATH) for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of B1_PATH) {
      const key = `b1-u${String(p.unit.position).padStart(2, '0')}`;
      expect(p.lessons.map((l) => [l.id, l.position])).toEqual([
        [`${key}-l01`, 1],
        [`${key}-l02`, 2],
        [`${key}-rev1`, 3],
        [`${key}-l03`, 4],
        [`${key}-l04`, 5],
        [`${key}-rev2`, 6],
        [`${key}-l05`, 7],
        [`${key}-listen`, 8],
        [`${key}-words`, 9],
        [`${key}-final`, 10],
      ]);
    }
  });

  it('usa sólo tipos de ejercicio que ya existen, con lectura y escucha en cada unidad', () => {
    expect([...new Set(exercises.map((e) => e.type))].sort()).toEqual([
      'context_choice',
      'fill_blank',
      'image_choice',
      'listen_choice',
      'match_pairs',
      'order_words',
      'short_answer',
      'translate_write',
      'translation_choice',
    ]);
    for (const u of units) {
      const kinds = new Set(
        u.lessons.flatMap((l) =>
          l.exercises.flatMap((e) =>
            e.payload.type === 'context_choice' ? [e.payload.stimulus.kind] : [],
          ),
        ),
      );
      expect([u.position, [...kinds].sort()]).toEqual([u.position, ['listening', 'reading']]);
    }
  });

  it('cubre las estructuras del B1, repartidas por unidad', () => {
    const textOf = (position: number) =>
      units[position - 1]!.lessons.flatMap((l) =>
        l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`),
      ).join(' ');
    const expected: Record<number, string[]> = {
      1: ['have been', 'gone', 'so far', 'the first time'],
      2: ['since', 'been learning', 'enjoy', 'take up', 'give up'],
      3: ['had forgotten', 'by the time', 'as soon as', 'was having'],
      4: ['am meeting', 'might', 'going to', 'until'],
      5: ["don't have to", "mustn't", 'allowed to'],
      6: ['If it rains', 'unless'],
      7: ['ought to', "You'd better", 'as hard as', 'much better', 'The more'],
      8: ['who', 'which', 'where', 'turn on', 'log in'],
      9: ['is recycled', 'were collected', 'made of', 'by fifty volunteers'],
      10: ['said that', 'told me', 'asked if', 'would'],
      11: ['If I were you', 'would', 'wish', 'would rather', 'On the other hand'],
      12: ['must be', "can't be", 'because of', 'Although', 'However', 'sort it out'],
    };
    for (const [position, structures] of Object.entries(expected))
      for (const s of structures)
        expect([position, s, textOf(Number(position)).includes(s)]).toEqual([position, s, true]);
  });

  it('cada lección tiene comprensión en contexto o textos, y producción al final', () => {
    const contextual = exercises.filter((e) => e.type === 'context_choice');
    expect(contextual.length).toBeGreaterThanOrEqual(90);
    for (const u of units)
      for (const l of u.lessons) {
        expect(['translate_write', 'short_answer']).toContain(l.exercises.at(-1)!.type);
        expect(l.intro?.examples.length).toBeGreaterThanOrEqual(2);
      }
  });

  it('el registro de ids incluye el B1 sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(B1_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^en\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
  });

  it('la carga es la salida exacta del generador, amplía el nivel y no publica nada', () => {
    const { sql, document } = b1Sql();
    expect(sql).toBe(withNeutralSpanish(migration));
    expect(sql).toContain(B1_LEVEL_SQL);
    expect(document.units.map((u) => u.id)).toEqual(
      units.map((u) => `b1-u${String(u.position).padStart(2, '0')}`),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = b1PublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(12);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
  });

  it('acepta formas B1 de lo enseñado: -ly y contracciones', () => {
    expect(b1Lemmas('calmly')).toContain('calm');
    expect(b1Lemmas('luckily')).toContain('lucky');
    expect(isB1Token("couldn't", (t) => t === 'could' || t === 'not')).toBe(true);
    expect(isB1Token("you'd", (t) => t === 'you' || t === 'had')).toBe(true);
    expect(isB1Token("you'd", (t) => t === 'you')).toBe(false);
  });

  describe('el validador detecta', () => {
    const lesson = () => units[0]!.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return b1Problems();
      } finally {
        restore();
      }
    };

    it('vocabulario no enseñado', () => {
      const e = lesson().exercises.find((x) => x.type === 'listen_choice')! as ExerciseDef & {
        payload: { type: 'listen_choice'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = 'My parents have given me a zeppelin.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: zeppelin/);
    });

    it('una forma de apoyo que no se usa o que ya estaba enseñada', () => {
      const support = B1.units[0]!.support;
      const problems = withMutation(() => {
        support.push('zeppelin', 'house');
        return () => {
          support.splice(-2, 2);
        };
      });
      expect(problems.join('\n')).toMatch(/la forma de apoyo «zeppelin» no se usa/);
      expect(problems.join('\n')).toMatch(/«house» ya está enseñada/);
    });

    it('un vínculo a una palabra de A1 que todavía no está publicada (cierre de A1)', () => {
      const e = lesson().exercises[0]!;
      const problems = withMutation(() => {
        const before = e.words;
        e.words = [...before, 'en-people'];
        return () => {
          e.words = before;
        };
      });
      expect(problems.join('\n')).toMatch(/enlaza en-people, que no está publicada/);
    });

    it('una palabra nueva que repite el texto de otra', () => {
      const words = units[0]!.words;
      const problems = withMutation(() => {
        const before = words[0]!.text;
        words[0]!.text = 'water';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«water» ya es la palabra en-water/);
    });
  });
});

describe('escritura B1 (content/en/b1/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(b1WritingProblems()).toEqual([]);
  });

  it('una guiada por unidad y una libre al cierre de cada bloque', () => {
    expect(EN_B1_WRITING_TASKS.filter((t) => t.kind === 'guided').map((t) => t.lesson)).toEqual([
      'b1-u01-l05',
      'b1-u02-l05',
      'b1-u03-l05',
      'b1-u04-l05',
      'b1-u05-l05',
      'b1-u06-l05',
      'b1-u07-l05',
      'b1-u08-l05',
      'b1-u09-l05',
      'b1-u10-l05',
      'b1-u11-l05',
      'b1-u12-l03',
    ]);
    expect(EN_B1_WRITING_TASKS.filter((t) => t.kind === 'free').map((t) => t.lesson)).toEqual([
      'b1-u04-final',
      'b1-u08-final',
      'b1-u12-final',
    ]);
  });

  it('la app encuentra las tareas de A1, A2 y B1 en un solo registro', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('en.b1.wt.complaint')?.lesson).toBe('b1-u12-l03');
    expect(writingTasksForLesson('b1-u12-final').map((t) => t.id)).toEqual([
      'en.b1.wt.block3-problem',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('en.b1.wt.what-they-said')!;
    expect(
      checkWriting(
        task,
        'My sister called me. She told me that she was tired. She asked if I could help her.',
      ).complete,
    ).toBe(true);
    expect(checkWriting(task, 'My sister called me. She is tired.').complete).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('en.b1.wt.block3-problem')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Hello.').complete).toBeNull();
  });
});
