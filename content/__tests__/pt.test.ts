import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { ptSql } from '../../scripts/build-pt-sql';
import { ptPublishSql } from '../../scripts/build-pt-publish-sql';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { COURSES, CURRICULUM_PATH } from '../index';
import { PT_COURSE, PT_PATH } from '../pt-course';
import { ptLemmas, ptProblems, ptWritingProblems } from '../pt-checks';
import { PT_A1_UNITS } from '../pt/a1';
import { PT_WRITING_TASKS } from '../pt/writing';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Portugués de Brasil A1 U13–U16 y A2 U1–U12 (docs/PT_A1_A2.md) y su escritura.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261126120000_pt_a1_a2.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261127120000_publish_pt_a1_a2.sql'),
  'utf8',
);

const a1 = PT_COURSE.find((l) => l.level === 'A1')!;
const a2 = PT_COURSE.find((l) => l.level === 'A2')!;
const units = PT_COURSE.flatMap((l) => l.units.map((u) => u.unit));
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));
const key = (level: string, position: number) =>
  `pt-${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;

describe('portugués A1 U13–U16 y A2 (content/pt-course.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(ptProblems()).toEqual([]);
  });

  it('A1 sigue al piloto (U13–U16) y A2 es U1–U12, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(PT_A1_UNITS.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(a1.units.map((u) => u.unit.position)).toEqual([13, 14, 15, 16]);
    expect(a2.units.map((u) => u.unit.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    // El piloto sigue igual en COURSES: sólo A1 U1–U12.
    expect(COURSES.find((c) => c.language === 'pt')!.levels.map((l) => l.level)).toEqual(['A1']);
    const loaded = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const p of PT_PATH) for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of PT_PATH) {
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
      PT_COURSE.find((l) => l.level === level)!
        .units.find((u) => u.unit.position === position)!
        .unit.lessons.flatMap((l) =>
          l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`),
        )
        .join(' ');
    const expected: [string, number, string[]][] = [
      ['A1', 13, ['Nós somos', 'trabalhamos', 'trabalham', 'A gente', 'nossa']],
      ['A1', 14, ['estou', 'com fome', 'é alto', 'está triste', 'pouco']],
      ['A1', 15, ['dia dez de maio', 'abril chove', 'faz calor', 'chove']],
      ['A1', 16, ['de metrô', 'ao cinema', 'pela praça', 'faço', 'vão']],
      ['A2', 1, ['falei', 'comeu', 'saiu', 'já', 'Ainda não']],
      ['A2', 2, ['fui', 'foi', 'fiz', 'tive', 'estive', 'conheci']],
      ['A2', 3, ['gostaria', 'Poderia', 'reservei', 'incluído']],
      ['A2', 4, ['era', 'tinha', 'morava', 'brincava', 'costumava']],
      ['A2', 5, ['estava', 'estava chovendo', 'então', 'De repente', 'Enquanto']],
      ['A2', 6, ['vou viajar', 'Topa', 'Combinado', 'Que pena', 'a fim de']],
      ['A2', 7, ['será', 'terá', 'pretendo', 'me formei']],
      ['A2', 8, ['dor de', 'Tome', 'Beba', 'Evite', 'Descanse']],
      ['A2', 9, ['mais barata do que', 'melhor', 'tão boa quanto', 'caro da loja']],
      ['A2', 10, ['te ligo', 'Me manda', 'vi ele', 'Conheço ela']],
      ['A2', 11, ['me levanto', 'se levanta', 'tomo banho', 'às vezes', 'Faz dois anos']],
      ['A2', 12, ['Acho que', 'Concordo', 'Se você quiser', 'quebrou', 'reclamação']],
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
    expect(contextual.length).toBeGreaterThanOrEqual(140);
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
      for (const p of PT_PATH.filter((x) => x.level === level))
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

  it('el registro de ids incluye el portugués sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(PT_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^pt\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
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
    const { sql, document } = ptSql();
    expect(sql).toBe(migration);
    expect(document.units.map((u) => u.id)).toEqual(
      PT_PATH.map((p) => key(p.level, p.unit.position)),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
    expect(sql).not.toMatch(/curriculum_units_level_check/);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = ptPublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(16);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
  });

  it('acepta el plural y el femenino regulares de lo enseñado', () => {
    expect(ptLemmas('cansadas')).toContain('cansado');
    expect(ptLemmas('lições')).toContain('lição');
    expect(ptLemmas('azuis')).toContain('azul');
    expect(ptLemmas('professoras')).toContain('professor');
  });

  describe('el validador detecta', () => {
    const lesson = () => a2.units[0]!.unit.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return ptProblems();
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
        e.payload.options[1] = 'Ontem eu comprei um zepelim.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: .*zepelim/);
    });

    it('opciones que sólo cambian en una tilde (saí / sai)', () => {
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
        support.push('zepelim', 'casa');
        return () => {
          support.splice(-2, 2);
        };
      });
      expect(problems.join('\n')).toMatch(/la forma de apoyo «zepelim» no se usa/);
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
        words[0]!.text = 'obrigado';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«obrigado» ya es la palabra pt-obrigado/);
    });
  });
});

describe('escritura de portugués (content/pt/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(ptWritingProblems()).toEqual([]);
  });

  it('cubre los temas de A1 y A2, guiadas y libres', () => {
    const lessons = (level: string, kind: string) =>
      PT_WRITING_TASKS.filter((t) => t.id.startsWith(`pt.${level}.`) && t.kind === kind).map(
        (t) => t.lesson,
      );
    expect(lessons('a1', 'guided')).toEqual([
      'pt-a1-u02-l05',
      'pt-a1-u04-l05',
      'pt-a1-u06-l05',
      'pt-a1-u08-l05',
      'pt-a1-u13-l05',
      'pt-a1-u16-l05',
    ]);
    expect(lessons('a1', 'free')).toEqual(['pt-a1-u16-final']);
    expect(lessons('a2', 'guided')).toHaveLength(11);
    expect(lessons('a2', 'free')).toEqual(['pt-a2-u06-final', 'pt-a2-u12-final']);
  });

  it('la app encuentra las tareas de portugués en el registro común', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('pt.a2.wt.reserva')?.lesson).toBe('pt-a2-u03-l05');
    expect(writingTasksForLesson('pt-a1-u16-final').map((t) => t.id)).toEqual([
      'pt.a1.wt.livre-eu',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('pt.a2.wt.infancia')!;
    expect(
      checkWriting(
        task,
        'Quando eu era criança, eu morava no Rio. Eu tinha um gato. A gente brincava na praia. Eu era feliz.',
      ).complete,
    ).toBe(true);
    expect(checkWriting(task, 'Eu moro no Rio. Eu tenho um gato.').complete).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('pt.a2.wt.livre-acontecimento')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Oi.').complete).toBeNull();
  });
});
