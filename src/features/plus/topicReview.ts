// Las reglas viven en shared/focusReview.ts: el servidor arma y corrige el repaso con ellas (fase 4, P3)
// y la app sólo las usa para mostrar las unidades disponibles.
export {
  TOPIC_REVIEW_SIZE,
  pickTopicReview,
  topicSummaries,
  type TopicSummary,
  type TopicUnit,
} from '@shared/focusReview';
