import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Swords } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Text, colors, spacing } from '@/design-system';

import { useDeclineBattleInvite, type BattleInvite } from '../social';
import { StatusAvatar } from './PlayerRow';

/**
 * Aviso arriba de las pestañas cuando un amigo te invita a un amistoso. Las invitaciones llegan
 * con el latido de presencia; sólo existen mientras quien desafía sigue esperando.
 */
export function BattleInviteBanner({ invites }: { invites: BattleInvite[] }) {
  const insets = useSafeAreaInsets();
  const decline = useDeclineBattleInvite();
  // Las que ya respondiste en esta sesión no vuelven a aparecer aunque el próximo latido las traiga.
  const [handled, setHandled] = useState<Set<string>>(() => new Set());
  const invite = invites.find((i) => !handled.has(i.code));

  const lastBuzzed = useRef<string | null>(null);
  useEffect(() => {
    if (!invite || lastBuzzed.current === invite.code) return;
    lastBuzzed.current = invite.code;
    if (Platform.OS !== 'web')
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [invite]);

  if (!invite) return null;
  const markHandled = () => setHandled((prev) => new Set(prev).add(invite.code));

  return (
    <Animated.View
      key={invite.code}
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[styles.wrap, { top: insets.top + spacing.sm }]}
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
    >
      <Card style={styles.card}>
        <View style={styles.row}>
          <StatusAvatar player={invite} size={40} online />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
              @{invite.username} te desafió
            </Text>
            <View style={styles.sub}>
              <Swords color={colors.primarySoft} size={14} />
              <Text variant="caption">Amistoso · no mueve el ELO</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Button
            label="Ahora no"
            variant="ghost"
            style={styles.flex}
            disabled={decline.isPending}
            onPress={() => {
              markHandled();
              decline.mutate(invite.code);
            }}
          />
          <Button
            label="Jugar"
            style={styles.flex}
            onPress={() => {
              markHandled();
              router.push({ pathname: '/battle', params: { code: invite.code } });
            }}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, zIndex: 10 },
  card: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  sub: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
