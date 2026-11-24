import { router } from 'expo-router';

/** Cierra «Tus cursos», la elección y el test, y deja al usuario en Aprender con el curso nuevo. */
export function goToLearn() {
  if (router.canDismiss()) router.dismissAll();
  router.navigate('/');
}
