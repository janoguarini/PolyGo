import { router } from 'expo-router';

import { appleSignInSupported } from '@/features/auth/apple';
import { useAppleSignIn } from '@/features/auth/AppleSignInButton';
import { useGoogleSignIn } from '@/features/auth/GoogleSignInButton';
import { WelcomeScreen } from '@/features/auth/welcome/WelcomeScreen';

// Google y Apple usan los mismos flujos que ingreso y registro (useGoogleSignIn / useAppleSignIn).
// Apple sólo en iOS. Crear cuenta y Ya tengo cuenta navegan igual que antes.
export default function Welcome() {
  const google = useGoogleSignIn();
  const apple = useAppleSignIn();
  return (
    <WelcomeScreen
      onCreateAccount={() => router.push('/sign-up')}
      onSignIn={() => router.push('/sign-in')}
      google={{ onPress: google.start, busy: google.busy, message: google.message }}
      apple={
        appleSignInSupported()
          ? { onPress: apple.start, busy: apple.busy, message: apple.message }
          : undefined
      }
    />
  );
}
