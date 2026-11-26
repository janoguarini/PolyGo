import { useRef } from 'react';
import { StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { ErrorState, LoadingState, Screen, Text, spacing, useTheme } from '@/design-system';
import { AdminEntryCard } from '@/features/admin/AdminEntryCard';
import { useAuth } from '@/features/auth/AuthProvider';
import { LearningStats } from '@/features/learning/components/LearningStats';
import { usePrefetchLanguagePaths } from '@/features/profile/components/LanguagesRow';
import { CompetitiveHistory } from '@/features/profile/components/CompetitiveHistory';
import { ProfileHeader, RankSummaryCard } from '@/features/profile/components/ProfileHeader';
import {
  AchievementsCard,
  LanguagesCard,
  NextGoalsCard,
  PlusCard,
  ProfileTopBar,
  StatsRow,
} from '@/features/profile/components/ProfileSections';
import { PeriodStats } from '@/features/profile/components/ProfileStats';
import { useMyProfile } from '@/features/profile/hooks';
import { useXp } from '@/features/xp/api';
import { PlayerTitle } from '@/features/xp/PlayerTitle';
import { PlayerXpPanel } from '@/features/xp/PlayerXpPanel';
import { xpPreview } from '@/features/xp/previewGate';
import { xpOrStart } from '@/features/xp/startingXp';
import { useTitleChoice } from '@/features/xp/titles';
import { useLanguageStartLevel } from '@/features/courses/hooks';
import { useStrings } from '@/i18n';
import { profileScreenStrings } from '@/i18n/screens/profile';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/**
 * Perfil propio (Perfil 2.0), en orden de prioridad: encabezado en una fila (marca, racha, Polys y
 * Ajustes); tarjeta del jugador con avatar, marco y fondo equipados y, debajo, el nivel global (a la
 * izquierda) con la barra de XP y lo que falta (a la derecha); liga y ELO con lo que falta para el
 * próximo escalón; estadísticas de ranked; idiomas; próximos objetivos; logros; Plus. Debajo, el detalle de aprendizaje y el historial competitivo.
 * Todo con datos del servidor: el XP lo otorga la base (sync_xp) y es independiente del ELO.
 */
export default function ProfileScreen() {
  useTheme();
  const t = useStrings(profileScreenStrings);
  const { data, isPending, isError, refetch, isRefetching } = useMyProfile();
  const xp = useXp();
  const titleChoice = useTitleChoice(useAuth().session?.user.id);
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  usePrefetchLanguagePaths(data?.profile.target_language);
  // Nivel del curso que estudia (modelo de cursos; sin él, profiles.start_level).
  const courseLevel = useLanguageStartLevel();

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { profile, rating } = data;
  const startLevel = courseLevel ?? profile.start_level;

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        void refetch();
        void xp.refetch();
      }}
      refreshing={isRefetching}
      contentStyle={styles.content}
    >
      <ProfileTopBar />
      {/* Sólo la cuenta administradora (janitogap); los datos los autoriza la base con MFA. */}
      <AdminEntryCard />
      {xpPreview ? <xpPreview.XpPreviewPanel /> : null}
      <ProfileHeader
        profile={profile}
        rating={rating}
        // La liga va en su propia tarjeta, justo debajo de la del jugador (nivel y XP).
        showRank={false}
        // Sin «@usuario» repetido: debajo del nombre va el título (el elegido o el del nivel).
        // Sin XP en el servidor todavía, nivel 0.
        subtitle={xp.isError ? null : <PlayerTitle xp={xpOrStart(xp.data)} choice={titleChoice} />}
        footer={xp.isError ? null : <PlayerXpPanel xp={xpOrStart(xp.data)} />}
      />
      {rating ? <RankSummaryCard rating={rating} interactive /> : null}
      <StatsRow rating={rating} />
      <LanguagesCard current={profile.target_language} startLevel={startLevel} />
      <NextGoalsCard rating={rating} />
      <AchievementsCard />
      <PlusCard />

      <PeriodStats />

      <SectionHeader title={t.learning} />
      <LearningStats level={startLevel} />

      {rating ? (
        <>
          <SectionHeader title={t.competitiveHistory} />
          <CompetitiveHistory />
        </>
      ) : null}
    </Screen>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.section}>
      <Text variant="heading">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Un poco menos de aire entre secciones que el resto de la app: más información sin desplazarse.
  content: { paddingTop: spacing.xs, gap: spacing.md },
  section: { marginTop: spacing.sm },
});
