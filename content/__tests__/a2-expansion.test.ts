import { withNeutralSpanish } from '../../scripts/neutral-patch';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { a2ExpansionSql } from '../../scripts/build-a2-expansion-sql';
import { A2_EXPANSION, A2_EXPANSION_PATH } from '../a2-expansion';
import {
  a2ExpansionProblems,
  a2Lemmas,
  a2WritingProblems,
  isTaughtToken,
} from '../a2-expansion-checks';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { EN_A2_WRITING_TASKS } from '../en/a2/writing';
import { COURSES, CURRICULUM_PATH } from '../index';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Inglés A2 completo (docs/A2_EN_COMPLETION.md): unidades nuevas U13–U17 y escritura A2.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261120120000_a2_en_completion.sql'),
  'utf8',
);

const units = A2_EXPANSION[0]!.units.map((u) => u.unit);
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));

describe('unidades nuevas de A2 (content/a2-expansion.ts)', () => {
  it('pasan todas las reglas', () => {
    expect(a2ExpansionProblems()).toEqual([]);
  });

  it('son U13–U17, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(units.map((u) => u.position)).toEqual([13, 14, 15, 16, 17]);
    const a2 = COURSES.find((c) => c.language === 'en')!.levels.find((l) => l.level === 'A2')!;
    expect(a2.units.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const loaded = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const p of A2_EXPANSION_PATH)
      for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of A2_EXPANSION_PATH) {
      const key = `a2-u${p.unit.position}`;
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

  it('combinan tipos de ejercicio que ya existen, con comprensión lectora y auditiva', () => {
    const types = new Set(exercises.map((e) => e.type));
    expect([...types].sort()).toEqual([
      'complete_word',
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
    const stimuli = exercises.flatMap((e) =>
      e.payload.type === 'context_choice' ? [e.payload.stimulus] : [],
    );
    expect(stimuli.some((s) => s.kind === 'reading')).toBe(true);
    expect(stimuli.some((s) => s.kind === 'listening')).toBe(true);
    for (const u of units) {
      const kinds = new Set(
        u.lessons.flatMap((l) =>
          l.exercises.flatMap((e) =>
            e.payload.type === 'context_choice' ? [e.payload.stimulus.kind] : [],
          ),
        ),
      );
      expect([u.position, kinds.size > 0]).toEqual([u.position, true]);
    }
  });

  it('cubren las estructuras del A2 que faltaban', () => {
    const answers = exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`).join(' ');
    for (const s of [
      'some',
      'any',
      'much',
      'many',
      'a lot of',
      'Could I have',
      'Would you like to',
      "Let's",
      'How about',
      'look like',
      'Could you',
      'was cooking',
      'while',
      'suddenly',
    ])
      expect([s, answers.includes(s)]).toEqual([s, true]);
  });

  it('el registro de ids incluye el A2 nuevo sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(A2_EXPANSION_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^en\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
  });

  it('la migración es la salida exacta del generador y no publica nada', () => {
    const { sql, document } = a2ExpansionSql();
    expect(sql).toBe(withNeutralSpanish(migration));
    expect(document.units.map((u) => u.id)).toEqual([
      'a2-u13',
      'a2-u14',
      'a2-u15',
      'a2-u16',
      'a2-u17',
    ]);
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
  });

  it('acepta formas del A2 de lo enseñado y contracciones de la lista cerrada', () => {
    expect(a2Lemmas('noisier')).toContain('noisy');
    expect(a2Lemmas('thinner')).toContain('thin');
    expect(a2Lemmas('cooking')).toContain('cook');
    expect(isTaughtToken("i'll", (t) => t === 'i' || t === 'will')).toBe(true);
    expect(isTaughtToken("i'd", (t) => t === 'i' || t === 'will')).toBe(false);
  });

  describe('el validador detecta', () => {
    const lesson = () => units[0]!.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return a2ExpansionProblems();
      } finally {
        restore();
      }
    };

    it('vocabulario no enseñado', () => {
      const e = lesson().exercises[4]! as ExerciseDef & {
        payload: { type: 'listen_choice'; audioText: string; options: string[] };
      };
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = 'Can I see the zeppelin, please?';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: zeppelin/);
    });

    it('opciones ambiguas (la respuesta repetida con otra mayúscula)', () => {
      const p = lesson().exercises[0]!.payload as { options: string[] };
      const problems = withMutation(() => {
        const before = [...p.options];
        p.options[1] = 'Fish';
        return () => {
          p.options.splice(0, p.options.length, ...before);
        };
      });
      expect(problems.join('\n')).toMatch(/opciones repetidas/);
    });

    it('un context_choice que practica palabras con words (SRS v1) en vez de conceptos', () => {
      const e = units[0]!.lessons[2]!.exercises.find((x) => x.type === 'context_choice')!;
      const problems = withMutation(() => {
        e.words = ['en-soup'];
        return () => {
          e.words = [];
        };
      });
      expect(problems.join('\n')).toMatch(/context_choice va sin words/);
    });

    it('una lección sin producción al final', () => {
      const l = lesson();
      const problems = withMutation(() => {
        const last = l.exercises.pop()!;
        const first = l.exercises.shift()!;
        l.exercises.push(first);
        return () => {
          l.exercises.pop();
          l.exercises.unshift(first);
          l.exercises.push(last);
        };
      });
      expect(problems.join('\n')).toMatch(
        /los dos últimos ejercicios tienen que ser de producción/,
      );
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
      expect(problems.join('\n')).toMatch(/enlaza en-people, que todavía no está publicada/);
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

describe('escritura A2 (content/en/a2/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(a2WritingProblems()).toEqual([]);
  });

  it('guiadas en lecciones del A2 y libres al cierre de cada bloque', () => {
    expect(EN_A2_WRITING_TASKS.filter((t) => t.kind === 'guided').map((t) => t.lesson)).toEqual([
      'a2-u01-l05',
      'a2-u03-l05',
      'a2-u04-l05',
      'a2-u08-l05',
      'a2-u09-l05',
      'a2-u12-l05',
      'a2-u13-l05',
      'a2-u14-l05',
      'a2-u15-l05',
      'a2-u16-l05',
    ]);
    expect(EN_A2_WRITING_TASKS.filter((t) => t.kind === 'free').map((t) => t.lesson)).toEqual([
      'a2-u06-final',
      'a2-u12-final',
      'a2-u17-final',
    ]);
  });

  it('la app encuentra las tareas de A1 y de A2 en un solo registro', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('en.a2.wt.booking-email')?.lesson).toBe('a2-u16-l05');
    expect(writingTask('en.a1.wt.my-age')?.lesson).toBe('a1-u03-l04');
    expect(writingTasksForLesson('a2-u12-final').map((t) => t.id)).toEqual([
      'en.a2.wt.block2-news',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('en.a2.wt.reply-invitation')!;
    expect(checkWriting(task, "Thanks, Mia! I'd love to go to your party.").complete).toBe(true);
    expect(checkWriting(task, 'I go to your party.').complete).toBe(false);
    const advice = writingTask('en.a2.wt.advice')!;
    const r = checkWriting(advice, 'You should rest. You have a fever.');
    expect(r.requirements.find((x) => x.id === 'shouldnt')?.met).toBe(false);
    expect(r.complete).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('en.a2.wt.block3-story')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Hello.').complete).toBeNull();
  });
});
