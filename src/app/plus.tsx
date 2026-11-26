import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Check,
  Crown,
  GraduationCap,
  ImageOff,
  Info,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { FREE_LIMITS } from '@shared/plus';

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
import { useAuth } from '@/features/auth/AuthProvider';
import { energyKeys, useEnergy } from '@/features/plus/api';
import { entitlementKeys, useEntitlementsQuery } from '@/features/plus/entitlements';
import {
  getPlusOffer,
  manageSubscription,
  purchase,
  restore,
  storeSupported,
} from '@/features/plus/purchases';
import {
  annualSavings,
  formatPerMonth,
  type PlusPlanId,
  type PurchaseOutcome,
  type RestoreOutcome,
  type StorePlan,
} from '@/features/plus/store';
import { GoldButton, PLUS_INK as INK } from '@/features/plus/components/GoldButton';
import { APPLE_STANDARD_EULA } from '@/features/plus/storeConfig';
import { useLocale, useStrings } from '@/i18n';
import { track } from '@/lib/analytics';
import { plusStrings } from '@/i18n/screens/plus';
import { env } from '@/lib/env';

const FOX = require('../../assets/plus/plus-fox.png') as number;
/** Ancho / alto de assets/plus/plus-fox.png. */
const FOX_ASPECT = 531 / 451;

/**
 * Medidas según la pantalla, para que todo entre sin scroll en cualquier teléfono:
 * bajos (iPhone SE, Android 640 dp) → compacto; altos (Pro Max) → más aire; angostos → columnas
 * más finas; tablets y horizontal → ancho máximo centrado. Si con letra grande no entra, la
 * pantalla se desplaza (Screen) en vez de cortar nada.
 */
interface PlusLayout {
  rowH: number;
  headH: number;
  fox: number;
  titleSize: number;
  freeW: number;
  plusW: number;
  gap: number;
  priceSize: number;
}

function usePlusLayout(): PlusLayout {
  const { width, height } = useWindowDimensions();
  const short = height < 720;
  const tall = height >= 860;
  const narrow = width < 370;
  return {
    rowH: short ? 32 : tall ? 40 : 36,
    headH: short ? 34 : 40,
    fox: short ? 76 : tall ? 120 : 100,
    titleSize: short || narrow ? 21 : 25,
    freeW: narrow ? 56 : 62,
    plusW: narrow ? 68 : 78,
    gap: short ? spacing.sm : spacing.md,
    priceSize: narrow ? 18 : 21,
  };
}

/** Ancho máximo del contenido (tablets y horizontal). */
const MAX_WIDTH = 480;
/** Tope del agrandado de letra por accesibilidad en la tabla y los planes (después se desplaza). */
const MAX_FONT_SCALE = 1.25;

type FeatureKey = 'lessons' | 'progress' | 'ranked' | 'coach' | 'energy' | 'smart' | 'ads';

/**
 * Gratis vs. Plus (lo mismo que docs/PLUS.md), en el orden que vende: primero lo que ya tenés gratis,
 * después el Coach (prueba vs. ilimitado) y al final lo que sólo da Plus. Ranked nunca es una ventaja.
 * free: true = incluido, false = no, 'trial' = sesiones de prueba. plus: '∞' = ilimitado.
 */
const FEATURES: {
  key: FeatureKey;
  icon: typeof Zap;
  free: boolean | 'trial';
  plus?: '∞';
}[] = [
  { key: 'lessons', icon: GraduationCap, free: true },
  { key: 'progress', icon: BarChart3, free: true },
  { key: 'ranked', icon: Trophy, free: true },
  { key: 'coach', icon: Sparkles, free: 'trial', plus: '∞' },
  { key: 'energy', icon: Zap, free: false, plus: '∞' },
  { key: 'smart', icon: Brain, free: false },
  { key: 'ads', icon: ImageOff, free: false },
];

type Busy = null | 'purchase' | 'restore';
type Notice =
  { kind: 'purchase'; outcome: PurchaseOutcome } | { kind: 'restore'; outcome: RestoreOutcome };

/**
 * PolyGo Plus en una sola pantalla: qué tenés gratis, qué suma Plus, los dos planes y la compra.
 * Precios: los de la tienda (RevenueCat), en la moneda del usuario; nada de importes fijos.
 * Plus se activa recién cuando el servidor lo confirma (get_energy / get_entitlements).
 */
export default function PlusScreen() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  const locale = useLocale();
  const layout = usePlusLayout();
  const energy = useEnergy();
  const ent = useEntitlementsQuery();
  const { session } = useAuth();
  const userId = session?.user.id ?? 'anonymous';
  const queryClient = useQueryClient();
  const offer = useQuery({
    queryKey: ['plus', 'offer', userId] as const,
    queryFn: getPlusOffer,
    enabled: storeSupported(),
    staleTime: 10 * 60_000,
    retry: 1,
  });
  const [plan, setPlan] = useState<PlusPlanId>('annual');
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Analítica: cuánta gente llega al paywall (y cuánta compra).
  useEffect(() => {
    track('plus_viewed');
  }, []);

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
  const adFree = ent.data?.adFree === true;
  const detail = ent.data?.detail ?? null;
  const expired =
    !isPlus &&
    detail?.expiresAt != null &&
    ent.data != null &&
    // Con la hora del servidor: adelantar el reloj del teléfono no cambia nada.
    Date.parse(detail.expiresAt) <= Date.parse(ent.data.serverNow);

  const offerState = storeSupported()
    ? (offer.data ??
      (offer.isError ? { status: 'error' as const, reason: 'store' as const } : null))
    : { status: 'unavailable' as const };
  const available = offerState?.status === 'available' ? offerState.offer : null;
  const monthly = available?.monthly ?? null;
  const annual = available?.annual ?? null;
  const removeAds = available?.removeAds ?? null;
  const savings = annualSavings(monthly, annual);
  const selected = plan === 'annual' ? (annual ?? monthly) : (monthly ?? annual);
  const selectedId: PlusPlanId | null = selected
    ? selected === annual
      ? 'annual'
      : 'monthly'
    : null;
  // El precio por mes del anual sale de la tienda (mismo formato que los demás precios); si no lo da,
  // se calcula con Intl.
  const annualPerMonth =
    annual && savings
      ? (annual.pricePerMonthString ??
        formatPerMonth(savings.perMonth, annual.currencyCode, locale))
      : null;

  const refreshEntitlements = () => {
    void queryClient.invalidateQueries({ queryKey: entitlementKeys.all });
    void queryClient.invalidateQueries({ queryKey: energyKeys.state(userId) });
  };
  const runPurchase = (item: StorePlan, wants: 'plus' | 'ad_free') => {
    if (busy) return;
    setBusy('purchase');
    setNotice(null);
    const product = {
      product_id: item.productId,
      wants,
      price: item.price,
      currency: item.currencyCode,
    };
    track('purchase_started', product);
    void purchase(item, wants)
      .then((outcome) => {
        track(
          outcome === 'success' || outcome === 'confirming'
            ? 'purchase_completed'
            : 'purchase_failed',
          { ...product, outcome },
        );
        setNotice({ kind: 'purchase', outcome });
        if (outcome === 'success' || outcome === 'confirming') refreshEntitlements();
      })
      .finally(() => setBusy(null));
  };
  const runRestore = () => {
    if (busy) return;
    setBusy('restore');
    setNotice(null);
    void restore()
      .then((outcome) => {
        setNotice({ kind: 'restore', outcome });
        if (outcome === 'restored') refreshEntitlements();
      })
      .finally(() => setBusy(null));
  };
  const noticeText = notice
    ? notice.kind === 'purchase'
      ? t.purchaseOutcome[notice.outcome]
      : t.restoreOutcome[notice.outcome]
    : null;
  const noticeIsGood =
    notice?.outcome === 'success' ||
    notice?.outcome === 'restored' ||
    notice?.outcome === 'confirming';

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={[styles.page, { gap: layout.gap }]}>
        <View style={styles.topBar}>
          <CloseButton />
          <View style={styles.brandPill}>
            <Crown color={INK} fill={INK} size={14} />
            <Text style={styles.brandPillText}>{t.brandPill}</Text>
          </View>
          <View style={styles.closeSpacer} />
        </View>

        <View style={styles.hero}>
          <View
            style={[
              styles.foxGlow,
              { width: layout.fox, height: layout.fox, borderRadius: layout.fox / 2 },
            ]}
          >
            <Image
              source={FOX}
              // Ancho y alto explícitos: con sólo aspectRatio, iOS dibujaba la imagen a su tamaño original.
              style={{ width: layout.fox * 1.04, height: (layout.fox * 1.04) / FOX_ASPECT }}
              resizeMode="contain"
              fadeDuration={0}
              accessible={false}
            />
          </View>
          <View style={[styles.heroText, { marginTop: -Math.round(layout.fox * 0.24) }]}>
            <View style={styles.titleBox}>
              <Text
                style={[
                  styles.title,
                  { fontSize: layout.titleSize, lineHeight: layout.titleSize + 4 },
                ]}
                color="textStrong"
                accessibilityRole="header"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {isPlus ? t.titleActive1 : t.title1}
              </Text>
              <Text
                style={[
                  styles.title,
                  { fontSize: layout.titleSize, lineHeight: layout.titleSize + 4 },
                ]}
                color="primarySoft"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {isPlus ? t.titleActive2 : t.title2}
              </Text>
            </View>
          </View>
        </View>

        <Comparison layout={layout} />

        {noticeText ? (
          <View
            style={[styles.notice, noticeIsGood && styles.noticeGood]}
            accessibilityLiveRegion="polite"
          >
            {noticeIsGood ? (
              <Check color={colors.success} size={18} />
            ) : (
              <Info color={colors.info} size={18} />
            )}
            <Text variant="caption" color="textStrong" style={styles.flex}>
              {noticeText}
            </Text>
          </View>
        ) : null}

        {isPlus ? (
          <BrandCard contentStyle={styles.subscription}>
            <Text variant="bodyStrong" color="textStrong">
              {t.yourSubscription}
            </Text>
            <Text color="text">
              {energy.plusExpiresAt
                ? detail?.willRenew === false
                  ? t.cancelledUntil(new Date(energy.plusExpiresAt).toLocaleDateString(locale))
                  : detail?.willRenew === true
                    ? t.renewsOn(new Date(energy.plusExpiresAt).toLocaleDateString(locale))
                    : t.activeUntil(new Date(energy.plusExpiresAt).toLocaleDateString(locale))
                : t.active}
            </Text>
            {detail?.billingIssue ? (
              <View style={styles.row}>
                <AlertTriangle color={colors.streak} size={18} />
                <Text variant="caption" color="textStrong" style={styles.flex}>
                  {t.billingIssue}
                </Text>
              </View>
            ) : null}
            {detail && (detail.source === 'app_store' || detail.source === 'play_store') ? (
              <Button
                label={t.manageButton}
                variant="secondary"
                onPress={() => void manageSubscription()}
              />
            ) : (
              <Text variant="caption" color="text">
                {detail?.source === 'referral' ? t.referralSource : t.manage}
              </Text>
            )}
            {energy.isStale ? <Text variant="caption">{t.stale}</Text> : null}
          </BrandCard>
        ) : (
          <>
            {expired ? (
              <View style={styles.notice}>
                <Info color={colors.info} size={18} />
                <Text variant="caption" color="textStrong" style={styles.flex}>
                  {t.expired(new Date(detail!.expiresAt!).toLocaleDateString(locale))}
                </Text>
              </View>
            ) : null}

            {offerState === null ? (
              <LoadingState label={t.loadingPrices} />
            ) : offerState.status === 'error' ? (
              <View style={styles.notice}>
                <Info color={colors.info} size={18} />
                <Text variant="caption" color="textStrong" style={styles.flex}>
                  {offerState.reason === 'network' ? t.storeError : t.storeNotReady}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void offer.refetch()}
                  hitSlop={8}
                >
                  <Text variant="caption" color="primarySoft" style={styles.underline}>
                    {t.retry}
                  </Text>
                </Pressable>
              </View>
            ) : offerState.status === 'unavailable' ? (
              <View style={styles.notice}>
                <Info color={colors.info} size={18} />
                <Text variant="caption" color="textStrong" style={styles.flex}>
                  {t.storeUnavailable}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.plans}>
                  {monthly ? (
                    <PlanCard
                      priceSize={layout.priceSize}
                      selected={selectedId === 'monthly'}
                      title={t.monthly}
                      price={t.perMonth(monthly.priceString)}
                      detail={t.billedMonthly}
                      onPress={() => setPlan('monthly')}
                    />
                  ) : null}
                  {annual ? (
                    <PlanCard
                      priceSize={layout.priceSize}
                      selected={selectedId === 'annual'}
                      title={t.annual}
                      badge={savings ? t.saveBadge(savings.percent) : undefined}
                      price={
                        annualPerMonth ? t.perMonth(annualPerMonth) : t.perYear(annual.priceString)
                      }
                      detail={annualPerMonth ? t.billedYearly(annual.priceString) : t.annualNote}
                      onPress={() => setPlan('annual')}
                    />
                  ) : null}
                </View>

                {selected ? (
                  <GoldButton
                    label={busy === 'purchase' ? t.purchasing : t.cta}
                    sublabel={t.ctaSub}
                    disabled={busy !== null}
                    onPress={() => runPurchase(selected, 'plus')}
                  />
                ) : null}
              </>
            )}

            <View style={styles.links}>
              {removeAds && !adFree ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.removeAdsA11y(removeAds.priceString)}
                  onPress={() => runPurchase(removeAds, 'ad_free')}
                  disabled={busy !== null}
                  hitSlop={8}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Text variant="caption" color="text" style={styles.underline}>
                    {t.removeAdsShort(removeAds.priceString)}
                  </Text>
                </Pressable>
              ) : null}
              {storeSupported() ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={runRestore}
                  disabled={busy !== null}
                  hitSlop={8}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Text variant="caption" color="text" style={styles.underline}>
                    {busy === 'restore' ? t.restoring : t.restore}
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.fine} color="textMuted" align="center">
              {t.renewalTerms(Platform.OS === 'ios' ? 'App Store' : 'Google Play')}
            </Text>
          </>
        )}
        <LegalLinks />
      </View>
    </Screen>
  );
}

/** Términos de uso y política de privacidad, exigidos por las tiendas junto a la compra. */
function LegalLinks() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  const links = [
    // Nuestros términos (incluyen el EULA estándar de Apple para iPhone); sin sitio, el EULA de Apple.
    env?.termsUrl
      ? { label: t.terms, url: env.termsUrl }
      : Platform.OS === 'ios'
        ? { label: t.terms, url: APPLE_STANDARD_EULA }
        : null,
    env?.privacyPolicyUrl ? { label: t.privacy, url: env.privacyPolicyUrl } : null,
  ].filter((l): l is { label: string; url: string } => l !== null);
  if (links.length === 0) return null;
  return (
    <View style={styles.links}>
      {links.map((l) => (
        <Pressable
          key={l.url}
          accessibilityRole="link"
          onPress={() => void Linking.openURL(l.url)}
          hitSlop={8}
        >
          <Text style={[styles.fine, styles.underline]} color="textMuted">
            {l.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function CloseButton() {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.close}
      hitSlop={10}
      onPress={() => router.back()}
      style={({ pressed }) => [styles.close, pressed && styles.pressed]}
    >
      <X color={colors.textStrong} size={20} />
    </Pressable>
  );
}

function Comparison({ layout }: { layout: PlusLayout }) {
  const styles = useStyles();
  const rowH = { height: layout.rowH };
  const headH = { height: layout.headH - 1 };
  const t = useStrings(plusStrings);
  const trial = t.trialCell(FREE_LIMITS.coachTrialSessions);
  return (
    <View style={styles.table}>
      <View style={styles.flex}>
        <View style={{ height: layout.headH }} />
        <View style={styles.featureCard}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <View
                key={f.key}
                style={[styles.featureRow, rowH, i > 0 && styles.rowLine]}
                accessible
                accessibilityLabel={t.rowA11y(
                  t.features[f.key],
                  f.free === 'trial' ? trial : f.free,
                  true,
                )}
              >
                <Icon color={f.free === true ? colors.textMuted : colors.primarySoft} size={17} />
                <Text
                  color="textStrong"
                  style={styles.featureText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {t.features[f.key]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View
        style={[styles.freeCol, { width: layout.freeW }]}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={[styles.colHead, headH]}>
          <Text color="text" style={styles.colTitle}>
            {t.free}
          </Text>
        </View>
        {FEATURES.map((f, i) => (
          <View key={f.key} style={[styles.cell, rowH, i > 0 && styles.rowLine]}>
            {f.free === 'trial' ? (
              <Text color="text" style={styles.trialCell}>
                {trial}
              </Text>
            ) : (
              <Mark ok={f.free} />
            )}
          </View>
        ))}
      </View>

      {/* View con ancho fijo (entra en el cálculo de la fila) y el degradado como fondo absoluto. */}
      <View
        style={[styles.plusCol, { width: layout.plusW }]}
        importantForAccessibility="no-hide-descendants"
      >
        <LinearGradient
          colors={['#6D36E0', '#4320A6', '#2A1566']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.plusColFill}
        />
        <View style={[styles.colHead, headH]}>
          <Crown color={colors.gold} fill={colors.gold} size={18} />
          <Text color="textStrong" style={[styles.colTitle, styles.plusTitle]}>
            {t.plus}
          </Text>
        </View>
        {FEATURES.map((f, i) => (
          <View key={f.key} style={[styles.cell, rowH, i > 0 && styles.rowLinePlus]}>
            {f.plus ? <Text style={styles.infinity}>{f.plus}</Text> : <Mark ok plus />}
          </View>
        ))}
      </View>
    </View>
  );
}

function Mark({ ok, plus = false }: { ok: boolean; plus?: boolean }) {
  return ok ? (
    <Check color={plus ? colors.gold : colors.success} size={22} strokeWidth={3.5} />
  ) : (
    <X color={colors.textMuted} size={18} strokeWidth={2.5} />
  );
}

function PlanCard(props: {
  priceSize: number;
  selected: boolean;
  title: string;
  price: string;
  detail: string;
  badge?: string;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(plusStrings);
  const body: ReactNode = (
    <>
      <View style={styles.planTitleRow}>
        <Text color="textStrong" style={styles.planTitle}>
          {props.title}
        </Text>
        <View style={[styles.radio, props.selected && styles.radioOn]}>
          {props.selected ? <Check color={INK} size={14} strokeWidth={4} /> : null}
        </View>
      </View>
      <Text
        color="textStrong"
        style={[styles.planPrice, { fontSize: props.priceSize, lineHeight: props.priceSize + 5 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {props.price}
      </Text>
      <Text
        color={props.selected ? 'textStrong' : 'text'}
        style={styles.planDetail}
        numberOfLines={1}
      >
        {props.detail}
      </Text>
    </>
  );
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: props.selected }}
      accessibilityLabel={t.planA11y(
        props.title,
        `${props.price}, ${props.detail}`,
        props.selected,
      )}
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
      {props.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{props.badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    page: {
      gap: spacing.md,
      marginHorizontal: -spacing.sm,
      marginTop: 0,
      width: '100%',
      maxWidth: MAX_WIDTH,
      alignSelf: 'center',
    },
    flex: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.6 },
    underline: { textDecorationLine: 'underline' },
    topBar: { flexDirection: 'row', alignItems: 'center' },
    close: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(139,92,246,0.22)',
    },
    closeSpacer: { width: 36 },
    brandPill: {
      flex: 0,
      marginHorizontal: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    brandPillText: { color: INK, fontWeight: '900', fontSize: 14, letterSpacing: 0.4 },
    hero: { alignItems: 'center', marginTop: -spacing.xs },
    foxGlow: {
      width: 108,
      height: 108,
      borderRadius: 54,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(168,85,247,0.22)',
      shadowColor: '#C084FC',
      shadowOpacity: 0.8,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
    },
    // Ancho y alto explícitos: con sólo aspectRatio, iOS dibujaba la imagen a su tamaño original.
    // El título se monta sobre la base del zorro, como en el diseño de referencia.
    heroText: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: -26,
      zIndex: 1,
    },
    titleBox: { alignItems: 'center', flexShrink: 1 },
    title: {
      fontSize: 25,
      lineHeight: 29,
      fontWeight: '900',
      fontStyle: 'italic',
      letterSpacing: -0.4,
      textAlign: 'center',
    },
    table: { flexDirection: 'row', alignItems: 'flex-start' },
    featureCard: {
      borderTopLeftRadius: radii.lg,
      borderBottomLeftRadius: radii.lg,
      backgroundColor: 'rgba(139,92,246,0.10)',
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: colors.brandBorder,
      overflow: 'hidden',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingLeft: spacing.sm,
      paddingRight: spacing.xxs,
    },
    featureText: { flex: 1, fontSize: 14, lineHeight: 17, fontWeight: '600' },
    rowLine: { borderTopWidth: 1, borderTopColor: colors.brandBorder },
    rowLinePlus: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' },
    freeCol: {
      width: 62,
      flexShrink: 0,
      borderTopLeftRadius: radii.md,
      borderTopRightRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    colHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    colTitle: { fontSize: 14, fontWeight: '800', fontStyle: 'italic' },
    plusTitle: { fontSize: 17 },
    cell: { alignItems: 'center', justifyContent: 'center' },
    trialCell: { fontWeight: '800', fontSize: 12 },
    infinity: { color: colors.gold, fontSize: 24, lineHeight: 26, fontWeight: '900' },
    plusColFill: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: radii.lg - 2,
    },
    plusCol: {
      width: 78,
      flexShrink: 0,
      overflow: 'visible',
      backgroundColor: '#4320A6',
      marginTop: -6,
      paddingTop: 6,
      paddingBottom: 3,
      marginBottom: -3,
      borderRadius: radii.lg,
      borderWidth: 2,
      borderColor: colors.gold,
      shadowColor: '#C084FC',
      shadowOpacity: 0.9,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 12,
    },
    plans: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
    planShell: { flex: 1, borderRadius: radii.lg },
    planGlow: {
      shadowColor: '#A855F7',
      shadowOpacity: 0.8,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    plan: {
      gap: 2,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    planOn: { borderWidth: 2, borderColor: '#E9D5FF' },
    planTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    planTitle: { fontSize: 15, fontWeight: '800' },
    planPrice: { fontSize: 21, lineHeight: 26, fontWeight: '900' },
    planDetail: { fontSize: 12, lineHeight: 15 },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: { borderColor: colors.gold, backgroundColor: colors.gold },
    badge: {
      position: 'absolute',
      top: -11,
      left: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    badgeText: { color: INK, fontWeight: '900', fontSize: 11, letterSpacing: 0.3 },
    notice: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    noticeGood: { borderColor: colors.success },
    links: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      columnGap: spacing.lg,
      rowGap: spacing.xxs,
    },
    fine: { fontSize: 11, lineHeight: 14 },
    subscription: { gap: spacing.sm },
  }),
);
