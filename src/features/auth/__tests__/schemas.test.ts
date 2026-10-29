import { usernameSchema } from '@shared/profile';

import { newPasswordSchema, signInSchema, signUpSchema } from '../schemas';

describe('esquemas de autenticación', () => {
  it('normaliza el email', () => {
    const r = signInSchema.parse({ email: '  Ana@Mail.COM ', password: 'x' });
    expect(r.email).toBe('ana@mail.com');
  });

  it('rechaza emails inválidos', () => {
    expect(signInSchema.safeParse({ email: 'no-es-email', password: 'x' }).success).toBe(false);
  });

  it('exige sólo un mínimo de 6 caracteres (el de Supabase)', () => {
    const base = { email: 'a@b.co' };
    const valid = (password: string) =>
      signUpSchema.safeParse({ ...base, password, confirmPassword: password }).success;
    expect(valid('abcde')).toBe(false);
    expect(valid('abcdef')).toBe(true);
    expect(valid('123456')).toBe(true);
    expect(valid('x'.repeat(73))).toBe(false);
  });

  it('detecta contraseñas que no coinciden', () => {
    const r = newPasswordSchema.safeParse({ password: 'abcd1234', confirmPassword: 'abcd12345' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path).toEqual(['confirmPassword']);
  });
});

describe('usernameSchema (mismas reglas que el CHECK de la base de datos)', () => {
  it.each(['ana', 'player_1', 'a'.repeat(20)])('acepta %s', (u) => {
    expect(usernameSchema.safeParse(u).success).toBe(true);
  });

  it.each(['ab', 'a'.repeat(21), 'con espacio', 'acentó', 'guion-medio'])('rechaza %s', (u) => {
    expect(usernameSchema.safeParse(u).success).toBe(false);
  });

  it('normaliza mayúsculas y espacios', () => {
    expect(usernameSchema.parse('  Ana_01 ')).toBe('ana_01');
  });
});
