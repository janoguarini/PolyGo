import * as Haptics from 'expo-haptics';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import {
  DAILY_GOALS,
  START_LEVELS,
  nextStartLevel,
  usernameSchema,
  type DailyGoalMinutes,
} from '@shared/profile';
import { defaultCourseFor } from '@shared/courses';
import { VISIBLE_LANGUAGES, isSelectable, languageConfig } from '@shared/languages';

import {
  Button,
  MascotWarmup,
  ProgressBar,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
  type MascotPose,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { MascotBubble } from '@/features/onboarding/signup/MascotBubble';
import { OptionTile } from '@/features/onboarding/signup/OptionTile';
import { PlayerCard } from '@/features/onboarding/signup/PlayerCard';
import { STARTER_SKIN, SkinPicker } from '@/features/onboarding/signup/SkinPicker';
import { UsernameField } from '@/features/onboarding/signup/UsernameField';
import { WelcomeHero } from '@/features/onboarding/signup/WelcomeHero';
import { useChooseInterfaceLanguage } from '@/features/courses/hooks';
import { signupStrings } from '@/features/onboarding/signup/strings';
import { isUsernameAvailable } from '@/features/profile/api';
import { useCompleteOnboarding } from '@/features/profile/hooks';
import { useUsernameCheck } from '@/features/profile/useUsernameCheck';
import {
  INTERFACE_LANGUAGES,
  INTERFACE_LANGUAGE_FLAGS,
  INTERFACE_LANGUAGE_LABELS,
  LOCALES,
  setInterfaceLanguage,
  useInterfaceLanguage,
  useStrings,
  type InterfaceLanguage,
} from '@/i18n';
import { useLanguageName } from '@/i18n/languages';
import { toUserMessage } from '@/lib/errors';
import { track } from '@/lib/analytics';
import { metaRegistration, requestTracking } from '@/lib/metaEvents';
import { playSound } from '@/lib/sounds';

/**
 * Registro gamificado: el zorro pregunta en un globito, cada opción es una tarjeta visual (banderas,
 * emojis, barras de nivel) que rebota y vibra al elegirla, y al final armás tu tarjeta de jugador. El
 * avatar va antes que el nombre para que la tarjeta se vea completa mientras escribís.
 *
 * Todo el texto sale de signupStrings en el idioma de la interfaz, que se puede cambiar en la
 * bienvenida (arranca con el del teléfono). El idioma a aprender no viene elegido de antemano.
 */
const STEPS = ['welcome', 'language', 'level', 'goal', 'avatar', 'username'] as const;
type Step = (typeof STEPS)[number];

const POSES: Record<Exclude<Step, 'welcome'>, MascotPose> = {
  language: 'thinking',
  level: 'pointDown',
  goal: 'pointUp',
  avatar: 'wave',
  username: 'pointDown',
};

/** Idioma de los cursos que coincide con el de la interfaz (no se ofrece aprender el propio). */
const OWN_LANGUAGE: Record<InterfaceLanguage, string> = {
  es: 'es',
  en: 'en',
  'pt-BR': 'pt',
  it: 'it',
};

/**
 * Idiomas que se muestran al registrarse con la interfaz en `ui`: todos los visibles menos el propio
 * (los «Próximamente» se ven bloqueados; los beta, sólo desde Perfil). Cada curso dice en qué idioma
 * se explica cuando no es el de la interfaz.
 */
export function onboardingLanguages(ui: InterfaceLanguage) {
  return VISIBLE_LANGUAGES.filter((l) => l.code !== OWN_LANGUAGE[ui]);
}

/** Emoji y fuerza (1–6 barras) de cada nivel. */
const LEVEL_ART: Record<string, { emoji: string; accent: string }> = {
  A1: { emoji: '🐣', accent: '#4ADE80' },
  A2: { emoji: '🌱', accent: '#22D3EE' },
  B1: { emoji: '🚀', accent: '#38BDF8' },
  B2: { emoji: '🔥', accent: '#C084FC' },
  C1: { emoji: '💎', accent: '#F472B6' },
  C2: { emoji: '👑', accent: '#FACC15' },
};

const GOAL_ART: Record<DailyGoalMinutes, { emoji: string; accent: string }> = {
  5: { emoji: '🐢', accent: '#4ADE80' },
  10: { emoji: '🏃', accent: '#38BDF8' },
  15: { emoji: '⚡', accent: '#C084FC' },
  20: { emoji: '🔥', accent: '#FB923C' },
};

export default function OnboardingScreen() {
  const styles = useStyles();
  const t = useStrings(signupStrings);
  const ui = useInterfaceLanguage();
  const languageName = useLanguageName();
  const chooseLanguage = useChooseInterfaceLanguage();
  // Dentro de una frase el idioma va en minúscula salvo en inglés («Explicado en español»).
  const inSentence = (name: string) => (ui === 'en' ? name : name.toLocaleLowerCase(LOCALES[ui]));
  const [stepIndex, setStepIndex] = useState(0);
  // Sin idioma preelegido: nadie viene a aprender inglés por defecto.
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<string>('A1');
  const [goal, setGoal] = useState<DailyGoalMinutes>(10);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [checkingUsername, setCheckingUsername] = useState(false);
  // En vivo mientras escribís: tilde verde si está libre, 3 parecidos si ya existe.
  const nameCheck = useUsernameCheck(username);
  const [usedSuggestion, setUsedSuggestion] = useState(false);
  const avatar = STARTER_SKIN;
  const complete = useCompleteOnboarding();

  const step = STEPS[stepIndex]!;
  const isLast = stepIndex === STEPS.length - 1;
  const isWelcome = step === 'welcome';
  // El paso de bienvenida no cuenta en la barra de progreso.
  const progress = stepIndex / (STEPS.length - 1);
  // En cada idioma sólo se elige un nivel con contenido.
  const choices = onboardingLanguages(ui);
  // Si se cambia el idioma de la app y el elegido deja de ofrecerse (p. ej. Italiano → interfaz it).
  const chosen =
    language && choices.some((l) => l.code === language && isSelectable(l, false))
      ? language
      : null;
  const lang = languageConfig(chosen);
  const levelOpen = (id: string, available: boolean) => available && lang.levels.includes(id);
  const comingNext = nextStartLevel(level);
  const canContinue = step !== 'language' || chosen !== null;
  const bubble = isWelcome
    ? null
    : {
        pose: POSES[step],
        title: t.bubbles[step],
        hint:
          step === 'level' ? t.bubbles.levelHint : step === 'goal' ? t.bubbles.goalHint : undefined,
      };

  // Embudo del registro: en qué paso se va la gente.
  useEffect(() => {
    track('onboarding_step_viewed', { step, index: stepIndex });
  }, [step, stepIndex]);

  const next = async () => {
    if (step === 'username') {
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // La regla es la de shared/profile (en español): se muestra la traducida.
        setUsernameError(t.usernameRule);
        return;
      }
      if (!chosen) return;
      setCheckingUsername(true);
      try {
        const available = await isUsernameAvailable(parsed.data);
        if (!available) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setUsernameError(t.usernameTaken);
          return;
        }
        setUsername(parsed.data);
      } catch (e) {
        setUsernameError(toUserMessage(e));
        return;
      } finally {
        setCheckingUsername(false);
      }
      // Al completarse, el perfil se invalida y el guard del layout lleva a las tabs.
      complete.mutate(
        {
          username: parsed.data,
          avatarId: avatar,
          targetLanguage: chosen,
          startLevel: level,
          dailyGoalMinutes: goal,
        },
        {
          onSuccess: () => {
            track('onboarding_completed', {
              language: chosen,
              level,
              daily_goal_minutes: goal,
              suggested_username: usedSuggestion,
              interface_language: ui,
            });
            // Meta Ads: cuenta creada, y en iOS el aviso de rastreo (una vez, ya dentro de la app).
            void metaRegistration();
            setTimeout(() => void requestTracking(), 1500);
            // El idioma de la app queda en el perfil: así el servidor escribe los push en ese idioma.
            // Si falla (sin conexión, o pt-BR / it sin la migración), queda pendiente y se reintenta.
            void chooseLanguage(ui);
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            playSound('complete');
          },
        },
      );
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          {complete.isError ? (
            <FormMessage tone="error" message={toUserMessage(complete.error)} />
          ) : null}
          <Button
            label={isLast ? t.finish : isWelcome ? t.start : t.next}
            size="lg"
            disabled={!canContinue}
            loading={checkingUsername || complete.isPending}
            onPress={() => void next()}
          />
        </>
      }
    >
      <View style={[styles.topBar, isWelcome && styles.hidden]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.back}
          disabled={isWelcome}
          onPress={() => setStepIndex((i) => Math.max(0, i - 1))}
          style={styles.back}
          hitSlop={12}
        >
          <ChevronLeft color={colors.text} size={26} />
        </Pressable>
        <View style={styles.progress}>
          <ProgressBar value={progress} accessibilityLabel={t.progressA11y} />
        </View>
        <Text variant="caption" color="textMuted">
          {stepIndex}/{STEPS.length - 1}
        </Text>
      </View>

      {/* Las poses quedan cargadas desde el primer paso: cambiar de pantalla es inmediato. */}
      <MascotWarmup />
      <Animated.View key={step} entering={FadeInRight.springify().damping(16)} style={styles.body}>
        {bubble ? <MascotBubble {...bubble} /> : <WelcomeHero />}

        {isWelcome && (
          // Idioma de la app: arranca con el del teléfono y cambia todo el registro al instante.
          <View style={styles.uiLanguages}>
            <Text variant="overline" color="textMuted" align="center">
              {t.appLanguage}
            </Text>
            <View style={styles.uiChips}>
              {INTERFACE_LANGUAGES.map((id) => (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ui === id }}
                  accessibilityLabel={t.appLanguageA11y(INTERFACE_LANGUAGE_LABELS[id])}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    void setInterfaceLanguage(id);
                  }}
                  style={[styles.uiChip, ui === id && styles.uiChipSelected]}
                >
                  <RNText style={styles.uiFlag}>{INTERFACE_LANGUAGE_FLAGS[id]}</RNText>
                  <Text variant="caption" color="textStrong">
                    {INTERFACE_LANGUAGE_LABELS[id]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 'language' && (
          // Al registrarse se eligen los idiomas disponibles para todos (los beta, sólo desde Perfil).
          <View style={styles.grid}>
            {choices.map((l, i) => {
              const name = languageName(l.code);
              const source = defaultCourseFor(l.code).source;
              const explained =
                source !== OWN_LANGUAGE[ui] ? t.taughtFrom(inSentence(languageName(source))) : null;
              return (
                <Animated.View
                  key={l.code}
                  entering={FadeInDown.delay(80 + i * 60).springify()}
                  style={styles.half}
                >
                  <OptionTile
                    accessibilityLabel={explained ? `${name}, ${explained}` : name}
                    selected={chosen === l.code}
                    disabled={!isSelectable(l, false)}
                    onPress={() => {
                      setLanguage(l.code);
                      if (!languageConfig(l.code).levels.includes(level)) setLevel('A1');
                    }}
                    contentStyle={styles.langTile}
                  >
                    <RNText style={styles.flag}>{l.flag}</RNText>
                    <Text variant="bodyStrong" color="textStrong">
                      {name}
                    </Text>
                    {explained ? (
                      <Text variant="caption" color="textMuted" align="center">
                        {explained}
                      </Text>
                    ) : null}
                  </OptionTile>
                </Animated.View>
              );
            })}
          </View>
        )}

        {step === 'level' && (
          <View style={styles.list}>
            {START_LEVELS.map((l, i) => {
              const open = levelOpen(l.id, l.available);
              const art = LEVEL_ART[l.id] ?? { emoji: '⭐', accent: '#8B5CF6' };
              const title = t.levelTitles[l.id] ?? l.title;
              return (
                <Animated.View key={l.id} entering={FadeInDown.delay(60 + i * 50).springify()}>
                  <OptionTile
                    accessibilityLabel={`${l.id}, ${title}`}
                    selected={level === l.id}
                    disabled={!open}
                    accent={art.accent}
                    onPress={() => setLevel(l.id)}
                    contentStyle={styles.levelTile}
                  >
                    <View style={[styles.emojiBubble, { backgroundColor: `${art.accent}26` }]}>
                      <RNText style={styles.levelEmoji}>{art.emoji}</RNText>
                    </View>
                    <View style={styles.levelTexts}>
                      <View style={styles.levelHead}>
                        <View style={[styles.levelId, { backgroundColor: art.accent }]}>
                          <Text variant="overline" style={styles.levelIdText}>
                            {l.id}
                          </Text>
                        </View>
                        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
                          {title}
                        </Text>
                      </View>
                      <Bars filled={i + 1} total={START_LEVELS.length} color={art.accent} />
                    </View>
                  </OptionTile>
                </Animated.View>
              );
            })}
            {comingNext && !levelOpen(comingNext.id, comingNext.available) ? (
              <Text variant="caption" color="textMuted" align="center">
                {t.levelsSoon(comingNext.id)}
              </Text>
            ) : null}
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.grid}>
            {DAILY_GOALS.map((g, i) => {
              const art = GOAL_ART[g];
              const label = t.goals[g] ?? String(g);
              return (
                <Animated.View
                  key={g}
                  entering={FadeInDown.delay(80 + i * 70).springify()}
                  style={styles.half}
                >
                  <OptionTile
                    accessibilityLabel={t.goalA11y(g, label)}
                    selected={goal === g}
                    accent={art.accent}
                    onPress={() => setGoal(g)}
                    contentStyle={styles.goalTile}
                  >
                    <RNText style={styles.goalEmoji}>{art.emoji}</RNText>
                    <Text variant="stat" color="textStrong">
                      {g}
                      <Text variant="bodyStrong" color="textMuted">
                        {' '}
                        {t.minutes}
                      </Text>
                    </Text>
                    <Text variant="overline" style={{ color: art.accent }}>
                      {label.toLocaleUpperCase(LOCALES[ui])}
                    </Text>
                    <RNText style={styles.flames} accessible={false}>
                      {'🔥'.repeat(i + 1)}
                    </RNText>
                  </OptionTile>
                </Animated.View>
              );
            })}
          </View>
        )}

        {step === 'avatar' && <SkinPicker selected={avatar} />}

        {step === 'username' && (
          <View style={styles.list}>
            <PlayerCard
              avatarId={avatar}
              username={username}
              flag={lang.flag}
              languageName={chosen ? languageName(chosen) : ''}
              level={level}
              goal={goal}
            />
            <UsernameField
              value={username}
              onChange={(text) => {
                // Tocar una sugerencia (si ya existe el nombre) también se mide.
                const picked = nameCheck.suggestions.includes(text);
                if (picked) track('username_suggestion_used');
                setUsedSuggestion(picked);
                setUsername(text);
                setUsernameError(undefined);
              }}
              check={nameCheck}
              submitError={usernameError}
              onSubmit={() => void next()}
            />
          </View>
        )}
      </Animated.View>
    </Screen>
  );
}

/** Barras de intensidad (como la señal del teléfono): cuánto del idioma ya manejás. */
function Bars({ filled, total, color }: { filled: number; total: number; color: string }) {
  const styles = useStyles();
  return (
    <View style={styles.bars} accessible={false}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: 6 + i * 3 },
            i < filled ? { backgroundColor: color } : styles.barEmpty,
          ]}
        />
      ))}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    back: { width: 32, height: 44, justifyContent: 'center' },
    hidden: { opacity: 0 },
    progress: { flex: 1 },
    body: { gap: spacing.md },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    half: { width: '47.5%', flexGrow: 1 },
    list: { gap: spacing.md },
    langTile: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
    flag: { fontSize: 52, lineHeight: 62 },
    levelTile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    emojiBubble: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelEmoji: { fontSize: 28, lineHeight: 34 },
    levelTexts: { flex: 1, gap: spacing.sm, paddingRight: spacing.xxxl },
    levelHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    levelId: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.sm },
    levelIdText: { color: '#13102A' },
    bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
    bar: { width: 10, borderRadius: 3 },
    barEmpty: { backgroundColor: colors.surfaceHighlight },
    goalTile: { alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.xl },
    goalEmoji: { fontSize: 44, lineHeight: 54 },
    flames: { fontSize: 14, lineHeight: 18, marginTop: spacing.xs },
    uiLanguages: { gap: spacing.sm },
    uiChips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
    uiChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: 44,
      paddingHorizontal: spacing.md,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: colors.brandBorder,
      backgroundColor: colors.surfaceRaised,
    },
    uiChipSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
    uiFlag: { fontSize: 18, lineHeight: 22 },
  }),
);
