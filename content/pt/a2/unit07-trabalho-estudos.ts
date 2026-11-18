import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U7 «Trabajo y estudios» (docs/PT_A1_A2.md): el futuro do presente (será, terá, começará),
 * que en Brasil aparece sobre todo en lo escrito y lo formal (avisos, correos); la facultad, las
 * pasantías y la búsqueda de trabajo. Falsos amigos: vaga es una «vacante» (no «vaga» de perezosa),
 * pretender es «tener pensado» y prova es un «examen».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VAGA = reading(
  'pt.stim.a2-u7-vaga',
  'ad',
  'Un aviso de pasantía en la cartelera de una facultad.',
  [
    'Vaga de estágio em marketing — Empresa Sol Nascente',
    'Para estudantes de administração ou comunicação.',
    'Horário: das 9h às 13h. Salário: 1.500 reais.',
    'Envie o seu currículo até sexta-feira. As entrevistas serão na semana que vem.',
  ],
  { title: 'Vaga de estágio' },
);

const EMAIL = reading(
  'pt.stim.a2-u7-email',
  'email',
  'Un correo de una empresa a una candidata.',
  [
    'Prezada Ana Souza,',
    'Recebemos o seu currículo. A sua entrevista será na segunda-feira, às dez horas, no nosso escritório.',
    'A conversa terá duração de quarenta minutos e a senhora falará com a chefe do setor.',
    'Atenciosamente, Equipe de RH',
  ],
  { from: 'Empresa Sol Nascente', to: 'Ana Souza' },
);

const COLEGAS = dialogue(
  'pt.stim.a2-u7-colegas',
  'Dos compañeros de trabajo hablan en la cocina de la oficina.',
  [
    ['Igor', 'Você vai na reunião das três?'],
    ['Paula', 'Vou. A chefe vai apresentar o projeto novo. E você?'],
    ['Igor', 'Não posso, tenho prova na faculdade. Estou terminando o curso de economia.'],
    ['Paula', 'Que legal! E depois, o que você pretende fazer?'],
    ['Igor', 'Pretendo fazer um mestrado.'],
  ],
);

const ENTREVISTA = dialogue('pt.stim.a2-u7-entrevista', 'Una entrevista de trabajo.', [
  ['Entrevistadora', 'Fale um pouco sobre você.'],
  ['Tiago', 'Eu me formei em engenharia no ano passado e fiz um estágio numa empresa de energia.'],
  ['Entrevistadora', 'Por que você quer trabalhar aqui?'],
  ['Tiago', 'Porque eu gosto de projetos grandes e pretendo crescer na empresa.'],
]);

export const PT_A2_U07: PtUnitDef = {
  names: ['Sol Nascente', 'Ana', 'Souza', 'RH', 'Igor', 'Paula', 'Entrevistadora', 'Tiago'],
  support: [
    'economia',
    'apresentar',
    'projeto',
    'terminando',
    'pretende',
    'mestrado',
    'passou',
    'espero',
    'mandei',
    'mandou',
    'mandar',
    'marketing',
    'administração',
    'comunicação',
    'horário',
    'h',
    'envie',
    'serão',
    'prezada',
    'recebemos',
    'conversa',
    'duração',
    'quarenta',
    'falará',
    'setor',
    'atenciosamente',
    'equipe',
    'formou',
    'formo',
    'pretendi',
    'fale',
    'sobre',
    'energia',
    'crescer',
    'direito',
  ],
  unit: {
    position: 7,
    title: 'Trabajo y estudios',
    titleEn: 'Trabalho e estudos',
    description:
      'El futuro do presente en lo formal (será, terá), la facultad, la pasantía, la entrevista y los falsos amigos vaga, pretender y prova.',
    emoji: '🎓',
    objective:
      'Podés hablar de tu trabajo y tus estudios, entender un aviso de trabajo y un correo formal, y contar qué tenés pensado hacer.',
    grammar: {
      title: 'Futuro do presente (formal)',
      explanation:
        'Infinitivo + -ei, -á, -emos, -ão: trabalharei, trabalhará, trabalharemos, trabalharão. Ser → será; ter → terá. En el habla de Brasil se prefiere vou + verbo; el futuro simple aparece en avisos, correos y noticias: a reunião será às dez.',
      examples: [
        { target: 'A reunião será às dez.', base: 'La reunión será a las diez.' },
        {
          target: 'A entrevista terá duração de uma hora.',
          base: 'La entrevista durará una hora.',
        },
        { target: 'Eu pretendo fazer um estágio.', base: 'Tengo pensado hacer una pasantía.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U7). Sin revisión nativa: revisar el correo formal y el aviso de pasantía.',
    },
    words: [
      w(
        'pt-reuniao',
        'reunião',
        'reunión',
        'A reunião é às três.',
        'La reunión es a las tres.',
        ['work'],
        { emoji: '👥' },
      ),
      w(
        'pt-chefe',
        'chefe',
        'jefe / jefa',
        'A minha chefe é muito simpática.',
        'Mi jefa es muy simpática.',
        ['work'],
        {
          acceptedTranslations: ['jefe', 'jefa'],
        },
      ),
      w(
        'pt-colega',
        'colega',
        'compañero de trabajo',
        'Ele é meu colega de trabalho.',
        'Es mi compañero de trabajo.',
        ['work'],
        {
          acceptedTranslations: ['compañero', 'compañera'],
        },
      ),
      w(
        'pt-estagio',
        'estágio',
        'pasantía',
        'Eu faço estágio numa empresa.',
        'Hago una pasantía en una empresa.',
        ['work', 'studies'],
        {
          acceptedTranslations: ['prácticas'],
        },
      ),
      w(
        'pt-faculdade',
        'faculdade',
        'facultad / universidad',
        'Eu estudo direito na faculdade.',
        'Estudio abogacía en la facultad.',
        ['studies'],
        {
          acceptedTranslations: ['facultad', 'universidad', 'facu'],
          emoji: '🏛️',
        },
      ),
      w(
        'pt-prova',
        'prova',
        'examen / prueba',
        'Amanhã eu tenho prova.',
        'Mañana tengo examen.',
        ['studies'],
        {
          acceptedTranslations: ['examen', 'prueba'],
          emoji: '📝',
        },
      ),
      w(
        'pt-passar-na-prova',
        'passar na prova',
        'aprobar el examen',
        'Eu passei na prova!',
        '¡Aprobé el examen!',
        ['studies'],
        {
          acceptedTexts: ['passei na prova'],
          acceptedTranslations: ['aprobar'],
        },
      ),
      w(
        'pt-entrevista',
        'entrevista',
        'entrevista',
        'A entrevista é na segunda.',
        'La entrevista es el lunes.',
        ['work'],
      ),
      w(
        'pt-curriculo',
        'currículo',
        'currículum / CV',
        'Mandei o meu currículo.',
        'Mandé mi currículum.',
        ['work'],
        {
          acceptedTranslations: ['currículum', 'cv'],
        },
      ),
      w(
        'pt-vaga',
        'vaga',
        'vacante / puesto',
        'Tem uma vaga de estágio.',
        'Hay una vacante de pasantía.',
        ['work'],
        {
          acceptedTranslations: ['vacante', 'puesto'],
        },
      ),
      w(
        'pt-salario',
        'salário',
        'sueldo',
        'O salário é bom.',
        'El sueldo es bueno.',
        ['work', 'money'],
        {
          acceptedTranslations: ['salario'],
        },
      ),
      w('pt-sera', 'será', 'será', 'A reunião será às dez.', 'La reunión será a las diez.', [
        'future',
      ]),
      w(
        'pt-tera',
        'terá',
        'tendrá',
        'A empresa terá um escritório novo.',
        'La empresa tendrá una oficina nueva.',
        ['future'],
      ),
      w(
        'pt-pretendo',
        'pretendo',
        'tengo pensado / tengo la intención de',
        'Pretendo fazer um mestrado.',
        'Tengo pensado hacer una maestría.',
        ['future'],
        {
          acceptedTranslations: ['tengo pensado', 'tengo la intención de', 'planeo'],
        },
      ),
      w(
        'pt-me-formei',
        'me formei',
        'me recibí',
        'Eu me formei em 2020.',
        'Me recibí en 2020.',
        ['studies', 'past'],
        {
          acceptedTranslations: ['me gradué'],
        },
      ),
      w(
        'pt-curso',
        'curso',
        'carrera / curso',
        'O meu curso é de economia.',
        'Mi carrera es economía.',
        ['studies'],
        {
          acceptedTranslations: ['carrera'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Na faculdade',
        objective: 'Hablar de tus estudios.',
        intro: {
          explanation:
            'Faculdade es la facultad o la universidad; o curso es la carrera. Falso amigo suave: prova es un «examen». «Aprobar» se dice passar na prova: eu passei na prova!',
          examples: [
            {
              target: 'Eu estudo economia na faculdade.',
              base: 'Estudio economía en la facultad.',
            },
            {
              target: 'Amanhã eu tenho prova. Espero passar!',
              base: 'Mañana tengo examen. ¡Espero aprobar!',
            },
          ],
        },
        takeaways: ['Hablás de la facultad y tu carrera.', 'Decís que aprobaste: passei na prova.'],
        exercises: [
          ex.translationChoice(
            'prova',
            'examen / prueba',
            ['prueba de ropa', 'tarea', 'clase'],
            ['pt-prova'],
            { id: 'pt.ex.mxa4bfm3qedyvn' },
          ),
          ex.translationChoice(
            'passar na prova',
            'aprobar el examen',
            ['dar el examen', 'pasar por la facultad', 'faltar al examen'],
            ['pt-passar-na-prova'],
            {
              id: 'pt.ex.0bzk9i8ztxao4u',
            },
          ),
          ex.imageChoice('🏛️', 'faculdade', ['prova', 'reunião', 'curso'], ['pt-faculdade'], {
            id: 'pt.ex.u5216u0qgyirw8',
          }),
          ex.listenChoice(
            'Amanhã eu tenho prova.',
            ['Amanhã eu tenho reunião.', 'Hoje eu tenho prova.', 'Amanhã ele tem prova.'],
            ['pt-prova'],
            { id: 'pt.ex.ejlt0vhy0b0o2y' },
          ),
          ex.fillBlank(
            'Eu passei na ___ de matemática!',
            '¡Aprobé el examen de matemática!',
            'prova',
            ['curso', 'faculdade', 'reunião'],
            ['pt-passar-na-prova', 'pt-prova'],
            { id: 'pt.ex.05pw4pdr43r94x', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'O meu ___ é de economia.',
            'Mi carrera es economía.',
            'curso',
            ['prova', 'reunião', 'faculdade'],
            ['pt-curso'],
            { id: 'pt.ex.pd6hftkm3jg26y', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.7vjxgsrgk81nrw',
            COLEGAS,
            '¿Por qué Igor no puede ir a la reunión?',
            'Porque tiene un examen en la facultad',
            [
              'Porque tiene una entrevista',
              'Porque está enfermo',
              'Porque no le gusta el proyecto',
            ],
            ['pt-prova', 'pt-faculdade', 'pt-reuniao', 'pt-chefe', 'pt-pretendo'],
            'Igor dice: «Não posso, tenho prova na faculdade».',
          ),
          ex.orderWords(
            'Eu estudo economia na faculdade.',
            'Estudio economía en la facultad.',
            ['pt-faculdade'],
            { id: 'pt.ex.oy9fykm9jdwghv' },
          ),
          ex.shortAnswer(
            'Você passou na prova?',
            '¿Aprobaste el examen? (Respondé que sí, que aprobaste.)',
            'Sim, eu passei!',
            ['Passei!', 'Sim, passei na prova!', 'Sim, eu passei na prova.', 'Passei, sim!'],
            ['pt-passar-na-prova'],
            { id: 'pt.ex.25awderi7ucyib' },
          ),
          ex.translateWrite(
            'Mañana tengo examen en la facultad.',
            'Amanhã eu tenho prova na faculdade.',
            ['pt-prova', 'pt-faculdade'],
            {
              id: 'pt.ex.tb39n396diuda1',
              acceptedAnswers: ['Amanhã tenho prova na faculdade.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'No trabalho',
        objective: 'Hablar de tu trabajo y de la gente con la que trabajás.',
        intro: {
          explanation:
            'O chefe / a chefe (el jefe, la jefa), o colega (el compañero de trabajo), a reunião (la reunión). O salário es el sueldo. Uno va na reunião o à reunião.',
          examples: [
            {
              target: 'A reunião com a chefe é às três.',
              base: 'La reunión con la jefa es a las tres.',
            },
            {
              target: 'Os meus colegas são muito legais.',
              base: 'Mis compañeros son muy buena onda.',
            },
          ],
        },
        takeaways: [
          'Nombrás a la gente del trabajo: chefe, colega.',
          'Hablás de reuniones y del sueldo.',
        ],
        exercises: [
          ex.translationChoice(
            'chefe',
            'jefe / jefa',
            ['chef (cocinero)', 'compañero de trabajo', 'cliente'],
            ['pt-chefe'],
            { id: 'pt.ex.y9dosta71e7thv' },
          ),
          ex.translationChoice(
            'salário',
            'sueldo',
            ['salón', 'saludo', 'horario'],
            ['pt-salario'],
            { id: 'pt.ex.b758t0v5ja7hpq' },
          ),
          ex.listenChoice(
            'A reunião é às três.',
            ['A reunião é às duas.', 'A reunião foi às três.', 'A reunião é amanhã.'],
            ['pt-reuniao'],
            { id: 'pt.ex.6da6rhcwaefs7l' },
          ),
          ex.fillBlank(
            'O Igor é meu ___ de trabalho.',
            'Igor es mi compañero de trabajo.',
            'colega',
            ['chefe', 'salário', 'curso'],
            ['pt-colega'],
            { id: 'pt.ex.3chrdlw9krvoww', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Hoje eu tenho uma ___ com a chefe.',
            'Hoy tengo una reunión con la jefa.',
            'reunião',
            ['prova', 'colega', 'faculdade'],
            ['pt-reuniao', 'pt-chefe'],
            { id: 'pt.ex.c0vhp9vcojdjrh', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.atogrbl3u9ng8o',
            COLEGAS,
            '¿Qué va a hacer la jefa en la reunión?',
            'Presentar el proyecto nuevo',
            ['Hablar del sueldo', 'Presentar a un compañero nuevo', 'Hacer entrevistas'],
            ['pt-chefe', 'pt-reuniao'],
            'Paula dice: «A chefe vai apresentar o projeto novo».',
          ),
          ex.matchPairs(
            [
              ['chefe', 'jefe / jefa'],
              ['colega', 'compañero de trabajo'],
              ['reunião', 'reunión'],
              ['salário', 'sueldo'],
            ],
            ['pt-chefe', 'pt-colega', 'pt-reuniao', 'pt-salario'],
            { id: 'pt.ex.0cc8tgq1gjxlxt' },
          ),
          ex.orderWords(
            'Os meus colegas são muito legais.',
            'Mis compañeros son muy buena onda.',
            ['pt-colega'],
            { id: 'pt.ex.rk8tu591oc42j7' },
          ),
          ex.shortAnswer(
            'Como é a sua chefe? (simpática)',
            '¿Cómo es tu jefa? (Respondé que es muy simpática.)',
            'Ela é muito simpática.',
            [
              'A minha chefe é muito simpática.',
              'Minha chefe é muito simpática.',
              'É muito simpática.',
            ],
            ['pt-chefe'],
            { id: 'pt.ex.p4ewcsful9lcru' },
          ),
          ex.translateWrite(
            'Hoy tengo una reunión con mi jefe.',
            'Hoje eu tenho uma reunião com o meu chefe.',
            ['pt-reuniao', 'pt-chefe'],
            {
              id: 'pt.ex.cm65lwtpor3hog',
              acceptedAnswers: [
                'Hoje tenho uma reunião com o meu chefe.',
                'Hoje eu tenho uma reunião com meu chefe.',
                'Hoje tenho reunião com o meu chefe.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Uma vaga de estágio',
        objective: 'Entender un aviso de trabajo.',
        intro: {
          explanation:
            'Falso amigo: vaga es una «vacante» o un «puesto»: tem uma vaga de estágio. Estágio es la pasantía. Para postularte mandás o currículo y después tenés a entrevista.',
          examples: [
            {
              target: 'Tem uma vaga de estágio na empresa.',
              base: 'Hay una vacante de pasantía en la empresa.',
            },
            { target: 'Mandei o meu currículo ontem.', base: 'Ayer mandé mi currículum.' },
          ],
        },
        takeaways: ['Entendés un aviso: vaga, estágio, salário.', 'Sabés que vaga es «vacante».'],
        exercises: [
          ex.translationChoice(
            'vaga',
            'vacante / puesto',
            ['perezosa', 'vaca', 'ola'],
            ['pt-vaga'],
            {
              id: 'pt.ex.tqxjxkrqcza275',
              explanation: 'Falso amigo: vaga es una vacante (también un lugar para estacionar).',
            },
          ),
          ex.translationChoice(
            'estágio',
            'pasantía',
            ['estadio', 'etapa', 'escenario'],
            ['pt-estagio'],
            { id: 'pt.ex.b8rujhhfaxyb0x' },
          ),
          ex.listenChoice(
            'Mandei o meu currículo ontem.',
            [
              'Mandei o meu currículo hoje.',
              'Mandou o currículo ontem.',
              'Vou mandar o meu currículo.',
            ],
            ['pt-curriculo'],
            { id: 'pt.ex.67pojo5krmtg0t' },
          ),
          question(
            'pt.ex.plsqoz1qhf1t8i',
            VAGA,
            '¿Para quién es la pasantía?',
            'Para estudiantes de administración o comunicación',
            ['Para ingenieros recibidos', 'Para cualquier persona', 'Para estudiantes de economía'],
            ['pt-vaga', 'pt-estagio'],
            'El aviso dice: «Para estudantes de administração ou comunicação».',
          ),
          question(
            'pt.ex.2budvpmuf4dfxb',
            VAGA,
            '¿Cuál es el horario?',
            'De 9 a 13',
            ['De 9 a 17', 'De 13 a 18', 'Solo los viernes'],
            ['pt-estagio'],
            'Dice: «Horário: das 9h às 13h».',
          ),
          question(
            'pt.ex.jn57i0ky9k2u7s',
            VAGA,
            '¿Qué hay que hacer antes del viernes?',
            'Mandar el currículum',
            ['Ir a la entrevista', 'Llamar a la empresa', 'Ir a la facultad'],
            ['pt-curriculo', 'pt-entrevista'],
            'Dice: «Envie o seu currículo até sexta-feira».',
          ),
          ex.fillBlank(
            'Tem uma ___ de estágio no escritório.',
            'Hay una vacante de pasantía en la oficina.',
            'vaga',
            ['prova', 'reunião', 'chefe'],
            ['pt-vaga', 'pt-estagio'],
            { id: 'pt.ex.dia6sih36bgiui', skill: 'vocabulary' },
          ),
          ex.orderWords(
            'Eu faço estágio numa empresa grande.',
            'Hago una pasantía en una empresa grande.',
            ['pt-estagio'],
            { id: 'pt.ex.lu7zveomm63bpg' },
          ),
          ex.shortAnswer(
            'Você já mandou o currículo?',
            '¿Ya mandaste el currículum? (Respondé que sí, que lo mandaste ayer.)',
            'Sim, eu mandei ontem.',
            [
              'Já, mandei ontem.',
              'Mandei ontem.',
              'Sim, mandei o currículo ontem.',
              'Sim, eu mandei o currículo ontem.',
            ],
            ['pt-curriculo'],
            { id: 'pt.ex.t8c6nkl3kb762c' },
          ),
          ex.translateWrite(
            'Hay una vacante de pasantía.',
            'Tem uma vaga de estágio.',
            ['pt-vaga', 'pt-estagio'],
            {
              id: 'pt.ex.0pd4e8y3fdwd1l',
              acceptedAnswers: ['Há uma vaga de estágio.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'A entrevista será na segunda',
        objective: 'Entender el futuro formal en un correo.',
        intro: {
          explanation:
            'En un correo o un aviso aparece el futuro do presente: será (ser), terá (ter), falará (falar). Se forma con el infinitivo + -á: falar → falará. Al hablar, lo normal es vai ser, vai ter.',
          examples: [
            {
              target: 'A sua entrevista será na segunda-feira.',
              base: 'Su entrevista será el lunes.',
            },
            { target: 'A conversa terá duração de uma hora.', base: 'La charla durará una hora.' },
          ],
        },
        takeaways: [
          'Entendés el futuro formal: será, terá.',
          'Sabés que al hablar se dice vai ser.',
        ],
        exercises: [
          ex.translationChoice('terá', 'tendrá', ['tenía', 'tuvo', 'será'], ['pt-tera'], {
            id: 'pt.ex.edg3zq24vp1tab',
          }),
          ex.listenChoice(
            'A reunião será às dez.',
            ['A reunião foi às dez.', 'A reunião será às doze.', 'A entrevista será às dez.'],
            ['pt-sera', 'pt-reuniao'],
            { id: 'pt.ex.j8v3hiq0xucqto' },
          ),
          ex.fillBlank(
            'A entrevista ___ na segunda-feira.',
            'La entrevista será el lunes.',
            'será',
            ['foi', 'era', 'terá'],
            ['pt-sera', 'pt-entrevista'],
            { id: 'pt.ex.mb2vlqg30a6ory' },
          ),
          ex.fillBlank(
            'A empresa ___ um escritório novo em março.',
            'La empresa tendrá una oficina nueva en marzo.',
            'terá',
            ['será', 'tinha', 'tive'],
            ['pt-tera'],
            { id: 'pt.ex.s797tr6l87dbdh' },
          ),
          question(
            'pt.ex.cdw43p0j2qzdrm',
            EMAIL,
            '¿Cuándo es la entrevista de Ana?',
            'El lunes a las diez',
            ['El viernes a las diez', 'El lunes a las dos', 'Mañana a las diez'],
            ['pt-sera', 'pt-entrevista'],
            'El correo dice: «A sua entrevista será na segunda-feira, às dez horas».',
          ),
          question(
            'pt.ex.30kwcn4c9nnb1j',
            EMAIL,
            '¿Cuánto va a durar?',
            'Cuarenta minutos',
            ['Una hora', 'Cuatro horas', 'Diez minutos'],
            ['pt-tera'],
            'Dice: «A conversa terá duração de quarenta minutos».',
          ),
          question(
            'pt.ex.n1mugadj8n2kx0',
            EMAIL,
            '¿Con quién va a hablar Ana?',
            'Con la jefa del sector',
            ['Con todo el equipo', 'Con otro candidato', 'Con el dueño de la empresa'],
            ['pt-chefe'],
            'Dice: «a senhora falará com a chefe do setor».',
          ),
          ex.orderWords(
            'A reunião será amanhã às dez.',
            'La reunión será mañana a las diez.',
            ['pt-sera', 'pt-reuniao'],
            { id: 'pt.ex.51be1o674qfscr' },
          ),
          ex.shortAnswer(
            'Quando será a reunião? (sexta, 15h)',
            '¿Cuándo será la reunión? (Respondé que será el viernes a las tres.)',
            'A reunião será na sexta às três.',
            [
              'Será na sexta às três.',
              'Será na sexta-feira às três.',
              'A reunião será na sexta-feira às três.',
              'Na sexta às três.',
            ],
            ['pt-sera', 'pt-reuniao'],
            { id: 'pt.ex.epzjrj52u6xene' },
          ),
          ex.translateWrite(
            'La reunión será el lunes.',
            'A reunião será na segunda-feira.',
            ['pt-reuniao'],
            {
              id: 'pt.ex.j3ugqz3r3sou63',
              acceptedAnswers: [
                'A reunião será na segunda.',
                'A reunião vai ser na segunda-feira.',
                'A reunião vai ser na segunda.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'O que você pretende fazer?',
        objective: 'Contar tu formación y tus planes de trabajo.',
        intro: {
          explanation:
            'Falso amigo: pretender es «tener pensado», «tener la intención»: pretendo fazer um mestrado. «Recibirse» es formar-se: eu me formei em engenharia (con el pronombre antes del verbo, como se habla en Brasil).',
          examples: [
            { target: 'Eu me formei no ano passado.', base: 'Me recibí el año pasado.' },
            {
              target: 'Pretendo trabalhar numa empresa grande.',
              base: 'Tengo pensado trabajar en una empresa grande.',
            },
          ],
        },
        takeaways: ['Contás tu formación: me formei em…', 'Contás tus planes con pretendo.'],
        exercises: [
          ex.translationChoice(
            'pretendo',
            'tengo pensado / tengo la intención de',
            ['pretendo (a alguien)', 'finjo', 'prefiero'],
            ['pt-pretendo'],
            {
              id: 'pt.ex.2kn3iw6i1kl2ba',
              explanation: 'Falso amigo: pretender es «tener la intención».',
            },
          ),
          ex.translationChoice(
            'me formei',
            'me recibí',
            ['me formé (en fila)', 'me inscribí', 'me fui'],
            ['pt-me-formei'],
            { id: 'pt.ex.z822qsdcabq51c' },
          ),
          ex.listenChoice(
            'Eu me formei no ano passado.',
            [
              'Ela se formou no ano passado.',
              'Eu me formei em março.',
              'Eu me formo no ano que vem.',
            ],
            ['pt-me-formei', 'pt-ano-passado'],
            { id: 'pt.ex.yykpau2fvqokte' },
          ),
          ex.fillBlank(
            'Eu ___ fazer um mestrado.',
            'Tengo pensado hacer una maestría.',
            'pretendo',
            ['pretendi', 'formei', 'passei'],
            ['pt-pretendo'],
            { id: 'pt.ex.drn5qc37u482xx' },
          ),
          ex.fillBlank(
            'Eu me ___ em engenharia em 2022.',
            'Me recibí de ingeniero en 2022.',
            'formei',
            ['formo', 'formou', 'passei'],
            ['pt-me-formei'],
            { id: 'pt.ex.oz7ka4hatu8k74' },
          ),
          question(
            'pt.ex.mu7979u2q3f81j',
            ENTREVISTA,
            '¿Qué estudió Tiago?',
            'Ingeniería: se recibió el año pasado',
            ['Economía: se recibe este año', 'Marketing: todavía estudia', 'Administración'],
            ['pt-me-formei'],
            'Tiago dice: «Eu me formei em engenharia no ano passado».',
          ),
          question(
            'pt.ex.1abibcgk5t560d',
            ENTREVISTA,
            '¿Por qué quiere trabajar en la empresa?',
            'Le gustan los proyectos grandes y quiere crecer ahí',
            ['Por el sueldo', 'Porque queda cerca de su casa', 'Porque su jefe es su amigo'],
            ['pt-pretendo'],
            'Dice: «eu gosto de projetos grandes e pretendo crescer na empresa».',
          ),
          question(
            'pt.ex.ys1ikb77s52hjq',
            COLEGAS,
            '¿Qué tiene pensado hacer Igor después de la carrera?',
            'Una maestría',
            ['Una pasantía', 'Un viaje', 'Trabajar con la jefa'],
            ['pt-pretendo', 'pt-curso'],
            'Igor dice: «Pretendo fazer um mestrado».',
          ),
          ex.shortAnswer(
            'O que você pretende fazer no ano que vem? (estágio)',
            '¿Qué tenés pensado hacer el año que viene? (Respondé que una pasantía.)',
            'Eu pretendo fazer um estágio.',
            [
              'Pretendo fazer um estágio.',
              'Um estágio.',
              'No ano que vem eu pretendo fazer um estágio.',
            ],
            ['pt-pretendo', 'pt-estagio'],
            { id: 'pt.ex.7net5j9tddf5kd' },
          ),
          ex.translateWrite(
            'Me recibí el año pasado.',
            'Eu me formei no ano passado.',
            ['pt-me-formei', 'pt-ano-passado'],
            {
              id: 'pt.ex.92p0d66wlysmpt',
              acceptedAnswers: ['Me formei no ano passado.'],
            },
          ),
        ],
      },
    ],
  },
};
