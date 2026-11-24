import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Brain,
  ChartNoAxesColumn,
  Check,
  ChevronRight,
  Crown,
  GraduationCap,
  ImageOff,
  Info,
  Layers,
  Smartphone,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import {
  BrandCard,
  Button,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useEnergy } from '@/features/plus/api';
import {
  PLUS_PLANS,
  REMOVE_ADS_PRODUCT,
  annualDeal,
  formatUsd,
  purchasePlus,
  restorePurchases,
  type PlusPlanId,
} from '@/features/plus/purchases';
import { useLocale, useStrings } from '@/i18n';
import { plusStrings } from '@/i18n/screens/plus';

const FOX = require('../../assets/plus/plus-fox.png') as number;
/** Ancho / alto de assets/plus/plus-fox.png. */
const FOX_ASPECT = 531 / 451;

const ROW_H = 48;
const HEAD_H = 54;

type FeatureKey =
  'lessons' | 'energy' | 'progress' | 'topic' | 'ranked' | 'smart' | 'widgets' | 'ads';

/** Gratis vs. Plus: lo mismo que dice docs/PLUS.md. Ranked nunca es una ventaja paga. */
const FEATURES: { key: FeatureKey; icon: typeof Zap; free: boolean }[] = [
  { key: 'lessons', icon: GraduationCap, free: true },
  { key: 'energy', icon: Zap, free: false },
  { key: 'progress', icon: ChartNoAxesColumn, free: true },
  { key: 'topic', icon: Layers, free: false },
  { key: 'ranked', icon: Trophy, free: true },
  { key: 'smart', icon: Brain, free: false },
  { key: 'widgets', icon: Smartphone, free: false },
  { key: 'ads', icon: ImageOff, free: false },
];

/**
 * PolyGo Plus: comparación Gratis / Plus, planes mensual y anual y la compra única sin publicidad.
 * Las compras todavía no están integradas (src/features/plus/purchases.ts): los botones lo avisan
 * en vez de cobrar, y Plus sólo se activa cuando el servidor lo confirma.
 */
export default function PlusScreen() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  const locale = useLocale();
  const energy = useEnergy();
  const [plan, setPlan] = useState<PlusPlanId>('annual');
  const [notice, setNotice] = useState(false);

  if (energy.isPending) return <LoadingState />;
  if (energy.isError || !energy.view) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <CloseButton />
        <ErrorState message={t.loadError} onRetry={energy.refetch} />
      </Screen>
    );
  }
  const isPlus = energy.view.plus;
  const deal = annualDeal();
  // Mientras no haya tienda, cualquier compra termina en el aviso.
  const tryPurchase = (run: () => Promise<unknown>) => () => {
    run().catch(() => setNotice(true));
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <CloseButton />
        <View style={styles.brand}>
          <Crown color={colors.textStrong} size={26} strokeWidth={2.2} />
          <Text variant="heading" color="textStrong" style={styles.brandText}>
            {t.brand}
          </Text>
        </View>
        <View style={styles.closeSpacer} />
      </View>

      <View style={styles.hero}>
        <Burst side="left" />
        <Image
          source={FOX}
          style={styles.fox}
          resizeMode="contain"
          fadeDuration={0}
          accessible={false}
        />
        <Burst side="right" />
      </View>
      <View style={styles.titleBox}>
        <Text style={styles.title} color="textStrong" accessibilityRole="header">
          {isPlus ? t.titleActive1 : t.title1}
        </Text>
        <Text style={styles.title} color="primarySoft">
          {isPlus ? t.titleActive2 : t.title2}
        </Text>
      </View>

      <Comparison />

      <BrandCard contentStyle={styles.smartCard}>
        <Brain color={colors.primarySoft} size={52} strokeWidth={1.8} />
        <View style={styles.smartText}>
          <Text color="textStrong" style={styles.smartTitle}>
            {t.smartTitle}
          </Text>
          <Text variant="caption" color="text">
            {t.smartBody}
          </Text>
        </View>
        <SmartArt />
      </BrandCard>

      {isPlus ? (
        <BrandCard contentStyle={styles.subscription}>
          <Text variant="bodyStrong" color="textStrong">
            {t.yourSubscription}
          </Text>
          <Text color="text">
            {energy.plusExpiresAt
              ? t.activeUntil(new Date(energy.plusExpiresAt).toLocaleDateString(locale))
              : t.active}{' '}
            {t.manage}
          </Text>
          {energy.isStale ? <Text variant="caption">{t.stale}</Text> : null}
        </BrandCard>
      ) : (
        <>
          <View style={styles.plans}>
            <PlanCard
              selected={plan === 'monthly'}
              title={t.monthly}
              price={t.perMonth(formatUsd(PLUS_PLANS.monthly.amount, locale))}
              onPress={() => setPlan('monthly')}
            />
            <PlanCard
              selected={plan === 'annual'}
              title={t.annual}
              badge={t.discount(deal.discountPercent)}
              price={t.perMonth(formatUsd(deal.perMonth, locale))}
              onPress={() => setPlan('annual')}
            />
          </View>
          {plan === 'annual' ? (
            <Text color="textStrong" align="center" style={styles.yearLine}>
              {t.perYear(formatUsd(PLUS_PLANS.annual.amount, locale))}{' '}
              <Text color="primarySoft">{t.savings(formatUsd(deal.savings, locale))}</Text>
            </Text>
          ) : (
            <Text color="text" align="center" style={styles.yearLine}>
              {t.monthlyNote}
            </Text>
          )}

          <Button
            label={t.activate(plan === 'annual')}
            size="lg"
            icon={<Crown color={colors.onPrimary} fill={colors.onPrimary} size={22} />}
            onPress={tryPurchase(() => purchasePlus())}
            style={styles.cta}
          />
          {notice ? (
            <View style={styles.notice} accessibilityLiveRegion="polite">
              <Info color={colors.info} size={18} />
              <Text variant="caption" color="textStrong" style={styles.flex}>
                {t.storeUnavailable}
              </Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.removeAdsA11y(formatUsd(REMOVE_ADS_PRODUCT.amount, locale))}
            onPress={tryPurchase(() => purchasePlus())}
            hitSlop={8}
            style={({ pressed }) => [styles.removeAds, pressed && styles.pressed]}
          >
            <ImageOff color={colors.textStrong} size={20} />
            <Text color="textStrong" style={styles.removeAdsText}>
              {t.removeAds} · {formatUsd(REMOVE_ADS_PRODUCT.amount, locale)} · {t.oneTime}
            </Text>
            <ChevronRight color={colors.textStrong} size={18} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={tryPurchase(() => restorePurchases())}
            hitSlop={8}
            style={({ pressed }) => [styles.restore, pressed && styles.pressed]}
          >
            <Text variant="caption" color="text" style={styles.underline}>
              {t.restore}
            </Text>
          </Pressable>
          <Text variant="caption" color="textMuted" align="center">
            {t.referencePrice} {t.fairPlay}
          </Text>
        </>
      )}
    </Screen>
  );
}

function CloseButton() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.close}
      hitSlop={8}
      onPress={() => router.back()}
      style={({ pressed }) => [styles.close, pressed && styles.pressed]}
    >
      <X color={colors.textStrong} size={24} />
    </Pressable>
  );
}

/** Rayitas doradas a los costados del zorro. */
function Burst({ side }: { side: 'left' | 'right' }) {
  const styles = useStyles();
  const flip = side === 'right' ? -1 : 1;
  return (
    <View style={[styles.burst, side === 'left' ? styles.burstLeft : styles.burstRight]}>
      {[-35, 0, 35].map((deg, i) => (
        <View
          key={deg}
          style={[
            styles.ray,
            i === 1 && styles.rayLong,
            { transform: [{ rotate: `${(deg - 20) * flip}deg` }] },
          ]}
        />
      ))}
    </View>
  );
}

function Comparison() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  return (
    <View style={styles.table}>
      <View style={styles.flex}>
        <View style={{ height: HEAD_H }} />
        <View style={styles.featureCard}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <View
                key={f.key}
                style={[styles.featureRow, i > 0 && styles.rowLine]}
                accessible
                accessibilityLabel={t.rowA11y(t.features[f.key], f.free, true)}
              >
                <Icon color={colors.primarySoft} size={20} />
                <Text color="textStrong" style={styles.featureText} numberOfLines={2}>
                  {t.features[f.key]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.freeCol} importantForAccessibility="no-hide-descendants">
        <View style={styles.colHead}>
          <Text color="textStrong" style={styles.colTitle}>
            {t.free}
          </Text>
        </View>
        {FEATURES.map((f, i) => (
          <View key={f.key} style={[styles.cell, i > 0 && styles.rowLine]}>
            <Mark ok={f.free} />
          </View>
        ))}
      </View>

      <LinearGradient
        colors={['#5B2BC2', '#3A1C86', '#2A1566']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.plusCol}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.colHead}>
          <Crown color={colors.gold} fill={colors.gold} size={22} />
          <Text color="textStrong" style={[styles.colTitle, styles.plusTitle]}>
            {t.plus}
          </Text>
        </View>
        {FEATURES.map((f, i) => (
          <View key={f.key} style={[styles.cell, i > 0 && styles.rowLinePlus]}>
            <Mark ok />
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <Check color={colors.success} size={24} strokeWidth={3.5} />
  ) : (
    <X color={colors.textMuted} size={22} strokeWidth={2.5} />
  );
}

/** Barras de aciertos y gráfico en subida (la ilustración del diseño). */
function SmartArt() {
  const styles = useStyles();
  const bars: { color: string; fill: number; icon: ReactNode }[] = [
    { color: colors.success, fill: 0.75, icon: <Check color="#fff" size={9} strokeWidth={4} /> },
    { color: colors.gold, fill: 0.9, icon: <Check color="#1A1040" size={9} strokeWidth={4} /> },
    { color: colors.primaryBright, fill: 0.4, icon: <X color="#fff" size={9} strokeWidth={4} /> },
  ];
  return (
    <View style={styles.art} accessible={false}>
      <View style={styles.artBars}>
        {bars.map((b, i) => (
          <View key={i} style={styles.artRow}>
            <View style={[styles.artDot, { backgroundColor: b.color }]}>{b.icon}</View>
            <View style={styles.artTrack}>
              <View
                style={[styles.artFill, { width: `${b.fill * 100}%`, backgroundColor: b.color }]}
              />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.chart}>
        {[0.35, 0.55, 0.75, 1].map((h, i) => (
          <View key={i} style={[styles.chartBar, { height: `${h * 100}%` }]} />
        ))}
        <TrendingUp color={colors.primarySoft} size={30} style={styles.trend} />
      </View>
    </View>
  );
}

function PlanCard(props: {
  selected: boolean;
  title: string;
  price: string;
  badge?: string;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  const body = (
    <>
      <View style={[styles.radio, props.selected && styles.radioOn]}>
        {props.selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.flex}>
        <View style={styles.planTitleRow}>
          <Text color="textStrong" style={styles.planTitle}>
            {props.title}
          </Text>
          {props.badge ? (
            <View style={styles.discount}>
              <Text style={styles.discountText}>{props.badge}</Text>
            </View>
          ) : null}
        </View>
        <Text color="textStrong" numberOfLines={1} adjustsFontSizeToFit>
          {props.price}
        </Text>
      </View>
    </>
  );
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: props.selected }}
      accessibilityLabel={t.planA11y(props.title, props.price, props.selected)}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.planShell,
        props.selected && styles.planGlow,
        pressed && styles.pressed,
      ]}
    >
      {props.selected ? (
        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.plan, styles.planOn]}
        >
          {body}
        </LinearGradient>
      ) : (
        <View style={styles.plan}>{body}</View>
      )}
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    pressed: { opacity: 0.8 },
    underline: { textDecorationLine: 'underline' },
    topBar: { flexDirection: 'row', alignItems: 'center' },
    close: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(139,92,246,0.22)',
    },
    closeSpacer: { width: 44 },
    brand: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    brandText: { fontSize: 24, fontWeight: '800' },
    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -spacing.sm,
      marginBottom: -spacing.lg,
    },
    fox: { width: 210, aspectRatio: FOX_ASPECT },
    burst: { width: 36, height: 60, alignItems: 'center', justifyContent: 'center' },
    burstLeft: { marginRight: -spacing.sm },
    burstRight: { marginLeft: -spacing.sm },
    ray: {
      position: 'absolute',
      width: 5,
      height: 18,
      borderRadius: 3,
      backgroundColor: colors.gold,
    },
    rayLong: { height: 26 },
    titleBox: { alignItems: 'center' },
    title: {
      fontSize: 31,
      lineHeight: 37,
      fontWeight: '900',
      fontStyle: 'italic',
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    table: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
    featureCard: {
      borderTopLeftRadius: radii.xl,
      borderBottomLeftRadius: radii.xl,
      backgroundColor: 'rgba(139,92,246,0.10)',
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: colors.brandBorder,
      overflow: 'hidden',
    },
    featureRow: {
      height: ROW_H,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
    },
    featureText: { flex: 1, fontSize: 14, lineHeight: 17 },
    rowLine: { borderTopWidth: 1, borderTopColor: colors.brandBorder },
    rowLinePlus: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' },
    freeCol: {
      width: 68,
      borderTopLeftRadius: radii.lg,
      borderTopRightRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    colHead: {
      height: HEAD_H - 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xxs,
    },
    colTitle: { fontSize: 17, fontWeight: '800', fontStyle: 'italic' },
    plusTitle: { fontSize: 20 },
    cell: { height: ROW_H, alignItems: 'center', justifyContent: 'center' },
    plusCol: {
      width: 88,
      marginTop: -6,
      paddingTop: 6,
      paddingBottom: 4,
      marginBottom: -4,
      borderRadius: radii.xl,
      borderWidth: 2,
      borderColor: colors.gold,
      shadowColor: '#C084FC',
      shadowOpacity: 0.8,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 12,
    },
    smartCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    smartText: { flex: 1, gap: spacing.xxs },
    smartTitle: { fontSize: 19, lineHeight: 22, fontWeight: '900', fontStyle: 'italic' },
    art: { width: 104, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
    artBars: { flex: 1, gap: 6 },
    artRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    artDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    artTrack: {
      flex: 1,
      height: 7,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.10)',
      overflow: 'hidden',
    },
    artFill: { height: '100%', borderRadius: 4 },
    chart: {
      width: 40,
      height: 56,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 2,
    },
    chartBar: { flex: 1, borderRadius: 2, backgroundColor: colors.primaryBright },
    trend: { position: 'absolute', top: -12, right: -6 },
    plans: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    planShell: { flex: 1, borderRadius: radii.xl },
    planGlow: {
      shadowColor: '#A855F7',
      shadowOpacity: 0.7,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 76,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    planOn: { borderWidth: 2, borderColor: '#E9D5FF' },
    planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
    planTitle: { fontSize: 18, fontWeight: '800' },
    discount: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 1,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    discountText: { color: '#1A1040', fontWeight: '800', fontSize: 13 },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: { borderColor: '#FFFFFF' },
    radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
    yearLine: { fontWeight: '700' },
    cta: {
      shadowColor: '#A855F7',
      shadowOpacity: 0.7,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    notice: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    removeAds: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 44,
    },
    removeAdsText: { flexShrink: 1, textDecorationLine: 'underline' },
    restore: { alignSelf: 'center', minHeight: 32, justifyContent: 'center' },
    subscription: { gap: spacing.sm },
  }),
);
