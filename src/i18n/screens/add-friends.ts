import { defineStrings } from '..';

/** Agregar amigos (src/app/add-friends.tsx). */
export const addFriendsStrings = defineStrings({
  es: {
    title: 'Agregar amigos',
    received: 'Solicitudes recibidas',
    receivedEmpty: 'No tienes solicitudes nuevas.',
    sent: 'Solicitudes enviadas',
    pending: 'Pendiente',
    sentEmpty: 'No tienes solicitudes pendientes.',
    declinedNote:
      'Si alguien rechaza tu solicitud no te avisamos: la sigues viendo pendiente durante 7 días y después desaparece. Entonces puedes volver a enviársela.',
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
  'pt-BR': {
    title: 'Adicionar amigos',
    received: 'Solicitações recebidas',
    receivedEmpty: 'Você não tem solicitações novas.',
    sent: 'Solicitações enviadas',
    pending: 'Pendente',
    sentEmpty: 'Você não tem solicitações pendentes.',
    declinedNote:
      'Se alguém recusar sua solicitação, não avisamos: ela continua aparecendo como pendente por 7 dias e depois some. Aí você pode enviar de novo.',
  },
  it: {
    title: 'Aggiungi amici',
    received: 'Richieste ricevute',
    receivedEmpty: 'Non hai nuove richieste.',
    sent: 'Richieste inviate',
    pending: 'In attesa',
    sentEmpty: 'Non hai richieste in attesa.',
    declinedNote:
      'Se qualcuno rifiuta la tua richiesta non te lo diciamo: la vedrai in attesa per 7 giorni e poi sparirà. A quel punto potrai inviarla di nuovo.',
  },
});
