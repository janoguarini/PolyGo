import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen, Layers, MessageCircle, Puzzle, Shield, Type, X, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { courseByCode, courseLanguage, type CourseDef } from '@shared/courses';
import {
  PLACEMENT_DIMENSIONS,
  maxQuestions,
  placementProgress,
  type PlacementBank,
  type PlacementDimension,
} from '@shared/placement';

import {
  BrandCard,
  Button,
  EmptyState,
  Mascot,
  ProgressBar,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { SessionLanguageContext } from '@/features/learning/readings';
import { stopSpeaking, useSpeechLanguage } from '@/features/learning/speech';
import { PlacementQuestion } from '@/features/placement/components/PlacementQuestion';
import {
  PlacementResultView,
  type SaveStatus,
} from '@/features/placement/components/PlacementResultView';
import { goToLearn } from '@/features/placement/navigation';
import {
  createSession,
  placementBankFor,
  questionNumber,
  sessionReducer,
  sessionResult,
} from '@/features/placement/session';
import { PlacementUnsupportedError, useStartCourse } from '@/features/placement/startCourse';
import { placementStrings } from '@/features/placement/strings';
import { useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';

/**
 * Test de nivel de un curso nuevo (Fase 4, docs/PLACEMENT_TEST.md): bienvenida, preguntas de a una con
 * progreso y feedback, y el resultado con su nivel estimado. Todo vive en memoria hasta «Comenzar
 * curso»: salir no guarda nada y un error al guardar deja el resultado para reintentar.
 */
export default function PlacementScreen() {
  const t = useStrings(placementStrings);
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = courseByCode(code);
  const bank = course ? placementBankFor(course) : null;

  if (!course || !bank) {
    return (
      <Screen edges={['top', 'bottom']}>
        <EmptyState
          title={t.noTestTitle}
          message={t.noTestMessage}
          actionLabel={t.exitConfirm}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }
  return <PlacementTest course={course} bank={bank} />;
}

function PlacementTest({ course, bank }: { course: CourseDef; bank: PlacementBank }) {
  const styles = useStyles();
  const t = useStrings(placementStrings);
  const languageName = useLanguageName();
  const language = courseLanguage(course);
  const [session, dispatch] = useReducer(sessionReducer, bank, createSession);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const start = useStartCourse();
  const result = sessionResult(session);
  const max = maxQuestions(bank);

  // Las preguntas son del idioma del curso (no del que estudia ahora): voz y textos de ese idioma.
  useSpeechLanguage(course.target);
  useEffect(() => stopSpeaking, []);
  // En chino, el pinyin viaja con el banco (bank.readings): todavía no hay banco de palabras del curso.
  const languageContext = useMemo(() => {
    const readings = bank.readings ? new Map(Object.entries(bank.readings)) : null;
    return { language, readings, showReadings: readings !== null, setShowReadings: () => {} };
  }, [language, bank.readings]);

  const inTest = session.phase === 'question' || session.phase === 'feedback';
  const leave = () => {
    if (!inTest) {
      router.back();
      return;
    }
    Alert.alert(t.exitTitle, t.exitMessage, [
      { text: t.exitCancel, style: 'cancel' },
      { text: t.exitConfirm, style: 'destructive', onPress: () => router.back() },
    ]);
  };

  // Nivel elegido en el último intento de guardar (el reintento repite la misma elección).
  const [chosen, setChosen] = useState<string | null>(null);
  const save = (startLevel: string) => {
    if (!result || start.isPending) return;
    setChosen(startLevel);
    setStatus('saving');
    start.mutate(
      {
        course,
        startLevel,
        placement: {
          level: result.level,
          correct: result.correct,
          total: result.answered,
          version: result.version,
        },
      },
      {
        onSuccess: (outcome) => {
          setStatus('idle');
          if (!outcome.created) {
            Alert.alert(t.alreadyTitle, t.alreadyMessage(outcome.startLevel), [
              { text: t.ok, onPress: goToLearn },
            ]);
            return;
          }
          goToLearn();
        },
        onError: (error) =>
          setStatus(error instanceof PlacementUnsupportedError ? 'unsupported' : 'error'),
      },
    );
  };

  // Sin la migración del test sólo se puede empezar desde A1 sin guardar el resultado.
  const startFromA1 = () => {
    if (status !== 'unsupported') {
      save(bank.levels[0]!.level);
      return;
    }
    setStatus('saving');
    start.mutate(
      { course, startLevel: bank.levels[0]!.level, placement: null },
      { onSuccess: goToLearn, onError: () => setStatus('unsupported') },
    );
  };

  let body: ReactNode;
  if (session.phase === 'intro') {
    body = (
      <Intro
        title={t.title(languageName(course.target))}
        flag={language.flag}
        max={max}
        onStart={() => dispatch({ type: 'start' })}
      />
    );
  } else if (result) {
    body = (
      <PlacementResultView
        result={result}
        bank={bank}
        status={status}
        onStart={() => save(status === 'error' && chosen ? chosen : result.level)}
        onStartFromA1={startFromA1}
        onRetake={() => {
          setStatus('idle');
          setChosen(null);
          dispatch({ type: 'restart' });
        }}
      />
    );
  } else {
    body = (
      <PlacementQuestion session={session} dispatch={dispatch} seed={`placement:${course.code}`} />
    );
  }

  return (
    <SessionLanguageContext.Provider value={languageContext}>
      <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.top}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.exit}
              onPress={leave}
              hitSlop={12}
              style={styles.close}
            >
              <X color={colors.textMuted} size={26} />
            </Pressable>
            <View style={styles.flex}>
              {inTest ? (
                <ProgressBar
                  value={placementProgress(session.test)}
                  height={10}
                  accessibilityLabel={t.progress(questionNumber(session), max)}
                />
              ) : (
                <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
                  {t.title(languageName(course.target))}
                </Text>
              )}
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {body}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SessionLanguageContext.Provider>
  );
}

const DIMENSION_ICONS: Record<PlacementDimension, typeof Type> = {
  vocabulary: Type,
  grammar: Puzzle,
  sentences: BookOpen,
  structures: Layers,
  context: MessageCircle,
};

function Intro({
  title,
  flag,
  max,
  onStart,
}: {
  title: string;
  flag: string;
  max: number;
  onStart: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(placementStrings);
  return (
    <View style={styles.intro}>
      <Animated.View entering={FadeInDown.duration(320)}>
        <BrandCard glow highlight contentStyle={styles.introHero}>
          <Mascot pose="wave" height={120} />
          <Text variant="overline" color="gold">
            {t.introOverline}
          </Text>
          <Text variant="display" color="textStrong" align="center" accessibilityRole="header">
            {t.introTitle}
          </Text>
          <Text color="text" align="center">
            {flag} {title}
          </Text>
          <Text color="text" align="center">
            {t.introBody}
          </Text>
        </BrandCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.card}>
        <Text variant="overline">{t.whatWeCheck}</Text>
        <View style={styles.dimensions}>
          {PLACEMENT_DIMENSIONS.map((d) => {
            const Icon = DIMENSION_ICONS[d];
            return (
              <View key={d} style={styles.dimension}>
                <Icon color={colors.primaryBright} size={16} />
                <Text variant="caption" color="textStrong">
                  {t.dimension(d)}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.rules}>
        <Rule icon={<Zap color={colors.gold} size={18} />} text={t.ruleHarder} />
        <Rule icon={<Shield color={colors.success} size={18} />} text={t.ruleStop} />
        <Rule icon={<Shield color={colors.primarySoft} size={18} />} text={t.ruleSafe} />
      </Animated.View>

      <View style={styles.introFooter}>
        <Text variant="caption" align="center">
          {t.duration(max)}
        </Text>
        <Button label={t.startChallenge} size="lg" onPress={onStart} />
      </View>
    </View>
  );
}

function Rule({ icon, text }: { icon: ReactNode; text: string }) {
  const styles = useStyles();
  return (
    <View style={styles.rule}>
      {icon}
      <Text variant="caption" color="text" style={styles.flex}>
        {text}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    fill: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    close: { width: 32, height: 44, justifyContent: 'center' },
    content: { padding: spacing.xl, paddingTop: spacing.md, gap: spacing.xl, flexGrow: 1 },
    intro: { flex: 1, gap: spacing.lg },
    introHero: { alignItems: 'center', gap: spacing.sm },
    card: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dimensions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    dimension: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
    },
    rules: { gap: spacing.sm },
    rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    introFooter: { marginTop: 'auto', gap: spacing.sm },
  }),
);
