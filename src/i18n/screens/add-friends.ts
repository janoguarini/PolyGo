import { defineStrings } from '..';

/** Agregar amigos (src/app/add-friends.tsx). */
export const addFriendsStrings = defineStrings({
  es: {
    title: 'Agregar amigos',
    received: 'Solicitudes recibidas',
    receivedEmpty: 'No tenés solicitudes nuevas.',
    sent: 'Solicitudes enviadas',
    pending: 'Pendiente',
    sentEmpty: 'No tenés solicitudes pendientes.',
    declinedNote:
      'Si alguien rechaza tu solicitud no te avisamos: la seguís viendo pendiente durante 7 días y después desaparece. Ahí se la podés volver a mandar.',
  },
  en: {
    title: 'Add friends',
    received: 'Requests received',
    receivedEmpty: 'You don’t have any new requests.',
    sent: 'Requests sent',
    pending: 'Pending',
    sentEmpty: 'You don’t have any pending requests.',
    declinedNote:
      'If someone declines your request, we won’t tell you: it stays pending for 7 days and then disappears. After that you can send it again.',
  },
});
