# Widgets nativos

> **Estado: no implementado (Fase 5).** La pestaña Vocabulario sólo muestra una vista previa con contenido de ejemplo, marcada como tal. No es un widget.

## Plan

| Plataforma | Tecnología | Datos compartidos |
| --- | --- | --- |
| iOS | WidgetKit + SwiftUI + App Intents (iOS 17+ para botones interactivos) | App Group (`UserDefaults(suiteName:)`) |
| Android | Kotlin + Jetpack Glance | `SharedPreferences` / DataStore |

Integración vía Expo Config Plugin propio (o `@bacons/apple-targets` para iOS) → requiere **development build** (no funciona en Expo Go).

## Prioridad MVP

1. Palabra del día (lectura, abre la app con deep link).
2. Pregunta rápida (opciones con App Intent / acción de Glance; respuesta guardada localmente con id idempotente y sincronizada al abrir la app).

## Frecuencia

Objetivo: contenido nuevo cerca de cada hora. **No se promete** una actualización exacta: iOS administra el presupuesto de recargas del timeline y Android limita `updatePeriodMillis` (mínimo 30 min) y el trabajo en segundo plano. La app precarga varias palabras para que el widget siga siendo útil sin red.

## Seguridad

Nada de `service_role` key. El widget sólo guarda contenido de vocabulario y, si fuera necesario, usa la sesión de la app a través de la app al sincronizar.
