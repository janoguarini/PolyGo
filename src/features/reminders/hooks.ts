import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useLearningSummary } from '@/features/learning/hooks';

import {
  cancelReminders,
  loadReminderPrefs,
  remindersSupported,
  requestReminderPermission,
  saveReminderPrefs,
  syncReminders,
  type PermissionResult,
} from './notifications';
import type { ReminderPrefs } from './schedule';

const prefsKey = ['reminders', 'prefs'] as const;

export function useReminderPrefs() {
  return useQuery({
    queryKey: prefsKey,
    queryFn: loadReminderPrefs,
    enabled: remindersSupported,
    staleTime: Infinity,
  });
}

/**
 * Guarda la preferencia. Al activar pide permiso; si se niega, queda desactivado y se devuelve
 * el motivo para mostrarlo.
 */
export function useSetReminderPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prefs: ReminderPrefs): Promise<PermissionResult | null> => {
      const permission = prefs.enabled ? await requestReminderPermission() : null;
      const saved = { ...prefs, enabled: prefs.enabled && permission === 'granted' };
      await saveReminderPrefs(saved);
      qc.setQueryData(prefsKey, saved);
      return permission;
    },
  });
}

/**
 * Mantiene programados los recordatorios según la racha de hoy: se reprograma al abrir la app,
 * al terminar una sesión (el resumen se refresca) y al cambiar la preferencia. Al cerrar sesión
 * (las pestañas se desmontan) se cancelan.
 */
export function useReminderSync() {
  const prefs = useReminderPrefs();
  const summary = useLearningSummary();
  const p = prefs.data;
  const streakDays = summary.data?.streak_days;
  const activeToday = summary.data?.active_today;

  useEffect(() => {
    if (!p || streakDays === undefined || activeToday === undefined) return;
    syncReminders(p, { streakDays, activeToday }).catch(() => {
      // Un recordatorio que no se programa nunca debe romper la app.
    });
  }, [p, streakDays, activeToday]);

  useEffect(() => () => void cancelReminders().catch(() => {}), []);
}
