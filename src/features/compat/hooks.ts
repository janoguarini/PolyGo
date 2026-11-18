import { useQuery } from '@tanstack/react-query';

import { fetchClientCompatibility } from './api';

export const clientCompatibilityKey = ['client-compatibility'] as const;

/** Compatibilidad de esta build; se vuelve a consultar cada hora y al volver a la app. */
export function useClientCompatibility() {
  return useQuery({
    queryKey: clientCompatibilityKey,
    queryFn: fetchClientCompatibility,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
