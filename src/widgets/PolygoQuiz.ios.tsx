import { Button, HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  containerBackground,
  controlSize,
  font,
  foregroundStyle,
  lineLimit,
  minimumScaleFactor,
  tint,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

import type { QuizProps } from '@/features/widgets/content';

/**
 * Widget "Pregunta rápida" (iOS 17+ para los botones). Cada toque devuelve las props nuevas y el
 * runtime de expo-widgets las guarda y redibuja, sin abrir la app ni usar la red. Es práctica:
 * no toca el repaso espaciado ni el ELO.
 */
const PolygoQuiz = (props: QuizProps) => {
  'widget';
  const violet = '#A78BFA';
  const strong = '#FFFFFF';
  const muted = '#8D88B5';
  const bg = containerBackground('#17142F', 'widget');
  const total = props.questions.length;
  // Textos en el idioma de la interfaz (los manda la app); las props viejas no los traen.
  const ui = props.ui || {
    empty: 'Abrí Polygo para cargar preguntas',
    done: 'RONDA TERMINADA',
    again: 'Otra ronda',
    question: 'PREGUNTA',
    correct: '¡Correcto!',
    was: 'Era:',
    result: 'Ver resultado',
    next: 'Siguiente',
  };

  if (total === 0) {
    return (
      <VStack spacing={6} modifiers={[bg, widgetURL(props.url)]}>
        <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(strong)]}>
          {ui.empty}
        </Text>
      </VStack>
    );
  }

  if (props.index >= total) {
    return (
      <VStack spacing={8} modifiers={[bg, widgetURL(props.url)]}>
        <Text modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(violet)]}>
          {ui.done}
        </Text>
        <Text modifiers={[font({ size: 28, weight: 'heavy' }), foregroundStyle(strong)]}>
          {`${props.correctCount}/${total}`}
        </Text>
        <Button
          label={ui.again}
          target="restart"
          onPress={() => ({ ...props, index: 0, chosen: -1, correctCount: 0 })}
          modifiers={[buttonStyle('borderedProminent'), tint('#7C3AED'), controlSize('small')]}
        />
      </VStack>
    );
  }

  const q = props.questions[props.index]!;
  const answered = props.chosen >= 0;
  const right = props.chosen === q.correct;
  const option = (i: number) => (
    <Button
      key={`opt-${i}`}
      label={q.options[i] ?? ''}
      target={`opt-${i}`}
      onPress={() => ({
        ...props,
        chosen: i,
        correctCount: props.correctCount + (i === q.correct ? 1 : 0),
      })}
      modifiers={[buttonStyle('bordered'), tint(violet), controlSize('small'), lineLimit(1)]}
    />
  );

  return (
    <VStack alignment="leading" spacing={6} modifiers={[bg, widgetURL(props.url)]}>
      <HStack>
        <Text modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(violet)]}>
          {`${ui.question} ${props.index + 1}/${total}`}
        </Text>
        <Spacer />
        <Text modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(muted)]}>
          {`✓ ${props.correctCount}`}
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: 22, weight: 'heavy', design: 'rounded' }),
          foregroundStyle(strong),
          lineLimit(1),
          minimumScaleFactor(0.5),
        ]}
      >
        {q.prompt}
      </Text>
      {answered ? (
        <VStack alignment="leading" spacing={6}>
          <Text
            modifiers={[
              font({ size: 15, weight: 'semibold' }),
              foregroundStyle(right ? '#34D399' : '#F87171'),
              lineLimit(1),
              minimumScaleFactor(0.6),
            ]}
          >
            {right ? ui.correct : `${ui.was} ${q.options[q.correct] ?? ''}`}
          </Text>
          <Button
            label={props.index + 1 >= total ? ui.result : ui.next}
            target="next"
            onPress={() => ({ ...props, index: props.index + 1, chosen: -1 })}
            modifiers={[buttonStyle('borderedProminent'), tint('#7C3AED'), controlSize('small')]}
          />
        </VStack>
      ) : (
        <VStack alignment="leading" spacing={4}>
          <HStack spacing={6}>
            {option(0)}
            {option(1)}
          </HStack>
          <HStack spacing={6}>
            {option(2)}
            {option(3)}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default createWidget('PolygoQuiz', PolygoQuiz, {
  questions: [],
  index: 0,
  chosen: -1,
  correctCount: 0,
  url: 'polygo://review',
});
