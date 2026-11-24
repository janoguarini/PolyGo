import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Crown,
  GraduationCap,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { useCallback, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { AppleButton } from '../AppleSignInButton';
import { authStrings, welcomeStrings } from '../strings';
import { GoogleIcon, Headline, WelcomeBackdrop } from './WelcomeArt';
import { GUTTER, welcome, welcomeMetrics } from './welcomeTheme';

const HERO = require('../../../../assets/images/welcome-hero.webp') as number;

// Íconos de las tarjetas, en el mismo orden que welcomeStrings.features.
const FEATURE_ICONS: { icon: LucideIcon; active?: boolean }[] = [
  { icon: BookOpen },
  { icon: Swords, active: true },
  { icon: ChartNoAxesColumnIncreasing },
];

const TAGS: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: 'A1 – C1' },
  { icon: Users, label: '1 VS 1' },
  { icon: Trophy, label: 'RANKED' },
];

export interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onSignIn: () => void;
  /**
   * Inicio de sesión con Google (estado de useGoogleSignIn). Sólo se muestra el botón si se pasa.
   */
  google?: SocialSignIn;
  /** Sign in with Apple (estado de useAppleSignIn). La ruta sólo lo pasa en iOS. */
  apple?: SocialSignIn;
}

interface SocialSignIn {
  onPress: () => void;
  busy: boolean;
  message: { tone: 'error' | 'info'; text: string } | null;
}

export function WelcomeScreen({ onCreateAccount, onSignIn, google, apple }: WelcomeScreenProps) {
  const { scheme } = useTheme();
  const t = useStrings(welcomeStrings);
  const googleText = useStrings(authStrings).google;
  const features = FEATURE_ICONS.map((f, i) => ({ ...f, ...t.features[i]! }));
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const m = welcomeMetrics(width, height - insets.top - insets.bottom);
  const [heroCenter, setHeroCenter] = useState(height * 0.28);
  // Alto real (medido en el dispositivo) del encabezado y de todo lo que va debajo de la imagen.
  // Las letras de iOS/Android y el tamaño de texto del usuario cambian estos altos: medirlos es la
  // única forma de que la imagen use exactamente el espacio que sobra y nada quede fuera.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bottomHeight, setBottomHeight] = useState(0);
  const padTop = insets.top + (m.compact ? 4 : 8);
  const padBottom = insets.bottom + (m.compact ? 6 : 10);
  const measured = headerHeight > 0 && bottomHeight > 0;
  // Espacio libre entre el encabezado y el bloque de abajo. La imagen lo usa hasta heroMax y queda
  // centrada en él, así el sobrante de las pantallas altas se reparte arriba y abajo.
  const heroSpace = measured
    ? Math.max(
        m.heroMin,
        Math.floor(height - padTop - padBottom - headerHeight - bottomHeight - m.gap * 2),
      )
    : m.heroMin;
  const heroHeight = Math.min(heroSpace, m.heroMax);

  // Pantalla de marca siempre oscura: barra de estado clara mientras está en foco, y al salir se
  // devuelve la que corresponde al tema.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle(scheme === 'light' ? 'dark' : 'light');
    }, [scheme]),
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={welcome.background} style={StyleSheet.absoluteFill} />
      <WelcomeBackdrop width={width} height={height} glowY={heroCenter} />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          { paddingTop: padTop, paddingBottom: padBottom, gap: m.gap },
        ]}
      >
        {/* A. Encabezado */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.brand}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <Crown color={welcome.text} size={m.compact ? 22 : 24} strokeWidth={2.2} />
          <Text
            style={[styles.brandText, m.compact && styles.brandTextCompact]}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.2}
          >
            PolyGo
          </Text>
        </Animated.View>

        {/* B. Ilustración: ocupa el alto que sobra, entre heroMin y heroMax */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={[styles.hero, { height: heroSpace }]}
          onLayout={(e) => {
            const { y, height: h } = e.nativeEvent.layout;
            setHeroCenter(y + h / 2);
          }}
        >
          <Image
            source={HERO}
            style={[styles.heroImage, { height: heroHeight }]}
            resizeMode="contain"
            fadeDuration={0}
            accessibilityIgnoresInvertColors
            accessible
            accessibilityRole="image"
            accessibilityLabel={t.heroLabel}
          />
        </Animated.View>

        {/* C a F: un solo bloque medido, pegado abajo */}
        <View
          style={[styles.bottom, { gap: m.gap }]}
          onLayout={(e) => setBottomHeight(e.nativeEvent.layout.height)}
        >
          {/* C. Titular */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={[styles.headline, iosOnly(styles.headlineGlow)]}
            accessible
            accessibilityRole="header"
            accessibilityLabel={`${t.headlineLine1} ${t.headlineLine2}`}
          >
            <Headline
              width={m.contentWidth}
              fontSize={m.headlineSize}
              lineHeight={m.headlineLine}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(160).duration(500)}
            style={[styles.subtitle, m.compact && styles.subtitleCompact]}
            maxFontSizeMultiplier={1.3}
          >
            {t.subtitle}
          </Animated.Text>

          {/* D. Tarjetas + E. Etiquetas */}
          <Animated.View entering={FadeInDown.delay(220).duration(500)} style={styles.grid}>
            <View style={styles.row}>
              {features.map(({ icon: Icon, title, text, active }) => (
                <View
                  key={title}
                  style={[
                    styles.card,
                    m.compact && styles.cardCompact,
                    active && styles.cardActive,
                  ]}
                  accessible
                  accessibilityLabel={`${title}. ${text}`}
                >
                  <View style={[styles.iconSpace, iosOnly(styles.iconGlow)]}>
                    <Icon color={welcome.iconBright} size={m.cardIcon} strokeWidth={1.9} />
                  </View>
                  <Text
                    style={[styles.cardTitle, m.compact && styles.cardTitleCompact]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    maxFontSizeMultiplier={1.2}
                  >
                    {title}
                  </Text>
                  <Text style={styles.cardText} numberOfLines={2} maxFontSizeMultiplier={1.2}>
                    {text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.row}>
              {TAGS.map(({ icon: Icon, label }) => (
                <View key={label} style={styles.tagCell}>
                  <View style={styles.tag}>
                    <Icon color={welcome.iconBright} size={15} strokeWidth={2} />
                    <Text
                      style={styles.tagText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                      maxFontSizeMultiplier={1.2}
                    >
                      {label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* F. Botones */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={[styles.actions, { paddingTop: m.compact ? 2 : 6 }]}
          >
            {google ? (
              <>
                <GlowButton
                  label={googleText.label}
                  icon={<GoogleIcon size={m.compact ? 26 : 28} />}
                  height={m.buttonHeight}
                  onPress={google.onPress}
                  loading={google.busy}
                  accessibilityHint={googleText.hint}
                  testID="google-sign-in"
                />
                <SocialMessage message={google.message} />
                {apple ? (
                  <>
                    <AppleButton
                      onPress={apple.onPress}
                      loading={apple.busy}
                      height={m.buttonHeight - 4}
                      radius={999}
                    />
                    <SocialMessage message={apple.message} />
                  </>
                ) : null}
                <OutlineButton
                  label={t.createAccount}
                  height={m.buttonHeight - 4}
                  onPress={onCreateAccount}
                />
              </>
            ) : (
              <GlowButton
                label={t.createAccount}
                height={m.buttonHeight}
                onPress={onCreateAccount}
              />
            )}
            <Pressable
              onPress={withHaptics(onSignIn)}
              accessibilityRole="button"
              accessibilityLabel={t.haveAccount}
              hitSlop={8}
              style={({ pressed }) => [styles.link, pressed && styles.pressedText]}
            >
              <Text style={styles.linkText} maxFontSizeMultiplier={1.3}>
                {t.haveAccount}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

/** Sombra usada como brillo: en iOS sigue la forma del contenido; en web/Android sería una caja. */
function iosOnly<T>(style: T): T | null {
  return Platform.OS === 'ios' ? style : null;
}

/** Aviso de cancelación o error debajo del botón de Google o de Apple. */
function SocialMessage({ message }: { message: SocialSignIn['message'] }) {
  if (!message) return null;
  return (
    <Text
      style={[styles.googleMessage, message.tone === 'error' && styles.googleError]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      maxFontSizeMultiplier={1.3}
    >
      {message.text}
    </Text>
  );
}

function withHaptics(fn: () => void) {
  return () => {
    if (Platform.OS !== 'web') void Haptics.selectionAsync();
    fn();
  };
}

function GlowButton({
  label,
  icon,
  height,
  onPress,
  loading = false,
  accessibilityHint,
  testID,
}: {
  label: string;
  icon?: ReactNode;
  height: number;
  onPress: () => void;
  /** Muestra un indicador en lugar del ícono y no acepta toques. */
  loading?: boolean;
  accessibilityHint?: string;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={withHaptics(onPress)}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [styles.glow, pressed && !loading && styles.pressed]}
    >
      <LinearGradient
        colors={welcome.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.pill, styles.primaryPill, { minHeight: height }, loading && styles.loading]}
      >
        {loading ? <ActivityIndicator color={welcome.text} /> : icon}
        <Text style={styles.buttonLabel} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function OutlineButton({
  label,
  height,
  onPress,
}: {
  label: string;
  height: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={withHaptics(onPress)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.pill,
        styles.outlinePill,
        { minHeight: height },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.buttonLabel} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </Pressable>
  );
}

const violetGlow = {
  shadowColor: welcome.glow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 14,
} as const;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: welcome.background[2] },
  content: {
    flexGrow: 1,
    paddingHorizontal: GUTTER,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  brandText: { color: welcome.text, fontSize: 25, fontWeight: '800', letterSpacing: -0.3 },
  brandTextCompact: { fontSize: 22 },
  hero: { alignItems: 'center', justifyContent: 'center' },
  // Lo que sobra en pantallas altas queda entre la imagen y este bloque.
  bottom: { marginTop: 'auto' },
  heroImage: { width: '100%' },
  headline: { alignItems: 'center' },
  headlineGlow: { ...violetGlow, shadowOpacity: 0.55, shadowRadius: 10 },
  subtitle: {
    color: welcome.textSoft,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitleCompact: { fontSize: 13.5, lineHeight: 18 },
  grid: { gap: 8, marginTop: 2 },
  row: { flexDirection: 'row', gap: 10 },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: welcome.cardBorder,
    backgroundColor: welcome.cardFill,
  },
  cardCompact: { paddingVertical: 8, gap: 2 },
  cardActive: {
    ...violetGlow,
    shadowOpacity: 0.7,
    borderWidth: 1.5,
    borderColor: welcome.cardBorderActive,
    backgroundColor: welcome.cardFillActive,
  },
  iconSpace: { marginBottom: 2 },
  iconGlow: { ...violetGlow, shadowColor: welcome.glowPink, shadowRadius: 8 },
  cardTitle: { color: welcome.text, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  cardTitleCompact: { fontSize: 13 },
  cardText: {
    color: welcome.textMuted,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  tagCell: { flex: 1, alignItems: 'center' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: welcome.pillBorder,
    backgroundColor: welcome.pillFill,
    maxWidth: '100%',
  },
  tagText: { color: welcome.text, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  actions: { gap: 8 },
  glow: { ...violetGlow, shadowColor: '#A855F7', shadowRadius: 18, borderRadius: 999 },
  pill: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  primaryPill: { borderWidth: 1, borderColor: welcome.primaryBorder },
  outlinePill: {
    borderWidth: 1.5,
    borderColor: welcome.outlineBorder,
    backgroundColor: welcome.outlineFill,
  },
  buttonLabel: { color: welcome.text, fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  loading: { opacity: 0.85 },
  googleMessage: {
    color: welcome.textSoft,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  googleError: { color: '#FCA5A5' },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: welcome.link, fontSize: 16, fontWeight: '700' },
  pressedText: { opacity: 0.6 },
});
