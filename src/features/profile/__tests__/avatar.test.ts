import { avatarPathFor } from '../avatarUpload';

jest.mock('expo-image-picker', () => ({}));
jest.mock('expo-image-manipulator', () => ({}));

// Mismo patrón que el CHECK profiles_avatar_path_check (migración de avatares).
const check = (id: string) => new RegExp('^' + id + String.raw`/avatar\.jpg\?v=[0-9]{1,15}$`);

it('la ruta de la foto cumple el CHECK de la base', () => {
  const id = '7f1c2d3e-0000-4000-8000-000000000001';
  expect(avatarPathFor(id, Date.now())).toMatch(check(id));
  expect(`${id}/otra.jpg?v=1`).not.toMatch(check(id));
});
