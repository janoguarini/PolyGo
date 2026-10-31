/** Traduce errores de Supabase/red a mensajes en español sin filtrar detalles internos. */

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email o contraseña incorrectos.',
  email_not_confirmed: 'Confirmá tu email antes de iniciar sesión. Revisá tu bandeja de entrada.',
  user_already_exists: 'Ya existe una cuenta con ese email.',
  email_exists: 'Ya existe una cuenta con ese email.',
  weak_password: 'La contraseña es demasiado débil.',
  over_email_send_rate_limit: 'Demasiados emails enviados. Esperá unos minutos.',
  over_request_rate_limit: 'Demasiados intentos. Esperá unos minutos.',
  same_password: 'La nueva contraseña debe ser distinta de la anterior.',
  otp_expired: 'El enlace expiró. Pedí uno nuevo.',
  flow_state_not_found: 'El enlace ya no es válido. Pedí uno nuevo desde este dispositivo.',
};

const RPC_MESSAGES: Record<string, string> = {
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
  cannot_block_self: 'No podés bloquearte a vos mismo.',
  block_limit: 'Llegaste al máximo de usuarios bloqueados.',
  user_not_found: 'Ese jugador ya no existe.',
};

export function toUserMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Ocurrió un error inesperado.';
  const e = error as { code?: unknown; message?: unknown; name?: unknown };
  const code = typeof e.code === 'string' ? e.code : undefined;
  const message = typeof e.message === 'string' ? e.message : '';

  if (code && AUTH_MESSAGES[code]) return AUTH_MESSAGES[code];
  for (const [key, text] of Object.entries(RPC_MESSAGES)) {
    if (message.includes(key)) return text;
  }
  if (/network|fetch|Failed to fetch/i.test(message) || e.name === 'AuthRetryableFetchError') {
    return 'No hay conexión con el servidor. Revisá tu internet.';
  }
  return 'Ocurrió un error inesperado. Intentá de nuevo.';
}
