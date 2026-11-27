import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { UnitWithStatus } from '../curriculum';
import { LessonPath } from '../components/LessonPath';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
}));
jest.mock('@/features/plus/api', () => ({ useEnergy: () => ({ view: null, isError: false }) }));

const lesson = (
  id: string,
  title: string,
  status: 'completed' | 'current' | 'locked',
  bestAccuracy: number | null = null,
) => ({
  id,
  unitId: 'a1-u01',
  position: 0,
  title,
  objective: `Objetivo de ${title}`,
  exerciseCount: 8,
  status,
  bestAccuracy,
});

const unit: UnitWithStatus = {
  id: 'a1-u01',
  level: 'A1',
  position: 1,
  title: 'Saludos y presentaciones',
  titleEn: 'Greetings',
  description: 'Saludar, despedirte, ser amable y presentarte.',
  emoji: '👋',
  completedCount: 2,
  lessons: [
    lesson('a1-u01-l01', 'Hola y adiós', 'completed', 1),
    lesson('a1-u01-l02', 'Por favor y gracias', 'completed', 0.5),
    lesson('a1-u01-rev1', 'Repaso 1', 'current'),
    lesson('a1-u01-l03', 'Me llamo…', 'locked'),
  ],
};

async function renderMap() {
  await render(<LessonPath units={[unit]} selected={null} onSelectedChange={() => {}} />);
  // El recorrido se dibuja recién al conocer su ancho.
  for (const path of screen.getAllByTestId('lesson-map-path')) {
    await act(() =>
      fireEvent(path, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 335, height: 400 } },
      }),
    );
  }
}

beforeEach(() => mockPush.mockClear());

describe('mapa de aprendizaje', () => {
  it('muestra la unidad con sus datos reales y el estado de cada lección', async () => {
    await renderMap();

    expect(screen.getByText('UNIDAD 1')).toBeTruthy();
    expect(screen.getByText('👋 Saludos y presentaciones')).toBeTruthy();
    expect(screen.getByText('4 lecciones')).toBeTruthy();
    expect(screen.getByText('2/4')).toBeTruthy();
    // Los textos al costado del nodo están ocultos para lectores de pantalla (el nodo ya lo dice).
    const hidden = { includeHiddenElements: true };
    expect(screen.getAllByText('Completado', hidden)).toHaveLength(2);
    expect(screen.getByText('Bloqueado', hidden)).toBeTruthy();
    // La actual se ve como las demás: título y «Sin completar», sin ficha abierta ni EMPEZAR.
    expect(screen.getByText('Sin completar', hidden)).toBeTruthy();
    expect(screen.queryByText('Objetivo de Repaso 1')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Empezar lección' })).toBeNull();
  });

  it('tocar la lección actual abre su ficha', async () => {
    const onSelectedChange = jest.fn();
    await render(<LessonPath units={[unit]} selected={null} onSelectedChange={onSelectedChange} />);
    for (const path of screen.getAllByTestId('lesson-map-path')) {
      await act(() =>
        fireEvent(path, 'layout', {
          nativeEvent: { layout: { x: 0, y: 0, width: 335, height: 400 } },
        }),
      );
    }

    await fireEvent.press(
      screen.getByRole('button', { name: 'REPASO: Repaso 1. Siguiente lección' }),
    );
    expect(onSelectedChange).toHaveBeenCalledWith('a1-u01-rev1');
  });

  it('desde la ficha, «Empezar lección» abre la lección actual real', async () => {
    await render(<LessonPath units={[unit]} selected="a1-u01-rev1" onSelectedChange={() => {}} />);
    for (const path of screen.getAllByTestId('lesson-map-path')) {
      await act(() =>
        fireEvent(path, 'layout', {
          nativeEvent: { layout: { x: 0, y: 0, width: 335, height: 400 } },
        }),
      );
    }

    await fireEvent.press(screen.getByRole('button', { name: 'Empezar lección' }));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/lesson/[id]',
      params: { id: 'a1-u01-rev1' },
    });
  });

  it('una lección bloqueada explica qué falta y no ofrece empezar', async () => {
    const onSelectedChange = jest.fn();
    await render(
      <LessonPath units={[unit]} selected="a1-u01-l03" onSelectedChange={onSelectedChange} />,
    );
    for (const path of screen.getAllByTestId('lesson-map-path')) {
      await act(() =>
        fireEvent(path, 'layout', {
          nativeEvent: { layout: { x: 0, y: 0, width: 335, height: 400 } },
        }),
      );
    }

    expect(screen.getByText('Completa las lecciones anteriores para desbloquearla.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Empezar lección' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'LECCIÓN 3: Me llamo…. Bloqueada' }));
    expect(onSelectedChange).toHaveBeenCalledWith(null);
  });
});
