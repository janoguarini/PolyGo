import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U6 «La casa» (docs/FR_A1_A2.md): describir una vivienda con il y a / il n'y a pas de,
 * preguntar dónde está algo (où est…?) y ubicar objetos con dans, sur, sous, à côté de, devant y
 * derrière (con la contracción du). Pronunciación: sur / sous (u francesa frente a ou), il y a en un
 * solo bloque, deux / douze. Falso amigo: la chambre es el dormitorio. Género distinto: le lit (la cama).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CLES = dialogue(
  'fr.stim.a1-u6-cles',
  'Lucas busca algo antes de salir y le pregunta a Marie.',
  [
    ['Lucas', 'Marie, où sont mes clés?'],
    ['Marie', 'Sur la table de la cuisine?'],
    ['Lucas', "Non, il n'y a pas de clés sur la table."],
    ['Marie', 'Et dans ton sac?'],
    ['Lucas', 'Oui! Elles sont dans mon sac. Merci!'],
  ],
  FR_A1_RATE,
);

const APPART = reading(
  'fr.stim.a1-u6-appart',
  'message',
  'Sophie le escribe a su amigo Thomas sobre su nuevo departamento.',
  [
    'Salut, Thomas!',
    "J'habite à Lyon, dans un petit appartement.",
    'Il y a deux chambres, un salon et une cuisine.',
    "La salle de bains est petite et il n'y a pas de fenêtre.",
    'À bientôt!',
    'Sophie',
  ],
  { from: 'Sophie', to: 'Thomas' },
);

export const FR_A1_U06: FrUnitDef = {
  names: ['Lucas', 'Marie', 'Sophie', 'Thomas', 'Lyon'],
  support: ['du'],
  unit: {
    position: 6,
    title: 'La casa',
    titleEn: 'Chez moi',
    description:
      "Las partes de la casa, il y a / il n'y a pas de, où est…? y las preposiciones de lugar (dans, sur, sous, à côté de, devant, derrière). Sur y sous no suenan igual.",
    emoji: '🏠',
    objective:
      'Podés describir tu casa o tu departamento, decir qué hay y qué no hay, y preguntar y decir dónde está algo.',
    grammar: {
      title: "Il y a / il n'y a pas de · où est…? · preposiciones de lugar",
      explanation:
        "Il y a (hay) sirve para singular y plural: il y a une chambre, il y a deux chambres. En la negación, un / une / des pasan a de: il n'y a pas de fenêtre (nunca «pas une fenêtre»). Para ubicar algo: où est…? (o où sont…? en plural) y la respuesta con il / elle est + dans, sur, sous, devant, derrière o à côté de. De + le se contrae en du: à côté du lit; con la y l' no cambia: à côté de la porte.",
      examples: [
        { target: 'Il y a deux chambres et un salon.', base: 'Hay dos dormitorios y un living.' },
        { target: "Il n'y a pas de fenêtre.", base: 'No hay ventana.' },
        {
          target: 'Où est le chat? — Il est sous le lit.',
          base: '¿Dónde está el gato? — Está debajo de la cama.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U6). Sin revisión nativa: revisar «living» como traducción de le salon y la explicación de la u de sur frente a la ou de sous.',
    },
    words: [
      w(
        'fr-la-maison',
        'la maison',
        'la casa',
        "C'est une grande maison.",
        'Es una casa grande.',
        ['home', 'f'],
        { emoji: '🏠' },
      ),
      w(
        'fr-l-appartement',
        "l'appartement",
        'el departamento',
        "J'habite dans un petit appartement.",
        'Vivo en un departamento chico.',
        ['home', 'm'],
        { acceptedTranslations: ['el apartamento'], acceptedTexts: ["l'appartement"] },
      ),
      w(
        'fr-la-chambre',
        'la chambre',
        'el dormitorio',
        'Ma chambre est petite.',
        'Mi dormitorio es chico.',
        ['home', 'f'],
        { acceptedTranslations: ['la habitación', 'el cuarto'], emoji: '🛏️' },
      ),
      w(
        'fr-la-cuisine',
        'la cuisine',
        'la cocina',
        'La cuisine est à côté du salon.',
        'La cocina está al lado del living.',
        ['home', 'f'],
        { emoji: '🍳' },
      ),
      w(
        'fr-la-salle-de-bains',
        'la salle de bains',
        'el baño',
        'Où est la salle de bains?',
        '¿Dónde está el baño?',
        ['home', 'f'],
        { emoji: '🛁' },
      ),
      w(
        'fr-le-salon',
        'le salon',
        'el living',
        'Le chat est dans le salon.',
        'El gato está en el living.',
        ['home', 'm'],
        { acceptedTranslations: ['la sala', 'la sala de estar'], emoji: '🛋️' },
      ),
      w(
        'fr-le-lit',
        'le lit',
        'la cama',
        'Le chien est sous le lit.',
        'El perro está debajo de la cama.',
        ['home', 'm'],
      ),
      w(
        'fr-la-fenetre',
        'la fenêtre',
        'la ventana',
        'Il y a deux fenêtres.',
        'Hay dos ventanas.',
        ['home', 'f'],
        { emoji: '🪟' },
      ),
      w(
        'fr-la-porte',
        'la porte',
        'la puerta',
        'Le sac est derrière la porte.',
        'El bolso está detrás de la puerta.',
        ['home', 'f'],
        { emoji: '🚪' },
      ),
      w(
        'fr-il-y-a',
        'il y a',
        'hay',
        'Il y a une table et quatre chaises.',
        'Hay una mesa y cuatro sillas.',
        ['basics'],
      ),
      w(
        'fr-il-n-y-a-pas-de',
        "il n'y a pas de",
        'no hay',
        "Il n'y a pas de lit.",
        'No hay cama.',
        ['basics', 'negation'],
        { acceptedTexts: ["il n'y a pas de"] },
      ),
      w(
        'fr-dans',
        'dans',
        'adentro de',
        'Mes clés sont dans mon sac.',
        'Mis llaves están en mi bolso.',
        ['prepositions'],
        { acceptedTranslations: ['en', 'dentro de'] },
      ),
      w(
        'fr-sur',
        'sur',
        'sobre',
        'Le livre est sur la table.',
        'El libro está sobre la mesa.',
        ['prepositions'],
        { acceptedTranslations: ['arriba de', 'encima de'] },
      ),
      w(
        'fr-sous',
        'sous',
        'debajo de',
        'Le chat est sous la chaise.',
        'El gato está debajo de la silla.',
        ['prepositions'],
        { acceptedTranslations: ['abajo de'] },
      ),
      w(
        'fr-a-cote-de',
        'à côté de',
        'al lado de',
        'La chaise est à côté de la fenêtre.',
        'La silla está al lado de la ventana.',
        ['prepositions'],
      ),
      w(
        'fr-devant',
        'devant',
        'delante de',
        'Le chien est devant la porte.',
        'El perro está delante de la puerta.',
        ['prepositions'],
        { acceptedTranslations: ['adelante de', 'frente a'] },
      ),
      w(
        'fr-derriere',
        'derrière',
        'detrás de',
        'La cuisine est derrière le salon.',
        'La cocina está detrás del living.',
        ['prepositions'],
        { acceptedTranslations: ['atrás de'] },
      ),
      w('fr-ou', 'où', 'dónde', 'Où est mon téléphone?', '¿Dónde está mi teléfono?', ['questions']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La maison',
        objective: 'Nombrar la casa, el departamento y sus ambientes.',
        intro: {
          explanation:
            "Las partes de la casa: la cuisine (la cocina), la salle de bains (el baño), le salon (el living) y la chambre, que es un falso amigo: no es una cámara, es el dormitorio. Appartement empieza con vocal: l'appartement, un appartement. En bains, la s final no suena.",
          examples: [
            { target: "C'est ma chambre.", base: 'Es mi dormitorio.' },
            { target: "C'est un petit appartement.", base: 'Es un departamento chico.' },
          ],
        },
        takeaways: [
          'Nombrás la casa y sus ambientes.',
          'Recordás que la chambre es el dormitorio.',
        ],
        exercises: [
          ex.translationChoice(
            'la chambre',
            'el dormitorio',
            ['la cámara', 'la cocina', 'el baño'],
            ['fr-la-chambre'],
            {
              id: 'fr.ex.m76fy5ito7zsy7',
              explanation: 'Falso amigo: la chambre es el dormitorio, no la cámara.',
            },
          ),
          ex.imageChoice(
            '🏠',
            'la maison',
            ['la chambre', 'la cuisine', 'le salon'],
            ['fr-la-maison'],
            {
              id: 'fr.ex.sw8ha5mfvffnvb',
            },
          ),
          ex.matchPairs(
            [
              ['la cuisine', 'la cocina'],
              ['la salle de bains', 'el baño'],
              ['le salon', 'el living'],
              ["l'appartement", 'el departamento'],
            ],
            ['fr-la-cuisine', 'fr-la-salle-de-bains', 'fr-le-salon', 'fr-l-appartement'],
            { id: 'fr.ex.ibb5ldgkb8lgai' },
          ),
          ex.listenChoice(
            "C'est la cuisine.",
            ["C'est la chambre.", "C'est le salon.", "C'est la maison."],
            ['fr-la-cuisine'],
            { id: 'fr.ex.zg64za16871gh1' },
          ),
          ex.fillBlank(
            "C'est un petit ___.",
            'Es un departamento chico.',
            'appartement',
            ['maison', 'cuisine', 'chambre'],
            ['fr-l-appartement'],
            {
              id: 'fr.ex.9bb12nvtntrgc6',
              skill: 'vocabulary',
              explanation:
                'Un petit va con un masculino: appartement. Maison, cuisine y chambre son femeninos.',
            },
          ),
          ex.translationChoice(
            'le salon',
            'el living',
            ['el baño', 'la cocina', 'la casa'],
            ['fr-le-salon'],
            { id: 'fr.ex.5d19bt054x76ll' },
          ),
          ex.fillBlank(
            'La ___ de Lucas est petite.',
            'El dormitorio de Lucas es chico.',
            'chambre',
            ['salon', 'appartement', 'cuisine'],
            ['fr-la-chambre'],
            {
              id: 'fr.ex.f3q7h9w6sssmw7',
              skill: 'vocabulary',
              explanation: 'El dormitorio es la chambre (femenino: la, petite).',
            },
          ),
          ex.orderWords("C'est la salle de bains.", 'Es el baño.', ['fr-la-salle-de-bains'], {
            id: 'fr.ex.hc36h4ig18myhe',
          }),
          ex.translateWrite('Es una casa grande.', "C'est une grande maison.", ['fr-la-maison'], {
            id: 'fr.ex.pg11l73it840ov',
          }),
          ex.translateWrite('Es mi dormitorio.', "C'est ma chambre.", ['fr-la-chambre'], {
            id: 'fr.ex.6y6pjswp13z6xd',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "Il y a, il n'y a pas de",
        objective: 'Decir qué hay y qué no hay en una casa.',
        intro: {
          explanation:
            "Il y a es hay, igual en singular y en plural: il y a un lit, il y a deux lits. Se dice en un solo bloque, casi como una palabra. En la negación, un / une / des pasan a de: il n'y a pas de porte (no hay puerta). Ojo con el género: le lit es masculino, aunque en español sea la cama.",
          examples: [
            { target: 'Il y a un lit et une table.', base: 'Hay una cama y una mesa.' },
            { target: "Il n'y a pas de fenêtre.", base: 'No hay ventana.' },
          ],
        },
        takeaways: [
          'Decís qué hay con il y a.',
          "Decís qué no hay con il n'y a pas de, sin un / une.",
        ],
        exercises: [
          ex.translationChoice(
            'le lit',
            'la cama',
            ['la puerta', 'la ventana', 'la mesa'],
            ['fr-le-lit'],
            {
              id: 'fr.ex.2qkpam9x5fzcm3',
              explanation: 'Lit es masculino en francés: le lit, un lit.',
            },
          ),
          ex.imageChoice('🚪', 'la porte', ['la fenêtre', 'le lit', 'la table'], ['fr-la-porte'], {
            id: 'fr.ex.002p45e6c6x2el',
          }),
          ex.matchPairs(
            [
              ['il y a', 'hay'],
              ["il n'y a pas de", 'no hay'],
              ['la fenêtre', 'la ventana'],
              ['la porte', 'la puerta'],
            ],
            ['fr-il-y-a', 'fr-il-n-y-a-pas-de', 'fr-la-fenetre', 'fr-la-porte'],
            { id: 'fr.ex.vmtuueym40f3qx' },
          ),
          ex.listenChoice(
            'Il y a deux fenêtres.',
            ['Il y a douze fenêtres.', 'Il y a deux portes.', "Il n'y a pas de fenêtre."],
            ['fr-il-y-a', 'fr-la-fenetre'],
            {
              id: 'fr.ex.uakye3crvhnzy6',
              explanation: 'Deux (dos) y douze (doce) se distinguen por la z final de douze.',
            },
          ),
          ex.fillBlank(
            '___ un lit et une table.',
            'Hay una cama y una mesa.',
            'Il y a',
            ['Il a', 'Il est', 'Ce sont'],
            ['fr-il-y-a', 'fr-le-lit'],
            {
              id: 'fr.ex.t3a20yj0nh3s8x',
              explanation: 'Hay se dice il y a. Il a es él tiene.',
            },
          ),
          ex.fillBlank(
            "Il n'y a pas ___ porte.",
            'No hay puerta.',
            'de',
            ['une', 'la', 'des'],
            ['fr-il-n-y-a-pas-de', 'fr-la-porte'],
            {
              id: 'fr.ex.5ug32gl8ntvvr8',
              explanation: "Después de pas, un / une / des pasan a de: il n'y a pas de porte.",
            },
          ),
          ex.translationChoice(
            'la fenêtre',
            'la ventana',
            ['la puerta', 'el living', 'la cama'],
            ['fr-la-fenetre'],
            { id: 'fr.ex.hytwpvjemgookn' },
          ),
          ex.orderWords(
            "Il n'y a pas de lit.",
            'No hay cama.',
            ['fr-il-n-y-a-pas-de', 'fr-le-lit'],
            {
              id: 'fr.ex.7e2att6praxwhr',
            },
          ),
          ex.translateWrite(
            'Hay dos dormitorios.',
            'Il y a deux chambres.',
            ['fr-il-y-a', 'fr-la-chambre'],
            {
              id: 'fr.ex.6asss3drkuttpd',
            },
          ),
          ex.shortAnswer(
            'Il y a une salle de bains?',
            '¿Hay un baño? (Respondé que no hay baño.)',
            "Non, il n'y a pas de salle de bains.",
            ["Il n'y a pas de salle de bains.", "Non, il n'y a pas de salle de bains!"],
            ['fr-il-n-y-a-pas-de', 'fr-la-salle-de-bains'],
            { id: 'fr.ex.8mh69nihhglq18' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Où est…? Dans, sur, sous',
        objective: 'Preguntar dónde está algo y responder con dans, sur y sous.',
        intro: {
          explanation:
            'Para preguntar: où est…? (¿dónde está…?) y où sont…? en plural. Se responde con il / elle est + dans (adentro de), sur (sobre) o sous (debajo de). Escuchá bien sur y sous: la u de sur se dice con los labios redondeados como para una u pero la lengua adelante, como para una i; la ou de sous es la u del español. Où lleva tilde para diferenciarse de ou (o), pero suenan igual.',
          examples: [
            {
              target: 'Où est le chat? — Il est sous le lit.',
              base: '¿Dónde está el gato? — Está debajo de la cama.',
            },
            { target: 'Les clés sont sur la table.', base: 'Las llaves están sobre la mesa.' },
          ],
        },
        takeaways: [
          'Preguntás dónde está algo con où est…?',
          'Distinguís sur y sous al escuchar y al hablar.',
        ],
        exercises: [
          ex.translationChoice('où', 'dónde', ['sobre', 'debajo de', 'adentro de'], ['fr-ou'], {
            id: 'fr.ex.u6i4afdist1ocg',
          }),
          ex.listenChoice(
            'Le chat est sur la table.',
            [
              'Le chat est sous la table.',
              'Le chien est sur la table.',
              'Les chats sont sur la table.',
            ],
            ['fr-sur', 'fr-sous'],
            {
              id: 'fr.ex.htv303tqgdalml',
              explanation: 'Sur (sobre) tiene la u francesa; sous (debajo de), el sonido ou.',
            },
          ),
          ex.matchPairs(
            [
              ['dans', 'adentro de'],
              ['sur', 'sobre'],
              ['sous', 'debajo de'],
              ['où', 'dónde'],
            ],
            ['fr-dans', 'fr-sur', 'fr-sous', 'fr-ou'],
            { id: 'fr.ex.8njs9i830h3qkd' },
          ),
          ex.fillBlank(
            '___ est mon téléphone?',
            '¿Dónde está mi teléfono?',
            'Où',
            ['Quel', 'Comment', 'Que'],
            ['fr-ou'],
            { id: 'fr.ex.55cairentc8gzi', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Le chat est ___ le lit.',
            'El gato está debajo de la cama.',
            'sous',
            ['sur', 'dans', 'où'],
            ['fr-sous', 'fr-le-lit'],
            { id: 'fr.ex.j3jag11fnosp5c', skill: 'vocabulary' },
          ),
          ex.translationChoice(
            'dans',
            'adentro de',
            ['sobre', 'debajo de', 'al lado de'],
            ['fr-dans'],
            { id: 'fr.ex.yw9e4dnjlpeejo' },
          ),
          ex.fillBlank(
            'Mes clés sont ___ mon sac.',
            'Mis llaves están en mi bolso.',
            'dans',
            ['sur', 'sous', 'où'],
            ['fr-dans'],
            {
              id: 'fr.ex.x0uaizgy6kxiko',
              skill: 'vocabulary',
              explanation: 'Adentro del bolso: dans mon sac. Sur sería sobre el bolso.',
            },
          ),
          ex.orderWords(
            'Où est la cuisine?',
            '¿Dónde está la cocina?',
            ['fr-ou', 'fr-la-cuisine'],
            {
              id: 'fr.ex.rrjx1e99k4miyj',
            },
          ),
          ex.translateWrite(
            'El libro está sobre la mesa.',
            'Le livre est sur la table.',
            ['fr-sur'],
            {
              id: 'fr.ex.wte6ynoc5mnsos',
            },
          ),
          ex.shortAnswer(
            'Où est le chat? 🐈🛏️',
            '¿Dónde está el gato? (Respondé que está debajo de la cama.)',
            'Il est sous le lit.',
            ['Le chat est sous le lit.', 'Sous le lit.'],
            ['fr-sous', 'fr-le-lit'],
            { id: 'fr.ex.nm1u7l74y0rdub' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'À côté de, devant, derrière',
        objective: 'Ubicar cosas y personas con à côté de, devant y derrière.',
        intro: {
          explanation:
            "À côté de es al lado de. Ojo con la contracción: de + le se vuelve du (à côté du lit) y de + les, des; con la y l' no cambia (à côté de la porte, à côté de l'appartement). Devant (delante de) y derrière (detrás de) van directo, sin de: devant la maison, derrière la porte.",
          examples: [
            { target: 'La chaise est à côté du lit.', base: 'La silla está al lado de la cama.' },
            {
              target: 'Le chien est devant la porte.',
              base: 'El perro está delante de la puerta.',
            },
          ],
        },
        takeaways: [
          'Ubicás algo con à côté de, devant y derrière.',
          'Contraés de + le en du: à côté du lit.',
        ],
        exercises: [
          ex.translationChoice(
            'derrière',
            'detrás de',
            ['delante de', 'al lado de', 'sobre'],
            ['fr-derriere'],
            { id: 'fr.ex.l9lt65xk398syp' },
          ),
          ex.matchPairs(
            [
              ['à côté de', 'al lado de'],
              ['devant', 'delante de'],
              ['derrière', 'detrás de'],
              ['sous', 'debajo de'],
            ],
            ['fr-a-cote-de', 'fr-devant', 'fr-derriere', 'fr-sous'],
            { id: 'fr.ex.5ck02c9kfy0icb' },
          ),
          ex.fillBlank(
            'La table est à côté ___ lit.',
            'La mesa está al lado de la cama.',
            'du',
            ['de le', 'de la', 'des'],
            ['fr-a-cote-de', 'fr-le-lit'],
            {
              id: 'fr.ex.pzjkumvml2ha9r',
              explanation: 'Lit es masculino: de + le = du. Nunca se dice «de le».',
            },
          ),
          ex.listenChoice(
            'Le chien est devant la maison.',
            [
              'Le chien est derrière la maison.',
              'Le chat est devant la maison.',
              'Le chien est dans la maison.',
            ],
            ['fr-devant', 'fr-derriere'],
            { id: 'fr.ex.12ahp6ens490gn' },
          ),
          ex.fillBlank(
            'Le sac est ___ la porte.',
            'El bolso está detrás de la puerta.',
            'derrière',
            ['devant', 'sur', 'dans'],
            ['fr-derriere', 'fr-la-porte'],
            { id: 'fr.ex.k3iwqjkm2zekn6', skill: 'vocabulary' },
          ),
          question(
            'fr.ex.4lda0rza6zlfwt',
            CLES,
            '¿Qué busca Lucas?',
            'Sus llaves.',
            ['Su bolso.', 'Su teléfono.', 'La cocina.'],
            ['fr-ou'],
            'Lucas pregunta «Marie, où sont mes clés?».',
          ),
          question(
            'fr.ex.kb3xbccyc8pclk',
            CLES,
            '¿Hay llaves sobre la mesa de la cocina?',
            'No, no hay.',
            ['Sí, hay dos.', 'Sí, debajo de la mesa.', 'No lo dice.'],
            ['fr-il-n-y-a-pas-de', 'fr-sur', 'fr-la-cuisine'],
            "Lucas responde «il n'y a pas de clés sur la table».",
          ),
          ex.orderWords(
            'La chaise est à côté de la fenêtre.',
            'La silla está al lado de la ventana.',
            ['fr-a-cote-de', 'fr-la-fenetre'],
            { id: 'fr.ex.mzofcz336al6ou' },
          ),
          ex.translateWrite(
            'El gato está delante de la puerta.',
            'Le chat est devant la porte.',
            ['fr-devant', 'fr-la-porte'],
            { id: 'fr.ex.cenbuw07nex56v' },
          ),
          ex.translateWrite(
            'Mi teléfono está al lado del libro.',
            'Mon téléphone est à côté du livre.',
            ['fr-a-cote-de'],
            { id: 'fr.ex.wh81yakkyhklft' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Chez moi',
        objective: 'Describir una vivienda: qué ambientes tiene y dónde están las cosas.',
        intro: {
          explanation:
            "Para describir dónde vivís: j'habite dans un appartement / une maison, il y a… y il n'y a pas de… Después ubicás las cosas con las preposiciones: la cuisine est à côté du salon. Un dato cultural: en Francia muchos anuncios cuentan los ambientes sin el baño ni la cocina (un «trois pièces» tiene living y dos dormitorios).",
          examples: [
            {
              target: "J'habite dans un petit appartement.",
              base: 'Vivo en un departamento chico.',
            },
            {
              target: 'La cuisine est à côté du salon.',
              base: 'La cocina está al lado del living.',
            },
          ],
        },
        takeaways: [
          'Describís tu casa con il y a y las preposiciones.',
          'Entendés un mensaje que describe una vivienda.',
        ],
        exercises: [
          question(
            'fr.ex.ok3567z0j39ga5',
            APPART,
            '¿Cuántos dormitorios tiene el departamento de Sophie?',
            'Dos.',
            ['Uno.', 'Tres.', 'No lo dice.'],
            ['fr-la-chambre', 'fr-il-y-a', 'fr-l-appartement'],
            'Sophie escribe «Il y a deux chambres».',
          ),
          question(
            'fr.ex.s5eufr2f7gy29i',
            APPART,
            '¿Qué no tiene el baño?',
            'Ventana.',
            ['Puerta.', 'Mesa.', 'Nada: tiene de todo.'],
            ['fr-la-salle-de-bains', 'fr-il-n-y-a-pas-de', 'fr-la-fenetre'],
            "Sophie escribe «La salle de bains est petite et il n'y a pas de fenêtre».",
          ),
          question(
            'fr.ex.6dji5itov9i229',
            APPART,
            '¿Dónde vive Sophie?',
            'En un departamento chico en Lyon.',
            ['En una casa grande en Lyon.', 'En un departamento grande en París.', 'Con Thomas.'],
            ['fr-l-appartement', 'fr-dans'],
            "Sophie escribe «J'habite à Lyon, dans un petit appartement».",
          ),
          question(
            'fr.ex.08q6knwfh23dd5',
            CLES,
            '¿Dónde están las llaves al final?',
            'En el bolso de Lucas.',
            ['Sobre la mesa.', 'En la cocina.', 'Debajo de la cama.'],
            ['fr-dans'],
            'Lucas dice «Elles sont dans mon sac».',
          ),
          ex.listenChoice(
            "Il n'y a pas de fenêtre.",
            ['Il y a une fenêtre.', "Il n'y a pas de porte.", 'Il y a deux fenêtres.'],
            ['fr-il-n-y-a-pas-de', 'fr-la-fenetre'],
            { id: 'fr.ex.gt9f2sx787xy5u' },
          ),
          ex.fillBlank(
            "J'habite dans une petite ___.",
            'Vivo en una casa chica.',
            'maison',
            ['appartement', 'salon', 'lit'],
            ['fr-la-maison', 'fr-dans'],
            {
              id: 'fr.ex.q4zit8zwttg2jc',
              skill: 'vocabulary',
              explanation:
                'Une petite va con un femenino: maison. Appartement, salon y lit son masculinos.',
            },
          ),
          ex.orderWords(
            'Il y a un grand salon.',
            'Hay un living grande.',
            ['fr-il-y-a', 'fr-le-salon'],
            {
              id: 'fr.ex.5t1qp8ybn1ddly',
            },
          ),
          ex.imageChoice(
            '🪟',
            'la fenêtre',
            ['la porte', 'le lit', 'la maison'],
            ['fr-la-fenetre'],
            {
              id: 'fr.ex.ibg9uhlx5tun79',
            },
          ),
          ex.translateWrite(
            'En mi casa hay tres dormitorios y una cocina.',
            'Dans ma maison, il y a trois chambres et une cuisine.',
            ['fr-il-y-a', 'fr-la-chambre', 'fr-la-cuisine', 'fr-la-maison'],
            {
              id: 'fr.ex.7zb166pt3stjz8',
              acceptedAnswers: ['Il y a trois chambres et une cuisine dans ma maison.'],
            },
          ),
          ex.shortAnswer(
            'Où est ton téléphone?',
            '¿Dónde está tu teléfono? (Respondé que está en tu bolso.)',
            'Il est dans mon sac.',
            ['Mon téléphone est dans mon sac.', 'Dans mon sac.'],
            ['fr-ou', 'fr-dans'],
            { id: 'fr.ex.ara58n5871z1x5' },
          ),
        ],
      },
    ],
  },
};
