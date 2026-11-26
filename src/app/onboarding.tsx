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
import { isUsernameAvailable } from '@/features/profile/api';
import { useCompleteOnboarding } from '@/features/profile/hooks';
import { useUsernameCheck } from '@/features/profile/useUsernameCheck';
import { toUserMessage } from '@/lib/errors';
import { track } from '@/lib/analytics';
import { playSound } from '@/lib/sounds';

/**
 * Registro gamificado: el zorro pregunta en un globito, cada opción es una tarjeta visual (banderas,
 * emojis, barras de nivel) que rebota y vibra al elegirla, y al final armás tu tarjeta de jugador. El
 * avatar va antes que el nombre para que la tarjeta se vea completa mientras escribís.
 */
const STEPS = ['welcome', 'language', 'level', 'goal', 'avatar', 'username'] as const;
type Step = (typeof STEPS)[number];

const BUBBLES: Record<
  Exclude<Step, 'welcome'>,
  { pose: MascotPose; title: string; hint?: string }
> = {
  language: { pose: 'thinking', title: '¿Qué idioma querés aprender?' },
  level: { pose: 'pointDown', title: '¿Cuánto sabés ya?', hint: 'Empezás desde ese nivel.' },
  goal: {
    pose: 'pointUp',
    title: '¿Cuánto vas a entrenar por día?',
    hint: 'Lo cambiás cuando quieras.',
  },
  avatar: { pose: 'wave', title: '¡Elegí tu look!' },
  username: { pose: 'pointDown', title: '¿Cómo te van a ver tus rivales?' },
};

/** Emoji y fuerza (1–6 barras) de cada nivel. */
const LEVEL_ART: Record<string, { emoji: string; accent: string }> = {
  A1: { emoji: '🐣', accent: '#4ADE80' },
  A2: { emoji: '🌱', accent: '#22D3EE' },
  B1: { emoji: '🚀', accent: '#38BDF8' },
  B2: { emoji: '🔥', accent: '#C084FC' },
  C1: { emoji: '💎', accent: '#F472B6' },
  C2: { emoji: '👑', accent: '#FACC15' },
};

const GOAL_ART: Record<DailyGoalMinutes, { emoji: string; label: string; accent: string }> = {
  5: { emoji: '🐢', label: 'Casual', accent: '#4ADE80' },
  10: { emoji: '🏃', label: 'Constante', accent: '#38BDF8' },
  15: { emoji: '⚡', label: 'Serio', accent: '#C084FC' },
  20: { emoji: '🔥', label: 'Intenso', accent: '#FB923C' },
};

const ONBOARDING_LANGUAGES = VISIBLE_LANGUAGES.filter(
  (l) => defaultCourseFor(l.code).source === 'es',
);

export default function OnboardingScreen() {
  const styles = useStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState<string>('en');
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
  const lang = languageConfig(language);
  const levelOpen = (id: string, available: boolean) => available && lang.levels.includes(id);
  const comingNext = nextStartLevel(level);

  // Embudo del registro: en qué paso se va la gente.
  useEffect(() => {
    track('onboarding_step_viewed', { step, index: stepIndex });
  }, [step, stepIndex]);

  const next = async () => {
    if (step === 'username') {
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setUsernameError(parsed.error.issues[0]?.message);
        return;
      }
      setCheckingUsername(true);
      try {
        const available = await isUsernameAvailable(parsed.data);
        if (!available) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setUsernameError('Ese nombre ya está en uso.');
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
          targetLanguage: language,
          startLevel: level,
          dailyGoalMinutes: goal,
        },
        {
          onSuccess: () => {
            track('onboarding_completed', {
              language,
              level,
              daily_goal_minutes: goal,
              suggested_username: usedSuggestion,
            });
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
            label={isLast ? '¡Empezar a jugar! 🎮' : isWelcome ? '¡Empecemos! 🚀' : 'Continuar'}
            size="lg"
            loading={checkingUsername || complete.isPending}
            onPress={() => void next()}
          />
        </>
      }
    >
      <View style={[styles.topBar, isWelcome && styles.hidden]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Paso anterior"
          disabled={isWelcome}
          onPress={() => setStepIndex((i) => Math.max(0, i - 1))}
          style={styles.back}
          hitSlop={12}
        >
          <ChevronLeft color={colors.text} size={26} />
        </Pressable>
        <View style={styles.progress}>
          <ProgressBar value={progress} accessibilityLabel="Progreso del registro" />
        </View>
        <Text variant="caption" color="textMuted">
          {stepIndex}/{STEPS.length - 1}
        </Text>
      </View>

      {/* Las poses quedan cargadas desde el primer paso: cambiar de pantalla es inmediato. */}
      <MascotWarmup />
      <Animated.View key={step} entering={FadeInRight.springify().damping(16)} style={styles.body}>
        {isWelcome ? <WelcomeHero /> : <MascotBubble {...BUBBLES[step]} />}

        {step === 'language' && (
          // Al registrarse se eligen los idiomas disponibles para todos (los beta, sólo desde Perfil).
          // Este registro está en español: sólo los cursos que se enseñan desde el español.
          <View style={styles.grid}>
            {ONBOARDING_LANGUAGES.map((l, i) => (
              <Animated.View
                key={l.code}
                entering={FadeInDown.delay(80 + i * 60).springify()}
                style={styles.half}
              >
                <OptionTile
                  accessibilityLabel={l.name}
                  selected={language === l.code}
                  disabled={!isSelectable(l, false)}
                  onPress={() => {
                    setLanguage(l.code);
                    if (!languageConfig(l.code).levels.includes(level)) setLevel('A1');
                  }}
                  contentStyle={styles.langTile}
                >
                  <RNText style={styles.flag}>{l.flag}</RNText>
                  <Text variant="bodyStrong" color="textStrong">
                    {l.name}
                  </Text>
                </OptionTile>
              </Animated.View>
            ))}
          </View>
        )}

        {step === 'level' && (
          <View style={styles.list}>
            {START_LEVELS.map((l, i) => {
              const open = levelOpen(l.id, l.available);
              const art = LEVEL_ART[l.id] ?? { emoji: '⭐', accent: '#8B5CF6' };
              return (
                <Animated.View key={l.id} entering={FadeInDown.delay(60 + i * 50).springify()}>
                  <OptionTile
                    accessibilityLabel={`${l.id}, ${l.title}`}
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
                          {l.title}
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
                🔒 Los niveles desde {comingNext.id} llegan pronto.
              </Text>
            ) : null}
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.grid}>
            {DAILY_GOALS.map((g, i) => {
              const art = GOAL_ART[g];
              return (
                <Animated.View
                  key={g}
                  entering={FadeInDown.delay(80 + i * 70).springify()}
                  style={styles.half}
                >
                  <OptionTile
                    accessibilityLabel={`${g} minutos al día, ${art.label}`}
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
                        min
                      </Text>
                    </Text>
                    <Text variant="overline" style={{ color: art.accent }}>
                      {art.label.toUpperCase()}
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
              languageName={lang.name}
              level={level}
              goal={goal}
            />
            <UsernameField
              value={username}
              onChange={(t) => {
                // Tocar una sugerencia (si ya existe el nombre) también se mide.
                const picked = nameCheck.suggestions.includes(t);
                if (picked) track('username_suggestion_used');
                setUsedSuggestion(picked);
                setUsername(t);
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
  }),
);
