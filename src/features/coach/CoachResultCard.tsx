import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Crown, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Button, Mascot, Text, colors, radii, spacing } from '@/design-system';
import { GoldButton } from '@/features/plus/components/GoldButton';
import { useStrings } from '@/i18n';
import { coachStrings } from '@/i18n/screens/coach';

import { useCoachStatus } from './api';

/**
 * Cierre de una sesión del Coach (dentro de los resultados del repaso). Refuerza el logro con el
 * resultado real y muestra qué sigue: otra sesión gratis, el plan, o Plus si ya no quedan pruebas.
 * Las pruebas las cuenta el servidor (get_coach_status): se vuelve a leer al montarse.
 */
export function CoachResultCard({ accuracy }: { accuracy: number }) {
  const t = useStrings(coachStrings);
  const status = useCoachStatus();
  const coach = status.data;
  const p = Math.round(accuracy * 100);
  const title = p >= 85 ? t.resultGreat : p >= 60 ? t.resultGood : t.resultTough;
  const exhausted = coach ? !coach.plus && coach.trialRemaining === 0 : false;

  return (
    <LinearGradient
      colors={['#5B2BC2', '#3A1C86', '#241258']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.top}>
        <View style={styles.flex}>
          <View style={styles.row}>
            <Sparkles color={colors.gold} size={16} />
            <Text style={styles.overline}>{t.overline}</Text>
          </View>
          <Text style={styles.title} color="textStrong">
            {title}
          </Text>
        </View>
        <View pointerEvents="none" style={styles.mascot}>
          <Mascot pose={p >= 60 ? 'wave' : 'thinking'} height={72} />
        </View>
      </View>
      <Text color="text">{t.resultBody(p)}</Text>

      {coach ? (
        coach.plus ? (
          <View style={styles.row}>
            <Crown color={colors.gold} fill={colors.gold} size={16} />
            <Text variant="caption" color="textStrong" style={styles.bold}>
              {t.resultPlus}
            </Text>
          </View>
        ) : exhausted ? (
          <View style={styles.gap}>
            <Text variant="bodyStrong" color="textStrong">
              {t.resultLast}
            </Text>
            <Text variant="caption" color="text">
              {t.resultLastBody}
            </Text>
            <GoldButton
              label={t.unlock}
              sublabel={t.unlockSub}
              onPress={() => router.push('/plus')}
            />
          </View>
        ) : (
          <View style={styles.row}>
            {Array.from({ length: coach.trialLimit }, (_, i) => (
              <View key={i} style={[styles.token, i < coach.trialRemaining && styles.tokenOn]} />
            ))}
            <Text variant="caption" color="textStrong" style={styles.bold}>
              {t.resultLeft(coach.trialRemaining)}
            </Text>
          </View>
        )
      ) : null}

      {exhausted ? null : (
        <Button label={t.seePlan} variant="secondary" onPress={() => router.replace('/coach')} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.5)',
  },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  gap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  bold: { fontWeight: '700' },
  overline: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 22, lineHeight: 26, fontWeight: '900', fontStyle: 'italic', marginTop: 2 },
  mascot: { marginTop: -spacing.lg, marginBottom: -spacing.md },
  token: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.18)' },
  tokenOn: { backgroundColor: colors.gold },
});
