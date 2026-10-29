import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { Button, ErrorState, LoadingState, Screen } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { exchangeCode } from '@/features/auth/api';
import { toUserMessage } from '@/lib/errors';

/** Destino de los enlaces de email (confirmación de cuenta y recuperación de contraseña). */
export default function AuthCallbackScreen() {
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

  const error =
    params.error_description ??
    (params.code ? exchangeError : 'El enlace no es válido o está incompleto.');

  if (!error) return <LoadingState label="Verificando enlace…" />;
  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <ErrorState title="No pudimos verificar el enlace" message={error} />
      <Button label="Volver al inicio" variant="secondary" onPress={() => router.replace('/')} />
    </Screen>
  );
}
