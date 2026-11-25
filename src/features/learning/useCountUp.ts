import { useEffect, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

/**
 * Un número que sube contando de `from` a `target` (frena al final), para los resultados: precisión,
 * correctas, XP… Con «reducir movimiento» muestra el valor final directamente; con `enabled` en false,
 * `from`. Se vuelve a animar si cambia el objetivo.
 */
export function useCountUp(
  target: number,
  { duration = 900, delay = 0, from = 0, enabled = true } = {},
): number {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion || duration <= 0;
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!enabled || instant) return;
    let frame: ReturnType<typeof setTimeout> | null = null;
    const startAt = Date.now() + delay;
    const tick = () => {
      const t = Math.min(1, Math.max(0, (Date.now() - startAt) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) frame = setTimeout(tick, 16);
    };
    frame = setTimeout(tick, Math.max(0, delay));
    return () => {
      if (frame) clearTimeout(frame);
    };
  }, [target, from, duration, delay, enabled, instant]);

  if (!enabled) return from;
  if (instant) return target;
  return value;
}
