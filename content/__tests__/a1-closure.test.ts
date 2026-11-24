import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting, hasPattern, writingTaskProblems, writingTokens } from '../../shared/writing';
import { assessmentProblems, coverageOf, sectionCounts } from '../assessment-checks';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { EN_A1_BLOCKS, EN_A1_MAP, EN_A1_RETIRED_CODES, EN_A1_ROUTE_ORDER } from '../curriculum-map';
import { EN_A1_ASSESSMENTS, FINAL_A, FINAL_B, type AssessmentFormDef } from '../en/a1/assessment';
import { EN_A1_SUPPLEMENTS } from '../en/a1/closure';
import { EN_A1_WRITING_TASKS, writingTask } from '../en/a1/writing';
import { CURRICULUM_PATH } from '../index';
import { SUPPLEMENT_PATH, baseUnit } from '../supplement';
import {
  advancedWords,
  mapFormatOf,
  supplementProblems,
  taughtFormsUpTo,
} from '../supplement-checks';
import { lemmaCandidates, tokensOfText } from '../comprehension';
import type { ExerciseDef } from '../types';
import { a1ClosureSql } from '../../scripts/build-a1-closure-sql';

/**
 * Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados del mapa, escritura sin IA, puntos de control
 * y evaluación final.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261119120000_a1_en_closure.sql'),
  'utf8',
);

describe('agregados del mapa (content/en/a1/closure.ts)', () => {
  it('pasan todas las reglas', () => {
    expect(supplementProblems()).toEqual([]);
  });

  it('agregan al final de la lección cargada sin cambiar sus ejercicios', () => {
    for (const p of SUPPLEMENT_PATH) {
      const base = baseUnit(p.language, p.level, p.unit.position);
      for (const l of p.lessons.filter((x) => x.exerciseOffset)) {
        const loaded = base.lessons.find((x) => x.id === l.id)!;
        expect(l.exerciseOffset).toBe(loaded.exercises.length);
        expect([l.position, l.title, l.objective]).toEqual([
          loaded.position,
          loaded.title,
          loaded.objective,
        ]);
      }
    }
  });

  it('las lecciones nuevas del mapa existen con su id y van después de la «En contexto»', () => {
    const added = SUPPLEMENT_PATH.flatMap((p) => p.lessons.filter((l) => !l.exerciseOffset));
    expect(added.map((l) => [l.id, l.title])).toEqual([
      ['a1-u05-l06', 'Uno, dos, muchos'],
      ['a1-u09-l06', 'Meses y fechas'],
      ['a1-u12-l06', 'Mensajes y postales'],
    ]);
    for (const l of added) expect(l.position).toBeGreaterThan(11);
  });

  it('no tocan el camino cargado: CURRICULUM_PATH no contiene ningún ejercicio del cierre', () => {
    const ids = new Set(
      EN_A1_SUPPLEMENTS.flatMap((s) => [
        ...s.appendices.flatMap((a) => a.exercises),
        ...s.lessons.flatMap((l) => l.exercises),
      ]).map((e) => e.id),
    );
    const loaded = CURRICULUM_PATH.flatMap((p) =>
      p.lessons.flatMap((l) => l.exercises.map((e) => e.id)),
    );
    expect(loaded.filter((id) => id && ids.has(id))).toEqual([]);
  });

  it("cubre los pendientes del mapa: 0–20, the, plurales, 's, I'd like, in/on, meses y fechas, pronombres objeto, TR, SIT y PW", () => {
    const words = new Set(EN_A1_SUPPLEMENTS.flatMap((s) => s.words.map((w) => w.id)));
    for (const w of [
      'en-zero',
      'en-thirteen',
      'en-fourteen',
      'en-sixteen',
      'en-seventeen',
      'en-eighteen',
      'en-nineteen',
      'en-the',
      'en-men',
      'en-women',
      'en-children',
      'en-people',
      'en-january',
      'en-december',
      'en-first',
      'en-third',
      'en-me',
      'en-them',
    ])
      expect(words.has(w)).toBe(true);
    const formats = new Set(
      EN_A1_SUPPLEMENTS.flatMap((s) => [
        ...s.appendices.flatMap((a) => a.exercises),
        ...s.lessons.flatMap((l) => l.exercises),
      ]).map(mapFormatOf),
    );
    for (const f of ['PW', 'TR', 'SIT', 'LM', 'RQ'] as const) expect(formats.has(f)).toBe(true);
    // PW en cada unidad U1–U12 (mapa §8, punto 5).
    for (const u of EN_A1_ROUTE_ORDER.filter((x) => x <= 12)) {
      const s = EN_A1_SUPPLEMENTS.find((x) => x.unit === u)!;
      const all = [
        ...s.appendices.flatMap((a) => a.exercises),
        ...s.lessons.flatMap((l) => l.exercises),
      ];
      expect([u, all.some((e) => mapFormatOf(e) === 'PW')]).toEqual([u, true]);
    }
  });

  it('nunca usa códigos retirados (cR04, v13, p12, g24)', () => {
    const codes = EN_A1_SUPPLEMENTS.flatMap((s) =>
      [...s.appendices.map((a) => a.curriculum), ...s.lessons.map((l) => l.curriculum)].flatMap(
        (c) => [...c.primary, ...c.secondary],
      ),
    );
    for (const r of EN_A1_RETIRED_CODES) expect(codes).not.toContain(r);
  });

  it("las palabras que adelanta (profesiones, I'd like, birthday, month, help) quedan listadas", () => {
    const words = [...new Set(advancedWords().map((w) => w.word))].sort();
    expect(words).toEqual([
      'en-birthday',
      'en-doctor',
      'en-engineer',
      'en-help',
      'en-id-like',
      'en-month',
      'en-nurse',
      'en-waiter',
    ]);
  });

  it('el registro de ids incluye el cierre sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(SUPPLEMENT_PATH));
    expect(() => registryCatalog()).not.toThrow();
  });

  it('la migración es la salida exacta del generador', () => {
    expect(a1ClosureSql().sql).toBe(migration);
  });

  describe('el validador detecta', () => {
    const clone = () => JSON.parse(JSON.stringify(EN_A1_SUPPLEMENTS)) as typeof EN_A1_SUPPLEMENTS;
    const run = (mutate: (s: (typeof EN_A1_SUPPLEMENTS)[number][]) => void) => {
      const copy = clone() as (typeof EN_A1_SUPPLEMENTS)[number][];
      mutate(copy);
      let problems: string[] = [];
      jest.isolateModules(() => {
        jest.doMock('../en/a1/closure', () => ({ EN_A1_SUPPLEMENTS: copy }));
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        problems = require('../supplement-checks').supplementProblems();
      });
      jest.dontMock('../en/a1/closure');
      return problems.join('\n');
    };
    it('un código retirado', () => {
      expect(run((s) => s[0]!.appendices[0]!.curriculum.secondary.push('cR04'))).toMatch(
        /retirado cR04/,
      );
    });
    it('vocabulario que todavía no se enseñó', () => {
      expect(
        run((s) => {
          const e = s[0]!.appendices[0]!.exercises[0]! as ExerciseDef & {
            payload: { sentence: string };
          };
          e.payload.sentence = '___, Ana! Banana kitchen.';
        }),
      ).toMatch(/no enseñado todavía: .*banana, kitchen/);
    });
    it('una opción repetida o una respuesta que no está entre las opciones', () => {
      expect(
        run((s) => {
          const e = s[1]!.appendices[0]!.exercises[0]! as ExerciseDef & {
            payload: { options: string[] };
          };
          e.payload.options = ['teacher', 'Teacher', 'student', 'friend'];
        }),
      ).toMatch(/opciones repetidas|una sola vez/);
    });
    it('un formato que no practica ni evalúa el objetivo', () => {
      expect(
        run((s) => (s[1]!.appendices[1]!.curriculum = { primary: ['v01'], secondary: [] })),
      ).toMatch(/el formato TR no evalúa ni practica v01/);
    });
    it('una aceptada que el servidor no corrige como correcta', () => {
      expect(
        run((s) => {
          const e = s[2]!.appendices[0]!.exercises[7]!;
          e.answer = 'thirteen';
          e.acceptedAnswers = [''];
        }),
      ).toMatch(/no se corrige como correcta/);
    });
  });
});

describe('escritura sin IA (shared/writing.ts)', () => {
  it('todas las tareas son válidas y su modelo cumple sus requisitos', () => {
    expect(EN_A1_WRITING_TASKS.flatMap(writingTaskProblems)).toEqual([]);
  });

  it('cubre GW en las lecciones que el mapa pasa a GW y una tarea por bloque', () => {
    expect(EN_A1_WRITING_TASKS.filter((t) => t.kind === 'guided').map((t) => t.lesson)).toEqual([
      'a1-u01-l05',
      'a1-u03-l04',
      'a1-u04-l05',
      'a1-u08-l05',
      'a1-u11-l05',
      'a1-u12-l05',
    ]);
    expect(EN_A1_WRITING_TASKS.filter((t) => t.kind === 'free').map((t) => t.block)).toEqual([
      1, 2, 3, 4,
    ]);
    // Se ofrecen tras el repaso final de la última unidad del bloque en el camino publicado.
    expect(EN_A1_WRITING_TASKS.filter((t) => t.kind === 'free').map((t) => t.lesson)).toEqual([
      'a1-u04-final',
      'a1-u07-final',
      'a1-u09-final',
      'a1-u12-final',
    ]);
    const published = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const t of EN_A1_WRITING_TASKS)
      expect([t.id, published.has(t.lesson!)]).toEqual([t.id, true]);
    for (const b of EN_A1_BLOCKS) {
      const codes = EN_A1_WRITING_TASKS.filter((t) => t.block === b.block).flatMap((t) => t.codes);
      for (const c of b.writing) expect([b.block, codes.includes(c)]).toEqual([b.block, true]);
    }
  });

  it('tokens y patrones: normaliza mayúsculas, apóstrofos y puntuación', () => {
    expect(writingTokens('Hi! I’m TOM, twenty-one.')).toEqual(['hi', "i'm", 'tom', 'twenty-one']);
    expect(hasPattern(writingTokens('I am 20 years old'), ['i', 'am', '<NUMBER>'])).toBe(true);
    expect(hasPattern(writingTokens('I am twenty-one'), ['i', 'am', '<NUMBER>'])).toBe(true);
    expect(hasPattern(writingTokens('I have twenty years'), ['i', 'am', '<NUMBER>'])).toBe(false);
    expect(hasPattern(writingTokens("I'm from Peru"), ["i'm|i", 'from', '<WORD>'])).toBe(true);
  });

  it('guiada: completa sólo con todos los requisitos; nunca juzga la gramática', () => {
    const task = writingTask('en.a1.wt.my-age')!;
    expect(checkWriting(task, 'I am 31 years old. I am from Peru.').complete).toBe(true);
    // Datos inventados o reales: da igual, no se comparan con nada.
    expect(checkWriting(task, 'I am seventeen. I am from Japan.').complete).toBe(true);
    const missing = checkWriting(task, 'I have 31 years. I am from Peru.');
    expect(missing.complete).toBe(false);
    expect(missing.requirements.find((r) => r.id === 'age')!.met).toBe(false);
    expect(checkWriting(task, '').complete).toBe(false);
    expect(
      checkWriting(task, 'i am 31. i am from peru').requirements.find((r) => r.id === 'capital')!
        .met,
    ).toBe(false);
  });

  it('libre: nunca hay veredicto, sólo pistas y la lista de control', () => {
    const task = writingTask('en.a1.wt.block1-introduce')!;
    for (const text of [
      '',
      'xx',
      task.model,
      'Hello. I am Leo. I am ten. I am from Chile. He is my friend.',
    ])
      expect(checkWriting(task, text).complete).toBeNull();
    expect(task.requirements.every((r) => r.optional)).toBe(true);
    expect(task.checklist.length).toBeGreaterThanOrEqual(2);
  });

  it('modelos y preguntas guía usan sólo vocabulario enseñado hasta su lección o bloque (o del glosario)', () => {
    const names = new Set(['ana', 'tom', 'rosa', 'leo', 'london', 'argentina', 'england', 'spain']);
    for (const t of EN_A1_WRITING_TASKS) {
      const unit = t.lesson
        ? Number(t.lesson.slice(4, 6))
        : [...EN_A1_BLOCKS.find((b) => b.block === t.block)!.units].pop()!;
      const taught = taughtFormsUpTo('en', unit);
      const glossary = new Set((t.glossary ?? []).flatMap((g) => tokensOfText(g.term)));
      const bad = [...new Set([t.model, ...t.prompts].flatMap(tokensOfText))].filter(
        (x) => !lemmaCandidates(x).some((c) => taught.has(c) || names.has(c) || glossary.has(c)),
      );
      expect([t.id, bad]).toEqual([t.id, []]);
    }
  });

  it('es determinista: mismo texto, mismo resultado', () => {
    for (const t of EN_A1_WRITING_TASKS)
      expect(checkWriting(t, t.model)).toEqual(checkWriting(t, t.model));
  });
});

describe('puntos de control y evaluación final (content/en/a1/assessment.ts)', () => {
  it('pasan todas las reglas (formato de «Evaluar», no vistos, A1, sin ambigüedad, cobertura)', () => {
    expect(assessmentProblems()).toEqual([]);
  });

  it('cuatro puntos de control, uno por bloque, y dos formas paralelas del final', () => {
    expect(EN_A1_ASSESSMENTS.map((f) => f.id)).toEqual([
      'en.a1.cp1',
      'en.a1.cp2',
      'en.a1.cp3',
      'en.a1.cp4',
      'en.a1.final.a',
      'en.a1.final.b',
    ]);
    const profile = (f: AssessmentFormDef) => f.items.map((i) => `${i.code}:${i.format}`).sort();
    expect(profile(FINAL_A)).toEqual(profile(FINAL_B));
  });

  it('el final cubre todos los objetivos del mapa y informa las cuatro secciones', () => {
    for (const f of [FINAL_A, FINAL_B]) {
      const cov = coverageOf(f);
      expect(EN_A1_MAP.map((m) => m.code).filter((c) => !cov.all.has(c))).toEqual([]);
      const counts = sectionCounts(f);
      expect(Object.values(counts).every((n) => n > 0)).toBe(true);
    }
  });

  it('los objetivos que sólo se evalúan con escritura propia van como tareas autoevaluadas', () => {
    const cov = coverageOf(FINAL_A);
    for (const c of ['p02', 'p05', 'p06', 'p08', 'p09']) {
      expect(cov.items.has(c)).toBe(false);
      expect(cov.writing.has(c)).toBe(true);
    }
  });

  it('el validador rechaza un ítem que reconoce cuando el objetivo pide producir', () => {
    const bad: AssessmentFormDef = {
      ...FINAL_A,
      id: 'en.a1.final.x',
      items: FINAL_A.items.map((i) =>
        i.key === 'fa-v03'
          ? { ...i, key: 'fx-v03', format: 'FB' as const }
          : { ...i, key: `x-${i.key}` },
      ),
    };
    expect(assessmentProblems([bad, FINAL_B]).join('\n')).toMatch(/FB no está en «Evaluar» de v03/);
  });

  it('el validador rechaza un ítem que ya aparece en una lección', () => {
    const lessonItem = SUPPLEMENT_PATH[2]!.lessons[0]!.exercises[7]!;
    const bad: AssessmentFormDef = {
      ...FINAL_A,
      id: 'en.a1.final.y',
      items: FINAL_A.items.map((i) =>
        i.key === 'fa-v03'
          ? { ...i, key: 'fy-v03', exercise: lessonItem }
          : { ...i, key: `y-${i.key}` },
      ),
    };
    expect(assessmentProblems([bad, FINAL_B]).join('\n')).toMatch(/ya aparece en una lección/);
  });
});
