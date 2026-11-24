# Simulador de la rev. 4.2 (AL18)

Simulador con el que se calcularon las tablas aprobadas de `docs/ADAPTIVE_LEARNING_DESIGN.md`
(rev. 4.2) y los vectores dorados de `shared/__tests__/fixtures/srs2-golden.json`. Hasta el cierre del
Learning Machine (2026-11-10) vivía fuera del repositorio (bloqueo B5 de
`docs/ADAPTIVE_LEARNING_PHASE3.md`).

**Código copiado tal cual** del directorio de trabajo de la sesión de diseño (`al-sim4/`), sin cambios:
`cores.mjs`, `pglayer.mjs`, `sim.mjs`, `sim4.mjs`, `fair3.mjs`, `al2.mjs`, `al19.mjs`, `al8.mjs`,
`util.mjs` y `weights3.json` (la clausura de importaciones del generador de vectores y de los escenarios
AL19/AL8). No se copiaron las salidas (`*.jsonl`, `*.md`) ni los scripts exploratorios de las revisiones
anteriores. Lo único nuevo es `golden.mjs`: el generador de vectores de la fase 3 con otras rutas.

No es código de la app ni del servidor: no se importa desde `src/`, `shared/` ni `supabase/`, y está fuera
del lint de la app (`eslint.config.js`).

## Uso

```bash
node tools/al-sim4/golden.mjs                       # el fixture coincide byte a byte con el simulador
cd tools/al-sim4 && node al19.mjs F1 V11 GT-A        # una fila de las tablas de AL19 (JSON)
cd tools/al-sim4 && node al8.mjs <escenario> <política> <verdad>
```

`al19.mjs` y `al8.mjs` leen `weights3.json` del directorio actual.

## Verificación hecha al incorporarlo (2026-11-10)

- `golden.mjs` reproduce `srs2-golden.json` byte a byte (200 historiales, 190 213 bytes), igual que la
  salida original de la fase 3.
- `al19.mjs F1 V0 GT-B` reproduce byte a byte la fila guardada en `al19all.jsonl` de la sesión de diseño.

## Licencias (F10)

`cores.mjs` reescribe las ecuaciones publicadas de FSRS-4.5, FSRS-6 y FSRS-7 (sin código copiado, según
su encabezado) y contiene los **pesos por defecto publicados** de esos modelos como datos de comparación.
Entra en la revisión legal pendiente F10 junto con `shared/srs2.ts`. No se distribuye con la app.
