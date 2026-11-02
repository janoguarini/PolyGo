import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';

import { readingDictionary } from '@shared/readings';

import { deviceStorage } from '@/lib/secureStorage';

import { useStudyLanguage, useWordPool } from './hooks';
import { SessionLanguageContext } from './readings';
import { useSpeechLanguage } from './speech';

/** Idioma de la sesión y pinyin (se puede ocultar para practicar la lectura; queda en el dispositivo). */
const KEY = 'polygo.show-pinyin';
const prefKey = ['preferences', 'show-pinyin'] as const;

function useShowPinyinPref() {
  return useQuery({
    queryKey: prefKey,
    queryFn: async () => {
      try {
        return (await deviceStorage.getItem(KEY)) !== 'off';
      } catch {
        return true;
      }
    },
    staleTime: Infinity,
  });
}

/** Se monta en las pantallas de lección y repaso, con el idioma del perfil. */
export function SessionLanguageProvider({ children }: { children: ReactNode }) {
  const language = useStudyLanguage();
  useSpeechLanguage(language.code);
  const pool = useWordPool();
  const pref = useShowPinyinPref();
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: async (show: boolean) => {
      qc.setQueryData(prefKey, show);
      await deviceStorage.setItem(KEY, show ? 'on' : 'off');
    },
  });
  const readings = useMemo(
    () => (language.script === 'han' && pool.data ? readingDictionary(pool.data) : null),
    [language.script, pool.data],
  );
  const value = useMemo(
    () => ({
      language,
      readings,
      showReadings: pref.data ?? true,
      setShowReadings: (show: boolean) => save.mutate(show),
    }),
    [language, readings, pref.data, save],
  );
  return (
    <SessionLanguageContext.Provider value={value}>{children}</SessionLanguageContext.Provider>
  );
}
