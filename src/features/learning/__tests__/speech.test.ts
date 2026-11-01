import { SPEECH_RATES, speechInput, voiceScore } from '../speech';

jest.mock('expo-speech', () => ({ VoiceQuality: { Default: 'Default', Enhanced: 'Enhanced' } }));
jest.mock('@/lib/sounds', () => ({ configureAudio: () => Promise.resolve() }));

const voice = (identifier: string, language: string, quality = 'Default') =>
  ({ identifier, language, quality }) as Parameters<typeof voiceScore>[0];

describe('voiceScore', () => {
  it('descarta las voces que no son en inglés', () => {
    expect(voiceScore(voice('es-ar-x-local', 'es-AR'))).toBe(-Infinity);
  });

  it('en iOS prefiere premium, luego enhanced, luego compact', () => {
    const premium = voiceScore(voice('com.apple.voice.premium.en-US.Zoe', 'en-US', 'Enhanced'));
    const enhanced = voiceScore(
      voice('com.apple.voice.enhanced.en-US.Samantha', 'en-US', 'Enhanced'),
    );
    const compact = voiceScore(voice('com.apple.voice.compact.en-US.Samantha', 'en-US'));
    expect(premium).toBeGreaterThan(enhanced);
    expect(enhanced).toBeGreaterThan(compact);
  });

  it('una voz común de otro inglés gana a las de efectos o Eloquence de EE. UU.', () => {
    const gb = voiceScore(voice('com.apple.voice.compact.en-GB.Daniel', 'en-GB'));
    expect(gb).toBeGreaterThan(
      voiceScore(voice('com.apple.speech.synthesis.voice.Bubbles', 'en-US')),
    );
    expect(gb).toBeGreaterThan(voiceScore(voice('com.apple.eloquence.en-US.Flo', 'en-US')));
  });

  it('en Android desempata a favor de la voz local', () => {
    expect(voiceScore(voice('en-us-x-iol-local', 'en_US'))).toBeGreaterThan(
      voiceScore(voice('en-us-x-iol-network', 'en_US')),
    );
  });
});

describe('speechInput', () => {
  it('a las palabras sueltas les agrega punto y las dice más despacio', () => {
    expect(speechInput(' apple ')).toEqual({ text: 'apple.', rate: SPEECH_RATES.word });
  });

  it('respeta la puntuación de las frases', () => {
    expect(speechInput('How are you?')).toEqual({
      text: 'How are you?',
      rate: SPEECH_RATES.sentence,
    });
  });

  it('lento usa la velocidad más baja', () => {
    expect(speechInput('Good morning', true).rate).toBe(SPEECH_RATES.slow);
  });
});
