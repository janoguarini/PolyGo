import { Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  lineLimit,
  minimumScaleFactor,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { WordCardProps } from '@/features/widgets/content';

/**
 * Widget "Palabra" (iOS). Corre en el runtime aislado de expo-widgets: sin hooks, sin imports en
 * ejecución y sin constantes de módulo (los colores van acá adentro). Datos: src/features/widgets.
 */
const PolygoWord = (props: WordCardProps, environment: WidgetEnvironment) => {
  'widget';
  const violet = '#A78BFA';
  const strong = '#FFFFFF';
  const text = '#E7E5F7';
  const muted = '#8D88B5';
  const small = environment.widgetFamily === 'systemSmall';
  const title = props.emoji ? `${props.emoji} ${props.text}` : props.text;

  return (
    <VStack
      alignment="leading"
      spacing={2}
      modifiers={[containerBackground('#17142F', 'widget'), widgetURL(props.url)]}
    >
      <Text modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(violet)]}>
        {props.label}
      </Text>
      <Spacer />
      <Text
        modifiers={[
          font({ size: small ? 26 : 32, weight: 'heavy', design: 'rounded' }),
          foregroundStyle(strong),
          lineLimit(1),
          minimumScaleFactor(0.5),
        ]}
      >
        {title}
      </Text>
      {props.ipa ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted), lineLimit(1)]}>
          {props.ipa}
        </Text>
      ) : null}
      <Text
        modifiers={[
          font({ size: small ? 15 : 17, weight: 'semibold' }),
          foregroundStyle(text),
          lineLimit(small ? 2 : 1),
          minimumScaleFactor(0.7),
        ]}
      >
        {props.translation}
      </Text>
      {!small && props.example ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted), lineLimit(2)]}>
          {`“${props.example}”`}
        </Text>
      ) : null}
    </VStack>
  );
};

export default createWidget('PolygoWord', PolygoWord, {
  kind: 'new',
  label: 'POLYGO',
  text: 'Abrí Polygo',
  translation: 'para cargar tus palabras',
  ipa: '',
  emoji: '',
  example: '',
  url: 'polygo://vocabulary',
});
