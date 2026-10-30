import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { deviceStorage } from '@/lib/secureStorage';
import { setSoundEffectsEnabled } from '@/lib/sounds';

const KEY = 'polygo.sound-effects';
const queryKey = ['preferences', 'sound-effects'] as const;

/** Por defecto activados; sólo se guarda «off» explícito. */
export async function loadSoundEffectsPref(): Promise<boolean> {
  try {
    return (await deviceStorage.getItem(KEY)) !== 'off';
  } catch {
    return true;
  }
}

export function useSoundEffectsPref() {
  return useQuery({ queryKey, queryFn: loadSoundEffectsPref, staleTime: Infinity });
}

export function useSetSoundEffects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      setSoundEffectsEnabled(enabled);
      await deviceStorage.setItem(KEY, enabled ? 'on' : 'off');
      qc.setQueryData(queryKey, enabled);
    },
  });
}

/** Aplica la preferencia guardada al abrir la app (antes de que suene el primer efecto). */
export function useApplySoundEffectsPref() {
  const pref = useSoundEffectsPref();
  useEffect(() => {
    if (pref.data !== undefined) setSoundEffectsEnabled(pref.data);
  }, [pref.data]);
}
