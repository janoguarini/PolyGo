import { render, screen } from '@testing-library/react-native';

import { MAX_WRITTEN_ANSWER_LENGTH } from '@shared/protocol';

import { QuestionCard } from '../components/QuestionCard';

jest.mock('@/features/learning/speech', () => ({ speak: jest.fn(), stopSpeaking: jest.fn() }));

describe('QuestionCard: preguntas para escribir', () => {
  it('el campo tiene el mismo tope que valida el servidor (80)', async () => {
    await render(
      <QuestionCard
        question={{
          index: 2,
          direction: 'es_en',
          prompt: 'agua',
          options: [],
          kind: 'write',
          sentAt: 0,
        }}
        feedback={null}
        streak={0}
        disabled={false}
        onAnswer={jest.fn()}
      />,
    );
    expect(MAX_WRITTEN_ANSWER_LENGTH).toBe(80);
    expect(screen.getByLabelText('Tu respuesta').props.maxLength).toBe(80);
  });
});
