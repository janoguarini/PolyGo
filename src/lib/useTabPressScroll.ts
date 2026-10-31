import { useNavigation } from 'expo-router';
import { useEffect, useRef, type RefObject } from 'react';
import type { ScrollViewInstance } from 'react-native';

/**
 * Cada vez que se toca la pestaña de esta pantalla (esté abierta o no), la vuelve al inicio.
 * Por defecto sube al tope; `onPress` permite otro destino (p. ej. la lección actual).
 */
export function useTabPressScroll(
  ref: RefObject<ScrollViewInstance | null>,
  onPress?: (animated: boolean) => void,
) {
  const navigation = useNavigation();
  const handler = useRef(onPress);
  useEffect(() => {
    handler.current = onPress;
  });

  useEffect(() => {
    // @ts-expect-error: `tabPress` sólo lo emiten los navegadores de pestañas.
    return navigation.addListener('tabPress', () => {
      // Si la pestaña no estaba abierta, el salto va sin animación (no se ve).
      const animated = navigation.isFocused();
      requestAnimationFrame(() => {
        if (handler.current) handler.current(animated);
        else ref.current?.scrollTo({ y: 0, animated });
      });
    });
  }, [navigation, ref]);
}
