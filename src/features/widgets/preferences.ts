import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deviceStorage } from '@/lib/secureStorage';

import { WIDGET_CONTENT_OPTIONS, type WidgetContent } from './content';

const KEY = 'polygo.widget-content';
const queryKey = ['preferences', 'widget-content'] as const;

/**
 * Contenido elegido para el widget «Palabra». Se guarda en el dispositivo (el widget es de este
 * teléfono). Sólo se aplica con Plus; lo decide useWidgetSync con el estado del servidor.
 */
export async function loadWidgetContentPref(): Promise<WidgetContent> {
  try {
    const value = await deviceStorage.getItem(KEY);
    return WIDGET_CONTENT_OPTIONS.find((o) => o.id === value)?.id ?? 'mixed';
  } catch {
    return 'mixed';
  }
}

export function useWidgetContentPref() {
  return useQuery({ queryKey, queryFn: loadWidgetContentPref, staleTime: Infinity });
}

export function useSetWidgetContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: WidgetContent) => {
      await deviceStorage.setItem(KEY, content);
      qc.setQueryData(queryKey, content);
    },
  });
}
