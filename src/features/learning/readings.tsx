import { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_LANGUAGE, type LanguageConfig } from '@shared/languages';
import { hasHan, segmentReadings, type ReadingDictionary } from '@shared/readings';

import { Text, spacing } from '@/design-system';

/**
 * Idioma de la sesión y pinyin encima de los caracteres chinos (shared/readings.ts). Los
 * componentes de ejercicio lo leen por contexto: sin proveedor (tests, inglés) se comportan como
 * siempre (el proveedor está en SessionLanguageProvider.tsx).
 */

export interface SessionLanguage {
  language: LanguageConfig;
  /** Diccionario de lecturas; null si el idioma no usa caracteres chinos. */
  readings: ReadingDictionary | null;
  showReadings: boolean;
  setShowReadings: (show: boolean) => void;
}

export const SessionLanguageContext = createContext<SessionLanguage>({
  language: DEFAULT_LANGUAGE,
  readings: null,
  showReadings: false,
  setShowReadings: () => {},
});

export const useSessionLanguage = () => useContext(SessionLanguageContext);

type TargetTextProps = Omit<React.ComponentProps<typeof Text>, 'children'> & { children: string };

/**
 * Texto en el idioma que se aprende. En chino, con el pinyin encima de cada palabra (si no está
 * oculto); en el resto, igual que Text.
 */
export function TargetText({ children, ...props }: TargetTextProps) {
  const { readings, showReadings } = useSessionLanguage();
  if (!readings || !showReadings || !hasHan(children)) return <Text {...props}>{children}</Text>;
  const justify =
    props.align === 'center' ? 'center' : props.align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <View
      style={[styles.row, { justifyContent: justify }]}
      accessible
      accessibilityLabel={children}
    >
      {segmentReadings(children, readings).map((s, i) => (
        <View key={i} style={styles.segment}>
          <Text variant="caption" color="primarySoft" align="center">
            {s.reading ?? ' '}
          </Text>
          <Text {...props}>{s.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: spacing.xxs },
  segment: { alignItems: 'center' },
});
