/** Estado de cada lección en el mapa. Replica la regla de desbloqueo del servidor (is_lesson_unlocked). */

export type LessonStatus = 'completed' | 'current' | 'locked';

export interface LessonSummary {
  id: string;
  unitId: string;
  position: number;
  title: string;
  objective: string;
  exerciseCount: number;
}

export interface UnitSummary {
  id: string;
  position: number;
  title: string;
  titleEn: string;
  description: string;
  emoji: string;
  lessons: LessonSummary[];
}

export interface LessonProgress {
  lessonId: string;
  timesCompleted: number;
  bestAccuracy: number;
}

export interface LessonWithStatus extends LessonSummary {
  status: LessonStatus;
  bestAccuracy: number | null;
}

export interface UnitWithStatus extends Omit<UnitSummary, 'lessons'> {
  lessons: LessonWithStatus[];
  completedCount: number;
}

export function withStatus(
  units: UnitSummary[],
  progress: LessonProgress[],
): {
  units: UnitWithStatus[];
  current: LessonWithStatus | null;
} {
  const done = new Map(progress.filter((p) => p.timesCompleted > 0).map((p) => [p.lessonId, p]));
  let previousCompleted = true;
  let current: LessonWithStatus | null = null;

  const result = [...units]
    .sort((a, b) => a.position - b.position)
    .map((unit) => {
      const lessons = [...unit.lessons]
        .sort((a, b) => a.position - b.position)
        .map((lesson): LessonWithStatus => {
          const record = done.get(lesson.id);
          const status: LessonStatus = record
            ? 'completed'
            : previousCompleted
              ? 'current'
              : 'locked';
          previousCompleted = Boolean(record);
          const item = { ...lesson, status, bestAccuracy: record ? record.bestAccuracy : null };
          if (status === 'current' && !current) current = item;
          return item;
        });
      return {
        ...unit,
        lessons,
        completedCount: lessons.filter((l) => l.status === 'completed').length,
      };
    });

  return { units: result, current };
}
