import { playSound, setSoundEffectsEnabled } from '../sounds';

const mockPlay = jest.fn();
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: mockPlay, seekTo: () => Promise.resolve() }),
  setAudioModeAsync: () => Promise.resolve(),
}));

const flush = () => new Promise((r) => setTimeout(r, 0));

it('los efectos se pueden apagar y volver a prender', async () => {
  playSound('correct');
  await flush();
  expect(mockPlay).toHaveBeenCalledTimes(1);

  setSoundEffectsEnabled(false);
  playSound('incorrect');
  await flush();
  expect(mockPlay).toHaveBeenCalledTimes(1);

  setSoundEffectsEnabled(true);
  playSound('complete');
  await flush();
  expect(mockPlay).toHaveBeenCalledTimes(2);
});
