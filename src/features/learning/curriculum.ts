/**
 * Estado de cada lección en el mapa. Replica la regla de desbloqueo del servidor (is_lesson_unlocked):
 * el orden es lineal dentro de cada nivel y cada nivel arranca desbloqueado.
 */

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
  /** Nivel MCER (A1, A2). */
  level: string;
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
  /** Lección que toca en cada nivel (ausente si el nivel está terminado). */
  currentByLevel: Partial<Record<string, LessonWithStatus>>;
} {
  const done = new Map(progress.filter((p) => p.timesCompleted > 0).map((p) => [p.lessonId, p]));
  let previousCompleted = true;
  let level: string | null = null;
  const currentByLevel: Partial<Record<string, LessonWithStatus>> = {};

  const result = [...units]
    .sort((a, b) => a.level.localeCompare(b.level) || a.position - b.position)
    .map((unit) => {
      if (unit.level !== level) {
        level = unit.level;
        previousCompleted = true;
      }
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
          if (status === 'current' && !currentByLevel[unit.level]) {
            currentByLevel[unit.level] = item;
          }
          return item;
        });
      return {
        ...unit,
        lessons,
        completedCount: lessons.filter((l) => l.status === 'completed').length,
      };
    });

  return { units: result, currentByLevel };
}
