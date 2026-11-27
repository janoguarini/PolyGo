import { defineStrings } from '..';

/** Pestaña Amigos (src/app/(tabs)/friends.tsx). */
export const friendsScreenStrings = defineStrings({
  es: {
    title: 'Amigos',
    subtitle: 'Compite y aprende con tus amigos.',
    add: 'Agregar',
    requestsA11y: (n: number) => `${n} solicitudes de amistad. Ver`,
    wantsToBeFriend: (username: string) => `@${username} quiere ser tu amigo`,
    requestsCount: (n: number) => `${n} solicitudes de amistad`,
    dailyMissions: 'MISIONES DIARIAS',
    myFriends: 'Mis amigos',
    seeAllA11y: (showingAll: boolean): string =>
      showingAll ? 'Ver menos amigos' : 'Ver todos tus amigos',
    seeAll: (showingAll: boolean): string => (showingAll ? 'Ver menos' : 'Ver todos'),
    emptyTitle: 'Todavía no tienes amigos',
    emptyMessage: 'Búscalos por su nombre de usuario o pásales tu código de amigo.',
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
  'pt-BR': {
    title: 'Amigos',
    subtitle: 'Compita e aprenda com seus amigos.',
    add: 'Adicionar',
    requestsA11y: (n: number) => `${n} solicitações de amizade. Ver`,
    wantsToBeFriend: (username: string) => `@${username} quer ser seu amigo`,
    requestsCount: (n: number) => `${n} solicitações de amizade`,
    dailyMissions: 'MISSÕES DIÁRIAS',
    myFriends: 'Meus amigos',
    seeAllA11y: (showingAll: boolean): string =>
      showingAll ? 'Ver menos amigos' : 'Ver todos os seus amigos',
    seeAll: (showingAll: boolean): string => (showingAll ? 'Ver menos' : 'Ver todos'),
    emptyTitle: 'Você ainda não tem amigos',
    emptyMessage: 'Procure pelo nome de usuário ou passe seu código de amigo.',
    addFriends: 'Adicionar amigos',
    recentActivity: 'ATIVIDADE RECENTE',
    friendA11y: (username: string, presence: string, elo: string | null) =>
      `${username}, ${presence}${elo ? `, ${elo}` : ''}. Ver perfil`,
    streakA11y: (n: number) => `Sequência de ${n} ${n === 1 ? 'dia' : 'dias'}`,
  },
  it: {
    title: 'Amici',
    subtitle: 'Sfida e impara con i tuoi amici.',
    add: 'Aggiungi',
    requestsA11y: (n: number) => `${n} richieste di amicizia. Vedi`,
    wantsToBeFriend: (username: string) => `@${username} vuole essere tuo amico`,
    requestsCount: (n: number) => `${n} richieste di amicizia`,
    dailyMissions: 'MISSIONI GIORNALIERE',
    myFriends: 'I miei amici',
    seeAllA11y: (showingAll: boolean): string =>
      showingAll ? 'Mostra meno amici' : 'Vedi tutti i tuoi amici',
    seeAll: (showingAll: boolean): string => (showingAll ? 'Mostra meno' : 'Vedi tutti'),
    emptyTitle: 'Non hai ancora amici',
    emptyMessage: 'Cercali per nome utente o passa loro il tuo codice amico.',
    addFriends: 'Aggiungi amici',
    recentActivity: 'ATTIVITÀ RECENTE',
    friendA11y: (username: string, presence: string, elo: string | null) =>
      `${username}, ${presence}${elo ? `, ${elo}` : ''}. Vedi profilo`,
    streakA11y: (n: number) => `Serie di ${n} ${n === 1 ? 'giorno' : 'giorni'}`,
  },
});
