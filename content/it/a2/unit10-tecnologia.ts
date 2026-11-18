import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U10 «Tecnología y comunicación» (docs/IT_A1_A2.md): el celular, los mensajes y las
 * llamadas, y los pronombres de objeto: mi / ti (ti chiamo), directos lo / la (lo vedo, la chiamo)
 * e indirectos gli / le (gli scrivo, le telefono).
 * Contraste con el español: gli es «le» (a él) y le es «le» (a ella); chiamare lleva objeto directo
 * (la chiamo) y telefonare, indirecto (le telefono).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TELEFONATA = dialogue(
  'it.stim.a2-u10-telefonata',
  'Giulia llama a Luca, que tiene el celular casi sin batería.',
  [
    ['Giulia', 'Pronto, Luca? Ti sento male!'],
    ['Luca', 'Scusa, il cellulare ha poca batteria.'],
    ['Giulia', 'Allora ti scrivo un messaggio, va bene?'],
    ['Luca', 'Sì, o ti chiamo io stasera, quando lo carico.'],
    ['Giulia', 'Perfetto. Ah, hai sentito Marta?'],
    ['Luca', 'No, ma le telefono domani.'],
  ],
);

const CHAT = reading(
  'it.stim.a2-u10-chat',
  'message',
  'El grupo de la familia, el día del cumpleaños de la abuela.',
  [
    'Mamma: Avete scritto alla nonna per il suo compleanno?',
    'Paolo: Sì, le ho mandato un messaggio stamattina.',
    'Anna: Io la chiamo stasera, con una videochiamata!',
    'Mamma: Bravi! E al nonno? Gli scrivete anche voi?',
  ],
  { title: 'Famiglia ❤️' },
);

const MUSEO = reading(
  'it.stim.a2-u10-museo',
  'notice',
  'Un cartel en la entrada de un museo.',
  [
    'Scarica l’app del museo sul tuo cellulare.',
    'Non hai il wifi? Nessun problema: c’è una rete gratuita in tutto il museo.',
    'Ricorda: carica la batteria prima della visita!',
  ],
  { title: 'Museo: l’app gratuita' },
);

const UFFICIO = dialogue(
  'it.stim.a2-u10-ufficio',
  'La jefa habla con un empleado, el señor Bianchi.',
  [
    ['Capo', 'Signor Bianchi, mi manda il documento, per favore?'],
    ['Bianchi', 'Certo, lo mando subito per email.'],
    ['Capo', 'E il cliente di Torino? Gli ha risposto?'],
    ['Bianchi', 'Non ancora. Lo chiamo dopo pranzo.'],
    ['Capo', 'Bene. E porti il portatile alla riunione.'],
  ],
);

export const IT_A2_U10: ItUnitDef = {
  names: [
    'Giulia',
    'Luca',
    'Marta',
    'Mamma',
    'Paolo',
    'Anna',
    'Capo',
    'Bianchi',
    'Torino',
    'Sara',
    'Marco',
  ],
  support: [
    'sento',
    'poca',
    'carico',
    'sentito',
    'mandato',
    'bravi',
    'scrivete',
    'scarica',
    'app',
    'museo',
    'wifi',
    'nessun',
    'problema',
    'rete',
    'gratuita',
    'ricorda',
    'carica',
    'visita',
    'signor',
    'manda',
    'mando',
    'mandi',
    'documento',
    'email',
    'ah',
    'risposto',
    'porti',
    'riunione',
    'nello',
    'mail',
    'adesso',
    'guidando',
    'scaricato',
    'telefoni',
    'scrivi',
    'vedi',
  ],
  unit: {
    position: 10,
    title: 'Tecnología y comunicación',
    titleEn: 'Tecnologia e comunicazione',
    description:
      'Hablar del celular, los mensajes y las llamadas, y usar los pronombres: ti chiamo, lo vedo, gli scrivo, le telefono.',
    emoji: '📱',
    objective:
      'Podés hablar del celular y la compu, mandar y responder mensajes, arreglar una llamada y usar los pronombres para no repetir a quién (ti chiamo, la vedo, gli scrivo).',
    grammar: {
      title: 'Pronombres de objeto directo e indirecto',
      explanation:
        'Los pronombres van antes del verbo conjugado: ti chiamo (te llamo), lo vedo (lo veo), la chiamo (la llamo). Directos: mi, ti, lo, la, ci, vi, li, le. Indirectos («a quién»): mi, ti, gli (a él), le (a ella; Le = a usted), ci, vi, gli (a ellos). Ojo con el español: gli scrivo es «le escribo» a un hombre y le telefono, «le hablo por teléfono» a una mujer. Chiamare va con directo (la chiamo) y telefonare con indirecto (le telefono).',
      examples: [
        { target: 'Ti chiamo stasera.', base: 'Te llamo esta noche.' },
        { target: 'Vedi Marco? — Sì, lo vedo domani.', base: '¿Ves a Marco? — Sí, lo veo mañana.' },
        { target: 'Gli scrivo un messaggio.', base: 'Le escribo un mensaje (a él).' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U10). Sin revisión nativa: revisar gli / le con telefonare, cellulare / telefonino y el registro de la oficina.',
    },
    words: [
      w(
        'it-cellulare',
        'cellulare',
        'celular',
        'Il cellulare è nella borsa.',
        'El celular está en la cartera.',
        ['technology'],
        {
          acceptedTranslations: ['móvil'],
          emoji: '📱',
        },
      ),
      w(
        'it-portatile',
        'portatile',
        'notebook',
        'Porto il portatile in ufficio.',
        'Llevo la notebook a la oficina.',
        ['technology'],
        {
          acceptedTranslations: ['laptop', 'computadora portátil'],
          emoji: '💻',
        },
      ),
      w(
        'it-messaggio',
        'messaggio',
        'mensaje',
        'Ti scrivo un messaggio.',
        'Te escribo un mensaje.',
        ['technology'],
      ),
      w(
        'it-batteria',
        'batteria',
        'batería',
        'Il cellulare non ha batteria.',
        'El celular no tiene batería.',
        ['technology'],
        { emoji: '🔋' },
      ),
      w(
        'it-caricare',
        'caricare',
        'cargar',
        'Devo caricare il cellulare.',
        'Tengo que cargar el celular.',
        ['technology', 'verbs'],
      ),
      w(
        'it-scaricare',
        'scaricare',
        'descargar',
        'Devo scaricare l’app.',
        'Tengo que descargar la app.',
        ['technology', 'verbs'],
      ),
      w(
        'it-mandare',
        'mandare',
        'mandar',
        'Devo mandare un messaggio.',
        'Tengo que mandar un mensaje.',
        ['technology', 'verbs'],
        {
          acceptedTranslations: ['enviar'],
        },
      ),
      w(
        'it-rispondere',
        'rispondere',
        'responder',
        'Non posso rispondere adesso.',
        'No puedo responder ahora.',
        ['technology', 'verbs'],
        {
          acceptedTranslations: ['contestar'],
        },
      ),
      w(
        'it-chiamata',
        'chiamata',
        'llamada',
        'Ho una chiamata di lavoro.',
        'Tengo una llamada de trabajo.',
        ['technology'],
      ),
      w(
        'it-videochiamata',
        'videochiamata',
        'videollamada',
        'Facciamo una videochiamata?',
        '¿Hacemos una videollamada?',
        ['technology'],
      ),
      w('it-ti-chiamo', 'ti chiamo', 'te llamo', 'Ti chiamo stasera.', 'Te llamo esta noche.', [
        'pronouns',
        'technology',
      ]),
      w('it-ti-scrivo', 'ti scrivo', 'te escribo', 'Ti scrivo domani.', 'Te escribo mañana.', [
        'pronouns',
        'technology',
      ]),
      w(
        'it-lo-vedo',
        'lo vedo',
        'lo veo',
        'Lo vedo alle cinque.',
        'Lo veo a las cinco.',
        ['pronouns'],
        {
          acceptedTexts: ['la vedo'],
          acceptedTranslations: ['la veo'],
        },
      ),
      w(
        'it-la-chiamo',
        'la chiamo',
        'la llamo',
        'La chiamo subito.',
        'La llamo enseguida.',
        ['pronouns', 'technology'],
        {
          acceptedTexts: ['lo chiamo'],
          acceptedTranslations: ['lo llamo'],
        },
      ),
      w(
        'it-gli-scrivo',
        'gli scrivo',
        'le escribo (a él)',
        'Gli scrivo stasera.',
        'Le escribo esta noche.',
        ['pronouns', 'technology'],
      ),
      w(
        'it-le-telefono',
        'le telefono',
        'le hablo por teléfono (a ella)',
        'Le telefono domani.',
        'Mañana la llamo.',
        ['pronouns', 'technology'],
        {
          acceptedTranslations: ['la llamo por teléfono'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Il cellulare',
        objective: 'Nombrar el celular, la compu y la batería.',
        intro: {
          explanation:
            'En Italia el celular es il cellulare (también il telefonino). La notebook es il portatile. Caricare es «cargar» (la batería) y la batteria scarica es la batería descargada.',
          examples: [
            { target: 'Il cellulare non ha batteria.', base: 'El celular no tiene batería.' },
            { target: 'Devo caricare il cellulare.', base: 'Tengo que cargar el celular.' },
          ],
        },
        takeaways: [
          'Nombrás il cellulare, il portatile y la batteria.',
          'Decís que tenés que cargar el celular.',
        ],
        exercises: [
          ex.imageChoice(
            '📱',
            'cellulare',
            ['portatile', 'batteria', 'messaggio'],
            ['it-cellulare'],
            { id: 'it.ex.3an9k19s80d508' },
          ),
          ex.imageChoice(
            '💻',
            'portatile',
            ['cellulare', 'batteria', 'orologio'],
            ['it-portatile'],
            { id: 'it.ex.3mr0r2ihdjp423' },
          ),
          ex.translationChoice(
            'caricare',
            'cargar',
            ['cansar', 'cobrar', 'buscar'],
            ['it-caricare'],
            { id: 'it.ex.1qwilcnsrw30m4' },
          ),
          ex.matchPairs(
            [
              ['cellulare', 'celular'],
              ['messaggio', 'mensaje'],
              ['batteria', 'batería'],
              ['portatile', 'notebook'],
            ],
            ['it-cellulare', 'it-messaggio', 'it-batteria', 'it-portatile'],
            { id: 'it.ex.bneoo0iqb9hlqx' },
          ),
          ex.listenChoice(
            'Il cellulare non ha batteria.',
            [
              'Il portatile non ha batteria.',
              'Il cellulare non ha messaggi.',
              'Il cellulare ha poca batteria.',
            ],
            ['it-cellulare', 'it-batteria'],
            { id: 'it.ex.kqjjsnk9tdusar' },
          ),
          ex.fillBlank(
            'Devo ___ il cellulare.',
            'Tengo que cargar el celular.',
            'caricare',
            ['cucinare', 'pagare', 'giocare'],
            ['it-caricare', 'it-cellulare'],
            {
              id: 'it.ex.gpwtjcctdxpe0m',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.mt4im3yxoknq8w',
            TELEFONATA,
            '¿Por qué Giulia escucha mal a Luca?',
            'Porque al celular de Luca le queda poca batería',
            ['Porque Luca está en el tren', 'Porque no hay señal', 'Porque Luca habla muy bajo'],
            ['it-cellulare', 'it-batteria'],
            'Luca dice: «Scusa, il cellulare ha poca batteria».',
          ),
          ex.shortAnswer(
            'Hai il portatile?',
            '¿Tenés la notebook? (Respondé que sí, que está en la mochila.)',
            'Sì, è nello zaino.',
            ['Sì, il portatile è nello zaino.', 'È nello zaino.'],
            ['it-portatile', 'it-zaino'],
            { id: 'it.ex.lzls3t0e2rlm7y' },
          ),
          ex.translateWrite(
            'Tengo que cargar el celular.',
            'Devo caricare il cellulare.',
            ['it-caricare', 'it-cellulare'],
            { id: 'it.ex.tmncoxwxsm5lgo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Mandare, rispondere',
        objective: 'Mandar y responder mensajes y llamadas.',
        intro: {
          explanation:
            'Mandare un messaggio (mandar un mensaje), rispondere (responder), una chiamata (una llamada) y una videochiamata. Scaricare es «descargar»: scaricare un’app.',
          examples: [
            {
              target: 'Devo mandare una mail al capo.',
              base: 'Tengo que mandarle un mail al jefe.',
            },
            {
              target: 'Ho fatto una videochiamata con mia nonna.',
              base: 'Hice una videollamada con mi abuela.',
            },
          ],
        },
        takeaways: ['Usás mandare, rispondere y scaricare.', 'Hablás de llamadas y videollamadas.'],
        exercises: [
          ex.translationChoice(
            'scaricare',
            'descargar',
            ['cargar', 'escuchar', 'borrar'],
            ['it-scaricare'],
            { id: 'it.ex.mubzhk3lb19mks' },
          ),
          ex.translationChoice(
            'chiamata',
            'llamada',
            ['llama (fuego)', 'charla', 'cita'],
            ['it-chiamata'],
            { id: 'it.ex.h4tru4b7pic5eg' },
          ),
          ex.fillBlank(
            'Devo ___ una mail al capo.',
            'Tengo que mandarle un mail al jefe.',
            'mandare',
            ['rispondere', 'caricare', 'scaricare'],
            ['it-mandare'],
            {
              id: 'it.ex.uysqygzn6x56qo',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            'Non posso ___ adesso: sto guidando.',
            'No puedo responder ahora: estoy manejando.',
            'rispondere',
            ['mandare', 'caricare', 'scaricare'],
            ['it-rispondere'],
            { id: 'it.ex.gb9vdwtf8b6xr8', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Ho fatto una videochiamata con mia nonna.',
            [
              'Ho fatto una chiamata con mia nonna.',
              'Faccio una videochiamata con mia nonna.',
              'Ho fatto una videochiamata con mia madre.',
            ],
            ['it-videochiamata', 'it-chiamata'],
            { id: 'it.ex.hml6rgkhbiwxva' },
          ),
          question(
            'it.ex.opbkvaezac3aq6',
            MUSEO,
            '¿Qué recomienda el cartel antes de la visita?',
            'Descargar la app y cargar la batería',
            ['Comprar la entrada por teléfono', 'Apagar el celular', 'Llevar la notebook'],
            ['it-scaricare', 'it-caricare'],
            'El cartel dice: «Scarica l’app del museo» y «carica la batteria prima della visita!».',
          ),
          question(
            'it.ex.e933e57yzv5ekf',
            MUSEO,
            '¿Qué pasa si no tenés wifi?',
            'No hay problema: hay una red gratis en todo el museo',
            ['No se puede usar la app', 'Hay que pagar la red', 'Hay que pedirlo en la entrada'],
            ['it-cellulare'],
            'El cartel dice: «Nessun problema: c’è una rete gratuita in tutto il museo».',
          ),
          ex.shortAnswer(
            'Hai scaricato l’app?',
            '¿Descargaste la app? (Respondé que todavía no.)',
            'No, non ancora.',
            ['Non ancora.', 'No, non l’ho ancora scaricata.', "No, non l'ho ancora scaricata."],
            ['it-scaricare', 'it-ancora'],
            { id: 'it.ex.gvhotxv60bh0mf' },
          ),
          ex.translateWrite(
            'Hice una videollamada con mi hermana.',
            'Ho fatto una videochiamata con mia sorella.',
            ['it-videochiamata', 'it-ho-fatto'],
            {
              id: 'it.ex.cu8e6h8ezez1vw',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Ti chiamo, ti scrivo',
        objective: 'Usar mi y ti para quedar en contacto.',
        intro: {
          explanation:
            'Los pronombres van antes del verbo: ti chiamo (te llamo), ti scrivo (te escribo), mi mandi un messaggio? (¿me mandás un mensaje?). Ojo: ti chiamo es «te llamo», no «te llamás» (ti chiami).',
          examples: [
            { target: 'Ti chiamo stasera, va bene?', base: 'Te llamo esta noche, ¿está bien?' },
            { target: 'Mi mandi un messaggio?', base: '¿Me mandás un mensaje?' },
          ],
        },
        takeaways: ['Decís ti chiamo y ti scrivo.', 'Pedís mi mandi…?'],
        exercises: [
          ex.translationChoice(
            'ti chiamo',
            'te llamo',
            ['me llamo', 'se llama', 'te llamás'],
            ['it-ti-chiamo'],
            {
              id: 'it.ex.wun0wm9mmn1m9l',
              explanation: 'Ti chiamo es «te llamo» (por teléfono). «Te llamás» es ti chiami.',
            },
          ),
          ex.fillBlank(
            '___ chiamo stasera, va bene?',
            'Te llamo esta noche, ¿está bien?',
            'Ti',
            ['Mi', 'Si', 'Lo'],
            ['it-ti-chiamo'],
            { id: 'it.ex.kt458wgm2o1z3u' },
          ),
          ex.fillBlank(
            'Mi ___ un messaggio?',
            '¿Me mandás un mensaje?',
            'mandi',
            ['mando', 'manda', 'mandare'],
            ['it-mandare', 'it-messaggio'],
            {
              id: 'it.ex.o275rvg6odqvsx',
            },
          ),
          ex.listenChoice(
            'Ti scrivo dopo, ora non posso.',
            [
              'Ti chiamo dopo, ora non posso.',
              'Mi scrivi dopo?',
              'Ti scrivo domani, ora non posso.',
            ],
            ['it-ti-scrivo'],
            { id: 'it.ex.khq4nai0k0jpm5' },
          ),
          question(
            'it.ex.bzzxjjot86fr3q',
            TELEFONATA,
            '¿Qué propone Giulia?',
            'Escribirle un mensaje',
            ['Llamarlo más tarde', 'Verse en persona', 'Mandarle un mail'],
            ['it-ti-scrivo', 'it-messaggio'],
            'Giulia dice: «Allora ti scrivo un messaggio, va bene?».',
          ),
          question(
            'it.ex.340uo1b68qt8bm',
            TELEFONATA,
            '¿Y qué propone Luca?',
            'Llamarla esta noche, cuando cargue el celular',
            ['Escribirle mañana', 'Llamarla enseguida', 'Hacer una videollamada'],
            ['it-ti-chiamo', 'it-caricare'],
            'Luca dice: «o ti chiamo io stasera, quando lo carico».',
          ),
          ex.orderWords(
            'Ti chiamo domani mattina.',
            'Te llamo mañana a la mañana.',
            ['it-ti-chiamo'],
            { id: 'it.ex.rz02tpu5yofwh3' },
          ),
          ex.shortAnswer(
            'Mi chiami stasera?',
            '¿Me llamás esta noche? (Respondé que sí, a las nueve.)',
            'Sì, ti chiamo alle nove.',
            ['Ti chiamo alle nove.', 'Sì, ti chiamo stasera alle nove.'],
            ['it-ti-chiamo'],
            { id: 'it.ex.m82709s5jidbmx' },
          ),
          ex.translateWrite(
            'Te escribo mañana.',
            'Ti scrivo domani.',
            ['it-ti-scrivo', 'it-domani'],
            { id: 'it.ex.2a2fxjnb7gbg2r' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Lo vedo, la chiamo',
        objective: 'Reemplazar a una persona o una cosa con lo y la.',
        intro: {
          explanation:
            'Para no repetir: lo (a él o algo masculino) y la (a ella o algo femenino), antes del verbo. Vedi Marco? — Sì, lo vedo. Chiami Anna? — La chiamo subito. Il portatile? Lo porto io.',
          examples: [
            {
              target: 'Vedi Marco oggi? — Sì, lo vedo alle cinque.',
              base: '¿Ves a Marco hoy? — Sí, lo veo a las cinco.',
            },
            {
              target: 'Chiami Anna? — Sì, la chiamo subito.',
              base: '¿Llamás a Anna? — Sí, la llamo enseguida.',
            },
          ],
        },
        takeaways: ['Usás lo y la antes del verbo.', 'Entendés indicaciones en la oficina.'],
        exercises: [
          ex.translationChoice(
            'la chiamo',
            'la llamo',
            ['la llama', 'me llamo', 'la llamás'],
            ['it-la-chiamo'],
            { id: 'it.ex.i2c3u5sdisdv01' },
          ),
          ex.fillBlank(
            'Vedi Marco oggi? — Sì, ___ vedo alle cinque.',
            '¿Ves a Marco hoy? — Sí, lo veo a las cinco.',
            'lo',
            ['la', 'gli', 'le'],
            ['it-lo-vedo'],
            {
              id: 'it.ex.fpf1hfawp90l3k',
            },
          ),
          ex.fillBlank(
            'Chiami Anna? — Sì, ___ chiamo subito.',
            '¿Llamás a Anna? — Sí, la llamo enseguida.',
            'la',
            ['lo', 'gli', 'ti'],
            ['it-la-chiamo'],
            {
              id: 'it.ex.zywjj1r5wwu3ic',
              explanation: 'Anna es una mujer: la chiamo.',
            },
          ),
          ex.listenChoice(
            'Il portatile? Lo porto io.',
            [
              'Il cellulare? Lo porto io.',
              'La giacca? La porto io.',
              'Il portatile? Lo prendo io.',
            ],
            ['it-lo-vedo', 'it-portatile'],
            { id: 'it.ex.asg8q0zx7khwad' },
          ),
          question(
            'it.ex.77bu9ebhzkaa01',
            UFFICIO,
            '¿Qué le pide la jefa al señor Bianchi primero?',
            'Que le mande el documento',
            ['Que llame a un cliente', 'Que vaya a una reunión', 'Que le preste la notebook'],
            ['it-mandare'],
            'La jefa dice: «mi manda il documento, per favore?» y él responde: «lo mando subito».',
          ),
          question(
            'it.ex.6bn1v8cj9k0dvy',
            UFFICIO,
            '¿Cuándo va a llamar al cliente de Turín?',
            'Después del almuerzo',
            ['Ahora mismo', 'Mañana', 'Ya lo llamó'],
            ['it-la-chiamo', 'it-rispondere'],
            'El señor Bianchi dice: «Non ancora. Lo chiamo dopo pranzo».',
          ),
          ex.shortAnswer(
            'Vedi Sara domani?',
            '¿Ves a Sara mañana? (Respondé que sí, que la ves a la tarde.)',
            'Sì, la vedo il pomeriggio.',
            [
              'La vedo il pomeriggio.',
              'Sì, la vedo nel pomeriggio.',
              'Sì, la vedo domani pomeriggio.',
            ],
            ['it-lo-vedo'],
            { id: 'it.ex.t55obt02f6hxaw' },
          ),
          ex.translateWrite(
            'Lo llamo después del almuerzo.',
            'Lo chiamo dopo pranzo.',
            ['it-la-chiamo'],
            {
              id: 'it.ex.b7luj0tqmw0oo4',
              acceptedAnswers: ['Lo chiamo dopo il pranzo.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Gli scrivo, le telefono',
        objective: 'Usar gli y le para decir a quién.',
        intro: {
          explanation:
            'Para «a quién»: gli (a él) y le (a ella). Gli scrivo es «le escribo» a un hombre; le telefono, «le hablo por teléfono» a una mujer. Ojo: telefonare a va con gli / le (le telefono), pero chiamare va con lo / la (la chiamo).',
          examples: [
            {
              target: 'Scrivi a Marco? — Sì, gli scrivo stasera.',
              base: '¿Le escribís a Marco? — Sí, le escribo esta noche.',
            },
            { target: 'Le telefono domani mattina.', base: 'La llamo mañana a la mañana.' },
          ],
        },
        takeaways: ['Usás gli para él y le para ella.', 'Distinguís la chiamo de le telefono.'],
        exercises: [
          ex.translationChoice(
            'gli scrivo',
            'le escribo (a él)',
            ['les escribo a ustedes', 'le escribo (a ella)', 'me escribe'],
            ['it-gli-scrivo'],
            {
              id: 'it.ex.nziudaapap1n8m',
            },
          ),
          ex.fillBlank(
            'Scrivi a Marco? — Sì, ___ scrivo stasera.',
            '¿Le escribís a Marco? — Sí, le escribo esta noche.',
            'gli',
            ['le', 'lo', 'la'],
            ['it-gli-scrivo'],
            {
              id: 'it.ex.swqbuix41057qg',
              explanation: '«A Marco» (a él): gli.',
            },
          ),
          ex.fillBlank(
            'Telefoni alla nonna? — Sì, ___ telefono domani.',
            '¿La llamás a la abuela? — Sí, la llamo mañana.',
            'le',
            ['gli', 'la', 'lo'],
            ['it-le-telefono', 'it-nonna'],
            { id: 'it.ex.7k5fvpx7mhjd7p', explanation: 'Telefonare a + una mujer: le telefono.' },
          ),
          ex.listenChoice(
            'Le telefono domani mattina.',
            ['Gli telefono domani mattina.', 'Le scrivo domani mattina.', 'Le telefono stasera.'],
            ['it-le-telefono'],
            { id: 'it.ex.am1gt970a3gcs4' },
          ),
          question(
            'it.ex.xkxdxam5alfjrb',
            CHAT,
            '¿Qué hizo Paolo para el cumpleaños de la abuela?',
            'Le mandó un mensaje a la mañana',
            ['La llamó por teléfono', 'Le hizo una videollamada', 'Todavía nada'],
            ['it-messaggio', 'it-le-telefono'],
            'Paolo escribe: «le ho mandato un messaggio stamattina» (le = a la abuela).',
          ),
          question(
            'it.ex.7f902rkif3ymfv',
            CHAT,
            '¿Cómo la va a saludar Anna?',
            'Con una videollamada esta noche',
            ['Con un mensaje', 'Yendo a su casa', 'Con una carta'],
            ['it-la-chiamo', 'it-videochiamata'],
            'Anna escribe: «Io la chiamo stasera, con una videochiamata!».',
          ),
          question(
            'it.ex.9r23k2tr0sq576',
            CHAT,
            '¿Qué pregunta la mamá al final?',
            'Si también le escriben al abuelo',
            ['Si llamaron a la abuela', 'Quién compró el regalo', 'A qué hora es la fiesta'],
            ['it-gli-scrivo'],
            'La mamá escribe: «E al nonno? Gli scrivete anche voi?» (gli = a él).',
          ),
          ex.shortAnswer(
            'Hai scritto al nonno?',
            '¿Le escribiste al abuelo? (Respondé que todavía no, que le escribís mañana.)',
            'Non ancora, gli scrivo domani.',
            ['No, non ancora: gli scrivo domani.', 'Gli scrivo domani.', 'No, gli scrivo domani.'],
            ['it-gli-scrivo', 'it-ancora'],
            { id: 'it.ex.3k4yuj6tngc5et' },
          ),
          ex.translateWrite(
            'Le escribo mañana (a él).',
            'Gli scrivo domani.',
            ['it-gli-scrivo', 'it-domani'],
            { id: 'it.ex.9wv06oml7obo6x' },
          ),
        ],
      },
    ],
  },
};
