import { Crown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import type { XpState } from './api';
import { xpStrings } from './strings';
import { displayedTitle } from './titles';

/**
 * Línea de identidad debajo del nombre (perfil propio): corona + título. Es el elegido en Editar
 * perfil (`choice`) si está desbloqueado; si no, el más alto que permite el nivel de `xp` (real,
 * PREVIEW o el inicial de nivel 0). Sobre el fondo del perfil (siempre oscuro): colores claros fijos.
 * `xp` undefined = cargando (reserva el alto); null = no se muestra.
 */
export function PlayerTitle({
  xp,
  choice,
}: {
  xp: XpState | null | undefined;
  choice?: string | null;
}) {
  const styles = useStyles();
  const t = useStrings(xpStrings);
  if (xp === null) return null;
  if (xp === undefined) return <View style={styles.placeholder} />;
  const title = t.title(displayedTitle(xp.level, choice));
  return (
    <View style={styles.titleRow} accessible accessibilityLabel={t.titleA11y(title)}>
      <Crown color="#FACC15" fill="#FACC15" size={16} />
      <Text variant="bodyStrong" style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    title: { flexShrink: 1, color: '#FDE68A', fontWeight: '800' },
    placeholder: { height: 22 },
  }),
);
