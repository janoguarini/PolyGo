import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { localDateString } from '@/features/learning/api';
import { useMyWords, useWordOfTheDay, useWordPool } from '@/features/learning/hooks';

import { syncWidgets, widgetsSupported } from './sync';

/**
 * Mantiene los widgets al día mientras la app está abierta: al cargar los datos, cuando cambian
 * (p. ej. tras una lección) y cada vez que la app vuelve a primer plano.
 */
export function useWidgetSync(): void {
  const myWords = useMyWords();
  const pool = useWordPool();
  const wordOfDay = useWordOfTheDay();
  const [foregroundAt, setForegroundAt] = useState(() => Date.now());

  useEffect(() => {
    if (!widgetsSupported) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setForegroundAt(Date.now());
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!widgetsSupported || !myWords.data || !pool.data || wordOfDay.isPending) return;
    try {
      syncWidgets({
        myWords: myWords.data,
        pool: pool.data,
        wordOfDay: wordOfDay.data ?? null,
        localDate: localDateString(new Date(foregroundAt)),
        now: new Date(foregroundAt),
      });
    } catch {
      // Un widget que no se pudo actualizar nunca debe romper la app; queda el contenido anterior.
    }
  }, [myWords.data, pool.data, wordOfDay.data, wordOfDay.isPending, foregroundAt]);
}
