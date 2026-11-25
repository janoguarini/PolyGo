import { battleScreenStrings } from '@/i18n/screens/battle';
import { rankedScreenStrings } from '@/i18n/screens/ranked';

import { battleGivesXp, isRankedSearch, matchLabel, ratingNote } from '../labels';

const es = battleScreenStrings.es;
const en = battleScreenStrings.en;

const base = { friendly: false, mode: 'ranked' as const, rating: null, calibration: null };

/** Nada que delate si el rival es un bot o una persona. */
const REVEALS_RIVAL = /\bbots?\b|rivales? de pr[áa]ctica|practice rival|una persona|a person/i;

describe('etiqueta de la partida: todo Ranked es Word Rush', () => {
  it('clasificatoria', () => {
    const s = { ...base, rating: 'competitive' as const };
    expect(matchLabel(s, es)).toBe('RANKED · WORD RUSH');
    expect(matchLabel(s, en)).toBe('RANKED · WORD RUSH');
    expect(ratingNote(s, es)).toBe('Partida clasificatoria: mueve tu ELO.');
  });

  it('calibración: dice cuál es y que mueve el ELO', () => {
    const s = { ...base, rating: 'calibration' as const, calibration: { used: 2, limit: 3 } };
    expect(matchLabel(s, es)).toBe('RANKED · CALIBRACIÓN 2/3');
    expect(ratingNote(s, es)).toBe('Partida de calibración 2 de 3: mueve tu ELO.');
    expect(ratingNote(s, en)).toBe('Calibration match 2 of 3: it changes your ELO.');
  });

  it('fuera del cupo (unrated): Word Rush sin ELO, no «práctica»', () => {
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

  it('ninguna etiqueta ni nota menciona Arcade ni delata al rival', () => {
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
        expect(matchLabel(s, t)).not.toMatch(REVEALS_RIVAL);
        expect(ratingNote(s, t) ?? '').not.toMatch(REVEALS_RIVAL);
      }
    }
  });
});

describe('búsqueda de rival', () => {
  it('sólo dice que busca a alguien de tu nivel', () => {
    expect(es.searchingSub('Inglés')).toBe('Buscando a alguien de tu nivel en Inglés');
    expect(es.searchingSub(null)).toBe('Buscando a alguien de tu nivel');
    expect(en.searchingSub('English')).toBe('Looking for someone at your level in English');
  });

  it('ni la búsqueda ni la pestaña Ranked mencionan bots ni rivales de práctica', () => {
    for (const t of [es, en]) {
      expect(t.searching).not.toMatch(REVEALS_RIVAL);
      expect(t.searchingSub('Inglés')).not.toMatch(REVEALS_RIVAL);
      expect(t.searchingSub(null)).not.toMatch(REVEALS_RIVAL);
    }
    for (const t of [rankedScreenStrings.es, rankedScreenStrings.en]) {
      expect(t.findMatchHint).not.toMatch(REVEALS_RIVAL);
    }
  });
});

describe('cuándo se ve «Buscando rival»', () => {
  const ranked = { mode: 'ranked' as const, friendly: false, challenge: null };

  it('al buscar Ranked, desde el primer instante: antes de conectar, conectando y en la cola', () => {
    for (const phase of ['idle', 'connecting', 'searching'] as const) {
      expect(isRankedSearch({ ...ranked, phase }, true)).toBe(true);
    }
  });

  it('nunca en prácticas, desafíos con amigos ni con el rival ya encontrado', () => {
    expect(isRankedSearch({ ...ranked, phase: 'connecting', mode: 'practice' }, true)).toBe(false);
    expect(isRankedSearch({ ...ranked, phase: 'idle' }, false)).toBe(false);
    expect(isRankedSearch({ ...ranked, phase: 'connecting', friendly: true }, true)).toBe(false);
    expect(
      isRankedSearch(
        { ...ranked, phase: 'searching', challenge: { code: 'ABC123', expiresAt: 0 } },
        true,
      ),
    ).toBe(false);
    for (const phase of ['found', 'countdown', 'playing', 'finished', 'error'] as const) {
      expect(isRankedSearch({ ...ranked, phase }, true)).toBe(false);
    }
  });
});

describe('qué partidas muestran la XP ganada', () => {
  it('Ranked con ELO (calibración o clasificatoria), ganes o pierdas', () => {
    expect(battleGivesXp({ mode: 'ranked', rating: 'competitive' })).toBe(true);
    expect(battleGivesXp({ mode: 'ranked', rating: 'calibration' })).toBe(true);
  });

  it('no las sin ELO, las prácticas ni los amistosos', () => {
    expect(battleGivesXp({ mode: 'ranked', rating: 'unrated' })).toBe(false);
    expect(battleGivesXp({ mode: 'practice', rating: 'unrated' })).toBe(false);
    expect(battleGivesXp({ mode: 'bot_practice', rating: 'unrated' })).toBe(false);
    expect(battleGivesXp({ mode: 'ranked', rating: 'competitive', friendly: true })).toBe(false);
  });
});
