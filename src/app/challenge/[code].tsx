import { Redirect, useLocalSearchParams } from 'expo-router';

/** Link de desafío (polygo://challenge/<código>): entra directo a la partida con ese código. */
export default function ChallengeLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <Redirect href={{ pathname: '/battle', params: { code: (code ?? '').toUpperCase() } }} />;
}
