import { courseByCode, type CourseDef } from '@shared/courses';
import type { LanguageStatus } from '@shared/languages';

import { INTERFACE_LANGUAGES } from '@/i18n';

import {
  SOURCE_FOR_INTERFACE,
  buildCoursePicker,
  initiallyOpen,
  levelRange,
  toggleSection,
  type PickerInput,
} from '../picker';

/** Inglés para hablantes de portugués, italiano y francés (publicados el 2026-11-27). */
const NEW = ['en-from-pt', 'en-from-it', 'en-from-fr'];

function withStatus<T>(codes: string[], status: LanguageStatus, run: () => T): T {
  const courses = codes.map((c) => courseByCode(c) as CourseDef & { status?: LanguageStatus });
  const before = courses.map((c) => c.status);
  for (const c of courses) c.status = status;
  try {
    return run();
  } finally {
    courses.forEach((c, i) => (c.status = before[i]));
  }
}

const view = (input: PickerInput) =>
  buildCoursePicker(input).map((s) => ({
    source: s.source,
    expanded: s.expanded,
    codes: s.courses.map((c) => c.course.code),
  }));

describe('selector de cursos agrupado por idioma de origen', () => {
  it('cada idioma de interfaz corresponde a un origen', () => {
    expect(INTERFACE_LANGUAGES.map((ui) => SOURCE_FOR_INTERFACE[ui])).toEqual([
      'es',
      'en',
      'pt',
      'it',
      'fr',
    ]);
  });

  it('interfaz en español: primero (y abierta) la de hispanohablantes; las demás debajo, cerradas', () => {
    expect(view({ ui: 'es' })).toEqual([
      {
        source: 'es',
        expanded: true,
        codes: ['en-from-es', 'fr-from-es', 'it-from-es', 'pt-from-es', 'zh-from-es'],
      },
      { source: 'en', expanded: false, codes: ['es-from-en'] },
      { source: 'pt', expanded: false, codes: ['en-from-pt'] },
      { source: 'it', expanded: false, codes: ['en-from-it'] },
      { source: 'fr', expanded: false, codes: ['en-from-fr'] },
    ]);
  });

  it('interfaz en inglés: primero la de angloparlantes', () => {
    expect(view({ ui: 'en' }).map((s) => [s.source, s.expanded])).toEqual([
      ['en', true],
      ['es', false],
      ['pt', false],
      ['it', false],
      ['fr', false],
    ]);
  });

  it('cada interfaz pone su origen arriba y el resto en orden', () => {
    expect(view({ ui: 'pt-BR' }).map((s) => [s.source, s.expanded, s.codes])).toEqual([
      ['pt', true, ['en-from-pt']],
      ['es', false, ['en-from-es', 'fr-from-es', 'it-from-es', 'pt-from-es', 'zh-from-es']],
      ['en', false, ['es-from-en']],
      ['it', false, ['en-from-it']],
      ['fr', false, ['en-from-fr']],
    ]);
    expect(view({ ui: 'it' }).map((s) => s.source)).toEqual(['it', 'es', 'en', 'pt', 'fr']);
    expect(view({ ui: 'fr' }).map((s) => s.source)).toEqual(['fr', 'es', 'en', 'pt', 'it']);
    // Aunque su sección tenga un solo curso, es la primera y la que se abre.
    expect(view({ ui: 'fr' })[0]).toMatchObject({
      source: 'fr',
      expanded: true,
      codes: ['en-from-fr'],
    });
    expect(view({ ui: 'it' })[0]).toMatchObject({
      source: 'it',
      expanded: true,
      codes: ['en-from-it'],
    });
    expect(view({ ui: 'es' }).map((s) => s.source)).toEqual(['es', 'en', 'pt', 'it', 'fr']);
    // Niveles por curso: el inglés para hablantes de portugués llega a B1.
    const pt = buildCoursePicker({ ui: 'pt-BR' })[0]!.courses[0]!;
    expect(levelRange(pt.levels)).toBe('A1–B1');
  });

  it('una sección sin cursos no aparece; si es la de la interfaz, se abre la primera que quede', () => {
    withStatus(NEW, 'hidden', () => {
      for (const ui of ['pt-BR', 'it', 'fr'] as const) {
        expect(view({ ui }).map((s) => [s.source, s.expanded])).toEqual([
          ['es', true],
          ['en', false],
        ]);
      }
    });
  });

  it('nunca muestra cursos ocultos ni «Próximamente»; los beta, sólo a testers', () => {
    withStatus(NEW, 'hidden', () => {
      for (const ui of INTERFACE_LANGUAGES) {
        for (const isTester of [false, true]) {
          const codes = view({ ui, isTester }).flatMap((s) => s.codes);
          for (const code of NEW) expect(codes).not.toContain(code);
        }
      }
    });
    withStatus(['en-from-pt'], 'soon', () =>
      expect(view({ ui: 'pt-BR', isTester: true }).map((s) => s.source)).not.toContain('pt'),
    );
    withStatus(['en-from-pt'], 'beta', () => {
      expect(view({ ui: 'pt-BR' }).map((s) => s.source)).not.toContain('pt');
      expect(view({ ui: 'pt-BR', isTester: true })[0]).toEqual({
        source: 'pt',
        expanded: true,
        codes: ['en-from-pt'],
      });
    });
  });

  it('marca tus cursos y el activo', () => {
    const sections = buildCoursePicker({
      ui: 'es',
      mine: new Set(['it-from-es', 'es-from-en']),
      activeCode: 'en-from-es',
    });
    const flags = sections.flatMap((s) =>
      s.courses.map((c) => [c.course.code, c.mine, c.active] as const),
    );
    expect(flags).toEqual([
      ['en-from-es', true, true],
      ['fr-from-es', false, false],
      ['it-from-es', true, false],
      ['pt-from-es', false, false],
      ['zh-from-es', false, false],
      ['es-from-en', true, false],
      ['en-from-pt', false, false],
      ['en-from-it', false, false],
      ['en-from-fr', false, false],
    ]);
  });

  it('acordeón: sólo la primera abierta al empezar; se abren y cierran por separado', () => {
    const sections = buildCoursePicker({ ui: 'es' });
    let open = initiallyOpen(sections);
    expect([...open]).toEqual(['es']);
    open = toggleSection(open, 'en');
    expect([...open].sort()).toEqual(['en', 'es']);
    open = toggleSection(open, 'es');
    expect([...open]).toEqual(['en']);
    open = toggleSection(open, 'en');
    expect(open.size).toBe(0);
  });

  it('rango de niveles', () => {
    expect(levelRange(['A1', 'A2'])).toBe('A1–A2');
    expect(levelRange(['A1'])).toBe('A1');
    expect(levelRange([])).toBe('');
  });
});
