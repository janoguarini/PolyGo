import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('pt'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/**
 * Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística.
 * Los artículos se traducen con una descripción («artículo masculino (el)») para no chocar con
 * «él» (ele).
 */
export const unit05: UnitDef = {
  position: 5,
  title: 'Objetos y colores',
  titleEn: 'Objetos e cores',
  description: 'Nombrar objetos con su artículo, decir de qué color son y de quién son.',
  emoji: '🎒',
  objective:
    'Podés preguntar qué es algo, nombrar objetos con o / a / um / uma, decir de qué color son y de quién son con do / da.',
  grammar: {
    title: 'Artículos y de + artículo',
    explanation:
      'El artículo es o (masculino), a (femenino), os y as en plural; um y uma son «un» y «una». De se junta con el artículo: de + o = do, de + a = da. En Brasil los nombres de persona suelen llevar artículo: o livro do João.',
    examples: [
      { target: 'o livro → os livros', base: 'el libro → los libros' },
      { target: 'a caneta → as canetas', base: 'la lapicera → las lapiceras' },
      { target: 'A chave é da Ana.', base: 'La llave es de Ana.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w('pt-o', 'o', 'artículo masculino (el)', 'o livro', 'el libro', ['articles']),
    w('pt-a', 'a', 'artículo femenino (la)', 'a caneta', 'la lapicera', ['articles']),
    w('pt-os', 'os', 'artículo masculino plural (los)', 'os livros', 'los libros', ['articles']),
    w('pt-as', 'as', 'artículo femenino plural (las)', 'as canetas', 'las lapiceras', ['articles']),
    w('pt-livro', 'livro', 'libro', 'O livro é vermelho.', 'El libro es rojo.', ['objects'], {
      emoji: '📕',
    }),
    w(
      'pt-caneta',
      'caneta',
      'lapicera',
      'A caneta é preta.',
      'La lapicera es negra.',
      ['objects'],
      {
        acceptedTranslations: ['bolígrafo', 'birome'],
        emoji: '🖊️',
      },
    ),
    w(
      'pt-caderno',
      'caderno',
      'cuaderno',
      'Tenho dois cadernos.',
      'Tengo dos cuadernos.',
      ['objects'],
      { emoji: '📓' },
    ),
    w(
      'pt-borracha',
      'borracha',
      'goma de borrar',
      'Tenho uma borracha.',
      'Tengo una goma de borrar.',
      ['objects', 'false-friends'],
      { acceptedTranslations: ['goma'] },
    ),
    w('pt-chave', 'chave', 'llave', 'A chave é da Ana.', 'La llave es de Ana.', ['objects'], {
      emoji: '🔑',
    }),
    w(
      'pt-oculos',
      'óculos',
      'anteojos',
      'Os óculos são pretos.',
      'Los anteojos son negros.',
      ['objects'],
      { acceptedTranslations: ['lentes', 'gafas'], emoji: '👓' },
    ),
    w('pt-vermelho', 'vermelho', 'rojo', 'O livro é vermelho.', 'El libro es rojo.', ['colors'], {
      acceptedTexts: ['vermelha'],
      emoji: '🔴',
    }),
    w('pt-azul', 'azul', 'azul', 'A caneta é azul.', 'La lapicera es azul.', ['colors'], {
      emoji: '🔵',
    }),
    w(
      'pt-amarelo',
      'amarelo',
      'amarillo',
      'A chave é amarela.',
      'La llave es amarilla.',
      ['colors'],
      { acceptedTexts: ['amarela'], emoji: '🟡' },
    ),
    w('pt-preto', 'preto', 'negro', 'A caneta é preta.', 'La lapicera es negra.', ['colors'], {
      acceptedTexts: ['preta'],
      emoji: '⚫',
    }),
    w(
      'pt-branco',
      'branco',
      'blanco',
      'Meu caderno é branco.',
      'Mi cuaderno es blanco.',
      ['colors'],
      { acceptedTexts: ['branca'], emoji: '⚪' },
    ),
    w('pt-do', 'do', 'del (de + o)', 'O livro é do João.', 'El libro es de João.', [
      'prepositions',
    ]),
    w('pt-da', 'da', 'de la (de + a)', 'A chave é da Ana.', 'La llave es de Ana.', [
      'prepositions',
    ]),
    w(
      'pt-de-quem',
      'de quem é?',
      '¿de quién es?',
      'De quem é a caneta?',
      '¿De quién es la lapicera?',
      ['questions'],
    ),
    w(
      'pt-o-que-e',
      'o que é isso?',
      '¿qué es eso?',
      'O que é isso? É um livro.',
      '¿Qué es eso? Es un libro.',
      ['questions'],
    ),
  ],
  lessons: [
    {
      title: 'O que é isso?',
      objective: 'Preguntar qué es algo y nombrar objetos con o y a.',
      intro: {
        explanation:
          'Para preguntar qué es algo: o que é isso? En portugués el artículo es o (masculino) y a (femenino): o livro, a caneta. Se responde con é + la cosa: é um livro.',
        examples: [
          { target: 'O que é isso? É um livro.', base: '¿Qué es eso? Es un libro.' },
          { target: 'A caneta é azul.', base: 'La lapicera es azul.' },
        ],
      },
      takeaways: [
        'Preguntás qué es algo con o que é isso?',
        'Usás o con masculinos y a con femeninos.',
      ],
      exercises: [
        ex.imageChoice('📕', 'livro', ['caneta', 'chave', 'caderno'], ['pt-livro']),
        ex.translationChoice('caneta', 'lapicera', ['llave', 'libro', 'cuaderno'], ['pt-caneta']),
        ex.imageChoice('🔑', 'chave', ['caneta', 'livro', 'óculos'], ['pt-chave']),
        ex.listenChoice(
          'O que é isso?',
          ['De onde você é?', 'Tudo bem?', 'Como você se chama?'],
          ['pt-o-que-e'],
        ),
        ex.fillBlank(
          'É ___ caneta.',
          'Es la lapicera.',
          'a',
          ['o', 'os', 'um'],
          ['pt-a', 'pt-caneta'],
          { explanation: 'Caneta es femenina: a caneta.' },
        ),
        ex.fillBlank(
          'É ___ livro.',
          'Es el libro.',
          'o',
          ['a', 'as', 'uma'],
          ['pt-o', 'pt-livro'],
          {
            explanation: 'Livro es masculino: o livro.',
          },
        ),
        ex.translateWrite('La llave', 'a chave', ['pt-a', 'pt-chave']),
        ex.shortAnswer(
          'O que é isso? 📕',
          '¿Qué es eso? (Respondé que es un libro.)',
          'É um livro.',
          ['Um livro.', 'É o livro.', 'O livro.', 'Isso é um livro.'],
          ['pt-o-que-e', 'pt-livro', 'pt-um'],
        ),
      ],
    },
    {
      title: 'Um, uma, os, as',
      objective: 'Usar um / uma y los artículos en plural.',
      intro: {
        explanation:
          'Um y uma son «un» y «una». En plural el artículo es os o as: os livros, as canetas. Ojo: borracha es la goma de borrar, y óculos (anteojos) va siempre en plural: os óculos.',
        examples: [
          { target: 'Tenho uma borracha.', base: 'Tengo una goma de borrar.' },
          { target: 'Tenho dois cadernos.', base: 'Tengo dos cuadernos.' },
        ],
      },
      takeaways: ['Usás um, uma, os y as.', 'Sabés que borracha es la goma de borrar.'],
      exercises: [
        ex.translationChoice(
          'borracha',
          'goma de borrar',
          ['borracho/a', 'lapicera', 'cuaderno'],
          ['pt-borracha'],
          { explanation: 'Falso amigo: borracha es la goma de borrar. «Borracho» es bêbado.' },
        ),
        ex.imageChoice('👓', 'óculos', ['chave', 'caneta', 'livro'], ['pt-oculos']),
        ex.translationChoice(
          'caderno',
          'cuaderno',
          ['libro', 'goma de borrar', 'llave'],
          ['pt-caderno'],
        ),
        ex.listenChoice(
          'os óculos',
          ['as chaves', 'os livros', 'a borracha'],
          ['pt-os', 'pt-oculos'],
        ),
        ex.fillBlank(
          'Tenho ___ borracha.',
          'Tengo una goma de borrar.',
          'uma',
          ['um', 'o', 'os'],
          ['pt-uma', 'pt-borracha', 'pt-tenho'],
          { explanation: 'Borracha es femenina: uma borracha.' },
        ),
        ex.fillBlank(
          '___ canetas',
          'las lapiceras',
          'as',
          ['os', 'a', 'o'],
          ['pt-as', 'pt-caneta'],
        ),
        ex.translateWrite(
          'Tengo dos cuadernos.',
          'Tenho dois cadernos.',
          ['pt-tenho', 'pt-dois', 'pt-caderno'],
          { acceptedAnswers: ['Eu tenho dois cadernos.'] },
        ),
        ex.translateWrite('Los anteojos', 'os óculos', ['pt-os', 'pt-oculos'], {
          explanation: 'Óculos va siempre en plural: os óculos.',
        }),
      ],
    },
    {
      title: 'As cores',
      objective: 'Nombrar los colores.',
      intro: {
        explanation:
          'Los colores van después de la palabra y concuerdan: o livro vermelho, a caneta vermelha. Azul no cambia en singular. Para las cosas, «negro» es preto.',
        examples: [
          { target: 'O livro é vermelho.', base: 'El libro es rojo.' },
          { target: 'A caneta é preta.', base: 'La lapicera es negra.' },
        ],
      },
      takeaways: ['Nombrás cinco colores.', 'Usás preto para el negro de las cosas.'],
      exercises: [
        ex.imageChoice('🔴', 'vermelho', ['azul', 'amarelo', 'preto'], ['pt-vermelho']),
        ex.imageChoice('🟡', 'amarelo', ['branco', 'vermelho', 'azul'], ['pt-amarelo']),
        ex.translationChoice('preto', 'negro', ['blanco', 'rojo', 'amarillo'], ['pt-preto']),
        ex.translationChoice('branco', 'blanco', ['negro', 'azul', 'rojo'], ['pt-branco']),
        ex.listenChoice('azul', ['amarelo', 'preto', 'branco'], ['pt-azul']),
        ex.matchPairs(
          [
            ['vermelho', 'rojo'],
            ['amarelo', 'amarillo'],
            ['preto', 'negro'],
            ['branco', 'blanco'],
          ],
          ['pt-vermelho', 'pt-amarelo', 'pt-preto', 'pt-branco'],
        ),
        ex.translateWrite('Amarillo', 'amarelo', ['pt-amarelo'], { acceptedAnswers: ['amarela'] }),
        ex.translateWrite('El libro es rojo.', 'O livro é vermelho.', [
          'pt-o',
          'pt-livro',
          'pt-vermelho',
          'pt-e-ser',
        ]),
      ],
    },
    {
      title: 'De quem é?',
      objective: 'Preguntar y decir de quién es algo.',
      intro: {
        explanation:
          'De se junta con el artículo: de + o = do, de + a = da. En Brasil los nombres suelen llevar artículo, así que se dice o livro do João, a chave da Ana. Para preguntar: de quem é?',
        examples: [
          { target: 'De quem é a caneta? É da Ana.', base: '¿De quién es la lapicera? Es de Ana.' },
          { target: 'O caderno é do João.', base: 'El cuaderno es de João.' },
        ],
      },
      takeaways: ['Preguntás de quién es algo.', 'Juntás de + o = do y de + a = da.'],
      exercises: [
        ex.translationChoice(
          'de quem é?',
          '¿de quién es?',
          ['¿qué es eso?', '¿de dónde sos?', '¿cómo te llamás?'],
          ['pt-de-quem'],
        ),
        ex.fillBlank(
          'A chave é ___ Ana.',
          'La llave es de Ana.',
          'da',
          ['do', 'dos', 'um'],
          ['pt-da', 'pt-chave'],
          { explanation: 'Ana es femenino: de + a = da.' },
        ),
        ex.fillBlank(
          'O livro é ___ João.',
          'El libro es de João.',
          'do',
          ['da', 'das', 'uma'],
          ['pt-do', 'pt-livro'],
          { explanation: 'João es masculino: de + o = do.' },
        ),
        ex.listenChoice('É do João.', ['É da Ana.', 'É um livro.', 'Sou de Recife.'], ['pt-do']),
        ex.orderWords('De quem é o caderno?', '¿De quién es el cuaderno?', [
          'pt-de-quem',
          'pt-o',
          'pt-caderno',
        ]),
        ex.matchPairs(
          [
            ['o livro do João', 'el libro de João'],
            ['a chave da Ana', 'la llave de Ana'],
            ['os óculos', 'los anteojos'],
            ['a borracha', 'la goma de borrar'],
          ],
          ['pt-do', 'pt-da', 'pt-oculos', 'pt-borracha'],
        ),
        ex.shortAnswer(
          'De quem é a caneta?',
          '¿De quién es la lapicera? (Respondé que es de Ana.)',
          'É da Ana.',
          ['A caneta é da Ana.', 'Da Ana.', 'É de Ana.'],
          ['pt-de-quem', 'pt-da', 'pt-caneta'],
        ),
        ex.translateWrite(
          'El cuaderno es de João.',
          'O caderno é do João.',
          ['pt-caderno', 'pt-do'],
          {
            acceptedAnswers: ['O caderno é de João.'],
          },
        ),
      ],
    },
    {
      title: 'Minha caneta preta',
      objective: 'Describir tus cosas con posesivo y color.',
      intro: {
        explanation:
          'Juntá todo: meu caderno branco, minha caneta preta. En plural el color también cambia: os óculos pretos, as chaves amarelas.',
        examples: [
          { target: 'Minha caneta é azul.', base: 'Mi lapicera es azul.' },
          {
            target: 'Os óculos do meu pai são pretos.',
            base: 'Los anteojos de mi papá son negros.',
          },
        ],
      },
      takeaways: [
        'Describís tus cosas con meu / minha y un color.',
        'Hacés concordar el color en plural.',
      ],
      exercises: [
        ex.fillBlank(
          'A caneta é ___.',
          'La lapicera es roja.',
          'vermelha',
          ['vermelho', 'vermelhos', 'vermelhas'],
          ['pt-vermelho', 'pt-caneta'],
          { explanation: 'Caneta es femenina y singular: vermelha.' },
        ),
        ex.fillBlank(
          'Os óculos são ___.',
          'Los anteojos son negros.',
          'pretos',
          ['preto', 'preta', 'pretas'],
          ['pt-preto', 'pt-oculos'],
          { explanation: 'Óculos es masculino plural: pretos.' },
        ),
        ex.listenChoice(
          'a chave amarela',
          ['o livro amarelo', 'a caneta branca', 'as chaves pretas'],
          ['pt-chave', 'pt-amarelo'],
        ),
        ex.translationChoice(
          'o que é isso?',
          '¿qué es eso?',
          ['¿de quién es?', '¿todo bien?', '¿y vos?'],
          ['pt-o-que-e'],
        ),
        ex.orderWords('Meu caderno é branco.', 'Mi cuaderno es blanco.', [
          'pt-meu',
          'pt-caderno',
          'pt-branco',
        ]),
        ex.fillBlank(
          '___ chave é azul.',
          'Mi llave es azul.',
          'Minha',
          ['Meu', 'Meus', 'Um'],
          ['pt-minha', 'pt-chave', 'pt-azul'],
        ),
        ex.translateWrite(
          'Mi lapicera es negra.',
          'Minha caneta é preta.',
          ['pt-minha', 'pt-caneta', 'pt-preto'],
          { acceptedAnswers: ['A minha caneta é preta.'] },
        ),
        ex.shortAnswer(
          'De que cor é o livro? 📘',
          '¿De qué color es el libro? (Respondé que es azul.)',
          'É azul.',
          ['O livro é azul.', 'Azul.'],
          ['pt-azul', 'pt-livro'],
        ),
      ],
    },
  ],
};
