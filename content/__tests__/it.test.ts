import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { itSql } from '../../scripts/build-it-sql';
import { itPublishSql } from '../../scripts/build-it-publish-sql';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { COURSES, CURRICULUM_PATH } from '../index';
import { IT_COURSE, IT_PATH } from '../it-course';
import { itLemmas, itProblems, itWritingProblems } from '../it-checks';
import { IT_A1_UNITS } from '../it/a1';
import { IT_WRITING_TASKS } from '../it/writing';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Italiano A1 U13–U16 y A2 U1–U12 (docs/IT_A1_A2.md) y su escritura.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261128120000_it_a1_a2.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261129120000_publish_it_a1_a2.sql'),
  'utf8',
);

const a1 = IT_COURSE.find((l) => l.level === 'A1')!;
const a2 = IT_COURSE.find((l) => l.level === 'A2')!;
const units = IT_COURSE.flatMap((l) => l.units.map((u) => u.unit));
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));
const key = (level: string, position: number) =>
  `it-${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;

describe('italiano A1 U13–U16 y A2 (content/it-course.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(itProblems()).toEqual([]);
  });

  it('A1 sigue al piloto (U13–U16) y A2 es U1–U12, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(IT_A1_UNITS.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(a1.units.map((u) => u.unit.position)).toEqual([13, 14, 15, 16]);
    expect(a2.units.map((u) => u.unit.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    // El piloto sigue igual en COURSES: sólo A1 U1–U12.
    expect(COURSES.find((c) => c.language === 'it')!.levels.map((l) => l.level)).toEqual(['A1']);
    const loaded = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const p of IT_PATH) for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of IT_PATH) {
      const k = key(p.level, p.unit.position);
      expect(p.lessons.map((l) => [l.id, l.position])).toEqual([
        [`${k}-l01`, 1],
        [`${k}-l02`, 2],
        [`${k}-rev1`, 3],
        [`${k}-l03`, 4],
        [`${k}-l04`, 5],
        [`${k}-rev2`, 6],
        [`${k}-l05`, 7],
        [`${k}-listen`, 8],
        [`${k}-words`, 9],
        [`${k}-final`, 10],
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

  it('cubre la gramática prevista, repartida por unidad', () => {
    const textOf = (level: string, position: number) =>
      IT_COURSE.find((l) => l.level === level)!
        .units.find((u) => u.unit.position === position)!
        .unit.lessons.flatMap((l) =>
          l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`),
        )
        .join(' ');
    const expected: [string, number, string[]][] = [
      ['A1', 13, ['Noi siamo', 'siete', 'lavoriamo', 'lavorano', 'nostra', 'Faccio']],
      ['A1', 14, ['sono stanc', 'sto bene', 'Ho freddo', 'ho caldo', "un po'", 'bassa']],
      ['A1', 15, ['cinquanta', 'il primo', 'fa caldo', 'piove', 'nevica', "D'estate"]],
      [
        'A1',
        16,
        ['in treno', 'a piedi', 'al cinema', 'alla stazione', 'vanno', 'ho mangiato', 'sono andat'],
      ],
      ['A2', 1, ['ho parlato', 'bevuto', 'dormito', 'fatto', 'abbiamo', 'già', 'ancora']],
      ['A2', 2, ['sono arrivat', 'siamo andati', 'stato', 'rimasto', 'salito', ' fa']],
      ['A2', 3, ['prenotare', 'Potrei', 'Mi porta', 'contorno', 'coperto', 'mancia']],
      ['A2', 4, ['ero', 'eravamo', 'avevo', 'abitavo', 'giocavo', "c'era", 'di solito']],
      ['A2', 5, ['Stavo', 'Mentre', "all'improvviso", 'Pioveva', 'quindi', 'Per fortuna']],
      ['A2', 6, ['Ti va di', 'Che ne', 'Volentieri', 'Mi dispiace', 'andrò', 'sarà', 'tra']],
      ['A2', 7, ['Sto studiando', 'da due anni', 'Attualmente', 'colloquio', 'Dobbiamo', 'può']],
      ['A2', 8, ['Mi fa male', 'mal di', 'dal medico', 'Prenda', 'Riposati', 'Non mangiare']],
      ['A2', 9, ['più grande di', 'meno caro', 'migliore', 'bellissim', 'ne prendo']],
      ['A2', 10, ['Ti chiamo', 'ti scrivo', 'Lo porto', 'la chiamo', 'gli scrivo', 'Le telefono']],
      [
        'A2',
        11,
        ['ti alzi', 'si alza', 'mi sono alzat', 'Ci siamo conosciuti', 'ci vado', 'spesso'],
      ],
      [
        'A2',
        12,
        [
          'Secondo me',
          "d'accordo",
          'Mi piacerebbe',
          'dovresti',
          'Preferirei',
          'non funziona',
          'invece',
        ],
      ],
    ];
    for (const [level, position, structures] of expected)
      for (const s of structures)
        expect([level, position, s, textOf(level, position).includes(s)]).toEqual([
          level,
          position,
          s,
          true,
        ]);
  });

  it('cada lección tiene producción al final y comprensión en contexto en todas las unidades', () => {
    const contextual = exercises.filter((e) => e.type === 'context_choice');
    expect(contextual.length).toBeGreaterThanOrEqual(150);
    for (const u of units) {
      expect(u.lessons.some((l) => l.exercises.some((e) => e.type === 'context_choice'))).toBe(
        true,
      );
      for (const l of u.lessons) {
        expect(['translate_write', 'short_answer']).toContain(l.exercises.at(-1)!.type);
        expect(l.intro?.examples.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('los textos y audios del A2 son más largos que los del A1', () => {
    const lengths = (level: string) => {
      const byId = new Map<string, number>();
      for (const p of IT_PATH.filter((x) => x.level === level))
        for (const l of p.lessons)
          for (const e of l.exercises)
            if (e.payload.type === 'context_choice') {
              const s = e.payload.stimulus;
              const text = s.kind === 'listening' ? s.lines.map((x) => x.text) : s.lines;
              byId.set(s.id, text.join(' ').split(/\s+/).length);
            }
      return [...byId.values()];
    };
    const average = (xs: number[]) => xs.reduce((n, x) => n + x, 0) / xs.length;
    expect(lengths('A1').length).toBeGreaterThanOrEqual(12);
    expect(lengths('A2').length).toBeGreaterThanOrEqual(40);
    expect(average(lengths('A2'))).toBeGreaterThan(average(lengths('A1')));
  });

  it('los audios van más lentos que en inglés B1: A1 0.85 y A2 0.9', () => {
    for (const e of exercises)
      if (e.payload.type === 'context_choice' && e.payload.stimulus.kind === 'listening')
        expect(e.payload.stimulus.rate).toBe(e.payload.stimulus.id.includes('.a1-') ? 0.85 : 0.9);
  });

  it('el registro de ids incluye el italiano sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(IT_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^it\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
  });

  it('el servidor corrige como correctas la respuesta y las aceptadas de la producción', () => {
    for (const e of exercises.filter((x) => ['translate_write', 'short_answer'].includes(x.type))) {
      const spec = gradingSpecFor(e.type, e.mode);
      for (const value of [e.answer, ...(e.acceptedAnswers ?? [])])
        expect([
          e.id,
          value,
          gradeWithSpec(
            spec,
            { answer: e.answer, accepted_answers: e.acceptedAnswers ?? [], payload: e.payload },
            { kind: 'text', value },
          ).correct,
        ]).toEqual([e.id, value, true]);
    }
  });

  it('la carga es la salida exacta del generador y no publica nada', () => {
    const { sql, document } = itSql();
    expect(sql).toBe(migration);
    expect(document.units.map((u) => u.id)).toEqual(
      IT_PATH.map((p) => key(p.level, p.unit.position)),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
    expect(sql).not.toMatch(/curriculum_units_level_check/);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = itPublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(16);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
  });

  it('acepta el plural y el femenino regulares de lo enseñado', () => {
    expect(itLemmas('amiche')).toContain('amico');
    expect(itLemmas('bianchi')).toContain('bianco');
    expect(itLemmas('stazioni')).toContain('stazione');
    expect(itLemmas('cameriera')).toContain('cameriere');
    expect(itLemmas('figli')).toContain('figlio');
    expect(itLemmas('piccolo')).toContain('piccola');
  });

  describe('el validador detecta', () => {
    const lesson = () => a2.units[0]!.unit.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return itProblems();
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
        e.payload.options[1] = 'Ieri ho comprato uno zeppelin.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: .*zeppelin/);
    });

    it('opciones que sólo cambian en una tilde (è / e)', () => {
      const e = lesson().exercises.find((x) => x.type === 'fill_blank')! as ExerciseDef & {
        payload: { type: 'fill_blank'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = [...e.payload.options];
        e.payload.options[1] = e.payload.options[0]!.normalize('NFD').replace(/[̀-ͯ]/g, '') + 'á';
        e.payload.options[2] = e.payload.options[1]!.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return () => {
          e.payload.options = before;
        };
      });
      expect(problems.join('\n')).toMatch(/opciones repetidas/);
    });

    it('una forma de apoyo que no se usa o que ya estaba enseñada', () => {
      const support = a2.units[0]!.support;
      const problems = withMutation(() => {
        support.push('zeppelin', 'casa');
        return () => {
          support.splice(-2, 2);
        };
      });
      expect(problems.join('\n')).toMatch(/la forma de apoyo «zeppelin» no se usa/);
      expect(problems.join('\n')).toMatch(/«casa» ya está enseñada/);
    });

    it('un vínculo a una palabra de otro idioma', () => {
      const e = lesson().exercises[0]!;
      const problems = withMutation(() => {
        const before = e.words;
        e.words = [...before, 'en-people'];
        return () => {
          e.words = before;
        };
      });
      expect(problems.join('\n')).toMatch(/palabra en-people inexistente/);
    });

    it('una palabra nueva que repite el texto de una del piloto', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.text;
        words[0]!.text = 'grazie';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«grazie» ya es la palabra it-grazie/);
    });
  });
});

describe('escritura de italiano (content/it/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(itWritingProblems()).toEqual([]);
  });

  it('cubre los temas de A1 y A2, guiadas y libres', () => {
    const lessons = (level: string, kind: string) =>
      IT_WRITING_TASKS.filter((t) => t.id.startsWith(`it.${level}.`) && t.kind === kind).map(
        (t) => t.lesson,
      );
    expect(lessons('a1', 'guided')).toEqual([
      'it-a1-u02-l05',
      'it-a1-u04-l05',
      'it-a1-u06-l05',
      'it-a1-u08-l05',
      'it-a1-u11-l05',
      'it-a1-u13-l05',
      'it-a1-u16-l05',
    ]);
    expect(lessons('a1', 'free')).toEqual(['it-a1-u16-final']);
    expect(lessons('a2', 'guided')).toHaveLength(11);
    expect(lessons('a2', 'free')).toEqual(['it-a2-u06-final', 'it-a2-u12-final']);
  });

  it('la app encuentra las tareas de italiano en el registro común', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('it.a2.wt.prenotazione')?.lesson).toBe('it-a2-u03-l05');
    expect(writingTasksForLesson('it-a1-u16-final').map((t) => t.id)).toEqual([
      'it.a1.wt.libero-io',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('it.a2.wt.infanzia')!;
    expect(
      checkWriting(
        task,
        'Quando ero piccolo, abitavo a Roma. Avevo un gatto. Giocavo sempre in piazza. Ero felice.',
      ).complete,
    ).toBe(true);
    expect(checkWriting(task, 'Abito a Roma. Ho un gatto.').complete).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('it.a2.wt.libero-giorno')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Ciao.').complete).toBeNull();
  });
});
