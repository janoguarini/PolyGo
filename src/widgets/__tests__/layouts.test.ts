/**
 * Simula el runtime aislado de expo-widgets: el plugin de Babel convierte cada componente 'widget'
 * en un string; acá lo evaluamos con componentes y modificadores stub (como globales, igual que el
 * runtime real) y "tocamos" botones como lo hace __expoWidgetHandlePress. No reemplaza probarlo en
 * un dispositivo, pero valida que el layout no dependa del módulo y que la ronda avance bien.
 */
import type { QuizProps, WordCardProps } from '@/features/widgets/content';

interface Node {
  type: string;
  props: Record<string, unknown> & { children?: unknown };
}

const registered: Record<string, { layout: string; initialProps: unknown }> = {};

jest.mock('expo-widgets', () => ({
  createWidget: (name: string, layout: string, initialProps: unknown) => {
    registered[name] = { layout, initialProps };
    return { updateSnapshot: jest.fn(), updateTimeline: jest.fn(), reload: jest.fn() };
  },
}));

const COMPONENTS = ['Button', 'Column', 'Row', 'Spacer', 'Text', 'HStack', 'VStack'];
const MODIFIERS = [
  'background',
  'buttonStyle',
  'containerBackground',
  'controlSize',
  'fillMaxSize',
  'fillMaxWidth',
  'font',
  'foregroundStyle',
  'height',
  'lineLimit',
  'minimumScaleFactor',
  'paddingAll',
  'tint',
  'widgetURL',
  'width',
];

type Layout = (props: object, environment?: object) => Node;

function compile(layout: string): Layout {
  const jsx = (type: string, props: Node['props']) => ({ type, props });
  const modifier =
    (name: string) =>
    (...args: unknown[]) => ({ $modifier: name, args });
  // Si el layout usara algo de su módulo (constantes, helpers), acá fallaría con ReferenceError.
  const factory = new Function(
    '_jsx',
    '_jsxs',
    ...COMPONENTS,
    ...MODIFIERS,
    `"use strict"; return (${layout});`,
  ) as (...args: unknown[]) => Layout;
  return factory(jsx, jsx, ...COMPONENTS, ...MODIFIERS.map(modifier));
}

function flatten(node: unknown): Node[] {
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];
  const n = node as Node;
  return [n, ...flatten(n.props.children)];
}

const texts = (tree: Node) =>
  flatten(tree)
    .filter((n) => n.type === 'Text')
    .map((n) => [n.props.children].flat().join(''));

const buttons = (tree: Node) => flatten(tree).filter((n) => n.type === 'Button');

/** Lo que hace el runtime al tocar: llama al callback y lo devuelto pasa a ser las props. */
function press(button: Node): QuizProps {
  const handler = (button.props.onPress ?? button.props.onClick) as () => QuizProps;
  return handler();
}

const QUIZ: QuizProps = {
  questions: [
    {
      prompt: 'hello',
      direction: 'en_es',
      options: ['adiós', 'hola', 'gracias', 'sí'],
      correct: 1,
    },
    { prompt: 'agua', direction: 'es_en', options: ['water', 'yes', 'please', 'bye'], correct: 0 },
  ],
  index: 0,
  chosen: -1,
  correctCount: 0,
  url: 'polygo://review',
};

const CARD: WordCardProps = {
  kind: 'daily',
  label: 'PALABRA DEL DÍA',
  text: 'hello',
  translation: 'hola',
  ipa: '/həˈloʊ/',
  emoji: '👋',
  example: 'Hello, my name is Ana.',
  url: 'polygo://vocabulary',
};

describe.each(['ios', 'android'] as const)('widgets %s', (platform) => {
  let word: Layout;
  let quiz: Layout;

  beforeAll(() => {
    jest.isolateModules(() => {
      /* eslint-disable @typescript-eslint/no-require-imports */
      require(platform === 'ios' ? '../PolygoWord.ios' : '../PolygoWord.android');
      require(platform === 'ios' ? '../PolygoQuiz.ios' : '../PolygoQuiz.android');
      /* eslint-enable @typescript-eslint/no-require-imports */
    });
    expect(typeof registered.PolygoWord?.layout).toBe('string');
    word = compile(registered.PolygoWord!.layout);
    quiz = compile(registered.PolygoQuiz!.layout);
  });

  it('Palabra: muestra palabra, pronunciación, traducción y ejemplo', () => {
    const shown = texts(word(CARD, { widgetFamily: 'systemMedium' }));
    expect(shown).toEqual(
      expect.arrayContaining([
        'PALABRA DEL DÍA',
        '👋 hello',
        '/həˈloʊ/',
        'hola',
        '“Hello, my name is Ana.”',
      ]),
    );
  });

  it('Palabra: las props iniciales invitan a abrir la app', () => {
    const shown = texts(word(registered.PolygoWord!.initialProps as WordCardProps, {}));
    expect(shown).toContain('Abrí Polygo');
  });

  it('Pregunta rápida: responder, ver la corrección, avanzar y terminar la ronda', () => {
    let props = QUIZ;
    let tree = quiz(props, {});
    expect(texts(tree)).toEqual(expect.arrayContaining(['PREGUNTA 1/2', 'hello']));
    let options = buttons(tree);
    expect(options).toHaveLength(4);

    // Elige la incorrecta: muestra la correcta y no suma.
    props = press(options[0]!);
    expect(props).toMatchObject({ chosen: 0, correctCount: 0, index: 0 });
    tree = quiz(props, {});
    expect(texts(tree)).toContain('Era: hola');
    props = press(buttons(tree)[0]!);
    expect(props).toMatchObject({ index: 1, chosen: -1 });

    // Segunda: correcta.
    tree = quiz(props, {});
    options = buttons(tree);
    props = press(options[0]!);
    expect(props.correctCount).toBe(1);
    tree = quiz(props, {});
    expect(texts(tree)).toContain('¡Correcto!');
    props = press(buttons(tree)[0]!);

    // Resultado y reinicio con las mismas preguntas.
    tree = quiz(props, {});
    expect(texts(tree)).toEqual(expect.arrayContaining(['RONDA TERMINADA', '1/2']));
    props = press(buttons(tree)[0]!);
    expect(props).toEqual({ ...QUIZ });
  });

  it('Pregunta rápida: sin preguntas pide abrir la app', () => {
    const tree = quiz(registered.PolygoQuiz!.initialProps as QuizProps, {});
    expect(texts(tree)).toContain('Abrí Polygo para cargar preguntas');
    expect(buttons(tree)).toHaveLength(0);
  });
});
