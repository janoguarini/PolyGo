import { Share2 } from 'lucide-react-native';
import { Share, StyleSheet, View } from 'react-native';

import { Card, Text, colors, spacing } from '@/design-system';
import { useMyProfile } from '@/features/profile/hooks';

import { IconAction } from './PlayerRow';

/** Tu código PG- para que otros te encuentren, con botón para compartirlo. */
export function MyCodeCard() {
  const profile = useMyProfile();
  const code = profile.data?.profile.public_code;
  const username = profile.data?.profile.username;
  if (!code) return null;
  return (
    <Card style={styles.card}>
      <View style={styles.flex}>
        <Text variant="overline">TU CÓDIGO DE AMIGO</Text>
        <Text variant="heading" color="textStrong" selectable>
          {code}
        </Text>
        <Text variant="caption">
          Te pueden agregar con este código{username ? ` o buscando @${username}` : ''}.
        </Text>
      </View>
      <IconAction
        label="Compartir tu código de amigo"
        onPress={() =>
          void Share.share({
            message: `¡Agregame en Polygo! Buscame como @${username} o con mi código ${code}.`,
          }).catch(() => {})
        }
      >
        <Share2 color={colors.text} size={20} />
      </IconAction>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
});
