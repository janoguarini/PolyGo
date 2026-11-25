import { BOT_CONFIG } from '@shared/bots';

import { battleScreenStrings } from '@/i18n/screens/battle';

import { matchLabel, ratingNote, searchHint } from '../labels';

const es = battleScreenStrings.es;
const en = battleScreenStrings.en;

const base = { friendly: false, mode: 'ranked' as const, rating: null, calibration: null };

describe('etiqueta de la partida: todo Ranked es Word Rush', () => {
  it('contra una persona', () => {
    expect(matchLabel({ ...base, rating: 'competitive' }, es)).toBe('RANKED · WORD RUSH');
    expect(matchLabel({ ...base, rating: 'competitive' }, en)).toBe('RANKED · WORD RUSH');
  });

  it('calibración contra un rival de práctica: lo dice antes de empezar y que mueve el ELO', () => {
    const s = { ...base, rating: 'calibration' as const, calibration: { used: 2, limit: 3 } };
    expect(matchLabel(s, es)).toBe('RANKED · CALIBRACIÓN 2/3');
    expect(ratingNote(s, es)).toContain('contra un rival de práctica: mueve tu ELO');
    expect(ratingNote(s, es)).toContain('contra rivales de práctica se juega sin ELO');
    expect(ratingNote(s, en)).toContain('against a practice rival: it changes your ELO');
  });

  it('ninguna etiqueta ni nota del lobby dice «bot»', () => {
    const states = [
      { ...base, rating: 'competitive' as const },
      { ...base, rating: 'calibration' as const, calibration: { used: 1, limit: 3 } },
      { ...base, rating: 'unrated' as const },
    ];
    for (const t of [es, en]) {
      for (const s of states) {
        expect(matchLabel(s, t)).not.toMatch(/\bbots?\b/i);
        expect(ratingNote(s, t) ?? '').not.toMatch(/\bbots?\b/i);
      }
    }
  });

  it('bot fuera del cupo (unrated): Word Rush sin ELO, no «práctica»', () => {
    const s = { ...base, rating: 'unrated' as const };
    expect(matchLabel(s, es)).toBe('WORD RUSH · SIN ELO');
    expect(matchLabel(s, en)).toBe('WORD RUSH · NO ELO');
    expect(matchLabel(s, es)).not.toMatch(/PRÁCTICA/);
    expect(ratingNote(s, es)).toContain('tu ELO no cambia');
  });

  it('práctica sola, desafío con amigos y práctica contra bot de una build anterior', () => {
    expect(matchLabel({ ...base, mode: 'practice' }, es)).toBe('WORD RUSH · PRÁCTICA');
    expect(ratingNote({ ...base, mode: 'practice' }, es)).toBeNull();
    expect(matchLabel({ ...base, friendly: true }, es)).toBe('DESAFÍO · SIN ELO');
    expect(ratingNote({ ...base, friendly: true }, es)).toBeNull();
    expect(matchLabel({ ...base, mode: 'bot_practice' }, es)).toBe('WORD RUSH · SIN ELO');
  });

  it('ninguna etiqueta ni nota menciona Arcade', () => {
    const states = [
      { ...base, rating: 'competitive' as const },
      { ...base, rating: 'calibration' as const, calibration: { used: 1, limit: 3 } },
      { ...base, rating: 'unrated' as const },
      { ...base, mode: 'practice' as const },
      { ...base, friendly: true },
    ];
    for (const t of [es, en]) {
      for (const s of states) {
        expect(matchLabel(s, t)).not.toMatch(/arcade/i);
        expect(ratingNote(s, t) ?? '').not.toMatch(/arcade/i);
      }
    }
  });
});

describe('aviso mientras se busca rival', () => {
  const seconds = Math.round(BOT_CONFIG.afterMs / 1000);

  it('anuncia el rival de práctica a los 3 s, sin decir «bot»', () => {
    expect(seconds).toBe(3);
    expect(searchHint(null, es)).toBe(
      'Si en 3 s no aparece nadie, jugás contra un rival de práctica de tu nivel.',
    );
    expect(searchHint({ botCalibrationLeft: 2 }, en)).toBe(
      'If nobody shows up in 3 s, you’ll play a practice rival at your level.',
    );
    for (const left of [null, 2, 0]) {
      const queue = left === null ? null : { botCalibrationLeft: left };
      expect(searchHint(queue, es)).not.toMatch(/\bbots?\b/i);
      expect(searchHint(queue, en)).not.toMatch(/\bbots?\b/i);
    }
  });

  it('sin partidas de calibración, aclara que ese bot es sin ELO', () => {
    expect(searchHint({ botCalibrationLeft: 0 }, es)).toContain('sin ELO');
    expect(searchHint({ botCalibrationLeft: 0 }, en)).toContain('no ELO');
  });
});
