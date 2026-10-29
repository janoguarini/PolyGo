import { router } from 'expo-router';
import { BookOpen, Swords, TrendingUp } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button, RankEmblem, Screen, Text, colors, spacing } from '@/design-system';

const PILLARS = [
  { icon: BookOpen, title: 'Aprendé', text: 'Lecciones cortas de inglés desde A1.' },
  { icon: Swords, title: 'Competí', text: 'Batallas 1 contra 1 en tiempo real.' },
  { icon: TrendingUp, title: 'Subí de rango', text: 'Ganá ELO de Bronce a Gran Maestro.' },
] as const;

export default function WelcomeScreen() {
  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          <Button label="Crear cuenta" size="lg" onPress={() => router.push('/sign-up')} />
          <Button label="Ya tengo cuenta" variant="ghost" onPress={() => router.push('/sign-in')} />
        </>
      }
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.hero}>
        <View style={styles.emblems}>
          <RankEmblem tier="gold" division="II" size={64} dimmed />
          <RankEmblem tier="diamond" division="I" size={104} />
          <RankEmblem tier="master" size={64} dimmed />
        </View>
        <Text variant="overline" color="primarySoft">
          INGLÉS COMPETITIVO
        </Text>
        <Text variant="display" align="center">
          Polygo
        </Text>
        <Text variant="body" color="textMuted" align="center">
          Aprendé inglés jugando partidas ranked contra personas reales.
        </Text>
      </Animated.View>

      <View style={styles.pillars}>
        {PILLARS.map(({ icon: Icon, title, text }, i) => (
          <Animated.View
            key={title}
            entering={FadeInDown.delay(150 + i * 100)}
            style={styles.pillar}
          >
            <View style={styles.pillarIcon}>
              <Icon color={colors.primaryBright} size={22} />
            </View>
            <View style={styles.pillarText}>
              <Text variant="bodyStrong" color="textStrong">
                {title}
              </Text>
              <Text variant="caption">{text}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.huge },
  emblems: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pillars: { gap: spacing.md, marginTop: spacing.xl },
  pillar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pillarIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarText: { flex: 1 },
});
