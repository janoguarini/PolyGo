import { totalXpForLevel, xpForNextLevel, xpProgress } from '@shared/xp';

import { nextXpAnnouncement, resetXpAnnouncements } from '../announce';
import {
  PREVIEW_SCENARIOS,
  gainPreviewXp,
  levelUpPreview,
  previewSnapshot,
  scenarioTotal,
  selectPreviewScenario,
  subscribePreviewAnnouncements,
} from '../preview';
import { isXpPreviewAllowed, qaReadOnly, xpPreview } from '../previewGate';

// El modo PREVIEW no puede tocar la red: si algo intentara llamar a Supabase, el test falla.
jest.mock('@/lib/pendingRpc', () => ({
  callPendingRpc: () => {
    throw new Error('PREVIEW no debe llamar a ninguna RPC');
  },
  isMissingRpc: () => false,
}));
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => {
    throw new Error('PREVIEW no debe usar Supabase');
  },
}));

describe('compuerta del modo PREVIEW', () => {
  it('sin la variable (como en los tests y en cualquier build sin configurar) está apagado', () => {
    expect(process.env.EXPO_PUBLIC_XP_PREVIEW).toBeUndefined();
    expect(xpPreview).toBeNull();
    expect(qaReadOnly).toBe(false);
  });

  it('exige desarrollo Y la variable exacta: en release (__DEV__ = false) nunca se activa', () => {
    expect(isXpPreviewAllowed(true, '1')).toBe(true);
    expect(isXpPreviewAllowed(false, '1')).toBe(false);
    expect(isXpPreviewAllowed(false, undefined)).toBe(false);
    expect(isXpPreviewAllowed(true, undefined)).toBe(false);
    expect(isXpPreviewAllowed(true, 'true')).toBe(false);
    expect(isXpPreviewAllowed(true, '0')).toBe(false);
  });
});

describe('datos de ejemplo', () => {
  beforeEach(() => resetXpAnnouncements());

  it('los tres escenarios salen de la curva real, con el progreso pedido', () => {
    const expected = { low: [12, 0.15], advanced: [32, 0.7], near: [50, 0.95] } as const;
    for (const s of PREVIEW_SCENARIOS) {
      selectPreviewScenario(s.id);
      const st = previewSnapshot();
      expect([s.level, s.ratio]).toEqual(expected[s.id]);
      expect(st.level).toBe(s.level);
      expect(st.total).toBe(scenarioTotal(s.level, s.ratio));
      expect(st.total).toBeGreaterThanOrEqual(totalXpForLevel(s.level));
      expect(st.need).toBe(xpForNextLevel(s.level));
      expect(st.into / st.need).toBeCloseTo(s.ratio, 2);
      expect(st).toMatchObject({ preview: true, initial: false, granted: [], granted_total: 0 });
      // Cambiar de escenario no se anuncia como XP ganado.
      expect(nextXpAnnouncement(st)).toBeNull();
    }
  });

  it('ganar XP muestra el aviso; subir de nivel, la celebración', () => {
    const heard: number[] = [];
    const off = subscribePreviewAnnouncements((s) => heard.push(s.total));
    selectPreviewScenario('low');
    const before = previewSnapshot();
    gainPreviewXp(20);
    const after = previewSnapshot();
    expect(after.total).toBe(before.total + 20);
    expect(after.level).toBe(12);
    expect(nextXpAnnouncement(after)).toEqual({
      kind: 'toast',
      total: 20,
      label: 'Lección completada',
    });

    selectPreviewScenario('near');
    levelUpPreview();
    const up = previewSnapshot();
    expect(up.level_before).toBe(50);
    expect(up.level).toBe(51);
    expect(up.into).toBe(10);
    expect(xpProgress(up.total).level).toBe(51);
    expect(nextXpAnnouncement(up)).toMatchObject({ kind: 'level', level: 51 });
    expect(heard).toHaveLength(2);
    off();
  });

  it('se puede repetir la celebración volviendo a elegir el escenario', () => {
    selectPreviewScenario('near');
    levelUpPreview();
    expect(nextXpAnnouncement(previewSnapshot())).toMatchObject({ kind: 'level', level: 51 });
    selectPreviewScenario('near');
    levelUpPreview();
    expect(nextXpAnnouncement(previewSnapshot())).toMatchObject({ kind: 'level', level: 51 });
  });
});
