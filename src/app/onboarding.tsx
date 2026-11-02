import { ChevronLeft, Flame, GraduationCap, Swords } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  AVATARS,
  DAILY_GOALS,
  DEFAULT_AVATAR,
  START_LEVELS,
  TARGET_LANGUAGES,
  nextStartLevel,
  usernameSchema,
  type AvatarId,
  type DailyGoalMinutes,
} from '@shared/profile';

import {
  Avatar,
  Button,
  Card,
  ProgressBar,
  Screen,
  SelectCard,
  Text,
  TextField,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { RankTutorial } from '@/features/onboarding/RankTutorial';
import { isUsernameAvailable } from '@/features/profile/api';
import { useCompleteOnboarding } from '@/features/profile/hooks';
import { toUserMessage } from '@/lib/errors';

const STEPS = ['welcome', 'language', 'level', 'goal', 'username', 'avatar', 'tutorial'] as const;
type Step = (typeof STEPS)[number];

const TITLES: Record<Step, { title: string; subtitle: string }> = {
  welcome: {
    title: '¡Te damos la bienvenida a Polygo!',
    subtitle: 'Antes de arrancar, contanos qué querés estudiar y desde dónde partís.',
  },
  language: { title: '¿Qué idioma querés aprender?', subtitle: 'Por ahora Polygo enseña inglés.' },
  level: {
    title: '¿Cuál es tu nivel?',
    subtitle: 'Tus lecciones van a empezar desde el nivel que elijas.',
  },
  goal: { title: 'Tu objetivo diario', subtitle: 'Podés cambiarlo cuando quieras.' },
  username: { title: 'Elegí tu nombre de jugador', subtitle: 'Así te van a ver tus rivales.' },
  avatar: { title: 'Elegí tu avatar', subtitle: 'Más opciones llegarán con las temporadas.' },
  tutorial: { title: 'Cómo funciona Ranked', subtitle: 'Lo esencial antes de tu primera partida.' },
};

const WELCOME_POINTS = [
  {
    Icon: GraduationCap,
    title: 'Lecciones a tu medida',
    text: 'Arrancás en tu nivel, de A1 a C2.',
  },
  { Icon: Flame, title: 'Un ratito por día', text: 'Sumá racha y no pierdas el ritmo.' },
  { Icon: Swords, title: 'Competí en Ranked', text: 'Enfrentá a otros jugadores y subí de rango.' },
] as const;

const GOAL_LABELS: Record<DailyGoalMinutes, string> = {
  5: 'Casual',
  10: 'Constante',
  15: 'Serio',
  20: 'Intenso',
};

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState<string>('en');
  const [level, setLevel] = useState<string>('A1');
  const [goal, setGoal] = useState<DailyGoalMinutes>(10);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [avatar, setAvatar] = useState<AvatarId>(DEFAULT_AVATAR);
  const complete = useCompleteOnboarding();

  const step = STEPS[stepIndex]!;
  const isLast = stepIndex === STEPS.length - 1;
  const isWelcome = step === 'welcome';
  // El paso de bienvenida no cuenta en la barra de progreso.
  const progress = stepIndex / (STEPS.length - 1);
  const levelInfo = START_LEVELS.find((l) => l.id === level);
  const comingNext = nextStartLevel(level);

  const next = async () => {
    if (step === 'username') {
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        setUsernameError(parsed.error.issues[0]?.message);
        return;
      }
      setCheckingUsername(true);
      try {
        const available = await isUsernameAvailable(parsed.data);
        if (!available) {
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
    }
    if (isLast) {
      // Al completarse, el perfil se invalida y el guard del layout lleva a las tabs.
      complete.mutate({
        username,
        avatarId: avatar,
        targetLanguage: language,
        startLevel: level,
        dailyGoalMinutes: goal,
      });
      return;
    }
    setStepIndex((i) => i + 1);
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
            label={isLast ? 'Empezar a jugar' : isWelcome ? 'Empezar' : 'Continuar'}
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
      </View>

      <Animated.View key={step} entering={FadeIn.duration(250)} style={styles.body}>
        {isWelcome ? (
          <View style={styles.mascot}>
            <Avatar avatarId={DEFAULT_AVATAR} size={120} instant />
          </View>
        ) : null}
        <View style={[styles.header, isWelcome && styles.centered]}>
          <Text variant="title" align={isWelcome ? 'center' : undefined}>
            {TITLES[step].title}
          </Text>
          <Text color="textMuted" align={isWelcome ? 'center' : undefined}>
            {TITLES[step].subtitle}
          </Text>
        </View>

        {isWelcome &&
          WELCOME_POINTS.map(({ Icon, title, text }) => (
            <Card key={title}>
              <View style={styles.point}>
                <Icon color={colors.primaryBright} size={26} />
                <View style={styles.pointText}>
                  <Text variant="bodyStrong">{title}</Text>
                  <Text color="textMuted">{text}</Text>
                </View>
              </View>
            </Card>
          ))}

        {step === 'language' &&
          TARGET_LANGUAGES.map((l) => (
            <SelectCard
              key={l.code}
              title={l.name}
              selected={language === l.code}
              disabled={!l.available}
              badge={l.available ? undefined : 'PRÓXIMAMENTE'}
              onPress={() => setLanguage(l.code)}
            />
          ))}

        {step === 'level' &&
          START_LEVELS.map((l) => (
            <SelectCard
              key={l.id}
              title={`${l.id} · ${l.title}`}
              description={l.description}
              selected={level === l.id}
              disabled={!l.available}
              badge={l.available ? undefined : 'PRÓXIMAMENTE'}
              onPress={() => setLevel(l.id)}
            />
          ))}
        {step === 'level' && levelInfo ? (
          <Text variant="caption" color="textMuted" align="center">
            {level === 'A1'
              ? 'Empezás desde la primera lección de A1.'
              : `Empezás directo en ${level}, sin pasar por los niveles anteriores.`}
            {comingNext && !comingNext.available
              ? ` Los niveles desde ${comingNext.id} llegan pronto.`
              : ''}
          </Text>
        ) : null}

        {step === 'goal' &&
          DAILY_GOALS.map((g) => (
            <SelectCard
              key={g}
              title={`${g} minutos al día`}
              description={GOAL_LABELS[g]}
              selected={goal === g}
              onPress={() => setGoal(g)}
            />
          ))}

        {step === 'username' && (
          <TextField
            label="Nombre de usuario"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setUsernameError(undefined);
            }}
            error={usernameError}
            hint="3 a 20 caracteres: letras minúsculas, números o _"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            onSubmitEditing={() => void next()}
          />
        )}

        {step === 'avatar' && (
          <View style={styles.avatarGrid}>
            {AVATARS.map((a) => (
              <Pressable
                key={a.id}
                accessibilityRole="radio"
                accessibilityLabel={a.name}
                accessibilityState={{ selected: avatar === a.id }}
                onPress={() => setAvatar(a.id)}
                style={[styles.avatarCell, avatar === a.id && styles.avatarSelected]}
              >
                <Avatar avatarId={a.id} size={60} />
              </Pressable>
            ))}
          </View>
        )}

        {step === 'tutorial' && <RankTutorial />}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: 32, height: 44, justifyContent: 'center' },
  hidden: { opacity: 0 },
  progress: { flex: 1 },
  body: { gap: spacing.md },
  header: { gap: spacing.xs, marginVertical: spacing.md },
  centered: { alignItems: 'center' },
  mascot: { alignItems: 'center', marginTop: spacing.xl },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pointText: { flex: 1, gap: 2 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  avatarCell: {
    padding: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceRaised },
});
