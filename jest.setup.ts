// En Jest no hay runtime nativo de Worklets/Reanimated. El mock oficial de Reanimated 4.7
// intenta inicializar el módulo real, así que mockeamos sólo las APIs que usa la app.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  const animation = () => {
    const builder: Record<string, () => unknown> = {};
    for (const method of ['duration', 'delay', 'springify', 'damping', 'easing']) {
      builder[method] = () => builder;
    }
    return builder;
  };
  const Animated = { View, Text, ScrollView, createAnimatedComponent: (c: unknown) => c };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: (value: unknown) => {
      const sv = {
        value,
        get: () => sv.value,
        set: (next: unknown) => {
          sv.value = next;
        },
      };
      return sv;
    },
    useAnimatedStyle: (fn: () => object) => fn(),
    useAnimatedProps: (fn: () => object) => fn(),
    useReducedMotion: () => true,
    withTiming: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withDelay: (_: number, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    Easing: new Proxy({}, { get: () => () => () => 0 }),
    ZoomIn: animation(),
    FadeIn: animation(),
    FadeInDown: animation(),
    FadeInUp: animation(),
    FadeInLeft: animation(),
    FadeInRight: animation(),
    FadeOut: animation(),
  };
});

// expo-web-browser (inicio con Google) no tiene runtime nativo en Jest y al importarse carga todo
// `expo`. Los tests que lo ejercitan (features/auth) definen su propio comportamiento.
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn(),
  maybeCompleteAuthSession: jest.fn(),
}));
