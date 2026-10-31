import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { ErrorState, LoadingState, Screen, Text, colors, spacing } from '@/design-system';
import { LearningStats } from '@/features/learning/components/LearningStats';
import { AchievementsCarousel } from '@/features/profile/components/AchievementsCarousel';
import { CompetitiveHistory } from '@/features/profile/components/CompetitiveHistory';
import { LanguagesRow } from '@/features/profile/components/LanguagesRow';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { CareerStats, PeriodStats } from '@/features/profile/components/ProfileStats';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { useMyProfile } from '@/features/profile/hooks';

/** Perfil propio: identidad y rango, estadísticas, idiomas, logros y aprendizaje. */
export default function ProfileScreen() {
  const { data, isPending, isError, refetch, isRefetching } = useMyProfile();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { profile, rating } = data;

  return (
    <Screen scrollRef={scrollRef} onRefresh={() => void refetch()} refreshing={isRefetching}>
      <View style={styles.topBar}>
        <Text variant="title">Perfil</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajustes"
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={styles.gear}
        >
          <Settings color={colors.text} size={24} />
        </Pressable>
      </View>

      <ProfileHeader profile={profile} rating={rating} />
      <CareerStats rating={rating} />

      <SectionHeader title="Idiomas" />
      <LanguagesRow current={profile.target_language} />

      <PeriodStats />

      <SectionHeader
        title="Logros"
        action={{ label: 'Ver todos', onPress: () => router.push('/achievements') }}
      />
      <AchievementsCarousel />

      <SectionHeader title="Aprendizaje" />
      <LearningStats level={profile.start_level} />

      {rating ? (
        <>
          <SectionHeader title="Historial competitivo" />
          <CompetitiveHistory />
        </>
      ) : null}
    </Screen>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.section}>
      <Text variant="heading">{title}</Text>
      {action ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={action.onPress}>
          <Text variant="bodyStrong" color="primarySoft">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  gear: { minWidth: 44, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});
