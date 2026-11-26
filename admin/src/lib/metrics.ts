// Qué significa cada indicador y cómo se calcula (se muestra en el tooltip «?» de cada KPI).
// Fuente única: las fórmulas replican las funciones public.admin_* (ver docs/ADMIN_PANEL.md).

export interface MetricDef {
  label: string;
  formula: string;
}

const REAL = 'Excluye las cuentas internas (janitogap, hola, janotester).';
const ACTIVE =
  'Activo = completó una lección o un repaso, o jugó una partida, ese día calendario (hora de Buenos Aires). Abrir la app sin hacer nada no cuenta.';

export const M = {
  total_users: { label: 'Usuarios registrados', formula: `Perfiles creados que cumplen los filtros. ${REAL}` },
  new_today: { label: 'Nuevos hoy', formula: `Perfiles creados hoy (desde las 00:00 de Buenos Aires). ${REAL}` },
  new_7d: { label: 'Nuevos 7 días', formula: 'Perfiles creados desde hace 6 días hasta hoy, inclusive.' },
  new_30d: { label: 'Nuevos 30 días', formula: 'Perfiles creados desde hace 29 días hasta hoy, inclusive.' },
  dau: { label: 'DAU', formula: `Usuarios activos hoy. ${ACTIVE}` },
  wau: { label: 'WAU', formula: `Usuarios activos al menos un día en los últimos 7 días (hoy incluido). ${ACTIVE}` },
  mau: { label: 'MAU', formula: `Usuarios activos al menos un día en los últimos 30 días. ${ACTIVE}` },
  seen_today: {
    label: 'Con la app abierta hoy',
    formula: 'Usuarios cuya última señal de presencia (user_presence.last_seen_at) es de hoy. Aproximado: sólo se guarda la última.',
  },
  plus_users: { label: 'Usuarios Plus', formula: 'Usuarios con Plus vigente de cualquier fuente (la misma regla que has_plus de la app).' },
  paid_plus_users: {
    label: 'Plus pagos',
    formula: 'Plus vigente con fuente app_store o play_store. Manual, promocional y referido no son pagos.',
  },
  free_users: { label: 'Usuarios Free', formula: 'Usuarios sin Plus vigente.' },
  inactive_30d: { label: 'Inactivos 30 días', formula: `Usuarios sin ningún día activo en los últimos 30 días. ${ACTIVE}` },
  reactivated: {
    label: 'Reactivados',
    formula: 'Activos en el período, sin actividad en los 14 días previos al inicio y con actividad antes de eso (hasta 1 año atrás).',
  },
  signups: { label: 'Registros', formula: `Perfiles creados en el período. ${REAL}` },
  active_users: { label: 'Usuarios activos', formula: `Usuarios con al menos un día activo en el período. ${ACTIVE}` },
  avg_daily_active: { label: 'Activos por día (prom.)', formula: 'Suma de usuarios activos de cada día / días del período.' },
  sessions: { label: 'Sesiones de aprendizaje', formula: 'Lecciones + repasos completados (learning_sessions con completed_at en el período).' },
  sessions_per_learner: { label: 'Sesiones por usuario', formula: 'Sesiones de aprendizaje / usuarios distintos que completaron alguna.' },
  avg_session_seconds: {
    label: 'Duración media de sesión',
    formula: 'Promedio de duration_seconds de lecciones y repasos completados. No es la duración de uso de la app (eso es PostHog, Etapa B).',
  },
  lessons_completed: { label: 'Lecciones completadas', formula: 'learning_sessions de tipo lesson completadas en el período.' },
  reviews_completed: { label: 'Repasos completados', formula: 'learning_sessions de tipo review completadas en el período.' },
  exercises_answered: { label: 'Ejercicios respondidos', formula: 'Filas de exercise_attempts en el período (cada intento cuenta).' },
  battles: { label: 'Partidas', formula: 'Partidas creadas en el período en las que participó al menos un usuario real.' },
  battles_completed: { label: 'Partidas completadas', formula: 'Partidas con status completed.' },
  battles_forfeited: { label: 'Partidas abandonadas', formula: 'Partidas con status forfeited (alguien abandonó).' },
  battles_vs_bot: { label: 'Contra bot', formula: 'Partidas con has_bot = true.' },
  paid_subs_started: {
    label: 'Suscripciones iniciadas',
    formula: 'Plus de tienda con starts_at en el período. Es el estado actual: sin historial, una renovación puede verse como alta.',
  },
  accuracy: { label: 'Precisión', formula: 'Respuestas correctas / respuestas (exercise_attempts).' },
  first_try_accuracy: {
    label: 'Precisión al primer intento',
    formula: 'Suma de first_try_correct / suma de first_try_total de las sesiones completadas.',
  },
  avg_response_ms: { label: 'Tiempo medio por respuesta', formula: 'Promedio de response_ms entre 1 ms y 2 min (descarta valores rotos).' },
  median_response_ms: { label: 'Mediana por respuesta', formula: 'Mediana de response_ms entre 1 ms y 2 min.' },
  avg_lesson_seconds: { label: 'Tiempo medio por lección', formula: 'Promedio de duration_seconds de las lecciones completadas.' },
  units_completed: {
    label: 'Unidades completadas',
    formula: '(usuario, unidad) con todas las lecciones publicadas terminadas, cuya última lección se terminó en el período.',
  },
  learners: { label: 'Usuarios que aprendieron', formula: 'Usuarios distintos con lecciones o repasos completados en el período.' },
  players: { label: 'Jugadores', formula: 'Usuarios reales distintos que jugaron alguna partida en el período.' },
  win_rate: { label: '% de victorias', formula: 'Victorias / partidas con resultado de los usuarios reales.' },
  battles_per_player: { label: 'Partidas por jugador', formula: 'Participaciones de usuarios reales / jugadores distintos.' },
  avg_duration_seconds: { label: 'Duración media', formula: 'ended_at − started_at de las partidas completadas.' },
  avg_prep_seconds: {
    label: 'Emparejado → inicio',
    formula: 'started_at − created_at. NO es el tiempo de búsqueda de rival (la cola no se guarda).',
  },
  avg_rating_gap_human: { label: 'Diferencia de ELO (humanos)', formula: 'Promedio de |rating_before A − rating_before B| en Ranked humano contra humano.' },
  quit_after_loss: {
    label: 'Dejaron tras perder',
    formula: 'Jugadores del período cuya última partida fue una derrota hace más de 7 días y no volvieron a jugar.',
  },
  promotions: { label: 'Ascensos', formula: 'Cambios de rating del período que cruzaron hacia una liga superior (umbrales de shared/ranking.ts).' },
  demotions: { label: 'Descensos', formula: 'Cambios de rating del período que bajaron de liga.' },
  conversion_paid_pct: { label: 'Conversión a Plus pago', formula: 'Usuarios con Plus pago vigente / usuarios registrados (con los filtros).' },
  will_not_renew: { label: 'No van a renovar', formula: 'Plus pago vigente con will_renew = false (cancelaron la renovación en la tienda).' },
  billing_issues: { label: 'Problemas de cobro', formula: 'Plus vigente con billing_issue_at informado por la tienda.' },
  expired_in_period: { label: 'Vencidas en el período', formula: 'Plus no vigente con expires_at dentro del período.' },
  acceptance_rate: { label: 'Tasa de aceptación', formula: 'Solicitudes aceptadas / (aceptadas + rechazadas) respondidas en el período.' },
  socially_active_users: {
    label: 'Usuarios activos socialmente',
    formula: 'Usuarios reales que enviaron o respondieron una solicitud, o crearon o aceptaron un desafío en el período.',
  },
} satisfies Record<string, MetricDef>;

export type MetricKey = keyof typeof M;
