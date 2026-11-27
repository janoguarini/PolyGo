/**
 * Voces neurales: junta todo lo que la app dice en voz alta, lo sintetiza con Google Cloud
 * Text-to-Speech (Chirp 3: HD) y lo sube al bucket público `tts` de Supabase. Contrato: shared/tts.ts.
 *
 *   npm run tts -- --dry-run            cuenta textos y caracteres (no llama a nadie)
 *   npm run tts -- --generate           genera los MP3 que falten en build/tts/ (GOOGLE_TTS_API_KEY)
 *   npm run tts -- --upload             sube build/tts/ a Supabase (SUPABASE_SERVICE_ROLE_KEY)
 *   Opciones: --lang=en,it  sólo esos idiomas · --limit=20  como mucho N audios nuevos por idioma
 *
 * Es incremental: nunca vuelve a generar un audio que ya está en build/tts/ ni a subir uno que ya
 * está en el bucket. El manifest de cada idioma lista sólo lo que de verdad se generó.
 * Las claves se leen de .env (el script npm lo carga con --env-file); nunca van en la app.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

import { CURRICULUM_PATH, type PathUnit } from '../content';
import { A2_EXPANSION_PATH } from '../content/a2-expansion';
import { B1_PATH } from '../content/b1';
import { B2_PATH } from '../content/b2';
import { COMPREHENSION_PATH, ITEM_REGISTRY_PATH } from '../content/comprehension';
import { ES_B1_PATH, ES_PATH } from '../content/es-course';
import { FR_PATH } from '../content/fr-course';
import { IT_PATH } from '../content/it-course';
import {
  TTS_BUCKET,
  TTS_MANIFEST_VERSION,
  TTS_VOICES,
  spokenText,
  ttsClipPath,
  ttsInput,
  ttsKey,
  ttsManifestPath,
  type TtsManifest,
  type TtsSlot,
} from '../shared/tts';

const OUT = join(process.cwd(), 'build', 'tts');
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const onlyLangs = option('lang')?.split(',').filter(Boolean);
const limit = option('limit') ? Number(option('limit')) : Infinity;

/**
 * Todo el contenido de los cursos (cada tramo se publicó con su propio generador de SQL). Un texto que
 * esté en varios tramos se genera una sola vez.
 */
const ALL_PATHS: readonly PathUnit[] = [
  ...CURRICULUM_PATH,
  ...A2_EXPANSION_PATH,
  ...COMPREHENSION_PATH,
  ...ITEM_REGISTRY_PATH,
  ...IT_PATH,
  ...FR_PATH,
  ...ES_PATH,
  ...ES_B1_PATH,
  ...B1_PATH,
  ...B2_PATH,
];

interface Clip {
  language: string;
  slot: TtsSlot;
  key: string;
  text: string;
}

/** Todo lo que la app pronuncia, por idioma y hablante (sin repetir). */
export function collectClips(): Clip[] {
  const clips = new Map<string, Clip>();
  const add = (language: string, slot: TtsSlot, raw: string | null | undefined) => {
    if (!raw || !TTS_VOICES[language]) return;
    const text = spokenText(raw);
    if (!text) return;
    const key = ttsKey(text);
    clips.set(`${language}/${slot}/${key}`, { language, slot, key, text });
  };

  for (const { language, unit, lessons } of ALL_PATHS) {
    // Palabras: «escuchar» en el feedback, la palabra del día y las preguntas de audio de Ranked.
    for (const w of unit.words) add(language, 'a', w.text);
    for (const lesson of lessons) {
      for (const e of lesson.exercises) {
        const p = e.payload;
        if (p.type === 'translation_choice') add(language, 'a', p.word);
        if (p.type === 'listen_choice') add(language, 'a', p.audioText);
        if (p.type === 'short_answer') add(language, 'a', p.question);
        if (p.type === 'match_pairs') for (const pair of p.pairs) add(language, 'a', pair.left);
        if (p.type === 'context_choice' && p.stimulus.kind === 'listening') {
          const voiceOf = new Map(p.stimulus.speakers.map((s) => [s.name, s.voice]));
          for (const line of p.stimulus.lines) {
            add(language, voiceOf.get(line.speaker) ?? 'a', line.text);
          }
        }
        // La respuesta correcta se puede escuchar en el resumen (salvo si está en español).
        if (e.type !== 'translation_choice' && e.type !== 'context_choice') {
          add(language, 'a', e.answer);
          for (const alt of e.acceptedAnswers ?? []) add(language, 'a', alt);
        }
      }
    }
  }
  return [...clips.values()].filter((c) => !onlyLangs || onlyLangs.includes(c.language));
}

const localPath = (c: Clip) =>
  join(OUT, ttsClipPath(c.language, TTS_VOICES[c.language]!.voices[c.slot], c.key));

function report(clips: Clip[]) {
  const byLang = new Map<string, { a: number; b: number; chars: number; pending: number }>();
  for (const c of clips) {
    const r = byLang.get(c.language) ?? { a: 0, b: 0, chars: 0, pending: 0 };
    r[c.slot]++;
    const exists = existsSync(localPath(c));
    if (!exists) {
      r.pending++;
      r.chars += ttsInput(c.text).length;
    }
    byLang.set(c.language, r);
  }
  let total = 0;
  console.log('idioma  voz a  voz b  por generar  caracteres por generar');
  for (const [lang, r] of [...byLang].sort()) {
    total += r.chars;
    console.log(
      `${lang.padEnd(6)}  ${String(r.a).padStart(5)}  ${String(r.b).padStart(5)}  ${String(r.pending).padStart(11)}  ${String(r.chars).padStart(10)}`,
    );
  }
  console.log(`Total de caracteres por generar: ${total.toLocaleString('es')}`);
}

// ---------- Google Cloud Text-to-Speech ----------

const GOOGLE = 'https://texttospeech.googleapis.com/v1';

async function checkVoices(key: string, languages: string[]) {
  for (const lang of languages) {
    const cfg = TTS_VOICES[lang]!;
    const res = await fetch(`${GOOGLE}/voices?languageCode=${cfg.googleLocale}&key=${key}`);
    if (!res.ok) throw new Error(`voices.list ${lang}: HTTP ${res.status} ${await res.text()}`);
    const names = new Set(((await res.json()).voices ?? []).map((v: { name: string }) => v.name));
    for (const name of Object.values(cfg.voices)) {
      if (!names.has(name)) {
        const chirp = [...names].filter((n) => String(n).includes('Chirp3-HD')).join(', ');
        throw new Error(`La voz ${name} no existe en ${cfg.googleLocale}. Disponibles: ${chirp}`);
      }
    }
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function synthesize(key: string, c: Clip): Promise<Buffer> {
  const cfg = TTS_VOICES[c.language]!;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${GOOGLE}/text:synthesize?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: ttsInput(c.text) },
        voice: { languageCode: cfg.googleLocale, name: cfg.voices[c.slot] },
        audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000 },
      }),
    });
    if (res.ok) return Buffer.from((await res.json()).audioContent, 'base64');
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    throw new Error(
      `synthesize «${c.text}» (${c.language}/${c.slot}): HTTP ${res.status} ${await res.text()}`,
    );
  }
}

async function pool<T>(items: T[], size: number, run: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) await run(items[next++]!);
    }),
  );
}

function writeManifests(clips: Clip[]) {
  const languages = [...new Set(clips.map((c) => c.language))];
  for (const language of languages) {
    const cfg = TTS_VOICES[language]!;
    const generated = clips.filter((c) => c.language === language && existsSync(localPath(c)));
    const manifest: TtsManifest = {
      version: TTS_MANIFEST_VERSION,
      language,
      voices: cfg.voices,
      keys: {
        a: generated
          .filter((c) => c.slot === 'a')
          .map((c) => c.key)
          .sort(),
        b: generated
          .filter((c) => c.slot === 'b')
          .map((c) => c.key)
          .sort(),
      },
    };
    const path = join(OUT, ttsManifestPath(language));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(manifest));
    console.log(
      `manifest ${language}: ${manifest.keys.a.length} + ${manifest.keys.b.length} audios`,
    );
  }
}

async function generate(clips: Clip[]) {
  const key = process.env.GOOGLE_TTS_API_KEY?.trim();
  if (!key) throw new Error('Falta GOOGLE_TTS_API_KEY en .env');
  const languages = [...new Set(clips.map((c) => c.language))];
  await checkVoices(key, languages);
  const pending = languages.flatMap((lang) =>
    clips.filter((c) => c.language === lang && !existsSync(localPath(c))).slice(0, limit),
  );
  console.log(`Generando ${pending.length} audios…`);
  let done = 0;
  await pool(pending, 4, async (c) => {
    const mp3 = await synthesize(key, c);
    const path = localPath(c);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, mp3);
    if (++done % 100 === 0) console.log(`  ${done}/${pending.length}`);
  });
  writeManifests(clips);
}

// ---------- Supabase Storage ----------

function filesUnder(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesUnder(full) : [full];
  });
}

async function upload() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !service)
    throw new Error('Faltan EXPO_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  const all = filesUnder(OUT)
    .map((f) => relative(OUT, f).split('\\').join('/'))
    // Sólo audios y manifest de los idiomas del curso (nada de pruebas ni páginas sueltas).
    .filter((p) => /^[a-z]{2}\/(manifest\.json|[A-Za-z0-9-]+\/[0-9a-f]{14}\.mp3)$/.test(p))
    .filter((p) => Boolean(TTS_VOICES[p.split('/')[0]!]))
    .filter((p) => !onlyLangs || onlyLangs.includes(p.split('/')[0]!));
  // Los audios primero; los manifest al final (así nunca listan un audio que todavía no está).
  const clips = all.filter((p) => p.endsWith('.mp3'));
  const manifests = all.filter((p) => p.endsWith('manifest.json'));
  let uploaded = 0;
  let skipped = 0;
  const put = async (path: string, upsert: boolean) => {
    const isManifest = path.endsWith('.json');
    const res = await fetch(`${url}/storage/v1/object/${TTS_BUCKET}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${service}`,
        apikey: service,
        'Content-Type': isManifest ? 'application/json' : 'audio/mpeg',
        // Un audio nunca cambia (la ruta lleva la voz y el hash del texto); el índice sí.
        'Cache-Control': isManifest ? 'max-age=300' : 'max-age=31536000, immutable',
        'x-upsert': upsert ? 'true' : 'false',
      },
      body: readFileSync(join(OUT, path)),
    });
    if (res.ok) uploaded++;
    else if (
      !upsert &&
      (res.status === 409 || res.status === 400) &&
      /exists|Duplicate/i.test(await res.text())
    )
      skipped++;
    else throw new Error(`upload ${path}: HTTP ${res.status} ${await res.text()}`);
  };
  console.log(`Subiendo ${clips.length} audios y ${manifests.length} índices…`);
  await pool(clips, 8, (p) => put(p, false));
  await pool(manifests, 2, (p) => put(p, true));
  console.log(`Listo: ${uploaded} subidos, ${skipped} ya estaban.`);
}

async function main() {
  const clips = collectClips();
  if (flag('generate')) await generate(clips);
  if (flag('upload')) await upload();
  if (!flag('generate') && !flag('upload')) report(clips);
}

if (process.argv[1] && /build-tts/.test(process.argv[1])) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
