# Brief for translators (it / fr) — read fully

Repo c:/Users/janog/Desktop/Polygo. You localize the support layer of an English course (A1–B1) for
speakers of your language. Read docs/EN_MULTI_SOURCE.md §2–§3 (style guide, Spanish) and look at one
reference file of the finished Brazilian Portuguese version (content/en-src/pt/a1-u01.json, and
content/en-src/pt/<one of your units>.json) to see how adaptations were done.

Input per unit: content/en-src/catalog/<unit>.json → `strings` [{id, es, kinds, en?}] (es = text for
Spanish speakers; en = the English it accompanies, given only for the correct answer/word) and
`stimuli` (comprehension texts referenced by context.* strings).
Output per unit: content/en-src/<lang>/<unit>.json =
{ "unit", "strings": {id: text for EVERY catalog id}, "accepted": {English word text: [other common
translations]}, "notes": "doubts, in Spanish" }

Rules
- Adapt, don't calque: rewrite comparisons with Spanish (tú/usted, vos, ser/estar, "como en español")
  as comparisons with YOUR language, or drop them. Explain false friends of YOUR language with English.
- English inside strings is untouched; all-English strings are returned identical.
- Same meaning as the English context; options/match pairs of one exercise must remain distinct.
- kinds: exercise.source = sentence the learner translates INTO English (must lead naturally to the
  English answer); exercise.pair = right side of a match pair (left = `en`); exercise.cue = hint in
  parentheses inside an English sentence ("Do you have a brother? (Sí, tengo uno.)" → translate only the
  cue; English cues stay identical); context.speaker = speaker label (names and English labels
  identical; Spanish labels like "Anuncio" translated); writing.* = writing tasks.
- A string whose kinds are only ["word.accepted"] that is a Spanish-only variant with no natural
  equivalent may be "" (dropped).
- Keep emoji, "…", "___", numbers, names and places.
- Validate: `npx tsx scripts/en-src-check.ts <lang> <your units>` until 0 problems (the "sin traducir"
  count refers to other agents' units). Heuristic false positives: reword if possible, else report.
- Edit ONLY content/en-src/<lang>/<your units>.json. Don't use shared scratchpad file names (make a
  subfolder named after your units).
- Report: per-unit counts, validator result, 5 key adaptation choices, source problems.

## Italian (it)
Standard Italian, informal «tu», friendly app tone, quotes “ ”. Generated-instruction wording:
"Traduci in inglese", "Completa la frase", "Ascolta e scegli quello che senti", "Abbina ogni parola al
suo significato", "Metti le parole in ordine", "Scrivi la parola completa", "Che cosa significa “X”?",
"Rispondi in inglese", "Leggi e rispondi", "Ascolta e rispondi", "Ripasso", "Che cosa mostra
l’immagine?". False friends to watch: library ≠ libreria, actually ≠ attualmente, eventually ≠
eventualmente, sensible ≠ sensibile, parents ≠ parenti, factory ≠ fattoria, camera ≠ camera, argument,
educated, preservative, fabric, morbid, pretend, college. Italian also has essere/stare: compare
naturally. Present perfect vs passato prossimo is a key trap for Italians (Italians use passato
prossimo for finished past: "Ieri ho mangiato" → "Yesterday I ate").

## French (fr)
French of France, informal «tu», friendly app tone. Typography: guillemets « » with a non-breaking
space (U+00A0) inside, and U+00A0 before ? ! : ; %. Generated-instruction wording: "Traduis en
anglais", "Complète la phrase", "Écoute et choisis ce que tu entends", "Associe chaque mot à sa
signification", "Remets les mots dans l’ordre", "Écris le mot en entier", "Que veut dire « X » ?",
"Réponds en anglais", "Lis et réponds", "Écoute et réponds", "Révision", "Que montre l’image ?". False
friends: actually ≠ actuellement, library ≠ librairie, eventually ≠ éventuellement, sensible ≠ sensible,
attend ≠ attendre, college ≠ collège, deception ≠ déception, coin ≠ coin, pain, assist, rest ≠ rester,
journey ≠ journée, sympathetic ≠ sympathique. Passé composé vs present perfect is a key trap ("Hier j’ai
mangé" → "Yesterday I ate"). Note: the French "y" (il y a) is fine.
