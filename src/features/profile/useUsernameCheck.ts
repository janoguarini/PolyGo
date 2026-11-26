import { useEffect, useRef, useState } from 'react';

import { suggestUsernames, usernameSchema } from '@shared/profile';

import { isUsernameAvailable } from './api';

export type UsernameStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'error';

export interface UsernameCheck {
  status: UsernameStatus;
  /** El nombre ya normalizado (minúsculas, sin espacios) que se comprobó. */
  name: string | null;
  /** Aviso del formato (sólo con status 'invalid'). */
  message?: string;
  /** Hasta 3 nombres parecidos y libres (sólo con status 'taken'). */
  suggestions: string[];
}

/** Pausa tras dejar de escribir antes de consultar la base. */
export const USERNAME_DEBOUNCE_MS = 400;
const SUGGESTIONS = 3;

/**
 * Comprueba en vivo si el nombre está libre (is_username_available, la misma regla que usa
 * complete_onboarding). Si está ocupado, busca 3 parecidos que sí estén libres. Las respuestas se
 * recuerdan mientras dura la pantalla: volver a un nombre ya consultado (o tocar una sugerencia) es
 * inmediato. Una respuesta vieja nunca pisa la del nombre actual.
 */
export function useUsernameCheck(raw: string): UsernameCheck {
  const [check, setCheck] = useState<UsernameCheck>({
    status: 'idle',
    name: null,
    suggestions: [],
  });
  const known = useRef(new Map<string, boolean>());
  const latest = useRef(0);

  useEffect(() => {
    const id = ++latest.current;
    const current = () => id === latest.current;
    const set = (next: UsernameCheck) => {
      if (current()) setCheck(next);
    };

    if (raw.trim() === '') {
      set({ status: 'idle', name: null, suggestions: [] });
      return;
    }
    const parsed = usernameSchema.safeParse(raw);
    if (!parsed.success) {
      set({
        status: 'invalid',
        name: null,
        message: parsed.error.issues[0]?.message,
        suggestions: [],
      });
      return;
    }
    const name = parsed.data;

    const available = (candidate: string): Promise<boolean> => {
      const cached = known.current.get(candidate);
      if (cached !== undefined) return Promise.resolve(cached);
      return isUsernameAvailable(candidate).then((ok) => {
        known.current.set(candidate, ok);
        return ok;
      });
    };

    const run = async () => {
      try {
        if (await available(name)) {
          set({ status: 'available', name, suggestions: [] });
          return;
        }
        set({ status: 'taken', name, suggestions: [] });
        const found: string[] = [];
        // Dos tandas como mucho: casi siempre alcanza con la primera.
        for (let round = 0; round < 2 && found.length < SUGGESTIONS && current(); round++) {
          const batch = suggestUsernames(name).filter((s) => !found.includes(s));
          const results = await Promise.allSettled(batch.map(available));
          batch.forEach((s, i) => {
            const r = results[i];
            if (r?.status === 'fulfilled' && r.value && found.length < SUGGESTIONS) found.push(s);
          });
        }
        set({ status: 'taken', name, suggestions: found });
      } catch {
        set({ status: 'error', name, suggestions: [] });
      }
    };

    // Lo ya consultado no espera: la respuesta es inmediata.
    if (known.current.has(name)) {
      void run();
      return;
    }
    set({ status: 'checking', name, suggestions: [] });
    const timer = setTimeout(() => void run(), USERNAME_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [raw]);

  return check;
}
