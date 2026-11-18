import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U10 «La ciudad y las direcciones» (docs/FR_A1_A2.md): decir adónde vas con aller en
 * presente (je vais… ils vont) y las contracciones à + le = au, à + les = aux (au cinéma, à la gare);
 * nombrar lugares de la ciudad; ubicar con près de / loin y de + le = du; dar indicaciones con el
 * imperativo de vous (tournez, allez, prenez) y à gauche, à droite, tout droit.
 * Pronunciación: ils vont / ils sont; liaison nous‿allons, vous‿allez con sonido z; la t de droit no
 * suena, la de droite sí. Género distinto: la banque (el banco). Cultura: se dice pardon o bonjour
 * antes de pedir una indicación.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SAMEDI = dialogue(
  'fr.stim.a1-u10-samedi',
  'Sophie le pregunta a Paul qué van a hacer el sábado.',
  [
    ['Sophie', 'Samedi, vous allez au supermarché?'],
    ['Paul', 'Non, nous allons à la boulangerie et à la pharmacie.'],
    ['Sophie', 'Et Marc et Julie?'],
    ['Paul', 'Ils vont au supermarché le samedi matin.'],
  ],
  FR_A1_RATE,
);

const MESSAGE = reading(
  'fr.stim.a1-u10-message',
  'message',
  'Un mensaje de Julie a su amigo Marc.',
  [
    'Salut, Marc!',
    'Demain, je vais au musée à deux heures.',
    "Le musée est dans la rue Victor Hugo, près de la gare. Ce n'est pas loin!",
    'À demain!',
    'Julie',
  ],
  { from: 'Julie', to: 'Marc' },
);

const CHEMIN = dialogue(
  'fr.stim.a1-u10-chemin',
  'Ana le pide una indicación a un señor en la calle.',
  [
    ['Ana', "Pardon, monsieur. Où est la pharmacie, s'il vous plaît?"],
    ['Paul', 'Allez tout droit, ensuite tournez à gauche. La pharmacie est à côté de la banque.'],
    ['Ana', "C'est loin?"],
    ['Paul', "Non, ce n'est pas loin."],
    ['Ana', 'Merci beaucoup!'],
  ],
  FR_A1_RATE,
);

export const FR_A1_U10: FrUnitDef = {
  names: [
    'Sophie',
    'Paul',
    'Marc',
    'Julie',
    'Ana',
    'Victor',
    'Hugo',
    'Galeries',
    'Lafayette',
    'Lyon',
    'Paris',
  ],
  support: ['aux', 'pardon'],
  unit: {
    position: 10,
    title: 'La ciudad y las direcciones',
    titleEn: 'En ville',
    description:
      'Aller en presente; à + le = au, à + les = aux (au cinéma, à la gare); lugares de la ciudad; près de, loin; indicaciones con tournez, allez, prenez. Ils vont / ils sont y liaison nous‿allons. Género distinto: la banque.',
    emoji: '🏙️',
    objective:
      'Podés decir adónde vas, nombrar los lugares de la ciudad, decir si quedan cerca o lejos y pedir y dar indicaciones simples.',
    grammar: {
      title: 'Aller + à · au, à la, aux',
      explanation:
        "Aller es irregular: je vais, tu vas, il / elle va, nous allons, vous allez, ils / elles vont. Para decir adónde se usa à, que se contrae con le y les: à + le = au (au cinéma), à + les = aux (aux Galeries Lafayette); con la y l' no cambia (à la gare). Lo mismo con de: de + le = du (près du musée). Para dar indicaciones a alguien que tratás de vous, el imperativo es el mismo verbo sin el pronombre: tournez, allez, prenez. Liaison: nous‿allons y vous‿allez se unen con sonido z.",
      examples: [
        { target: 'Je vais au cinéma.', base: 'Voy al cine.' },
        { target: 'Nous allons à la gare.', base: 'Vamos a la estación.' },
        { target: 'Tournez à gauche.', base: 'Doble a la izquierda.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U10). Sin revisión nativa: revisar «tournez» traducido como «doble» (registro de usted) y el uso de «aux Galeries Lafayette» como ejemplo de aux; on va se usa en una aceptada sin enseñarse aparte (on + va).',
    },
    words: [
      w(
        'fr-je-vais',
        'je vais',
        'voy',
        'Je vais au cinéma.',
        'Voy al cine.',
        ['verbs', 'movement'],
        {
          acceptedTranslations: ['yo voy'],
        },
      ),
      w(
        'fr-tu-vas',
        'tu vas',
        'vas',
        'Tu vas à la gare?',
        '¿Vas a la estación?',
        ['verbs', 'movement'],
        { acceptedTranslations: ['vos vas', 'tú vas'] },
      ),
      w(
        'fr-il-va',
        'il va',
        'él va',
        'Il va à la banque.',
        'Él va al banco.',
        ['verbs', 'movement'],
        { acceptedTranslations: ['ella va'], acceptedTexts: ['elle va'] },
      ),
      w(
        'fr-nous-allons',
        'nous allons',
        'vamos',
        'Samedi, nous allons au musée.',
        'El sábado vamos al museo.',
        ['verbs', 'movement'],
        { acceptedTranslations: ['nosotros vamos'] },
      ),
      w(
        'fr-vous-allez',
        'vous allez',
        'usted va',
        'Vous allez à la pharmacie?',
        '¿Usted va a la farmacia?',
        ['verbs', 'movement'],
        { acceptedTranslations: ['ustedes van'] },
      ),
      w(
        'fr-ils-vont',
        'ils vont',
        'ellos van',
        'Ils vont au supermarché le samedi.',
        'Ellos van al supermercado los sábados.',
        ['verbs', 'movement'],
        { acceptedTranslations: ['ellas van'], acceptedTexts: ['elles vont'] },
      ),
      w(
        'fr-la-gare',
        'la gare',
        'la estación de tren',
        'La gare est loin?',
        '¿La estación queda lejos?',
        ['places', 'f'],
        { acceptedTranslations: ['la estación'], emoji: '🚉' },
      ),
      w(
        'fr-la-banque',
        'la banque',
        'el banco',
        'La banque est à côté de la pharmacie.',
        'El banco está al lado de la farmacia.',
        ['places', 'f'],
        { emoji: '🏦' },
      ),
      w(
        'fr-la-pharmacie',
        'la pharmacie',
        'la farmacia',
        'Je vais à la pharmacie.',
        'Voy a la farmacia.',
        ['places', 'f'],
        { emoji: '💊' },
      ),
      w(
        'fr-le-supermarche',
        'le supermarché',
        'el supermercado',
        'Le supermarché est à droite.',
        'El supermercado está a la derecha.',
        ['places', 'm'],
        { emoji: '🛒' },
      ),
      w(
        'fr-le-cinema',
        'le cinéma',
        'el cine',
        'Le samedi, je vais au cinéma.',
        'Los sábados voy al cine.',
        ['places', 'm'],
        { emoji: '🎬' },
      ),
      w(
        'fr-la-boulangerie',
        'la boulangerie',
        'la panadería',
        'Le matin, je vais à la boulangerie.',
        'A la mañana voy a la panadería.',
        ['places', 'f'],
        { emoji: '🥖' },
      ),
      w(
        'fr-le-musee',
        'le musée',
        'el museo',
        'Le musée est près de la gare.',
        'El museo está cerca de la estación.',
        ['places', 'm'],
        { emoji: '🏛️' },
      ),
      w(
        'fr-la-rue',
        'la rue',
        'la calle',
        'Prenez la rue à gauche.',
        'Tome la calle de la izquierda.',
        ['places', 'f'],
      ),
      w(
        'fr-tout-droit',
        'tout droit',
        'derecho',
        'Allez tout droit.',
        'Vaya derecho.',
        ['directions'],
        {
          acceptedTranslations: ['todo derecho', 'todo recto'],
        },
      ),
      w(
        'fr-a-gauche',
        'à gauche',
        'a la izquierda',
        'Tournez à gauche.',
        'Doble a la izquierda.',
        ['directions'],
        { emoji: '⬅️' },
      ),
      w(
        'fr-a-droite',
        'à droite',
        'a la derecha',
        'La banque est à droite.',
        'El banco está a la derecha.',
        ['directions'],
        { emoji: '➡️' },
      ),
      w(
        'fr-loin',
        'loin',
        'lejos',
        "C'est loin? — Non, c'est près.",
        '¿Queda lejos? — No, queda cerca.',
        ['directions'],
      ),
      w(
        'fr-pres-de',
        'près de',
        'cerca de',
        'La pharmacie est près de la gare.',
        'La farmacia está cerca de la estación.',
        ['directions'],
      ),
      w(
        'fr-tournez',
        'tournez',
        'doble',
        'Tournez à droite, ensuite allez tout droit.',
        'Doble a la derecha y después siga derecho.',
        ['directions', 'imperative'],
        { acceptedTranslations: ['doblá', 'gire'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Je vais au cinéma',
        objective: 'Decir adónde vas con je vais, tu vas, il va.',
        intro: {
          explanation:
            'Aller (ir) es irregular: je vais, tu vas, il / elle va. Para decir adónde, se usa à: à la gare. Pero à + le se contrae en au: au cinéma, nunca «à le cinéma». La s de vas y la s de vais no suenan.',
          examples: [
            { target: 'Je vais au cinéma.', base: 'Voy al cine.' },
            { target: 'Tu vas à la gare?', base: '¿Vas a la estación?' },
          ],
        },
        takeaways: [
          'Decís je vais, tu vas, il va.',
          'Usás au con los masculinos (au cinéma) y à la con los femeninos (à la gare).',
        ],
        exercises: [
          ex.translationChoice('je vais', 'voy', ['vas', 'él va', 'trabajo'], ['fr-je-vais'], {
            id: 'fr.ex.fvhwn66hgw6dgl',
          }),
          ex.matchPairs(
            [
              ['je vais', 'voy'],
              ['tu vas', 'vas'],
              ['il va', 'él va'],
              ['le cinéma', 'el cine'],
            ],
            ['fr-je-vais', 'fr-tu-vas', 'fr-il-va', 'fr-le-cinema'],
            { id: 'fr.ex.uoax16nydwx9wn' },
          ),
          ex.fillBlank(
            'Je vais ___ cinéma.',
            'Voy al cine.',
            'au',
            ['à la', 'à le', 'de'],
            ['fr-je-vais', 'fr-le-cinema'],
            {
              id: 'fr.ex.uyuftdywbk7dj9',
              explanation: 'Cinéma es masculino: à + le = au. «À le» no existe.',
            },
          ),
          ex.fillBlank(
            'Tu vas ___ gare?',
            '¿Vas a la estación?',
            'à la',
            ['au', 'à le', 'la'],
            ['fr-tu-vas', 'fr-la-gare'],
            {
              id: 'fr.ex.demqcmcud3mius',
              explanation: 'Gare es femenino: à la gare. Con la no hay contracción.',
            },
          ),
          ex.listenChoice(
            'Il va à la gare.',
            ['Il est à la gare.', 'Je vais à la gare.', 'Il va au cinéma.'],
            ['fr-il-va', 'fr-la-gare'],
            { id: 'fr.ex.vrsoqf9e4kuy7g' },
          ),
          ex.fillBlank(
            'Elle ___ au cinéma.',
            'Ella va al cine.',
            'va',
            ['vas', 'vais', 'est'],
            ['fr-il-va'],
            {
              id: 'fr.ex.dop9k6p7j77bn8',
              explanation: 'Con il o elle: va. Vas es de tu y vais, de je.',
            },
          ),
          ex.translationChoice(
            'la gare',
            'la estación de tren',
            ['el cine', 'la ciudad', 'la casa'],
            ['fr-la-gare'],
            { id: 'fr.ex.gdfhwsobnxug78' },
          ),
          ex.orderWords(
            'Je vais au cinéma samedi.',
            'El sábado voy al cine.',
            ['fr-je-vais', 'fr-le-cinema'],
            { id: 'fr.ex.e88gydlnp3goz3' },
          ),
          ex.translateWrite(
            'Voy a la estación.',
            'Je vais à la gare.',
            ['fr-je-vais', 'fr-la-gare'],
            {
              id: 'fr.ex.i476wyfoo31vjz',
            },
          ),
          ex.shortAnswer(
            'Tu vas au cinéma demain?',
            '¿Vas al cine mañana? (Respondé que sí.)',
            'Oui, je vais au cinéma demain.',
            ['Oui, demain, je vais au cinéma.', 'Oui, je vais au cinéma.'],
            ['fr-je-vais', 'fr-le-cinema'],
            { id: 'fr.ex.0fpijpmi6yfb4j' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Nous allons, ils vont',
        objective: 'Decir adónde van otras personas y nombrar negocios.',
        intro: {
          explanation:
            'En plural: nous allons, vous allez, ils / elles vont. Hay liaison con sonido z: nous‿allons, vous‿allez. Ojo con ils vont (van) e ils sont (son, están): sólo cambia la primera consonante. Con un plural, à + les = aux: aux Galeries Lafayette. La boulangerie es la panadería, adonde en Francia se va casi todos los días.',
          examples: [
            { target: 'Nous allons à la boulangerie.', base: 'Vamos a la panadería.' },
            { target: 'Ils vont aux Galeries Lafayette.', base: 'Van a las Galerías Lafayette.' },
          ],
        },
        takeaways: [
          'Conjugás nous allons, vous allez, ils vont.',
          'Distinguís ils vont de ils sont y usás aux con los plurales.',
        ],
        exercises: [
          ex.translationChoice(
            'nous allons',
            'vamos',
            ['ellos van', 'usted va', 'voy'],
            ['fr-nous-allons'],
            { id: 'fr.ex.iavmgodn1qkyrl' },
          ),
          ex.matchPairs(
            [
              ['nous allons', 'vamos'],
              ['vous allez', 'usted va'],
              ['ils vont', 'ellos van'],
              ['la boulangerie', 'la panadería'],
            ],
            ['fr-nous-allons', 'fr-vous-allez', 'fr-ils-vont', 'fr-la-boulangerie'],
            { id: 'fr.ex.is5v25v3zg49cs' },
          ),
          ex.listenChoice(
            'Ils vont à la pharmacie.',
            ['Ils sont à la pharmacie.', 'Il va à la pharmacie.', 'Ils vont à la boulangerie.'],
            ['fr-ils-vont', 'fr-la-pharmacie'],
            {
              id: 'fr.ex.ranwe6xd8dqeqi',
              explanation:
                'Ils vont (van) empieza con v; ils sont (están), con s. La s de ils no suena delante de consonante.',
            },
          ),
          ex.fillBlank(
            'Nous ___ au supermarché.',
            'Vamos al supermercado.',
            'allons',
            ['allez', 'vont', 'va'],
            ['fr-nous-allons', 'fr-le-supermarche'],
            {
              id: 'fr.ex.a7wku581j729d2',
              explanation: 'Con nous: allons, con liaison nous‿allons.',
            },
          ),
          ex.fillBlank(
            'Vous ___ à la pharmacie?',
            '¿Usted va a la farmacia?',
            'allez',
            ['allons', 'vont', 'vas'],
            ['fr-vous-allez', 'fr-la-pharmacie'],
            { id: 'fr.ex.mq4uii1kbc73ep', explanation: 'Con vous: allez, con liaison vous‿allez.' },
          ),
          ex.fillBlank(
            'Le matin, je vais ___ boulangerie.',
            'A la mañana voy a la panadería.',
            'à la',
            ['au', 'à le', 'aux'],
            ['fr-la-boulangerie'],
            {
              id: 'fr.ex.eu84zd7p6ncx2a',
              explanation:
                'Boulangerie es femenino singular: à la. Au es para masculinos y aux, para plurales.',
            },
          ),
          question(
            'fr.ex.43jh3c3rx1ihbk',
            SAMEDI,
            '¿Adónde va Paul el sábado?',
            'A la panadería y a la farmacia.',
            ['Al supermercado.', 'Al cine.', 'A la estación.'],
            ['fr-nous-allons', 'fr-la-boulangerie', 'fr-la-pharmacie'],
            'Paul responde «Non, nous allons à la boulangerie et à la pharmacie».',
          ),
          question(
            'fr.ex.jc9w8lnk8bs243',
            SAMEDI,
            '¿Cuándo van Marc y Julie al supermercado?',
            'Los sábados a la mañana.',
            ['Los domingos.', 'Hoy a la tarde.', 'Mañana a la noche.'],
            ['fr-ils-vont', 'fr-le-supermarche'],
            'Paul dice «Ils vont au supermarché le samedi matin».',
          ),
          ex.translateWrite(
            'Ellos van al supermercado.',
            'Ils vont au supermarché.',
            ['fr-ils-vont', 'fr-le-supermarche'],
            { id: 'fr.ex.n9ldspgkts0f4f', acceptedAnswers: ['Elles vont au supermarché.'] },
          ),
          ex.shortAnswer(
            'Vous allez où samedi?',
            '¿Adónde van el sábado? (Respondé que van a la panadería.)',
            'Nous allons à la boulangerie.',
            [
              'On va à la boulangerie.',
              'Samedi, nous allons à la boulangerie.',
              'À la boulangerie.',
            ],
            ['fr-nous-allons', 'fr-la-boulangerie'],
            { id: 'fr.ex.o4eiwvf5x3wst6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Près de la gare',
        objective: 'Decir dónde queda un lugar y si está cerca o lejos.',
        intro: {
          explanation:
            "Ojo con el género: la banque (el banco) es femenino y le musée (el museo), masculino aunque termine en -ée. Para ubicar: près de (cerca de) y loin (lejos). De se contrae con le: de + le = du (près du musée); con la no cambia (près de la gare). Para preguntar: c'est loin?",
          examples: [
            {
              target: 'Le musée est près de la gare.',
              base: 'El museo está cerca de la estación.',
            },
            { target: "C'est loin? — Non, c'est près.", base: '¿Queda lejos? — No, queda cerca.' },
          ],
        },
        takeaways: [
          'Decís la banque y le musée con el género correcto.',
          'Ubicás un lugar con près de, du y loin.',
        ],
        exercises: [
          ex.translationChoice(
            'la banque',
            'el banco',
            ['la calle', 'el museo', 'la farmacia'],
            ['fr-la-banque'],
            {
              id: 'fr.ex.5tzt6aprh1t7zy',
              explanation: 'Banque es femenino en francés: la banque, el banco.',
            },
          ),
          ex.matchPairs(
            [
              ['la banque', 'el banco'],
              ['le musée', 'el museo'],
              ['la rue', 'la calle'],
              ['loin', 'lejos'],
            ],
            ['fr-la-banque', 'fr-le-musee', 'fr-la-rue', 'fr-loin'],
            { id: 'fr.ex.zicvh2wgtt007p' },
          ),
          ex.fillBlank(
            '___ banque est à côté de la gare.',
            'El banco está al lado de la estación.',
            'La',
            ['Le', 'Les', 'Un'],
            ['fr-la-banque'],
            {
              id: 'fr.ex.u9zbycpqkeh221',
              explanation: 'Banque es femenino: la banque, aunque en español sea el banco.',
            },
          ),
          ex.listenChoice(
            'Le musée est près de la gare.',
            [
              'Le musée est loin de la gare.',
              'La banque est près de la gare.',
              'Le musée est à côté de la gare.',
            ],
            ['fr-le-musee', 'fr-pres-de'],
            { id: 'fr.ex.1avnnd9z58bezi' },
          ),
          ex.fillBlank(
            'La pharmacie est près ___ musée.',
            'La farmacia está cerca del museo.',
            'du',
            ['de le', 'de la', 'au'],
            ['fr-pres-de', 'fr-le-musee'],
            {
              id: 'fr.ex.twtf3j2k2ycije',
              explanation: 'De + le = du: près du musée. «De le» no existe.',
            },
          ),
          ex.translationChoice(
            'près de',
            'cerca de',
            ['lejos', 'al lado de', 'delante de'],
            ['fr-pres-de'],
            { id: 'fr.ex.4wp3o0q1n3cnrj' },
          ),
          question(
            'fr.ex.xcfrv69pltf54g',
            MESSAGE,
            '¿Adónde va Julie mañana?',
            'Al museo, a las dos.',
            ['A la estación, a las dos.', 'Al banco, a las doce.', 'Al cine, a las dos.'],
            ['fr-le-musee'],
            'Escribe «Demain, je vais au musée à deux heures».',
          ),
          question(
            'fr.ex.6qc8d923dkufna',
            MESSAGE,
            '¿Dónde está el museo?',
            'En una calle cerca de la estación.',
            ['Lejos de la estación.', 'Al lado del banco.', 'En la estación.'],
            ['fr-pres-de', 'fr-la-rue', 'fr-loin'],
            "Dice «dans la rue Victor Hugo, près de la gare» y «Ce n'est pas loin!».",
          ),
          ex.translateWrite(
            'El banco queda lejos.',
            'La banque est loin.',
            ['fr-la-banque', 'fr-loin'],
            {
              id: 'fr.ex.s30xfsfvgrirld',
            },
          ),
          ex.shortAnswer(
            'Le musée est loin?',
            '¿El museo queda lejos? (Respondé que no, que está cerca de la estación.)',
            'Non, il est près de la gare.',
            ["Non, c'est près de la gare.", 'Non, le musée est près de la gare.'],
            ['fr-pres-de', 'fr-loin'],
            { id: 'fr.ex.yb2lq9lxu5heuz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Tournez à gauche',
        objective: 'Dar indicaciones simples con el imperativo.',
        intro: {
          explanation:
            'Para indicar el camino a alguien que tratás de vous se usa el imperativo, que es el verbo sin el pronombre: tournez (doble), allez (vaya), prenez (tome). Con à gauche (a la izquierda), à droite (a la derecha) y tout droit (derecho). Ojo: en tout droit la t final no suena; en à droite, sí, porque va seguida de e.',
          examples: [
            { target: 'Allez tout droit.', base: 'Vaya derecho.' },
            {
              target: 'Tournez à droite après la banque.',
              base: 'Doble a la derecha después del banco.',
            },
          ],
        },
        takeaways: [
          'Das indicaciones con tournez, allez y prenez.',
          'Distinguís tout droit (derecho) de à droite (a la derecha).',
        ],
        exercises: [
          ex.translationChoice(
            'à gauche',
            'a la izquierda',
            ['a la derecha', 'derecho', 'lejos'],
            ['fr-a-gauche'],
            { id: 'fr.ex.evg8zokup3pa68' },
          ),
          ex.matchPairs(
            [
              ['tournez', 'doble'],
              ['à gauche', 'a la izquierda'],
              ['à droite', 'a la derecha'],
              ['tout droit', 'derecho'],
            ],
            ['fr-tournez', 'fr-a-gauche', 'fr-a-droite', 'fr-tout-droit'],
            { id: 'fr.ex.l8b5sdtoqrzibe' },
          ),
          ex.listenChoice(
            'Tournez à droite.',
            ['Tournez à gauche.', 'Allez tout droit.', 'Allez à droite.'],
            ['fr-tournez', 'fr-a-droite'],
            {
              id: 'fr.ex.bepqv0j256o6n2',
              explanation: 'En à droite la t suena; en tout droit, no.',
            },
          ),
          ex.fillBlank(
            'Allez tout ___, ensuite tournez à gauche.',
            'Vaya derecho y después doble a la izquierda.',
            'droit',
            ['droite', 'gauche', 'loin'],
            ['fr-tout-droit', 'fr-a-gauche'],
            {
              id: 'fr.ex.a6j2tz4xh4ozg6',
              explanation: 'Derecho es tout droit, sin e; à droite es a la derecha.',
            },
          ),
          ex.fillBlank(
            '___ la rue à droite.',
            'Tome la calle de la derecha.',
            'Prenez',
            ['Tournez', 'Allez', 'Vous'],
            ['fr-la-rue', 'fr-a-droite'],
            {
              id: 'fr.ex.d8e95m8mgp9qxz',
              skill: 'vocabulary',
              explanation: 'Tome es prenez; tournez es doble y allez, vaya.',
            },
          ),
          ex.fillBlank(
            'La banque est à ___.',
            'El banco está a la derecha.',
            'droite',
            ['gauche', 'droit', 'loin'],
            ['fr-a-droite'],
            {
              id: 'fr.ex.otrswwq15913m1',
              skill: 'vocabulary',
              explanation: 'A la derecha es à droite, con e; gauche es izquierda.',
            },
          ),
          ex.orderWords(
            'Tournez à droite après la gare.',
            'Doble a la derecha después de la estación.',
            ['fr-tournez', 'fr-a-droite'],
            { id: 'fr.ex.kfdyzs0za0d0wz' },
          ),
          ex.translationChoice('tournez', 'doble', ['vaya', 'tome', 'mire'], ['fr-tournez'], {
            id: 'fr.ex.ta8pie3pos2ckp',
          }),
          ex.translateWrite(
            'Doble a la izquierda.',
            'Tournez à gauche.',
            ['fr-tournez', 'fr-a-gauche'],
            {
              id: 'fr.ex.07s1blhx4bgi75',
            },
          ),
          ex.shortAnswer(
            "Pardon, la gare, s'il vous plaît?",
            'Disculpe, ¿la estación, por favor? (Indicale que vaya derecho.)',
            'Allez tout droit.',
            ['Tout droit.'],
            ['fr-tout-droit'],
            { id: 'fr.ex.ezr4lgleszkp2y' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Où est la pharmacie?',
        objective: 'Pedir y entender una indicación en la calle.',
        intro: {
          explanation:
            "Para pedir una indicación, primero se saluda o se dice pardon: pardon, madame, où est la gare, s'il vous plaît? La respuesta encadena indicaciones con ensuite: allez tout droit, ensuite tournez à gauche. Y para saber si queda a mano: c'est loin?",
          examples: [
            {
              target: "Pardon, monsieur. Où est la banque, s'il vous plaît?",
              base: 'Disculpe, señor. ¿Dónde está el banco, por favor?',
            },
            {
              target: 'Allez tout droit, ensuite tournez à gauche.',
              base: 'Vaya derecho y después doble a la izquierda.',
            },
          ],
        },
        takeaways: [
          "Pedís una indicación con pardon y s'il vous plaît.",
          'Entendés y das un camino corto con ensuite.',
        ],
        exercises: [
          ex.listenChoice(
            "Où est la banque, s'il vous plaît?",
            [
              "Où est la gare, s'il vous plaît?",
              'La banque est loin?',
              "Où est le musée, s'il vous plaît?",
            ],
            ['fr-la-banque'],
            { id: 'fr.ex.wuysq0acfslzzh' },
          ),
          ex.matchPairs(
            [
              ['le supermarché', 'el supermercado'],
              ['la pharmacie', 'la farmacia'],
              ['la boulangerie', 'la panadería'],
              ['le cinéma', 'el cine'],
            ],
            ['fr-le-supermarche', 'fr-la-pharmacie', 'fr-la-boulangerie', 'fr-le-cinema'],
            { id: 'fr.ex.7uyi322380m58f' },
          ),
          ex.fillBlank(
            'Ils vont ___ musée.',
            'Ellos van al museo.',
            'au',
            ['à la', 'du', 'aux'],
            ['fr-ils-vont', 'fr-le-musee'],
            {
              id: 'fr.ex.u5vhexrvqcntpt',
              explanation: 'Musée es masculino singular: au musée. Aux es para plurales.',
            },
          ),
          question(
            'fr.ex.muo78pwl1jpzhs',
            CHEMIN,
            '¿Qué busca Ana?',
            'La farmacia.',
            ['El banco.', 'La estación.', 'El supermercado.'],
            ['fr-la-pharmacie', 'fr-la-banque'],
            "Ana pregunta «Où est la pharmacie, s'il vous plaît?»; el banco está al lado.",
          ),
          question(
            'fr.ex.tzjce5mj2qp5c1',
            CHEMIN,
            '¿Qué tiene que hacer Ana primero?',
            'Ir derecho.',
            ['Doblar a la izquierda.', 'Doblar a la derecha.', 'Ir al banco.'],
            ['fr-tout-droit', 'fr-tournez', 'fr-a-gauche'],
            'El señor dice «Allez tout droit, ensuite tournez à gauche»: primero derecho.',
          ),
          ex.orderWords(
            'La boulangerie est près de la banque.',
            'La panadería está cerca del banco.',
            ['fr-la-boulangerie', 'fr-pres-de'],
            { id: 'fr.ex.teuux43x0k4ldd' },
          ),
          ex.translationChoice(
            'loin',
            'lejos',
            ['cerca de', 'derecho', 'a la derecha'],
            ['fr-loin'],
            { id: 'fr.ex.zivnd24wh0lmd6' },
          ),
          ex.fillBlank(
            'Tu ___ à la banque? — Oui, je vais à la banque.',
            '¿Vas al banco? — Sí, voy al banco.',
            'vas',
            ['vais', 'va', 'allez'],
            ['fr-tu-vas', 'fr-la-banque'],
            {
              id: 'fr.ex.5sxws7qhhx133l',
              explanation: 'Con tu: tu vas. Vais es de je y va, de il o elle.',
            },
          ),
          ex.translateWrite(
            'Disculpe, ¿dónde está la estación?',
            'Pardon, où est la gare?',
            ['fr-la-gare'],
            {
              id: 'fr.ex.v1jgnevrgorukt',
              acceptedAnswers: ["Pardon, où est la gare, s'il vous plaît?"],
            },
          ),
          ex.shortAnswer(
            "Où est le supermarché, s'il vous plaît?",
            '¿Dónde está el supermercado, por favor? (Indicale que doble a la derecha y después siga derecho.)',
            'Tournez à droite, ensuite allez tout droit.',
            [
              'Tournez à droite et allez tout droit.',
              'Tournez à droite. Ensuite, allez tout droit.',
            ],
            ['fr-tournez', 'fr-a-droite', 'fr-tout-droit'],
            { id: 'fr.ex.776viotwzhm0v5' },
          ),
        ],
      },
    ],
  },
};
