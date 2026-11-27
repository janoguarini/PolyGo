import { fireEvent, render, screen } from '@testing-library/react-native';

import { writingTask } from '../../../../content/en/a1/writing';
import { WritingTask } from '../components/WritingTask';
import { spokenText } from '../speech';

jest.mock('expo-speech', () => ({ VoiceQuality: { Default: 'Default', Enhanced: 'Enhanced' } }));
jest.mock('@/lib/sounds', () => ({ configureAudio: () => Promise.resolve() }));

/** Cierre de inglés A1 (docs/A1_EN_CLOSURE.md §6): escritura sin IA, en el dispositivo. */
describe('WritingTask', () => {
  const type = (text: string) =>
    fireEvent.changeText(screen.getByLabelText('Tu texto en inglés'), text);

  it('guiada: marca los requisitos cumplidos y la da por completa sin decir que el inglés es correcto', async () => {
    await render(<WritingTask task={writingTask('en.a1.wt.my-age')!} />);
    expect(screen.getByText(/no se envía ni se guarda/)).toBeTruthy();
    await type('I am 31 years old. I am from Peru.');
    await fireEvent.press(screen.getByRole('button', { name: 'Revisar mi texto' }));
    expect(screen.getByText('Tu texto tiene todo lo que pedía la consigna.')).toBeTruthy();
    expect(screen.getByText(/no corrige la gramática/)).toBeTruthy();
    expect(screen.getByText('I am twenty years old. I am from Argentina.')).toBeTruthy();
  });

  it('guiada: si falta algo, lo dice y marca lo pendiente', async () => {
    await render(<WritingTask task={writingTask('en.a1.wt.my-age')!} />);
    await type('I have 31 years. I am from Peru.');
    await fireEvent.press(screen.getByRole('button', { name: 'Revisar mi texto' }));
    expect(screen.getByText(/Te falta algo de la consigna/)).toBeTruthy();
    expect(screen.getByText('○ Dices tu edad con I am + número (sin have)')).toBeTruthy();
  });

  it('libre: no hay veredicto; muestra el modelo y la lista de control para marcar', async () => {
    const task = writingTask('en.a1.wt.block1-introduce')!;
    await render(<WritingTask task={task} />);
    expect(screen.getByRole('button', { name: 'Terminé: comparar' })).toBeDisabled();
    await type('Hello. I am Leo.');
    await fireEvent.press(screen.getByRole('button', { name: 'Terminé: comparar' }));
    expect(screen.queryByText(/todo lo que pedía|Te falta algo/)).toBeNull();
    expect(screen.getByText(task.model)).toBeTruthy();
    const first = `☐ ${task.checklist[0]}`;
    await fireEvent.press(screen.getByRole('button', { name: first }));
    expect(screen.getByRole('button', { name: `☑ ${task.checklist[0]}` })).toBeTruthy();
  });
});

describe('spokenText (PW: la escena con emojis no se pronuncia)', () => {
  it('quita emojis y deja el texto', () => {
    expect(spokenText('🔑 🔑 🔑')).toBe('');
    expect(spokenText('🧑‍⚕️')).toBe('');
    expect(spokenText('📅 Saturday · 🌅')).toBe('Saturday ·');
    expect(spokenText('I am tired.')).toBe('I am tired.');
    expect(spokenText('0')).toBe('0');
  });
});

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

describe('WritingPracticeCard (acceso desde los resultados de la lección)', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { WritingPracticeCard } = require('../components/WritingPracticeCard');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { router } = require('expo-router');

  it('ofrece la tarea guiada de la lección y abre su pantalla', async () => {
    await render(<WritingPracticeCard lessonId="a1-u03-l04" />);
    expect(screen.getByText('PRACTICA ESCRIBIENDO')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Tu edad y tu país' }));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/writing/[id]',
      params: { id: 'en.a1.wt.my-age' },
    });
  });

  it('en el repaso final del bloque ofrece la tarea libre; en otras lecciones no muestra nada', async () => {
    await render(<WritingPracticeCard lessonId="a1-u04-final" />);
    expect(
      screen.getByRole('button', { name: 'Bloque 1: preséntate y presenta a alguien' }),
    ).toBeTruthy();
    screen.unmount();
    await render(<WritingPracticeCard lessonId="a1-u02-l01" />);
    expect(screen.queryByText('PRACTICA ESCRIBIENDO')).toBeNull();
  });
});
