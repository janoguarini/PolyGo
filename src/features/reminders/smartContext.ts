import { useEffect, useMemo, useState } from 'react';

import { getRank, isPlaced } from '@shared/ranking';

import { useCurriculum, useStudyLanguage, useWordOfTheDay } from '@/features/learning/hooks';
import { useDailyMissions } from '@/features/missions/api';
import { useMyProfile } from '@/features/profile/hooks';
import { rankLabel } from '@/features/ranked/strings';
import { useInterfaceLanguage } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';
import { flagPayload } from '@/lib/analytics';

import { loadPracticeTimes } from './practiceLog';
import { normalizePriority, type SmartContext, type SmartType } from './smart';

/** Flag de PostHog cuyo payload (lista de tipos) define qué mensaje gana: ver docs/PUSH.md. */
export const PRIORITY_FLAG = 'smart-push-priority';

/**
 * Todo lo que el push inteligente necesita saber, armado con lo que la app ya tiene en caché
 * (palabras, misiones, rating, camino y palabra del día). undefined mientras falten datos.
 */
export function useSmartInput(
  streakDays: number | undefined,
  activeToday: boolean | undefined,
): { ctx: SmartContext; practiceTimes: number[]; priority: SmartType[] } | undefined {
  const missions = useDailyMissions().data;
  const rating = useMyProfile().data?.rating;
  const curriculum = useCurriculum().data;
  const wordOfDay = useWordOfTheDay().data;
  const study = useStudyLanguage();
  const languageName = useLanguageName();
  const ui = useInterfaceLanguage();
  const [practiceTimes, setPracticeTimes] = useState<number[] | null>(null);

  // Se relee al cambiar la racha de hoy (o sea, después de practicar).
  useEffect(() => {
    let alive = true;
    void loadPracticeTimes().then((t) => alive && setPracticeTimes(t));
    return () => {
      alive = false;
    };
  }, [activeToday, streakDays]);

  const name = languageName(study.code).toLocaleLowerCase();
  const flag = study.flag;

  return useMemo(() => {
    if (streakDays === undefined || activeToday === undefined || !practiceTimes) {
      return undefined;
    }

    const pending = missions?.missions
      .filter((m) => !m.done)
      .map((m) => m.target - m.progress)
      .filter((left) => left > 0 && left <= 2);
    const rank = rating && isPlaced(rating) ? getRank(rating.rating) : null;
    // Nombre en el idioma de la interfaz («Silver II», «Prata II»…): `getRank().label` es el español
    // de shared/ranking.ts, que comparte el servidor de partidas.
    const nextName = rank?.nextStepMin != null ? rankLabel(getRank(rank.nextStepMin), ui) : null;
    const lesson = curriculum ? Object.values(curriculum.currentByLevel)[0] : undefined;

    return {
      ctx: {
        streakDays,
        activeToday,
        missionLeft: pending && pending.length > 0 ? Math.min(...pending) : null,
        chestReady: Boolean(missions?.all_done && !missions.claimed),
        rankGap:
          rank && rank.nextStepMin != null && nextName
            ? { points: Math.ceil(rank.nextStepMin - rating!.rating), next: nextName }
            : null,
        nextLesson: lesson?.title ?? null,
        wordOfDay: wordOfDay?.text ?? null,
        language: { name, flag },
      },
      practiceTimes,
      priority: normalizePriority(flagPayload(PRIORITY_FLAG)),
    };
  }, [
    streakDays,
    activeToday,
    missions,
    rating,
    curriculum,
    wordOfDay,
    name,
    flag,
    practiceTimes,
    ui,
  ]);
}
