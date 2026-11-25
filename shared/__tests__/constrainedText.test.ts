/**
 * constrained_text.v1 (fase 5, docs/FREE_PRODUCTION_GRADING_SPEC.md §3 y §5.3): motor determinista,
 * sin activar. Estas pruebas fijan su comportamiento antes de que exista ningún ítem.
 */
import {
  CONSTRAINED_TEXT_ID,
  constrainedSpecProblems,
  damerau,
  EMPTY_LISTS,
  gradeConstrainedText,
  tokenize,
  type ClosedLists,
  type ConstrainedTextSpec,
} from '../constrainedText';
import { GRADING_MODES } from '../grading';

const base: ConstrainedTextSpec = {
  mode: 'constrained_text',
  mode_version: 1,
  normalizer: 'polygo.answers.v1',
  accept: [{ tokens: ['i', '(am|was)', 'from', '<CITY>'] }],
  max_tokens: 8,
  typo_tolerance: { max_distance: 1, min_length: 6 },
  partial: 'none',
};

// Listas de PRUEBA (no son contenido editorial: no existe ninguna lista real).
const lists: ClosedLists = {
  version: 'test.v1',
  classes: { CITY: ['Rosario', 'Córdoba', 'Buenos Aires'], L1_WORD: ['soy', 'de'] },
  lemma_forms: { be: ['am', 'is', 'are', 'was', 'were'], from: ['from'] },
  lexicon: [
    'i',
    'am',
    'is',
    'are',
    'was',
    'were',
    'from',
    'form',
    'there',
    'three',
    'rosario',
    'córdoba',
    'live',
    'in',
  ],
};
const content = { answer: 'I am from Rosario.', accepted_answers: ["I'm from Rosario."] };
const grade = (raw: string, spec: Partial<ConstrainedTextSpec> = {}, l: ClosedLists = lists) =>
  gradeConstrainedText({ ...base, ...spec }, content, raw, l);

describe('constrained_text.v1: no está activado', () => {
  it('no es un modo de corrección registrado', () => {
    expect(GRADING_MODES.map((m) => m.id)).not.toContain(CONSTRAINED_TEXT_ID);
  });
});

describe('especificación', () => {
  it('una clase o un lema sin lista cerrada hace la especificación inválida (no se inventan listas)', () => {
    expect(constrainedSpecProblems(base, EMPTY_LISTS)).toEqual(['clase sin lista cerrada: <CITY>']);
    expect(constrainedSpecProblems({ ...base, require_lemmas: ['be'] }, EMPTY_LISTS)).toContain(
      'lema sin tabla de formas cerradas: be',
    );
    expect(() => gradeConstrainedText(base, content, 'I am from Rosario', EMPTY_LISTS)).toThrow();
    expect(constrainedSpecProblems(base, lists)).toEqual([]);
  });

  it('rechaza crédito parcial, patrones vacíos o todo opcional y tolerancias fuera de rango', () => {
    expect(constrainedSpecProblems({ ...base, partial: 'fraction' }, lists)).toContain(
      'partial: v1 sólo admite none',
    );
    expect(constrainedSpecProblems({ ...base, accept: [] }, lists)).toContain('accept vacío');
    expect(constrainedSpecProblems({ ...base, accept: [{ tokens: ['[i]'] }] }, lists)).toContain(
      'accept[0]: todo opcional',
    );
    expect(
      constrainedSpecProblems(
        { ...base, typo_tolerance: { max_distance: 3, min_length: 6 } },
        lists,
      ),
    ).toContain('typo_tolerance');
  });
});

describe('alternativas, opcionales y clases', () => {
  it('acepta las alternativas válidas y la respuesta exacta de la versión', () => {
    expect(grade('I am from Rosario').status).toBe('graded');
    expect(grade('I am from Rosario')).toMatchObject({ verdict: 'correct' });
    expect(grade("I'm from Rosario")).toMatchObject({ verdict: 'correct' }); // contracción de v1
    expect(grade('I was from Córdoba')).toMatchObject({ verdict: 'correct' });
    expect(grade('I am from Buenos Aires')).toMatchObject({ verdict: 'correct' }); // entrada de varias fichas
  });

  it('una clase no acepta nombres fuera de la lista', () => {
    expect(grade('I am from Madrid')).toMatchObject({ verdict: 'incorrect' });
  });

  it('opcionales', () => {
    const spec = { accept: [{ tokens: ['i', '[really]', '(am|was)', 'from', '<CITY>'] }] };
    expect(grade('I really am from Rosario', spec)).toMatchObject({ verdict: 'correct' });
    expect(grade('I am from Rosario', spec)).toMatchObject({ verdict: 'correct' });
    expect(grade('I am really from Rosario', spec)).toMatchObject({ verdict: 'incorrect' });
  });

  it('<NUMBER> es determinista (dígitos Unicode)', () => {
    const spec = { accept: [{ tokens: ['i', 'am', '<NUMBER>'] }] };
    expect(grade('I am 25', spec)).toMatchObject({ verdict: 'correct' });
    expect(grade('I am twenty', spec)).toMatchObject({ verdict: 'incorrect' });
  });
});

describe('tipeo, acentos y Unicode', () => {
  it('tipeo por ficha sólo desde min_length, con Damerau (transposición = 1)', () => {
    expect(damerau('rosario', 'rosraio')).toBe(1);
    expect(grade('I am from Rosraio')).toMatchObject({ verdict: 'typo' });
    expect(grade('I am from Rosraio').detail.typos).toEqual([
      { expected: 'rosario', given: 'rosraio' },
    ]);
    // «from» tiene 4 letras: sin tolerancia.
    expect(grade('I am frmo Rosario')).toMatchObject({ verdict: 'incorrect' });
  });

  it('un tipeo que produce otra palabra válida no se tolera (form/from)', () => {
    const spec = { typo_tolerance: { max_distance: 1 as const, min_length: 4 } };
    expect(grade('I am form Rosario', spec)).toMatchObject({ verdict: 'incorrect' });
    expect(grade('I am frmo Rosario', spec)).toMatchObject({ verdict: 'typo' });
  });

  it('los acentos cuentan (v1): «Cordoba» es un tipeo sólo por longitud, nunca «correcta»', () => {
    expect(grade('I am from Cordoba')).toMatchObject({ verdict: 'typo' });
    expect(grade('I am from Cordoba', { typo_tolerance: null })).toMatchObject({
      verdict: 'incorrect',
    });
  });

  it('NFC: la misma respuesta en NFD es la misma respuesta', () => {
    const nfd = 'I am from Córdoba';
    expect(nfd).not.toBe(nfd.normalize('NFC'));
    expect(grade(nfd)).toMatchObject({ verdict: 'correct' });
  });
});

describe('chino: sin asumir espacios', () => {
  const zh: ConstrainedTextSpec = {
    ...base,
    accept: [{ tokens: ['我', '(是|叫)', '<NAME>'] }],
    typo_tolerance: null,
  };
  const zhLists: ClosedLists = {
    version: 'test.v1',
    classes: { NAME: ['王明', '李', '明'] },
    lemma_forms: {},
  };
  const g = (raw: string) =>
    gradeConstrainedText(zh, { answer: '我叫明。', accepted_answers: [] }, raw, zhLists);

  it('cada carácter Han es una ficha, con o sin espacios', () => {
    expect(tokenize('我 叫  明。')).toEqual(['我', '叫', '明']);
    expect(tokenize('我叫明')).toEqual(['我', '叫', '明']);
    expect(g('我是明')).toMatchObject({ verdict: 'correct' });
    expect(g('我 是 明！')).toMatchObject({ verdict: 'correct' });
    expect(g('我是王')).toMatchObject({ verdict: 'incorrect' });
  });

  it('nunca hay tipeo entre caracteres distintos', () => {
    const tol = { ...zh, typo_tolerance: { max_distance: 1 as const, min_length: 4 } };
    expect(
      gradeConstrainedText(tol, { answer: '我叫明', accepted_answers: [] }, '我们明', zhLists),
    ).toMatchObject({ verdict: 'incorrect' });
  });
});

describe('lemas, prohibidas y límite de fichas', () => {
  it('lema obligatorio ausente → incorrecta con su etiqueta', () => {
    const spec = {
      accept: [{ tokens: ['(i|we)', '<ANY_WORD>', 'from', '<CITY>'] }],
      require_lemmas: ['be'],
    };
    expect(grade('I am from Rosario', spec)).toMatchObject({ verdict: 'correct' });
    const r = grade('I come from Rosario', spec);
    expect(r).toMatchObject({ verdict: 'incorrect' });
    expect(r.detail.error_tags).toContain('missing_lemma');
    expect(r.detail.failed_constraints).toContain('lemma:be');
  });

  it('una palabra prohibida (L1) hace la respuesta incorrecta', () => {
    const r = grade('I am de Rosario', { forbid: ['<L1_WORD>'] });
    expect(r).toMatchObject({ verdict: 'incorrect' });
    expect(r.detail.error_tags).toEqual(['forbidden_word']);
  });
});

describe('ambiguas: pending_review sólo si el ítem lo permite (§5.3)', () => {
  it('sin allow_pending, lo ambiguo es incorrecta (nunca correcta)', () => {
    expect(grade('I am living in Rosario now', { require_lemmas: ['be', 'from'] })).toMatchObject({
      status: 'graded',
      verdict: 'incorrect',
    });
  });

  it('comparte ≥ 60 % de los lemas obligatorios → pendiente', () => {
    const r = grade('I am in Rosario', { require_lemmas: ['be', 'from'], allow_pending: true });
    // 1 de 2 lemas = 50 %: no alcanza (y todas las palabras son conocidas).
    expect(r).toMatchObject({ status: 'graded', verdict: 'incorrect' });
    const r2 = grade('I am from the city of Rosario', {
      require_lemmas: ['be', 'from'],
      allow_pending: true,
    });
    expect(r2).toMatchObject({
      status: 'pending_review',
      verdict: null,
      reason: 'shares_required_lemmas',
    });
  });

  it('palabra fuera de las listas → pendiente', () => {
    expect(grade('I am from Funes', { allow_pending: true })).toMatchObject({
      status: 'pending_review',
      reason: 'unknown_word',
    });
  });

  it('demasiado larga pero con un patrón aceptado → pendiente; sin patrón → incorrecta', () => {
    const spec = { max_tokens: 4, allow_pending: true };
    expect(grade('well I am from Rosario', spec)).toMatchObject({
      status: 'pending_review',
      reason: 'too_long_with_pattern',
    });
    expect(grade('one two three four five', spec)).toMatchObject({
      status: 'graded',
      verdict: 'incorrect',
    });
  });

  it('es determinista: misma especificación, listas y respuesta → mismo resultado', () => {
    const answers = ['I am from Rosraio', 'I am from Funes', 'I was from Córdoba', '我', ''];
    for (const a of answers)
      expect(grade(a, { allow_pending: true })).toEqual(grade(a, { allow_pending: true }));
  });
});
