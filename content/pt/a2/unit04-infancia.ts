import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U4 «Cuando era chico» (docs/PT_A1_A2.md): el pretérito imperfeito para costumbres y
 * descripciones del pasado (-ar: morava; -er / -ir: comia; ser: era; ter: tinha; ir: ia), costumava,
 * el barrio y los vecinos. Falso amigo: brincar es «jugar» (los chicos), no «saltar».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VOVO = dialogue('pt.stim.a2-u4-vovo', 'Una nieta le pregunta a su abuelo por su infancia.', [
  ['Lívia', 'Vovô, como era a sua vida quando o senhor era criança?'],
  ['Vovô', 'Eu morava numa fazenda no interior de Minas. A gente não tinha televisão.'],
  ['Lívia', 'E o que vocês faziam?'],
  [
    'Vovô',
    'A gente brincava no rio e ajudava o meu pai com os animais. Era uma vida simples, mas feliz.',
  ],
]);

const BAIRRO = reading(
  'pt.stim.a2-u4-bairro',
  'post',
  'Una mujer recuerda el barrio donde creció.',
  [
    'Eu cresci num bairro pequeno em Porto Alegre.',
    'Naquela época todo mundo se conhecia. Os vizinhos conversavam na calçada.',
    'Eu e os meus amigos brincávamos na rua até a noite.',
    'Hoje o bairro é diferente, mas eu lembro de tudo.',
  ],
  { from: 'Cecília', title: 'O meu bairro' },
);

const FOTO = reading(
  'pt.stim.a2-u4-foto',
  'description',
  'La descripción de una foto vieja en un álbum familiar.',
  [
    'Nesta foto eu tinha seis anos.',
    'Eu era baixinha e usava óculos.',
    'O meu brinquedo favorito era uma bicicleta vermelha.',
    'Todo domingo a gente ia à casa dos meus avós.',
  ],
  { title: 'Álbum de família' },
);

const ENTREVISTA = dialogue(
  'pt.stim.a2-u4-entrevista',
  'Una entrevista en una radio sobre la escuela de antes.',
  [
    ['Repórter', 'Como era a escola antigamente?'],
    ['Dona Rosa', 'Era muito diferente. A gente costumava ir a pé, e as aulas começavam às sete.'],
    ['Repórter', 'E a senhora gostava de estudar?'],
    ['Dona Rosa', 'Eu gostava de ler, mas não gostava de matemática!'],
  ],
);

export const PT_A2_U04: PtUnitDef = {
  names: ['Lívia', 'Vovô', 'Minas', 'Porto Alegre', 'Cecília', 'Repórter', 'Dona Rosa'],
  support: [
    'estava',
    'álbum',
    'foto',
    'baixinha',
    'usava',
    'brinco',
    'morei',
    'morar',
    'parque',
    'brincavam',
    'jogavam',
    'brincam',
    'histórias',
    'gostei',
    'gostar',
    'vida',
    'numa',
    'interior',
    'televisão',
    'faziam',
    'ajudava',
    'animais',
    'simples',
    'conhecia',
    'cresci',
    'num',
    'conversavam',
    'calçada',
    'brincávamos',
    'diferente',
    'primeira',
    'primeiro',
    'eram',
    'acordar',
    'costumo',
    'costumei',
    'ir',
    'aulas',
    'começavam',
    'estudar',
    'matemática',
    'difícil',
    'bola',
    'tranquilo',
    'escrevia',
    'cartas',
  ],
  unit: {
    position: 4,
    title: 'Cuando era chico',
    titleEn: 'Infância',
    description:
      'El pretérito imperfeito (era, tinha, morava, brincava, ia), costumava, el barrio, los vecinos y el falso amigo brincar.',
    emoji: '🧸',
    objective:
      'Puedes contar cómo era tu vida de niño, qué hacías siempre y cómo eran las personas y los lugares de antes.',
    grammar: {
      title: 'Pretérito imperfeito',
      explanation:
        'Para costumbres y descripciones del pasado («hacía», «era»). -ar: eu / ele morava, nós morávamos, eles moravam. -er / -ir: comia, saía. Irregulares: ser → era; ter → tinha; ir → ia. Costumava + verbo es «solía»: costumava ir a pé.',
      examples: [
        {
          target: 'Quando eu era criança, morava no interior.',
          base: 'Cuando era chico, vivía en el interior.',
        },
        { target: 'A gente brincava na rua.', base: 'Jugábamos en la calle.' },
        {
          target: 'Todo domingo a gente ia à casa dos avós.',
          base: 'Todos los domingos íbamos a la casa de los abuelos.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U4). Sin revisión nativa: revisar el imperfeito, brincar y la entrevista.',
    },
    words: [
      w(
        'pt-era',
        'era',
        'era',
        'Quando eu era criança, eu era muito tímido.',
        'Cuando era chico, era muy tímido.',
        ['past'],
      ),
      w('pt-tinha', 'tinha', 'tenía', 'Eu tinha um cachorro.', 'Tenía un perro.', ['past']),
      w(
        'pt-morava',
        'morava',
        'vivía',
        'Eu morava perto da escola.',
        'Vivía cerca de la escuela.',
        ['past'],
      ),
      w(
        'pt-brincava',
        'brincava',
        'jugaba',
        'Eu brincava na rua com os vizinhos.',
        'Jugaba en la calle con los vecinos.',
        ['past'],
        {
          acceptedTexts: ['brincar'],
        },
      ),
      w(
        'pt-gostava-de',
        'gostava de',
        'me gustaba / le gustaba',
        'Eu gostava de ler.',
        'Me gustaba leer.',
        ['past'],
        {
          acceptedTranslations: ['me gustaba', 'le gustaba'],
        },
      ),
      w('pt-ia', 'ia', 'iba', 'Eu ia à escola a pé.', 'Iba a la escuela caminando.', ['past']),
      w(
        'pt-costumava',
        'costumava',
        'solía',
        'Eu costumava ler à noite.',
        'Solía leer por la noche.',
        ['past'],
      ),
      w(
        'pt-crianca',
        'criança',
        'niño / niña (chico)',
        'Quando eu era criança, morava no interior.',
        'Cuando era chico, vivía en el interior.',
        ['people'],
        {
          acceptedTranslations: ['niño', 'niña', 'chico', 'nene'],
          emoji: '🧒',
        },
      ),
      w(
        'pt-infancia',
        'infância',
        'infancia',
        'Eu tive uma infância feliz.',
        'Tuve una infancia feliz.',
        ['time'],
      ),
      w(
        'pt-bairro',
        'bairro',
        'barrio',
        'O meu bairro é muito tranquilo.',
        'Mi barrio es muy tranquilo.',
        ['places'],
        {
          emoji: '🏘️',
        },
      ),
      w(
        'pt-vizinho',
        'vizinho',
        'vecino',
        'Os vizinhos são simpáticos.',
        'Los vecinos son simpáticos.',
        ['people'],
        {
          acceptedTexts: ['vizinha'],
          acceptedTranslations: ['vecina'],
        },
      ),
      w(
        'pt-antigamente',
        'antigamente',
        'antes / antiguamente',
        'Antigamente, a gente escrevia cartas.',
        'Antes escribíamos cartas.',
        ['time'],
        {
          acceptedTranslations: ['antes', 'antiguamente'],
        },
      ),
      w(
        'pt-naquela-epoca',
        'naquela época',
        'en esa época',
        'Naquela época não tinha celular.',
        'En esa época no había celulares.',
        ['time'],
        {
          acceptedTranslations: ['en aquella época', 'en ese tiempo'],
        },
      ),
      w(
        'pt-lembro',
        'lembro',
        'me acuerdo / recuerdo',
        'Eu lembro da minha primeira escola.',
        'Me acuerdo de mi primera escuela.',
        ['verbs'],
        {
          acceptedTranslations: ['me acuerdo', 'recuerdo'],
        },
      ),
      w(
        'pt-brinquedo',
        'brinquedo',
        'juguete',
        'O meu brinquedo favorito era uma bola.',
        'Mi juguete favorito era una pelota.',
        ['things'],
        {
          emoji: '🪀',
        },
      ),
      w(
        'pt-fazenda',
        'fazenda',
        'campo / granja',
        'O meu avô morava numa fazenda.',
        'Mi abuelo vivía en el campo.',
        ['places'],
        {
          acceptedTranslations: ['campo', 'granja', 'estancia', 'hacienda'],
          emoji: '🐄',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Quando eu era criança',
        objective: 'Describir cómo eras de niño con era y tinha.',
        intro: {
          explanation:
            'Para describir el pasado se usa el imperfeito. Ser → era («era») y ter → tinha («tenía»): eu era tímido, eu tinha um cachorro. Quando eu era criança es «cuando era chico».',
          examples: [
            {
              target: 'Quando eu era criança, eu era muito tímido.',
              base: 'Cuando era chico, era muy tímido.',
            },
            { target: 'Eu tinha um cachorro preto.', base: 'Tenía un perro negro.' },
          ],
        },
        takeaways: [
          'Describes el pasado con era y tinha.',
          'Empiezas un recuerdo: quando eu era criança…',
        ],
        exercises: [
          ex.translationChoice(
            'criança',
            'niño / niña (chico)',
            ['crianza', 'adulto', 'abuelo'],
            ['pt-crianca'],
            {
              id: 'pt.ex.p73aex3vsckezj',
              explanation: 'Criança es «niño» o «niña» (un chico); no es «crianza».',
            },
          ),
          ex.translationChoice('tinha', 'tenía', ['tuve', 'tengo', 'tenían'], ['pt-tinha'], {
            id: 'pt.ex.kiunkf74iz4wsb',
          }),
          ex.listenChoice(
            'Quando eu era criança.',
            ['Quando ele era criança.', 'Quando eu tinha dez anos.', 'Quando eu fui criança.'],
            ['pt-era', 'pt-crianca'],
            { id: 'pt.ex.hkm8eo0scnwiv4' },
          ),
          ex.fillBlank(
            'Quando eu ___ criança, morava no Rio.',
            'Cuando era chico, vivía en Río.',
            'era',
            ['fui', 'sou', 'estava'],
            ['pt-era', 'pt-crianca', 'pt-morava'],
            {
              id: 'pt.ex.61d1ydrm15iern',
              explanation: 'Descripción del pasado: imperfeito → era.',
            },
          ),
          ex.fillBlank(
            'Eu ___ um gato branco.',
            'Tenía un gato blanco.',
            'tinha',
            ['tive', 'tenho', 'era'],
            ['pt-tinha'],
            {
              id: 'pt.ex.3blzox38esan0t',
              explanation: 'Algo que tenías durante un tiempo: tinha.',
            },
          ),
          question(
            'pt.ex.et942cuegtn3f5',
            FOTO,
            '¿Cómo era la chica de la foto?',
            'Bajita y con lentes',
            ['Alta y con lentes', 'Bajita y rubia', 'Muy tímida'],
            ['pt-era', 'pt-ia'],
            'La descripción dice: «Eu era baixinha e usava óculos».',
          ),
          question(
            'pt.ex.i4ftowfmnkhzwz',
            FOTO,
            '¿Cuál era su juguete favorito?',
            'Una bicicleta roja',
            ['Una pelota roja', 'Un auto azul', 'Una muñeca'],
            ['pt-brinquedo', 'pt-tinha'],
            'Dice: «O meu brinquedo favorito era uma bicicleta vermelha».',
          ),
          ex.orderWords(
            'Quando eu era criança eu tinha um cachorro.',
            'Cuando era chico tenía un perro.',
            ['pt-era', 'pt-tinha'],
            {
              id: 'pt.ex.q80253hopfysvl',
            },
          ),
          ex.shortAnswer(
            'Como você era quando era criança? (tímido)',
            '¿Cómo eras de niño? (Responde que eras muy tímido.)',
            'Eu era muito tímido.',
            [
              'Era muito tímido.',
              'Eu era muito tímida.',
              'Era muito tímida.',
              'Quando eu era criança, eu era muito tímido.',
            ],
            ['pt-era'],
            { id: 'pt.ex.kmow8u41xcunx4' },
          ),
          ex.translateWrite(
            'Cuando era chico, tenía un perro.',
            'Quando eu era criança, eu tinha um cachorro.',
            ['pt-tinha', 'pt-crianca'],
            {
              id: 'pt.ex.iud53kjrkwluln',
              acceptedAnswers: [
                'Quando eu era criança, tinha um cachorro.',
                'Quando era criança, eu tinha um cachorro.',
                'Quando era criança, tinha um cachorro.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Eu morava, eu brincava',
        objective: 'Contar qué hacías siempre con el imperfeito en -ava.',
        intro: {
          explanation:
            'Los verbos en -ar hacen el imperfeito en -ava: morar → eu morava, brincar → eu brincava, gostar → eu gostava de. Falso amigo: brincar es «jugar» (los chicos); jogar es jugar a un deporte o un juego con reglas.',
          examples: [
            { target: 'Eu morava perto da praia.', base: 'Vivía cerca de la playa.' },
            { target: 'A gente brincava na rua.', base: 'Jugábamos en la calle.' },
          ],
        },
        takeaways: [
          'Cuentas costumbres: morava, brincava, gostava de.',
          'Distingues brincar (jugar de niño) y jogar.',
        ],
        exercises: [
          ex.translationChoice(
            'brincava',
            'jugaba',
            ['saltaba', 'trabajaba', 'caminaba'],
            ['pt-brincava'],
            {
              id: 'pt.ex.r2d9eh5x259ftn',
              explanation: 'Falso amigo: brincar es «jugar», no «saltar».',
            },
          ),
          ex.translationChoice('morava', 'vivía', ['moría', 'viví', 'mira'], ['pt-morava'], {
            id: 'pt.ex.qw3wj22lney6wh',
          }),
          ex.listenChoice(
            'Eu brincava na rua.',
            ['Eu brinco na rua.', 'Ele brincava na praia.', 'Eu morava na rua.'],
            ['pt-brincava'],
            { id: 'pt.ex.oguc5u4r3zw3bc' },
          ),
          ex.fillBlank(
            'Quando eu era criança, eu ___ em Recife.',
            'Cuando era chico, vivía en Recife.',
            'morava',
            ['moro', 'morei', 'morar'],
            ['pt-morava'],
            { id: 'pt.ex.f4h3r98lu1bhti' },
          ),
          ex.fillBlank(
            'As crianças ___ no parque todo dia.',
            'Los chicos jugaban en el parque todos los días.',
            'brincavam',
            ['jogavam', 'brincava', 'brincam'],
            ['pt-brincava', 'pt-crianca'],
            {
              id: 'pt.ex.la0dlw3rl9sxyr',
              explanation: 'Los chicos jugando: brincar; con elas, -avam.',
            },
          ),
          ex.fillBlank(
            'Eu ___ de ler histórias.',
            'Me gustaba leer historias.',
            'gostava',
            ['gosto', 'gostei', 'gostar'],
            ['pt-gostava-de'],
            { id: 'pt.ex.nqtdny8z1vofdr' },
          ),
          question(
            'pt.ex.3pb84oe7hars33',
            VOVO,
            '¿Dónde vivía el abuelo de niño?',
            'En el campo, en el interior de Minas',
            ['En el centro de una ciudad', 'Cerca de la playa', 'En São Paulo'],
            ['pt-morava', 'pt-fazenda'],
            'El abuelo dice: «Eu morava numa fazenda no interior de Minas».',
          ),
          question(
            'pt.ex.gp5sdip0stb1ft',
            VOVO,
            '¿Qué hacían los chicos?',
            'Jugaban en el río y ayudaban con los animales',
            ['Miraban televisión', 'Jugaban al fútbol en la calle', 'Iban a la escuela en autobús'],
            ['pt-brincava'],
            'Dice: «A gente brincava no rio e ajudava o meu pai com os animais».',
          ),
          ex.shortAnswer(
            'Onde você morava quando era criança? (Rosario)',
            '¿Dónde vivías de niño? (Responde que vivías en Rosario.)',
            'Eu morava em Rosario.',
            ['Morava em Rosario.', 'Quando eu era criança, eu morava em Rosario.', 'Em Rosario.'],
            ['pt-morava'],
            { id: 'pt.ex.pgs5itgbw08avw' },
          ),
          ex.translateWrite(
            'Me gustaba jugar en la calle.',
            'Eu gostava de brincar na rua.',
            ['pt-gostava-de', 'pt-brincava'],
            {
              id: 'pt.ex.ajdwum04pb0lu4',
              acceptedAnswers: ['Gostava de brincar na rua.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'O meu bairro',
        objective: 'Describir el barrio y los vecinos de antes.',
        intro: {
          explanation:
            'Bairro es «barrio» y vizinho, «vecino». Naquela época es «en esa época»: naquela época todo mundo se conhecia. Lembro (de) es «me acuerdo (de)»: eu lembro de tudo.',
          examples: [
            {
              target: 'Naquela época os vizinhos conversavam na rua.',
              base: 'En esa época los vecinos charlaban en la calle.',
            },
            {
              target: 'Eu lembro do meu primeiro bairro.',
              base: 'Me acuerdo de mi primer barrio.',
            },
          ],
        },
        takeaways: [
          'Describes un barrio y a sus vecinos.',
          'Dices que te acuerdas de algo: eu lembro de…',
        ],
        exercises: [
          ex.imageChoice('🏘️', 'bairro', ['fazenda', 'brinquedo', 'criança'], ['pt-bairro'], {
            id: 'pt.ex.4wmw4m0a4gwhp4',
          }),
          ex.translationChoice('vizinho', 'vecino', ['amigo', 'primo', 'chico'], ['pt-vizinho'], {
            id: 'pt.ex.6fywhrhxf77990',
          }),
          ex.translationChoice(
            'lembro',
            'me acuerdo / recuerdo',
            ['me llamo', 'llevo', 'lloro'],
            ['pt-lembro'],
            { id: 'pt.ex.21f6h9t97rhv3u' },
          ),
          ex.listenChoice(
            'Eu lembro da minha infância.',
            [
              'Eu lembro da minha família.',
              'Ela lembra da infância.',
              'Eu gosto da minha infância.',
            ],
            ['pt-lembro', 'pt-infancia'],
            { id: 'pt.ex.rcriw72e5hcvcx' },
          ),
          ex.fillBlank(
            '___ época, todo mundo se conhecia.',
            'En esa época todos se conocían.',
            'Naquela',
            ['Na', 'Nesta', 'Quando'],
            ['pt-naquela-epoca'],
            { id: 'pt.ex.zclpkl97mu2clx' },
          ),
          question(
            'pt.ex.6lwknqoxhawrsl',
            BAIRRO,
            '¿Cómo era el barrio de Cecília?',
            'Chico, y todos se conocían',
            ['Grande y ruidoso', 'Nuevo y moderno', 'Cerca de la playa'],
            ['pt-bairro', 'pt-naquela-epoca'],
            'Cecília escribe: «um bairro pequeno… Naquela época todo mundo se conhecia».',
          ),
          question(
            'pt.ex.ajopiiqdyg6b1x',
            BAIRRO,
            '¿Qué hacían los vecinos?',
            'Charlaban en la acera',
            ['Jugaban en la calle', 'Trabajaban en el campo', 'Iban a la playa'],
            ['pt-vizinho'],
            'Dice: «Os vizinhos conversavam na calçada».',
          ),
          question(
            'pt.ex.lpoxgm38tb8bi9',
            BAIRRO,
            '¿Cómo es el barrio hoy?',
            'Diferente, pero Cecília se acuerda de todo',
            ['Igual que antes', 'Ya no existe', 'Más chico'],
            ['pt-lembro'],
            'Al final: «Hoje o bairro é diferente, mas eu lembro de tudo».',
          ),
          ex.shortAnswer(
            'Você lembra da sua primeira escola?',
            '¿Te acuerdas de tu primera escuela? (Responde que sí, que te acuerdas de todo.)',
            'Sim, eu lembro de tudo.',
            [
              'Lembro, sim! Lembro de tudo.',
              'Sim, lembro de tudo.',
              'Eu lembro de tudo.',
              'Lembro de tudo.',
            ],
            ['pt-lembro'],
            { id: 'pt.ex.9rklxqyz979b2z' },
          ),
          ex.translateWrite(
            'Mis vecinos eran muy simpáticos.',
            'Os meus vizinhos eram muito simpáticos.',
            ['pt-vizinho'],
            {
              id: 'pt.ex.6ef9pfhk7v9kq9',
              acceptedAnswers: ['Meus vizinhos eram muito simpáticos.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Eu costumava…',
        objective: 'Contar costumbres con costumava, ia y antigamente.',
        intro: {
          explanation:
            'Costumava + verbo es «solía»: eu costumava ir a pé. Ir en imperfeito es ia: todo domingo a gente ia à praia. Antigamente es «antes», «en otros tiempos».',
          examples: [
            { target: 'Antigamente eu costumava ler muito.', base: 'Antes solía leer mucho.' },
            {
              target: 'Todo verão a gente ia para a fazenda.',
              base: 'Todos los veranos íbamos al campo.',
            },
          ],
        },
        takeaways: ['Cuentas costumbres con costumava e ia.', 'Comparas con antigamente.'],
        exercises: [
          ex.translationChoice(
            'costumava',
            'solía',
            ['costaba', 'acostumbro', 'cosía'],
            ['pt-costumava'],
            { id: 'pt.ex.e7r9maysx3sv9r' },
          ),
          ex.translationChoice(
            'antigamente',
            'antes / antiguamente',
            ['ahora', 'después', 'siempre'],
            ['pt-antigamente'],
            {
              id: 'pt.ex.un9w2dpzm43fgv',
            },
          ),
          ex.listenChoice(
            'Todo domingo a gente ia à praia.',
            [
              'Todo domingo a gente vai à praia.',
              'Todo sábado a gente ia à praia.',
              'Todo domingo a gente ia ao cinema.',
            ],
            ['pt-ia'],
            { id: 'pt.ex.ke0tok1zzju4xe' },
          ),
          ex.fillBlank(
            'Eu ___ à escola de bicicleta.',
            'Iba a la escuela en bicicleta.',
            'ia',
            ['fui', 'vou', 'era'],
            ['pt-ia'],
            { id: 'pt.ex.0m5j2yqjza3437', explanation: 'Costumbre del pasado: ir → ia.' },
          ),
          ex.fillBlank(
            'Eu ___ acordar cedo no verão.',
            'Solía levantarme temprano en verano.',
            'costumava',
            ['costumo', 'costumei', 'tinha'],
            ['pt-costumava'],
            { id: 'pt.ex.ytyypq8hkzan4n' },
          ),
          question(
            'pt.ex.hv6mvpnk281ynr',
            ENTREVISTA,
            '¿Cómo iba Dona Rosa a la escuela?',
            'Caminando',
            ['En autobús', 'En bicicleta', 'En auto con su papá'],
            ['pt-costumava'],
            'Dona Rosa dice: «A gente costumava ir a pé».',
          ),
          question(
            'pt.ex.se1xjzfo0rcybh',
            ENTREVISTA,
            '¿Qué le gustaba y qué no?',
            'Le gustaba leer, pero no matemática',
            ['Le gustaba matemática, pero no leer', 'Le gustaba todo', 'No le gustaba estudiar'],
            ['pt-gostava-de'],
            'Dice: «Eu gostava de ler, mas não gostava de matemática!».',
          ),
          question(
            'pt.ex.65437a8oftqbd8',
            FOTO,
            '¿Qué hacía la familia los domingos?',
            'Iba a la casa de los abuelos',
            ['Iba a la playa', 'Andaba en bicicleta', 'Se quedaba en casa'],
            ['pt-ia'],
            'La descripción dice: «Todo domingo a gente ia à casa dos meus avós».',
          ),
          ex.shortAnswer(
            'O que você costumava fazer no verão? (ir à praia)',
            '¿Qué solías hacer en verano? (Responde que solías ir a la playa.)',
            'Eu costumava ir à praia.',
            ['Costumava ir à praia.', 'Eu ia à praia.', 'No verão eu costumava ir à praia.'],
            ['pt-costumava'],
            { id: 'pt.ex.vn2vcmxs0rkiu0' },
          ),
          ex.translateWrite(
            'Antes iba a la escuela caminando.',
            'Antigamente eu ia à escola a pé.',
            ['pt-antigamente', 'pt-ia'],
            {
              id: 'pt.ex.mmf0xmywuyh6o6',
              acceptedAnswers: [
                'Antigamente ia à escola a pé.',
                'Antes eu ia à escola a pé.',
                'Antigamente eu ia para a escola a pé.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'A minha infância',
        objective: 'Contar tu infancia combinando todo.',
        intro: {
          explanation:
            'Para contar la infancia se combinan descripciones (eu era, eu tinha) y costumbres (eu brincava, a gente ia). El perfeito queda para algo que pasó una vez: um dia eu caí da bicicleta.',
          examples: [
            { target: 'Eu tive uma infância feliz.', base: 'Tuve una infancia feliz.' },
            {
              target: 'Eu morava numa fazenda e brincava com os animais.',
              base: 'Vivía en el campo y jugaba con los animales.',
            },
          ],
        },
        takeaways: [
          'Cuentas tu infancia con el imperfeito.',
          'Nombras juguetes, lugares y personas de antes.',
        ],
        exercises: [
          ex.translationChoice(
            'brinquedo',
            'juguete',
            ['brindis', 'regalo', 'pelota'],
            ['pt-brinquedo'],
            { id: 'pt.ex.69gea64eb0rv4c' },
          ),
          ex.translationChoice(
            'fazenda',
            'campo / granja',
            ['hacienda pública', 'fábrica', 'tienda'],
            ['pt-fazenda'],
            { id: 'pt.ex.249psqbyd5gbnj' },
          ),
          ex.matchPairs(
            [
              ['brincava', 'jugaba'],
              ['tinha', 'tenía'],
              ['morava', 'vivía'],
              ['ia', 'iba'],
            ],
            ['pt-brincava', 'pt-tinha', 'pt-morava', 'pt-ia'],
            { id: 'pt.ex.ujn3s1rtjb0l0d' },
          ),
          ex.listenChoice(
            'Eu tive uma infância feliz.',
            [
              'Eu tive uma infância difícil.',
              'Ela teve uma infância feliz.',
              'Eu tenho uma família feliz.',
            ],
            ['pt-infancia'],
            { id: 'pt.ex.92cufesp1g031t' },
          ),
          ex.fillBlank(
            'O meu ___ favorito era uma bola.',
            'Mi juguete favorito era una pelota.',
            'brinquedo',
            ['bairro', 'vizinho', 'criança'],
            ['pt-brinquedo'],
            { id: 'pt.ex.qxevwb78srk5ir', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.9j5foovxii8tgb',
            VOVO,
            '¿Cómo describe el abuelo su vida de niño?',
            'Simple, pero feliz',
            ['Difícil y triste', 'Muy moderna', 'Aburrida'],
            ['pt-era'],
            'El abuelo dice: «Era uma vida simples, mas feliz».',
          ),
          ex.orderWords(
            'O meu avô morava numa fazenda.',
            'Mi abuelo vivía en el campo.',
            ['pt-fazenda', 'pt-morava'],
            {
              id: 'pt.ex.bm2iwnjbuzz3x7',
            },
          ),
          ex.shortAnswer(
            'Qual era o seu brinquedo favorito? (uma bola)',
            '¿Cuál era tu juguete favorito? (Responde que era una pelota.)',
            'Era uma bola.',
            [
              'O meu brinquedo favorito era uma bola.',
              'Meu brinquedo favorito era uma bola.',
              'Uma bola.',
            ],
            ['pt-brinquedo', 'pt-era'],
            { id: 'pt.ex.556f5a10kek4ms' },
          ),
          ex.translateWrite(
            'Tuve una infancia feliz en el campo.',
            'Eu tive uma infância feliz na fazenda.',
            ['pt-fazenda'],
            {
              id: 'pt.ex.2vrenudho0pgku',
              acceptedAnswers: ['Tive uma infância feliz na fazenda.'],
            },
          ),
        ],
      },
    ],
  },
};
