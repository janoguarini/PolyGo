import { answerSound } from '../answerSound';

describe('answerSound', () => {
  it('sólo suena cada 5 aciertos seguidos, subiendo de tono', () => {
    const sounds = Array.from({ length: 20 }, (_, i) => answerSound(true, i + 1, i));
    expect(sounds.map((s, i) => (s ? `${i + 1}:${s}` : null)).filter(Boolean)).toEqual([
      '5:streak1',
      '10:streak2',
      '15:streak3',
      '20:streak3',
    ]);
  });

  it('un error sólo suena si corta una racha de al menos 5', () => {
    expect(answerSound(false, 0, 0)).toBeNull();
    expect(answerSound(false, 0, 4)).toBeNull();
    expect(answerSound(false, 0, 5)).toBe('streakLost');
  });
});
