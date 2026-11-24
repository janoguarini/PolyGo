import { fireEvent, render, screen } from '@testing-library/react-native';

import { StreakCalendar } from '../components/StreakCalendar';

const mockUseActivityDays = jest.fn();
jest.mock('../hooks', () => ({
  useActivityDays: (...args: unknown[]) => mockUseActivityDays(...args),
}));

describe('StreakCalendar', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date(2026, 10, 23, 12) }); // lunes 23/11/2026
    mockUseActivityDays.mockReset();
    mockUseActivityDays.mockReturnValue({
      data: { studied: ['2026-11-20', '2026-11-23'], frozen: ['2026-11-21'] },
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    });
  });
  afterEach(() => jest.useRealTimers());

  it('muestra la racha del servidor y marca sólo los días que vienen de la base', async () => {
    await render(<StreakCalendar visible onClose={jest.fn()} streak={4} activeToday />);
    expect(screen.getByLabelText('4 días seguidos')).toBeTruthy();
    expect(mockUseActivityDays).toHaveBeenLastCalledWith('2026-11-01', '2026-11-30', true);
    expect(screen.getByLabelText(/^20 de noviembre: estudiaste$/)).toBeTruthy();
    expect(screen.getByLabelText(/^23 de noviembre: estudiaste$/)).toBeTruthy();
    expect(screen.getByLabelText(/^21 de noviembre: protector de racha$/)).toBeTruthy();
    expect(screen.getByLabelText(/^22 de noviembre: sin actividad$/)).toBeTruthy();
  });

  it('navega al mes anterior y no deja pasar del mes actual', async () => {
    await render(<StreakCalendar visible onClose={jest.fn()} streak={4} activeToday />);
    const next = screen.getByLabelText('Mes siguiente');
    expect(next.props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByLabelText('Mes anterior'));
    expect(mockUseActivityDays).toHaveBeenLastCalledWith('2026-10-01', '2026-10-31', true);
  });

  it('no consulta nada mientras está cerrado, y cierra con el botón', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(
      <StreakCalendar visible={false} onClose={onClose} streak={4} activeToday />,
    );
    expect(mockUseActivityDays).toHaveBeenLastCalledWith('2026-11-01', '2026-11-30', false);
    await rerender(<StreakCalendar visible onClose={onClose} streak={4} activeToday />);
    await fireEvent.press(screen.getAllByLabelText('Cerrar').at(-1)!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
