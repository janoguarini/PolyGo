import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U1 «Saludos y presentaciones» (docs/FR_A1_A2.md): saludar y despedirse según la hora y
 * el registro (tu / vous), preguntar cómo está alguien y presentarse con je m'appelle.
 * Pronunciación: consonantes finales mudas (salut, s'il vous plaît, comment), la elisión
 * (je m'appelle, s'il). Cultura: se dice bonjour al entrar a un negocio; madame / monsieur con vous.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const BOULANGERIE = dialogue(
  'fr.stim.a1-u1-boulangerie',
  'Una clienta entra a una panadería por la mañana.',
  [
    ['Claire', 'Bonjour, monsieur!'],
    ['Paul', 'Bonjour, madame. Ça va?'],
    ['Claire', 'Ça va bien, merci. Et vous?'],
    ['Paul', 'Ça va bien, merci.'],
  ],
  FR_A1_RATE,
);

const FETE = dialogue(
  'fr.stim.a1-u1-fete',
  'Dos jóvenes se conocen en una reunión de amigos.',
  [
    ['Léa', "Salut! Je m'appelle Léa. Tu t'appelles comment?"],
    ['Hugo', "Salut, Léa! Je m'appelle Hugo."],
    ['Léa', 'Enchantée, Hugo!'],
    ['Hugo', 'Enchanté! Ça va?'],
    ['Léa', 'Oui, ça va bien. Et toi?'],
  ],
  FR_A1_RATE,
);

const MESSAGE = reading(
  'fr.stim.a1-u1-message',
  'message',
  'Un mensaje de Sophie a su amigo Thomas.',
  ['Salut, Thomas!', 'Ça va?', 'Merci beaucoup!', 'À bientôt!', 'Sophie'],
  { from: 'Sophie', to: 'Thomas' },
);

export const FR_A1_U01: FrUnitDef = {
  names: ['Claire', 'Paul', 'Léa', 'Hugo', 'Sophie', 'Thomas', 'Ana', 'Lucas', 'Marie'],
  support: ['beaucoup', 'moi'],
  unit: {
    position: 1,
    title: 'Saludos y presentaciones',
    titleEn: 'Bonjour!',
    description:
      "Saludar y despedirse, tu y vous, ça va, je m'appelle. Consonantes finales mudas y elisión.",
    emoji: '👋',
    objective:
      'Podés saludar y despedirte según la hora y la persona, preguntar cómo está alguien, presentarte y decir tu nombre.',
    grammar: {
      title: "Tu y vous · je m'appelle",
      explanation:
        "Con amigos, familia y chicos se usa tu (salut, s'il te plaît, et toi?); con desconocidos, en un negocio o con una persona mayor, vous (bonjour, s'il vous plaît, et vous?), junto con madame o monsieur. Para presentarse: je m'appelle + nombre. Delante de vocal, me se vuelve m' (elisión): je m'appelle, nunca «je me appelle». Muchas consonantes finales no suenan: en salut y en s'il vous plaît, la t final no se pronuncia.",
      examples: [
        { target: 'Bonjour, madame.', base: 'Buen día, señora.' },
        { target: "Salut! Je m'appelle Lucas.", base: '¡Hola! Me llamo Lucas.' },
        { target: 'Ça va? — Ça va bien, merci.', base: '¿Cómo va? — Bien, gracias.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U1). Sin revisión nativa: revisar el registro de bonsoir (desde la tarde-noche) y el uso de salut para despedirse.',
    },
    words: [
      w('fr-bonjour', 'bonjour', 'hola', 'Bonjour, madame.', 'Buen día, señora.', ['greetings'], {
        acceptedTranslations: ['buen día', 'buenos días'],
        emoji: '👋',
      }),
      w(
        'fr-salut',
        'salut',
        'hola o chau (informal)',
        'Salut, Hugo!',
        '¡Hola, Hugo!',
        ['greetings'],
        { acceptedTranslations: ['hola, informal'] },
      ),
      w(
        'fr-bonsoir',
        'bonsoir',
        'buenas noches (al llegar)',
        'Bonsoir, monsieur.',
        'Buenas noches, señor.',
        ['greetings'],
        { acceptedTranslations: ['buenas tardes'] },
      ),
      w(
        'fr-au-revoir',
        'au revoir',
        'adiós',
        'Au revoir, madame.',
        'Adiós, señora.',
        ['greetings'],
        { acceptedTranslations: ['chau', 'hasta luego'] },
      ),
      w(
        'fr-a-bientot',
        'à bientôt',
        'hasta pronto',
        'Au revoir, Marie. À bientôt!',
        'Chau, Marie. ¡Hasta pronto!',
        ['greetings'],
        { acceptedTranslations: ['nos vemos'] },
      ),
      w('fr-merci', 'merci', 'gracias', 'Merci, monsieur.', 'Gracias, señor.', ['courtesy'], {
        emoji: '🙏',
      }),
      w('fr-de-rien', 'de rien', 'de nada', 'Merci! — De rien.', '¡Gracias! — De nada.', [
        'courtesy',
      ]),
      w(
        'fr-s-il-vous-plait',
        "s'il vous plaît",
        'por favor (formal)',
        "Madame, s'il vous plaît!",
        '¡Señora, por favor!',
        ['courtesy'],
        { acceptedTexts: ["s'il vous plaît"] },
      ),
      w(
        'fr-s-il-te-plait',
        "s'il te plaît",
        'por favor, informal',
        "Hugo, s'il te plaît!",
        '¡Hugo, por favor!',
        ['courtesy'],
        { acceptedTexts: ["s'il te plaît"] },
      ),
      w('fr-oui', 'oui', 'sí', 'Ça va? — Oui, ça va bien.', '¿Todo bien? — Sí, estoy bien.', [
        'basics',
      ]),
      w('fr-non', 'non', 'no', 'Non, merci.', 'No, gracias.', ['basics']),
      w(
        'fr-ca-va',
        'ça va?',
        '¿cómo va?',
        'Salut, Léa! Ça va?',
        '¡Hola, Léa! ¿Cómo va?',
        ['greetings'],
        {
          acceptedTranslations: ['¿todo bien?', '¿cómo estás?'],
        },
      ),
      w(
        'fr-ca-va-bien',
        'ça va bien',
        'estoy bien',
        'Ça va bien, merci.',
        'Estoy bien, gracias.',
        ['greetings'],
        { acceptedTranslations: ['bien'] },
      ),
      w(
        'fr-et-toi',
        'et toi?',
        '¿y vos?',
        'Ça va bien. Et toi?',
        'Estoy bien. ¿Y vos?',
        ['greetings'],
        {
          acceptedTranslations: ['¿y tú?'],
        },
      ),
      w(
        'fr-et-vous',
        'et vous?',
        '¿y usted?',
        'Ça va bien, merci. Et vous?',
        'Estoy bien, gracias. ¿Y usted?',
        ['greetings'],
        { acceptedTranslations: ['¿y ustedes?'] },
      ),
      w(
        'fr-je-m-appelle',
        "je m'appelle",
        'me llamo',
        "Je m'appelle Ana.",
        'Me llamo Ana.',
        ['introductions'],
        { acceptedTexts: ["je m'appelle"] },
      ),
      w(
        'fr-tu-t-appelles-comment',
        "tu t'appelles comment?",
        '¿cómo te llamás?',
        "Salut! Tu t'appelles comment?",
        '¡Hola! ¿Cómo te llamás?',
        ['introductions', 'questions'],
        { acceptedTranslations: ['¿cómo te llamas?'], acceptedTexts: ["tu t'appelles comment?"] },
      ),
      w(
        'fr-enchante',
        'enchanté',
        'encantado',
        "Je m'appelle Paul. — Enchantée!",
        'Me llamo Paul. — ¡Encantada!',
        ['introductions'],
        { acceptedTranslations: ['encantada', 'mucho gusto'], acceptedTexts: ['enchantée'] },
      ),
      w('fr-madame', 'madame', 'señora', 'Bonjour, madame!', '¡Buen día, señora!', ['courtesy']),
      w('fr-monsieur', 'monsieur', 'señor', 'Merci, monsieur.', 'Gracias, señor.', ['courtesy']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Bonjour, salut, au revoir',
        objective: 'Saludar y despedirse según la hora y la persona.',
        intro: {
          explanation:
            'Bonjour sirve todo el día (y se dice siempre al entrar a un negocio); bonsoir, desde la tarde-noche. Salut es informal: hola o chau entre amigos. Para despedirse: au revoir o à bientôt. Con un desconocido se agrega madame o monsieur. Ojo: la t de salut no suena.',
          examples: [
            { target: 'Bonjour, madame.', base: 'Buen día, señora.' },
            { target: 'Salut, Hugo!', base: '¡Hola, Hugo!' },
          ],
        },
        takeaways: [
          'Saludás con bonjour, bonsoir o salut según la hora y la persona.',
          'Te despedís con au revoir y à bientôt.',
        ],
        exercises: [
          ex.translationChoice('bonjour', 'hola', ['adiós', 'gracias', 'de nada'], ['fr-bonjour'], {
            id: 'fr.ex.o9jf6r7edsp958',
          }),
          ex.translationChoice(
            'au revoir',
            'adiós',
            ['hola', 'buenas noches (al llegar)', 'por favor (formal)'],
            ['fr-au-revoir'],
            { id: 'fr.ex.u5az9zbloj8zqx' },
          ),
          ex.matchPairs(
            [
              ['bonjour', 'hola'],
              ['bonsoir', 'buenas noches (al llegar)'],
              ['au revoir', 'adiós'],
              ['à bientôt', 'hasta pronto'],
            ],
            ['fr-bonjour', 'fr-bonsoir', 'fr-au-revoir', 'fr-a-bientot'],
            { id: 'fr.ex.drz5enznhgrujg' },
          ),
          ex.listenChoice(
            'Bonsoir, madame.',
            ['Bonjour, madame.', 'Bonsoir, monsieur.', 'Au revoir, madame.'],
            ['fr-bonsoir', 'fr-madame'],
            { id: 'fr.ex.dqaje0tpbc3n2b' },
          ),
          ex.fillBlank(
            '___, Hugo!',
            '¡Hola, Hugo!',
            'Salut',
            ['Monsieur', 'Madame', 'Bonsoir'],
            ['fr-salut'],
            {
              id: 'fr.ex.d8yc18lsmxjwoy',
              skill: 'vocabulary',
              explanation: 'Con un amigo se saluda con salut. La t final no suena.',
            },
          ),
          ex.fillBlank(
            'Bonjour, ___!',
            '¡Buen día, señor!',
            'monsieur',
            ['madame', 'salut', 'bonsoir'],
            ['fr-bonjour', 'fr-monsieur'],
            {
              id: 'fr.ex.tjsnrspyu92x5x',
              skill: 'vocabulary',
              explanation: 'Monsieur es señor y madame, señora. En monsieur, la r final no suena.',
            },
          ),
          ex.translationChoice(
            'salut',
            'hola o chau (informal)',
            ['señora', 'señor', 'hasta pronto'],
            ['fr-salut'],
            {
              id: 'fr.ex.tyra6872rwjhtf',
            },
          ),
          ex.listenChoice(
            'Au revoir, monsieur. À bientôt!',
            [
              'Bonjour, monsieur. À bientôt!',
              'Au revoir, madame. À bientôt!',
              'Bonsoir, monsieur!',
            ],
            ['fr-au-revoir', 'fr-a-bientot'],
            { id: 'fr.ex.vstopr09unwu5v' },
          ),
          ex.translateWrite('Buen día, señora.', 'Bonjour, madame.', ['fr-bonjour', 'fr-madame'], {
            id: 'fr.ex.8vgo34w8uex4yl',
          }),
          ex.translateWrite(
            'Adiós, señor.',
            'Au revoir, monsieur.',
            ['fr-au-revoir', 'fr-monsieur'],
            {
              id: 'fr.ex.6ca1biapzrcvt6',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "Merci, s'il vous plaît",
        objective: 'Agradecer, pedir por favor y responder sí o no.',
        intro: {
          explanation:
            "Merci es gracias y de rien, de nada. Por favor tiene dos formas: s'il vous plaît (con vous, formal) y s'il te plaît (con tu, entre amigos). En las dos, la t final de plaît no se pronuncia. Oui es sí y non, no.",
          examples: [
            { target: 'Merci, madame. — De rien.', base: 'Gracias, señora. — De nada.' },
            { target: 'Non, merci.', base: 'No, gracias.' },
          ],
        },
        takeaways: [
          'Agradecés con merci y respondés de rien.',
          "Elegís s'il vous plaît o s'il te plaît según la persona.",
        ],
        exercises: [
          ex.translationChoice('merci', 'gracias', ['de nada', 'adiós', 'sí'], ['fr-merci'], {
            id: 'fr.ex.f0n8xcv6js30gy',
          }),
          ex.translationChoice(
            "s'il vous plaît",
            'por favor (formal)',
            ['por favor, informal', 'de nada', 'hasta pronto'],
            ['fr-s-il-vous-plait'],
            {
              id: 'fr.ex.knft23wdn0jj05',
              explanation: "S'il vous plaît va con vous (formal); s'il te plaît, con tu.",
            },
          ),
          ex.matchPairs(
            [
              ['merci', 'gracias'],
              ['de rien', 'de nada'],
              ['oui', 'sí'],
              ['non', 'no'],
            ],
            ['fr-merci', 'fr-de-rien', 'fr-oui', 'fr-non'],
            { id: 'fr.ex.z5xb417fvi0dq3' },
          ),
          ex.listenChoice(
            'Merci, monsieur. — De rien.',
            ['Merci, madame. — De rien.', 'Non, merci, monsieur.', 'Oui, merci, monsieur.'],
            ['fr-merci', 'fr-de-rien'],
            { id: 'fr.ex.hkagof31e8ogg4' },
          ),
          ex.fillBlank(
            "Hugo, s'il ___ plaît!",
            '¡Hugo, por favor!',
            'te',
            ['vous', 'moi', 'beaucoup'],
            ['fr-s-il-te-plait'],
            {
              id: 'fr.ex.1rlwaw1gt9gm10',
              explanation: "Con un amigo (tu): s'il te plaît. S'il vous plaît es para vous.",
            },
          ),
          ex.fillBlank(
            'Merci! — De ___.',
            '¡Gracias! — De nada.',
            'rien',
            ['merci', 'oui', 'beaucoup'],
            ['fr-de-rien'],
            { id: 'fr.ex.uiqppcl6qm6cuz', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "Madame, s'il ___ plaît.",
            'Señora, por favor.',
            'vous',
            ['te', 'moi', 'beaucoup'],
            ['fr-s-il-vous-plait'],
            {
              id: 'fr.ex.9ldd5wb5cvu9zz',
              explanation: "Con madame o monsieur se usa vous: s'il vous plaît.",
            },
          ),
          ex.translationChoice(
            'de rien',
            'de nada',
            ['gracias', 'sí', 'por favor (formal)'],
            ['fr-de-rien'],
            {
              id: 'fr.ex.yf18xtqz2nd6fw',
            },
          ),
          ex.translateWrite('Sí, gracias.', 'Oui, merci.', ['fr-oui', 'fr-merci'], {
            id: 'fr.ex.rsgbg6l76spp85',
          }),
          ex.shortAnswer(
            'Merci beaucoup!',
            '¡Muchas gracias! (Respondé «de nada».)',
            'De rien.',
            ['De rien!'],
            ['fr-de-rien'],
            { id: 'fr.ex.6kdoooc6y8cnmq' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Ça va?',
        objective: 'Preguntar y responder cómo está alguien.',
        intro: {
          explanation:
            'Ça va? (¿cómo va?) es la pregunta más común; se responde ça va bien o, más corto, ça va. Para devolver la pregunta: et toi? a un amigo y et vous? a alguien con quien usás vous. La ç con cedilla suena como una s: ça, nunca «ka».',
          examples: [
            { target: 'Ça va? — Ça va bien, merci.', base: '¿Cómo va? — Bien, gracias.' },
            { target: 'Ça va bien. Et vous?', base: 'Estoy bien. ¿Y usted?' },
          ],
        },
        takeaways: [
          'Preguntás ça va? y respondés ça va bien.',
          'Devolvés la pregunta con et toi? o et vous?',
        ],
        exercises: [
          ex.translationChoice(
            'ça va?',
            '¿cómo va?',
            ['¿y vos?', '¿cómo te llamás?', 'estoy bien'],
            ['fr-ca-va'],
            { id: 'fr.ex.h8e0s7hf3yzuf7' },
          ),
          ex.translationChoice(
            'et vous?',
            '¿y usted?',
            ['¿y vos?', '¿cómo va?', 'gracias'],
            ['fr-et-vous'],
            {
              id: 'fr.ex.5arw8xm8usd39p',
              explanation:
                'Et vous? es para alguien a quien tratás de vous; et toi?, para un amigo.',
            },
          ),
          ex.listenChoice(
            'Ça va bien. Et toi?',
            ['Ça va bien. Et vous?', 'Ça va? Et toi?', 'Oui, ça va bien.'],
            ['fr-ca-va-bien', 'fr-et-toi'],
            { id: 'fr.ex.a4gcox7zqypplp' },
          ),
          ex.fillBlank(
            'Salut, Léa! Ça va? — Oui, ça va bien. Et ___?',
            '¡Hola, Léa! ¿Cómo va? — Sí, bien. ¿Y vos?',
            'toi',
            ['vous', 'moi', 'te'],
            ['fr-et-toi'],
            {
              id: 'fr.ex.eizx7crwmbxnh0',
              explanation: 'Entre amigos (salut) se pregunta et toi?',
            },
          ),
          ex.fillBlank(
            'Bonjour, monsieur. Ça va bien, merci. Et ___?',
            'Buen día, señor. Estoy bien, gracias. ¿Y usted?',
            'vous',
            ['toi', 'moi', 'te'],
            ['fr-et-vous'],
            {
              id: 'fr.ex.dhv71qmnsfinik',
              explanation: 'Con monsieur o madame se usa vous: et vous?',
            },
          ),
          ex.matchPairs(
            [
              ['ça va?', '¿cómo va?'],
              ['ça va bien', 'estoy bien'],
              ['et toi?', '¿y vos?'],
              ['et vous?', '¿y usted?'],
            ],
            ['fr-ca-va', 'fr-ca-va-bien', 'fr-et-toi', 'fr-et-vous'],
            { id: 'fr.ex.37oj0yce5eq6rj' },
          ),
          question(
            'fr.ex.digh5uc2c4tkhf',
            BOULANGERIE,
            '¿Cómo está Claire?',
            'Bien.',
            ['Mal.', 'No lo dice.', 'Cansada.'],
            ['fr-ca-va-bien'],
            'Claire responde «Ça va bien, merci»: está bien.',
          ),
          question(
            'fr.ex.pqm0241v7fdtlo',
            BOULANGERIE,
            '¿Cómo tratan Claire y Paul?',
            'De vous: se dicen madame y monsieur.',
            ['De tu: son amigos.', 'Claire usa tu y Paul, vous.', 'No se saludan.'],
            ['fr-et-vous', 'fr-madame', 'fr-monsieur'],
            'Se saludan con «Bonjour, monsieur», «Bonjour, madame» y Claire pregunta «Et vous?».',
          ),
          ex.translateWrite(
            'Estoy bien, gracias. ¿Y usted?',
            'Ça va bien, merci. Et vous?',
            ['fr-ca-va-bien', 'fr-et-vous'],
            {
              id: 'fr.ex.58w1pwfdzho2ck',
              acceptedAnswers: ['Ça va bien, merci, et vous?', 'Ça va, merci. Et vous?'],
            },
          ),
          ex.shortAnswer(
            'Salut! Ça va?',
            '¡Hola! ¿Cómo va? (Respondé que estás bien y preguntale a tu amigo.)',
            'Ça va bien, et toi?',
            [
              'Ça va bien. Et toi?',
              'Oui, ça va bien, et toi?',
              'Ça va bien, merci, et toi?',
              'Ça va, et toi?',
            ],
            ['fr-ca-va-bien', 'fr-et-toi'],
            { id: 'fr.ex.5ont9m4142qhv4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Je m'appelle…",
        objective: 'Presentarse y preguntar el nombre.',
        intro: {
          explanation:
            "Para decir tu nombre: je m'appelle + nombre. Me pierde la e delante de vocal (elisión): je m'appelle, nunca «je me appelle». Para preguntar: tu t'appelles comment? Al conocer a alguien se dice enchanté; una mujer escribe enchantée, pero suena igual.",
          examples: [
            { target: "Je m'appelle Ana.", base: 'Me llamo Ana.' },
            { target: "Tu t'appelles comment?", base: '¿Cómo te llamás?' },
          ],
        },
        takeaways: [
          "Decís tu nombre con je m'appelle.",
          'Preguntás el nombre y respondés enchanté o enchantée.',
        ],
        exercises: [
          ex.translationChoice(
            "je m'appelle",
            'me llamo',
            ['¿cómo te llamás?', 'encantado', 'estoy bien'],
            ['fr-je-m-appelle'],
            { id: 'fr.ex.o6r30ind500orh' },
          ),
          ex.translationChoice(
            'enchanté',
            'encantado',
            ['de nada', 'hasta pronto', 'me llamo'],
            ['fr-enchante'],
            { id: 'fr.ex.gjuhzha18x2nd8' },
          ),
          ex.listenChoice(
            "Tu t'appelles comment?",
            ["Je m'appelle Hugo.", 'Ça va? Et toi?', 'Enchanté, Hugo!'],
            ['fr-tu-t-appelles-comment'],
            { id: 'fr.ex.vtgjfzwmyi6vei' },
          ),
          ex.fillBlank(
            'Je ___ Lucas.',
            'Me llamo Lucas.',
            "m'appelle",
            ["t'appelles", 'enchanté', 'merci'],
            ['fr-je-m-appelle'],
            {
              id: 'fr.ex.f8tephjhembi7v',
              explanation: "Con je: je m'appelle. Tu t'appelles es con tu.",
            },
          ),
          ex.fillBlank(
            "Je m'appelle Paul. — ___, Paul! Je m'appelle Marie.",
            'Me llamo Paul. — ¡Encantada, Paul! Me llamo Marie.',
            'Enchantée',
            ['Merci', 'De rien', 'Au revoir'],
            ['fr-enchante'],
            {
              id: 'fr.ex.lwpmkam92ddrsp',
              skill: 'vocabulary',
              explanation: 'Marie es mujer: enchantée, con una e más que no se pronuncia.',
            },
          ),
          ex.orderWords(
            "Tu t'appelles comment?",
            '¿Cómo te llamás?',
            ['fr-tu-t-appelles-comment'],
            { id: 'fr.ex.q40bri6m06m6gl' },
          ),
          question(
            'fr.ex.qlxvwobu6aj1za',
            FETE,
            '¿Cómo se llama el chico?',
            'Hugo.',
            ['Léa.', 'Paul.', 'No lo dice.'],
            ['fr-je-m-appelle'],
            "Él responde «Je m'appelle Hugo».",
          ),
          question(
            'fr.ex.hgvo74o3qi1asy',
            FETE,
            '¿Cómo se tratan Léa y Hugo?',
            'De tu, como amigos.',
            [
              'De vous, porque no se conocen.',
              'Léa usa vous y Hugo, tu.',
              'Con madame y monsieur.',
            ],
            ['fr-et-toi', 'fr-salut'],
            'Se saludan con «Salut» y Léa pregunta «Et toi?»: es el registro informal.',
          ),
          ex.translateWrite('Me llamo Marie.', "Je m'appelle Marie.", ['fr-je-m-appelle'], {
            id: 'fr.ex.h7nqwesd4hwu8v',
            acceptedAnswers: ["Je m'appelle Marie."],
          }),
          ex.shortAnswer(
            "Tu t'appelles comment?",
            '¿Cómo te llamás? (Respondé que te llamás Ana.)',
            "Je m'appelle Ana.",
            ["Je m'appelle Ana.", "Salut! Je m'appelle Ana.", "Salut, je m'appelle Ana."],
            ['fr-je-m-appelle'],
            { id: 'fr.ex.vvoiw4tq3vpg7o' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Una conversación completa',
        objective: 'Saludar, presentarse y despedirse en una conversación.',
        intro: {
          explanation:
            "Una conversación corta en francés: saludo (bonjour / salut), pregunta (ça va?), presentación (je m'appelle…) y despedida (au revoir, à bientôt). Recordá el registro: tu con amigos, vous con desconocidos. Y merci beaucoup es muchas gracias.",
          examples: [
            { target: 'Bonsoir, madame! Ça va?', base: '¡Buenas noches, señora! ¿Cómo va?' },
            { target: 'Merci beaucoup! À bientôt!', base: '¡Muchas gracias! ¡Hasta pronto!' },
          ],
        },
        takeaways: [
          'Armás una conversación corta del saludo a la despedida.',
          'Usás tu o vous según con quién hablás.',
        ],
        exercises: [
          question(
            'fr.ex.uas8zaagdyulig',
            MESSAGE,
            '¿Cómo se despide Sophie?',
            'Con «hasta pronto».',
            ['Con «buenas noches».', 'Con «adiós, señor».', 'No se despide.'],
            ['fr-a-bientot'],
            'El mensaje termina con «À bientôt!», hasta pronto.',
          ),
          question(
            'fr.ex.hqqy978u01d0ns',
            MESSAGE,
            '¿Qué le dice Sophie a Thomas?',
            'Le pregunta cómo está y le da las gracias.',
            [
              'Le dice su nombre por primera vez.',
              'Le pide algo por favor.',
              'Le dice que está mal.',
            ],
            ['fr-ca-va', 'fr-merci'],
            'Escribe «Ça va?» y «Merci beaucoup!».',
          ),
          ex.listenChoice(
            'Salut, Thomas! À bientôt!',
            ['Salut, Thomas! Ça va?', 'Au revoir, Thomas!', 'Bonsoir, Thomas!'],
            ['fr-salut', 'fr-a-bientot'],
            { id: 'fr.ex.o3hhzyybirg606' },
          ),
          ex.fillBlank(
            "Bonjour, madame! S'il ___ plaît!",
            '¡Buen día, señora! ¡Por favor!',
            'vous',
            ['te', 'toi', 'moi'],
            ['fr-s-il-vous-plait', 'fr-madame'],
            {
              id: 'fr.ex.qnjnnvcg7vy3ar',
              explanation: "Con madame se usa vous: s'il vous plaît.",
            },
          ),
          ex.translationChoice(
            'à bientôt',
            'hasta pronto',
            ['buenas noches (al llegar)', 'hola', 'de nada'],
            ['fr-a-bientot'],
            { id: 'fr.ex.mzn9csu7fjuncb' },
          ),
          ex.translationChoice(
            "tu t'appelles comment?",
            '¿cómo te llamás?',
            ['¿cómo va?', '¿y usted?', 'me llamo'],
            ['fr-tu-t-appelles-comment'],
            { id: 'fr.ex.4fuger877se42c' },
          ),
          ex.orderWords("Je m'appelle Claire.", 'Me llamo Claire.', ['fr-je-m-appelle'], {
            id: 'fr.ex.z2d1dujdgpjad4',
          }),
          ex.translationChoice('non', 'no', ['sí', 'gracias', 'hola'], ['fr-non', 'fr-oui'], {
            id: 'fr.ex.r574hc7zaea0ji',
          }),
          ex.translateWrite(
            'Hola, me llamo Lucas. ¿Cómo te llamás?',
            "Salut, je m'appelle Lucas. Tu t'appelles comment?",
            ['fr-salut', 'fr-je-m-appelle', 'fr-tu-t-appelles-comment'],
            {
              id: 'fr.ex.f910rf5v9xsf88',
              acceptedAnswers: [
                "Salut, je m'appelle Lucas. Tu t'appelles comment?",
                "Bonjour, je m'appelle Lucas. Tu t'appelles comment?",
                "Bonjour, je m'appelle Lucas. Tu t'appelles comment?",
                "Salut! Je m'appelle Lucas. Tu t'appelles comment?",
              ],
            },
          ),
          ex.translateWrite(
            '¡Muchas gracias, señora! ¡Hasta pronto!',
            'Merci beaucoup, madame! À bientôt!',
            ['fr-merci', 'fr-madame', 'fr-a-bientot'],
            { id: 'fr.ex.e86hqp8cijvo2n' },
          ),
        ],
      },
    ],
  },
};
