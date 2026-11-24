import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { LANGUAGES, languageConfig } from '../../shared/languages';
import { esSql } from '../../scripts/build-es-sql';
import { esPublishSql } from '../../scripts/build-es-publish-sql';
import { exercisesFor } from '../builders';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { COURSES, CURRICULUM_PATH } from '../index';
import { ES_COURSE, ES_PATH } from '../es-course';
import { esLemmas, esProblems, esTokens, esWritingProblems, soundKey } from '../es-checks';
import { ES_WRITING_TASKS } from '../es/writing';
import { FR_PATH } from '../fr-course';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Español neutro de Latinoamérica (tú y ustedes, docs/ES_NEUTRAL_GUIDE.md) A1 U1–U17 y A2 U1–U12 (docs/ES_A1_A2.md), con el inglés como idioma de apoyo,
 * y su escritura.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261204120000_es_a1_a2.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261205120000_publish_es_a1_a2.sql'),
  'utf8',
);

const a1 = ES_COURSE.find((l) => l.level === 'A1')!;
const a2 = ES_COURSE.find((l) => l.level === 'A2')!;
const units = ES_COURSE.flatMap((l) => l.units.map((u) => u.unit));
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));
const key = (level: string, position: number) =>
  `es-${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;
const textOf = (level: string, position: number) =>
  ES_COURSE.find((l) => l.level === level)!
    .units.find((u) => u.unit.position === position)!
    .unit.lessons.flatMap((l) => l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`))
    .join(' ');
/** Todo el español que se muestra o se escucha en el curso (respuestas, opciones, audios, textos). */
const spanishTokens = new Set(
  ES_PATH.flatMap((p) =>
    p.lessons.flatMap((l) =>
      l.exercises.flatMap((e) => esTokens(`${e.answer} ${JSON.stringify(e.payload)}`)),
    ),
  ),
);

describe('español A1 y A2 (content/es-course.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(esProblems()).toEqual([]);
  });

  it('el idioma enseña el español neutro desde el inglés, disponible con A1, A2 y Ranked', () => {
    const es = languageConfig('es');
    expect([es.code, es.status, es.ranked, es.speechLocale, [...es.levels]]).toEqual([
      'es',
      'available',
      true,
      'es-MX',
      ES_COURSE.map((l) => l.level),
    ]);
    expect(es.support).toEqual({ code: 'en', targetName: 'Spanish' });
    // Sólo el español cambia de idioma de apoyo: los demás cursos siguen enseñándose desde el español.
    expect(LANGUAGES.filter((l) => l.support).map((l) => l.code)).toEqual(['es']);
  });

  it('las consignas y los repasos generados salen en inglés; los demás idiomas no cambian', () => {
    const es = exercisesFor(languageConfig('es'));
    const fr = exercisesFor(languageConfig('fr'));
    expect(es.translateWrite('Hi', 'Hola', ['es-hola']).prompt).toBe('Translate into Spanish');
    expect(es.shortAnswer('¿?', '', '', [], ['es-hola']).prompt).toBe('Answer in Spanish');
    expect(es.translationChoice('hola', 'hello', [], ['es-hola']).prompt).toBe(
      'What does “hola” mean?',
    );
    expect(fr.translateWrite('Hola', 'Salut', ['fr-salut']).prompt).toBe('Traducí al francés');
    expect(fr.fillBlank('', '', '', [], ['fr-salut']).prompt).toBe('Completá la frase');
    const titles = (path: typeof ES_PATH) =>
      path[0]!.lessons.filter((l) => l.kind !== 'lesson').map((l) => l.title);
    expect(titles(ES_PATH)).toEqual([
      'Review 1',
      'Review 2',
      'Listening practice',
      'Words of the unit',
      'Final review',
    ]);
    expect(titles(FR_PATH)).toEqual([
      'Repaso 1',
      'Repaso 2',
      'Práctica de escucha',
      'Palabras de la unidad',
      'Repaso final',
    ]);
  });

  it('A1 es U1–U17 y A2 es U1–U12, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(a1.units.map((u) => u.unit.position)).toEqual(
      Array.from({ length: 17 }, (_, i) => i + 1),
    );
    expect(a2.units.map((u) => u.unit.position)).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    expect(COURSES.some((c) => c.language === 'es')).toBe(false);
    expect(CURRICULUM_PATH.some((p) => p.language === 'es')).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of ES_PATH) {
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
    const known = [
      'context_choice',
      'fill_blank',
      'image_choice',
      'listen_choice',
      'match_pairs',
      'order_words',
      'short_answer',
      'translate_write',
      'translation_choice',
    ];
    for (const t of new Set(exercises.map((e) => e.type))) expect(known).toContain(t);
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

  it('enseña tú y ustedes: las formas de tú aparecen y las de vos y vosotros no', () => {
    for (const form of ['tú', 'eres', 'tienes', 'quieres', 'puedes', 'hablas', 'comes', 'vives'])
      expect([form, spanishTokens.has(form)]).toEqual([form, true]);
    for (const form of [
      'vos',
      'sos',
      'tenés',
      'querés',
      'podés',
      'hablás',
      'vosotros',
      'sois',
      'che',
      'dale',
    ])
      expect([form, spanishTokens.has(form)]).toEqual([form, false]);
  });

  it('cubre la gramática prevista, repartida por unidad', () => {
    const expected: [string, number, string[]][] = [
      ['A1', 1, ['Me llamo', '¿Cómo estás?', 'usted', '¿y tú?']],
      ['A1', 2, ['eres', 'Soy de', 'Vivo en', 'mexicana', 'No ']],
      ['A1', 3, ['Tengo', 'tienes', 'años']],
      ['A1', 4, ['Mi ', 'Mis ', 'se llama']],
      ['A1', 5, ['Es ', 'una ', 'roja', 'esta']],
      ['A1', 6, ['Hay ', 'No hay', 'está', 'al lado de']],
      ['A1', 7, ['Quiero', 'Quisiera', 'tomo', 'el agua']],
      ['A1', 8, ['me levanto', 'trabajas', 'nosotros']],
      ['A1', 9, ['Son las', 'y media', 'menos cuarto']],
      ['A1', 10, ['Voy', ' al ', 'Dobla', 'a la derecha']],
      ['A1', 11, ['Me gusta', 'Me gustan', 'Prefiero']],
      ['A1', 12, ['¿Por qué', 'porque', '¿Cuánto cuesta']],
      ['A1', 13, ['¿A qué te dedicas?', 'Somos', 'Tienen']],
      ['A1', 14, ['es alto', 'estoy cansad', 'el pelo']],
      ['A1', 15, ['de julio', 'el primero', 'cumpleaños']],
      ['A1', 16, ['Hace calor', 'Llueve', 'más', 'que']],
      ['A1', 17, ['Voy a', 'autobús', 'a pie']],
      ['A2', 1, ['comí', 'hice', 'Ayer', 'Todavía no']],
      ['A2', 2, ['fui', 'Llegué', 'Hace dos años']],
      ['A2', 3, ['Me gustaría', '¿Podría', 'la cuenta']],
      ['A2', 4, ['era', 'tenía', 'jugaba', 'Había']],
      ['A2', 5, ['De repente', 'Mientras', 'estaba']],
      ['A2', 6, ['¿Quieres venir', 'claro', 'iré']],
      ['A2', 7, ['Tengo que', 'Hay que', 'desde hace']],
      ['A2', 8, ['Me duele', 'Descansa', 'No tomes']],
      ['A2', 9, ['mejor', 'más', 'Me lo llevo']],
      ['A2', 10, ['Lo llamo', 'Le escribo', 'Se lo mando']],
      ['A2', 11, ['nos conocimos', 'nunca', 'nadie', 'He estado']],
      ['A2', 12, ['Creo que', 'deberías', 'Si llueve', 'para', 'por']],
    ];
    for (const [level, position, structures] of expected) {
      const text = textOf(level, position).toLowerCase();
      for (const s of structures)
        expect([level, position, s, text.includes(s.toLowerCase())]).toEqual([
          level,
          position,
          s,
          true,
        ]);
    }
  });

  it('cada lección cierra con producción y hay comprensión en contexto en todas las unidades', () => {
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
      for (const p of ES_PATH.filter((x) => x.level === level))
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
    expect(lengths('A1').length).toBeGreaterThanOrEqual(34);
    expect(lengths('A2').length).toBeGreaterThanOrEqual(24);
    expect(average(lengths('A2'))).toBeGreaterThan(average(lengths('A1')));
  });

  it('los audios van lentos: A1 0.85 y A2 0.9', () => {
    for (const e of exercises)
      if (e.payload.type === 'context_choice' && e.payload.stimulus.kind === 'listening')
        expect(e.payload.stimulus.rate).toBe(e.payload.stimulus.id.includes('.a1-') ? 0.85 : 0.9);
  });

  it('el registro de ids incluye el español sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(ES_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^es\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
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
    const { sql, document } = esSql();
    expect(sql).toBe(migration);
    expect(document.units.map((u) => u.id)).toEqual(
      ES_PATH.map((p) => key(p.level, p.unit.position)),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
    expect(sql).not.toMatch(/curriculum_units_level_check/);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = esPublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(29);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
    // No cambia el estado del idioma: eso es una decisión aparte (docs/ES_A1_A2.md §6).
    expect(sql).not.toMatch(/public\.languages/);
  });

  it('acepta el plural y el femenino regulares de lo enseñado, no las formas verbales', () => {
    expect(esLemmas('casas')).toContain('casa');
    expect(esLemmas('colores')).toContain('color');
    expect(esLemmas('ciudades')).toContain('ciudad');
    expect(esLemmas('luces')).toContain('luz');
    expect(esLemmas('lecciones')).toContain('lección');
    expect(esLemmas('ingleses')).toContain('inglés');
    expect(esLemmas('jóvenes')).toContain('joven');
    expect(esLemmas('argentina')).toContain('argentino');
    expect(esLemmas('profesora')).toContain('profesor');
    expect(esLemmas('francesa')).toContain('francés');
    expect(esLemmas('hablamos')).not.toContain('hablo');
  });

  it('reconoce lo que suena igual en el Río de la Plata (seseo, yeísmo, b = v, h muda)', () => {
    const same: [string, string][] = [
      ['casa', 'caza'],
      ['vaca', 'baca'],
      ['calló', 'cayó'],
      ['hola', 'ola'],
      ['tuvo', 'tubo'],
      ['ciento', 'siento'],
    ];
    for (const [a, b] of same) expect([a, b, soundKey(a) === soundKey(b)]).toEqual([a, b, true]);
    const different: [string, string][] = [
      ['pero', 'perro'],
      ['caro', 'carro'],
      ['queso', 'peso'],
      ['gente', 'guerra'],
    ];
    for (const [a, b] of different)
      expect([a, b, soundKey(a) === soundKey(b)]).toEqual([a, b, false]);
  });

  describe('el validador detecta', () => {
    const lesson = () => a2.units[0]!.unit.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return esProblems();
      } finally {
        restore();
      }
    };
    const listen = () =>
      lesson().exercises.find((x) => x.type === 'listen_choice')! as ExerciseDef & {
        payload: { type: 'listen_choice'; options: string[] };
      };

    it('vocabulario no enseñado', () => {
      const e = listen();
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = 'Ayer compré un zepelín.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: .*zepelín/);
    });

    it('el voseo y el vosotros en lo que se muestra', () => {
      const e = listen();
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = '¿Vos sos de Madrid? Sois muy simpáticos.';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(
        /voseo, vosotros o regionalismo \(el curso enseña tú\): .*vos/,
      );
      expect(problems.join('\n')).toMatch(
        /voseo, vosotros o regionalismo \(el curso enseña tú\): .*sois/,
      );
    });

    it('opciones de escucha que suenan igual', () => {
      const e = listen();
      const problems = withMutation(() => {
        const before = [...e.payload.options];
        e.payload.options[1] = 'Es una casa.';
        e.payload.options[2] = 'Es una caza.';
        return () => {
          e.payload.options = before;
        };
      });
      expect(problems.join('\n')).toMatch(/suenan igual en el español latinoamericano/);
    });

    it('una pregunta sin el signo de apertura', () => {
      const e = listen();
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = 'Cómo estás?';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/falta abrir o cerrar la pregunta/);
    });

    it('opciones que sólo cambian en una tilde (esta / está)', () => {
      const e = lesson().exercises.find((x) => x.type === 'fill_blank')! as ExerciseDef & {
        payload: { type: 'fill_blank'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = [...e.payload.options];
        e.payload.options[1] = 'está';
        e.payload.options[2] = 'esta';
        return () => {
          e.payload.options = before;
        };
      });
      expect(problems.join('\n')).toMatch(/opciones repetidas/);
    });

    it('una forma de apoyo que no se usa o que ya estaba enseñada', () => {
      const support = a2.units[0]!.support;
      const problems = withMutation(() => {
        support.push('zepelín', 'hola');
        return () => {
          support.splice(-2, 2);
        };
      });
      expect(problems.join('\n')).toMatch(/la forma de apoyo «zepelín» no se usa/);
      expect(problems.join('\n')).toMatch(/«hola» ya está enseñada/);
    });

    it('un vínculo a una palabra de otro idioma', () => {
      const e = lesson().exercises[0]!;
      const problems = withMutation(() => {
        const before = e.words;
        e.words = [...before, 'it-ciao'];
        return () => {
          e.words = before;
        };
      });
      expect(problems.join('\n')).toMatch(/palabra it-ciao inexistente/);
    });

    it('una palabra nueva que repite el texto de una anterior', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.text;
        words[0]!.text = 'gracias';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«gracias» ya es la palabra es-gracias/);
    });
  });
});

describe('escritura de español (content/es/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(esWritingProblems()).toEqual([]);
  });

  it('cubre los temas de A1 y A2, guiadas y libres', () => {
    const lessons = (level: string, kind: string) =>
      ES_WRITING_TASKS.filter((t) => t.id.startsWith(`es.${level}.`) && t.kind === kind).map(
        (t) => t.lesson,
      );
    expect(lessons('a1', 'guided').length).toBeGreaterThanOrEqual(7);
    expect(lessons('a1', 'free')).toEqual(['es-a1-u17-final']);
    expect(lessons('a2', 'guided').length).toBeGreaterThanOrEqual(10);
    expect(lessons('a2', 'free')).toEqual(['es-a2-u06-final', 'es-a2-u12-final']);
    // Las consignas van en el idioma de apoyo (inglés) y los modelos, con tú.
    for (const t of ES_WRITING_TASKS) {
      expect([t.id, /[áéíóúñ¿¡]/.test(t.title)]).toEqual([t.id, false]);
      const tokens = esTokens(t.model);
      expect([t.id, tokens.some((x) => ['vos', 'sos', 'tenés', 'vosotros'].includes(x))]).toEqual([
        t.id,
        false,
      ]);
    }
  });

  it('la app encuentra las tareas de español en el registro común', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTasksForLesson('es-a1-u17-final').map((t) => t.id)).toEqual([
      'es.a1.wt.libre-yo',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('es.a1.wt.presentacion')!;
    expect(checkWriting(task, task.model).complete).toBe(true);
    expect(checkWriting(task, 'Hola.').complete).toBe(false);
  });

  it('una oración que abre con ¿ o ¡ cuenta como que empieza con mayúscula', () => {
    const task = writingTask('es.a1.wt.presentacion')!;
    const capital = (text: string) =>
      checkWriting(task, text).requirements.find((r) => r.id === 'capital')!.met;
    expect(capital('¡Hola! ¿Cómo estás? Me llamo Ana.')).toBe(true);
    expect(capital('¡hola! ¿cómo estás?')).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('es.a2.wt.libre-recuerdo')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Hola.').complete).toBeNull();
  });
});
