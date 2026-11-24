import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U10 «Around town» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y ustedes):
 * decir adónde va uno con ir (voy, vas, va, vamos, van) + a + lugar (a + el = al: voy al cine), nombrar
 * los lugares del barrio, preguntar dónde está algo y entender indicaciones: cerca / lejos, a la derecha
 * / a la izquierda, derecho, y el imperativo introductorio con tú (dobla, sigue, toma: la forma de él del
 * presente; seguir e → i) frente a usted (doble, siga, tome). El autobús (se aceptan colectivo y camión).
 * Pronunciación: la r simple de «derecha» (golpe rápido) frente a la rr de «perro» o «barrio»
 * (vibrante); la z de «izquierda» suena como s (seseo). Cultura: en muchas ciudades de Latinoamérica las
 * distancias se dan en cuadras.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ESTACION = dialogue(
  'es.stim.a1-u10-estacion',
  'A young man asks a young woman in the street in Lima for directions.',
  [
    ['Juan', 'Perdón, ¿dónde está la estación?'],
    ['Camila', 'Está cerca. Sigue derecho dos cuadras y dobla a la izquierda.'],
    ['Juan', '¿Está al lado del banco?'],
    ['Camila', 'No, está enfrente del banco.'],
    ['Juan', '¡Muchas gracias!'],
  ],
  ES_A1_RATE,
);

const CINE = reading(
  'es.stim.a1-u10-cine',
  'message',
  'A text message from Sofía to her friend Martín.',
  [
    '¡Hola, Martín!',
    'Hoy vamos al cine con Lucía.',
    'El cine está en la calle Juárez, cerca de la estación.',
    'Primero voy a la panadería y después voy al cine.',
    '¿Vas con nosotros?',
  ],
  { from: 'Sofía', to: 'Martín' },
);

export const ES_A1_U10: EsUnitDef = {
  names: ['Juan', 'Camila', 'Sofía', 'Martín', 'Lucía', 'Bolívar', 'Juárez'],
  support: ['adónde', 'disculpe', 'perdón', 'cuadra', 'doble', 'siga', 'autobús', 'barrio'],
  unit: {
    position: 10,
    title: 'Around town',
    titleEn: 'La ciudad',
    description:
      'Say where you are going with ir (voy, vas, va, vamos, van), name places in town, ask where something is and give and follow simple directions.',
    emoji: '🏙️',
    objective:
      'You can say where you and others are going, ask where a place is, say if it is near or far, and give and understand simple directions.',
    grammar: {
      title: 'Ir a + place · al · dobla, sigue',
      explanation:
        'Ir (to go) is irregular: yo voy, tú vas, él / ella / usted va, nosotros vamos, ustedes / ellos van. Vamos also means let’s go. To say where: ir a + place. A + el always becomes al: voy al cine; with la nothing changes: voy a la farmacia. In the same way, de + el becomes del: cerca del banco. To ask where a place is, use está: ¿dónde está la estación? To give directions to a friend, use the tú command, which looks like the él / ella form of the present: dobla (turn), sigue (keep going), toma (take). Seguir changes e to i: sigo, sigues, sigue, so the command is sigue. With usted the vowel swaps: doble, siga, tome. Derecho means straight ahead; derecha means right: sigue derecho y dobla a la derecha. Pronunciation: the single r in derecha is a quick tap, like the tt in American butter; rr, as in perro or barrio, is a strong trill. The z in izquierda sounds like an s.',
      examples: [
        {
          target: 'Voy al cine y tú vas al museo.',
          base: 'I’m going to the cinema and you’re going to the museum.',
        },
        { target: 'Nosotros vamos a la panadería.', base: 'We’re going to the bakery.' },
        {
          target: 'Sigue derecho y dobla a la derecha.',
          base: 'Go straight ahead and turn right.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U10). Convertido al español neutro de Latinoamérica (tú y ustedes) el 2026-11-21. Sin revisión nativa. Revisar: «dobla / sigue» y «doble / siga» como única forma del imperativo en A1 (sin enseñar el negativo); «dobla» frente a «gira» (también aceptada); «derecho» y «todo derecho» frente a «recto» (aceptado, no enseñado); «cuadra» como unidad de distancia (en España, «manzana»); «el autobús» (se mencionan camión y colectivo); calles Bolívar y Juárez en lugar de Florida y Corrientes; «perdón» y «disculpe» para llamar la atención de un desconocido; el par «perro / pero» para practicar r / rr.',
    },
    words: [
      w(
        'es-voy',
        'voy',
        'I go',
        'Voy al supermercado.',
        'I’m going to the supermarket.',
        ['verbs'],
        {
          acceptedTranslations: ["I'm going"],
        },
      ),
      w(
        'es-vas',
        'vas',
        'you go, informal',
        '¿Vas al cine hoy?',
        'Are you going to the cinema today?',
        ['verbs'],
        { acceptedTranslations: ["you're going, informal"] },
      ),
      w('es-va', 'va', 'he goes', 'Mi mamá va al banco.', 'My mum goes to the bank.', ['verbs'], {
        acceptedTranslations: ['she goes', 'you go, formal'],
      }),
      w(
        'es-vamos',
        'vamos',
        'we go',
        '¡Vamos a la panadería!',
        'Let’s go to the bakery!',
        ['verbs'],
        { acceptedTranslations: ["let's go"] },
      ),
      w(
        'es-van',
        'van',
        'they go',
        'Ellos van al museo los domingos.',
        'They go to the museum on Sundays.',
        ['verbs'],
        { acceptedTranslations: ['you all go'] },
      ),
      w(
        'es-la-estacion',
        'la estación',
        'the station',
        'La estación está cerca.',
        'The station is nearby.',
        ['city'],
        { emoji: '🚉' },
      ),
      w(
        'es-el-banco',
        'el banco',
        'the bank',
        'El banco está en la calle Bolívar.',
        'The bank is on Bolívar Street.',
        ['city'],
        { emoji: '🏦' },
      ),
      w(
        'es-la-farmacia',
        'la farmacia',
        'the pharmacy',
        'La farmacia está al lado del banco.',
        'The pharmacy is next to the bank.',
        ['city'],
        { acceptedTranslations: ['the drugstore', 'the chemist’s'], emoji: '💊' },
      ),
      w(
        'es-el-supermercado',
        'el supermercado',
        'the supermarket',
        'Los sábados voy al supermercado.',
        'On Saturdays I go to the supermarket.',
        ['city'],
        { emoji: '🛒' },
      ),
      w(
        'es-el-cine',
        'el cine',
        'the cinema',
        'El cine está lejos.',
        'The cinema is far.',
        ['city'],
        {
          acceptedTranslations: ['the movies', 'the movie theater'],
          emoji: '🎬',
        },
      ),
      w(
        'es-la-panaderia',
        'la panadería',
        'the bakery',
        'En la panadería hay pan y croissants.',
        'There is bread and there are croissants at the bakery.',
        ['city'],
        { emoji: '🥐' },
      ),
      w(
        'es-el-museo',
        'el museo',
        'the museum',
        'El museo está enfrente de la estación.',
        'The museum is opposite the station.',
        ['city'],
        { emoji: '🏛️' },
      ),
      w(
        'es-la-calle',
        'la calle',
        'the street',
        'Mi casa está en esta calle.',
        'My house is on this street.',
        ['city'],
      ),
      w(
        'es-derecho',
        'derecho',
        'straight ahead',
        'Sigue derecho dos cuadras.',
        'Go straight ahead for two blocks.',
        ['directions'],
        {
          acceptedTranslations: ['straight on'],
          acceptedTexts: ['todo derecho', 'recto', 'todo recto'],
        },
      ),
      w(
        'es-a-la-izquierda',
        'a la izquierda',
        'on the left',
        'El banco está a la izquierda.',
        'The bank is on the left.',
        ['directions'],
        { acceptedTranslations: ['to the left', 'left'], emoji: '⬅️' },
      ),
      w(
        'es-a-la-derecha',
        'a la derecha',
        'on the right',
        'Dobla a la derecha.',
        'Turn right.',
        ['directions'],
        { acceptedTranslations: ['to the right', 'right'], emoji: '➡️' },
      ),
      w(
        'es-lejos',
        'lejos',
        'far',
        'El museo está muy lejos.',
        'The museum is very far away.',
        ['directions'],
        { acceptedTranslations: ['far away'] },
      ),
      w(
        'es-cerca-de',
        'cerca de',
        'near',
        'Vivo cerca de la estación.',
        'I live near the station.',
        ['directions'],
        { acceptedTranslations: ['close to'] },
      ),
      w(
        'es-dobla',
        'dobla',
        'turn, informal',
        'Dobla a la izquierda en la calle Juárez.',
        'Turn left on Juárez Street.',
        ['directions', 'imperative'],
        { acceptedTexts: ['doblá', 'gira'] },
      ),
      w(
        'es-sigue',
        'sigue',
        'keep going',
        'Sigue derecho hasta la estación.',
        'Keep going straight ahead to the station.',
        ['directions', 'imperative'],
        { acceptedTranslations: ['carry on'], acceptedTexts: ['seguí'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Voy, vas, va',
        objective: 'Say where you, a friend or someone else is going.',
        intro: {
          explanation:
            'Ir (to go) is irregular: yo voy, tú vas, él, ella or usted va. To say where, use a + place. A + el always becomes al: voy al cine, voy al museo. With la it stays the same: voy a la farmacia. The same verb works for “I go” and “I’m going”: voy al cine can mean both. The v in voy and vas sounds just like a b.',
          examples: [
            { target: 'Voy al cine.', base: 'I’m going to the cinema.' },
            {
              target: '¿Vas al museo? — No, voy al cine.',
              base: 'Are you going to the museum? — No, I’m going to the cinema.',
            },
          ],
        },
        takeaways: [
          'You say voy, vas and va + a + place.',
          'You join a + el into al: voy al cine.',
        ],
        exercises: [
          ex.translationChoice(
            'voy',
            'I go',
            ['you go, informal', 'he goes', 'I want'],
            ['es-voy'],
            { id: 'es.ex.363114e74q6na3' },
          ),
          ex.fillBlank(
            'Yo ___ al cine.',
            'I’m going to the cinema.',
            'voy',
            ['vas', 'va', 'vivo'],
            ['es-voy', 'es-el-cine'],
            {
              id: 'es.ex.h8g7pli837cyfc',
              explanation: 'With yo, ir is voy. Vas is for tú and va for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Vas al museo.',
            ['Voy al museo.', 'Va al museo.', 'Vas al cine.'],
            ['es-vas', 'es-voy', 'es-va', 'es-el-museo', 'es-el-cine'],
            { id: 'es.ex.imn79fvxmfo13j' },
          ),
          ex.translationChoice(
            'el cine',
            'the cinema',
            ['the museum', 'the house', 'the city'],
            ['es-el-cine'],
            { id: 'es.ex.8mpqawr71bj1uz' },
          ),
          ex.fillBlank(
            'Lucía ___ al museo.',
            'Lucía goes to the museum.',
            'va',
            ['voy', 'vas', 'vive'],
            ['es-va', 'es-el-museo'],
            {
              id: 'es.ex.4qpd2ehi0vxdmz',
              explanation: 'With ella (Lucía), ir is va.',
            },
          ),
          ex.matchPairs(
            [
              ['voy', 'I go'],
              ['vas', 'you go, informal'],
              ['va', 'he goes'],
              ['el museo', 'the museum'],
            ],
            ['es-voy', 'es-vas', 'es-va', 'es-el-museo'],
            { id: 'es.ex.d5dlvxeyk74f5i' },
          ),
          ex.fillBlank(
            'Hoy voy ___ cine.',
            'Today I’m going to the cinema.',
            'al',
            ['el', 'en', 'de'],
            ['es-voy', 'es-el-cine'],
            {
              id: 'es.ex.kgobvgwzur5n1y',
              explanation: 'You go a a place, and a + el becomes al: voy al cine.',
            },
          ),
          ex.orderWords(
            'Hoy voy al museo.',
            'Today I’m going to the museum.',
            ['es-voy', 'es-el-museo'],
            {
              id: 'es.ex.xi6oh99wu7sx27',
            },
          ),
          ex.shortAnswer(
            '¿Adónde vas?',
            'Say you’re going to the cinema (start with «Voy»).',
            'Voy al cine.',
            ['Voy al cine', 'Yo voy al cine.', 'Hoy voy al cine.', 'Al cine.'],
            ['es-voy', 'es-el-cine'],
            { id: 'es.ex.p8r1nmycgohq73' },
          ),
          ex.translateWrite(
            'Are you going to the museum? (to a friend)',
            '¿Vas al museo?',
            ['es-vas', 'es-el-museo'],
            {
              id: 'es.ex.51e01vc18n9t2h',
              acceptedAnswers: ['¿Tú vas al museo?', '¿Vas al museo hoy?', '¿Vos vas al museo?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Vamos, van',
        objective:
          'Say where we, you all and they are going: the bakery, the supermarket, the bank.',
        intro: {
          explanation:
            'In the plural: nosotros vamos, ustedes and ellos van. In Latin America ustedes is the only plural “you” (in Spain friends say vosotros, which you only need to recognise). Vamos also means let’s go: ¡vamos al cine! In your barrio (neighbourhood) you go to la panadería for bread, to el supermercado for everything else and to el banco for money matters.',
          examples: [
            { target: 'Vamos a la panadería.', base: 'We’re going to the bakery.' },
            { target: 'Ellos van al supermercado.', base: 'They’re going to the supermarket.' },
          ],
        },
        takeaways: [
          'You say vamos for we and van for ustedes, ellos and ellas.',
          'You name la panadería, el supermercado and el banco.',
        ],
        exercises: [
          ex.translationChoice(
            'vamos',
            'we go',
            ['they go', 'I go', 'you go, informal'],
            ['es-vamos'],
            { id: 'es.ex.an94gnrjyyoaeg' },
          ),
          ex.translationChoice(
            'la panadería',
            'the bakery',
            ['the supermarket', 'the bank', 'the kitchen'],
            ['es-la-panaderia'],
            { id: 'es.ex.6vqm6ireqvag08' },
          ),
          ex.fillBlank(
            'Nosotros ___ a la panadería.',
            'We’re going to the bakery.',
            'vamos',
            ['van', 'va', 'voy'],
            ['es-vamos', 'es-la-panaderia'],
            {
              id: 'es.ex.bf2urnnlr4vv7r',
              explanation: 'With nosotros, ir is vamos. Van is for ustedes or ellos.',
            },
          ),
          ex.listenChoice(
            'Van al supermercado.',
            ['Vamos al supermercado.', 'Van al banco.', 'Va al supermercado.'],
            ['es-van', 'es-vamos', 'es-el-supermercado', 'es-el-banco'],
            { id: 'es.ex.dzd9d0vzzfmddj' },
          ),
          ex.matchPairs(
            [
              ['vamos', 'we go'],
              ['van', 'they go'],
              ['el banco', 'the bank'],
              ['el supermercado', 'the supermarket'],
            ],
            ['es-vamos', 'es-van', 'es-el-banco', 'es-el-supermercado'],
            { id: 'es.ex.jaw23xz0z4le5n' },
          ),
          ex.fillBlank(
            '¿Ustedes ___ al banco?',
            'Are you all going to the bank?',
            'van',
            ['vamos', 'vas', 'voy'],
            ['es-van', 'es-el-banco'],
            {
              id: 'es.ex.bxsrctwaan3d16',
              explanation: 'Ustedes takes the same form as ellos: van.',
            },
          ),
          ex.orderWords(
            'Los sábados vamos al supermercado.',
            'On Saturdays we go to the supermarket.',
            ['es-vamos', 'es-el-supermercado'],
            { id: 'es.ex.xqmann7w4c4uqu' },
          ),
          ex.fillBlank(
            '¡___ a la panadería! Quiero pan.',
            'Let’s go to the bakery! I want bread.',
            'Vamos',
            ['Van', 'Vas', 'Va'],
            ['es-vamos', 'es-la-panaderia'],
            {
              id: 'es.ex.ca3f8egw0b4b7h',
              explanation: 'Vamos is we go, and also let’s go.',
            },
          ),
          ex.shortAnswer(
            '¿Adónde van ustedes?',
            'Say you (all) are going to the bank (start with «Vamos»).',
            'Vamos al banco.',
            ['Vamos al banco', 'Nosotros vamos al banco.', 'Nosotras vamos al banco.', 'Al banco.'],
            ['es-vamos', 'es-el-banco'],
            { id: 'es.ex.uylmyv0tzize35' },
          ),
          ex.translateWrite(
            'They go to the supermarket on Saturdays.',
            'Ellos van al supermercado los sábados.',
            ['es-van', 'es-el-supermercado'],
            {
              id: 'es.ex.vsfdhbusrfpnsl',
              acceptedAnswers: [
                'Van al supermercado los sábados.',
                'Los sábados ellos van al supermercado.',
                'Los sábados van al supermercado.',
                'Ellas van al supermercado los sábados.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Dónde está la farmacia?',
        objective: 'Ask where a place is and say if it is near or far.',
        intro: {
          explanation:
            'To ask for a place, use está, as in unit 6: ¿dónde está la farmacia? Answer está cerca (it’s near) or está lejos (it’s far); to say near what: cerca de la estación. De + el becomes del: cerca del banco. With a stranger, start with disculpe (excuse me, formal) or perdón. In many Latin American cities distances are given in cuadras (blocks): está a dos cuadras.',
          examples: [
            {
              target: 'Disculpe, ¿dónde está la farmacia?',
              base: 'Excuse me, where is the pharmacy?',
            },
            { target: 'La estación está cerca del banco.', base: 'The station is near the bank.' },
          ],
        },
        takeaways: [
          'You ask ¿dónde está…? and answer with cerca or lejos.',
          'You join de + el into del: cerca del banco.',
        ],
        exercises: [
          ex.translationChoice(
            'la farmacia',
            'the pharmacy',
            ['the bakery', 'the station', 'the bank'],
            ['es-la-farmacia'],
            { id: 'es.ex.x6p9ktfdvbu09b' },
          ),
          ex.translationChoice('lejos', 'far', ['near', 'next to', 'behind'], ['es-lejos'], {
            id: 'es.ex.pkno7icws0rxo6',
          }),
          ex.listenChoice(
            'La estación está lejos.',
            ['La estación está cerca.', 'La farmacia está lejos.', 'La calle está lejos.'],
            ['es-la-estacion', 'es-lejos', 'es-cerca-de', 'es-la-farmacia', 'es-la-calle'],
            { id: 'es.ex.e85gfipjmlo0qp' },
          ),
          ex.fillBlank(
            'La farmacia está cerca ___ banco.',
            'The pharmacy is near the bank.',
            'del',
            ['al', 'en', 'el'],
            ['es-cerca-de', 'es-la-farmacia'],
            {
              id: 'es.ex.tg4vs3iouu56bk',
              explanation: 'Cerca de + el banco becomes cerca del banco (de + el = del).',
            },
          ),
          ex.matchPairs(
            [
              ['la farmacia', 'the pharmacy'],
              ['la estación', 'the station'],
              ['la calle', 'the street'],
              ['lejos', 'far'],
            ],
            ['es-la-farmacia', 'es-la-estacion', 'es-la-calle', 'es-lejos'],
            { id: 'es.ex.yabm3twxyzagep' },
          ),
          ex.fillBlank(
            'Disculpe, ¿dónde ___ la estación?',
            'Excuse me, where is the station?',
            'está',
            ['es', 'hay', 'va'],
            ['es-la-estacion'],
            {
              id: 'es.ex.zul18627w05jb6',
              explanation: 'To say where something is, Spanish uses estar: ¿dónde está…?',
            },
          ),
          ex.orderWords(
            'El banco está en la calle Bolívar.',
            'The bank is on Bolívar Street.',
            ['es-la-calle', 'es-el-banco'],
            { id: 'es.ex.qxk334ejyjhitt' },
          ),
          ex.fillBlank(
            'El museo está muy ___. Vamos en autobús.',
            'The museum is very far. Let’s go by bus.',
            'lejos',
            ['cerca', 'bien', 'grande'],
            ['es-lejos', 'es-el-museo'],
            {
              id: 'es.ex.sq2mr9tnhpeaid',
              skill: 'vocabulary',
              explanation:
                'Lejos is far, the opposite of cerca. The city bus is el autobús (in Mexico also el camión, in Argentina el colectivo).',
            },
          ),
          ex.shortAnswer(
            '¿La estación está lejos?',
            'Answer that no, it’s near (start with «No, está»).',
            'No, está cerca.',
            ['No, está cerca', 'No, la estación está cerca.', 'No, está muy cerca.'],
            ['es-cerca-de', 'es-la-estacion'],
            { id: 'es.ex.rxw4ufevwwvnvu' },
          ),
          ex.translateWrite(
            'Excuse me, where is the pharmacy?',
            'Disculpe, ¿dónde está la farmacia?',
            ['es-la-farmacia'],
            {
              id: 'es.ex.fao2o1yen6ogin',
              acceptedAnswers: [
                'Perdón, ¿dónde está la farmacia?',
                'Disculpa, ¿dónde está la farmacia?',
                'Disculpá, ¿dónde está la farmacia?',
                '¿Dónde está la farmacia?',
                'Disculpe, ¿dónde hay una farmacia?',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Dobla a la derecha',
        objective: 'Give and follow simple directions with tú and usted.',
        intro: {
          explanation:
            'To give directions to a friend, use the tú command. For most verbs it is the same as the él / ella form of the present: él dobla → ¡dobla! (turn). Seguir (to keep going) changes e to i (sigo, sigues, sigue), so the command is sigue. With usted the vowel swaps: doble, siga. You will also hear gira (turn). A la derecha is on the right, a la izquierda on the left, and derecho (or todo derecho) is straight ahead: don’t mix up derecho (straight) and derecha (right). Pronunciation: the single r in derecha is a quick tap, like the tt in American butter, while rr, as in perro or barrio, is a strong trill. The z in izquierda sounds like an s.',
          examples: [
            {
              target: 'Sigue derecho y dobla a la izquierda.',
              base: 'Go straight ahead and turn left.',
            },
            { target: 'Doble a la derecha, señora.', base: 'Turn right, madam.' },
          ],
        },
        takeaways: [
          'You give directions with dobla and sigue (tú), and doble and siga with usted.',
          'You say a la derecha, a la izquierda and derecho.',
        ],
        exercises: [
          ex.translationChoice(
            'a la derecha',
            'on the right',
            ['on the left', 'straight ahead', 'far'],
            ['es-a-la-derecha'],
            { id: 'es.ex.sopoqzzdkd4b1x' },
          ),
          ex.matchPairs(
            [
              ['a la derecha', 'on the right'],
              ['a la izquierda', 'on the left'],
              ['derecho', 'straight ahead'],
              ['sigue', 'keep going'],
            ],
            ['es-a-la-derecha', 'es-a-la-izquierda', 'es-derecho', 'es-sigue'],
            { id: 'es.ex.awvss06s4san7z' },
          ),
          ex.listenChoice(
            'Dobla a la izquierda.',
            ['Dobla a la derecha.', 'Sigue derecho.', 'Sigue a la izquierda.'],
            ['es-dobla', 'es-a-la-izquierda', 'es-a-la-derecha', 'es-derecho', 'es-sigue'],
            { id: 'es.ex.35pqtybt413z87' },
          ),
          ex.fillBlank(
            '___ a la derecha en la calle Bolívar.',
            'Turn right on Bolívar Street.',
            'Dobla',
            ['Sigue', 'Vas', 'Voy'],
            ['es-dobla', 'es-a-la-derecha'],
            {
              id: 'es.ex.zxagy2iy0j9gmj',
              explanation: 'Dobla is turn (tú). Sigue is keep going.',
            },
          ),
          ex.fillBlank(
            'Sigue ___ y la estación está a la izquierda.',
            'Keep going straight ahead and the station is on the left.',
            'derecho',
            ['derecha', 'lejos', 'cerca'],
            ['es-derecho', 'es-sigue', 'es-a-la-izquierda'],
            {
              id: 'es.ex.ya6n4uzuv3kwm4',
              explanation: 'Derecho (with o) means straight ahead; derecha (with a) means right.',
            },
          ),
          ex.translationChoice(
            'sigue',
            'keep going',
            ['turn, informal', 'I go', 'on the right'],
            ['es-sigue'],
            { id: 'es.ex.njvwoe14brfdil' },
          ),
          ex.listenChoice(
            'El perro está a la derecha.',
            ['Pero está a la derecha.', 'El perro está a la izquierda.'],
            ['es-a-la-derecha', 'es-a-la-izquierda'],
            { id: 'es.ex.bpule25gzn72lx' },
          ),
          ex.fillBlank(
            'Señora, ___ derecho dos cuadras.',
            'Madam, keep going straight ahead for two blocks.',
            'siga',
            ['sigue', 'dobla', 'va'],
            ['es-sigue', 'es-derecho'],
            {
              id: 'es.ex.060wwflhgjs58m',
              explanation:
                'With usted (señora) the command is siga. Sigue is for a friend you call tú.',
            },
          ),
          ex.translateWrite(
            'Turn left and keep going straight ahead. (to a friend)',
            'Dobla a la izquierda y sigue derecho.',
            ['es-dobla', 'es-a-la-izquierda', 'es-sigue', 'es-derecho'],
            {
              id: 'es.ex.om5zu7iv8v742b',
              acceptedAnswers: [
                'Dobla a la izquierda y sigue todo derecho.',
                'Dobla a la izquierda, sigue derecho.',
                'Dobla a la izquierda y después sigue derecho.',
                'Dobla a la izquierda y sigue todo recto.',
                'Gira a la izquierda y sigue derecho.',
                'Doblá a la izquierda y seguí derecho.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Dónde está el banco?',
            'Tell a friend to turn right (start with «Dobla»).',
            'Dobla a la derecha.',
            [
              'Dobla a la derecha',
              'Dobla a la derecha y sigue derecho.',
              'Doble a la derecha.',
              'Gira a la derecha.',
              'Doblá a la derecha.',
            ],
            ['es-dobla', 'es-a-la-derecha'],
            { id: 'es.ex.k4ybbwz0pcx2gq' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En el barrio',
        objective: 'Understand directions and plans in a conversation and a message.',
        intro: {
          explanation:
            'Now put it all together: where you are going (voy al cine), where a place is (cerca de la estación, enfrente del banco) and how to get there (sigue derecho, dobla a la izquierda). Remember from unit 6: al lado de (next to) and enfrente de (opposite).',
          examples: [
            { target: 'La farmacia del barrio está cerca.', base: 'The local pharmacy is nearby.' },
            {
              target: 'El cine está enfrente del museo.',
              base: 'The cinema is opposite the museum.',
            },
          ],
        },
        takeaways: [
          'You understand simple directions in a conversation.',
          'You say where you are going and where a place is.',
        ],
        exercises: [
          question(
            'es.ex.6o7sfy1wtw1uku',
            ESTACION,
            'Where does Juan want to go?',
            'To the station',
            ['To the bank', 'To the cinema', 'To the pharmacy'],
            ['es-la-estacion'],
            'Juan asks “¿Dónde está la estación?”.',
          ),
          question(
            'es.ex.kmdzfw2bi7dx25',
            ESTACION,
            'What directions does Camila give?',
            'Straight ahead for two blocks, then left',
            [
              'Straight ahead for two blocks, then right',
              'Turn left, then straight ahead for twelve blocks',
              'It’s far: take the bus',
            ],
            ['es-derecho', 'es-dobla', 'es-a-la-izquierda'],
            'Camila says “Sigue derecho dos cuadras y dobla a la izquierda”.',
          ),
          question(
            'es.ex.w80fp6sokfpp68',
            ESTACION,
            'Where is the station?',
            'Opposite the bank',
            ['Next to the bank', 'Behind the bank', 'Far from the bank'],
            ['es-el-banco'],
            'Juan asks if it is “al lado del banco” and Camila answers “No, está enfrente del banco”.',
          ),
          ex.listenChoice(
            'Vamos al cine el sábado.',
            ['Van al cine el sábado.', 'Vamos al museo el sábado.', 'Voy al cine el sábado.'],
            ['es-vamos', 'es-van', 'es-voy', 'es-el-cine'],
            { id: 'es.ex.66poko7qb6pmd2' },
          ),
          question(
            'es.ex.c6cbrgsw0k6xnr',
            CINE,
            'Where are Sofía and Lucía going today?',
            'To the cinema',
            ['To the museum', 'To the station', 'To the supermarket'],
            ['es-vamos', 'es-el-cine'],
            'Sofía writes “Hoy vamos al cine con Lucía”.',
          ),
          question(
            'es.ex.ajd4m3vnlcf7me',
            CINE,
            'Where is the cinema?',
            'On Juárez Street, near the station',
            [
              'On Juárez Street, far from the station',
              'On Bolívar Street, near the bank',
              'Next to the bakery',
            ],
            ['es-la-calle', 'es-cerca-de'],
            'She writes “El cine está en la calle Juárez, cerca de la estación”.',
          ),
          question(
            'es.ex.dy7dd2dlg1alba',
            CINE,
            'What does Sofía do before the film?',
            'She goes to the bakery',
            ['She goes to the bank', 'She goes to the pharmacy', 'She goes to Martín’s house'],
            ['es-la-panaderia', 'es-voy'],
            'She writes “Primero voy a la panadería y después voy al cine”.',
          ),
          ex.matchPairs(
            [
              ['la panadería', 'the bakery'],
              ['el cine', 'the cinema'],
              ['cerca de', 'near'],
              ['la calle', 'the street'],
            ],
            ['es-la-panaderia', 'es-el-cine', 'es-cerca-de', 'es-la-calle'],
            { id: 'es.ex.wqsz7n2mx2p5ie' },
          ),
          ex.translateWrite(
            'The bakery is near the station.',
            'La panadería está cerca de la estación.',
            ['es-la-panaderia', 'es-cerca-de', 'es-la-estacion'],
            {
              id: 'es.ex.v8gb3y87btzbyc',
              acceptedAnswers: ['La panadería queda cerca de la estación.'],
            },
          ),
          ex.shortAnswer(
            '¿Vas con nosotros al cine?',
            'Answer yes, you’re going (start with «Sí, voy»).',
            'Sí, voy.',
            [
              'Sí, voy',
              'Sí, voy con ustedes.',
              'Sí, voy al cine.',
              '¡Sí, vamos!',
              'Sí, voy con ustedes al cine.',
            ],
            ['es-voy'],
            { id: 'es.ex.ckt2j5i4klhk7i' },
          ),
        ],
      },
    ],
  },
};
