import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting } from '../../shared/writing';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { languageConfig, VISIBLE_LANGUAGES } from '../../shared/languages';
import { frSql } from '../../scripts/build-fr-sql';
import { frPublishSql } from '../../scripts/build-fr-publish-sql';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { COURSES, CURRICULUM_PATH } from '../index';
import { FR_COURSE, FR_PATH } from '../fr-course';
import { frLemmas, frProblems, frWritingProblems } from '../fr-checks';
import { FR_WRITING_TASKS } from '../fr/writing';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Francés A1 U1–U17 y A2 U1–U13 (docs/FR_A1_A2.md) y su escritura.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261202120000_fr_a1_a2.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261203120000_publish_fr_a1_a2.sql'),
  'utf8',
);

const a1 = FR_COURSE.find((l) => l.level === 'A1')!;
const a2 = FR_COURSE.find((l) => l.level === 'A2')!;
const units = FR_COURSE.flatMap((l) => l.units.map((u) => u.unit));
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));
const key = (level: string, position: number) =>
  `fr-${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;
const textOf = (level: string, position: number) =>
  FR_COURSE.find((l) => l.level === level)!
    .units.find((u) => u.unit.position === position)!
    .unit.lessons.flatMap((l) => l.exercises.map((e) => `${e.answer} ${JSON.stringify(e.payload)}`))
    .join(' ');

describe('francés A1 y A2 (content/fr-course.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(frProblems()).toEqual([]);
  });

  it('el idioma está disponible para todos con A1 y A2, sin Ranked', () => {
    const fr = languageConfig('fr');
    expect([fr.code, fr.status, fr.ranked, fr.speechLocale, [...fr.levels]]).toEqual([
      'fr',
      'available',
      false,
      'fr-FR',
      ['A1', 'A2'],
    ]);
    expect(VISIBLE_LANGUAGES.map((l) => l.code)).toContain('fr');
    // Los niveles que se eligen al registrarse son exactamente los del curso.
    expect([...fr.levels]).toEqual(FR_COURSE.map((l) => l.level));
  });

  it('A1 es U1–U17 y A2 es U1–U13, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(a1.units.map((u) => u.unit.position)).toEqual(
      Array.from({ length: 17 }, (_, i) => i + 1),
    );
    expect(a2.units.map((u) => u.unit.position)).toEqual(
      Array.from({ length: 13 }, (_, i) => i + 1),
    );
    expect(COURSES.some((c) => c.language === 'fr')).toBe(false);
    expect(CURRICULUM_PATH.some((p) => p.language === 'fr')).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of FR_PATH) {
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

  it('cubre la gramática prevista, repartida por unidad', () => {
    const expected: [string, number, string[]][] = [
      ['A1', 1, ["Je m'appelle", 'Ça va', 'Et vous', "s'il vous plaît", "s'il ___ plaît"]],
      ['A1', 2, ['Je suis', 'Vous êtes', 'française', 'ne suis pas', "J'habite"]],
      ['A1', 3, ["J'ai", 'ans', 'Quel âge as-tu']],
      ['A1', 4, ['Mon', 'Ma', 'Mes', "s'appelle"]],
      ['A1', 5, ["C'est", 'Ce sont', 'une', 'des', 'verte']],
      ['A1', 6, ['Il y a', "n'y a pas de", 'sur', 'sous']],
      ['A1', 7, ['du', 'de la', "de l'", 'Je voudrais']],
      ['A1', 8, ['Je me lève', 'nous', 'ils']],
      ['A1', 9, ['heures', 'et demie', 'moins le quart']],
      ['A1', 10, ['au', 'à la', 'Tournez', 'allons', 'vont']],
      ['A1', 11, ["J'aime le", 'jouer', 'fais']],
      ['A1', 12, ['Est-ce que', 'Pourquoi', 'parce que', 'combien']],
      ['A1', 13, ['médecin', 'Nous sommes', 'Ils ont', 'Ils sont']],
      ['A1', 14, ['belle', 'vieille', 'les yeux', 'les cheveux']],
      ['A1', 15, ['le premier', 'juillet', 'anniversaire']],
      ['A1', 16, ['Il fait', 'Il pleut', 'au printemps', 'en hiver']],
      ['A1', 17, ['Je vais', '___ pied', 'en train']],
      ['A2', 1, ["J'ai mangé", "J'ai fait", 'pas encore', 'déjà']],
      ['A2', 2, ['Je suis allé', 'partie', 'il y a']],
      ['A2', 3, ["J'aimerais", 'Pourriez-vous', "L'addition"]],
      ['A2', 4, ["J'étais", 'il y avait', 'jouais', "d'habitude"]],
      ['A2', 5, ['pendant que', 'Soudain', 'en train de']],
      ['A2', 6, ["J'irai", 'Je ferai', 'avec plaisir', 'dans deux jours']],
      ['A2', 7, ['Je dois', 'Il faut', 'depuis']],
      ['A2', 8, ["J'ai mal", 'Reposez-vous']],
      ['A2', 9, ['plus', 'que', 'meilleur', "J'en"]],
      ['A2', 10, ["Je l'appelle", 'Je lui', 'leur']],
      ['A2', 11, ['me suis', "j'y", 'jamais', 'personne']],
      ['A2', 12, ['À mon avis', 'devrais', 'pourrait', "S'il", 'dit que']],
      [
        'A2',
        13,
        ['chez moi', 'moi aussi', 'moi non plus', 'Regarde', 'allons', 'Dépêche-toi', 'te dépêche'],
      ],
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
      for (const p of FR_PATH.filter((x) => x.level === level))
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

  it('escribe el francés con apóstrofo recto y sin espacio antes de ? y !', () => {
    for (const e of exercises) {
      const text = JSON.stringify(e.payload) + e.answer + (e.acceptedAnswers ?? []).join(' ');
      expect([e.id, /’/.test(text)]).toEqual([e.id, false]);
      expect([e.id, / [?!]/.test(text)]).toEqual([e.id, false]);
    }
  });

  it('el registro de ids incluye el francés sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(FR_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^fr\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
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
    const { sql, document } = frSql();
    expect(sql).toBe(migration);
    expect(document.units.map((u) => u.id)).toEqual(
      FR_PATH.map((p) => key(p.level, p.unit.position)),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
    expect(sql).not.toMatch(/curriculum_units_level_check/);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = frPublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(30);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
    // No cambia el estado del idioma: eso es una decisión aparte (docs/FR_A1_A2.md §6).
    expect(sql).not.toMatch(/public\.languages/);
  });

  it('acepta el plural y el femenino regulares de lo enseñado', () => {
    expect(frLemmas('amies')).toContain('ami');
    expect(frLemmas('grandes')).toContain('grand');
    expect(frLemmas('italienne')).toContain('italien');
    expect(frLemmas('vendeuse')).toContain('vendeur');
    expect(frLemmas('sportive')).toContain('sportif');
    expect(frLemmas('chevaux')).toContain('cheval');
    expect(frLemmas('boulangère')).toContain('boulanger');
    expect(frLemmas('parlons')).not.toContain('parle');
  });

  describe('el validador detecta', () => {
    const lesson = () => a2.units[0]!.unit.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return frProblems();
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
        e.payload.options[1] = "Hier, j'ai acheté un zeppelin.";
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/vocabulario no enseñado todavía: .*zeppelin/);
    });

    it('opciones que sólo cambian en una tilde (a / à)', () => {
      const e = lesson().exercises.find((x) => x.type === 'fill_blank')! as ExerciseDef & {
        payload: { type: 'fill_blank'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = [...e.payload.options];
        e.payload.options[1] = e.payload.options[0]!.normalize('NFD').replace(/[̀-ͯ]/g, '') + 'à';
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
        support.push('zeppelin', 'bonjour');
        return () => {
          support.splice(-2, 2);
        };
      });
      expect(problems.join('\n')).toMatch(/la forma de apoyo «zeppelin» no se usa/);
      expect(problems.join('\n')).toMatch(/«bonjour» ya está enseñada/);
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
        words[0]!.text = 'merci';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«merci» ya es la palabra fr-merci/);
    });
  });
});

describe('escritura de francés (content/fr/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente y vocabulario enseñado', () => {
    expect(frWritingProblems()).toEqual([]);
  });

  it('cubre los temas de A1 y A2, guiadas y libres', () => {
    const lessons = (level: string, kind: string) =>
      FR_WRITING_TASKS.filter((t) => t.id.startsWith(`fr.${level}.`) && t.kind === kind).map(
        (t) => t.lesson,
      );
    expect(lessons('a1', 'guided').length).toBeGreaterThanOrEqual(7);
    expect(lessons('a1', 'free')).toEqual(['fr-a1-u17-final']);
    expect(lessons('a2', 'guided').length).toBeGreaterThanOrEqual(10);
    expect(lessons('a2', 'free')).toEqual(['fr-a2-u06-final', 'fr-a2-u12-final']);
  });

  it('la app encuentra las tareas de francés en el registro común', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTasksForLesson('fr-a1-u17-final').map((t) => t.id)).toEqual([
      'fr.a1.wt.libre-moi',
    ]);
  });

  it('una guiada se completa con los requisitos y no con un texto que no los cumple', () => {
    const task = writingTask('fr.a1.wt.presentation')!;
    expect(checkWriting(task, task.model).complete).toBe(true);
    expect(checkWriting(task, 'Bonjour.').complete).toBe(false);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('fr.a2.wt.libre-souvenir')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, 'Salut.').complete).toBeNull();
  });
});
