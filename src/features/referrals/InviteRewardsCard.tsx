import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Gift } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { REFERRAL_GOAL, nextMilestone } from '@shared/referrals';

import { Card, ProgressBar, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { useReferralStatus } from './api';
import { referralStrings } from './strings';

/**
 * Entrada a Invitar amigos desde la pantalla de Amigos: progreso hacia el próximo premio. No se
 * muestra mientras la función del servidor no exista (migración sin aplicar).
 */
export function InviteRewardsCard() {
  const styles = useStyles();
  const t = useStrings(referralStrings);
  const status = useReferralStatus();
  if (!status.data) return null;
  const { qualified } = status.data;
  const next = nextMilestone(qualified);
  return (
    <Card
      onPress={() => router.push('/invite-friends')}
      accessibilityLabel={t.cardA11y(qualified, REFERRAL_GOAL)}
      style={styles.card}
    >
      <LinearGradient
        colors={['rgba(250,204,21,0.16)', 'rgba(139,92,246,0.22)', 'rgba(56,189,248,0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.icon}>
        <Gift color={colors.gold} size={24} />
      </View>
      <View style={styles.body}>
        <Text variant="overline" color="gold">
          {t.cardOverline}
        </Text>
        <Text variant="bodyStrong" color="textStrong">
          {next ? t.cardMissing(next.at - qualified) : t.cardAllUnlocked}
        </Text>
        <ProgressBar
          value={Math.min(1, qualified / REFERRAL_GOAL)}
          colors={['#FDE68A', '#F59E0B']}
          accessibilityLabel={t.validFriendsA11y(qualified, REFERRAL_GOAL)}
        />
        <Text variant="caption" color="text">
          {t.validFriends(qualified, REFERRAL_GOAL)}
        </Text>
      </View>
      <ChevronRight color={colors.textMuted} size={20} />
    </Card>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      overflow: 'hidden',
      borderColor: 'rgba(250,204,21,0.45)',
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: radii.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(250,204,21,0.14)',
    },
    body: { flex: 1, gap: spacing.xs },
  }),
);
