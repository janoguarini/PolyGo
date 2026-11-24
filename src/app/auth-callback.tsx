import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { Button, ErrorState, LoadingState, Screen } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { exchangeCode } from '@/features/auth/api';
import { useStrings } from '@/i18n';
import { authCallbackStrings } from '@/i18n/screens/authCallback';
import { toUserMessage } from '@/lib/errors';

/** Destino de los enlaces de email (confirmación de cuenta y recuperación de contraseña). */
export default function AuthCallbackScreen() {
  const t = useStrings(authCallbackStrings);
  const params = useLocalSearchParams<{ code?: string; error_description?: string }>();
  const { session, recoveringPassword } = useAuth();
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [exchanged, setExchanged] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !params.code) return;
    started.current = true;
    exchangeCode(params.code)
      .then(() => setExchanged(true))
      .catch((e: unknown) => setExchangeError(toUserMessage(e)));
  }, [params.code]);

  // Navegar sólo cuando la sesión ya está en el estado, para que los guards del layout la vean.
  useEffect(() => {
    if (!exchanged || !session) return;
    router.replace(recoveringPassword ? '/reset-password' : '/');
  }, [exchanged, session, recoveringPassword]);

  const error = params.error_description ?? (params.code ? exchangeError : t.invalidLink);

  if (!error) return <LoadingState label={t.verifying} />;
  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <ErrorState title={t.errorTitle} message={error} />
      <Button label={t.backHome} variant="secondary" onPress={() => router.replace('/')} />
    </Screen>
  );
}
