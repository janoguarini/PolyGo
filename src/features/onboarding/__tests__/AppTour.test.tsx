import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppTour } from '../AppTour';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};
const wrapper = ({ children }: { children: ReactNode }) => (
  <SafeAreaProvider initialMetrics={metrics}>{children}</SafeAreaProvider>
);

jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn() }));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

/** Avanza el reloj lo suficiente para que el tutorial busque (y no encuentre) el destino. */
async function settle() {
  await act(async () => {
    for (let i = 0; i < 80; i++) await jest.advanceTimersByTimeAsync(150);
  });
}

it('recorre los 6 pasos navegando a cada pestaña y termina con «¡A jugar!»', async () => {
  const navigate = jest.fn();
  const onFinish = jest.fn();
  await render(<AppTour onFinish={onFinish} navigate={navigate} />, { wrapper });
  expect(screen.getByText('¡Hola!')).toBeTruthy();
  expect(screen.getByText('1 DE 6')).toBeTruthy();

  const titles = [
    'Tu próxima lección',
    'Energía, Polys y racha',
    '¿Se te olvidó una palabra?',
    'Ranked',
    '¡Todo listo!',
  ];
  await fireEvent.press(screen.getByText('¡Empezar!'));
  for (const [i, title] of titles.entries()) {
    // Sin el elemento en pantalla (en la prueba no hay pestañas), el paso se muestra centrado.
    await settle();
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(`${i + 2} DE 6`)).toBeTruthy();
    if (i < titles.length - 1) await fireEvent.press(screen.getByText('Siguiente'));
  }
  expect(navigate.mock.calls.map((c) => c[0])).toEqual([
    '/',
    '/',
    '/',
    '/practice',
    '/ranked',
    '/',
  ]);
  expect(screen.queryByText('Saltar')).toBeNull();
  await fireEvent.press(screen.getByText('¡A jugar!'));
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('«Saltar» termina el tutorial', async () => {
  const onFinish = jest.fn();
  await render(<AppTour onFinish={onFinish} navigate={jest.fn()} />, { wrapper });
  await fireEvent.press(screen.getByText('Saltar'));
  expect(onFinish).toHaveBeenCalledTimes(1);
});
