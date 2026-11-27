import { StyleSheet, Text as RNText, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Avatar, BrandCard, Text, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { signupStrings } from './strings';

/** Tu tarjeta de jugador armándose en vivo mientras escribís el nombre: así te ven los rivales. */
export function PlayerCard({
  avatarId,
  username,
  flag,
  languageName,
  level,
  goal,
}: {
  avatarId: string;
  username: string;
  flag: string;
  languageName: string;
  level: string;
  goal: number;
}) {
  const styles = useStyles();
  const t = useStrings(signupStrings);
  return (
    <Animated.View entering={ZoomIn.springify().damping(12)}>
      <BrandCard glow contentStyle={styles.card}>
        <Avatar avatarId={avatarId} size={84} />
        <View style={styles.info}>
          <Text variant="overline" color="primarySoft">
            {t.player}
          </Text>
          <Text variant="title" color="textStrong" numberOfLines={1}>
            {username.trim() ? username.trim() : t.namePlaceholder}
          </Text>
          <View style={styles.chips}>
            <View style={styles.chip}>
              <RNText style={styles.emoji}>{flag}</RNText>
              <Text variant="caption" color="textStrong">
                {languageName}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text variant="caption" color="textStrong">
                🎯 {level}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text variant="caption" color="textStrong">
                🔥 {goal} {t.minutes}
              </Text>
            </View>
          </View>
        </View>
      </BrandCard>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg },
    info: { flex: 1, gap: spacing.xxs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    emoji: { fontSize: 13, lineHeight: 17 },
  }),
);
