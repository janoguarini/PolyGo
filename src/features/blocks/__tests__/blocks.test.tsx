import { fireEvent, render, screen } from '@testing-library/react-native';

import { BlockUserButton } from '../BlockUserButton';
import { BlockedUsersSection } from '../BlockedUsersSection';

const mockBlock = jest.fn();
const mockUnblock = jest.fn();
let mockBlocked: { userId: string; username: string; avatarId: string; blockedAt: string }[] = [];

jest.mock('../api', () => ({
  useBlockUser: () => ({ mutate: mockBlock, isPending: false, isError: false, reset: jest.fn() }),
  useUnblockUser: () => ({ mutate: mockUnblock, isPending: false, isError: false }),
  useBlockedUsers: () => ({ isPending: false, isError: false, data: mockBlocked }),
}));

beforeEach(() => {
  mockBlock.mockClear();
  mockUnblock.mockClear();
});

it('bloquear pide confirmación y explica qué cambia', async () => {
  await render(<BlockUserButton userId="u2" username="sofi_22" />);
  await fireEvent.press(screen.getByLabelText('Bloquear a sofi_22'));
  expect(screen.getByText('¿Bloquear a @sofi_22?')).toBeTruthy();
  expect(screen.getByText(/No van a volver a cruzarse en ranked/)).toBeTruthy();
  expect(mockBlock).not.toHaveBeenCalled();

  await fireEvent.press(screen.getByText('Sí, bloquear'));
  expect(mockBlock).toHaveBeenCalledWith('u2', expect.anything());
});

it('Ajustes lista los bloqueados y permite desbloquear', async () => {
  mockBlocked = [{ userId: 'u3', username: 'tito', avatarId: 'bolt', blockedAt: '2026-10-31' }];
  await render(<BlockedUsersSection />);
  expect(screen.getByText('@tito')).toBeTruthy();
  await fireEvent.press(screen.getByText('Desbloquear'));
  expect(mockUnblock).toHaveBeenCalledWith('u3');
});

it('sin bloqueados explica cómo bloquear', async () => {
  mockBlocked = [];
  await render(<BlockedUsersSection />);
  expect(screen.getByText(/No bloqueaste a nadie/)).toBeTruthy();
});
