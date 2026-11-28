-- =====================================================================
-- Ranked compartido (docs/RANKED_SHARED_POOL.md): la consigna de cada frase del banco de Word Rush en
-- el idioma de apoyo de cada curso que no es el canónico (en-from-pt/it/fr). El inglés, las fichas y
-- las respuestas siguen en public.word_rush_sentences: esto sólo agrega textos de apoyo.
-- GENERADO por scripts/build-word-rush-translations-sql.ts desde content/word-rush/en-support.ts: no
-- editar a mano. LOCAL: NO APLICADA. Requiere supabase/pending/20261227120000_word_rush_bank.sql y
-- 20261227120100_word_rush_bank_data.sql (aplicadas en producción).
-- Filas: 402 (134 frases × pt, it, fr).
-- Acceso: como el banco, sólo el servidor de partidas (service_role, select). Idempotente; no borra.
-- Rollback: supabase/rollback/20270110120100_word_rush_sentence_translations.down.sql.
-- Pruebas: supabase/tests/rankedSharedPool.test.mjs.
-- =====================================================================

do $$
begin
  if to_regclass('public.word_rush_sentences') is null then
    raise exception 'word_rush_sentence_translations: falta la migración 20261227120000_word_rush_bank';
  end if;
end;
$$;

create table if not exists public.word_rush_sentence_translations (
  sentence_id text not null references public.word_rush_sentences (id) on delete cascade,
  -- Idioma de apoyo del curso (courses.source_language): pt, it, fr…
  source_language text not null references public.languages (code),
  translation text not null check (btrim(translation) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (sentence_id, source_language)
);

create index if not exists word_rush_sentence_translations_source_idx
  on public.word_rush_sentence_translations (source_language);

-- La consigna va en otro idioma que la frase (nunca «inglés para el inglés»).
create or replace function public.word_rush_sentence_translations_check()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (select 1 from public.word_rush_sentences s
             where s.id = new.sentence_id and s.language_code = new.source_language) then
    raise exception 'word_rush_sentence_translations %: la consigna no puede estar en el idioma de la frase (%)',
      new.sentence_id, new.source_language using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
revoke all on function public.word_rush_sentence_translations_check() from public, anon, authenticated;

drop trigger if exists word_rush_sentence_translations_check on public.word_rush_sentence_translations;
create trigger word_rush_sentence_translations_check
  before insert or update on public.word_rush_sentence_translations
  for each row execute function public.word_rush_sentence_translations_check();

drop trigger if exists word_rush_sentence_translations_updated_at on public.word_rush_sentence_translations;
create trigger word_rush_sentence_translations_updated_at
  before update on public.word_rush_sentence_translations
  for each row execute function public.set_updated_at();

alter table public.word_rush_sentence_translations enable row level security;
revoke all on public.word_rush_sentence_translations from public, anon, authenticated;
revoke all on public.word_rush_sentence_translations from service_role;
grant select on public.word_rush_sentence_translations to service_role;

insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-is-your-name-tom', 'pt', 'Seu nome é Tom?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-is-your-name-tom', 'it', 'Ti chiami Tom?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-is-your-name-tom', 'fr', 'Tu t’appelles Tom ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-hi-how-are-you', 'pt', 'Oi, como você está?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-hi-how-are-you', 'it', 'Ciao, come stai?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-hi-how-are-you', 'fr', 'Salut, comment ça va ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-excuse-me-are-you-ana', 'pt', 'Com licença, você é a Ana?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-excuse-me-are-you-ana', 'it', 'Scusa, sei Ana?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-excuse-me-are-you-ana', 'fr', 'Excuse-moi, tu es Ana ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-good-morning-tom', 'pt', 'Bom dia, Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-good-morning-tom', 'it', 'Buongiorno, Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-good-morning-tom', 'fr', 'Bonjour, Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-yes-i-am-tom', 'pt', 'Sim, eu sou o Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-yes-i-am-tom', 'it', 'Sì, sono Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-yes-i-am-tom', 'fr', 'Oui, je suis Tom.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-no-my-name-is-ana', 'pt', 'Não, meu nome é Ana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-no-my-name-is-ana', 'it', 'No, mi chiamo Ana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u01-no-my-name-is-ana', 'fr', 'Non, je m’appelle Ana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-friends', 'pt', 'Nós somos amigos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-friends', 'it', 'Siamo amici.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-friends', 'fr', 'Nous sommes amis.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-not-tired', 'pt', 'Eles não estão cansados.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-not-tired', 'it', 'Loro non sono stanchi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-not-tired', 'fr', 'Ils ne sont pas fatigués.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-she-your-teacher', 'pt', 'Ela é sua professora?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-she-your-teacher', 'it', 'Lei è la tua insegnante?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-she-your-teacher', 'fr', 'C’est ta professeure ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-you-tired', 'pt', 'Você está cansado?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-you-tired', 'it', 'Sei stanco?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-you-tired', 'fr', 'Tu es fatigué ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-he-is-not-happy', 'pt', 'Ele não está feliz.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-he-is-not-happy', 'it', 'Lui non è felice.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-he-is-not-happy', 'fr', 'Il n’est pas content.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-students', 'pt', 'Nós somos estudantes.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-students', 'it', 'Siamo studenti.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-we-are-students', 'fr', 'Nous sommes étudiants.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-he-your-friend', 'pt', 'Ele é seu amigo?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-he-your-friend', 'it', 'Lui è tuo amico?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-is-he-your-friend', 'fr', 'C’est ton ami ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-you-are-my-friend', 'pt', 'Você é meu amigo.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-you-are-my-friend', 'it', 'Sei mio amico.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-you-are-my-friend', 'fr', 'Tu es mon ami.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-teachers', 'pt', 'Eles são professores.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-teachers', 'it', 'Loro sono insegnanti.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-they-are-teachers', 'fr', 'Ils sont professeurs.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-they-students', 'pt', 'Eles são estudantes?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-they-students', 'it', 'Loro sono studenti?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-are-they-students', 'fr', 'Ils sont étudiants ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-ana-is-tired', 'pt', 'A Ana está cansada.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-ana-is-tired', 'it', 'Ana è stanca.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-ana-is-tired', 'fr', 'Ana est fatiguée.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-tom-is-not-my-teacher', 'pt', 'O Tom não é meu professor.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-tom-is-not-my-teacher', 'it', 'Tom non è il mio insegnante.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u02-tom-is-not-my-teacher', 'fr', 'Tom n’est pas mon professeur.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-he-is-from-mexico', 'pt', 'Ele é do México.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-he-is-from-mexico', 'it', 'Lui è del Messico.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-he-is-from-mexico', 'fr', 'Il vient du Mexique.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-is-ana-from', 'pt', 'De onde a Ana é?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-is-ana-from', 'it', 'Di dov’è Ana?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-is-ana-from', 'fr', 'D’où vient Ana ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-my-friend-is-from-england', 'pt', 'Meu amigo é da Inglaterra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-my-friend-is-from-england', 'it', 'Il mio amico è dell’Inghilterra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-my-friend-is-from-england', 'fr', 'Mon ami vient d’Angleterre.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-we-are-from-the-us', 'pt', 'Nós somos dos Estados Unidos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-we-are-from-the-us', 'it', 'Siamo degli Stati Uniti.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-we-are-from-the-us', 'fr', 'Nous venons des États-Unis.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-are-you-from-spain', 'pt', 'Você é da Espanha?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-are-you-from-spain', 'it', 'Sei della Spagna?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-are-you-from-spain', 'fr', 'Tu viens d’Espagne ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-she-is-eleven', 'pt', 'Ela tem onze anos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-she-is-eleven', 'it', 'Lei ha undici anni.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-she-is-eleven', 'fr', 'Elle a onze ans.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-how-old-is-your-teacher', 'pt', 'Quantos anos tem o seu professor?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-how-old-is-your-teacher', 'it', 'Quanti anni ha il tuo insegnante?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-how-old-is-your-teacher', 'fr', 'Quel âge a ton professeur ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-tom-is-fifteen', 'pt', 'O Tom tem quinze.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-tom-is-fifteen', 'it', 'Tom ne ha quindici.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-tom-is-fifteen', 'fr', 'Tom a quinze ans.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-are-they-from', 'pt', 'De onde eles são?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-are-they-from', 'it', 'Di dove sono loro?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-where-are-they-from', 'fr', 'D’où viennent-ils ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-im-not-from-argentina', 'pt', 'Eu não sou da Argentina.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-im-not-from-argentina', 'it', 'Non sono dell’Argentina.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-im-not-from-argentina', 'fr', 'Je ne viens pas d’Argentine.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-is-she-twelve', 'pt', 'Ela tem doze anos?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-is-she-twelve', 'it', 'Lei ha dodici anni?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u03-is-she-twelve', 'fr', 'Elle a douze ans ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-sister-is-ten', 'pt', 'Minha irmã tem dez anos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-sister-is-ten', 'it', 'Mia sorella ha dieci anni.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-sister-is-ten', 'fr', 'Ma sœur a dix ans.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-who-is-your-teacher', 'pt', 'Quem é o seu professor?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-who-is-your-teacher', 'it', 'Chi è il tuo insegnante?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-who-is-your-teacher', 'fr', 'Qui est ton professeur ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-their-mother-is-a-teacher', 'pt', 'A mãe deles é professora.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-their-mother-is-a-teacher', 'it', 'La loro madre è insegnante.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-their-mother-is-a-teacher', 'fr', 'Leur mère est professeure.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-i-have-a-sister', 'pt', 'Eu tenho uma irmã.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-i-have-a-sister', 'it', 'Ho una sorella.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-i-have-a-sister', 'fr', 'J’ai une sœur.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-our-grandfather-is-from-spain', 'pt', 'Nosso avô é da Espanha.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-our-grandfather-is-from-spain', 'it', 'Nostro nonno è della Spagna.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-our-grandfather-is-from-spain', 'fr', 'Notre grand-père vient d’Espagne.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-his-sister-is-a-student', 'pt', 'A irmã dele é estudante.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-his-sister-is-a-student', 'it', 'Sua sorella è una studentessa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-his-sister-is-a-student', 'fr', 'Sa sœur est étudiante.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-they-have-a-baby', 'pt', 'Eles têm um bebê.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-they-have-a-baby', 'it', 'Loro hanno un bambino.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-they-have-a-baby', 'fr', 'Ils ont un bébé.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-grandmother-is-from-mexico', 'pt', 'Minha avó é do México.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-grandmother-is-from-mexico', 'it', 'Mia nonna è del Messico.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-grandmother-is-from-mexico', 'fr', 'Ma grand-mère vient du Mexique.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-girl-is-six', 'pt', 'A menina tem seis anos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-girl-is-six', 'it', 'La bambina ha sei anni.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-girl-is-six', 'fr', 'La fille a six ans.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-is-your-father-a-teacher', 'pt', 'Seu pai é professor?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-is-your-father-a-teacher', 'it', 'Tuo padre è insegnante?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-is-your-father-a-teacher', 'fr', 'Ton père est professeur ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-parents-are-tired', 'pt', 'Meus pais estão cansados.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-parents-are-tired', 'it', 'I miei genitori sono stanchi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-my-parents-are-tired', 'fr', 'Mes parents sont fatigués.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-boy-is-not-my-brother', 'pt', 'O menino não é meu irmão.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-boy-is-not-my-brother', 'it', 'Il ragazzo non è mio fratello.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u04-the-boy-is-not-my-brother', 'fr', 'Le garçon n’est pas mon frère.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-is-this-your-phone', 'pt', 'Este é o seu celular?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-is-this-your-phone', 'it', 'Questo è il tuo telefono?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-is-this-your-phone', 'fr', 'C’est ton téléphone ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-bag-is-big', 'pt', 'Aquela bolsa é grande.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-bag-is-big', 'it', 'Quella borsa è grande.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-bag-is-big', 'fr', 'Ce sac-là est grand.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-i-have-a-blue-pen', 'pt', 'Eu tenho uma caneta azul.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-i-have-a-blue-pen', 'it', 'Ho una penna blu.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-i-have-a-blue-pen', 'fr', 'J’ai un stylo bleu.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-these-are-not-my-keys', 'pt', 'Estas não são as minhas chaves.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-these-are-not-my-keys', 'it', 'Queste non sono le mie chiavi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-these-are-not-my-keys', 'fr', 'Ce ne sont pas mes clés.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-my-computer-is-small', 'pt', 'Meu computador é pequeno.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-my-computer-is-small', 'it', 'Il mio computer è piccolo.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-my-computer-is-small', 'fr', 'Mon ordinateur est petit.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-is-my-phone', 'pt', 'Onde está o meu celular?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-is-my-phone', 'it', 'Dov’è il mio telefono?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-is-my-phone', 'fr', 'Où est mon téléphone ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-her-bag-is-green', 'pt', 'A bolsa dela é verde.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-her-bag-is-green', 'it', 'La sua borsa è verde.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-her-bag-is-green', 'fr', 'Son sac est vert.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-those-books-are-red', 'pt', 'Aqueles livros são vermelhos.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-those-books-are-red', 'it', 'Quei libri sono rossi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-those-books-are-red', 'fr', 'Ces livres-là sont rouges.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-this-is-an-old-phone', 'pt', 'Este é um celular velho.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-this-is-an-old-phone', 'it', 'Questo è un telefono vecchio.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-this-is-an-old-phone', 'fr', 'C’est un vieux téléphone.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-are-my-keys', 'pt', 'Onde estão as minhas chaves?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-are-my-keys', 'it', 'Dove sono le mie chiavi?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-where-are-my-keys', 'fr', 'Où sont mes clés ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-is-not-my-pen', 'pt', 'Aquela não é a minha caneta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-is-not-my-pen', 'it', 'Quella non è la mia penna.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-that-is-not-my-pen', 'fr', 'Ce n’est pas mon stylo.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-he-has-a-black-computer', 'pt', 'Ele tem um computador preto.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-he-has-a-black-computer', 'it', 'Lui ha un computer nero.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u05-he-has-a-black-computer', 'fr', 'Il a un ordinateur noir.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-bed-is-under-the-window', 'pt', 'Minha cama fica embaixo da janela.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-bed-is-under-the-window', 'it', 'Il mio letto è sotto la finestra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-bed-is-under-the-window', 'fr', 'Mon lit est sous la fenêtre.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-there-a-garden', 'pt', 'Tem um jardim?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-there-a-garden', 'it', 'C’è un giardino?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-there-a-garden', 'fr', 'Il y a un jardin ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-two-bathrooms', 'pt', 'Tem dois banheiros.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-two-bathrooms', 'it', 'Ci sono due bagni.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-two-bathrooms', 'fr', 'Il y a deux salles de bains.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-sofa-is-green', 'pt', 'O sofá é verde.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-sofa-is-green', 'it', 'Il divano è verde.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-sofa-is-green', 'fr', 'Le canapé est vert.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-their-apartment-is-big', 'pt', 'O apartamento deles é grande.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-their-apartment-is-big', 'it', 'Il loro appartamento è grande.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-their-apartment-is-big', 'fr', 'Leur appartement est grand.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-book-is-on-the-table', 'pt', 'O livro está em cima da mesa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-book-is-on-the-table', 'it', 'Il libro è sul tavolo.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-book-is-on-the-table', 'fr', 'Le livre est sur la table.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-where-is-the-kitchen', 'pt', 'Onde fica a cozinha?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-where-is-the-kitchen', 'it', 'Dov’è la cucina?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-where-is-the-kitchen', 'fr', 'Où est la cuisine ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-is-no-door', 'pt', 'Não tem porta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-is-no-door', 'it', 'Non c’è una porta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-is-no-door', 'fr', 'Il n’y a pas de porte.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-phone-is-on-the-sofa', 'pt', 'Meu celular está no sofá.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-phone-is-on-the-sofa', 'it', 'Il mio telefono è sul divano.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-my-phone-is-on-the-sofa', 'fr', 'Mon téléphone est sur le canapé.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-living-room-has-two-windows', 'pt', 'A sala tem duas janelas.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-living-room-has-two-windows', 'it', 'Il soggiorno ha due finestre.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-the-living-room-has-two-windows', 'fr', 'Le salon a deux fenêtres.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-the-bathroom-big', 'pt', 'O banheiro é grande?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-the-bathroom-big', 'it', 'Il bagno è grande?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-is-the-bathroom-big', 'fr', 'La salle de bains est grande ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-four-chairs', 'pt', 'Tem quatro cadeiras.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-four-chairs', 'it', 'Ci sono quattro sedie.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u06-there-are-four-chairs', 'fr', 'Il y a quatre chaises.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-am-hungry', 'pt', 'Estou com fome.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-am-hungry', 'it', 'Ho fame.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-am-hungry', 'fr', 'J’ai faim.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-are-they-thirsty', 'pt', 'Eles estão com sede?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-are-they-thirsty', 'it', 'Loro hanno sete?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-are-they-thirsty', 'fr', 'Ils ont soif ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-want-a-coffee-please', 'pt', 'Eu quero um café, por favor.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-want-a-coffee-please', 'it', 'Voglio un caffè, per favore.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-i-want-a-coffee-please', 'fr', 'Je veux un café, s’il te plaît.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-we-want-three-apples', 'pt', 'Nós queremos três maçãs.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-we-want-three-apples', 'it', 'Vogliamo tre mele.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-we-want-three-apples', 'fr', 'Nous voulons trois pommes.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-dinner-is-on-the-table', 'pt', 'O jantar está na mesa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-dinner-is-on-the-table', 'it', 'La cena è in tavola.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-dinner-is-on-the-table', 'fr', 'Le dîner est sur la table.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-baby-drinks-milk', 'pt', 'O bebê toma leite.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-baby-drinks-milk', 'it', 'Il bambino beve latte.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-baby-drinks-milk', 'fr', 'Le bébé boit du lait.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-she-wants-an-apple', 'pt', 'Ela quer uma maçã.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-she-wants-an-apple', 'it', 'Lei vuole una mela.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-she-wants-an-apple', 'fr', 'Elle veut une pomme.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-milk-is-in-the-kitchen', 'pt', 'O leite está na cozinha.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-milk-is-in-the-kitchen', 'it', 'Il latte è in cucina.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-the-milk-is-in-the-kitchen', 'fr', 'Le lait est dans la cuisine.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-this-cheese-is-good', 'pt', 'Este queijo é gostoso.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-this-cheese-is-good', 'it', 'Questo formaggio è buono.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-this-cheese-is-good', 'fr', 'Ce fromage est bon.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-my-sister-drinks-juice', 'pt', 'Minha irmã toma suco.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-my-sister-drinks-juice', 'it', 'Mia sorella beve succo.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u07-my-sister-drinks-juice', 'fr', 'Ma sœur boit du jus.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-go-to-work-every-day', 'pt', 'Eu vou trabalhar todos os dias.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-go-to-work-every-day', 'it', 'Vado al lavoro ogni giorno.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-go-to-work-every-day', 'fr', 'Je vais au travail tous les jours.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-she-lives-in-spain', 'pt', 'Ela mora na Espanha.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-she-lives-in-spain', 'it', 'Lei vive in Spagna.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-she-lives-in-spain', 'fr', 'Elle habite en Espagne.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-you-work-at-home', 'pt', 'Você trabalha em casa?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-you-work-at-home', 'it', 'Lavori a casa?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-you-work-at-home', 'fr', 'Tu travailles à la maison ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-never-drinks-coffee', 'pt', 'Ele nunca toma café.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-never-drinks-coffee', 'it', 'Lui non beve mai caffè.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-never-drinks-coffee', 'fr', 'Il ne boit jamais de café.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-they-play-in-the-garden', 'pt', 'Eles brincam no jardim.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-they-play-in-the-garden', 'it', 'Loro giocano in giardino.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-they-play-in-the-garden', 'fr', 'Ils jouent dans le jardin.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-does-she-read-every-day', 'pt', 'Ela lê todos os dias?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-does-she-read-every-day', 'it', 'Lei legge ogni giorno?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-does-she-read-every-day', 'fr', 'Elle lit tous les jours ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-wake-up-at-seven', 'pt', 'Eu acordo às sete.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-wake-up-at-seven', 'it', 'Mi sveglio alle sette.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-wake-up-at-seven', 'fr', 'Je me réveille à sept heures.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-doesnt-live-in-england', 'pt', 'Ele não mora na Inglaterra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-doesnt-live-in-england', 'it', 'Lui non vive in Inghilterra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-he-doesnt-live-in-england', 'fr', 'Il n’habite pas en Angleterre.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-where-do-you-live', 'pt', 'Onde você mora?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-where-do-you-live', 'it', 'Dove vivi?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-where-do-you-live', 'fr', 'Où est-ce que tu habites ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-usually-read-at-home', 'pt', 'Eu normalmente leio em casa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-usually-read-at-home', 'it', 'Di solito leggo a casa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-i-usually-read-at-home', 'fr', 'D’habitude, je lis à la maison.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-they-go-to-school', 'pt', 'Eles vão à escola?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-they-go-to-school', 'it', 'Loro vanno a scuola?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u08-do-they-go-to-school', 'fr', 'Ils vont à l’école ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-is-it', 'pt', 'Que horas são?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-is-it', 'it', 'Che ore sono?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-is-it', 'fr', 'Quelle heure est-il ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-study-in-the-afternoon', 'pt', 'Eu estudo à tarde.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-study-in-the-afternoon', 'it', 'Studio il pomeriggio.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-study-in-the-afternoon', 'fr', 'J’étudie l’après-midi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-see-you-on-friday', 'pt', 'Até sexta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-see-you-on-friday', 'it', 'Ci vediamo venerdì.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-see-you-on-friday', 'fr', 'À vendredi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-is-today-tuesday', 'pt', 'Hoje é terça?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-is-today-tuesday', 'it', 'Oggi è martedì?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-is-today-tuesday', 'fr', 'C’est mardi aujourd’hui ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-work-on-saturday-morning', 'pt', 'Eu trabalho no sábado de manhã.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-work-on-saturday-morning', 'it', 'Lavoro sabato mattina.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-work-on-saturday-morning', 'fr', 'Je travaille samedi matin.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-they-dont-watch-tv', 'pt', 'Eles não assistem TV.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-they-dont-watch-tv', 'it', 'Loro non guardano la TV.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-they-dont-watch-tv', 'fr', 'Ils ne regardent pas la télé.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-its-half-past-seven', 'pt', 'São sete e meia.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-its-half-past-seven', 'it', 'Sono le sette e mezza.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-its-half-past-seven', 'fr', 'Il est sept heures et demie.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-do-you-eat-lunch', 'pt', 'Que horas você almoça?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-do-you-eat-lunch', 'it', 'A che ora pranzi?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-what-time-do-you-eat-lunch', 'fr', 'À quelle heure tu déjeunes ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-read-on-the-weekend', 'pt', 'Eu leio no fim de semana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-read-on-the-weekend', 'it', 'Leggo nel fine settimana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-read-on-the-weekend', 'fr', 'Je lis le week-end.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-dont-work-tomorrow', 'pt', 'Amanhã eu não trabalho.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-dont-work-tomorrow', 'it', 'Domani non lavoro.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-i-dont-work-tomorrow', 'fr', 'Demain, je ne travaille pas.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-she-gets-up-at-six', 'pt', 'Ela se levanta às seis.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-she-gets-up-at-six', 'it', 'Lei si alza alle sei.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u09-she-gets-up-at-six', 'fr', 'Elle se lève à six heures.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bank-is-on-the-left', 'pt', 'O banco fica à esquerda.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bank-is-on-the-left', 'it', 'La banca è a sinistra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bank-is-on-the-left', 'fr', 'La banque est à gauche.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-is-the-hospital-far', 'pt', 'O hospital fica longe?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-is-the-hospital-far', 'it', 'L’ospedale è lontano?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-is-the-hospital-far', 'fr', 'L’hôpital est loin ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-where-is-the-supermarket', 'pt', 'Onde fica o supermercado?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-where-is-the-supermarket', 'it', 'Dov’è il supermercato?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-where-is-the-supermarket', 'fr', 'Où est le supermarché ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-turn-left-at-the-bank', 'pt', 'Vire à esquerda no banco.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-turn-left-at-the-bank', 'it', 'Gira a sinistra alla banca.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-turn-left-at-the-bank', 'fr', 'Tourne à gauche à la banque.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-park-is-near-my-house', 'pt', 'O parque fica perto da minha casa.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-park-is-near-my-house', 'it', 'Il parco è vicino a casa mia.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-park-is-near-my-house', 'fr', 'Le parc est près de chez moi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bus-station-is-far', 'pt', 'A rodoviária fica longe.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bus-station-is-far', 'it', 'La stazione degli autobus è lontana.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-bus-station-is-far', 'fr', 'La gare routière est loin.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-go-straight-on', 'pt', 'Siga em frente.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-go-straight-on', 'it', 'Vai sempre dritto.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-go-straight-on', 'fr', 'Va tout droit.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-my-city-has-a-big-park', 'pt', 'Minha cidade tem um parque grande.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-my-city-has-a-big-park', 'it', 'La mia città ha un grande parco.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-my-city-has-a-big-park', 'fr', 'Ma ville a un grand parc.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-restaurant-is-not-far', 'pt', 'O restaurante não fica longe.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-restaurant-is-not-far', 'it', 'Il ristorante non è lontano.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-restaurant-is-not-far', 'fr', 'Le restaurant n’est pas loin.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-she-works-at-the-hospital', 'pt', 'Ela trabalha no hospital.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-she-works-at-the-hospital', 'it', 'Lei lavora all’ospedale.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-she-works-at-the-hospital', 'fr', 'Elle travaille à l’hôpital.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-i-live-on-this-street', 'pt', 'Eu moro nesta rua.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-i-live-on-this-street', 'it', 'Vivo in questa strada.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-i-live-on-this-street', 'fr', 'J’habite dans cette rue.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-shop-is-on-the-right', 'pt', 'A loja fica à direita.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-shop-is-on-the-right', 'it', 'Il negozio è a destra.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u10-the-shop-is-on-the-right', 'fr', 'Le magasin est à droite.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-likes-music', 'pt', 'Ela gosta de música.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-likes-music', 'it', 'A lei piace la musica.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-likes-music', 'fr', 'Elle aime la musique.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-can-you-swim', 'pt', 'Você sabe nadar?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-can-you-swim', 'it', 'Sai nuotare?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-can-you-swim', 'fr', 'Tu sais nager ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-favorite-sport-is-football', 'pt', 'Meu esporte favorito é o futebol.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-favorite-sport-is-football', 'it', 'Il mio sport preferito è il calcio.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-favorite-sport-is-football', 'fr', 'Mon sport préféré, c’est le foot.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-we-dont-like-this-movie', 'pt', 'Nós não gostamos deste filme.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-we-dont-like-this-movie', 'it', 'Questo film non ci piace.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-we-dont-like-this-movie', 'fr', 'Nous n’aimons pas ce film.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-he-sings-very-well', 'pt', 'Ele canta muito bem.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-he-sings-very-well', 'it', 'Lui canta molto bene.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-he-sings-very-well', 'fr', 'Il chante très bien.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-hate-mondays', 'pt', 'Eu odeio segundas-feiras.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-hate-mondays', 'it', 'Odio il lunedì.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-hate-mondays', 'fr', 'Je déteste le lundi.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-do-you-like-cooking', 'pt', 'Você gosta de cozinhar?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-do-you-like-cooking', 'it', 'Ti piace cucinare?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-do-you-like-cooking', 'fr', 'Tu aimes cuisiner ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-brother-can-cook', 'pt', 'Meu irmão sabe cozinhar.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-brother-can-cook', 'it', 'Mio fratello sa cucinare.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-my-brother-can-cook', 'fr', 'Mon frère sait cuisiner.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-this-game-is-fun', 'pt', 'Este jogo é divertido.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-this-game-is-fun', 'it', 'Questo gioco è divertente.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-this-game-is-fun', 'fr', 'Ce jeu est amusant.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-like-football-too', 'pt', 'Eu também gosto de futebol.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-like-football-too', 'it', 'Anche a me piace il calcio.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-i-like-football-too', 'fr', 'Moi aussi, j’aime le foot.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-what-is-your-favorite-movie', 'pt', 'Qual é o seu filme favorito?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-what-is-your-favorite-movie', 'it', 'Qual è il tuo film preferito?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-what-is-your-favorite-movie', 'fr', 'Quel est ton film préféré ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-cant-sing', 'pt', 'Ela não sabe cantar.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-cant-sing', 'it', 'Lei non sa cantare.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u11-she-cant-sing', 'fr', 'Elle ne sait pas chanter.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-can-you-repeat-that-please', 'pt', 'Você pode repetir, por favor?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-can-you-repeat-that-please', 'it', 'Puoi ripetere, per favore?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-can-you-repeat-that-please', 'fr', 'Tu peux répéter, s’il te plaît ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-what-does-this-word-mean', 'pt', 'O que significa esta palavra?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-what-does-this-word-mean', 'it', 'Che cosa significa questa parola?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-what-does-this-word-mean', 'fr', 'Que veut dire ce mot ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-why-are-you-tired', 'pt', 'Por que você está cansado?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-why-are-you-tired', 'it', 'Perché sei stanco?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-why-are-you-tired', 'fr', 'Pourquoi tu es fatigué ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-dont-know', 'pt', 'Eu não sei.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-dont-know', 'it', 'Non lo so.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-dont-know', 'fr', 'Je ne sais pas.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-do-you-speak-spanish', 'pt', 'Você fala espanhol?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-do-you-speak-spanish', 'it', 'Parli spagnolo?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-do-you-speak-spanish', 'fr', 'Tu parles espagnol ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-many-brothers-do-you-have', 'pt', 'Quantos irmãos você tem?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-many-brothers-do-you-have', 'it', 'Quanti fratelli hai?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-many-brothers-do-you-have', 'fr', 'Tu as combien de frères ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-when-do-you-work', 'pt', 'Quando você trabalha?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-when-do-you-work', 'it', 'Quando lavori?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-when-do-you-work', 'fr', 'Quand est-ce que tu travailles ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-which-book-do-you-want', 'pt', 'Qual livro você quer?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-which-book-do-you-want', 'it', 'Quale libro vuoi?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-which-book-do-you-want', 'fr', 'Quel livre tu veux ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-much-is-the-coffee', 'pt', 'Quanto custa o café?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-much-is-the-coffee', 'it', 'Quanto costa il caffè?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-how-much-is-the-coffee', 'fr', 'Combien coûte le café ?')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-know-the-answer', 'pt', 'Eu sei a resposta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-know-the-answer', 'it', 'So la risposta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-know-the-answer', 'fr', 'Je connais la réponse.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-please-speak-slowly', 'pt', 'Fale devagar, por favor.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-please-speak-slowly', 'it', 'Parla piano, per favore.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-please-speak-slowly', 'fr', 'Parle lentement, s’il te plaît.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-she-speaks-english-very-well', 'pt', 'Ela fala inglês muito bem.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-she-speaks-english-very-well', 'it', 'Lei parla inglese molto bene.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-she-speaks-english-very-well', 'fr', 'Elle parle très bien anglais.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-understand-the-question', 'pt', 'Eu entendo a pergunta.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-understand-the-question', 'it', 'Capisco la domanda.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;
insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)
values ('en.wr.u12-i-understand-the-question', 'fr', 'Je comprends la question.')
on conflict (sentence_id, source_language) do update set translation = excluded.translation;

