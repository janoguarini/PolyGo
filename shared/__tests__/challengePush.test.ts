import { challengeMessage } from '../../supabase/functions/notify-battle-invite/message';

describe('aviso de desafío de un amigo', () => {
  it('sin historial: duelo con la bandera del idioma, dos textos para la prueba A/B', () => {
    const a = challengeMessage({ host: 'juan', languageCode: 'it' }, 0);
    const b = challengeMessage({ host: 'juan', languageCode: 'it' }, 1);
    expect(a.title).toContain('@juan');
    expect(a.body).toContain('🇮🇹');
    expect(a.body).toContain('60 segundos');
    expect([a.variant, b.variant]).toEqual(['new_a', 'new_b']);
    expect(a.title).not.toBe(b.title);
  });

  it('con historial: revancha, desafío otra vez o desempate, con el marcador real', () => {
    expect(
      challengeMessage({ host: 'juan', h2h: { host_wins: 1, invitee_wins: 3 } }, 0),
    ).toMatchObject({
      title: '😤 @juan quiere la revancha',
      variant: 'h2h_lead',
    });
    expect(
      challengeMessage({ host: 'juan', h2h: { host_wins: 3, invitee_wins: 1 } }, 0).body,
    ).toContain('Te gana 3–1');
    expect(
      challengeMessage({ host: 'juan', h2h: { host_wins: 2, invitee_wins: 2 } }, 1).variant,
    ).toBe('h2h_tie');
  });

  it('quien estudia español (desde el inglés) lo recibe en inglés', () => {
    expect(challengeMessage({ host: 'ana', languageCode: 'es' }, 0).title).toBe(
      '⚔️ @ana challenged you to a duel',
    );
  });

  it('sin idioma conocido igual queda bien', () => {
    expect(challengeMessage({ host: 'ana', languageCode: null }, 1).body.startsWith('⚔️')).toBe(
      true,
    );
  });
});
