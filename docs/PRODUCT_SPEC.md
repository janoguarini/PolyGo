# Especificación de producto

## Propuesta

Aprender inglés como si fuera un juego competitivo serio: estudiás para mejorar tu habilidad, ganar partidas y subir de rango.

## Público inicial

Hispanohablantes que aprenden inglés (A1), competitivos, que estudian en ratos cortos y quieren compararse con amigos.

## Pilares y estado

| Pilar | Contenido | Estado |
| --- | --- | --- |
| A · Aprendizaje | Unidades y lecciones A1, 10 tipos de ejercicio, repaso espaciado | Fase 2 |
| B · Ranked | Word Rush 1v1, matchmaking por ELO, 8 tiers | Rangos/ELO en `shared/` ✅ · motor Fase 4 |
| C · Widgets | Palabra del día, pregunta rápida (iOS/Android nativo) | Fase 5 · vista previa en app |
| D · Perfil | Rango, ELO, V/D, rachas, progreso lingüístico separado, evolución de ELO, historial, logros, perfil público con privacidad, edición | Fase 3 ✅ (datos competitivos reales con la Fase 4) |

## Navegación

Tabs: **Inicio · Aprender · Ranked · Vocabulario · Perfil**.

## Principios de producto

- No se muestran métricas ni rivales inventados. Lo que no existe se marca como pendiente.
- No se venden ventajas de combate; ranked siempre gratis en el MVP.
- Rango competitivo y nivel lingüístico se miden por separado.
- Monetización futura: premium (estadísticas avanzadas, planes, widgets extra) y cosméticos. Nada implementado.

## Analítica (pendiente)

Eventos previstos: `onboarding_completed`, `lesson_started`, `lesson_completed`, `exercise_answered`, `word_reviewed`, `widget_action_completed`, `ranked_queue_joined`, `ranked_match_found`, `battle_started`, `battle_completed`, `battle_abandoned`, `rating_changed`, `rank_promoted`, `user_returned`. Sin contraseñas, tokens ni datos sensibles.
