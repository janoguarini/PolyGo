import { TTS_VOICES, spokenText, ttsClipPath, ttsInput, ttsKey } from '../tts';

describe('voces neurales: contrato entre el script y la app', () => {
  it('la clave no depende de emojis, espacios ni forma Unicode', () => {
    expect(ttsKey('I want  a coffee')).toBe(ttsKey(' I want a coffee 🍵'));
    expect(ttsKey('café')).toBe(ttsKey('café'));
    expect(ttsKey('I want a coffee')).not.toBe(ttsKey('I want a tea'));
    expect(ttsKey('hello')).toMatch(/^[0-9a-f]{14}$/);
  });

  it('la clave es estable (cambiarla obligaría a regenerar todos los audios)', () => {
    expect(ttsKey('hello')).toBe(ttsKey('hello'));
    expect(ttsKey('Hello.')).not.toBe(ttsKey('hello'));
  });

  it('al sintetizador le llega la frase con punto final', () => {
    expect(ttsInput('apple')).toBe('apple.');
    expect(ttsInput('Are you ok?')).toBe('Are you ok?');
    expect(ttsInput('你好')).toBe('你好.');
    expect(spokenText('🔑 🔑')).toBe('');
  });

  it('hay dos voces distintas por idioma y la ruta lleva la voz', () => {
    for (const [lang, cfg] of Object.entries(TTS_VOICES)) {
      expect(cfg.voices.a).not.toBe(cfg.voices.b);
      expect(cfg.voices.a.startsWith(cfg.googleLocale)).toBe(true);
      expect(ttsClipPath(lang, cfg.voices.a, 'abc')).toBe(`${lang}/${cfg.voices.a}/abc.mp3`);
    }
    expect(Object.keys(TTS_VOICES).sort()).toEqual(['en', 'es', 'fr', 'it', 'pt', 'zh']);
  });
});
