# Política de privacidad de Polygo — BORRADOR

> **Borrador técnico, no es asesoramiento legal.** Lo redactó el equipo a partir de lo que la app
> realmente guarda (migraciones de `supabase/` y código). Antes de publicarlo hay que completar los
> campos entre corchetes y que lo revise una persona con conocimiento legal de los países donde se
> distribuya la app (p. ej. Ley 25.326 en Argentina, RGPD en la UE).

Última actualización: [fecha de publicación]

## Quiénes somos

Polygo es una app para aprender inglés compitiendo. Responsable de los datos: [nombre o razón social], [país]. Contacto de privacidad: [email de contacto].

## Qué datos guardamos y para qué

| Dato                                                                                                      | Para qué                                                  | Visible para otros jugadores                                              |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Email y contraseña (la contraseña se guarda cifrada por nuestro proveedor de autenticación)               | Crear tu cuenta e iniciar sesión, recuperar la contraseña | No                                                                        |
| Nombre de usuario, nombre visible y avatar                                                                | Identificarte en la clasificación y en las partidas       | Sí                                                                        |
| Región (opcional, sólo país)                                                                              | Mostrarla en tu perfil si lo elegís                       | Sólo si activás mostrarla                                                 |
| Idioma objetivo, nivel inicial y objetivo diario                                                          | Personalizar las lecciones                                | No                                                                        |
| Progreso de aprendizaje: lecciones, respuestas a ejercicios, palabras estudiadas, repasos, racha y logros | Repaso espaciado, estadísticas y logros                   | Según tu configuración de privacidad (público / privado)                  |
| Partidas ranked: rival, puntajes, resultado y cambios de ELO                                              | Clasificación, historial y rangos                         | Tu rating y rango sí; el detalle de partidas, sólo para los dos jugadores |
| Zona horaria del dispositivo                                                                              | Calcular tu racha diaria correctamente                    | No                                                                        |

**No** usamos publicidad, **no** vendemos datos, **no** usamos herramientas de analítica ni de seguimiento entre apps, y **no** pedimos acceso a contactos, ubicación precisa, cámara ni micrófono.

La pronunciación usa la voz sintetizada de tu dispositivo: el texto no se envía a nuestros servidores para eso. Los widgets de la pantalla de inicio guardan en tu dispositivo sólo palabras de vocabulario.

## Dónde se guardan

- Base de datos y autenticación: Supabase (región `us-west-2`, Estados Unidos).
- Servidor de partidas: [proveedor de hosting y región]. Procesa las partidas en tiempo real y guarda el resultado en la base de datos.
- La sesión se guarda en el almacenamiento seguro del dispositivo (Keychain en iOS, Keystore en Android).

## Cuánto tiempo los guardamos

Mientras tengas la cuenta. Si la borrás, se eliminan tu cuenta, perfil, progreso, logros y rating. Las partidas que jugaste quedan en el historial de tus rivales **sin tu nombre ni avatar**.

## Tus derechos

- **Borrar tu cuenta:** desde la app, en Perfil → Eliminar cuenta. Es inmediato e irreversible. También podés pedirlo por email a [email de contacto] o en [URL web de borrado de cuenta].
- **Acceder, corregir o exportar tus datos:** podés editar tu perfil en la app; para una copia de tus datos escribinos a [email de contacto].
- **Privacidad del perfil:** en Perfil podés hacer tu perfil privado (los demás sólo ven nombre, avatar y rango).

## Menores

Polygo no está dirigido a menores de [13 / la edad que corresponda según el país]. Si sabemos que una cuenta pertenece a un menor por debajo de esa edad, la eliminamos.

## Cambios

Si cambiamos esta política, actualizamos la fecha de arriba y, si el cambio es importante, te avisamos en la app.
