import { fireEvent, render, screen } from '@testing-library/react-native';

import { AdminEntryCard } from '../AdminEntryCard';
import { SUPERADMIN_UID } from '../api';

let mockUserId: string | undefined;
jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({ session: mockUserId ? { user: { id: mockUserId } } : null }),
}));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockPush(...a) } }));

describe('AdminEntryCard', () => {
  beforeEach(() => mockPush.mockClear());

  it('no aparece para un usuario común ni sin sesión', async () => {
    mockUserId = '00000000-0000-0000-0000-000000000001';
    await render(<AdminEntryCard />);
    expect(screen.queryByText('Panel de administración')).toBeNull();
    mockUserId = undefined;
    await render(<AdminEntryCard />);
    expect(screen.queryByText('Panel de administración')).toBeNull();
  });

  it('aparece para janitogap y abre /admin', async () => {
    mockUserId = SUPERADMIN_UID;
    await render(<AdminEntryCard />);
    await fireEvent.press(screen.getByLabelText('Panel de administración'));
    expect(mockPush).toHaveBeenCalledWith('/admin');
  });

  it('el UID es el del superadmin de la base (admin.superadmin_uid)', () => {
    expect(SUPERADMIN_UID).toBe('267762e4-8145-4e48-900b-9b14ccefb59b');
  });
});
