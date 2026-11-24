import { router, useLocalSearchParams } from 'expo-router';

import { Button, EmptyState, Screen } from '@/design-system';
import { WritingTask } from '@/features/learning/components/WritingTask';
import { useStrings } from '@/i18n';
import { writingTaskScreenStrings } from '@/i18n/screens/lesson';

import { writingTask } from '../../../content/writing';

/**
 * Tarea de escritura de inglés A1 y A2 sin IA (docs/A1_EN_CLOSURE.md §6, docs/A2_EN_COMPLETION.md
 * §5). Las tareas viajan con la app (content/writing.ts): no hay datos que cargar ni respuesta que
 * enviar. Se abre desde los
 * resultados de la lección a la que acompaña (WritingPracticeCard). Es práctica opcional.
 */
export default function WritingTaskScreen() {
  const t = useStrings(writingTaskScreenStrings);
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = id ? writingTask(id) : undefined;
  return (
    <Screen
      edges={['top', 'bottom']}
      footer={<Button label={t.back} variant="secondary" onPress={() => router.back()} />}
    >
      {task ? (
        <WritingTask task={task} />
      ) : (
        <EmptyState title={t.notFoundTitle} message={t.notFoundMessage} />
      )}
    </Screen>
  );
}
