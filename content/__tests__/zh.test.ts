import { withNeutralSpanish } from '../../scripts/neutral-patch';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkWriting, writingTokens } from '../../shared/writing';
import { gradeWithSpec, gradingSpecFor } from '../../shared/grading';
import { EXTRA_READINGS, readingDictionary, unreadHan } from '../../shared/readings';
import { zhSql } from '../../scripts/build-zh-sql';
import { zhPublishSql } from '../../scripts/build-zh-publish-sql';
import { ITEM_REGISTRY_PATH, registryCatalog } from '../comprehension';
import { COURSES, CURRICULUM_PATH } from '../index';
import { ZH_COURSE, ZH_PATH } from '../zh-course';
import {
  displayedPinyin,
  zhFullDictionary,
  zhPilotSegmentationChanges,
  zhProblems,
  zhWritingProblems,
} from '../zh-checks';
import { misplacedToneMarks, samePinyin, syllables } from '../zh-pinyin';
import { ZH_A1_UNITS } from '../zh/a1';
import { ZH_WRITING_TASKS } from '../zh/writing';
import { WRITING_TASKS, writingTask, writingTasksForLesson } from '../writing';
import type { ExerciseDef } from '../types';

/**
 * Chino A1 U13–U16 y A2 U1–U12 (docs/ZH_A1_A2.md) y su escritura.
 */

const migration = readFileSync(
  join(__dirname, '../../supabase/migrations/20261130120000_zh_a1_a2.sql'),
  'utf8',
);
const publish = readFileSync(
  join(__dirname, '../../supabase/pending/20261201120000_publish_zh_a1_a2.sql'),
  'utf8',
);

const a1 = ZH_COURSE.find((l) => l.level === 'A1')!;
const a2 = ZH_COURSE.find((l) => l.level === 'A2')!;
const units = ZH_COURSE.flatMap((l) => l.units.map((u) => u.unit));
const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises));
const key = (level: string, position: number) =>
  `zh-${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;

describe('chino A1 U13–U16 y A2 (content/zh-course.ts)', () => {
  it('pasa todas las reglas', () => {
    expect(zhProblems()).toEqual([]);
  });

  it('A1 sigue al piloto (U13–U16) y A2 es U1–U12, fuera de COURSES y de CURRICULUM_PATH', () => {
    expect(ZH_A1_UNITS.map((u) => u.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(a1.units.map((u) => u.unit.position)).toEqual([13, 14, 15, 16]);
    expect(a2.units.map((u) => u.unit.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(COURSES.find((c) => c.language === 'zh')!.levels.map((l) => l.level)).toEqual(['A1']);
    const loaded = new Set(CURRICULUM_PATH.flatMap((p) => p.lessons.map((l) => l.id)));
    for (const p of ZH_PATH) for (const l of p.lessons) expect(loaded.has(l.id)).toBe(false);
  });

  it('cada unidad tiene el camino de siempre: 5 lecciones escritas y 5 repasos generados', () => {
    for (const p of ZH_PATH) {
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

  it('usa sólo tipos de ejercicio que ya existen, con lectura, escucha y tonos en cada unidad', () => {
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
      // Reconocimiento de tonos (escuchar y elegir el pinyin) en cada lección.
      for (const l of u.lessons.slice(0, 4))
        expect([
          u.position,
          l.title,
          l.exercises.some((e) => e.prompt === 'Escucha y elige el tono correcto'),
        ]).toEqual([u.position, l.title, true]);
    }
  });

  it('cubre la gramática prevista, repartida por unidad', () => {
    const textOf = (level: string, position: number) =>
      ZH_COURSE.find((l) => l.level === level)!
        .units.find((u) => u.unit.position === position)!
        .unit.lessons.flatMap((l) =>
          l.exercises.map(
            (e) =>
              `${e.answer} ${(e.acceptedAnswers ?? []).join(' ')} ${JSON.stringify(e.payload)}`,
          ),
        )
        .join(' ');
    const expected: [string, number, string[]][] = [
      ['A1', 13, ['你们', '他们', '都是', '在医院工作', '会说', '一点儿', '哪里']],
      ['A1', 14, ['红色的', '有点儿', '比我', '跟', '一样']],
      ['A1', 15, ['十月五号', '生日快乐', '下雨了', '二十岁了', '天气怎么样']],
      ['A1', 16, ['旁边', '往左', '可以', '一起', '吧', '去了', '没去']],
      ['A2', 1, ['打扫了', '已经', '还没', '呢', '两个电影']],
      ['A2', 2, ['去过', '两次', '从北京到上海', '是坐飞机来的', '个小时']],
      ['A2', 3, ['请给我', '来两碗', '尝尝', '买单', '预订']],
      ['A2', 4, ['正在', '在做饭呢', '在睡觉', '打电话', '一会儿']],
      ['A2', 5, ['头疼', '感冒了', '应该', '别吃', '多喝水']],
      ['A2', 6, ['有没有空', '想不想', '还是', '进来', '出去', '回来', '上来']],
      ['A2', 7, ['做完', '听懂', '写错', '说得很好', '学了两年']],
      ['A2', 8, ['贵多了', '一点儿', '最', '更', '没有', '那么', '打八折', '试试']],
      ['A2', 9, ['把照片发给你', '用手机', '发给你', '关']],
      ['A2', 10, ['以前', '不吃肉了', '越来越', '的时候', '一边']],
      ['A2', 11, ['为什么', '因为', '所以', '先', '再', '甜甜的']],
      ['A2', 12, ['觉得', '但是', '被偷了', '怎么办', '如果', '就']],
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
    expect(contextual.length).toBeGreaterThanOrEqual(90);
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
      for (const p of ZH_PATH.filter((x) => x.level === level))
        for (const l of p.lessons)
          for (const e of l.exercises)
            if (e.payload.type === 'context_choice') {
              const s = e.payload.stimulus;
              const text = s.kind === 'listening' ? s.lines.map((x) => x.text) : s.lines;
              byId.set(s.id, [...text.join('')].filter((c) => /[一-鿿]/.test(c)).length);
            }
      return [...byId.values()];
    };
    const average = (xs: number[]) => xs.reduce((n, x) => n + x, 0) / xs.length;
    expect(lengths('A1').length).toBeGreaterThanOrEqual(12);
    expect(lengths('A2').length).toBeGreaterThanOrEqual(36);
    expect(average(lengths('A2'))).toBeGreaterThan(average(lengths('A1')));
  });

  it('los audios van más lentos que en italiano: A1 0.8 y A2 0.85', () => {
    for (const e of exercises)
      if (e.payload.type === 'context_choice' && e.payload.stimulus.kind === 'listening')
        expect(e.payload.stimulus.rate).toBe(e.payload.stimulus.id.includes('.a1-') ? 0.8 : 0.85);
  });

  it('el registro de ids incluye el chino sin repetir ítems entre tramos', () => {
    expect(ITEM_REGISTRY_PATH).toEqual(expect.arrayContaining(ZH_PATH));
    expect(() => registryCatalog()).not.toThrow();
    expect(exercises.every((e) => /^zh\.ex\.[0-9a-z]{14}$/.test(e.id ?? ''))).toBe(true);
  });

  it('el servidor corrige como correctas la respuesta, las aceptadas, los caracteres y los números de tono', () => {
    for (const e of exercises.filter((x) => ['translate_write', 'short_answer'].includes(x.type))) {
      const spec = gradingSpecFor(e.type, e.mode);
      const content = {
        answer: e.answer,
        accepted_answers: e.acceptedAnswers ?? [],
        payload: e.payload,
      };
      for (const value of [e.answer, ...(e.acceptedAnswers ?? [])])
        expect([
          e.id,
          value,
          gradeWithSpec(spec, content, { kind: 'text', value }).correct,
        ]).toEqual([e.id, value, true]);
      // El pinyin con números de tono vale como el de las marcas, palabra por palabra (5 = neutro:
      // ta1men5). Limitación del corrector existente: «wo3men» sin el 5 no se convierte.
      const numbered = e.answer
        .replace(/[,，]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map((w) =>
          (syllables(w) ?? [])
            .reduce<string[]>(
              (out, x) =>
                // Erhua: la r va pegada a la sílaba anterior, antes del número (yi4dianr3).
                x.base === 'r'
                  ? [...out.slice(0, -1), out.at(-1)!.replace(/(\d)$/, 'r$1')]
                  : [...out, `${x.base}${x.tone}`.replace('ü', 'v')],
              [],
            )
            .join(''),
        )
        .join(' ');
      expect([
        e.id,
        gradeWithSpec(spec, content, { kind: 'text', value: numbered }).correct,
      ]).toEqual([e.id, true]);
    }
  });

  it('una respuesta sin tonos no se corrige como correcta', () => {
    const e = exercises.find(
      (x) => x.type === 'translate_write' && x.answer === 'wǒ zài dàxué gōngzuò',
    )!;
    const spec = gradingSpecFor(e.type, e.mode);
    const content = {
      answer: e.answer,
      accepted_answers: e.acceptedAnswers ?? [],
      payload: e.payload,
    };
    expect(
      gradeWithSpec(spec, content, { kind: 'text', value: 'wo zai daxue gongzuo' }).correct,
    ).toBe(false);
    expect(gradeWithSpec(spec, content, { kind: 'text', value: '我在大学工作' }).correct).toBe(
      true,
    );
  });

  it('todo el chino tiene pinyin para mostrar encima y coincide con el que se escribe', () => {
    const dict = readingDictionary([
      ...CURRICULUM_PATH.filter((p) => p.language === 'zh').flatMap((p) => p.unit.words),
      ...ZH_PATH.flatMap((p) => p.unit.words),
    ]);
    const texts = ZH_PATH.flatMap(({ unit, lessons }) => [
      ...unit.words.flatMap((w) => [w.text, w.exampleEn]),
      ...lessons.flatMap((l) => [
        ...(l.intro?.examples.map((x) => x.target) ?? []),
        ...l.exercises.flatMap((e) => [
          e.answer,
          ...(e.acceptedAnswers ?? []),
          JSON.stringify(e.payload),
        ]),
      ]),
    ]);
    expect([...new Set(texts.flatMap((t) => unreadHan(t, dict)))]).toEqual([]);
    expect(displayedPinyin('我们一起去公园吧', zhFullDictionary())).toBe(
      'wǒmen yìqǐ qù gōngyuán ba',
    );
    expect(samePinyin('liǎng ge xiǎoshí', 'liǎng gè xiǎoshí')).toBe(true);
    expect(samePinyin('bú shì', 'bù shì')).toBe(true);
    expect(samePinyin('lǎoshí', 'lǎoshī')).toBe(false);
  });

  it('las lecturas nuevas no cambian el pinyin del piloto (ni sus conjuntos de opciones cargados)', () => {
    expect(zhPilotSegmentationChanges()).toEqual([]);
    // Las lecturas del piloto siguen ahí.
    expect(EXTRA_READINGS['王明']).toBe('Wáng Míng');
  });

  it('la carga es la salida exacta del generador y no publica nada', () => {
    const { sql, document } = zhSql();
    expect(sql).toBe(withNeutralSpanish(migration));
    expect(document.units.map((u) => u.id)).toEqual(
      ZH_PATH.map((p) => key(p.level, p.unit.position)),
    );
    expect(sql).not.toMatch(/is_published\s*=\s*true|set is_published/i);
    expect(sql).not.toMatch(/curriculum_units_level_check/);
  });

  it('la publicación es la salida exacta del generador y deja la comprensión en draft', () => {
    const { sql, ids } = zhPublishSql();
    expect(sql).toBe(publish);
    expect(ids.units).toHaveLength(16);
    expect(ids.draft_items.length).toBe(
      exercises.filter((e) => e.type === 'context_choice').length,
    );
  });

  it('la marca de tono va sobre a / e, la o de «ou» o la última vocal', () => {
    for (const ok of [
      'nǐ hǎo',
      'xiè xie',
      'dōu',
      'duō',
      'liù',
      'guì',
      'nǚ',
      'lǜ',
      'yìdiǎnr',
      "nǚ'ér",
      "Xī'ān",
      'Zhōngguó',
      'ni3 hao3',
    ])
      expect(misplacedToneMarks(ok)).toEqual([]);
    expect(misplacedToneMarks('haǒ')).toEqual(['haǒ']);
    expect(misplacedToneMarks('lìu')).toEqual(['lìu']);
    expect(misplacedToneMarks('gúi')).toEqual(['gúi']);
    expect(misplacedToneMarks('doú')).toEqual(['doú']);
    expect(misplacedToneMarks('wǒ xíe')).toEqual(['xíe']);
  });

  describe('el validador detecta', () => {
    const lesson = () => a2.units[0]!.unit.lessons[0]!;
    const withMutation = (mutate: () => () => void) => {
      const restore = mutate();
      try {
        return zhProblems();
      } finally {
        restore();
      }
    };

    it('caracteres no enseñados', () => {
      const e = lesson().exercises.find((x) => x.type === 'listen_choice')! as ExerciseDef & {
        payload: { type: 'listen_choice'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = '我昨天买了一个鳄鱼。';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/caracteres no enseñados todavía: 鳄/);
    });

    it('pinyin que no coincide con los caracteres', () => {
      const e = lesson().exercises.at(-1)!;
      const problems = withMutation(() => {
        const before = e.answer;
        e.answer = e.answer.replace('pá', 'pà');
        return () => {
          e.answer = before;
        };
      });
      expect(problems.join('\n')).toMatch(/no coincide con/);
    });

    it('una palabra de una unidad posterior', () => {
      const e = lesson().exercises.find((x) => x.type === 'listen_choice')! as ExerciseDef & {
        payload: { type: 'listen_choice'; options: string[] };
      };
      const problems = withMutation(() => {
        const before = e.payload.options[1]!;
        e.payload.options[1] = '我们去机场吧。';
        return () => {
          e.payload.options[1] = before;
        };
      });
      expect(problems.join('\n')).toMatch(/palabra todavía no presentada: 机场/);
    });

    it('caracteres tradicionales', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.exampleEn;
        words[0]!.exampleEn = '我們已經吃飯了。';
        return () => {
          words[0]!.exampleEn = before;
        };
      });
      expect(problems.join('\n')).toMatch(/caracteres tradicionales: 們/);
    });

    it('una palabra con una sílaba de pinyin de menos', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.romanization;
        words[0]!.romanization = 'yǐ';
        return () => {
          words[0]!.romanization = before;
        };
      });
      expect(problems.join('\n')).toMatch(/1 sílabas para 2 caracteres/);
    });

    it('una marca de tono sobre la vocal equivocada', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.romanization;
        // Mismo tono y mismas sílabas, pero la marca de 经 sobre la n («jin̄g»).
        words[0]!.romanization = 'yǐjin̄g';
        return () => {
          words[0]!.romanization = before;
        };
      });
      expect(problems.join('\n')).toMatch(/marca de tono mal ubicada en yǐjin̄g/);
    });

    it('un apoyo sin pinyin o que no se usa', () => {
      const support = a2.units[0]!.support;
      const problems = withMutation(() => {
        support.push('鳄鱼');
        return () => {
          support.pop();
        };
      });
      expect(problems.join('\n')).toMatch(/«鳄鱼» no tiene pinyin/);
      expect(problems.join('\n')).toMatch(/la palabra de apoyo «鳄鱼» no se usa/);
    });

    it('una palabra nueva que repite el texto de una del piloto', () => {
      const words = a2.units[0]!.unit.words;
      const problems = withMutation(() => {
        const before = words[0]!.text;
        words[0]!.text = '谢谢';
        return () => {
          words[0]!.text = before;
        };
      });
      expect(problems.join('\n')).toMatch(/«谢谢» ya es la palabra zh-xie-xie/);
    });
  });
});

describe('escritura de chino (content/zh/writing.ts)', () => {
  it('pasa todas las reglas: definición, lección existente, caracteres enseñados y pinyin del modelo', () => {
    expect(zhWritingProblems()).toEqual([]);
  });

  it('cubre los temas de A1 y A2, guiadas y libres', () => {
    const lessons = (level: string, kind: string) =>
      ZH_WRITING_TASKS.filter((t) => t.id.startsWith(`zh.${level}.`) && t.kind === kind).map(
        (t) => t.lesson,
      );
    expect(lessons('a1', 'guided')).toEqual([
      'zh-a1-u02-l05',
      'zh-a1-u04-l05',
      'zh-a1-u06-l05',
      'zh-a1-u08-l05',
      'zh-a1-u11-l05',
      'zh-a1-u13-l05',
      'zh-a1-u14-l05',
      'zh-a1-u16-l05',
    ]);
    expect(lessons('a1', 'free')).toEqual(['zh-a1-u16-final']);
    expect(lessons('a2', 'guided')).toHaveLength(11);
    expect(lessons('a2', 'free')).toEqual(['zh-a2-u06-final', 'zh-a2-u12-final']);
  });

  it('la app encuentra las tareas de chino en el registro común', () => {
    expect(WRITING_TASKS.length).toBe(new Set(WRITING_TASKS.map((t) => t.id)).size);
    expect(writingTask('zh.a2.wt.yuding')?.lesson).toBe('zh-a2-u03-l05');
    expect(writingTasksForLesson('zh-a1-u16-final').map((t) => t.id)).toEqual(['zh.a1.wt.ziyou']);
  });

  it('en chino cada carácter es una ficha y el pinyin vale con marcas, con números o sin tonos', () => {
    expect(writingTokens('我叫安娜。')).toEqual(['我', '叫', '安', '娜']);
    const task = writingTask('zh.a1.wt.jieshao')!;
    for (const text of [
      '你好！我叫李明。我是中国人。我是老师。',
      'Nǐ hǎo! Wǒ jiào Lǐ Míng. Wǒ shì Zhōngguó rén.',
      'ni3 hao3. wo3 jiao4 Ana. wo3 shi4 xue2sheng.',
      'ni hao. wo jiao Ana. wo shi xuesheng.',
    ])
      expect([text, checkWriting(task, text).complete]).toEqual([text, true]);
    expect(checkWriting(task, '你好。我是学生。').complete).toBe(false);
  });

  it('el cambio no altera la escritura de los otros idiomas', () => {
    expect(writingTokens("I'm from Rosario. Sono di Roma!")).toEqual([
      "i'm",
      'from',
      'rosario',
      'sono',
      'di',
      'roma',
    ]);
  });

  it('una libre nunca da veredicto', () => {
    const task = writingTask('zh.a2.wt.wenti')!;
    expect(checkWriting(task, task.model).complete).toBeNull();
    expect(checkWriting(task, '你好。').complete).toBeNull();
  });
});
