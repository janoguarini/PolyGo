import type { FriendMissionId } from '@shared/friendChallenges';

import { defineStrings } from '@/i18n';

/**
 * Etiquetas de format.ts: ligas, conexión, actividad y tiempos relativos. Los nombres de los rangos
 * salen de src/features/ranked/strings.ts (una sola fuente).
 */
export const friendsFormatStrings = defineStrings({
  es: {
    unranked: 'Sin rango',
    unplaced: 'Sin posicionar',
    online: 'En línea',
    offline: 'Desconectado',
    seenMinutes: (n: number) => `Hace ${n} min`,
    seenHours: (n: number) => `Hace ${n} h`,
    seenDays: (n: number) => (n === 1 ? 'Hace 1 día' : `Hace ${n} días`),
    rankUp: (rank: string) => `subió a ${rank}`,
    winsWeek: (n: number) => `ganó ${n} partidas esta semana`,
    reviewsWeek: (n: number) => `repasó ${n} palabras esta semana`,
    lessonsWeek: (n: number) => `completó ${n} lecciones esta semana`,
    achievement: (label: string) => `desbloqueó «${label}»`,
    streak: (n: number) => `llegó a ${n} días de racha`,
    newFriend: 'ahora es tu amigo',
    justNow: 'recién',
    agoMinutes: (n: number) => `hace ${n} min`,
    agoHours: (n: number) => `hace ${n} h`,
    agoDays: (n: number) => (n === 1 ? 'ayer' : `hace ${n} días`),
    endsInDays: (n: number) => `Terminan en ${n} días`,
    endsInHours: (n: number) => `Terminan en ${n} h`,
    endsSoon: 'Terminan en menos de una hora',
  },
  en: {
    unranked: 'Unranked',
    unplaced: 'Not placed yet',
    online: 'Online',
    offline: 'Offline',
    seenMinutes: (n: number) => `${n} min ago`,
    seenHours: (n: number) => `${n} h ago`,
    seenDays: (n: number) => (n === 1 ? '1 day ago' : `${n} days ago`),
    rankUp: (rank: string) => `reached ${rank}`,
    winsWeek: (n: number) => (n === 1 ? 'won 1 match this week' : `won ${n} matches this week`),
    reviewsWeek: (n: number) =>
      n === 1 ? 'reviewed 1 word this week' : `reviewed ${n} words this week`,
    lessonsWeek: (n: number) =>
      n === 1 ? 'completed 1 lesson this week' : `completed ${n} lessons this week`,
    achievement: (label: string) => `unlocked “${label}”`,
    streak: (n: number) => `hit a ${n}-day streak`,
    newFriend: 'is now your friend',
    justNow: 'just now',
    agoMinutes: (n: number) => `${n} min ago`,
    agoHours: (n: number) => `${n} h ago`,
    agoDays: (n: number) => (n === 1 ? 'yesterday' : `${n} days ago`),
    endsInDays: (n: number) => `Ends in ${n} days`,
    endsInHours: (n: number) => `Ends in ${n} h`,
    endsSoon: 'Ends in less than an hour',
  },
});

/** Textos de los componentes de Amigos (src/features/friends). */
export const friendsStrings = defineStrings({
  es: {
    // FriendButton
    removeConfirm: (username: string) => `¿Sacar a @${username} de tus amigos? No le avisamos.`,
    removeYes: 'Sí, sacar',
    cancel: 'Cancelar',
    areFriends: 'Son amigos',
    areFriendsHint: 'Toca para sacarlo de tus amigos',
    requestSentCancel: 'Solicitud enviada · cancelar',
    incomingRequest: (username: string) => `@${username} te mandó una solicitud de amistad.`,
    decline: 'Rechazar',
    accept: 'Aceptar',
    addFriend: 'Agregar amigo',
    // BattleInviteBanner
    challengedYou: (username: string) => `@${username} te desafió`,
    friendlyNoElo: 'Amistoso · no mueve el ELO',
    notNow: 'Ahora no',
    play: 'Jugar',
    // ChallengeFriendsCard
    acceptChallengeA11y: (username: string) => `Aceptar el desafío de ${username}`,
    challengeSent: 'Desafío enviado',
    challenge: 'Desafiar',
    challengeA11y: (username: string) => `Desafiar a ${username} a un amistoso`,
    challengeAFriend: 'Desafiar a un amigo',
    onlineCount: (n: number) => `${n} en línea`,
    addFriends: 'Agregar amigos',
    noneOnline: 'Ninguno de tus amigos está conectado ahora. Podés crear un código y mandárselo.',
    moreOnline: (n: number) => `Y ${n} más en línea: están en «Mis amigos».`,
    challengeWithCode: 'Desafiar con un código',
    challengeWithCodeHint: 'Elegí el modo y creá un código para compartir',
    // DailyMissionsCard
    loadingMissions: 'Cargando misiones',
    missionsError: 'No pudimos cargar las misiones de hoy.',
    retry: 'Reintentar',
    newEveryDay: (endsIn: string) => `${endsIn} · nuevas cada día.`,
    missionProgressA11y: (title: string, progress: number, target: number) =>
      `${title}: ${progress} de ${target}`,
    claimA11y: (n: number) => `Reclamar ${n} Polys`,
    rewardClaimed: 'Premio cobrado',
    rewardA11y: (n: number) => `Premio: ${n} Polys`,
    friendsDone: (first: string, others: number, done: number) =>
      `${first}${others > 0 ? ` y ${others} más` : ''} ${done === 1 ? 'ya la completó' : 'ya la completaron'}`,
    // FriendActivityFeed
    loadingActivity: 'Cargando actividad',
    activityError: 'No pudimos cargar la actividad.',
    activityEmpty:
      'Todavía no hay novedades. Cuando tus amigos suban de rango, ganen partidas o desbloqueen logros, lo vas a ver acá.',
    activityA11y: (username: string, text: string, ago: string) =>
      `${username} ${text}, ${ago}. Ver perfil`,
    showLess: 'Ver menos',
    showAllActivity: (n: number) => `Ver toda la actividad (${n})`,
    // MyCodeCard
    shareCodeMessage: (username: string | null | undefined, code: string) =>
      `¡Agregame en Polygo! Buscame como @${username} o con mi código ${code}.`,
    yourFriendCode: 'TU CÓDIGO DE AMIGO',
    yourCodeA11y: (spelled: string) => `Tu código: ${spelled}`,
    addWithCode: (username: string | null | undefined) =>
      `Te pueden agregar con este código${username ? ` o buscando @${username}` : ''}.`,
    shareMyCode: 'Compartir mi código',
    // PlayerRow
    viewProfile: 'Ver perfil',
    // PlayerSearch
    searchPlaceholder: 'Nombre de usuario o código PG-…',
    searchA11y: 'Buscar jugadores por nombre de usuario o código',
    clearSearch: 'Borrar búsqueda',
    typeTwoLetters: 'Escribí al menos 2 letras.',
    searching: 'Buscando',
    noResults: 'Sin resultados',
    noResultsHint: 'No encontramos jugadores con ese nombre o código.',
    playersCount: (n: number) => (n === 1 ? '1 JUGADOR' : `${n} JUGADORES`),
    // PushPromptCard
    pushTitle: 'Enterate cuando te desafían',
    dontShowAgain: 'No mostrar más',
    pushBlocked:
      'Las notificaciones de Polygo están apagadas en tu teléfono. Activalas desde los ajustes para que te llegue cuando un amigo te invita a jugar.',
    pushAsk:
      'Te avisamos con una notificación cuando un amigo te invita a un amistoso, aunque tengas la app cerrada.',
    openPhoneSettings: 'Abrir ajustes del teléfono',
    enablePush: 'Activar avisos',
    // RequestActions
    nowFriends: (username: string) => `¡Ahora vos y @${username} son amigos!`,
    declinedRequest: (username: string) => `Rechazaste la solicitud de @${username}.`,
    declineRequestA11y: (username: string) => `Rechazar la solicitud de ${username}`,
    acceptRequestA11y: (username: string) => `Aceptar la solicitud de ${username}`,
    cancelRequestA11y: (username: string) => `Cancelar la solicitud a ${username}`,
    canceledRequest: (username: string) => `Cancelaste la solicitud a @${username}.`,
    friendsTag: 'Amigos',
    pendingTag: 'Pendiente',
    addUserA11y: (username: string) => `Agregar a ${username}`,
    requestSent: (username: string) => `Le mandaste una solicitud a @${username}.`,
    // push.ts (canal de Android)
    channelName: 'Desafíos de amigos',
    channelDescription: 'Cuando un amigo te invita a un amistoso.',
  },
  en: {
    removeConfirm: (username: string) =>
      `Remove @${username} from your friends? We won’t notify them.`,
    removeYes: 'Yes, remove',
    cancel: 'Cancel',
    areFriends: 'Friends',
    areFriendsHint: 'Tap to remove them from your friends',
    requestSentCancel: 'Request sent · cancel',
    incomingRequest: (username: string) => `@${username} sent you a friend request.`,
    decline: 'Decline',
    accept: 'Accept',
    addFriend: 'Add friend',
    challengedYou: (username: string) => `@${username} challenged you`,
    friendlyNoElo: 'Friendly · doesn’t affect ELO',
    notNow: 'Not now',
    play: 'Play',
    acceptChallengeA11y: (username: string) => `Accept ${username}’s challenge`,
    challengeSent: 'Challenge sent',
    challenge: 'Challenge',
    challengeA11y: (username: string) => `Challenge ${username} to a friendly match`,
    challengeAFriend: 'Challenge a friend',
    onlineCount: (n: number) => `${n} online`,
    addFriends: 'Add friends',
    noneOnline: 'None of your friends are online right now. Create a code and send it to them.',
    moreOnline: (n: number) => `And ${n} more online: find them in “My friends”.`,
    challengeWithCode: 'Challenge with a code',
    challengeWithCodeHint: 'Pick a mode and create a code to share',
    loadingMissions: 'Loading missions',
    missionsError: 'We couldn’t load today’s missions.',
    retry: 'Try again',
    newEveryDay: (endsIn: string) => `${endsIn} · new ones every day.`,
    missionProgressA11y: (title: string, progress: number, target: number) =>
      `${title}: ${progress} of ${target}`,
    claimA11y: (n: number) => `Claim ${n} Polys`,
    rewardClaimed: 'Reward claimed',
    rewardA11y: (n: number) => `Reward: ${n} Polys`,
    // En inglés el verbo no cambia con la cantidad.
    friendsDone: (first: string, others: number, _done: number) =>
      `${first}${others > 0 ? ` and ${others} more` : ''} already did it`,
    loadingActivity: 'Loading activity',
    activityError: 'We couldn’t load the activity.',
    activityEmpty:
      'Nothing new yet. When your friends rank up, win matches or unlock achievements, you’ll see it here.',
    activityA11y: (username: string, text: string, ago: string) =>
      `${username} ${text}, ${ago}. View profile`,
    showLess: 'Show less',
    showAllActivity: (n: number) => `Show all activity (${n})`,
    shareCodeMessage: (username: string | null | undefined, code: string) =>
      `Add me on Polygo! Search for @${username} or use my code ${code}.`,
    yourFriendCode: 'YOUR FRIEND CODE',
    yourCodeA11y: (spelled: string) => `Your code: ${spelled}`,
    addWithCode: (username: string | null | undefined) =>
      `People can add you with this code${username ? ` or by searching @${username}` : ''}.`,
    shareMyCode: 'Share my code',
    viewProfile: 'View profile',
    searchPlaceholder: 'Username or PG-… code',
    searchA11y: 'Search players by username or code',
    clearSearch: 'Clear search',
    typeTwoLetters: 'Type at least 2 letters.',
    searching: 'Searching',
    noResults: 'No results',
    noResultsHint: 'We couldn’t find any players with that name or code.',
    playersCount: (n: number) => (n === 1 ? '1 PLAYER' : `${n} PLAYERS`),
    pushTitle: 'Know when you’re challenged',
    dontShowAgain: 'Don’t show again',
    pushBlocked:
      'Polygo notifications are off on your phone. Turn them on in Settings so you hear when a friend invites you to play.',
    pushAsk:
      'We’ll send you a notification when a friend invites you to a friendly match, even if the app is closed.',
    openPhoneSettings: 'Open phone settings',
    enablePush: 'Turn on notifications',
    nowFriends: (username: string) => `You and @${username} are now friends!`,
    declinedRequest: (username: string) => `You declined @${username}’s request.`,
    declineRequestA11y: (username: string) => `Decline ${username}’s request`,
    acceptRequestA11y: (username: string) => `Accept ${username}’s request`,
    cancelRequestA11y: (username: string) => `Cancel your request to ${username}`,
    canceledRequest: (username: string) => `You canceled your request to @${username}.`,
    friendsTag: 'Friends',
    pendingTag: 'Pending',
    addUserA11y: (username: string) => `Add ${username}`,
    requestSent: (username: string) => `You sent a friend request to @${username}.`,
    channelName: 'Friend challenges',
    channelDescription: 'When a friend invites you to a friendly match.',
  },
});

/**
 * Misiones diarias de Amigos por id. shared/friendChallenges.ts guarda los textos en español y lo
 * replica la base (supabase/tests/friends.test.mjs): acá van sus equivalentes para la interfaz.
 */
export const friendMissionStrings = defineStrings({
  es: {
    play_3: { title: 'Jugá 3 partidas', description: 'Ranked, contra bots o amistosos' },
    review_20: { title: 'Repasá 20 palabras', description: 'Respuestas en sesiones de repaso' },
    friendly_1: {
      title: 'Jugá un amistoso',
      description: 'Un desafío terminado contra alguien de tu lista',
    },
  } satisfies Record<FriendMissionId, { title: string; description: string }>,
  en: {
    play_3: { title: 'Play 3 matches', description: 'Ranked, against bots or friendly' },
    review_20: { title: 'Review 20 words', description: 'Answers in review sessions' },
    friendly_1: {
      title: 'Play a friendly match',
      description: 'A finished challenge against someone on your list',
    },
  },
});
