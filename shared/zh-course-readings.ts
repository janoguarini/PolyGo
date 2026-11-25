/**
 * Pinyin de lo que el chino A1 U13–U16 y A2 (docs/ZH_A1_A2.md) usa sin ser vocabulario practicado:
 * nombres de personajes y vocabulario de apoyo (`support` de cada unidad, content/zh-course.ts).
 * Se suma a EXTRA_READINGS (shared/readings.ts) para que la app muestre el pinyin encima.
 *
 * Reglas (content/zh-checks.ts y content/__tests__/zh.test.ts):
 * - Cada entrada es usada por alguna unidad (como apoyo o nombre).
 * - Ninguna cambia cómo se segmenta el contenido ya cargado (el piloto zh A1 U1–U12).
 * - El pinyin tiene una sílaba por carácter y es coherente con el resto del curso.
 */
export const ZH_COURSE_READINGS: Readonly<Record<string, string>> = {
  // Nombres de personajes.
  李华: 'Lǐ Huá',
  张丽: 'Zhāng Lì',
  安娜: 'Ānnà',
  陈: 'Chén',
  // A1 U13.
  大家: 'dàjiā',
  大学生: 'dàxuéshēng',
  // A1 U14.
  可是: 'kěshì',
  // A1 U15.
  吃饭: 'chīfàn',
  不太: 'bú tài',
  和: 'hé',
  // A1 U16.
  请问: 'qǐngwèn',
  左: 'zuǒ',
  右: 'yòu',
  // A2 U1.
  好玩: 'hǎowán',
  // A2 U2.
  多: 'duō',
  什么时候: 'shénme shíhou',
  张: 'zhāng',
  // A2 U3.
  还: 'hái',
  别的: 'biéde',
  // A2 U6.
  有没有: 'yǒu méiyǒu',
  空: 'kòng',
  // A2 U7.
  字: 'zì',
  快: 'kuài',
  学: 'xué',
  跑: 'pǎo',
  // A2 U8.
  条: 'tiáo',
  百: 'bǎi',
  打: 'dǎ',
  折: 'zhé',
  // A2 U9.
  这样: 'zhèyàng',
  电: 'diàn',
  // A2 U10.
  奶奶: 'nǎinai',
  // A2 U11.
  老家: 'lǎojiā',
  月亮: 'yuèliang',
  钟: 'zhōng',
  // A2 U12.
  问: 'wèn',
  知道: 'zhīdao',
};
