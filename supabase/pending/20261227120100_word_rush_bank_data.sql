-- =====================================================================
-- Datos del banco de Word Rush (Fase 5). GENERADO por scripts/build-word-rush-sql.ts desde
-- content/word-rush/: no editar a mano. NO APLICADO: requiere autorización aparte y, antes,
-- supabase/pending/20261227120000_word_rush_bank.sql.
-- Frases nuevas: 266. Ejercicios con variantes: 50.
-- Idempotente (on conflict do update). No borra filas ni toca lecciones/ejercicios.
-- =====================================================================

do $$
begin
  if to_regclass('public.word_rush_sentences') is null
     or to_regclass('public.word_rush_exercise_variants') is null then
    raise exception 'word_rush_bank_data: falta la migración 20261227120000_word_rush_bank';
  end if;
end;
$$;

insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-is-your-name-tom', 'en', 'A1', 'a1-u01', array['Is', 'your', 'name', 'Tom']::text[], 'Is your name Tom?', '{}'::text[], '¿Te llamás Tom?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-hi-how-are-you', 'en', 'A1', 'a1-u01', array['Hi', 'how', 'are', 'you']::text[], 'Hi, how are you?', '{}'::text[], 'Hola, ¿cómo estás?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-excuse-me-are-you-ana', 'en', 'A1', 'a1-u01', array['Excuse', 'me', 'are', 'you', 'Ana']::text[], 'Excuse me, are you Ana?', '{}'::text[], 'Disculpá, ¿sos Ana?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-good-morning-tom', 'en', 'A1', 'a1-u01', array['Good', 'morning', 'Tom']::text[], 'Good morning, Tom.', '{}'::text[], 'Buenos días, Tom.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-yes-i-am-tom', 'en', 'A1', 'a1-u01', array['Yes', 'I', 'am', 'Tom']::text[], 'Yes, I am Tom.', '{}'::text[], 'Sí, soy Tom.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u01-no-my-name-is-ana', 'en', 'A1', 'a1-u01', array['No', 'my', 'name', 'is', 'Ana']::text[], 'No, my name is Ana.', '{}'::text[], 'No, me llamo Ana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-we-are-friends', 'en', 'A1', 'a1-u02', array['We', 'are', 'friends']::text[], 'We are friends.', '{}'::text[], 'Somos amigos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-they-are-not-tired', 'en', 'A1', 'a1-u02', array['They', 'are', 'not', 'tired']::text[], 'They are not tired.', '{}'::text[], 'Ellos no están cansados.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-is-she-your-teacher', 'en', 'A1', 'a1-u02', array['Is', 'she', 'your', 'teacher']::text[], 'Is she your teacher?', '{}'::text[], '¿Ella es tu profesora?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-are-you-tired', 'en', 'A1', 'a1-u02', array['Are', 'you', 'tired']::text[], 'Are you tired?', '{}'::text[], '¿Estás cansado?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-he-is-not-happy', 'en', 'A1', 'a1-u02', array['He', 'is', 'not', 'happy']::text[], 'He is not happy.', '{}'::text[], 'Él no está contento.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-we-are-students', 'en', 'A1', 'a1-u02', array['We', 'are', 'students']::text[], 'We are students.', '{}'::text[], 'Somos estudiantes.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-is-he-your-friend', 'en', 'A1', 'a1-u02', array['Is', 'he', 'your', 'friend']::text[], 'Is he your friend?', '{}'::text[], '¿Él es tu amigo?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-you-are-my-friend', 'en', 'A1', 'a1-u02', array['You', 'are', 'my', 'friend']::text[], 'You are my friend.', '{}'::text[], 'Sos mi amigo.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-they-are-teachers', 'en', 'A1', 'a1-u02', array['They', 'are', 'teachers']::text[], 'They are teachers.', '{}'::text[], 'Ellos son profesores.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-are-they-students', 'en', 'A1', 'a1-u02', array['Are', 'they', 'students']::text[], 'Are they students?', '{}'::text[], '¿Ellos son estudiantes?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-ana-is-tired', 'en', 'A1', 'a1-u02', array['Ana', 'is', 'tired']::text[], 'Ana is tired.', '{}'::text[], 'Ana está cansada.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u02-tom-is-not-my-teacher', 'en', 'A1', 'a1-u02', array['Tom', 'is', 'not', 'my', 'teacher']::text[], 'Tom is not my teacher.', '{}'::text[], 'Tom no es mi profesor.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-he-is-from-mexico', 'en', 'A1', 'a1-u03', array['He', 'is', 'from', 'Mexico']::text[], 'He is from Mexico.', '{}'::text[], 'Él es de México.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-where-is-ana-from', 'en', 'A1', 'a1-u03', array['Where', 'is', 'Ana', 'from']::text[], 'Where is Ana from?', '{}'::text[], '¿De dónde es Ana?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-my-friend-is-from-england', 'en', 'A1', 'a1-u03', array['My', 'friend', 'is', 'from', 'England']::text[], 'My friend is from England.', '{}'::text[], 'Mi amigo es de Inglaterra.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-we-are-from-the-us', 'en', 'A1', 'a1-u03', array['We', 'are', 'from', 'the', 'United', 'States']::text[], 'We are from the United States.', '{}'::text[], 'Somos de Estados Unidos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-are-you-from-spain', 'en', 'A1', 'a1-u03', array['Are', 'you', 'from', 'Spain']::text[], 'Are you from Spain?', '{}'::text[], '¿Sos de España?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-she-is-eleven', 'en', 'A1', 'a1-u03', array['She', 'is', 'eleven', 'years', 'old']::text[], 'She is eleven years old.', '{}'::text[], 'Ella tiene once años.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-how-old-is-your-teacher', 'en', 'A1', 'a1-u03', array['How', 'old', 'is', 'your', 'teacher']::text[], 'How old is your teacher?', '{}'::text[], '¿Cuántos años tiene tu profesor?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-tom-is-fifteen', 'en', 'A1', 'a1-u03', array['Tom', 'is', 'fifteen']::text[], 'Tom is fifteen.', '{}'::text[], 'Tom tiene quince.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-where-are-they-from', 'en', 'A1', 'a1-u03', array['Where', 'are', 'they', 'from']::text[], 'Where are they from?', '{}'::text[], '¿De dónde son ellos?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-im-not-from-argentina', 'en', 'A1', 'a1-u03', array['I''m', 'not', 'from', 'Argentina']::text[], 'I''m not from Argentina.', '{}'::text[], 'No soy de Argentina.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u03-is-she-twelve', 'en', 'A1', 'a1-u03', array['Is', 'she', 'twelve']::text[], 'Is she twelve?', '{}'::text[], '¿Ella tiene doce años?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-my-sister-is-ten', 'en', 'A1', 'a1-u04', array['My', 'sister', 'is', 'ten']::text[], 'My sister is ten.', '{}'::text[], 'Mi hermana tiene diez años.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-who-is-your-teacher', 'en', 'A1', 'a1-u04', array['Who', 'is', 'your', 'teacher']::text[], 'Who is your teacher?', '{}'::text[], '¿Quién es tu profesor?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-their-mother-is-a-teacher', 'en', 'A1', 'a1-u04', array['Their', 'mother', 'is', 'a', 'teacher']::text[], 'Their mother is a teacher.', '{}'::text[], 'La mamá de ellos es profesora.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-i-have-a-sister', 'en', 'A1', 'a1-u04', array['I', 'have', 'a', 'sister']::text[], 'I have a sister.', '{}'::text[], 'Tengo una hermana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-our-grandfather-is-from-spain', 'en', 'A1', 'a1-u04', array['Our', 'grandfather', 'is', 'from', 'Spain']::text[], 'Our grandfather is from Spain.', '{}'::text[], 'Nuestro abuelo es de España.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-his-sister-is-a-student', 'en', 'A1', 'a1-u04', array['His', 'sister', 'is', 'a', 'student']::text[], 'His sister is a student.', '{}'::text[], 'La hermana de él es estudiante.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-they-have-a-baby', 'en', 'A1', 'a1-u04', array['They', 'have', 'a', 'baby']::text[], 'They have a baby.', '{}'::text[], 'Tienen un bebé.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-my-grandmother-is-from-mexico', 'en', 'A1', 'a1-u04', array['My', 'grandmother', 'is', 'from', 'Mexico']::text[], 'My grandmother is from Mexico.', '{}'::text[], 'Mi abuela es de México.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-the-girl-is-six', 'en', 'A1', 'a1-u04', array['The', 'girl', 'is', 'six', 'years', 'old']::text[], 'The girl is six years old.', '{}'::text[], 'La nena tiene seis años.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-is-your-father-a-teacher', 'en', 'A1', 'a1-u04', array['Is', 'your', 'father', 'a', 'teacher']::text[], 'Is your father a teacher?', '{}'::text[], '¿Tu papá es profesor?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-my-parents-are-tired', 'en', 'A1', 'a1-u04', array['My', 'parents', 'are', 'tired']::text[], 'My parents are tired.', '{}'::text[], 'Mis papás están cansados.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u04-the-boy-is-not-my-brother', 'en', 'A1', 'a1-u04', array['The', 'boy', 'is', 'not', 'my', 'brother']::text[], 'The boy is not my brother.', '{}'::text[], 'El chico no es mi hermano.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-is-this-your-phone', 'en', 'A1', 'a1-u05', array['Is', 'this', 'your', 'phone']::text[], 'Is this your phone?', '{}'::text[], '¿Este es tu teléfono?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-that-bag-is-big', 'en', 'A1', 'a1-u05', array['That', 'bag', 'is', 'big']::text[], 'That bag is big.', '{}'::text[], 'Ese bolso es grande.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-i-have-a-blue-pen', 'en', 'A1', 'a1-u05', array['I', 'have', 'a', 'blue', 'pen']::text[], 'I have a blue pen.', '{}'::text[], 'Tengo una lapicera azul.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-these-are-not-my-keys', 'en', 'A1', 'a1-u05', array['These', 'are', 'not', 'my', 'keys']::text[], 'These are not my keys.', '{}'::text[], 'Estas no son mis llaves.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-my-computer-is-small', 'en', 'A1', 'a1-u05', array['My', 'computer', 'is', 'small']::text[], 'My computer is small.', '{}'::text[], 'Mi computadora es chica.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-where-is-my-phone', 'en', 'A1', 'a1-u05', array['Where', 'is', 'my', 'phone']::text[], 'Where is my phone?', '{}'::text[], '¿Dónde está mi teléfono?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-her-bag-is-green', 'en', 'A1', 'a1-u05', array['Her', 'bag', 'is', 'green']::text[], 'Her bag is green.', '{}'::text[], 'El bolso de ella es verde.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-those-books-are-red', 'en', 'A1', 'a1-u05', array['Those', 'books', 'are', 'red']::text[], 'Those books are red.', '{}'::text[], 'Esos libros son rojos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-this-is-an-old-phone', 'en', 'A1', 'a1-u05', array['This', 'is', 'an', 'old', 'phone']::text[], 'This is an old phone.', '{}'::text[], 'Este es un teléfono viejo.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-where-are-my-keys', 'en', 'A1', 'a1-u05', array['Where', 'are', 'my', 'keys']::text[], 'Where are my keys?', '{}'::text[], '¿Dónde están mis llaves?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-that-is-not-my-pen', 'en', 'A1', 'a1-u05', array['That', 'is', 'not', 'my', 'pen']::text[], 'That is not my pen.', '{}'::text[], 'Esa no es mi lapicera.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u05-he-has-a-black-computer', 'en', 'A1', 'a1-u05', array['He', 'has', 'a', 'black', 'computer']::text[], 'He has a black computer.', '{}'::text[], 'Él tiene una computadora negra.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-my-bed-is-under-the-window', 'en', 'A1', 'a1-u06', array['My', 'bed', 'is', 'under', 'the', 'window']::text[], 'My bed is under the window.', '{}'::text[], 'Mi cama está debajo de la ventana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-is-there-a-garden', 'en', 'A1', 'a1-u06', array['Is', 'there', 'a', 'garden']::text[], 'Is there a garden?', '{}'::text[], '¿Hay un jardín?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-there-are-two-bathrooms', 'en', 'A1', 'a1-u06', array['There', 'are', 'two', 'bathrooms']::text[], 'There are two bathrooms.', '{}'::text[], 'Hay dos baños.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-the-sofa-is-green', 'en', 'A1', 'a1-u06', array['The', 'sofa', 'is', 'green']::text[], 'The sofa is green.', '{}'::text[], 'El sillón es verde.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-their-apartment-is-big', 'en', 'A1', 'a1-u06', array['Their', 'apartment', 'is', 'big']::text[], 'Their apartment is big.', '{}'::text[], 'El departamento de ellos es grande.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-the-book-is-on-the-table', 'en', 'A1', 'a1-u06', array['The', 'book', 'is', 'on', 'the', 'table']::text[], 'The book is on the table.', '{}'::text[], 'El libro está sobre la mesa.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-where-is-the-kitchen', 'en', 'A1', 'a1-u06', array['Where', 'is', 'the', 'kitchen']::text[], 'Where is the kitchen?', '{}'::text[], '¿Dónde está la cocina?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-there-is-no-door', 'en', 'A1', 'a1-u06', array['There', 'is', 'no', 'door']::text[], 'There is no door.', '{}'::text[], 'No hay puerta.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-my-phone-is-on-the-sofa', 'en', 'A1', 'a1-u06', array['My', 'phone', 'is', 'on', 'the', 'sofa']::text[], 'My phone is on the sofa.', '{}'::text[], 'Mi teléfono está en el sillón.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-the-living-room-has-two-windows', 'en', 'A1', 'a1-u06', array['The', 'living', 'room', 'has', 'two', 'windows']::text[], 'The living room has two windows.', '{}'::text[], 'El living tiene dos ventanas.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-is-the-bathroom-big', 'en', 'A1', 'a1-u06', array['Is', 'the', 'bathroom', 'big']::text[], 'Is the bathroom big?', '{}'::text[], '¿El baño es grande?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u06-there-are-four-chairs', 'en', 'A1', 'a1-u06', array['There', 'are', 'four', 'chairs']::text[], 'There are four chairs.', '{}'::text[], 'Hay cuatro sillas.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-i-am-hungry', 'en', 'A1', 'a1-u07', array['I', 'am', 'hungry']::text[], 'I am hungry.', '{}'::text[], 'Tengo hambre.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-are-they-thirsty', 'en', 'A1', 'a1-u07', array['Are', 'they', 'thirsty']::text[], 'Are they thirsty?', '{}'::text[], '¿Ellos tienen sed?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-i-want-a-coffee-please', 'en', 'A1', 'a1-u07', array['I', 'want', 'a', 'coffee', 'please']::text[], 'I want a coffee, please.', '{}'::text[], 'Quiero un café, por favor.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-we-want-three-apples', 'en', 'A1', 'a1-u07', array['We', 'want', 'three', 'apples']::text[], 'We want three apples.', '{}'::text[], 'Queremos tres manzanas.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-dinner-is-on-the-table', 'en', 'A1', 'a1-u07', array['Dinner', 'is', 'on', 'the', 'table']::text[], 'Dinner is on the table.', '{}'::text[], 'La cena está en la mesa.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-the-baby-drinks-milk', 'en', 'A1', 'a1-u07', array['The', 'baby', 'drinks', 'milk']::text[], 'The baby drinks milk.', '{}'::text[], 'El bebé toma leche.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-she-wants-an-apple', 'en', 'A1', 'a1-u07', array['She', 'wants', 'an', 'apple']::text[], 'She wants an apple.', '{}'::text[], 'Ella quiere una manzana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-the-milk-is-in-the-kitchen', 'en', 'A1', 'a1-u07', array['The', 'milk', 'is', 'in', 'the', 'kitchen']::text[], 'The milk is in the kitchen.', '{}'::text[], 'La leche está en la cocina.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-this-cheese-is-good', 'en', 'A1', 'a1-u07', array['This', 'cheese', 'is', 'good']::text[], 'This cheese is good.', '{}'::text[], 'Este queso es rico.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u07-my-sister-drinks-juice', 'en', 'A1', 'a1-u07', array['My', 'sister', 'drinks', 'juice']::text[], 'My sister drinks juice.', '{}'::text[], 'Mi hermana toma jugo.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-i-go-to-work-every-day', 'en', 'A1', 'a1-u08', array['I', 'go', 'to', 'work', 'every', 'day']::text[], 'I go to work every day.', array['Every day I go to work.']::text[], 'Voy a trabajar todos los días.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-she-lives-in-spain', 'en', 'A1', 'a1-u08', array['She', 'lives', 'in', 'Spain']::text[], 'She lives in Spain.', '{}'::text[], 'Ella vive en España.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-do-you-work-at-home', 'en', 'A1', 'a1-u08', array['Do', 'you', 'work', 'at', 'home']::text[], 'Do you work at home?', '{}'::text[], '¿Trabajás desde casa?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-he-never-drinks-coffee', 'en', 'A1', 'a1-u08', array['He', 'never', 'drinks', 'coffee']::text[], 'He never drinks coffee.', '{}'::text[], 'Él nunca toma café.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-they-play-in-the-garden', 'en', 'A1', 'a1-u08', array['They', 'play', 'in', 'the', 'garden']::text[], 'They play in the garden.', '{}'::text[], 'Ellos juegan en el jardín.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-does-she-read-every-day', 'en', 'A1', 'a1-u08', array['Does', 'she', 'read', 'every', 'day']::text[], 'Does she read every day?', '{}'::text[], '¿Ella lee todos los días?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-i-wake-up-at-seven', 'en', 'A1', 'a1-u08', array['I', 'wake', 'up', 'at', 'seven']::text[], 'I wake up at seven.', '{}'::text[], 'Me despierto a las siete.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-he-doesnt-live-in-england', 'en', 'A1', 'a1-u08', array['He', 'doesn''t', 'live', 'in', 'England']::text[], 'He doesn''t live in England.', '{}'::text[], 'Él no vive en Inglaterra.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-where-do-you-live', 'en', 'A1', 'a1-u08', array['Where', 'do', 'you', 'live']::text[], 'Where do you live?', '{}'::text[], '¿Dónde vivís?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-i-usually-read-at-home', 'en', 'A1', 'a1-u08', array['I', 'usually', 'read', 'at', 'home']::text[], 'I usually read at home.', '{}'::text[], 'Normalmente leo en casa.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u08-do-they-go-to-school', 'en', 'A1', 'a1-u08', array['Do', 'they', 'go', 'to', 'school']::text[], 'Do they go to school?', '{}'::text[], '¿Ellos van a la escuela?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-what-time-is-it', 'en', 'A1', 'a1-u09', array['What', 'time', 'is', 'it']::text[], 'What time is it?', '{}'::text[], '¿Qué hora es?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-i-study-in-the-afternoon', 'en', 'A1', 'a1-u09', array['I', 'study', 'in', 'the', 'afternoon']::text[], 'I study in the afternoon.', array['In the afternoon I study.']::text[], 'Estudio a la tarde.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-see-you-on-friday', 'en', 'A1', 'a1-u09', array['See', 'you', 'on', 'Friday']::text[], 'See you on Friday.', '{}'::text[], 'Nos vemos el viernes.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-is-today-tuesday', 'en', 'A1', 'a1-u09', array['Is', 'today', 'Tuesday']::text[], 'Is today Tuesday?', '{}'::text[], '¿Hoy es martes?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-i-work-on-saturday-morning', 'en', 'A1', 'a1-u09', array['I', 'work', 'on', 'Saturday', 'morning']::text[], 'I work on Saturday morning.', '{}'::text[], 'Trabajo el sábado a la mañana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-they-dont-watch-tv', 'en', 'A1', 'a1-u09', array['They', 'don''t', 'watch', 'TV']::text[], 'They don''t watch TV.', '{}'::text[], 'Ellos no miran televisión.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-its-half-past-seven', 'en', 'A1', 'a1-u09', array['It''s', 'half', 'past', 'seven']::text[], 'It''s half past seven.', '{}'::text[], 'Son las siete y media.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-what-time-do-you-eat-lunch', 'en', 'A1', 'a1-u09', array['What', 'time', 'do', 'you', 'eat', 'lunch']::text[], 'What time do you eat lunch?', '{}'::text[], '¿A qué hora almorzás?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-i-read-on-the-weekend', 'en', 'A1', 'a1-u09', array['I', 'read', 'on', 'the', 'weekend']::text[], 'I read on the weekend.', '{}'::text[], 'Leo los fines de semana.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-i-dont-work-tomorrow', 'en', 'A1', 'a1-u09', array['I', 'don''t', 'work', 'tomorrow']::text[], 'I don''t work tomorrow.', array['Tomorrow I don''t work.']::text[], 'Mañana no trabajo.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u09-she-gets-up-at-six', 'en', 'A1', 'a1-u09', array['She', 'gets', 'up', 'at', 'six', 'o''clock']::text[], 'She gets up at six o''clock.', '{}'::text[], 'Ella se levanta a las seis.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-the-bank-is-on-the-left', 'en', 'A1', 'a1-u10', array['The', 'bank', 'is', 'on', 'the', 'left']::text[], 'The bank is on the left.', '{}'::text[], 'El banco está a la izquierda.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-is-the-hospital-far', 'en', 'A1', 'a1-u10', array['Is', 'the', 'hospital', 'far']::text[], 'Is the hospital far?', '{}'::text[], '¿El hospital queda lejos?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-where-is-the-supermarket', 'en', 'A1', 'a1-u10', array['Where', 'is', 'the', 'supermarket']::text[], 'Where is the supermarket?', '{}'::text[], '¿Dónde está el supermercado?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-turn-left-at-the-bank', 'en', 'A1', 'a1-u10', array['Turn', 'left', 'at', 'the', 'bank']::text[], 'Turn left at the bank.', '{}'::text[], 'Doblá a la izquierda en el banco.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-the-park-is-near-my-house', 'en', 'A1', 'a1-u10', array['The', 'park', 'is', 'near', 'my', 'house']::text[], 'The park is near my house.', '{}'::text[], 'El parque está cerca de mi casa.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-the-bus-station-is-far', 'en', 'A1', 'a1-u10', array['The', 'bus', 'station', 'is', 'far']::text[], 'The bus station is far.', '{}'::text[], 'La estación de colectivos queda lejos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-go-straight-on', 'en', 'A1', 'a1-u10', array['Go', 'straight', 'on']::text[], 'Go straight on.', '{}'::text[], 'Seguí derecho.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-my-city-has-a-big-park', 'en', 'A1', 'a1-u10', array['My', 'city', 'has', 'a', 'big', 'park']::text[], 'My city has a big park.', '{}'::text[], 'Mi ciudad tiene un parque grande.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-the-restaurant-is-not-far', 'en', 'A1', 'a1-u10', array['The', 'restaurant', 'is', 'not', 'far']::text[], 'The restaurant is not far.', '{}'::text[], 'El restaurante no queda lejos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-she-works-at-the-hospital', 'en', 'A1', 'a1-u10', array['She', 'works', 'at', 'the', 'hospital']::text[], 'She works at the hospital.', '{}'::text[], 'Ella trabaja en el hospital.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-i-live-on-this-street', 'en', 'A1', 'a1-u10', array['I', 'live', 'on', 'this', 'street']::text[], 'I live on this street.', '{}'::text[], 'Vivo en esta calle.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u10-the-shop-is-on-the-right', 'en', 'A1', 'a1-u10', array['The', 'shop', 'is', 'on', 'the', 'right']::text[], 'The shop is on the right.', '{}'::text[], 'El negocio está a la derecha.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-she-likes-music', 'en', 'A1', 'a1-u11', array['She', 'likes', 'music']::text[], 'She likes music.', '{}'::text[], 'A ella le gusta la música.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-can-you-swim', 'en', 'A1', 'a1-u11', array['Can', 'you', 'swim']::text[], 'Can you swim?', '{}'::text[], '¿Sabés nadar?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-my-favorite-sport-is-football', 'en', 'A1', 'a1-u11', array['My', 'favorite', 'sport', 'is', 'football']::text[], 'My favorite sport is football.', array['Football is my favorite sport.']::text[], 'Mi deporte favorito es el fútbol.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-we-dont-like-this-movie', 'en', 'A1', 'a1-u11', array['We', 'don''t', 'like', 'this', 'movie']::text[], 'We don''t like this movie.', '{}'::text[], 'No nos gusta esta película.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-he-sings-very-well', 'en', 'A1', 'a1-u11', array['He', 'sings', 'very', 'well']::text[], 'He sings very well.', '{}'::text[], 'Él canta muy bien.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-i-hate-mondays', 'en', 'A1', 'a1-u11', array['I', 'hate', 'Mondays']::text[], 'I hate Mondays.', '{}'::text[], 'Odio los lunes.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-do-you-like-cooking', 'en', 'A1', 'a1-u11', array['Do', 'you', 'like', 'cooking']::text[], 'Do you like cooking?', '{}'::text[], '¿Te gusta cocinar?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-my-brother-can-cook', 'en', 'A1', 'a1-u11', array['My', 'brother', 'can', 'cook']::text[], 'My brother can cook.', '{}'::text[], 'Mi hermano sabe cocinar.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-this-game-is-fun', 'en', 'A1', 'a1-u11', array['This', 'game', 'is', 'fun']::text[], 'This game is fun.', '{}'::text[], 'Este juego es divertido.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-i-like-football-too', 'en', 'A1', 'a1-u11', array['I', 'like', 'football', 'too']::text[], 'I like football too.', '{}'::text[], 'A mí también me gusta el fútbol.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-what-is-your-favorite-movie', 'en', 'A1', 'a1-u11', array['What', 'is', 'your', 'favorite', 'movie']::text[], 'What is your favorite movie?', '{}'::text[], '¿Cuál es tu película favorita?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u11-she-cant-sing', 'en', 'A1', 'a1-u11', array['She', 'can''t', 'sing']::text[], 'She can''t sing.', '{}'::text[], 'Ella no sabe cantar.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-can-you-repeat-that-please', 'en', 'A1', 'a1-u12', array['Can', 'you', 'repeat', 'that', 'please']::text[], 'Can you repeat that, please?', '{}'::text[], '¿Podés repetir eso, por favor?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-what-does-this-word-mean', 'en', 'A1', 'a1-u12', array['What', 'does', 'this', 'word', 'mean']::text[], 'What does this word mean?', '{}'::text[], '¿Qué significa esta palabra?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-why-are-you-tired', 'en', 'A1', 'a1-u12', array['Why', 'are', 'you', 'tired']::text[], 'Why are you tired?', '{}'::text[], '¿Por qué estás cansado?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-i-dont-know', 'en', 'A1', 'a1-u12', array['I', 'don''t', 'know']::text[], 'I don''t know.', '{}'::text[], 'No sé.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-do-you-speak-spanish', 'en', 'A1', 'a1-u12', array['Do', 'you', 'speak', 'Spanish']::text[], 'Do you speak Spanish?', '{}'::text[], '¿Hablás español?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-how-many-brothers-do-you-have', 'en', 'A1', 'a1-u12', array['How', 'many', 'brothers', 'do', 'you', 'have']::text[], 'How many brothers do you have?', '{}'::text[], '¿Cuántos hermanos tenés?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-when-do-you-work', 'en', 'A1', 'a1-u12', array['When', 'do', 'you', 'work']::text[], 'When do you work?', '{}'::text[], '¿Cuándo trabajás?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-which-book-do-you-want', 'en', 'A1', 'a1-u12', array['Which', 'book', 'do', 'you', 'want']::text[], 'Which book do you want?', '{}'::text[], '¿Qué libro querés?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-how-much-is-the-coffee', 'en', 'A1', 'a1-u12', array['How', 'much', 'is', 'the', 'coffee']::text[], 'How much is the coffee?', '{}'::text[], '¿Cuánto sale el café?', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-i-know-the-answer', 'en', 'A1', 'a1-u12', array['I', 'know', 'the', 'answer']::text[], 'I know the answer.', '{}'::text[], 'Sé la respuesta.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-please-speak-slowly', 'en', 'A1', 'a1-u12', array['Please', 'speak', 'slowly']::text[], 'Please speak slowly.', array['Speak slowly, please.']::text[], 'Hablá despacio, por favor.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-she-speaks-english-very-well', 'en', 'A1', 'a1-u12', array['She', 'speaks', 'English', 'very', 'well']::text[], 'She speaks English very well.', '{}'::text[], 'Ella habla inglés muy bien.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('en.wr.u12-i-understand-the-question', 'en', 'A1', 'a1-u12', array['I', 'understand', 'the', 'question']::text[], 'I understand the question.', '{}'::text[], 'Entiendo la pregunta.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-hola-me-llamo-diego', 'es', 'A1', 'es-a1-u01', array['Hola', 'me', 'llamo', 'Diego']::text[], 'Hola, me llamo Diego.', '{}'::text[], 'Hi, my name is Diego.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-estoy-muy-bien', 'es', 'A1', 'es-a1-u01', array['Estoy', 'muy', 'bien']::text[], 'Estoy muy bien.', '{}'::text[], 'I’m very well.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-muchas-gracias-senora', 'es', 'A1', 'es-a1-u01', array['Muchas', 'gracias', 'señora']::text[], 'Muchas gracias, señora.', '{}'::text[], 'Thank you very much, ma’am.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-mucho-gusto-martin', 'es', 'A1', 'es-a1-u01', array['Mucho', 'gusto', 'Martín']::text[], 'Mucho gusto, Martín.', '{}'::text[], 'Nice to meet you, Martín.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-hasta-luego-sofia', 'es', 'A1', 'es-a1-u01', array['Hasta', 'luego', 'Sofía']::text[], 'Hasta luego, Sofía.', '{}'::text[], 'See you later, Sofía.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-buenos-dias-juan', 'es', 'A1', 'es-a1-u01', array['Buenos', 'días', 'Juan']::text[], 'Buenos días, Juan.', '{}'::text[], 'Good morning, Juan.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u01-de-nada-senor', 'es', 'A1', 'es-a1-u01', array['De', 'nada', 'señor']::text[], 'De nada, señor.', '{}'::text[], 'You’re welcome, sir.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-hablo-un-poco-de-espanol', 'es', 'A1', 'es-a1-u02', array['Hablo', 'un', 'poco', 'de', 'español']::text[], 'Hablo un poco de español.', '{}'::text[], 'I speak a little Spanish.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-ella-habla-portugues', 'es', 'A1', 'es-a1-u02', array['Ella', 'habla', 'portugués']::text[], 'Ella habla portugués.', '{}'::text[], 'She speaks Portuguese.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-kevin-es-estadounidense', 'es', 'A1', 'es-a1-u02', array['Kevin', 'es', 'estadounidense']::text[], 'Kevin es estadounidense.', '{}'::text[], 'Kevin is American.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-emma-vive-en-paris', 'es', 'A1', 'es-a1-u02', array['Emma', 'vive', 'en', 'París']::text[], 'Emma vive en París.', '{}'::text[], 'Emma lives in Paris.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-el-tambien-es-mexicano', 'es', 'A1', 'es-a1-u02', array['Él', 'también', 'es', 'mexicano']::text[], 'Él también es mexicano.', array['Él es mexicano también.']::text[], 'He is Mexican too.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-thiago-es-de-brasil', 'es', 'A1', 'es-a1-u02', array['Thiago', 'es', 'de', 'Brasil']::text[], 'Thiago es de Brasil.', '{}'::text[], 'Thiago is from Brazil.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u02-no-vivo-en-lima', 'es', 'A1', 'es-a1-u02', array['No', 'vivo', 'en', 'Lima']::text[], 'No vivo en Lima.', '{}'::text[], 'I don’t live in Lima.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u03-tengo-doce-anos', 'es', 'A1', 'es-a1-u03', array['Tengo', 'doce', 'años']::text[], 'Tengo doce años.', '{}'::text[], 'I’m twelve years old.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u03-mateo-tiene-siete-meses', 'es', 'A1', 'es-a1-u03', array['Mateo', 'tiene', 'siete', 'meses']::text[], 'Mateo tiene siete meses.', '{}'::text[], 'Mateo is seven months old.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u03-hablo-muchos-idiomas', 'es', 'A1', 'es-a1-u03', array['Hablo', 'muchos', 'idiomas']::text[], 'Hablo muchos idiomas.', '{}'::text[], 'I speak many languages.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u03-yo-tambien-tengo-diez', 'es', 'A1', 'es-a1-u03', array['Yo', 'también', 'tengo', 'diez', 'años']::text[], 'Yo también tengo diez años.', array['Yo tengo diez años también.']::text[], 'I’m ten years old too.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-mi-hermana-vive-en-roma', 'es', 'A1', 'es-a1-u04', array['Mi', 'hermana', 'vive', 'en', 'Roma']::text[], 'Mi hermana vive en Roma.', '{}'::text[], 'My sister lives in Rome.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-mi-abuela-tiene-dos-perros', 'es', 'A1', 'es-a1-u04', array['Mi', 'abuela', 'tiene', 'dos', 'perros']::text[], 'Mi abuela tiene dos perros.', '{}'::text[], 'My grandmother has two dogs.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-tu-hermano-habla-frances', 'es', 'A1', 'es-a1-u04', array['Tu', 'hermano', 'habla', 'francés']::text[], 'Tu hermano habla francés.', '{}'::text[], 'Your brother speaks French.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-mi-perro-se-llama-toto', 'es', 'A1', 'es-a1-u04', array['Mi', 'perro', 'se', 'llama', 'Toto']::text[], 'Mi perro se llama Toto.', '{}'::text[], 'My dog’s name is Toto.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-tengo-dos-hermanos', 'es', 'A1', 'es-a1-u04', array['Tengo', 'dos', 'hermanos']::text[], 'Tengo dos hermanos.', '{}'::text[], 'I have two brothers.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-vivo-con-mis-padres', 'es', 'A1', 'es-a1-u04', array['Vivo', 'con', 'mis', 'padres']::text[], 'Vivo con mis padres.', '{}'::text[], 'I live with my parents.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-mi-hijo-tiene-cinco-anos', 'es', 'A1', 'es-a1-u04', array['Mi', 'hijo', 'tiene', 'cinco', 'años']::text[], 'Mi hijo tiene cinco años.', '{}'::text[], 'My son is five years old.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-mi-papa-habla-tres-idiomas', 'es', 'A1', 'es-a1-u04', array['Mi', 'papá', 'habla', 'tres', 'idiomas']::text[], 'Mi papá habla tres idiomas.', '{}'::text[], 'My dad speaks three languages.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u04-sus-hijos-viven-en-mexico', 'es', 'A1', 'es-a1-u04', array['Sus', 'hijos', 'viven', 'en', 'México']::text[], 'Sus hijos viven en México.', '{}'::text[], 'Her children live in Mexico.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-mi-celular-es-negro', 'es', 'A1', 'es-a1-u05', array['Mi', 'celular', 'es', 'negro']::text[], 'Mi celular es negro.', '{}'::text[], 'My phone is black.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-tengo-un-cuaderno-verde', 'es', 'A1', 'es-a1-u05', array['Tengo', 'un', 'cuaderno', 'verde']::text[], 'Tengo un cuaderno verde.', '{}'::text[], 'I have a green notebook.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-este-libro-es-de-mi-hermano', 'es', 'A1', 'es-a1-u05', array['Este', 'libro', 'es', 'de', 'mi', 'hermano']::text[], 'Este libro es de mi hermano.', '{}'::text[], 'This book is my brother’s.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-no-tengo-la-llave', 'es', 'A1', 'es-a1-u05', array['No', 'tengo', 'la', 'llave']::text[], 'No tengo la llave.', '{}'::text[], 'I don’t have the key.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-el-boligrafo-azul-es-de-sofia', 'es', 'A1', 'es-a1-u05', array['El', 'bolígrafo', 'azul', 'es', 'de', 'Sofía']::text[], 'El bolígrafo azul es de Sofía.', '{}'::text[], 'The blue pen is Sofía’s.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-mi-papa-tiene-un-celular-grande', 'es', 'A1', 'es-a1-u05', array['Mi', 'papá', 'tiene', 'un', 'celular', 'grande']::text[], 'Mi papá tiene un celular grande.', '{}'::text[], 'My dad has a big phone.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u05-mi-perro-es-chico', 'es', 'A1', 'es-a1-u05', array['Mi', 'perro', 'es', 'chico']::text[], 'Mi perro es chico.', '{}'::text[], 'My dog is small.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-la-cocina-es-muy-chica', 'es', 'A1', 'es-a1-u06', array['La', 'cocina', 'es', 'muy', 'chica']::text[], 'La cocina es muy chica.', '{}'::text[], 'The kitchen is very small.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-hay-un-gato-en-la-cama', 'es', 'A1', 'es-a1-u06', array['Hay', 'un', 'gato', 'en', 'la', 'cama']::text[], 'Hay un gato en la cama.', array['En la cama hay un gato.']::text[], 'There’s a cat on the bed.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-las-llaves-estan-en-la-mesa', 'es', 'A1', 'es-a1-u06', array['Las', 'llaves', 'están', 'en', 'la', 'mesa']::text[], 'Las llaves están en la mesa.', '{}'::text[], 'The keys are on the table.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-mi-casa-tiene-dos-banos', 'es', 'A1', 'es-a1-u06', array['Mi', 'casa', 'tiene', 'dos', 'baños']::text[], 'Mi casa tiene dos baños.', '{}'::text[], 'My house has two bathrooms.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-no-hay-sillas-en-la-sala', 'es', 'A1', 'es-a1-u06', array['No', 'hay', 'sillas', 'en', 'la', 'sala']::text[], 'No hay sillas en la sala.', array['En la sala no hay sillas.']::text[], 'There are no chairs in the living room.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-esta-debajo-de-la-cama', 'es', 'A1', 'es-a1-u06', array['Está', 'debajo', 'de', 'la', 'cama']::text[], 'Está debajo de la cama.', '{}'::text[], 'It’s under the bed.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-la-puerta-es-azul', 'es', 'A1', 'es-a1-u06', array['La', 'puerta', 'es', 'azul']::text[], 'La puerta es azul.', '{}'::text[], 'The door is blue.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u06-el-dormitorio-tiene-una-ventana', 'es', 'A1', 'es-a1-u06', array['El', 'dormitorio', 'tiene', 'una', 'ventana']::text[], 'El dormitorio tiene una ventana.', '{}'::text[], 'The bedroom has a window.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-no-tomo-cafe', 'es', 'A1', 'es-a1-u07', array['No', 'tomo', 'café']::text[], 'No tomo café.', '{}'::text[], 'I don’t drink coffee.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-quisiera-un-jugo-de-manzana', 'es', 'A1', 'es-a1-u07', array['Quisiera', 'un', 'jugo', 'de', 'manzana']::text[], 'Quisiera un jugo de manzana.', '{}'::text[], 'I’d like an apple juice.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-bebo-mucha-agua', 'es', 'A1', 'es-a1-u07', array['Bebo', 'mucha', 'agua']::text[], 'Bebo mucha agua.', '{}'::text[], 'I drink a lot of water.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-como-muchas-verduras', 'es', 'A1', 'es-a1-u07', array['Como', 'muchas', 'verduras']::text[], 'Como muchas verduras.', '{}'::text[], 'I eat a lot of vegetables.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-el-pan-es-para-mi-abuela', 'es', 'A1', 'es-a1-u07', array['El', 'pan', 'es', 'para', 'mi', 'abuela']::text[], 'El pan es para mi abuela.', '{}'::text[], 'The bread is for my grandmother.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-tu-comes-mucho-pan', 'es', 'A1', 'es-a1-u07', array['Tú', 'comes', 'mucho', 'pan']::text[], 'Tú comes mucho pan.', '{}'::text[], 'You eat a lot of bread.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u07-no-quiero-carne-gracias', 'es', 'A1', 'es-a1-u07', array['No', 'quiero', 'carne', 'gracias']::text[], 'No quiero carne, gracias.', '{}'::text[], 'I don’t want meat, thanks.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-mi-papa-trabaja-mucho', 'es', 'A1', 'es-a1-u08', array['Mi', 'papá', 'trabaja', 'mucho']::text[], 'Mi papá trabaja mucho.', '{}'::text[], 'My dad works a lot.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-ceno-con-mi-familia', 'es', 'A1', 'es-a1-u08', array['Ceno', 'con', 'mi', 'familia']::text[], 'Ceno con mi familia.', '{}'::text[], 'I have dinner with my family.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-ustedes-hablan-muy-bien', 'es', 'A1', 'es-a1-u08', array['Ustedes', 'hablan', 'muy', 'bien']::text[], 'Ustedes hablan muy bien.', '{}'::text[], 'You all speak very well.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-me-levanto-muy-temprano', 'es', 'A1', 'es-a1-u08', array['Me', 'levanto', 'muy', 'temprano']::text[], 'Me levanto muy temprano.', '{}'::text[], 'I get up very early.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-mi-hermana-no-come-pescado', 'es', 'A1', 'es-a1-u08', array['Mi', 'hermana', 'no', 'come', 'pescado']::text[], 'Mi hermana no come pescado.', '{}'::text[], 'My sister doesn’t eat fish.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-escucho-musica-todos-los-dias', 'es', 'A1', 'es-a1-u08', array['Escucho', 'música', 'todos', 'los', 'días']::text[], 'Escucho música todos los días.', array['Todos los días escucho música.']::text[], 'I listen to music every day.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-mi-mama-mira-una-serie', 'es', 'A1', 'es-a1-u08', array['Mi', 'mamá', 'mira', 'una', 'serie']::text[], 'Mi mamá mira una serie.', '{}'::text[], 'My mom is watching a series.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-nosotros-vivimos-en-monterrey', 'es', 'A1', 'es-a1-u08', array['Nosotros', 'vivimos', 'en', 'Monterrey']::text[], 'Nosotros vivimos en Monterrey.', '{}'::text[], 'We live in Monterrey.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u08-mi-abuelo-escucha-la-radio', 'es', 'A1', 'es-a1-u08', array['Mi', 'abuelo', 'escucha', 'la', 'radio']::text[], 'Mi abuelo escucha la radio.', '{}'::text[], 'My grandfather listens to the radio.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-son-las-doce-menos-cuarto', 'es', 'A1', 'es-a1-u09', array['Son', 'las', 'doce', 'menos', 'cuarto']::text[], 'Son las doce menos cuarto.', '{}'::text[], 'It’s a quarter to twelve.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-el-almuerzo-es-al-mediodia', 'es', 'A1', 'es-a1-u09', array['El', 'almuerzo', 'es', 'al', 'mediodía']::text[], 'El almuerzo es al mediodía.', '{}'::text[], 'Lunch is at noon.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-no-trabajo-los-domingos', 'es', 'A1', 'es-a1-u09', array['No', 'trabajo', 'los', 'domingos']::text[], 'No trabajo los domingos.', array['Los domingos no trabajo.']::text[], 'I don’t work on Sundays.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-tengo-clase-el-lunes', 'es', 'A1', 'es-a1-u09', array['Tengo', 'clase', 'el', 'lunes']::text[], 'Tengo clase el lunes.', array['El lunes tengo clase.']::text[], 'I have class on Monday.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-la-semana-tiene-siete-dias', 'es', 'A1', 'es-a1-u09', array['La', 'semana', 'tiene', 'siete', 'días']::text[], 'La semana tiene siete días.', '{}'::text[], 'A week has seven days.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-la-clase-es-a-las-nueve', 'es', 'A1', 'es-a1-u09', array['La', 'clase', 'es', 'a', 'las', 'nueve']::text[], 'La clase es a las nueve.', '{}'::text[], 'The class is at nine.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-hoy-no-trabajo', 'es', 'A1', 'es-a1-u09', array['Hoy', 'no', 'trabajo']::text[], 'Hoy no trabajo.', array['No trabajo hoy.']::text[], 'I’m not working today.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u09-el-domingo-como-con-mis-abuelos', 'es', 'A1', 'es-a1-u09', array['El', 'domingo', 'como', 'con', 'mis', 'abuelos']::text[], 'El domingo como con mis abuelos.', array['Como con mis abuelos el domingo.']::text[], 'On Sunday I eat with my grandparents.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-el-supermercado-esta-cerca', 'es', 'A1', 'es-a1-u10', array['El', 'supermercado', 'está', 'cerca']::text[], 'El supermercado está cerca.', '{}'::text[], 'The supermarket is nearby.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-vamos-al-cine', 'es', 'A1', 'es-a1-u10', array['Vamos', 'al', 'cine']::text[], 'Vamos al cine.', '{}'::text[], 'We’re going to the cinema.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-voy-a-la-farmacia', 'es', 'A1', 'es-a1-u10', array['Voy', 'a', 'la', 'farmacia']::text[], 'Voy a la farmacia.', '{}'::text[], 'I’m going to the pharmacy.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-la-estacion-esta-a-dos-cuadras', 'es', 'A1', 'es-a1-u10', array['La', 'estación', 'está', 'a', 'dos', 'cuadras']::text[], 'La estación está a dos cuadras.', '{}'::text[], 'The station is two blocks away.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-dobla-a-la-derecha', 'es', 'A1', 'es-a1-u10', array['Dobla', 'a', 'la', 'derecha']::text[], 'Dobla a la derecha.', '{}'::text[], 'Turn right.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-mi-papa-va-al-banco', 'es', 'A1', 'es-a1-u10', array['Mi', 'papá', 'va', 'al', 'banco']::text[], 'Mi papá va al banco.', '{}'::text[], 'My dad goes to the bank.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-la-panaderia-esta-en-mi-calle', 'es', 'A1', 'es-a1-u10', array['La', 'panadería', 'está', 'en', 'mi', 'calle']::text[], 'La panadería está en mi calle.', '{}'::text[], 'The bakery is on my street.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u10-mi-barrio-tiene-un-cine', 'es', 'A1', 'es-a1-u10', array['Mi', 'barrio', 'tiene', 'un', 'cine']::text[], 'Mi barrio tiene un cine.', '{}'::text[], 'My neighborhood has a cinema.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-me-encanta-bailar-salsa', 'es', 'A1', 'es-a1-u11', array['Me', 'encanta', 'bailar', 'salsa']::text[], 'Me encanta bailar salsa.', '{}'::text[], 'I love dancing salsa.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-a-mi-me-gusta-viajar', 'es', 'A1', 'es-a1-u11', array['A', 'mí', 'me', 'gusta', 'viajar']::text[], 'A mí me gusta viajar.', '{}'::text[], 'I like traveling.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-mi-hermano-toca-la-guitarra', 'es', 'A1', 'es-a1-u11', array['Mi', 'hermano', 'toca', 'la', 'guitarra']::text[], 'Mi hermano toca la guitarra.', '{}'::text[], 'My brother plays the guitar.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-odio-el-futbol', 'es', 'A1', 'es-a1-u11', array['Odio', 'el', 'fútbol']::text[], 'Odio el fútbol.', '{}'::text[], 'I hate football.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-prefiero-leer-un-libro', 'es', 'A1', 'es-a1-u11', array['Prefiero', 'leer', 'un', 'libro']::text[], 'Prefiero leer un libro.', '{}'::text[], 'I prefer to read a book.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-mi-hija-juega-con-el-perro', 'es', 'A1', 'es-a1-u11', array['Mi', 'hija', 'juega', 'con', 'el', 'perro']::text[], 'Mi hija juega con el perro.', '{}'::text[], 'My daughter plays with the dog.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-me-gustan-mucho-las-series', 'es', 'A1', 'es-a1-u11', array['Me', 'gustan', 'mucho', 'las', 'series']::text[], 'Me gustan mucho las series.', array['Las series me gustan mucho.']::text[], 'I really like TV series.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u11-no-me-gusta-para-nada', 'es', 'A1', 'es-a1-u11', array['No', 'me', 'gusta', 'para', 'nada']::text[], 'No me gusta para nada.', '{}'::text[], 'I don’t like it at all.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-busco-una-camiseta-azul', 'es', 'A1', 'es-a1-u12', array['Busco', 'una', 'camiseta', 'azul']::text[], 'Busco una camiseta azul.', '{}'::text[], 'I’m looking for a blue T-shirt.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-el-libro-cuesta-treinta-pesos', 'es', 'A1', 'es-a1-u12', array['El', 'libro', 'cuesta', 'treinta', 'pesos']::text[], 'El libro cuesta treinta pesos.', '{}'::text[], 'The book costs thirty pesos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-la-tienda-esta-abierta', 'es', 'A1', 'es-a1-u12', array['La', 'tienda', 'está', 'abierta']::text[], 'La tienda está abierta.', '{}'::text[], 'The shop is open.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-este-negocio-es-muy-caro', 'es', 'A1', 'es-a1-u12', array['Este', 'negocio', 'es', 'muy', 'caro']::text[], 'Este negocio es muy caro.', '{}'::text[], 'This shop is very expensive.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-las-manzanas-son-muy-baratas', 'es', 'A1', 'es-a1-u12', array['Las', 'manzanas', 'son', 'muy', 'baratas']::text[], 'Las manzanas son muy baratas.', '{}'::text[], 'The apples are very cheap.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-tengo-cien-pesos', 'es', 'A1', 'es-a1-u12', array['Tengo', 'cien', 'pesos']::text[], 'Tengo cien pesos.', '{}'::text[], 'I have a hundred pesos.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-esta-camiseta-es-muy-linda', 'es', 'A1', 'es-a1-u12', array['Esta', 'camiseta', 'es', 'muy', 'linda']::text[], 'Esta camiseta es muy linda.', '{}'::text[], 'This T-shirt is really pretty.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u12-son-cincuenta-pesos', 'es', 'A1', 'es-a1-u12', array['Son', 'cincuenta', 'pesos', 'por', 'favor']::text[], 'Son cincuenta pesos, por favor.', '{}'::text[], 'That’s fifty pesos, please.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-mi-mama-es-medica', 'es', 'A1', 'es-a1-u13', array['Mi', 'mamá', 'es', 'médica']::text[], 'Mi mamá es médica.', '{}'::text[], 'My mom is a doctor.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-mi-papa-es-ingeniero', 'es', 'A1', 'es-a1-u13', array['Mi', 'papá', 'es', 'ingeniero']::text[], 'Mi papá es ingeniero.', '{}'::text[], 'My dad is an engineer.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-trabajo-en-un-hospital', 'es', 'A1', 'es-a1-u13', array['Trabajo', 'en', 'un', 'hospital']::text[], 'Trabajo en un hospital.', '{}'::text[], 'I work in a hospital.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-somos-estudiantes-de-ingles', 'es', 'A1', 'es-a1-u13', array['Somos', 'estudiantes', 'de', 'inglés']::text[], 'Somos estudiantes de inglés.', '{}'::text[], 'We’re English students.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-ella-estudia-mucho', 'es', 'A1', 'es-a1-u13', array['Ella', 'estudia', 'mucho']::text[], 'Ella estudia mucho.', '{}'::text[], 'She studies a lot.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-tenemos-dos-hijos', 'es', 'A1', 'es-a1-u13', array['Tenemos', 'dos', 'hijos']::text[], 'Tenemos dos hijos.', '{}'::text[], 'We have two children.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-tienen-una-oficina-en-lima', 'es', 'A1', 'es-a1-u13', array['Tienen', 'una', 'oficina', 'en', 'Lima']::text[], 'Tienen una oficina en Lima.', array['En Lima tienen una oficina.']::text[], 'They have an office in Lima.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-mi-clase-empieza-a-las-ocho', 'es', 'A1', 'es-a1-u13', array['Mi', 'clase', 'empieza', 'a', 'las', 'ocho']::text[], 'Mi clase empieza a las ocho.', '{}'::text[], 'My class starts at eight.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u13-no-tengo-trabajo', 'es', 'A1', 'es-a1-u13', array['No', 'tengo', 'trabajo']::text[], 'No tengo trabajo.', '{}'::text[], 'I don’t have a job.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-tengo-el-pelo-largo', 'es', 'A1', 'es-a1-u14', array['Tengo', 'el', 'pelo', 'largo']::text[], 'Tengo el pelo largo.', '{}'::text[], 'I have long hair.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-estoy-muy-cansada', 'es', 'A1', 'es-a1-u14', array['Estoy', 'muy', 'cansada']::text[], 'Estoy muy cansada.', '{}'::text[], 'I’m very tired.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-mi-amiga-es-muy-simpatica', 'es', 'A1', 'es-a1-u14', array['Mi', 'amiga', 'es', 'muy', 'simpática']::text[], 'Mi amiga es muy simpática.', '{}'::text[], 'My friend is very nice.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-mis-abuelos-estan-contentos', 'es', 'A1', 'es-a1-u14', array['Mis', 'abuelos', 'están', 'contentos']::text[], 'Mis abuelos están contentos.', '{}'::text[], 'My grandparents are happy.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-el-profesor-es-muy-serio', 'es', 'A1', 'es-a1-u14', array['El', 'profesor', 'es', 'muy', 'serio']::text[], 'El profesor es muy serio.', '{}'::text[], 'The teacher is very serious.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-mi-abuela-tiene-el-pelo-corto', 'es', 'A1', 'es-a1-u14', array['Mi', 'abuela', 'tiene', 'el', 'pelo', 'corto']::text[], 'Mi abuela tiene el pelo corto.', '{}'::text[], 'My grandmother has short hair.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-su-esposa-es-rubia', 'es', 'A1', 'es-a1-u14', array['Su', 'esposa', 'es', 'rubia']::text[], 'Su esposa es rubia.', '{}'::text[], 'His wife is blonde.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u14-estoy-contento-con-mi-trabajo', 'es', 'A1', 'es-a1-u14', array['Estoy', 'contento', 'con', 'mi', 'trabajo']::text[], 'Estoy contento con mi trabajo.', '{}'::text[], 'I’m happy with my job.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-mi-cumpleanos-es-en-marzo', 'es', 'A1', 'es-a1-u15', array['Mi', 'cumpleaños', 'es', 'en', 'marzo']::text[], 'Mi cumpleaños es en marzo.', '{}'::text[], 'My birthday is in March.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-naci-en-guadalajara', 'es', 'A1', 'es-a1-u15', array['Nací', 'en', 'Guadalajara']::text[], 'Nací en Guadalajara.', '{}'::text[], 'I was born in Guadalajara.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-mi-hijo-nacio-en-enero', 'es', 'A1', 'es-a1-u15', array['Mi', 'hijo', 'nació', 'en', 'enero']::text[], 'Mi hijo nació en enero.', '{}'::text[], 'My son was born in January.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-la-fiesta-es-el-sabado', 'es', 'A1', 'es-a1-u15', array['La', 'fiesta', 'es', 'el', 'sábado']::text[], 'La fiesta es el sábado.', '{}'::text[], 'The party is on Saturday.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-hoy-es-mi-cumpleanos', 'es', 'A1', 'es-a1-u15', array['Hoy', 'es', 'mi', 'cumpleaños']::text[], 'Hoy es mi cumpleaños.', array['Es mi cumpleaños hoy.']::text[], 'Today is my birthday.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-la-navidad-es-en-diciembre', 'es', 'A1', 'es-a1-u15', array['La', 'Navidad', 'es', 'en', 'diciembre']::text[], 'La Navidad es en diciembre.', '{}'::text[], 'Christmas is in December.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u15-tenemos-una-fiesta-en-agosto', 'es', 'A1', 'es-a1-u15', array['Tenemos', 'una', 'fiesta', 'en', 'agosto']::text[], 'Tenemos una fiesta en agosto.', array['En agosto tenemos una fiesta.']::text[], 'We have a party in August.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-en-verano-hace-mucho-calor', 'es', 'A1', 'es-a1-u16', array['En', 'verano', 'hace', 'mucho', 'calor']::text[], 'En verano hace mucho calor.', array['Hace mucho calor en verano.']::text[], 'It’s very hot in summer.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-hace-mucho-viento-aca', 'es', 'A1', 'es-a1-u16', array['Hace', 'mucho', 'viento', 'acá']::text[], 'Hace mucho viento acá.', array['Acá hace mucho viento.']::text[], 'It’s very windy here.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-prefiero-la-montana', 'es', 'A1', 'es-a1-u16', array['Prefiero', 'la', 'montaña']::text[], 'Prefiero la montaña.', '{}'::text[], 'I prefer the mountains.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-nieva-mucho-en-el-sur', 'es', 'A1', 'es-a1-u16', array['Nieva', 'mucho', 'en', 'el', 'sur']::text[], 'Nieva mucho en el sur.', array['En el sur nieva mucho.']::text[], 'It snows a lot in the south.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-el-mar-esta-muy-frio', 'es', 'A1', 'es-a1-u16', array['El', 'mar', 'está', 'muy', 'frío']::text[], 'El mar está muy frío.', '{}'::text[], 'The sea is very cold.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-hace-mal-tiempo', 'es', 'A1', 'es-a1-u16', array['Hace', 'mal', 'tiempo']::text[], 'Hace mal tiempo.', '{}'::text[], 'The weather is bad.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-hay-mucho-sol', 'es', 'A1', 'es-a1-u16', array['Hay', 'mucho', 'sol']::text[], 'Hay mucho sol.', '{}'::text[], 'It’s very sunny.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u16-lima-es-mas-grande-que-cusco', 'es', 'A1', 'es-a1-u16', array['Lima', 'es', 'más', 'grande', 'que', 'Cusco']::text[], 'Lima es más grande que Cusco.', '{}'::text[], 'Lima is bigger than Cusco.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-voy-al-trabajo-a-pie', 'es', 'A1', 'es-a1-u17', array['Voy', 'al', 'trabajo', 'a', 'pie']::text[], 'Voy al trabajo a pie.', array['Voy a pie al trabajo.']::text[], 'I walk to work.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-tomamos-el-tren', 'es', 'A1', 'es-a1-u17', array['Tomamos', 'el', 'tren']::text[], 'Tomamos el tren.', '{}'::text[], 'We take the train.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-mi-hermana-viene-esta-noche', 'es', 'A1', 'es-a1-u17', array['Mi', 'hermana', 'viene', 'esta', 'noche']::text[], 'Mi hermana viene esta noche.', array['Esta noche viene mi hermana.']::text[], 'My sister is coming tonight.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-el-pasaje-es-muy-caro', 'es', 'A1', 'es-a1-u17', array['El', 'pasaje', 'es', 'muy', 'caro']::text[], 'El pasaje es muy caro.', '{}'::text[], 'The ticket is very expensive.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-me-quedo-en-casa', 'es', 'A1', 'es-a1-u17', array['Me', 'quedo', 'en', 'casa']::text[], 'Me quedo en casa.', '{}'::text[], 'I’m staying home.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-no-tengo-carro', 'es', 'A1', 'es-a1-u17', array['No', 'tengo', 'carro']::text[], 'No tengo carro.', '{}'::text[], 'I don’t have a car.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-ya-tengo-el-pasaje', 'es', 'A1', 'es-a1-u17', array['Ya', 'tengo', 'el', 'pasaje']::text[], 'Ya tengo el pasaje.', '{}'::text[], 'I already have the ticket.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-el-viaje-es-muy-largo', 'es', 'A1', 'es-a1-u17', array['El', 'viaje', 'es', 'muy', 'largo']::text[], 'El viaje es muy largo.', '{}'::text[], 'The trip is very long.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-ahora-voy-a-la-estacion', 'es', 'A1', 'es-a1-u17', array['Ahora', 'voy', 'a', 'la', 'estación']::text[], 'Ahora voy a la estación.', array['Voy a la estación ahora.']::text[], 'I’m going to the station now.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;
insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)
values ('es.wr.u17-este-fin-de-semana-trabajo', 'es', 'A1', 'es-a1-u17', array['Este', 'fin', 'de', 'semana', 'trabajo']::text[], 'Este fin de semana trabajo.', array['Trabajo este fin de semana.']::text[], 'I’m working this weekend.', true)
on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,
  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, translation = excluded.translation,
  is_published = excluded.is_published;

insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('a1-u07-l03-e05', array['They eat rice and chicken.']::text[], 'Conector «and» entre dos comidas: el orden de los dos lados es indistinto.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('a2-u05-l01-e06', array['Now he is writing an email.']::text[], '«now» al principio es igual de natural.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('a2-u11-l03-e07', array['Today the sky is very blue.']::text[], '«today» al principio es igual de natural.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('a2-u16-l05-e06', array['Tonight I''ll call you back.']::text[], '«tonight» al principio es natural.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u03-l03-e05', array['Soy estudiante y tengo veinte años.']::text[], 'Conector y: las dos cláusulas se pueden invertir.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u07-l01-e07', array['Tengo leche y pan.']::text[], 'Conector y entre dos sustantivos: orden libre.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u07-rev1-e05', array['Tengo leche y pan.']::text[], 'Conector y entre dos sustantivos: orden libre.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u07-l02-e08', array['Yo como pan y queso.']::text[], 'Conector y entre dos sustantivos: orden libre.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a2-u08-l04-e08', array['Toma mucha agua y descansa.']::text[], 'Dos consejos coordinados: el orden es libre.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u10-l01-e08', array['Voy al museo hoy.']::text[], 'Hoy puede ir al principio o al final.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u16-l01-e08', array['Hace buen tiempo hoy.']::text[], 'Hoy puede ir al principio o al final.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a1-u17-l02-e08', array['Tomo el autobús ahora.']::text[], 'Ahora puede ir al principio o al final.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a2-u01-l01-e07', array['Terminé el trabajo ayer.']::text[], 'Ayer puede ir al principio o al final.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('es-a2-u01-l04-e08', array['Quiero ordenar mi dormitorio hoy.']::text[], 'Hoy puede ir al principio o al final.')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u05-l03-e07', array['Ho tre penne e due libri.']::text[], 'enumeración con «e»: el orden de los objetos es libre')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u05-rev2-e09', array['Ho tre penne e due libri.']::text[], 'enumeración con «e»: el orden de los objetos es libre')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u08-l02-e07', array['Leggo e poi dormo la sera.']::text[], 'el complemento de tiempo «la sera» puede ir al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u08-rev1-e05', array['Leggo e poi dormo la sera.']::text[], 'el complemento de tiempo «la sera» puede ir al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u08-l03-e06', array['Lui parla spagnolo e italiano.']::text[], 'enumeración de idiomas con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u08-final-e05', array['Lui parla spagnolo e italiano.']::text[], 'enumeración de idiomas con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u14-l03-e08', array['Lui è alto e giovane.']::text[], 'dos adjetivos coordinados con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u14-rev2-e10', array['Lui è alto e giovane.']::text[], 'dos adjetivos coordinados con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u14-l05-e07', array['Oggi ho freddo e sto male.']::text[], 'dos estados coordinados con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a2-u05-l03-e08', array['C’era tanta gente e pioveva.']::text[], 'dos descripciones simultáneas en imperfecto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a2-u05-rev2-e02', array['C’era tanta gente e pioveva.']::text[], 'dos descripciones simultáneas en imperfecto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a2-u08-l05-e07', array['Riposati e bevi molta acqua.']::text[], 'dos consejos coordinados, sin secuencia')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u10-l03-e06', array['Vado in città oggi.']::text[], '«oggi» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u11-l04-e06', array['Oggi voglio giocare a calcio.']::text[], '«oggi» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u11-l05-e07', array['Domani puoi giocare?']::text[], '«domani» puede ir al principio de la pregunta')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a1-u12-l01-e06', array['Oggi cosa fai?']::text[], '«oggi» al principio es igual de natural en el habla')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a2-u01-l01-e07', array['Ho parlato con Marco ieri.']::text[], '«ieri» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('it-a2-u08-l01-e07', array['Da ieri ho mal di testa.']::text[], '«da ieri» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a1-u08-l03-e06', array['Ele fala espanhol e português.']::text[], 'enumeración de idiomas con «e»')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a1-u11-l05-e07', array['Hoje eu posso cozinhar.']::text[], '«hoje» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a1-u14-l01-e07', array['Hoje você está cansado?']::text[], '«hoje» puede ir al principio de la pregunta')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a1-u16-l02-e07', array['A gente vai ao cinema amanhã.']::text[], '«amanhã» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a2-u01-l01-e08', array['Eu trabalhei até tarde ontem.']::text[], '«ontem» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a2-u01-l05-e07', array['Ontem eles saíram tarde.']::text[], '«ontem» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a2-u06-l05-e07', array['Hoje estou a fim de sair.']::text[], '«hoje» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('pt-a2-u12-l05-e08', array['Amanhã vamos resolver o problema.']::text[], '«amanhã» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('fr-a1-u04-l02-e08', array['J''ai une fille et un fils.']::text[], 'enumeración con «et»: el orden de los hijos es libre')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('fr-a1-u16-l02-e08', array['Aujourd''hui il y a du soleil.']::text[], '«aujourd''hui» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('fr-a1-u17-l03-e08', array['Demain nous allons visiter le musée.']::text[], '«demain» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('fr-a2-u01-l01-e08', array['J''ai parlé avec Claire hier soir.']::text[], '«hier soir» puede ir al principio o al final')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a1-u08-l01-e07', array['早上我吃早饭。']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a1-u08-l03-e07', array['晚上我看书。']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a1-u08-l04-e07', array['下午我工作。']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a1-u11-l04-e06', array['明天你能来吗？']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a1-u16-l05-e05', array['昨天我没去银行。']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;
insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)
values ('zh-a2-u04-l02-e07', array['晚上我给你打电话。']::text[], 'la palabra de tiempo puede ir antes del sujeto')
on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,
  reason = excluded.reason;

