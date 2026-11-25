import { useCallback, type ComponentRef, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Elementos que el tutorial ilumina. Cada pantalla marca el suyo con <TourTarget> (o useTourTarget)
 * y AppTour lo mide en la ventana para recortar el foco y ubicar al zorro.
 */
export type TourTargetId = 'learn-lesson' | 'learn-stats' | 'practice-today' | 'ranked-play';

export interface TourRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ViewHandle = ComponentRef<typeof View>;

const targets = new Map<TourTargetId, ViewHandle>();

/** Ref para marcar una vista como destino del tutorial. */
export function useTourTarget(id: TourTargetId) {
  return useCallback(
    (node: ViewHandle | null) => {
      if (node) targets.set(id, node);
      else targets.delete(id);
    },
    [id],
  );
}

/** Envuelve el elemento a iluminar (no cambia su diseño). */
export function TourTarget({
  id,
  style,
  children,
}: {
  id: TourTargetId;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const ref = useTourTarget(id);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}

/** Si la medición no responde en este tiempo, se da por no encontrada (nunca se traba el tutorial). */
const MEASURE_TIMEOUT_MS = 300;

/** Mide una vista en la ventana; null si no responde a tiempo o no se ve (tamaño 0). */
export function measureInWindow(node: ViewHandle | null | undefined): Promise<TourRect | null> {
  if (!node) return Promise.resolve(null);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), MEASURE_TIMEOUT_MS);
    node.measureInWindow((x, y, width, height) => {
      clearTimeout(timer);
      const valid = [x, y, width, height].every(Number.isFinite) && width > 0 && height > 0;
      resolve(valid ? { x, y, width, height } : null);
    });
  });
}

/** Posición en la ventana; null si no está montado o no se ve (otra pestaña, tamaño 0). */
export function measureTourTarget(id: TourTargetId): Promise<TourRect | null> {
  return measureInWindow(targets.get(id));
}
