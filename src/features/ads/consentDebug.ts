/**
 * Ajustes de QA para UMP. Sólo se aplican con `__DEV__` (ver native.ts).
 *
 * Para probar el formulario de consentimiento fuera de Europa: geography = 'EEA' y agregar el id
 * de dispositivo de prueba que UMP imprime en el log nativo la primera vez
 * («Use new ConsentDebugSettings.Builder().addTestDeviceHashedId("…")»). Para repetir la prueba,
 * borrar los datos de la app o reinstalarla.
 *
 * Valores por defecto: ninguna geografía forzada, ningún dispositivo de prueba.
 */
export const CONSENT_DEBUG: {
  geography: 'EEA' | 'NOT_EEA' | null;
  testDeviceIdentifiers: readonly string[];
} = {
  geography: null,
  testDeviceIdentifiers: [],
};
