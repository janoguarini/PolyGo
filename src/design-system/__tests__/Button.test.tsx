import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../components/Button';

describe('Button', () => {
  it('llama a onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Jugar" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Jugar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no responde deshabilitado ni cargando', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Button label="Jugar" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole('button'));
    await rerender(<Button label="Jugar" onPress={onPress} loading />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('expone el estado de accesibilidad', async () => {
    await render(<Button label="Buscar partida" disabled />);
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });
  });
});
