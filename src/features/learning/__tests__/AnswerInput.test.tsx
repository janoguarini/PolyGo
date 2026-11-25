import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { checkAnswer } from '@shared/answers';
import type { Exercise, ExercisePayload, UserAnswer } from '@shared/exercises';

import { AnswerInput } from '../components/AnswerInput';

const mockSpeak = jest.fn();
jest.mock('../speech', () => ({ speak: (text: string) => mockSpeak(text) }));

function exercise(payload: ExercisePayload, answer = ''): Exercise {
  return {
    id: 'e1',
    lessonId: 'l1',
    position: 1,
    type: payload.type,
    skill: 'vocabulary',
    prompt: '',
    payload,
    answer,
    acceptedAnswers: [],
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 20,
    wordIds: [],
  };
}

async function setup(ex: Exercise) {
  const onSubmit = jest.fn<void, [UserAnswer]>();
  await render(<AnswerInput exercise={ex} seed="test" disabled={false} onSubmit={onSubmit} />);
  return onSubmit;
}

const check = () => screen.getByRole('button', { name: 'Comprobar' });

describe('AnswerInput', () => {
  it('opciones registradas por el servidor: se muestran en ese orden, sin volver a mezclar', async () => {
    const ex = exercise(
      { type: 'translation_choice', word: 'hello', options: ['hola', 'chau', 'sí', 'no'] },
      'hola',
    );
    const shown = ['no', 'hola', 'sí', 'chau'];
    await render(
      <AnswerInput
        exercise={ex}
        seed="x"
        disabled={false}
        onSubmit={jest.fn()}
        shownOptions={shown}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    shown.forEach((text, i) => {
      expect(screen.getByText(text)).toBeTruthy();
      expect(within(radios[i]!).getByText(text)).toBeTruthy();
    });
  });

  it('opciones: exige elegir antes de comprobar y envía la opción', async () => {
    const ex = exercise(
      { type: 'image_choice', emoji: '🪑', options: ['chair', 'table', 'door'] },
      'chair',
    );
    const onSubmit = await setup(ex);
    expect(check().props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByRole('radio', { name: 'chair' }));
    await fireEvent.press(check());
    expect(onSubmit).toHaveBeenCalledWith({ kind: 'option', value: 'chair' });
  });

  it('ordenar: arma la oración tocando fichas y se puede corregir', async () => {
    const ex = exercise(
      { type: 'order_words', tokens: ['I', 'am', 'happy'], translation: 'Estoy feliz.' },
      'I am happy.',
    );
    const onSubmit = await setup(ex);
    await fireEvent.press(screen.getAllByRole('button', { name: 'happy' })[0]!);
    // Quitar la ficha elegida por error (la de la oración es la primera en el árbol).
    await fireEvent.press(screen.getAllByRole('button', { name: 'happy' })[0]!);
    for (const token of ['I', 'am', 'happy']) {
      const buttons = screen.getAllByRole('button', { name: token });
      await fireEvent.press(buttons[buttons.length - 1]!);
    }
    await fireEvent.press(check());
    const answer = onSubmit.mock.calls[0]![0];
    expect(answer).toEqual({ kind: 'tokens', value: ['I', 'am', 'happy'] });
    expect(checkAnswer(ex, answer).correct).toBe(true);
  });

  it('parejas: une cada palabra con su significado', async () => {
    const ex = exercise({
      type: 'match_pairs',
      pairs: [
        { left: 'one', right: 'uno' },
        { left: 'two', right: 'dos' },
      ],
    });
    const onSubmit = await setup(ex);
    // Se puede empezar por cualquiera de las dos columnas.
    await fireEvent.press(screen.getByRole('button', { name: 'one' }));
    await fireEvent.press(screen.getByRole('button', { name: 'uno' }));
    await fireEvent.press(screen.getByRole('button', { name: 'dos' }));
    await fireEvent.press(screen.getByRole('button', { name: 'two' }));
    await fireEvent.press(check());
    const answer = onSubmit.mock.calls[0]![0];
    expect(checkAnswer(ex, answer).correct).toBe(true);
  });

  it('parejas: el significado va a la izquierda y la palabra suena al tocarla', async () => {
    mockSpeak.mockClear();
    await setup(
      exercise({
        type: 'match_pairs',
        pairs: [
          { left: 'one', right: 'uno' },
          { left: 'two', right: 'dos' },
        ],
      }),
    );
    const order = screen.getAllByRole('button').map((b) => b.props.accessibilityLabel);
    expect(order.indexOf('uno')).toBeLessThan(order.indexOf('one'));
    expect(order.indexOf('dos')).toBeLessThan(order.indexOf('two'));
    await fireEvent.press(screen.getByRole('button', { name: 'two' }));
    expect(mockSpeak).toHaveBeenCalledWith('two');
    await fireEvent.press(screen.getByRole('button', { name: 'uno' }));
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it('escritura: envía el texto ingresado', async () => {
    const ex = exercise({ type: 'translate_write', source: 'Hola' }, 'hello');
    const onSubmit = await setup(ex);
    await fireEvent.changeText(screen.getByLabelText('Tu respuesta en inglés'), 'Hello');
    await fireEvent.press(check());
    expect(onSubmit).toHaveBeenCalledWith({ kind: 'text', value: 'Hello' });
  });
});
