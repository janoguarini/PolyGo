import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { projectEnergy, type EnergySnapshot, type EnergyView } from '@shared/energy';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

/**
 * Dentro de ['learning']: guardar una lección invalida todo ese prefijo, así que la energía se
 * vuelve a leer sola después de gastarla.
 */
export const energyKeys = {
  state: (userId: string) => ['learning', 'energy', userId] as const,
};

export interface EnergyReading {
  snapshot: EnergySnapshot;
  /**
   * Hora del servidor menos la del teléfono, medida al pedirla. La cuenta regresiva usa la hora
   * del servidor: adelantar el reloj del teléfono no cambia nada (y el servidor decide igual).
   */
  offsetMs: number;
}

export async function fetchEnergy(): Promise<EnergyReading> {
  const sentAt = Date.now();
  const { data, error } = await requireSupabase().rpc('get_energy');
  if (error) throw error;
  const snapshot = data as unknown as EnergySnapshot;
  const receivedAt = Date.now();
  const offsetMs = new Date(snapshot.server_now).getTime() - (sentAt + receivedAt) / 2;
  return { snapshot, offsetMs };
}

/** Re-render periódico para que la cuenta regresiva avance. */
function useNow(intervalMs: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (intervalMs === null) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export interface EnergyState {
  /** null mientras carga o si nunca se pudo leer. */
  view: EnergyView | null;
  isPending: boolean;
  /** Falló la lectura y no hay ningún dato. */
  isError: boolean;
  /** Hay un dato anterior pero la última actualización falló: puede no estar al día. */
  isStale: boolean;
  /** Vencimiento de Plus según el servidor (null sin Plus o si no vence). */
  plusExpiresAt: string | null;
  refetch: () => void;
}

/** Energía y estado de Plus del usuario, según el servidor. */
export function useEnergy(): EnergyState {
  const { session } = useAuth();
  const userId = session?.user.id;
  const query = useQuery({
    queryKey: energyKeys.state(userId ?? 'anonymous'),
    queryFn: fetchEnergy,
    enabled: Boolean(userId),
    // Otro dispositivo pudo gastar energía: se relee cada tanto mientras la app está abierta.
    refetchInterval: 5 * 60_000,
  });
  const reading = query.data;
  const ticking = reading && !reading.snapshot.plus && reading.snapshot.next_unit_at;
  const now = useNow(ticking ? 15_000 : null);
  return {
    view: reading ? projectEnergy(reading.snapshot, now + reading.offsetMs) : null,
    isPending: query.isPending,
    isError: query.isError && !reading,
    isStale: Boolean(reading) && query.isError,
    plusExpiresAt: reading?.snapshot.plus_expires_at ?? null,
    refetch: () => void query.refetch(),
  };
}

/**
 * ¿Tiene PolyGo Plus? Lo decide el servidor (user_entitlements, que el cliente no puede escribir).
 * undefined mientras no se sabe: la UI no debe asumir ninguna de las dos.
 */
export function usePlus(): boolean | undefined {
  return useEnergy().view?.plus;
}
