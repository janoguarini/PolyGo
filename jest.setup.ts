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
    useSharedValue: (value: unknown) => ({ value }),
    useAnimatedStyle: (fn: () => object) => fn(),
    withTiming: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withDelay: (_: number, value: unknown) => value,
    FadeIn: animation(),
    FadeInDown: animation(),
    FadeInUp: animation(),
    FadeOut: animation(),
  };
});
