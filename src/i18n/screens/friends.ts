import { defineStrings } from '..';

/** Pestaña Amigos (src/app/(tabs)/friends.tsx). */
export const friendsScreenStrings = defineStrings({
  es: {
    title: 'Amigos',
    subtitle: 'Competí y aprendé con tus amigos.',
    add: 'Agregar',
    requestsA11y: (n: number) => `${n} solicitudes de amistad. Ver`,
    wantsToBeFriend: (username: string) => `@${username} quiere ser tu amigo`,
    requestsCount: (n: number) => `${n} solicitudes de amistad`,
    dailyMissions: 'MISIONES DIARIAS',
    myFriends: 'Mis amigos',
    seeAllA11y: (showingAll: boolean): string =>
      showingAll ? 'Ver menos amigos' : 'Ver todos tus amigos',
    seeAll: (showingAll: boolean): string => (showingAll ? 'Ver menos' : 'Ver todos'),
    emptyTitle: 'Todavía no tenés amigos',
    emptyMessage: 'Buscalos por su nombre de usuario o pasales tu código de amigo.',
    addFriends: 'Agregar amigos',
    recentActivity: 'ACTIVIDAD RECIENTE',
    friendA11y: (username: string, presence: string, elo: string | null) =>
      `${username}, ${presence}${elo ? `, ${elo}` : ''}. Ver perfil`,
    streakA11y: (n: number) => `Racha de ${n} ${n === 1 ? 'día' : 'días'}`,
  },
  en: {
    title: 'Friends',
    subtitle: 'Compete and learn with your friends.',
    add: 'Add',
    requestsA11y: (n: number) => `${n} friend requests. View`,
    wantsToBeFriend: (username: string) => `@${username} wants to be your friend`,
    requestsCount: (n: number) => `${n} friend requests`,
    dailyMissions: 'DAILY MISSIONS',
    myFriends: 'My friends',
    seeAllA11y: (showingAll: boolean): string =>
      showingAll ? 'Show fewer friends' : 'See all your friends',
    seeAll: (showingAll: boolean): string => (showingAll ? 'Show less' : 'See all'),
    emptyTitle: 'No friends yet',
    emptyMessage: 'Search for them by username or share your friend code.',
    addFriends: 'Add friends',
    recentActivity: 'RECENT ACTIVITY',
    friendA11y: (username: string, presence: string, elo: string | null) =>
      `${username}, ${presence}${elo ? `, ${elo}` : ''}. View profile`,
    streakA11y: (n: number) => (n === 1 ? '1-day streak' : `${n}-day streak`),
  },
});
