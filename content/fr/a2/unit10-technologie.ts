import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U10 «Tecnología y comunicación» (docs/FR_A1_A2.md): hablar de la compu, el celular y
 * las apps, mandar y recibir mensajes y mails, llamar, y reemplazar personas y cosas con los
 * pronombres de objeto directo (le, la, l', les) e indirecto (lui, leur), siempre antes del verbo.
 * Pronunciación: liaison en mon‿ordinateur y deux‿écrans; j'appelle (con ll y e abierta) frente a
 * appeler; je le vois / je les vois; je lui parle / je leur parle.
 * Falso amigo: marcher es funcionar (además de caminar). Mon delante de vocal: mon appli.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MAIL = reading(
  'fr.stim.a2-u10-mail',
  'email',
  'Un mail de Inès a su amigo Julien.',
  [
    'Salut Julien,',
    "Mon portable ne marche pas: l'écran est tout noir.",
    "Je t'envoie ce mail de l'ordinateur de ma sœur.",
    "Je n'ai pas reçu ton message de samedi.",
    "Ce soir, je suis en ligne à neuf heures: appelle-moi sur l'ordinateur!",
    "Et le mot de passe de l'appli de la banque ne marche pas non plus…",
    'Inès',
  ],
  { from: 'Inès', to: 'Julien' },
);

const GRANDS_PARENTS = dialogue(
  'fr.stim.a2-u10-grands-parents',
  'Dos hermanos hablan de cómo se comunican con sus abuelos.',
  [
    ['Chloé', 'Marc, tu appelles souvent les grands-parents?'],
    ['Marc', 'Oui, je les appelle tous les dimanches.'],
    ['Chloé', 'Moi, je leur envoie des photos sur le portable.'],
    ['Marc', 'Et grand-mère? Elle lit tes messages?'],
    ['Chloé', 'Non, elle ne regarde pas son portable! Alors je lui écris des mails.'],
    ['Marc', "Moi, je leur parle en ligne sur l'ordinateur: je les vois sur l'écran!"],
  ],
);

export const FR_A2_U10: FrUnitDef = {
  names: ['Inès', 'Julien', 'Chloé', 'Marc', 'Paul', 'Claire', 'Léa', 'Lyon'],
  support: [
    'envoie',
    'envoies',
    'envoyé',
    'reçois',
    'reçoit',
    'recevez',
    'reçu',
    'appelez',
    'appelons',
    'appellent',
    'télécharge',
    'oublié',
    'marche',
    'photos',
  ],
  unit: {
    position: 10,
    title: 'Tecnología y comunicación',
    titleEn: 'La technologie',
    description:
      "La computadora, el celular y las apps; envoyer, recevoir, appeler; los pronombres le, la, l', les y lui, leur antes del verbo. Falso amigo: marcher (funcionar).",
    emoji: '💻',
    objective:
      'Puedes hablar de tu computadora y tu celular, decir que algo no funciona, mandar y recibir mensajes y mails, y decir a quién llamas, ves, escribes o hablas sin repetir su nombre.',
    grammar: {
      title: "Pronombres le, la, l', les · lui, leur",
      explanation:
        "Para no repetir una persona o una cosa, el francés usa pronombres que van siempre delante del verbo. Objeto directo (verbos sin à, como appeler o voir): le, la (l' delante de vocal) y les: Paul? Je l'appelle. Objeto indirecto (verbos con à, como parler à, écrire à, envoyer à, téléphoner à): lui (a él o a ella) y leur (a ellos o a ellas, sin s): ma sœur? Je lui écris. En la negación el pronombre queda pegado al verbo: je ne l'appelle pas. Con un infinitivo va delante del infinitivo, nunca al final como en español: je vais l'appeler (voy a llamarlo).",
      examples: [
        { target: "Paul? Je l'appelle ce soir.", base: '¿Paul? Lo llamo esta noche.' },
        {
          target: 'Mes parents? Je les vois le dimanche.',
          base: '¿Mis padres? Los veo los domingos.',
        },
        { target: 'Ma sœur? Je lui écris un mail.', base: '¿Mi hermana? Le escribo un mail.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U10). Sin revisión nativa: revisar «appelle-moi sur l'ordinateur» (llamada por internet), el uso de mail frente a e-mail / courriel, y que el pronombre con téléphoner à (je lui téléphone) quede claro frente a appeler (je l'appelle).",
    },
    words: [
      w(
        'fr-l-ordinateur',
        "l'ordinateur",
        'la computadora',
        'Mon ordinateur est sur la table.',
        'Mi computadora está sobre la mesa.',
        ['technology', 'm'],
        { acceptedTranslations: ['la compu'], emoji: '💻' },
      ),
      w(
        'fr-le-portable',
        'le portable',
        'el celular',
        'Mon portable est dans mon sac.',
        'Mi celular está en mi bolso.',
        ['technology', 'm'],
        { emoji: '📱' },
      ),
      w(
        'fr-envoyer',
        'envoyer',
        'mandar',
        "J'envoie un message à Paul.",
        'Le mando un mensaje a Paul.',
        ['technology', 'verbs'],
        { acceptedTranslations: ['enviar'] },
      ),
      w(
        'fr-recevoir',
        'recevoir',
        'recibir',
        'Je reçois beaucoup de mails.',
        'Recibo muchos mails.',
        ['technology', 'verbs'],
      ),
      w(
        'fr-le-message',
        'le message',
        'el mensaje',
        'Tu as reçu mon message?',
        '¿Recibiste mi mensaje?',
        ['technology', 'm'],
        { emoji: '💬' },
      ),
      w(
        'fr-le-mail',
        'le mail',
        'el mail',
        'Je lui écris un mail.',
        'Le escribo un mail.',
        ['technology', 'm'],
        { acceptedTranslations: ['el correo', 'el email'], emoji: '📧' },
      ),
      w(
        'fr-appeler',
        'appeler',
        'llamar',
        'Je vais appeler ma mère ce soir.',
        'Voy a llamar a mi mamá esta noche.',
        ['technology', 'verbs'],
        { emoji: '📞' },
      ),
      w(
        'fr-telecharger',
        'télécharger',
        'descargar',
        "Je télécharge l'appli de la banque.",
        'Descargo la app del banco.',
        ['technology', 'verbs'],
        { acceptedTranslations: ['bajar'] },
      ),
      w(
        'fr-l-appli',
        "l'appli",
        'la app',
        'Mon appli ne marche pas.',
        'Mi app no funciona.',
        ['technology', 'f'],
        { acceptedTranslations: ['la aplicación'] },
      ),
      w(
        'fr-le-mot-de-passe',
        'le mot de passe',
        'la contraseña',
        "J'ai oublié mon mot de passe.",
        'Me olvidé la contraseña.',
        ['technology', 'm'],
        { acceptedTranslations: ['la clave'], emoji: '🔑' },
      ),
      w(
        'fr-en-ligne',
        'en ligne',
        'en línea',
        'Je fais les courses en ligne.',
        'Hago las compras en línea.',
        ['technology'],
        { acceptedTranslations: ['online', 'por internet'] },
      ),
      w(
        'fr-l-ecran',
        "l'écran",
        'la pantalla',
        "L'écran de mon portable est très petit.",
        'La pantalla de mi celular es muy chica.',
        ['technology', 'm'],
      ),
      w(
        'fr-marcher',
        'marcher',
        'funcionar',
        'Mon ordinateur ne marche pas.',
        'Mi computadora no funciona.',
        ['technology', 'verbs'],
        { acceptedTranslations: ['andar', 'caminar'] },
      ),
      w(
        'fr-je-l-appelle',
        "je l'appelle",
        'lo llamo',
        "Paul? Je l'appelle demain.",
        '¿Paul? Lo llamo mañana.',
        ['pronouns'],
        { acceptedTranslations: ['la llamo'] },
      ),
      w(
        'fr-je-les-vois',
        'je les vois',
        'los veo',
        'Mes parents? Je les vois le dimanche.',
        '¿Mis padres? Los veo los domingos.',
        ['pronouns'],
        { acceptedTranslations: ['las veo'] },
      ),
      w(
        'fr-je-lui-ecris',
        'je lui écris',
        'le escribo',
        'Ma sœur habite à Lyon: je lui écris souvent.',
        'Mi hermana vive en Lyon: le escribo seguido.',
        ['pronouns'],
      ),
      w(
        'fr-je-leur-parle',
        'je leur parle',
        'les hablo',
        'Mes grands-parents? Je leur parle tous les jours.',
        '¿Mis abuelos? Les hablo todos los días.',
        ['pronouns'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "L'ordinateur et le portable",
        objective:
          'Nombrar la computadora, el celular, la pantalla y las apps, y decir si funcionan.',
        intro: {
          explanation:
            "L'ordinateur es la computadora, le portable el celular, l'écran la pantalla y l'appli (de application) la app. Falso amigo: marcher es caminar, pero también funcionar: mon portable ne marche pas (mi celular no anda). Appli es femenino, pero delante de vocal ma se vuelve mon: mon appli. Pronunciación: con liaison, mon‿ordinateur se une con un sonido n y deux‿écrans, con un sonido z.",
          examples: [
            { target: 'Mon ordinateur ne marche pas.', base: 'Mi computadora no funciona.' },
            {
              target: "L'écran de mon portable est très petit.",
              base: 'La pantalla de mi celular es muy chica.',
            },
          ],
        },
        takeaways: [
          "Nombras l'ordinateur, le portable, l'écran y l'appli.",
          'Dices que algo no funciona con ne marche pas.',
        ],
        exercises: [
          ex.translationChoice(
            "l'ordinateur",
            'la computadora',
            ['el celular', 'la pantalla', 'la app'],
            ['fr-l-ordinateur'],
            { id: 'fr.ex.lxp6317kq8jv9p' },
          ),
          ex.translationChoice(
            'marcher',
            'funcionar',
            ['mandar', 'recibir', 'descargar'],
            ['fr-marcher'],
            {
              id: 'fr.ex.muoub7zj3n4j47',
              explanation:
                'Marcher es caminar, pero con aparatos quiere decir funcionar: ça ne marche pas.',
            },
          ),
          ex.matchPairs(
            [
              ["l'ordinateur", 'la computadora'],
              ['le portable', 'el celular'],
              ["l'écran", 'la pantalla'],
              ["l'appli", 'la app'],
            ],
            ['fr-l-ordinateur', 'fr-le-portable', 'fr-l-ecran', 'fr-l-appli'],
            { id: 'fr.ex.y04wwuq0fvqkgz' },
          ),
          ex.listenChoice(
            'Mon portable ne marche pas.',
            ['Mon ordinateur ne marche pas.', 'Mon portable marche bien.'],
            ['fr-le-portable', 'fr-marcher'],
            { id: 'fr.ex.tdu7gx9ei7k0ma' },
          ),
          ex.fillBlank(
            '___ appli ne marche pas.',
            'Mi app no funciona.',
            'Mon',
            ['Ma', 'Mes', 'Le'],
            ['fr-l-appli', 'fr-marcher'],
            {
              id: 'fr.ex.qsaychkymwj5la',
              explanation:
                'Appli es femenino, pero empieza con vocal: mon appli, nunca «ma appli».',
            },
          ),
          ex.fillBlank(
            "L'écran de mon ordinateur est très ___.",
            'La pantalla de mi computadora es muy chica.',
            'petit',
            ['petite', 'petits', 'petites'],
            ['fr-l-ecran', 'fr-l-ordinateur'],
            {
              id: 'fr.ex.axyhb7vmjv8jmz',
              explanation: "Écran es masculino: petit. El artículo l' no muestra el género.",
            },
          ),
          ex.listenChoice(
            'Il y a deux écrans.',
            ['Il y a douze écrans.', 'Il y a un écran.'],
            ['fr-l-ecran'],
            {
              id: 'fr.ex.k9lurv95hnh6dq',
              explanation: 'En deux écrans la x se une a la vocal con un sonido z (liaison).',
            },
          ),
          ex.orderWords(
            'Mon portable est dans mon sac.',
            'Mi celular está en mi bolso.',
            ['fr-le-portable'],
            { id: 'fr.ex.jwajxlttztd7zj' },
          ),
          ex.translateWrite(
            'Mi computadora no funciona.',
            'Mon ordinateur ne marche pas.',
            ['fr-l-ordinateur', 'fr-marcher'],
            { id: 'fr.ex.3pt9ot3tmepal7' },
          ),
          ex.translateWrite(
            'La pantalla de mi celular es muy chica.',
            "L'écran de mon portable est très petit.",
            ['fr-l-ecran', 'fr-le-portable'],
            { id: 'fr.ex.wxl49l1eem3zho' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Messages et mails',
        objective: 'Mandar y recibir mensajes y mails.',
        intro: {
          explanation:
            "Envoyer (mandar) cambia la y por i delante de una e muda: j'envoie, tu envoies, il envoie, pero vous envoyez. Recevoir (recibir) es irregular: je reçois, il reçoit, vous recevez. La ç (con cedilla) suena s delante de o y u: reçois, reçu. En pasado: j'ai envoyé, j'ai reçu. Se manda algo à quelqu'un: j'envoie un message à Paul.",
          examples: [
            { target: "J'envoie un message à Claire.", base: 'Le mando un mensaje a Claire.' },
            { target: 'Tu as reçu mon mail?', base: '¿Recibiste mi mail?' },
          ],
        },
        takeaways: [
          "Conjugas envoyer (j'envoie) y recevoir (je reçois).",
          "Cuentas lo que mandaste o recibiste con j'ai envoyé y j'ai reçu.",
        ],
        exercises: [
          ex.translationChoice(
            'envoyer',
            'mandar',
            ['recibir', 'llamar', 'descargar'],
            ['fr-envoyer'],
            { id: 'fr.ex.m7auumvvmfptip' },
          ),
          ex.matchPairs(
            [
              ['envoyer', 'mandar'],
              ['recevoir', 'recibir'],
              ['le message', 'el mensaje'],
              ['le mail', 'el mail'],
            ],
            ['fr-envoyer', 'fr-recevoir', 'fr-le-message', 'fr-le-mail'],
            { id: 'fr.ex.9o5s9wypreyyh4' },
          ),
          ex.fillBlank(
            "J'___ un message à Paul.",
            'Le mando un mensaje a Paul.',
            'envoie',
            ['envoyer', 'envoies', 'envoyez'],
            ['fr-envoyer', 'fr-le-message'],
            {
              id: 'fr.ex.mlbwmzlqum7mmm',
              explanation: "Con je: j'envoie (la y pasa a i). Envoyez es con vous.",
            },
          ),
          ex.fillBlank(
            'Je ___ beaucoup de mails.',
            'Recibo muchos mails.',
            'reçois',
            ['recevoir', 'reçoit', 'recevez'],
            ['fr-recevoir', 'fr-le-mail'],
            {
              id: 'fr.ex.2vtnku7d71mxre',
              explanation: 'Con je: je reçois, con s. Il reçoit lleva t.',
            },
          ),
          ex.listenChoice(
            "J'ai envoyé un mail.",
            ["J'envoie un mail.", "J'ai reçu un mail."],
            ['fr-envoyer', 'fr-le-mail'],
            {
              id: 'fr.ex.41fet64qbfuclx',
              explanation: "J'ai envoyé (pasado) empieza con j'ai; j'envoie, no.",
            },
          ),
          ex.translationChoice(
            'recevoir',
            'recibir',
            ['mandar', 'funcionar', 'ver'],
            ['fr-recevoir'],
            { id: 'fr.ex.1id2jve1upspfu' },
          ),
          ex.fillBlank(
            'Tu as reçu ___ message?',
            '¿Recibiste mi mensaje?',
            'mon',
            ['ma', 'mes'],
            ['fr-le-message', 'fr-recevoir'],
            {
              id: 'fr.ex.ue70w7h312uxc5',
              explanation: 'Message es masculino singular: mon message.',
            },
          ),
          ex.orderWords(
            'Il envoie un message à sa mère.',
            'Le manda un mensaje a su mamá.',
            ['fr-envoyer', 'fr-le-message'],
            { id: 'fr.ex.r7i6op5xalvrrn' },
          ),
          ex.translateWrite(
            '¿Recibiste mi mail?',
            'Tu as reçu mon mail?',
            ['fr-recevoir', 'fr-le-mail'],
            {
              id: 'fr.ex.2u6z4wnfys9igt',
              acceptedAnswers: ['Est-ce que tu as reçu mon mail?', 'As-tu reçu mon mail?'],
            },
          ),
          ex.shortAnswer(
            'Tu envoies un message à Léa?',
            '¿Le mandas un mensaje a Léa? (Responde que sí.)',
            "Oui, j'envoie un message à Léa.",
            ["Oui, j'envoie un message à Léa", 'Oui, je lui envoie un message.'],
            ['fr-envoyer', 'fr-le-message'],
            { id: 'fr.ex.bemfhq0zpa8j47' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Appeler et télécharger',
        objective: 'Llamar, descargar apps y hablar de contraseñas y de estar en línea.',
        intro: {
          explanation:
            "Appeler (llamar) duplica la l cuando la terminación no suena: j'appelle, tu appelles, il appelle, ils appellent; pero nous appelons, vous appelez. En j'appelle la e suena abierta; en appeler y appelez casi no suena. Télécharger es descargar: je télécharge une appli. Le mot de passe es la contraseña y en ligne, en línea. Y un dato: ça marche! también quiere decir ¡dale!",
          examples: [
            { target: "J'appelle ma mère ce soir.", base: 'Llamo a mi mamá esta noche.' },
            { target: 'Je fais les courses en ligne.', base: 'Hago las compras en línea.' },
          ],
        },
        takeaways: [
          "Conjugas appeler: j'appelle con ll, vous appelez con una sola l.",
          'Hablas de descargar, de contraseñas y de estar en línea.',
        ],
        exercises: [
          ex.translationChoice(
            'télécharger',
            'descargar',
            ['mandar', 'llamar', 'recibir'],
            ['fr-telecharger'],
            { id: 'fr.ex.j9f7ke86vi656h' },
          ),
          ex.fillBlank(
            'Vous ___ Paul ce soir?',
            '¿Llama a Paul esta noche?',
            'appelez',
            ['appelle', 'appelons', 'appellent'],
            ['fr-appeler'],
            {
              id: 'fr.ex.sjaz8g889ca7x6',
              explanation: 'Con vous: vous appelez, con una sola l.',
            },
          ),
          ex.listenChoice(
            "J'appelle Paul.",
            ["J'ai appelé Paul.", 'Il appelle Paul.'],
            ['fr-appeler'],
            {
              id: 'fr.ex.n79vncqc8dhfv2',
              explanation: "J'appelle es presente; j'ai appelé, pasado.",
            },
          ),
          ex.orderWords(
            'Je fais les courses en ligne.',
            'Hago las compras en línea.',
            ['fr-en-ligne'],
            { id: 'fr.ex.sskvqiv4jhyha4' },
          ),
          ex.translationChoice(
            'le mot de passe',
            'la contraseña',
            ['la palabra', 'la pantalla', 'el mensaje'],
            ['fr-le-mot-de-passe'],
            {
              id: 'fr.ex.osnjyyvh3l3iz0',
              explanation: 'Mot es palabra, pero le mot de passe es la contraseña.',
            },
          ),
          question(
            'fr.ex.ht2aqq3ybk4r2u',
            MAIL,
            '¿Qué problema tiene Inès?',
            'Su celular no funciona.',
            ['Perdió la computadora.', 'No tiene internet.', 'Su hermana tiene su celular.'],
            ['fr-le-portable', 'fr-marcher'],
            "Inès escribe «Mon portable ne marche pas: l'écran est tout noir».",
          ),
          question(
            'fr.ex.tyfveslaqu3z53',
            MAIL,
            '¿Desde dónde manda el mail?',
            'Desde la computadora de su hermana.',
            ['Desde su celular.', 'Desde la computadora de su hermano.', 'Desde la oficina.'],
            ['fr-l-ordinateur', 'fr-envoyer', 'fr-le-mail'],
            "Inès escribe «Je t'envoie ce mail de l'ordinateur de ma sœur».",
          ),
          question(
            'fr.ex.g3ieaveacff2ro',
            MAIL,
            '¿Qué no recibió Inès?',
            'El mensaje de Julien del sábado.',
            ['Un mail de su hermana.', 'La contraseña de la app.', 'Una llamada de Julien.'],
            ['fr-recevoir', 'fr-le-message'],
            "Inès escribe «Je n'ai pas reçu ton message de samedi».",
          ),
          ex.translateWrite(
            'Me olvidé la contraseña.',
            "J'ai oublié mon mot de passe.",
            ['fr-le-mot-de-passe'],
            { id: 'fr.ex.mxt5c9mew8sbjg', acceptedAnswers: ["J'ai oublié le mot de passe."] },
          ),
          ex.translateWrite(
            'Descargo la app y llamo a mi hermano.',
            "Je télécharge l'appli et j'appelle mon frère.",
            ['fr-telecharger', 'fr-appeler', 'fr-l-appli'],
            { id: 'fr.ex.m4xlt9jc76gxf3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Je l'appelle, je les vois",
        objective: "Reemplazar a una persona o una cosa con le, la, l' y les.",
        intro: {
          explanation:
            "Con verbos sin à, como appeler o voir, la persona o la cosa se reemplaza con le (masculino), la (femenino), l' (delante de vocal) o les (plural), y el pronombre va delante del verbo: Paul? Je l'appelle. En la negación queda pegado al verbo: je ne l'appelle pas. Con un infinitivo va delante del infinitivo: je vais l'appeler (voy a llamarlo). Escucha la diferencia: je le vois (e muda) y je les vois (e cerrada, como en el español «mes»).",
          examples: [
            { target: "Paul? Je l'appelle demain.", base: '¿Paul? Lo llamo mañana.' },
            {
              target: 'Mes parents? Je les vois le dimanche.',
              base: '¿Mis padres? Los veo los domingos.',
            },
          ],
        },
        takeaways: [
          "Pones le, la, l' o les delante del verbo.",
          "Dices je ne l'appelle pas y je vais l'appeler.",
        ],
        exercises: [
          ex.translationChoice(
            "je l'appelle",
            'lo llamo',
            ['los veo', 'me llamo', 'llamo'],
            ['fr-je-l-appelle'],
            {
              id: 'fr.ex.him09o0p6a8hcc',
              explanation: "Je l'appelle es lo llamo (o la llamo); je m'appelle es me llamo.",
            },
          ),
          ex.translationChoice(
            'je les vois',
            'los veo',
            ['lo llamo', 'los llamo', 'veo'],
            ['fr-je-les-vois'],
            { id: 'fr.ex.1jdm5si8fqg1if' },
          ),
          ex.listenChoice('Je les vois.', ['Je le vois.', 'Je la vois.'], ['fr-je-les-vois'], {
            id: 'fr.ex.ul8nh8y7tgq5cu',
            explanation: 'Les suena con e cerrada; le, con e muda.',
          }),
          ex.fillBlank(
            'Ma sœur? Je ___ demain.',
            '¿Mi hermana? La llamo mañana.',
            "l'appelle",
            ['la appelle', 'les appelle', "m'appelle"],
            ['fr-je-l-appelle'],
            {
              id: 'fr.ex.vtetcnj7hs0eoi',
              explanation: "Delante de vocal, la se vuelve l': je l'appelle.",
            },
          ),
          ex.fillBlank(
            'Mes parents? Je ___ vois le dimanche.',
            '¿Mis padres? Los veo los domingos.',
            'les',
            ['le', 'la', 'mes'],
            ['fr-je-les-vois'],
            { id: 'fr.ex.8j5fd5hrqi70ml', explanation: 'Parents es plural: je les vois.' },
          ),
          ex.orderWords("Je ne l'appelle pas.", 'No lo llamo.', ['fr-je-l-appelle'], {
            id: 'fr.ex.5rju09q64szxdq',
          }),
          ex.fillBlank(
            'Paul? Je vais ___ ce soir.',
            '¿Paul? Lo voy a llamar esta noche.',
            "l'appeler",
            ['appeler le', "l'appelle", 'appeler'],
            ['fr-je-l-appelle', 'fr-appeler'],
            {
              id: 'fr.ex.qbrsfp9s9hjnw5',
              explanation:
                "Con un infinitivo, el pronombre va delante del infinitivo: je vais l'appeler.",
            },
          ),
          question(
            'fr.ex.vggasiylbrxw5o',
            MAIL,
            '¿Qué le pide Inès a Julien?',
            'Que la llame por la computadora a las nueve.',
            [
              'Que le mande un mensaje al celular.',
              'Que le descargue una app.',
              'Que la llame al celular el sábado.',
            ],
            ['fr-appeler', 'fr-en-ligne'],
            "Inès escribe «je suis en ligne à neuf heures: appelle-moi sur l'ordinateur».",
          ),
          ex.translateWrite(
            '¿Tus padres? Los veo el sábado.',
            'Tes parents? Je les vois samedi.',
            ['fr-je-les-vois'],
            {
              id: 'fr.ex.szn778kxofelnu',
              acceptedAnswers: ['Tes parents? Je les vois le samedi.'],
            },
          ),
          ex.shortAnswer(
            'Tu appelles Claire ce soir?',
            '¿Llamas a Claire esta noche? (Responde que sí, con un pronombre.)',
            "Oui, je l'appelle ce soir.",
            ["Oui, je l'appelle.", "Oui, je vais l'appeler ce soir.", "Oui, je vais l'appeler."],
            ['fr-je-l-appelle'],
            { id: 'fr.ex.zuhzj68038osrg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Je lui écris, je leur parle',
        objective: 'Reemplazar a una persona con lui y leur.',
        intro: {
          explanation:
            "Con verbos que llevan à (parler à, écrire à, envoyer à, téléphoner à), la persona se reemplaza con lui (a él o a ella) o leur (a ellos o a ellas), delante del verbo: ma sœur? Je lui écris. Leur nunca lleva s. Ojo con la diferencia con el español: appeler va sin à (je l'appelle), pero téléphoner lleva à (je lui téléphone), aunque en español los dos sean «la llamo». Escucha: lui y leur se distinguen por la vocal.",
          examples: [
            { target: 'Ma sœur? Je lui écris souvent.', base: '¿Mi hermana? Le escribo seguido.' },
            {
              target: 'Mes grands-parents? Je leur parle tous les jours.',
              base: '¿Mis abuelos? Les hablo todos los días.',
            },
          ],
        },
        takeaways: [
          'Usas lui y leur con parler à, écrire à y envoyer à.',
          "Distingues je l'appelle de je lui téléphone.",
        ],
        exercises: [
          ex.translationChoice(
            'je lui écris',
            'le escribo',
            ['les hablo', 'lo llamo', 'los veo'],
            ['fr-je-lui-ecris'],
            { id: 'fr.ex.74t1pv5bffs3jh' },
          ),
          ex.fillBlank(
            'Mes grands-parents? Je ___ parle tous les dimanches.',
            '¿Mis abuelos? Les hablo todos los domingos.',
            'leur',
            ['leurs', 'les', 'lui'],
            ['fr-je-leur-parle'],
            {
              id: 'fr.ex.4bgt5ks4o4bgo8',
              explanation: 'Parler à: objeto indirecto. En plural, leur, sin s.',
            },
          ),
          ex.listenChoice(
            'Je leur parle.',
            ['Je lui parle.', 'Je parle.'],
            ['fr-je-leur-parle', 'fr-je-lui-ecris'],
            { id: 'fr.ex.c1aws96pcgjf1l' },
          ),
          ex.fillBlank(
            'Paul? Je ___ écris un mail.',
            '¿Paul? Le escribo un mail.',
            'lui',
            ['le', "l'", 'leur'],
            ['fr-je-lui-ecris', 'fr-le-mail'],
            {
              id: 'fr.ex.jvzciae52qfs43',
              explanation: 'Écrire à: a una persona, lui (sirve para él y para ella).',
            },
          ),
          ex.fillBlank(
            'Claire? Je ___ téléphone ce soir.',
            '¿Claire? La llamo esta noche.',
            'lui',
            ['la', "l'", 'les'],
            ['fr-je-lui-ecris'],
            {
              id: 'fr.ex.3yu49jkcld2ntz',
              explanation: "Téléphoner lleva à: je lui téléphone. Con appeler sería je l'appelle.",
            },
          ),
          question(
            'fr.ex.eqqyo467txjvbk',
            GRANDS_PARENTS,
            '¿Cuándo llama Marc a sus abuelos?',
            'Todos los domingos.',
            ['Todos los días.', 'Los sábados.', 'Nunca los llama.'],
            ['fr-appeler'],
            'Marc dice «je les appelle tous les dimanches».',
          ),
          question(
            'fr.ex.4xlh9n2902sga9',
            GRANDS_PARENTS,
            '¿Qué hace Chloé con su abuela?',
            'Le escribe mails, porque no mira el celular.',
            [
              'Le manda mensajes al celular.',
              'La llama todos los domingos.',
              'Le habla por la computadora.',
            ],
            ['fr-je-lui-ecris', 'fr-le-mail'],
            'Chloé dice que la abuela «ne regarde pas son portable» y «je lui écris des mails».',
          ),
          question(
            'fr.ex.s5og4m8wedtd8j',
            GRANDS_PARENTS,
            '¿Cómo habla Marc con los abuelos además de llamarlos?',
            'En línea por la computadora, y los ve en la pantalla.',
            ['Les manda fotos al celular.', 'Les escribe mails.', 'Va a verlos a su casa.'],
            ['fr-je-leur-parle', 'fr-je-les-vois', 'fr-en-ligne'],
            "Marc dice «je leur parle en ligne sur l'ordinateur: je les vois sur l'écran».",
          ),
          ex.translateWrite(
            '¿Tu mamá? Le escribo un mensaje.',
            'Ta mère? Je lui écris un message.',
            ['fr-je-lui-ecris', 'fr-le-message'],
            { id: 'fr.ex.htkou2gq4ws8rv', acceptedAnswers: ['Ta mère? Je lui envoie un message.'] },
          ),
          ex.shortAnswer(
            'Tu parles souvent à tes parents?',
            '¿Hablas seguido con tus padres? (Responde que sí, que les hablas todos los días.)',
            'Oui, je leur parle tous les jours.',
            ['Oui, je leur parle tous les jours', 'Oui, je leur parle souvent.'],
            ['fr-je-leur-parle'],
            { id: 'fr.ex.91ygu0tzwck4bb' },
          ),
        ],
      },
    ],
  },
};
