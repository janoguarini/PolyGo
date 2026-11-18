// Empaqueta el núcleo de learning-session como scripts/build-functions.ts (mismas opciones, mismo
// encabezado) desde un árbol de fuentes dado. Uso: node build.cjs <dir-fuente> <salida>
const { buildSync } = require('esbuild');
const fs = require('fs');
const path = require('path');
const BANNER =
  '// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.\n';
const [src, out] = process.argv.slice(2);
const root = path.resolve(src);
const text =
  BANNER +
  buildSync({
    entryPoints: [path.join(root, 'shared/learningSession.ts')],
    // Las rutas de los comentarios (// shared/…) son relativas a esta carpeta, como en Polygo.
    absWorkingDir: root,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    write: false,
    legalComments: 'none',
    charset: 'utf8',
  }).outputFiles[0].text;
fs.writeFileSync(out, text);
