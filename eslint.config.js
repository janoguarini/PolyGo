// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // tools/al-sim4: simulador de investigación (AL18), copiado tal cual; no es código de la app.
    ignores: ['dist/*', 'server/**', 'supabase/**', 'ops/**', 'coverage/**', 'tools/al-sim4/**'],
  },
]);
