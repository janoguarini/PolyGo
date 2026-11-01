import * as Haptics from 'expo-haptics';
import { Flame, Snowflake } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { POLYS } from '@shared/polys';

import { Button, Card, PolyCoin, Text, colors, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { daysLabel } from '@/features/learning/streak';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

import { useBuyStreakFreeze, usePolys, useRepairStreak, type StreakRepairOffer } from './api';
import { lastChanceLabel } from './lastChance';

function celebrate() {
  playSound('complete');
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** El protector se compra con Polys: si un día no estudiás, se usa solo. */
export function FreezeCard({ freezes, max }: { freezes: number; max: number }) {
  const polys = usePolys();
  const buy = useBuyStreakFreeze();
  const balance = polys.data?.balance ?? 0;
  const price = POLYS.prices.streakFreeze;
  const full = freezes >= max;
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { borderColor: colors.info }]}>
          <Snowflake color={colors.info} size={26} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong">
            Protector de racha · {freezes}/{max}
          </Text>
          <Text variant="caption">Si un día no estudiás, se usa solo y tu racha sigue.</Text>
        </View>
      </View>
      <Button
        label={full ? 'Tenés el máximo' : `Comprar por ${price}`}
        variant="secondary"
        icon={full ? undefined : <PolyCoin size={20} />}
        disabled={full || balance < price}
        loading={buy.isPending}
        accessibilityHint={full ? undefined : `Cuesta ${price} Polys. Tenés ${balance}.`}
        onPress={() => buy.mutate(undefined, { onSuccess: celebrate })}
      />
      {!full && balance < price ? (
        <Text variant="caption" align="center">
          Te faltan {price - balance} Polys. Completá misiones para juntarlos.
        </Text>
      ) : null}
      {buy.isError ? <FormMessage tone="error" message={toUserMessage(buy.error)} /> : null}
    </Card>
  );
}

/** Recuperar una racha perdida pagando los días que faltaron. */
export function StreakRepairCard({ offer }: { offer: StreakRepairOffer }) {
  const polys = usePolys();
  const repair = useRepairStreak();
  const balance = polys.data?.balance ?? 0;
  const short = balance < offer.price;

  if (repair.isSuccess) {
    return (
      <Animated.View entering={ZoomIn.springify()}>
        <Card style={[styles.card, styles.repair]}>
          <View style={styles.row}>
            <View style={[styles.icon, styles.iconOn]}>
              <Flame color={colors.onPrimary} size={26} />
            </View>
            <View style={styles.flex}>
              <Text variant="heading" color="streak">
                ¡Racha recuperada!
              </Text>
              <Text variant="caption">Vas {daysLabel(repair.data.streak)}. Seguí así.</Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  }

  return (
    <Card style={[styles.card, styles.repair]}>
      <View style={styles.row}>
        <View style={[styles.icon, { borderColor: colors.streak }]}>
          <Flame color={colors.streak} size={26} />
        </View>
        <View style={styles.flex}>
          <Text variant="overline" color="streak">
            RACHA PERDIDA
          </Text>
          <Text variant="bodyStrong" color="textStrong">
            Recuperá tu racha de {daysLabel(offer.lost_streak)}
          </Text>
          <Text variant="caption">
            {offer.missed_days === 1 ? 'Faltaste 1 día' : `Faltaste ${offer.missed_days} días`}.
            Podés recuperarla hasta {lastChanceLabel(offer.last_chance)}.
          </Text>
        </View>
      </View>
      <Button
        label={`Recuperar por ${offer.price}`}
        icon={<PolyCoin size={20} />}
        disabled={short}
        loading={repair.isPending}
        accessibilityHint={`Cuesta ${offer.price} Polys. Tenés ${balance}.`}
        onPress={() => repair.mutate(undefined, { onSuccess: celebrate })}
      />
      {short ? (
        <Text variant="caption" align="center">
          Te faltan {offer.price - balance} Polys.
        </Text>
      ) : null}
      {repair.isError ? <FormMessage tone="error" message={toUserMessage(repair.error)} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: spacing.xxs },
  card: { gap: spacing.md },
  repair: { borderColor: colors.streak },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 2,
  },
  iconOn: { backgroundColor: colors.streak, borderColor: colors.streak },
});
