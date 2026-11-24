import { defineStrings } from '@/i18n';

/**
 * Mensajes para el usuario de los errores de Supabase Auth y de las RPC (src/lib/errors.ts). Las
 * claves son los códigos estables que devuelve el servidor: no se renombran.
 */
export const errorStrings = defineStrings({
  es: {
    auth: {
      invalid_credentials: 'Email o contraseña incorrectos.',
      email_not_confirmed:
        'Confirmá tu email antes de iniciar sesión. Revisá tu bandeja de entrada.',
      user_already_exists: 'Ya existe una cuenta con ese email.',
      email_exists: 'Ya existe una cuenta con ese email.',
      weak_password: 'La contraseña es demasiado débil.',
      over_email_send_rate_limit: 'Demasiados emails enviados. Esperá unos minutos.',
      over_request_rate_limit: 'Demasiados intentos. Esperá unos minutos.',
      same_password: 'La nueva contraseña debe ser distinta de la anterior.',
      otp_expired: 'El enlace expiró. Pedí uno nuevo.',
      flow_state_not_found: 'El enlace ya no es válido. Pedí uno nuevo desde este dispositivo.',
      // Inicio con Google (features/auth/api.ts → signInWithGoogle).
      flow_state_expired: 'El inicio de sesión tardó demasiado. Intentá de nuevo.',
      bad_code_verifier: 'No pudimos completar el inicio de sesión. Intentá de nuevo.',
      provider_disabled: 'Ese método de inicio de sesión no está disponible por ahora.',
      oauth_failed: 'Google no pudo completar el inicio de sesión. Intentá de nuevo.',
      oauth_invalid_callback: 'La respuesta de Google no es válida. Intentá de nuevo.',
      oauth_browser_busy:
        'No pudimos abrir el navegador. Cerrá otras ventanas de inicio e intentá de nuevo.',
      oauth_unavailable:
        'Esta versión de la app todavía no permite entrar con Google. Actualizala o usá tu email.',
      // Sign in with Apple (features/auth/apple.ts).
      apple_failed: 'Apple no pudo completar el inicio de sesión. Intentá de nuevo.',
      apple_invalid_token: 'No pudimos validar tu cuenta de Apple. Intentá de nuevo.',
      apple_unavailable:
        'Esta versión de la app todavía no permite entrar con Apple. Actualizala o usá tu email.',
    },
    // El orden importa: se busca la primera clave contenida en el mensaje del error.
    rpc: {
      username_taken: 'Ese nombre de usuario ya está en uso.',
      language_unavailable: 'Ese idioma todavía no está disponible.',
      not_authenticated: 'Tu sesión expiró. Volvé a iniciar sesión.',
      cannot_report_self: 'No podés reportar tu propia foto.',
      report_rate_limited: 'Hiciste muchos reportes hoy. Probá de nuevo mañana.',
      invalid_reason: 'Elegí un motivo para el reporte.',
      missions_incomplete: 'Todavía te faltan misiones para abrir el cofre.',
      already_claimed: 'Ya abriste el cofre de hoy.',
      insufficient_polys: 'No te alcanzan los Polys.',
      freezes_full: 'Ya tenés el máximo de protectores.',
      item_owned: 'Ya lo tenés.',
      item_not_for_sale: 'Este ítem no se vende por Polys.',
      item_not_found: 'Ese ítem ya no está en la tienda.',
      item_not_owned: 'Primero tenés que conseguirlo.',
      cosmetic_incompatible: 'Ese marco o fondo no combina con tu avatar. Elegí uno compatible.',
      streak_not_repairable: 'Ya no hay una racha para recuperar.',
      cannot_block_self: 'No podés bloquearte a vos mismo.',
      block_limit: 'Llegaste al máximo de usuarios bloqueados.',
      user_not_found: 'Ese jugador ya no existe.',
      cannot_friend_self: 'No podés agregarte a vos mismo.',
      friend_limit: 'Llegaste al máximo de 200 amigos.',
      friend_request_rate_limited: 'Mandaste muchas solicitudes hoy. Probá de nuevo mañana.',
      friend_request_not_found: 'Esa solicitud ya no está.',
      challenge_incomplete: 'Todavía no completaste este reto.',
      not_friends: 'Sólo podés invitar a jugadores de tu lista de amigos.',
      language_mismatch: 'Tu amigo está aprendiendo otro idioma, así que no pueden jugar juntos.',
      match_rate_limited: 'Mandaste muchos desafíos en la última hora. Esperá un rato.',
      no_energy:
        'Te quedaste sin energía antes de guardar (¿la usaste en otro dispositivo?). Recuperás 1 cada 3 horas.',
    },
    unexpected: 'Ocurrió un error inesperado.',
    network: 'No hay conexión con el servidor. Revisá tu internet.',
    unexpectedRetry: 'Ocurrió un error inesperado. Intentá de nuevo.',
  },
  en: {
    auth: {
      invalid_credentials: 'Wrong email or password.',
      email_not_confirmed: 'Confirm your email before signing in. Check your inbox.',
      user_already_exists: 'An account with this email already exists.',
      email_exists: 'An account with this email already exists.',
      weak_password: 'This password is too weak.',
      over_email_send_rate_limit: 'Too many emails sent. Wait a few minutes.',
      over_request_rate_limit: 'Too many attempts. Wait a few minutes.',
      same_password: 'Your new password must be different from the old one.',
      otp_expired: 'This link has expired. Request a new one.',
      flow_state_not_found: 'This link is no longer valid. Request a new one from this device.',
      flow_state_expired: 'Signing in took too long. Try again.',
      bad_code_verifier: 'We couldn’t finish signing you in. Try again.',
      provider_disabled: 'This sign-in method isn’t available right now.',
      oauth_failed: 'Google couldn’t finish signing you in. Try again.',
      oauth_invalid_callback: 'Google sent an invalid response. Try again.',
      oauth_browser_busy:
        'We couldn’t open the browser. Close any other sign-in windows and try again.',
      oauth_unavailable:
        'This version of the app doesn’t support Google sign-in yet. Update it or use your email.',
      apple_failed: 'Apple couldn’t finish signing you in. Try again.',
      apple_invalid_token: 'We couldn’t verify your Apple account. Try again.',
      apple_unavailable:
        'This version of the app doesn’t support Apple sign-in yet. Update it or use your email.',
    },
    rpc: {
      username_taken: 'That username is already taken.',
      language_unavailable: 'That language isn’t available yet.',
      not_authenticated: 'Your session expired. Sign in again.',
      cannot_report_self: 'You can’t report your own photo.',
      report_rate_limited: 'You’ve sent a lot of reports today. Try again tomorrow.',
      invalid_reason: 'Choose a reason for the report.',
      missions_incomplete: 'You still have missions to finish before opening the chest.',
      already_claimed: 'You already opened today’s chest.',
      insufficient_polys: 'You don’t have enough Polys.',
      freezes_full: 'You already have the maximum number of streak freezes.',
      item_owned: 'You already have it.',
      item_not_for_sale: 'This item can’t be bought with Polys.',
      item_not_found: 'This item is no longer in the shop.',
      item_not_owned: 'You need to get it first.',
      cosmetic_incompatible:
        'That frame or background doesn’t work with your avatar. Pick a compatible one.',
      streak_not_repairable: 'There’s no streak left to repair.',
      cannot_block_self: 'You can’t block yourself.',
      block_limit: 'You’ve reached the maximum number of blocked users.',
      user_not_found: 'This player no longer exists.',
      cannot_friend_self: 'You can’t add yourself.',
      friend_limit: 'You’ve reached the maximum of 200 friends.',
      friend_request_rate_limited: 'You’ve sent a lot of requests today. Try again tomorrow.',
      friend_request_not_found: 'This request is no longer available.',
      challenge_incomplete: 'You haven’t completed this challenge yet.',
      not_friends: 'You can only invite players on your friends list.',
      language_mismatch:
        'Your friend is learning a different language, so you can’t play together.',
      match_rate_limited: 'You’ve sent a lot of challenges in the last hour. Wait a bit.',
      no_energy:
        'You ran out of energy before saving (did you use it on another device?). You get 1 back every 3 hours.',
    },
    unexpected: 'Something unexpected went wrong.',
    network: 'Can’t reach the server. Check your internet connection.',
    unexpectedRetry: 'Something unexpected went wrong. Try again.',
  },
});
