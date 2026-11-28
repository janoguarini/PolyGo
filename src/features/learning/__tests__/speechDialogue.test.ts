import * as Speech from 'expo-speech';

import { SPEECH_RATES, dialogueVoices, speakDialogue, stopSpeaking } from '../speech';

jest.mock('expo-speech', () => ({
  VoiceQuality: { Default: 'Default', Enhanced: 'Enhanced' },
  getAvailableVoicesAsync: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
  stop: jest.fn(() => Promise.resolve()),
  speak: jest.fn(),
}));
jest.mock('@/lib/sounds', () => ({ configureAudio: () => Promise.resolve() }));

const voice = (identifier: string, language = 'en-US', quality = 'Default') =>
  ({ identifier, language, quality }) as Speech.Voice;
const speakMock = Speech.speak as jest.Mock;
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('dialogueVoices', () => {
  it('dos voces distintas del idioma: la mejor para «a», la siguiente para «b»', () => {
    const v = dialogueVoices(
      [
        voice('es-ar-x-local', 'es-AR'),
        voice('com.apple.voice.compact.en-US.Samantha'),
        voice('com.apple.voice.enhanced.en-US.Evan', 'en-US', 'Enhanced'),
      ],
      'en-US',
    );
    expect(v.a).toEqual({ voice: 'com.apple.voice.enhanced.en-US.Evan', pitch: 1 });
    expect(v.b).toEqual({ voice: 'com.apple.voice.compact.en-US.Samantha', pitch: 1 });
    expect(v).toMatchObject({ available: true, distinct: true });
  });

  it('con una sola voz, «b» usa la misma con otro tono y NO cuenta como segunda voz', () => {
    const v = dialogueVoices([voice('en-us-x-iol-local', 'en_US')], 'en-US');
    expect(v.a.voice).toBe(v.b.voice);
    expect(v.b.pitch).not.toBe(v.a.pitch);
    expect(v).toMatchObject({ available: true, distinct: false });
  });

  it('la misma voz en otra calidad (iOS) o en red y local (Android) no es una segunda voz', () => {
    const ios = dialogueVoices(
      [
        {
          ...voice('com.apple.voice.enhanced.en-US.Samantha', 'en-US', 'Enhanced'),
          name: 'Samantha (Enhanced)',
        },
        { ...voice('com.apple.voice.compact.en-US.Samantha'), name: 'Samantha' },
      ],
      'en-US',
    );
    expect(ios.distinct).toBe(false);
    const android = dialogueVoices(
      [voice('en-us-x-iol-network', 'en-US'), voice('en-us-x-iol-local', 'en-US')],
      'en-US',
    );
    expect(android.distinct).toBe(false);
  });

  it('en diálogos prefiere voces locales: las de red fallan sin conexión', () => {
    const v = dialogueVoices(
      [
        voice('en-us-x-sfg-network', 'en-US'),
        voice('en-us-x-iol-local', 'en-US'),
        voice('en-us-x-tpd-local', 'en-US'),
      ],
      'en-US',
    );
    expect(v.a.voice).toMatch(/-local$/);
    expect(v.b.voice).toMatch(/-local$/);
    expect(v.distinct).toBe(true);
  });

  it('sin voces del idioma no falla, pero avisa que no hay voz disponible', () => {
    const v = dialogueVoices([voice('es-ar-x-local', 'es-AR')], 'en-US');
    expect(v.a.voice).toBeUndefined();
    expect(v).toMatchObject({ available: false, distinct: false });
  });
});

describe('speakDialogue', () => {
  beforeEach(() => {
    speakMock.mockReset();
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([
      voice('com.apple.voice.enhanced.en-US.Evan', 'en-US', 'Enhanced'),
      voice('com.apple.voice.compact.en-US.Samantha'),
    ]);
  });

  const lines = [
    { text: 'Hello! My name is Tom.', voice: 'a' as const },
    { text: 'Hi, Tom', voice: 'b' as const },
  ];

  it('dice las líneas en orden, cada hablante con su voz, a la velocidad del estímulo', async () => {
    const onLine = jest.fn();
    const onDone = jest.fn();
    speakDialogue(lines, 0.85, { onLine, onDone });
    await flush();
    expect(speakMock).toHaveBeenCalledTimes(1);
    const [text0, opts0] = speakMock.mock.calls[0]!;
    expect(text0).toBe('Hello! My name is Tom.');
    expect(opts0).toMatchObject({ rate: 0.85, voice: 'com.apple.voice.enhanced.en-US.Evan' });
    opts0.onDone();
    const [text1, opts1] = speakMock.mock.calls[1]!;
    expect(text1).toBe('Hi, Tom.');
    expect(opts1).toMatchObject({ rate: 0.85, voice: 'com.apple.voice.compact.en-US.Samantha' });
    opts1.onDone();
    expect(onLine.mock.calls.map((c) => c[0])).toEqual([0, 1]);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('despacio baja la velocidad; nunca la sube', async () => {
    speakDialogue(lines, 0.85, { slow: true });
    await flush();
    expect(speakMock.mock.calls[0]![1].rate).toBe(SPEECH_RATES.slow);
    speakMock.mockReset();
    speakDialogue(lines, 0.1, { slow: true });
    await flush();
    expect(speakMock.mock.calls[0]![1].rate).toBe(0.1);
  });

  it('cortar o empezar otra reproducción detiene la anterior', async () => {
    const onDone = jest.fn();
    const cancel = speakDialogue(lines, 0.85, { onDone });
    await flush();
    const first = speakMock.mock.calls[0]![1];
    cancel();
    first.onDone();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(onDone).not.toHaveBeenCalled();

    speakMock.mockReset();
    speakDialogue(lines, 0.85, { onDone });
    await flush();
    const again = speakMock.mock.calls[0]![1];
    stopSpeaking();
    again.onDone();
    expect(speakMock).toHaveBeenCalledTimes(1);
  });

  it('informa qué voces hay antes de hablar (dos hablantes distintos)', async () => {
    const onVoices = jest.fn();
    speakDialogue(lines, 0.85, { onVoices });
    await flush();
    expect(onVoices).toHaveBeenCalledWith({ available: true, distinct: true });
  });

  it('un error del motor llega a onError', async () => {
    const onError = jest.fn();
    speakDialogue(lines, 0.85, { onError });
    await flush();
    speakMock.mock.calls[0]![1].onError(new Error('tts'));
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
