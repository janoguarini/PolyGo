# Avisos (push) personalizados

Dos avisos por día como máximo, programados en el teléfono (notificaciones locales, sin servidor).
Se recalculan cada vez que el usuario abre la app o termina una lección, un repaso o una partida.

| Aviso | Cuándo | Qué dice |
|---|---|---|
| **Elegido** (`daily`) | A la hora que elige el usuario (20:00 por defecto, activado de fábrica) | Genérico, rotando |
| **Inteligente** (`smart`) | 10 min antes de su **horario de oro** (la hora en que más practicó los últimos 21 días; sin datos, lejos del elegido). Entre 9 y 21 h, nunca a menos de 2 h del elegido | El mensaje más fuerte del día |
| **Racha** (`streak`) | 21:00, sólo si ese día ningún aviso cae a la noche | Racha por perderse |

Nunca llegan si ese día ya practicó. Máximo 2 por día (el de racha desplaza al inteligente si serían 3).
El permiso se pide una sola vez, 4 s después de cerrar el tutorial. Se desactivan en Ajustes.

Código: `src/features/reminders/` (`smart.ts` lógica pura, `schedule.ts` el plan, `notifications.ts`
la programación, `smartContext.ts` los datos del usuario, `practiceLog.ts` el horario de oro).

## Tipos del aviso inteligente

(El aviso de repaso «se te están por olvidar» se sacó el 2026-11-26: no convencía.)

| Tipo | Cuándo aplica | Abre |
|---|---|---|
| `streak` | Hoy, racha ≥ 2 sin practicar | Inicio |
| `mission` | Hoy, a 1–2 de completar una misión | Misiones |
| `rank` | Hoy o mañana, a ≤ 30 de ELO del siguiente rango | Ranked |
| `chest` | Hoy, misiones completas y cofre sin abrir | Misiones |
| `lesson` | Hay próxima lección | Inicio |
| `word` | Hoy, palabra del día | Repaso |
| `comeback` | Desde el 2.º día sin abrir la app | Inicio |

Cada tipo tiene dos textos (`variant` a/b) que se alternan por día: es la prueba A/B del copy.

## Medición en PostHog

- `push_delivered` {kind, type, variant}: se registra la próxima vez que se abre la app (lo que ya pasó del plan anterior).
- `push_opened` {kind, type, variant}: al tocar el aviso.
- `push_permission` {result}: respuesta al pedido de permiso.

**Tasa de apertura por tipo:** Insight → Trends → serie A `push_opened`, serie B `push_delivered`,
fórmula `A / B`, desglose por `type` (o por `variant` filtrando un tipo para comparar textos).

## Cambiar la prioridad sin build (lo que más tracciona, primero)

1. PostHog → Feature flags → New: key **`smart-push-priority`**, liberado al 100 %.
2. Payload (JSON), en orden de prioridad, por ejemplo:
   `["streak", "rank", "mission", "chest", "lesson", "word", "comeback"]`
3. Guardar. Los teléfonos lo leen al abrir la app y lo usan al reprogramar.

Tipos desconocidos se ignoran y los que falten se agregan al final en el orden por defecto; sin el
flag (o con un payload inválido) se usa la prioridad por defecto de la tabla.
