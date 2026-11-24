import { defineStrings } from '..';

/** Desafiar a un amigo (src/app/challenge-friend.tsx). */
export const challengeFriendStrings = defineStrings({
  es: {
    sendChallenge: 'Enviar desafío',
    createCode: 'Crear código',
    sendHint: (name: string | undefined) =>
      `Le avisa a ${name ?? 'tu amigo'} y espera a que acepte`,
    codeHint: 'Crea un código para compartir con quien quieras',
    title: 'Desafiar',
    yourRival: 'TU RIVAL',
    yourFriend: 'Tu amigo',
    elo: (rating: number) => `${rating} ELO`,
    codeChallenge: 'Desafío con código',
    codeChallengeHint: 'Creá un código y compartilo con quien quieras.',
    pickMode: 'ELEGÍ EL MODO',
    moreModes: 'Más modos, muy pronto.',
    friendlyNote: 'Amistoso: no mueve el ELO.',
  },
  en: {
    sendChallenge: 'Send challenge',
    createCode: 'Create code',
    sendHint: (name: string | undefined) =>
      `Notifies ${name ?? 'your friend'} and waits for them to accept`,
    codeHint: 'Creates a code to share with anyone you want',
    title: 'Challenge',
    yourRival: 'YOUR OPPONENT',
    yourFriend: 'Your friend',
    elo: (rating: number) => `${rating} ELO`,
    codeChallenge: 'Challenge with a code',
    codeChallengeHint: 'Create a code and share it with anyone you want.',
    pickMode: 'PICK A MODE',
    moreModes: 'More modes coming soon.',
    friendlyNote: 'Friendly: doesn’t affect ELO.',
  },
});
