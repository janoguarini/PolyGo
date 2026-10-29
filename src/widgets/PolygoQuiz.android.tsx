import { Button, Column, Row, Spacer, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  fillMaxWidth,
  height,
  paddingAll,
  width,
} from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

import type { QuizProps } from '@/features/widgets/content';

/**
 * Widget "Pregunta rápida" (Android). En Glance, lo que devuelve `onClick` pasa a ser las props
 * nuevas (el runtime asigna el target). Mismo contenido y reglas que la versión iOS.
 */
const PolygoQuiz = (props: QuizProps) => {
  'widget';
  const container = [fillMaxSize(), background('#17142F'), paddingAll(12)];
  const optionColors = { containerColor: '#2F2A58', contentColor: '#E7E5F7' };
  const primaryColors = { containerColor: '#7C3AED', contentColor: '#FFFFFF' };
  const total = props.questions.length;

  if (total === 0) {
    return (
      <Column modifiers={container}>
        <Text color="#FFFFFF" style={{ fontSize: 15, fontWeight: '600' }}>
          Abrí Polygo para cargar preguntas
        </Text>
      </Column>
    );
  }

  if (props.index >= total) {
    return (
      <Column modifiers={container} horizontalAlignment="center" verticalArrangement="center">
        <Text color="#A78BFA" style={{ fontSize: 11, fontWeight: 'bold' }}>
          RONDA TERMINADA
        </Text>
        <Text color="#FFFFFF" style={{ fontSize: 28, fontWeight: '800' }}>
          {`${props.correctCount}/${total}`}
        </Text>
        <Button
          colors={primaryColors}
          onClick={() => ({ ...props, index: 0, chosen: -1, correctCount: 0 })}
        >
          <Text>Otra ronda</Text>
        </Button>
      </Column>
    );
  }

  const q = props.questions[props.index]!;
  const answered = props.chosen >= 0;
  const right = props.chosen === q.correct;
  const option = (i: number) => (
    <Button
      key={`opt-${i}`}
      colors={optionColors}
      modifiers={[fillMaxWidth()]}
      onClick={() => ({
        ...props,
        chosen: i,
        correctCount: props.correctCount + (i === q.correct ? 1 : 0),
      })}
    >
      <Text maxLines={1}>{q.options[i] ?? ''}</Text>
    </Button>
  );

  return (
    <Column modifiers={container}>
      <Row modifiers={[fillMaxWidth()]} horizontalArrangement="spaceBetween">
        <Text color="#A78BFA" style={{ fontSize: 11, fontWeight: 'bold' }}>
          {`PREGUNTA ${props.index + 1}/${total}`}
        </Text>
        <Spacer modifiers={[width(8)]} />
        <Text color="#8D88B5" style={{ fontSize: 11, fontWeight: 'bold' }}>
          {`✓ ${props.correctCount}`}
        </Text>
      </Row>
      <Text color="#FFFFFF" maxLines={1} style={{ fontSize: 22, fontWeight: '800' }}>
        {q.prompt}
      </Text>
      <Spacer modifiers={[height(4)]} />
      {answered ? (
        <Column modifiers={[fillMaxWidth()]}>
          <Text
            color={right ? '#34D399' : '#F87171'}
            maxLines={1}
            style={{ fontSize: 15, fontWeight: '600' }}
          >
            {right ? '¡Correcto!' : `Era: ${q.options[q.correct] ?? ''}`}
          </Text>
          <Button
            colors={primaryColors}
            onClick={() => ({ ...props, index: props.index + 1, chosen: -1 })}
          >
            <Text>{props.index + 1 >= total ? 'Ver resultado' : 'Siguiente'}</Text>
          </Button>
        </Column>
      ) : (
        <Column modifiers={[fillMaxWidth()]}>
          {option(0)}
          {option(1)}
          {option(2)}
          {option(3)}
        </Column>
      )}
    </Column>
  );
};

export default createWidget('PolygoQuiz', PolygoQuiz, {
  questions: [],
  index: 0,
  chosen: -1,
  correctCount: 0,
  url: 'polygo://review',
});
