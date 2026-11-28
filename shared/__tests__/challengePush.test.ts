import {
  challengeMessage,
  pushLanguage,
} from '../../supabase/functions/notify-battle-invite/message';

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

describe('idioma del aviso de desafío', () => {
  it('manda el idioma de interfaz del invitado, no el del curso', () => {
    expect(
      challengeMessage({ host: 'ana', languageCode: 'es', interfaceLanguage: 'it' }, 0).title,
    ).toBe('⚔️ @ana ti ha sfidato a duello');
    expect(
      challengeMessage({ host: 'ana', languageCode: 'en', interfaceLanguage: 'pt-BR' }, 1).title,
    ).toBe('🔥 @ana quer jogar com você');
    expect(
      challengeMessage({ host: 'ana', languageCode: 'it', interfaceLanguage: 'en' }, 0).body,
    ).toContain('60 seconds');
  });

  it('sin idioma de interfaz (perfiles viejos) sigue la regla anterior', () => {
    expect(pushLanguage({ languageCode: 'es', interfaceLanguage: null })).toBe('en');
    expect(pushLanguage({ languageCode: 'it' })).toBe('es');
    expect(pushLanguage({ languageCode: 'it', interfaceLanguage: 'de' })).toBe('es');
  });

  it('interfaz en francés: el aviso va en francés', () => {
    expect(pushLanguage({ languageCode: 'en', interfaceLanguage: 'fr' })).toBe('fr');
    expect(
      challengeMessage({ host: 'ana', languageCode: 'en', interfaceLanguage: 'fr' }, 1).title,
    ).toBe('🔥 @ana veut jouer avec toi');
  });

  it.each(['es', 'en', 'pt-BR', 'it', 'fr'] as const)('%s: todas las variantes tienen texto', (ui) => {
    const variants = [
      challengeMessage({ host: 'x', interfaceLanguage: ui }, 0),
      challengeMessage({ host: 'x', interfaceLanguage: ui }, 1),
      challengeMessage(
        { host: 'x', interfaceLanguage: ui, h2h: { host_wins: 1, invitee_wins: 2 } },
        0,
      ),
      challengeMessage(
        { host: 'x', interfaceLanguage: ui, h2h: { host_wins: 2, invitee_wins: 1 } },
        0,
      ),
      challengeMessage(
        { host: 'x', interfaceLanguage: ui, h2h: { host_wins: 1, invitee_wins: 1 } },
        0,
      ),
    ];
    for (const m of variants) {
      expect(m.title).toContain('@x');
      expect(m.body.trim()).not.toBe('');
    }
    if (ui !== 'es') for (const m of variants) expect(m.body).not.toMatch(/[¿¡]|vos\b|Aceptás/);
  });
});
