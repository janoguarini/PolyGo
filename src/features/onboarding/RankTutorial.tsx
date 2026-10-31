import { StyleSheet, View } from 'react-native';

import { RATING_CONFIG, TIERS } from '@shared/ranking';

import { Card, RankEmblem, Text, spacing } from '@/design-system';

/** Tutorial del sistema competitivo: los valores salen de shared/ranking, no hay números copiados a mano. */
export function RankTutorial() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.ladder}>
        {TIERS.map((tier) => (
          <View key={tier.id} style={styles.rung}>
            <RankEmblem tier={tier.id} division={tier.hasDivisions ? 'I' : null} size={34} />
            <Text variant="overline" numberOfLines={1} style={styles.rungLabel}>
              {tier.name.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
      <Card>
        <Text variant="bodyStrong">1 · Empezás sin posicionar</Text>
        <Text color="textMuted">
          Tu primera victoria te mete en el ranking en Bronce (~{RATING_CONFIG.initialRating + 15}{' '}
          de ELO). Hasta entonces, perder no te resta.
        </Text>
      </Card>
      <Card>
        <Text variant="bodyStrong">2 · Subí de a poco</Text>
        <Text color="textMuted">
          Cada victoria suma ELO y cada derrota resta. Vencer a alguien mejor da más puntos. Cuanto
          más alto llegás, más rápidos son tus rivales.
        </Text>
      </Card>
      <Card>
        <Text variant="bodyStrong">3 · Juego limpio</Text>
        <Text color="textMuted">
          El servidor controla el reloj y valida cada respuesta. Jugar muchas veces seguidas contra
          la misma persona deja de sumar rating.
        </Text>
      </Card>
      <Card>
        <Text variant="bodyStrong">4 · Rango ≠ nivel de inglés</Text>
        <Text color="textMuted">
          Tu rango mide cómo competís. Tu progreso en el idioma se mide aparte, con lecciones y
          repasos.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  ladder: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  rung: { width: 72, alignItems: 'center', gap: spacing.xxs },
  rungLabel: { fontSize: 9 },
});
