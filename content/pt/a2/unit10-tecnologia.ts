import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U10 «Tecnología y comunicación» (docs/PT_A1_A2.md): los pronombres de objeto como se usan en
 * Brasil (te ligo, me manda, vou te mandar; en lo formal eu o conheço, en el habla eu vi ele), el
 * celular, las apps, las contraseñas y los mensajes. Falsos amigos: ligar es «llamar», apagar es
 * «borrar», desligar es «apagar» y tela es la «pantalla».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SENHA = dialogue(
  'pt.stim.a2-u10-senha',
  'Una abuela le pide ayuda a su nieto con el celular.',
  [
    ['Vó Lúcia', 'Bruno, o aplicativo do banco não abre!'],
    ['Bruno', 'Calma, vó. A senhora digitou a senha certa?'],
    ['Vó Lúcia', 'Acho que sim. E a tela ficou preta.'],
    ['Bruno', 'É a bateria. Cadê o carregador? Eu te ajudo.'],
  ],
);

const ZAP = reading(
  'pt.stim.a2-u10-zap',
  'message',
  'Mensajes entre dos amigos.',
  [
    'Gui: Oi! Você viu a minha mensagem de ontem?',
    'Nanda: Vi não, desculpa! O meu celular estava desligado.',
    'Gui: Tranquilo. Vou te mandar um áudio agora explicando tudo.',
    'Nanda: Melhor me ligar, estou no ônibus e não posso ouvir áudio. Te ligo em dez minutos!',
  ],
  { title: 'Gui e Nanda' },
);

const APP = reading(
  'pt.stim.a2-u10-app',
  'notice',
  'Las instrucciones para usar la app de una biblioteca.',
  [
    'Baixe o aplicativo da Biblioteca Municipal.',
    'Crie uma conta com o seu e-mail e escolha uma senha.',
    'Não compartilhe a sua senha com ninguém.',
    'Para apagar a sua conta, fale com a biblioteca.',
  ],
  { title: 'Aplicativo da biblioteca' },
);

const RECADO = dialogue('pt.stim.a2-u10-recado', 'Un mensaje de voz de un compañero de trabajo.', [
  [
    'Otávio',
    'Oi, Sara! Eu mandei o arquivo por e-mail, mas acho que não chegou. Me manda uma mensagem quando puder, tá? E não esquece de desligar o computador da sala de reunião.',
  ],
]);

export const PT_A2_U10: PtUnitDef = {
  names: ['Vó Lúcia', 'Bruno', 'Gui', 'Nanda', 'Biblioteca Municipal', 'Otávio', 'Sara'],
  support: [
    'antes',
    'chamar',
    'agora',
    'explicando',
    'ouvir',
    'endereço',
    'esqueci',
    'esqueceu',
    'mudei',
    'crie',
    'mail',
    'escolha',
    'compartilhe',
    'entra',
    'ligue',
    'desliguei',
    'banco',
    'abre',
    'calma',
    'digitou',
    'cadê',
    'ajudo',
    'arquivo',
    'puder',
    'esquece',
    'conhece',
    'lhe',
    'apague',
    'quebrou',
    'esse',
    'essa',
  ],
  unit: {
    position: 10,
    title: 'Tecnología y comunicación',
    titleEn: 'Tecnologia',
    description:
      'Los pronombres de objeto como en Brasil (te ligo, me manda), el celular, las apps, las contraseñas y los falsos amigos ligar, apagar, desligar y tela.',
    emoji: '📱',
    objective:
      'Puedes llamar y mandar mensajes, resolver problemas simples con el celular o la computadora y usar los pronombres te, me, o / a.',
    grammar: {
      title: 'Pronombres de objeto en Brasil',
      explanation:
        'En Brasil me, te y nos van antes del verbo: te ligo, me manda, vou te mandar. Para «lo / la» lo formal es o / a (eu o conheço) y en el habla se dice ele / ela después del verbo (eu vi ele ontem). Ligar para alguien es «llamarlo».',
      examples: [
        { target: 'Te ligo em dez minutos.', base: 'Te llamo en diez minutos.' },
        { target: 'Me manda uma mensagem?', base: '¿Me mandas un mensaje?' },
        { target: 'Eu vi ele ontem.', base: 'Lo vi ayer.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U10). Sin revisión nativa: revisar la colocación de los pronombres y el registro (vi ele, cadê, zap).',
    },
    words: [
      w(
        'pt-mensagem',
        'mensagem',
        'mensaje',
        'Você viu a minha mensagem?',
        '¿Viste mi mensaje?',
        ['technology'],
        { emoji: '💬' },
      ),
      w(
        'pt-ligar',
        'ligar',
        'llamar (por teléfono)',
        'Vou ligar para a minha mãe.',
        'Voy a llamar a mi mamá.',
        ['technology'],
        {
          acceptedTranslations: ['llamar'],
          emoji: '📞',
        },
      ),
      w('pt-te-ligo', 'te ligo', 'te llamo', 'Te ligo à noite.', 'Te llamo por la noche.', [
        'technology',
        'pronouns',
      ]),
      w(
        'pt-me-manda',
        'me manda',
        'mándame / me mandas',
        'Me manda o endereço?',
        '¿Me mandas la dirección?',
        ['technology', 'pronouns'],
        {
          acceptedTranslations: [
            'mandame',
            'me mandás',
            'mandame / me mandás',
            'mándame',
            'me mandas',
          ],
        },
      ),
      w(
        'pt-te-mando',
        'te mando',
        'te mando',
        'Te mando as fotos amanhã.',
        'Te mando las fotos mañana.',
        ['technology', 'pronouns'],
      ),
      w(
        'pt-senha',
        'senha',
        'contraseña',
        'Esqueci a minha senha.',
        'Me olvidé la contraseña.',
        ['technology'],
        { emoji: '🔒' },
      ),
      w(
        'pt-baixar',
        'baixar',
        'descargar / bajar',
        'Baixe o aplicativo.',
        'Descarga la aplicación.',
        ['technology'],
        {
          acceptedTexts: ['baixe', 'baixei'],
          acceptedTranslations: ['descargar', 'bajar'],
        },
      ),
      w(
        'pt-aplicativo',
        'aplicativo',
        'aplicación / app',
        'Esse aplicativo é muito bom.',
        'Esa aplicación es muy buena.',
        ['technology'],
        {
          acceptedTranslations: ['aplicación', 'app'],
        },
      ),
      w(
        'pt-carregador',
        'carregador',
        'cargador',
        'Você tem um carregador?',
        '¿Tienes un cargador?',
        ['technology'],
        { emoji: '🔌' },
      ),
      w(
        'pt-computador',
        'computador',
        'computadora',
        'O computador está desligado.',
        'La computadora está apagada.',
        ['technology'],
        {
          acceptedTranslations: ['ordenador', 'compu'],
          emoji: '💻',
        },
      ),
      w(
        'pt-tela',
        'tela',
        'pantalla',
        'A tela do celular quebrou.',
        'Se rompió la pantalla del celular.',
        ['technology'],
      ),
      w(
        'pt-apagar',
        'apagar',
        'borrar',
        'Não apague essa foto!',
        '¡No borres esa foto!',
        ['technology'],
        {
          acceptedTexts: ['apaguei'],
        },
      ),
      w(
        'pt-desligar',
        'desligar',
        'apagar / cortar',
        'Desligue o computador, por favor.',
        'Apaga la computadora, por favor.',
        ['technology'],
        {
          acceptedTexts: ['desligado', 'desligue'],
          acceptedTranslations: ['apagar', 'cortar'],
        },
      ),
      w(
        'pt-zap',
        'zap',
        'WhatsApp (coloquial)',
        'Me manda no zap!',
        '¡Mandámelo por WhatsApp!',
        ['technology'],
        {
          acceptedTexts: ['zap zap'],
          acceptedTranslations: ['whatsapp', 'wasap'],
        },
      ),
      w(
        'pt-audio',
        'áudio',
        'audio (mensaje de voz)',
        'Vou te mandar um áudio.',
        'Te voy a mandar un audio.',
        ['technology'],
        {
          acceptedTranslations: ['mensaje de voz'],
        },
      ),
      w('pt-te', 'te', 'te / a ti', 'Eu te ajudo.', 'Yo te ayudo.', ['pronouns'], {
        acceptedTranslations: ['te / a vos'],
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Te ligo depois',
        objective: 'Llamar por teléfono y evitar el falso amigo ligar.',
        intro: {
          explanation:
            'Falso amigo: ligar es «llamar por teléfono»: vou ligar para a minha mãe. Te va antes del verbo: te ligo depois («te llamo después»). Ligar también es «prender» un aparato, y desligar, «apagarlo».',
          examples: [
            { target: 'Te ligo depois do trabalho.', base: 'Te llamo después del trabajo.' },
            { target: 'Vou ligar para o meu pai.', base: 'Voy a llamar a mi papá.' },
          ],
        },
        takeaways: ['Llamas a alguien: ligar para…', 'Pones te antes del verbo: te ligo.'],
        exercises: [
          ex.translationChoice(
            'ligar',
            'llamar (por teléfono)',
            ['ligar (con alguien)', 'atar', 'leer'],
            ['pt-ligar'],
            {
              id: 'pt.ex.y6mamj5n2v6lml',
              explanation: 'Falso amigo: ligar es «llamar por teléfono».',
            },
          ),
          ex.translationChoice(
            'te ligo',
            'te llamo',
            ['te ato', 'te leo', 'te veo'],
            ['pt-te-ligo'],
            { id: 'pt.ex.2wg2x1o5tuaam1' },
          ),
          ex.listenChoice(
            'Te ligo depois do trabalho.',
            [
              'Te ligo antes do trabalho.',
              'Me liga depois do trabalho.',
              'Te vejo depois do trabalho.',
            ],
            ['pt-te-ligo'],
            { id: 'pt.ex.fb3bq29emap2rl' },
          ),
          ex.fillBlank(
            'Vou ___ para a minha mãe hoje.',
            'Voy a llamar a mi mamá hoy.',
            'ligar',
            ['falar', 'chamar', 'mandar'],
            ['pt-ligar'],
            { id: 'pt.ex.dzubdhh4ev078k', explanation: 'Llamar por teléfono: ligar para.' },
          ),
          ex.fillBlank(
            'Eu ___ ligo amanhã, tá?',
            'Te llamo mañana, ¿sí?',
            'te',
            ['você', 'me', 'ele'],
            ['pt-te', 'pt-te-ligo'],
            {
              id: 'pt.ex.lti3e7qg2l8s8o',
              explanation: 'En Brasil te va antes del verbo: te ligo.',
            },
          ),
          question(
            'pt.ex.vd0dqg7op9aqtj',
            ZAP,
            '¿Por qué Nanda no vio el mensaje?',
            'Porque su celular estaba apagado',
            [
              'Porque estaba en el autobús',
              'Porque no tiene WhatsApp',
              'Porque se olvidó la contraseña',
            ],
            ['pt-mensagem', 'pt-desligar'],
            'Nanda escribe: «O meu celular estava desligado».',
          ),
          question(
            'pt.ex.6spoaa7hcwvksq',
            ZAP,
            '¿Qué propone Nanda al final?',
            'Llamarlo en diez minutos',
            ['Escuchar el audio después', 'Verse en el autobús', 'Mandarle un audio'],
            ['pt-te-ligo', 'pt-audio'],
            'Escribe: «Melhor me ligar… Te ligo em dez minutos!».',
          ),
          ex.orderWords(
            'Te ligo depois do trabalho.',
            'Te llamo después del trabajo.',
            ['pt-te-ligo'],
            { id: 'pt.ex.rb0i2f7dofz5zq' },
          ),
          ex.shortAnswer(
            'Você pode falar agora?',
            '¿Puedes hablar ahora? (Responde que no, que lo llamas más tarde.)',
            'Agora não, te ligo depois.',
            [
              'Não, te ligo depois.',
              'Agora não posso, te ligo depois.',
              'Não posso, te ligo mais tarde.',
              'Não, te ligo mais tarde.',
            ],
            ['pt-te-ligo'],
            { id: 'pt.ex.pah9i61vbhd9x8' },
          ),
          ex.translateWrite('Voy a llamar a mi papá.', 'Vou ligar para o meu pai.', ['pt-ligar'], {
            id: 'pt.ex.xju92vqgvck3t8',
            acceptedAnswers: [
              'Eu vou ligar para o meu pai.',
              'Vou ligar pro meu pai.',
              'Vou ligar para meu pai.',
            ],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Me manda uma mensagem',
        objective: 'Pedir y mandar mensajes con me y te.',
        intro: {
          explanation:
            'Me y te van antes del verbo: me manda (mándame), te mando (te mando), vou te mandar. En Brasil todo el mundo usa WhatsApp: se le dice zap, y se mandan muchos áudios (mensajes de voz).',
          examples: [
            {
              target: 'Me manda o endereço no zap?',
              base: '¿Me mandas la dirección por WhatsApp?',
            },
            { target: 'Vou te mandar um áudio.', base: 'Te voy a mandar un audio.' },
          ],
        },
        takeaways: [
          'Pides que te manden algo: me manda…',
          'Ofreces mandar algo: te mando, vou te mandar.',
        ],
        exercises: [
          ex.translationChoice(
            'me manda',
            'mándame / me mandas',
            ['me manda (a mí)', 'te mando', 'mandé'],
            ['pt-me-manda'],
            { id: 'pt.ex.dnes6sk51wrcs9' },
          ),
          ex.translationChoice(
            'mensagem',
            'mensaje',
            ['mensajero', 'correo', 'llamada'],
            ['pt-mensagem'],
            { id: 'pt.ex.xve193510berad' },
          ),
          ex.listenChoice(
            'Vou te mandar um áudio.',
            ['Vou te mandar uma mensagem.', 'Me manda um áudio.', 'Vou mandar um áudio.'],
            ['pt-audio', 'pt-te'],
            { id: 'pt.ex.hf2hean6vwl6ss' },
          ),
          ex.fillBlank(
            '___ manda o endereço, por favor?',
            '¿Me mandas la dirección, por favor?',
            'Me',
            ['Eu', 'Mim', 'Te'],
            ['pt-me-manda'],
            { id: 'pt.ex.r15a6tdo9w127y' },
          ),
          ex.fillBlank(
            'Eu te ___ as fotos amanhã.',
            'Te mando las fotos mañana.',
            'mando',
            ['manda', 'mandei', 'mandar'],
            ['pt-te-mando'],
            { id: 'pt.ex.sqexm6dusn5tlp' },
          ),
          ex.fillBlank(
            'Me manda no ___!',
            '¡Mandámelo por WhatsApp!',
            'zap',
            ['mensagem', 'áudio', 'ônibus'],
            ['pt-zap'],
            { id: 'pt.ex.tuhbd43sl6cfsh', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.e1heemvicjc3an',
            ZAP,
            '¿Qué quiere mandar Gui?',
            'Un audio que explica todo',
            ['Un mensaje escrito', 'Unas fotos', 'Un correo'],
            ['pt-audio', 'pt-te'],
            'Gui escribe: «Vou te mandar um áudio agora explicando tudo».',
          ),
          ex.orderWords(
            'Me manda uma mensagem quando chegar.',
            'Mándame un mensaje cuando llegues.',
            ['pt-me-manda', 'pt-mensagem'],
            {
              id: 'pt.ex.8ktg3o8qbd9v9u',
            },
          ),
          ex.shortAnswer(
            'Qual é o endereço da festa?',
            '¿Cuál es la dirección de la fiesta? (Responde que se la mandas por WhatsApp.)',
            'Te mando no zap.',
            [
              'Eu te mando no zap.',
              'Vou te mandar no zap.',
              'Te mando pelo zap.',
              'Te mando no zap!',
            ],
            ['pt-te-mando', 'pt-zap'],
            { id: 'pt.ex.61mvcmma3wnqy8' },
          ),
          ex.translateWrite(
            '¿Me mandas un mensaje?',
            'Me manda uma mensagem?',
            ['pt-me-manda', 'pt-mensagem'],
            {
              id: 'pt.ex.59tttdvg1sb9s2',
              acceptedAnswers: ['Você me manda uma mensagem?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Senha e aplicativo',
        objective: 'Usar apps y contraseñas.',
        intro: {
          explanation:
            'Senha es la «contraseña»; aplicativo (o app), la aplicación. Baixar es «descargar»: baixe o aplicativo. Falso amigo: apagar es «borrar» (apague a foto).',
          examples: [
            { target: 'Esqueci a minha senha.', base: 'Me olvidé la contraseña.' },
            {
              target: 'Baixe o aplicativo e crie uma conta.',
              base: 'Descarga la aplicación y crea una cuenta.',
            },
          ],
        },
        takeaways: ['Hablas de apps y contraseñas.', 'Sabes que apagar es «borrar».'],
        exercises: [
          ex.translationChoice('senha', 'contraseña', ['seña', 'señal', 'firma'], ['pt-senha'], {
            id: 'pt.ex.mu7ikiucpm4uyl',
          }),
          ex.translationChoice(
            'apagar',
            'borrar',
            ['apagar (la luz)', 'pagar', 'prender'],
            ['pt-apagar'],
            {
              id: 'pt.ex.6x7t7p61cujyxe',
              explanation: 'Falso amigo: apagar es «borrar».',
            },
          ),
          ex.translationChoice(
            'baixar',
            'descargar / bajar',
            ['subir', 'buscar', 'abrir'],
            ['pt-baixar'],
            { id: 'pt.ex.5j8wy8zupxworj' },
          ),
          ex.imageChoice('🔒', 'senha', ['aplicativo', 'mensagem', 'áudio'], ['pt-senha'], {
            id: 'pt.ex.769x7sd2ad6i2y',
          }),
          ex.listenChoice(
            'Esqueci a minha senha.',
            ['Esqueci o meu celular.', 'Ela esqueceu a senha.', 'Mudei a minha senha.'],
            ['pt-senha'],
            { id: 'pt.ex.ia6zcvtiexpo5b' },
          ),
          question(
            'pt.ex.k359bgkgrk31h0',
            APP,
            '¿Qué hay que hacer primero?',
            'Descargar la aplicación de la biblioteca',
            ['Ir a la biblioteca', 'Mandar un correo', 'Borrar la cuenta'],
            ['pt-baixar', 'pt-aplicativo'],
            'Las instrucciones empiezan: «Baixe o aplicativo da Biblioteca Municipal».',
          ),
          question(
            'pt.ex.l2jrorkwk12kks',
            APP,
            '¿Qué no hay que hacer con la contraseña?',
            'Compartirla con otras personas',
            ['Cambiarla', 'Escribirla en la app', 'Usar números'],
            ['pt-senha'],
            'Dice: «Não compartilhe a sua senha com ninguém».',
          ),
          question(
            'pt.ex.8p9soa7e361o60',
            APP,
            '¿Qué hay que hacer para borrar la cuenta?',
            'Hablar con la biblioteca',
            ['Desinstalar la app', 'Cambiar la contraseña', 'Mandar un audio'],
            ['pt-apagar'],
            'Dice: «Para apagar a sua conta, fale com a biblioteca».',
          ),
          ex.shortAnswer(
            'Por que você não entra no aplicativo?',
            '¿Por qué no entras en la aplicación? (Responde que te olvidaste la contraseña.)',
            'Esqueci a minha senha.',
            [
              'Eu esqueci a minha senha.',
              'Esqueci a senha.',
              'Porque esqueci a minha senha.',
              'Porque eu esqueci a senha.',
            ],
            ['pt-senha'],
            { id: 'pt.ex.t4c3tlavknzxow' },
          ),
          ex.translateWrite(
            'Descarga la aplicación.',
            'Baixe o aplicativo.',
            ['pt-baixar', 'pt-aplicativo'],
            {
              id: 'pt.ex.xsenn9sa1geovz',
              acceptedAnswers: ['Baixa o aplicativo.', 'Baixe o app.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'A tela ficou preta',
        objective: 'Resolver problemas con el celular y la computadora.',
        intro: {
          explanation:
            'Falsos amigos: tela es la «pantalla» y desligar es «apagar» (desligue o computador). O carregador es el cargador. Cadê…? es una forma muy brasileña de preguntar «¿dónde está…?».',
          examples: [
            {
              target: 'A tela do celular ficou preta.',
              base: 'La pantalla del celular se puso negra.',
            },
            { target: 'Cadê o carregador?', base: '¿Dónde está el cargador?' },
          ],
        },
        takeaways: ['Describes un problema: a tela, a bateria.', 'Sabes que desligar es «apagar».'],
        exercises: [
          ex.translationChoice(
            'tela',
            'pantalla',
            ['tela (de ropa)', 'teclado', 'tele'],
            ['pt-tela'],
            {
              id: 'pt.ex.h588njd9uo2z84',
              explanation: 'Falso amigo: tela es la pantalla.',
            },
          ),
          ex.translationChoice(
            'desligar',
            'apagar / cortar',
            ['desatar', 'borrar', 'prender'],
            ['pt-desligar'],
            { id: 'pt.ex.0dk8dl1z5wvu41' },
          ),
          ex.imageChoice('🔌', 'carregador', ['computador', 'senha', 'tela'], ['pt-carregador'], {
            id: 'pt.ex.yypybcxy41u31h',
          }),
          ex.imageChoice(
            '💻',
            'computador',
            ['carregador', 'aplicativo', 'celular'],
            ['pt-computador'],
            { id: 'pt.ex.j7ucd31ow1uhr3' },
          ),
          ex.listenChoice(
            'Desligue o computador, por favor.',
            [
              'Ligue o computador, por favor.',
              'Desligue o celular, por favor.',
              'Desliguei o computador.',
            ],
            ['pt-desligar', 'pt-computador'],
            { id: 'pt.ex.364chgqcrofnvd' },
          ),
          question(
            'pt.ex.gd2mcq41mludmt',
            SENHA,
            '¿Qué problema tiene la abuela?',
            'La app del banco no abre y la pantalla se puso negra',
            ['Se olvidó la contraseña', 'Se le rompió el cargador', 'No tiene internet'],
            ['pt-aplicativo', 'pt-tela', 'pt-senha'],
            'Dice: «o aplicativo do banco não abre!… E a tela ficou preta».',
          ),
          question(
            'pt.ex.o3kbcbjmg4in21',
            SENHA,
            '¿Qué piensa Bruno que pasa?',
            'Que es la batería: busca el cargador',
            ['Que la contraseña está mal', 'Que el celular está roto', 'Que la app no funciona'],
            ['pt-carregador', 'pt-te'],
            'Bruno dice: «É a bateria. Cadê o carregador? Eu te ajudo».',
          ),
          question(
            'pt.ex.k1r3lownnwptmw',
            RECADO,
            '¿Qué le pide Otávio a Sara al final?',
            'Que no se olvide de apagar la computadora de la sala de reuniones',
            ['Que le mande el archivo', 'Que lo llame', 'Que prenda la computadora'],
            ['pt-desligar', 'pt-computador', 'pt-me-manda'],
            'Dice: «não esquece de desligar o computador da sala de reunião».',
          ),
          ex.shortAnswer(
            'O seu celular está sem bateria?',
            '¿Tu celular se quedó sin batería? (Pregunta dónde está el cargador.)',
            'Cadê o carregador?',
            [
              'Onde está o carregador?',
              'Sim! Cadê o carregador?',
              'Sim, cadê o carregador?',
              'Você tem um carregador?',
            ],
            ['pt-carregador'],
            { id: 'pt.ex.rou8dbpe2aa2xa' },
          ),
          ex.translateWrite(
            'Apaga la computadora, por favor.',
            'Desligue o computador, por favor.',
            ['pt-desligar', 'pt-computador'],
            {
              id: 'pt.ex.ltlixmmvqm097b',
              acceptedAnswers: ['Desliga o computador, por favor.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Eu vi ele ontem',
        objective: 'Usar «lo / la» como en Brasil (formal y coloquial).',
        intro: {
          explanation:
            'Para «lo» y «la» hay dos registros. Formal o escrito: o / a antes del verbo (eu o conheço) o después (conheço-o, más raro en Brasil). En el habla: ele / ela después del verbo: eu vi ele ontem, chama ela!',
          examples: [
            { target: 'Eu o conheço do trabalho.', base: 'Lo conozco del trabajo.' },
            { target: 'Você viu a Nanda? — Vi ela ontem.', base: '¿Viste a Nanda? — La vi ayer.' },
          ],
        },
        takeaways: ['Reconoces o / a en lo formal.', 'Dices «lo vi» como en Brasil: eu vi ele.'],
        exercises: [
          ex.fillBlank(
            'Você viu o Gui? — Vi ___ ontem.',
            '¿Viste a Gui? — Lo vi ayer.',
            'ele',
            ['ela', 'te', 'me'],
            ['pt-te'],
            { id: 'pt.ex.s1jom1xaufnity', explanation: 'En el habla de Brasil: vi ele.' },
          ),
          ex.fillBlank(
            'A senhora conhece a Sara? — Sim, eu ___ conheço.',
            '¿Usted conoce a Sara? — Sí, la conozco.',
            'a',
            ['o', 'lhe', 'me'],
            ['pt-te'],
            { id: 'pt.ex.s1qa1uadgtojky', explanation: 'Formal: a para «la», antes del verbo.' },
          ),
          ex.listenChoice(
            'Eu vi ele ontem.',
            ['Eu vi ela ontem.', 'Ele me viu ontem.', 'Eu te vi ontem.'],
            ['pt-te'],
            { id: 'pt.ex.95r6pibjcslmi5' },
          ),
          ex.matchPairs(
            [
              ['ligar', 'llamar (por teléfono)'],
              ['apagar', 'borrar'],
              ['desligar', 'apagar / cortar'],
              ['tela', 'pantalla'],
            ],
            ['pt-ligar', 'pt-apagar', 'pt-desligar', 'pt-tela'],
            { id: 'pt.ex.ljt7xna7tr0ee7' },
          ),
          question(
            'pt.ex.6cavqlgxmc75k3',
            RECADO,
            '¿Qué problema tiene Otávio?',
            'Mandó un archivo por correo, pero cree que no llegó',
            [
              'No puede abrir un archivo',
              'Se olvidó la contraseña del correo',
              'La computadora no prende',
            ],
            ['pt-me-manda', 'pt-mensagem'],
            'Dice: «Eu mandei o arquivo por e-mail, mas acho que não chegou».',
          ),
          ex.orderWords(
            'Eu te ajudo com o computador.',
            'Te ayudo con la computadora.',
            ['pt-te', 'pt-computador'],
            { id: 'pt.ex.sqs6hzkcq80z1d' },
          ),
          ex.orderWords('Não apague a minha foto.', 'No borres mi foto.', ['pt-apagar'], {
            id: 'pt.ex.svqv68xuitceyk',
          }),
          ex.shortAnswer(
            'Você conhece a Nanda?',
            '¿Conoces a Nanda? (Responde en el habla de Brasil que sí, que la conoces de la facultad.)',
            'Conheço, sim. Conheço ela da faculdade.',
            [
              'Sim, conheço ela da faculdade.',
              'Conheço ela da faculdade.',
              'Sim, eu a conheço da faculdade.',
              'Conheço, sim, da faculdade.',
            ],
            ['pt-te'],
            { id: 'pt.ex.vu9e6esqkctdwb' },
          ),
          ex.translateWrite('Te ayudo.', 'Eu te ajudo.', ['pt-te'], {
            id: 'pt.ex.gijvgnyf5pb5zr',
            acceptedAnswers: ['Te ajudo.'],
          }),
        ],
      },
    ],
  },
};
