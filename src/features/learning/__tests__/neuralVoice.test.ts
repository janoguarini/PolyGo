import * as Speech from 'expo-speech';

import { __setNeuralIndex } from '../neuralVoice';
import { setSpeechLanguage, speak, speakDialogue } from '../speech';

import { ttsKey } from '@shared/tts';

/**
 * speak() usa el audio neural si el texto lo tiene y, si no, la voz del teléfono como antes.
 */

const mockPlayer = {
  pause: jest.fn(),
  replace: jest.fn(),
  setPlaybackRate: jest.fn(),
  play: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
};
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => mockPlayer),
  setAudioModeAsync: jest.fn(async () => undefined),
}));
jest.mock('expo-file-system', () => {
  class Directory {
    uri: string;
    constructor(...parts: unknown[]) {
      this.uri = parts.map(String).join('/');
    }
    create() {}
  }
  class File {
    uri: string;
    exists = true;
    size = 100;
    constructor(...parts: unknown[]) {
      this.uri = parts.map((p) => (p as { uri?: string }).uri ?? String(p)).join('/');
    }
    static downloadFileAsync = jest.fn();
  }
  return { Directory, File, Paths: { cache: { uri: 'cache' } } };
});
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(async () => undefined),
  isSpeakingAsync: jest.fn(async () => false),
  getAvailableVoicesAsync: jest.fn(async () => []),
  VoiceQuality: { Enhanced: 'Enhanced', Default: 'Default' },
}));
jest.mock('@/lib/env', () => ({ env: { supabaseUrl: 'https://x.supabase.co' } }));

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('voz neural', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // El índice primero: con él cargado, setSpeechLanguage no lo vuelve a bajar.
    __setNeuralIndex('en', { a: [ttsKey('I want a coffee')], b: [ttsKey('Me too')] });
    setSpeechLanguage('en');
  });

  it('con audio neural suena el MP3 y no la voz del teléfono', async () => {
    speak('I want a coffee');
    await flush();
    expect(mockPlayer.replace).toHaveBeenCalledWith({ uri: expect.stringContaining('.mp3') });
    expect(mockPlayer.setPlaybackRate).toHaveBeenCalledWith(1, 'high');
    expect(mockPlayer.play).toHaveBeenCalled();
    expect(Speech.speak).not.toHaveBeenCalled();
  });

  it('«lento» baja la velocidad del audio neural', async () => {
    speak('I want a coffee', { slow: true });
    await flush();
    expect(mockPlayer.setPlaybackRate).toHaveBeenCalledWith(0.7, 'high');
  });

  it('sin audio neural para ese texto usa la voz del teléfono', async () => {
    speak('Something new');
    await flush();
    await flush();
    expect(mockPlayer.play).not.toHaveBeenCalled();
    expect(Speech.speak).toHaveBeenCalled();
  });

  it('un diálogo usa las voces neurales sólo si están todas sus líneas', async () => {
    const onVoices = jest.fn();
    speakDialogue(
      [
        { text: 'I want a coffee', voice: 'a' },
        { text: 'Me too', voice: 'b' },
      ],
      0.9,
      { onVoices },
    );
    await flush();
    expect(onVoices).toHaveBeenCalledWith({ available: true, distinct: true });
    expect(mockPlayer.play).toHaveBeenCalled();
  });
});
