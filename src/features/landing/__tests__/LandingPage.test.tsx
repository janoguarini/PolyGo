import { fireEvent, render, screen } from '@testing-library/react-native';

import { LandingPage } from '../LandingPage';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (href: string) => mockPush(href) } }));

describe('LandingPage', () => {
  beforeEach(() => mockPush.mockClear());

  it('explica la app y lleva a crear cuenta o iniciar sesión', async () => {
    await render(<LandingPage />);
    expect(screen.getByText('Tres hábitos, una sola app')).toBeTruthy();
    expect(screen.getByText('Cada palabra suma ELO')).toBeTruthy();
    expect(screen.getByText('Gran Maestro')).toBeTruthy();

    await fireEvent.press(screen.getByText('Empezar gratis'));
    expect(mockPush).toHaveBeenLastCalledWith('/sign-up');
    await fireEvent.press(screen.getByText('Ya tengo cuenta'));
    expect(mockPush).toHaveBeenLastCalledWith('/sign-in');
  });

  it('las preguntas frecuentes se abren al tocarlas', async () => {
    await render(<LandingPage />);
    expect(screen.queryByText(/misma cuenta que en el teléfono/)).toBeNull();
    await fireEvent.press(screen.getByText('¿Puedo estudiar desde la computadora?'));
    expect(screen.getByText(/misma cuenta que en el teléfono/)).toBeTruthy();
  });
});
