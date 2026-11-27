import { withNeutralSpanish } from '../../scripts/neutral-patch';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { B2_LEVEL_SQL, b2Sql } from '../../scripts/build-b2-sql';
import { b2PublishSql } from '../../scripts/build-b2-publish-sql';
import { B1_PATH } from '../b1';
import { B2, B2_PATH } from '../b2';
import { b2Problems, b2WritingProblems } from '../b2-checks';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { EN_B2_WRITING_TASKS } from '../en/b2/writing';
import { COURSES, CURRICULUM_PATH } from '../index';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Inglés B2 (docs/B2_EN.md): 12 unidades nuevas y escritura B2.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261124120000_b2_en.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261125120000_publish_en_b2.sql'),
  'utf8',
);

const units = B2.units.map((u) => u.unit);
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));

describe('inglés B2 (content/b2.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(b2Problems()).toEqual([]);
  });

  it('son U1–U12 de B2, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(B2.level).toBe('B2');
    expect(units.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(COURSES.flatMap((c) => c.levels.map((l) => l.level))).not.toContain('B2');
    const loaded = new Set(
      [...CURRICULUM_PATH, ...B1_PATH].flatMap((p) => p.lessons.map((l) => l.id)),
    );
    for (const p of B2_PATH) for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of B2_PATH) {
      const key = `b2-u${String(p.unit.position).padStart(2, '0')}`;
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

  it('cubre las estructuras del B2, repartidas por unidad', () => {
    const textOf = (position: number) =>
      units[position - 1]!.lessons.flatMap((l) =>
        l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`),
      ).join(' ');
    const expected: Record<number, string[]> = {
      1: ['I regret saying', 'Remember to call', 'stop to think', 'tend to', 'Apparently'],
      2: ['as long as', 'provided that', 'Otherwise', 'in case', 'meet halfway'],
      3: ['has been', 'are being built', 'It is said that', 'expected to', 'should be built'],
      4: ['whose', 'which was invented', 'most of which', 'for whom'],
      5: ['have the screen replaced', 'twice as', 'nowhere near as', 'by far', 'the less sense'],
      6: ['must have', "can't have", 'might have', "shouldn't have", 'could have'],
      7: ['Despite', 'In spite of', 'Even though', 'Even if', 'Whereas'],
      8: ['claims that', 'denied', 'admitted', 'warned people not to', 'accused', 'refused to'],
      9: ['If I had listened', 'would have', 'If only I had', "wouldn't have"],
      10: ['What worries me is', 'The reason why', 'Moreover', 'Nevertheless', 'Admittedly'],
      11: ['Having missed', 'Never had she', 'Hardly had she', 'No sooner had', 'Little did she'],
      12: ["you'd be speaking", 'If I were braver', 'Not only is', 'Under no circumstances will'],
    };
    for (const [position, structures] of Object.entries(expected))
      for (const s of structures)
        expect([position, s, textOf(Number(position)).includes(s)]).toEqual([position, s, true]);
  });

  it('cada lección tiene comprensión en contexto o textos, y producción al final', () => {
    const contextual = exercises.filter((e) => e.type === 'context_choice');
    expect(contextual.length).toBeGreaterThanOrEqual(140);
    for (const u of units)
      for (const l of u.lessons) {
        expect(['translate_write', 'short_answer']).toContain(l.exercises.at(-1)!.type);
        expect(l.intro?.examples.length).toBeGreaterThanOrEqual(2);
      }
  });

  it('los textos y audios son más largos que en B1', () => {
    const stimuli = (path: typeof B2_PATH) => {
      const byId = new Map<string, number>();
      for (const p of path)
        for (const l of p.lessons)
          for (const e of l.exercises)
            if (e.payload.type === 'context_choice') {
              const s = e.payload.stimulus;
              const text = s.kind === 'listening' ? s.lines.map((x) => x.text) : s.lines;
              byId.set(s.id, text.join(' ').split(/\s+/).length);
            }
      return [...byId.values()];
    };
    const average = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const b2 = stimuli(B2_PATH);
    expect(b2).toHaveLength(48);
    expect(average(b2)).toBeGreaterThan(average(stimuli(B1_PATH)) * 1.3);
  });

  it('el registro de ids incluye el B2 sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(B2_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^en\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
  });

  it('la carga es la salida exacta del generador, amplía el nivel y no publica nada', () => {
    const { sql, document } = b2Sql();
    expect(sql).toBe(withNeutralSpanish(migration));
    expect(sql).toContain(B2_LEVEL_SQL);
    expect(B2_LEVEL_SQL).toContain("check (level in ('A1', 'A2', 'B1', 'B2'))");
    expect(document.units.map((u) => u.id)).toEqual(
      units.map((u) => `b2-u${String(u.position).padStart(2, '0')}`),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = b2PublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(12);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
  });

  describe('el validador detecta', () => {
    const lesson = () => units[0]!.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return b2Problems();
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
        e.payload.options[1] = 'It was a zeppelin, not a misunderstanding.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: zeppelin/);
    });

    it('una palabra de una lección posterior usada antes de presentarla', () => {
      const e = lesson().exercises.find((x) => x.type === 'fill_blank')! as ExerciseDef & {
        payload: { type: 'fill_blank'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = 'tactful';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/L1 .* vocabulario no enseñado todavía: tactful/);
    });

    it('una forma de apoyo que no se usa o que ya estaba enseñada', () => {
      const support = B2.units[0]!.support;
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

    it('una palabra nueva que repite el texto de otra (también del B1)', () => {
      const words = units[0]!.words;
      const problems = withMutation(() => {
        const before = words[0]!.text;
        words[0]!.text = 'although';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«although» ya es la palabra en-although/);
    });
  });
});

describe('escritura B2 (content/en/b2/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(b2WritingProblems()).toEqual([]);
  });

  it('una guiada por unidad y una libre al cierre de cada bloque', () => {
    expect(EN_B2_WRITING_TASKS.filter((t) => t.kind === 'guided').map((t) => t.lesson)).toEqual(
      Array.from({ length: 12 }, (_, i) => `b2-u${String(i + 1).padStart(2, '0')}-l05`),
    );
    expect(EN_B2_WRITING_TASKS.filter((t) => t.kind === 'free').map((t) => t.lesson)).toEqual([
      'b2-u04-final',
      'b2-u08-final',
      'b2-u12-final',
    ]);
  });

  it('la app encuentra las tareas de A1 a B2 en un solo registro', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('en.b2.wt.repair-complaint')?.lesson).toBe('b2-u05-l05');
    expect(writingTasksForLesson('b2-u12-final').map((t) => t.id)).toEqual([
      'en.b2.wt.block3-opinion',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('en.b2.wt.report-story')!;
    expect(
      checkWriting(
        task,
        'A post claimed that the park would close. The mayor denied it. She admitted that there was a plan for offices. She warned people not to believe rumors.',
      ).complete,
    ).toBe(true);
    expect(
      checkWriting(task, 'A post said that the park would close. The mayor said no.').complete,
    ).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('en.b2.wt.block3-opinion')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Hello.').complete).toBeNull();
  });
});
