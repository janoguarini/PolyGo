import { toUserMessage } from '../errors';

describe('toUserMessage', () => {
  it('traduce códigos de Supabase Auth', () => {
    expect(toUserMessage({ code: 'invalid_credentials', message: 'Invalid login' })).toBe(
      'Email o contraseña incorrectos.',
    );
  });

  it('traduce excepciones de las RPC', () => {
    expect(toUserMessage({ code: '23505', message: 'username_taken' })).toBe(
      'Ese nombre de usuario ya está en uso.',
    );
  });

  it('detecta errores de red', () => {
    expect(toUserMessage(new TypeError('Network request failed'))).toMatch(/conexión/);
  });

  it('no filtra mensajes internos desconocidos', () => {
    const msg = toUserMessage({ message: 'relation "secret_table" does not exist' });
    expect(msg).not.toContain('secret_table');
  });

  it('tolera valores no objeto', () => {
    expect(toUserMessage(undefined)).toBe('Ocurrió un error inesperado.');
  });
});
