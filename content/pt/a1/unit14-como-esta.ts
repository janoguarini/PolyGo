import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, PT_A1_RATE, question, reading, w } from '../helpers';

/**
 * PT-BR A1 U14 «¿Cómo estás? Estados y descripciones» (docs/PT_A1_A2.md): estar para cómo está
 * alguien ahora (estou cansado) y estar com (estou com fome = «tengo hambre»), ser para describir
 * (ele é alto), la concordancia de los adjetivos y pouco / muito. Falso amigo: chato es «aburrido» o
 * «pesado» (no «plano»).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LIGACAO = dialogue(
  'pt.stim.a1-u14-ligacao',
  'Marina llama a su mamá a la noche.',
  [
    ['Mãe', 'Oi, filha! Tudo bem?'],
    ['Marina', 'Tudo bem, mãe. Mas estou muito cansada.'],
    ['Mãe', 'Você trabalha muito! E você está com fome?'],
    ['Marina', 'Não, estou com sede. Vou tomar água e dormir.'],
  ],
  PT_A1_RATE,
);

const COLEGA = reading(
  'pt.stim.a1-u14-colega',
  'message',
  'Tiago le cuenta a una amiga cómo es su nuevo compañero de departamento.',
  [
    'Oi, Laura! O meu colega de apartamento é o Rafael.',
    'Ele é alto, moreno e muito simpático.',
    'Ele é estudante de engenharia e fala pouco, mas é legal.',
    'Hoje ele está triste: o time dele perdeu!',
  ],
  { from: 'Tiago', to: 'Laura' },
);

const ANUNCIO = reading(
  'pt.stim.a1-u14-anuncio',
  'ad',
  'Un aviso en una cartelera de la facultad.',
  [
    'Vendo sofá azul. É velho, mas é bonito e muito grande.',
    'A mesa é nova e pequena.',
    'Preço baixo!',
  ],
  { title: 'Vendo' },
);

export const PT_A1_U14: PtUnitDef = {
  names: ['Marina', 'Laura', 'Rafael', 'Tiago', 'Ana', 'Pedro'],
  support: [
    'tomar',
    'dormir',
    'simpático',
    'colega',
    'apartamento',
    'moreno',
    'engenharia',
    'time',
    'dele',
    'perdeu',
    'vendo',
    'preço',
    'tímido',
  ],
  unit: {
    position: 14,
    title: '¿Cómo estás? Estados y descripciones',
    titleEn: 'Como você está?',
    description:
      'Estar para cómo estás ahora, estar com fome / sede, ser para describir, la concordancia de los adjetivos y el falso amigo chato.',
    emoji: '😊',
    objective:
      'Podés decir cómo estás (estou cansado, estou com fome), describir personas y cosas con ser y elegir entre ser y estar.',
    grammar: {
      title: 'Ser y estar · estar com · concordancia',
      explanation:
        'Ser describe cómo es algo o alguien: ele é alto, a casa é grande. Estar dice cómo está ahora: estou cansado, ela está triste. «Tener hambre / sed» se dice estar com: estou com fome, estou com sede. Los adjetivos concuerdan: cansado, cansada, cansados, cansadas.',
      examples: [
        { target: 'Ele é alto e simpático.', base: 'Él es alto y simpático.' },
        { target: 'Hoje eu estou cansada.', base: 'Hoy estoy cansada.' },
        { target: 'Você está com fome?', base: '¿Tenés hambre?' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A1 nuevo (U14). Sin revisión nativa: revisar estar com, chato y los adjetivos.',
    },
    words: [
      w('pt-estou', 'estou', 'estoy', 'Estou bem, obrigado.', 'Estoy bien, gracias.', ['verbs']),
      w(
        'pt-cansado',
        'cansado',
        'cansado',
        'Estou muito cansado.',
        'Estoy muy cansado.',
        ['feelings'],
        {
          acceptedTexts: ['cansada'],
          acceptedTranslations: ['cansada'],
          emoji: '😩',
        },
      ),
      w('pt-feliz', 'feliz', 'feliz', 'Hoje eu estou feliz.', 'Hoy estoy feliz.', ['feelings'], {
        emoji: '😄',
      }),
      w(
        'pt-triste',
        'triste',
        'triste',
        'Ela está triste hoje.',
        'Ella está triste hoy.',
        ['feelings'],
        {
          emoji: '😢',
        },
      ),
      w(
        'pt-com-fome',
        'com fome',
        'con hambre',
        'Estou com fome.',
        'Tengo hambre.',
        ['feelings', 'food'],
        { acceptedTranslations: ['tener hambre'], emoji: '🍽️' },
      ),
      w(
        'pt-com-sede',
        'com sede',
        'con sed',
        'Você está com sede?',
        '¿Tenés sed?',
        ['feelings', 'food'],
        { acceptedTranslations: ['tener sed'], emoji: '🥤' },
      ),
      w('pt-alto', 'alto', 'alto', 'O meu irmão é alto.', 'Mi hermano es alto.', ['descriptions'], {
        acceptedTexts: ['alta'],
        acceptedTranslations: ['alta'],
      }),
      w(
        'pt-baixo',
        'baixo',
        'bajo',
        'A minha avó é baixa.',
        'Mi abuela es baja.',
        ['descriptions'],
        {
          acceptedTexts: ['baixa'],
          acceptedTranslations: ['baja', 'petiso'],
        },
      ),
      w(
        'pt-bonito',
        'bonito',
        'lindo',
        'A praia é muito bonita.',
        'La playa es muy linda.',
        ['descriptions'],
        {
          acceptedTexts: ['bonita'],
          acceptedTranslations: ['linda', 'bonito', 'bonita'],
        },
      ),
      w('pt-feio', 'feio', 'feo', 'O sofá é feio.', 'El sillón es feo.', ['descriptions'], {
        acceptedTexts: ['feia'],
        acceptedTranslations: ['fea'],
      }),
      w(
        'pt-novo',
        'novo',
        'nuevo / joven',
        'O meu celular é novo.',
        'Mi celular es nuevo.',
        ['descriptions'],
        {
          acceptedTexts: ['nova'],
          acceptedTranslations: ['nuevo', 'nueva', 'joven'],
        },
      ),
      w(
        'pt-velho',
        'velho',
        'viejo',
        'O livro é muito velho.',
        'El libro es muy viejo.',
        ['descriptions'],
        {
          acceptedTexts: ['velha'],
          acceptedTranslations: ['vieja'],
        },
      ),
      w(
        'pt-pequeno',
        'pequeno',
        'chico / pequeño',
        'O quarto é pequeno.',
        'El dormitorio es chico.',
        ['descriptions'],
        {
          acceptedTexts: ['pequena'],
          acceptedTranslations: ['chico', 'pequeño', 'chica', 'pequeña'],
        },
      ),
      w('pt-grande', 'grande', 'grande', 'A cidade é grande.', 'La ciudad es grande.', [
        'descriptions',
      ]),
      w(
        'pt-chato',
        'chato',
        'aburrido / pesado',
        'O filme é muito chato.',
        'La película es muy aburrida.',
        ['descriptions'],
        {
          acceptedTexts: ['chata'],
          acceptedTranslations: ['aburrido', 'pesado', 'aburrida', 'pesada'],
        },
      ),
      w('pt-mas', 'mas', 'pero', 'Ele é alto, mas é tímido.', 'Es alto, pero es tímido.', [
        'connectors',
      ]),
      w('pt-pouco', 'pouco', 'poco', 'Ele fala pouco.', 'Él habla poco.', ['quantity'], {
        acceptedTexts: ['pouca'],
        acceptedTranslations: ['poca'],
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Estou cansado',
        objective: 'Decir cómo estás ahora con estar.',
        intro: {
          explanation:
            'Estar dice cómo está alguien ahora: eu estou, você / ele / ela está. El adjetivo cambia con la persona: ele está cansado, ela está cansada.',
          examples: [
            { target: 'Hoje eu estou cansado.', base: 'Hoy estoy cansado.' },
            { target: 'Ela está muito feliz.', base: 'Ella está muy feliz.' },
          ],
        },
        takeaways: [
          'Decís cómo estás con estou.',
          'Hacés concordar el adjetivo: cansado, cansada.',
        ],
        exercises: [
          ex.translationChoice('estou', 'estoy', ['soy', 'tengo', 'voy'], ['pt-estou'], {
            id: 'pt.ex.93nsfb3hx2orbs',
          }),
          ex.imageChoice('😩', 'cansado', ['feliz', 'triste', 'legal'], ['pt-cansado'], {
            id: 'pt.ex.yllbt2x6crubb8',
          }),
          ex.imageChoice('😢', 'triste', ['feliz', 'cansado', 'legal'], ['pt-triste'], {
            id: 'pt.ex.2yenpkp8sn147c',
          }),
          ex.listenChoice(
            'Estou muito cansada.',
            ['Estou muito cansado.', 'Estou muito feliz.', 'Ela está muito cansada.'],
            ['pt-estou', 'pt-cansado', 'pt-muito'],
            { id: 'pt.ex.o9rlzw9cam9m9o' },
          ),
          ex.fillBlank(
            'Eu ___ feliz hoje.',
            'Hoy estoy feliz.',
            'estou',
            ['sou', 'está', 'tenho'],
            ['pt-estou', 'pt-feliz', 'pt-hoje'],
            { id: 'pt.ex.3hl6xfvs4xg99d', explanation: 'Cómo estás ahora: estar → eu estou.' },
          ),
          ex.fillBlank(
            'A Ana está muito ___.',
            'Ana está muy cansada.',
            'cansada',
            ['cansado', 'cansados', 'cansadas'],
            ['pt-cansado'],
            { id: 'pt.ex.u5pyxrdcljrbei', explanation: 'Ana es mujer: cansada.' },
          ),
          ex.orderWords(
            'Você está cansado hoje?',
            '¿Estás cansado hoy?',
            ['pt-cansado', 'pt-esta'],
            {
              id: 'pt.ex.ranvmfj0h8g3f8',
            },
          ),
          ex.shortAnswer(
            'Tudo bem? Você está cansado?',
            '¿Todo bien? ¿Estás cansado? (Respondé que no, que estás feliz.)',
            'Não, estou feliz.',
            ['Não, eu estou feliz.', 'Estou feliz.', 'Não. Estou feliz.'],
            ['pt-estou', 'pt-feliz'],
            { id: 'pt.ex.couodm32ar1uea' },
          ),
          ex.translateWrite('Estoy muy cansada.', 'Estou muito cansada.', ['pt-estou'], {
            id: 'pt.ex.0ykr3r4hq9c8h9',
            acceptedAnswers: ['Eu estou muito cansada.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Estou com fome',
        objective: 'Decir que tenés hambre o sed.',
        intro: {
          explanation:
            '«Tengo hambre» no se dice con ter: se dice estou com fome («estoy con hambre»). Igual con la sed: estou com sede.',
          examples: [
            { target: 'Estou com fome. Quero comer.', base: 'Tengo hambre. Quiero comer.' },
            { target: 'Você está com sede?', base: '¿Tenés sed?' },
          ],
        },
        takeaways: [
          'Decís que tenés hambre: estou com fome.',
          'Decís que tenés sed: estou com sede.',
        ],
        exercises: [
          ex.translationChoice(
            'com fome',
            'con hambre',
            ['con sed', 'con frío', 'cansado'],
            ['pt-com-fome'],
            {
              id: 'pt.ex.c0sfymf645g1m9',
            },
          ),
          ex.imageChoice('🥤', 'com sede', ['com fome', 'cansado', 'feliz'], ['pt-com-sede'], {
            id: 'pt.ex.r63bts5l3bngrw',
          }),
          ex.listenChoice(
            'Estou com fome.',
            ['Estou com sede.', 'Está com fome.', 'Estou com o Pedro.'],
            ['pt-estou', 'pt-com-fome'],
            { id: 'pt.ex.efhhchz3w5egyd' },
          ),
          ex.fillBlank(
            'Eu estou ___ sede.',
            'Tengo sed.',
            'com',
            ['tenho', 'sem', 'de'],
            ['pt-com-sede', 'pt-estou'],
            { id: 'pt.ex.d1hzo0rtnmokia', explanation: '«Tener sed» se dice estar com sede.' },
          ),
          ex.fillBlank(
            'Você ___ com fome?',
            '¿Tenés hambre?',
            'está',
            ['tem', 'é', 'estou'],
            ['pt-com-fome', 'pt-esta'],
            { id: 'pt.ex.z7gdi68jregs7b', explanation: 'Con você: está com fome.' },
          ),
          question(
            'pt.ex.msl5zv3oxuypaj',
            LIGACAO,
            '¿Cómo está Marina?',
            'Muy cansada',
            ['Muy feliz', 'Triste', 'Con hambre'],
            ['pt-cansado', 'pt-estou', 'pt-mas'],
            'Marina dice: «estou muito cansada».',
          ),
          question(
            'pt.ex.bye9egp0wvku3q',
            LIGACAO,
            '¿Qué va a hacer Marina?',
            'Tomar agua y dormir',
            ['Comer algo', 'Trabajar un poco más', 'Llamar a una amiga'],
            ['pt-com-sede'],
            'Dice: «estou com sede. Vou tomar água e dormir».',
          ),
          ex.orderWords(
            'Eu estou com muita fome.',
            'Tengo mucha hambre.',
            ['pt-com-fome', 'pt-estou'],
            {
              id: 'pt.ex.yixmrapfqocpzl',
            },
          ),
          ex.shortAnswer(
            'Você está com fome?',
            '¿Tenés hambre? (Respondé que no, que tenés sed.)',
            'Não, estou com sede.',
            ['Não, eu estou com sede.', 'Estou com sede.', 'Não. Estou com sede.'],
            ['pt-com-sede', 'pt-estou'],
            { id: 'pt.ex.9vd5wo0v447vu8' },
          ),
          ex.translateWrite('Tengo hambre.', 'Estou com fome.', ['pt-com-fome', 'pt-estou'], {
            id: 'pt.ex.37qhb0nvw493if',
            acceptedAnswers: ['Eu estou com fome.', 'Tô com fome.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Alto, baixo, simpático',
        objective: 'Describir personas con ser.',
        intro: {
          explanation:
            'Para describir cómo es una persona se usa ser: ele é alto, ela é baixa. Los adjetivos en -o hacen el femenino en -a y el plural con -s: alto, alta, altos, altas.',
          examples: [
            { target: 'O meu irmão é alto.', base: 'Mi hermano es alto.' },
            { target: 'As minhas irmãs são baixas.', base: 'Mis hermanas son bajas.' },
          ],
        },
        takeaways: [
          'Describís personas con ser.',
          'Hacés concordar el adjetivo en género y número.',
        ],
        exercises: [
          ex.translationChoice('baixo', 'bajo', ['alto', 'feo', 'grande'], ['pt-baixo'], {
            id: 'pt.ex.dipigy1pcv7fvc',
          }),
          ex.matchPairs(
            [
              ['legal', 'genial'],
              ['baixo', 'bajo'],
              ['bonito', 'lindo'],
              ['feio', 'feo'],
            ],
            ['pt-baixo', 'pt-bonito', 'pt-feio', 'pt-legal'],
            { id: 'pt.ex.vlz2dly73u4nib' },
          ),
          ex.listenChoice(
            'A minha mãe é baixa.',
            ['A minha mãe é alta.', 'A minha irmã é baixa.', 'O meu pai é baixo.'],
            ['pt-baixo', 'pt-minha', 'pt-mae'],
            { id: 'pt.ex.yxee34tq3kq267' },
          ),
          ex.fillBlank(
            'Os meus irmãos são ___.',
            'Mis hermanos son altos.',
            'altos',
            ['alto', 'alta', 'altas'],
            ['pt-alto', 'pt-irmao'],
            { id: 'pt.ex.m9i7qympt8i3rf', explanation: 'Os irmãos es masculino plural: altos.' },
          ),
          ex.fillBlank(
            'A Ana é ___ e simpática.',
            'Ana es linda y simpática.',
            'bonita',
            ['bonito', 'bonitos', 'feio'],
            ['pt-bonito'],
            { id: 'pt.ex.dmb9iydm6kx74r' },
          ),
          ex.fillBlank(
            'O Pedro ___ alto.',
            'Pedro es alto.',
            'é',
            ['está', 'estou', 'tem'],
            ['pt-alto', 'pt-e-ser'],
            { id: 'pt.ex.wi9qhyw0s7h9cp', explanation: 'Cómo es una persona: ser → é.' },
          ),
          question(
            'pt.ex.3b56qv1mny9lva',
            COLEGA,
            '¿Cómo es Rafael?',
            'Alto, morocho y muy simpático',
            ['Bajo y muy simpático', 'Alto y aburrido', 'Bajo, rubio y serio'],
            ['pt-alto', 'pt-pouco'],
            'Tiago escribe: «Ele é alto, moreno e muito simpático».',
          ),
          ex.orderWords(
            'A minha avó é baixa e bonita.',
            'Mi abuela es baja y linda.',
            ['pt-baixo', 'pt-bonito'],
            {
              id: 'pt.ex.5pl62j5uwuncoq',
            },
          ),
          ex.shortAnswer(
            'Como é o seu pai? (alto)',
            '¿Cómo es tu papá? (Respondé que es alto.)',
            'Ele é alto.',
            ['O meu pai é alto.', 'Meu pai é alto.', 'É alto.'],
            ['pt-alto'],
            { id: 'pt.ex.2vljpofq10jp0u' },
          ),
          ex.translateWrite(
            'Mi hermana es baja.',
            'A minha irmã é baixa.',
            ['pt-baixo', 'pt-irma'],
            {
              id: 'pt.ex.hibsjj98kyq90e',
              acceptedAnswers: ['Minha irmã é baixa.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Novo, velho, chato',
        objective: 'Describir cosas y evitar el falso amigo chato.',
        intro: {
          explanation:
            'Novo es «nuevo» (y también «joven») y velho, «viejo». Pequeno es «chico». Ojo: chato no es «plano», es «aburrido» o «pesado»: o filme é chato.',
          examples: [
            { target: 'O meu celular é novo.', base: 'Mi celular es nuevo.' },
            { target: 'Que filme chato!', base: '¡Qué película aburrida!' },
          ],
        },
        takeaways: [
          'Describís cosas: novo, velho, pequeno, grande.',
          'Sabés que chato es «aburrido».',
        ],
        exercises: [
          ex.translationChoice(
            'chato',
            'aburrido / pesado',
            ['plano', 'chico', 'lindo'],
            ['pt-chato'],
            {
              id: 'pt.ex.nha9f9ws5um45i',
              explanation: 'Falso amigo: chato es «aburrido» o «pesado».',
            },
          ),
          ex.translationChoice(
            'velho',
            'viejo',
            ['nuevo / joven', 'feo', 'chico / pequeño'],
            ['pt-velho'],
            {
              id: 'pt.ex.3ryf0qpvdzt432',
            },
          ),
          ex.translationChoice(
            'pequeno',
            'chico / pequeño',
            ['grande', 'viejo', 'bajo'],
            ['pt-pequeno'],
            {
              id: 'pt.ex.k280zt7nqig71r',
            },
          ),
          ex.listenChoice(
            'O filme é muito chato.',
            ['O filme é muito bom.', 'O livro é muito chato.', 'O filme é muito velho.'],
            ['pt-chato', 'pt-filme'],
            { id: 'pt.ex.giwryoohbv08ct' },
          ),
          ex.fillBlank(
            'A mesa é ___: é de hoje!',
            'La mesa es nueva: ¡es de hoy!',
            'nova',
            ['novo', 'velha', 'velho'],
            ['pt-novo', 'pt-mesa'],
            { id: 'pt.ex.zridws73wb70n0', explanation: 'Mesa es femenino: nova.' },
          ),
          ex.fillBlank(
            'O quarto é muito ___, mas a sala é grande.',
            'El dormitorio es muy chico, pero el living es grande.',
            'pequeno',
            ['pequena', 'grande', 'alto'],
            ['pt-pequeno', 'pt-grande', 'pt-quarto'],
            { id: 'pt.ex.o0thos7y5dabfj', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.1w0b9ohxdhfcy7',
            ANUNCIO,
            '¿Cómo es el sillón que venden?',
            'Viejo, pero lindo y muy grande',
            ['Nuevo y chico', 'Viejo y feo', 'Nuevo y muy caro'],
            ['pt-velho', 'pt-bonito', 'pt-grande'],
            'El aviso dice: «É velho, mas é bonito e muito grande».',
          ),
          question(
            'pt.ex.smioz506v3zizn',
            ANUNCIO,
            '¿Cómo es la mesa?',
            'Nueva y chica',
            ['Vieja y grande', 'Nueva y grande', 'Azul y vieja'],
            ['pt-novo', 'pt-pequeno'],
            'El aviso dice: «A mesa é nova e pequena».',
          ),
          ex.shortAnswer(
            'O filme é bom?',
            '¿La película es buena? (Respondé que no, que es aburrida.)',
            'Não, é chato.',
            ['Não, o filme é chato.', 'Não, é muito chato.', 'É chato.', 'Não. É chato.'],
            ['pt-chato'],
            { id: 'pt.ex.yjwnr1alfxtkk0' },
          ),
          ex.translateWrite('Mi celular es viejo.', 'O meu celular é velho.', ['pt-velho'], {
            id: 'pt.ex.e7y356vfaep7e4',
            acceptedAnswers: ['Meu celular é velho.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Ser ou estar?',
        objective: 'Elegir entre ser y estar y usar pouco y muito.',
        intro: {
          explanation:
            'Ser: cómo es algo siempre (ele é simpático). Estar: cómo está ahora (hoje ele está triste). Pouco es «poco» y muito, «mucho» o «muy»: ele fala pouco; é muito legal.',
          examples: [
            {
              target: 'Ele é feliz, mas hoje está triste.',
              base: 'Es feliz, pero hoy está triste.',
            },
            { target: 'O Rafael fala pouco.', base: 'Rafael habla poco.' },
          ],
        },
        takeaways: ['Elegís entre ser y estar.', 'Decís poco o mucho con pouco y muito.'],
        exercises: [
          ex.fillBlank(
            'Hoje a Laura ___ triste.',
            'Hoy Laura está triste.',
            'está',
            ['é', 'sou', 'estou'],
            ['pt-triste', 'pt-esta'],
            { id: 'pt.ex.7kiyhz4znb0t6m', explanation: 'Hoy, ahora: estar → está.' },
          ),
          ex.fillBlank(
            'O meu irmão ___ alto.',
            'Mi hermano es alto.',
            'é',
            ['está', 'estou', 'são'],
            ['pt-alto', 'pt-e-ser'],
            { id: 'pt.ex.nty31ol1irpfs0', explanation: 'Cómo es siempre: ser → é.' },
          ),
          ex.fillBlank(
            'Ele fala ___: é muito tímido.',
            'Él habla poco: es muy tímido.',
            'pouco',
            ['muito', 'pouca', 'grande'],
            ['pt-pouco', 'pt-fala'],
            { id: 'pt.ex.zy1846e20uwgqo', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Hoje ele está triste.',
            ['Hoje ele está feliz.', 'Hoje ela está triste.', 'Hoje ele é triste.'],
            ['pt-triste', 'pt-hoje'],
            { id: 'pt.ex.ahwqgpziuw223l' },
          ),
          question(
            'pt.ex.ugbzyjyihfqzdg',
            COLEGA,
            '¿Por qué está triste Rafael hoy?',
            'Porque perdió su equipo',
            ['Porque está cansado', 'Porque tiene hambre', 'Porque habla poco'],
            ['pt-triste'],
            'Tiago escribe: «Hoje ele está triste: o time dele perdeu!».',
          ),
          question(
            'pt.ex.tu3zpkjuztfwix',
            COLEGA,
            '¿Qué dice Tiago de cómo habla Rafael?',
            'Que habla poco, pero es buena onda',
            ['Que habla mucho', 'Que habla poco y es aburrido', 'Que no habla portugués'],
            ['pt-pouco'],
            'El mensaje dice: «fala pouco, mas é legal».',
          ),
          ex.orderWords(
            'A minha casa é pequena mas bonita.',
            'Mi casa es chica pero linda.',
            ['pt-pequeno', 'pt-bonito'],
            {
              id: 'pt.ex.04oqet901c4uxp',
            },
          ),
          ex.shortAnswer(
            'Como você está hoje?',
            '¿Cómo estás hoy? (Respondé que estás un poco cansado.)',
            'Estou um pouco cansado.',
            [
              'Hoje estou um pouco cansado.',
              'Estou um pouco cansada.',
              'Um pouco cansado.',
              'Um pouco cansada.',
            ],
            ['pt-pouco', 'pt-cansado', 'pt-estou'],
            { id: 'pt.ex.803x9nktv2clfx' },
          ),
          ex.translateWrite(
            'Él es alto, pero hoy está cansado.',
            'Ele é alto, mas hoje está cansado.',
            ['pt-mas'],
            {
              id: 'pt.ex.9pcqv9hnanre5a',
            },
          ),
        ],
      },
    ],
  },
};
