import { router } from 'expo-router';
import { BookOpen, Flame, Layers, Sparkles, Swords } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { SpeakButton } from '@/features/learning/components/SpeakButton';
import { useCurriculum, useLearningSummary, useWordOfTheDay } from '@/features/learning/hooks';
import { useMyProfile } from '@/features/profile/hooks';
import { RankCard } from '@/features/ranked/RankCard';

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 13) return 'Buen día';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const me = useMyProfile();
  const summary = useLearningSummary();
  const curriculum = useCurriculum();
  const wordOfDay = useWordOfTheDay();

  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;
  const { profile, rating } = me.data;
  const next = curriculum.data?.current ?? null;
  const goalSeconds = profile.daily_goal_minutes * 60;
  const todaySeconds = summary.data?.today_seconds ?? 0;

  const refresh = () => {
    void me.refetch();
    void summary.refetch();
    void curriculum.refetch();
  };

  return (
    <Screen onRefresh={refresh} refreshing={me.isRefetching || summary.isRefetching}>
      <View style={styles.header}>
        <Avatar avatarId={profile.avatar_id} size={48} />
        <View style={styles.headerText}>
          <Text variant="caption">{greeting()},</Text>
          <Text variant="heading" numberOfLines={1}>
            {profile.display_name ?? profile.username}
          </Text>
        </View>
        <View
          style={styles.streak}
          accessible
          accessibilityLabel={`Racha de ${summary.data?.streak_days ?? 0} días`}
        >
          <Flame color={summary.data?.active_today ? colors.streak : colors.textSubtle} size={22} />
          <Text variant="heading" color={summary.data?.active_today ? 'streak' : 'textMuted'}>
            {summary.data?.streak_days ?? 0}
          </Text>
        </View>
      </View>

      {rating ? <RankCard rating={rating} /> : null}

      <Button
        label="Jugar Ranked"
        size="lg"
        icon={<Swords color={colors.onPrimary} size={20} />}
        onPress={() => router.navigate('/ranked')}
      />

      <Card
        onPress={
          next
            ? () => router.push({ pathname: '/lesson/[id]', params: { id: next.id } })
            : () => router.navigate('/learn')
        }
        accessibilityLabel={next ? `Lección diaria: ${next.title}` : 'Ver lecciones'}
        style={styles.gap}
      >
        <View style={styles.row}>
          <BookOpen color={colors.info} size={22} />
          <View style={styles.flex}>
            <Text variant="overline">LECCIÓN DIARIA</Text>
            <Text variant="bodyStrong" color="textStrong">
              {next
                ? next.title
                : curriculum.isPending
                  ? 'Cargando…'
                  : '¡Completaste todas las lecciones disponibles!'}
            </Text>
            {next ? <Text variant="caption">{next.objective}</Text> : null}
          </View>
        </View>
        <ProgressBar
          value={goalSeconds ? todaySeconds / goalSeconds : 0}
          accessibilityLabel="Objetivo diario"
        />
        <Text variant="caption">
          {Math.min(profile.daily_goal_minutes, Math.floor(todaySeconds / 60))} de{' '}
          {profile.daily_goal_minutes} min de tu objetivo diario
        </Text>
      </Card>

      <Card
        onPress={() => router.push('/review')}
        accessibilityLabel={`${summary.data?.words_due ?? 0} palabras para repasar`}
        style={styles.row}
      >
        <Layers color={colors.primarySoft} size={22} />
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong">
            {summary.data?.words_due
              ? `${summary.data.words_due} palabras para repasar`
              : 'Sin repasos pendientes'}
          </Text>
          <Text variant="caption">
            {summary.data
              ? `${summary.data.words_mastered} dominadas · ${summary.data.words_seen} estudiadas`
              : ' '}
          </Text>
        </View>
      </Card>

      {wordOfDay.data ? (
        <Card style={styles.gap}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Sparkles color={colors.gold} size={18} />
              <Text variant="overline" color="gold">
                PALABRA DEL DÍA
              </Text>
            </View>
            <SpeakButton text={wordOfDay.data.text} />
          </View>
          <Text variant="title">
            {wordOfDay.data.emoji ? `${wordOfDay.data.emoji} ` : ''}
            {wordOfDay.data.text}
          </Text>
          <Text color="textMuted">
            {wordOfDay.data.ipa} · {wordOfDay.data.translation_es}
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flex: { flex: 1, gap: spacing.xxs },
  gap: { gap: spacing.md },
});
