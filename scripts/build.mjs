// Build script: node scripts/build.mjs
// Inlines Three.js + both theme templates into single-file HTML builds in dist/.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const three = read('vendor/three.min.js');
if (three.includes('</script')) throw new Error('three.min.js contains </script — cannot inline');

const themes = {
  industrial: read('src/themes/factory.html'),
  candy: read('src/themes/candy.html'),
};
for (const [name, html] of Object.entries(themes)) {
  if (!html.includes('/*THREE*/')) throw new Error(`src/themes/${name} is missing the /*THREE*/ placeholder`);
}

// JSON-encode a template so it can live inside a <script> block safely
const enc = (t) => JSON.stringify(t).replace(/<\//g, '<\\/');

mkdirSync(join(root, 'dist'), { recursive: true });
const out = (file, text) => { writeFileSync(join(root, 'dist', file), text); console.log(`  dist/${file}  ${(text.length / 1024).toFixed(0)} KB`); };

console.log('Building Candy Sort Factory…');
// standalone single-theme builds (handy for testing one theme)
out('factory.html', themes.industrial.replace('/*THREE*/', () => three));
out('candy.html', themes.candy.replace('/*THREE*/', () => three));
// main build: launcher with theme menu
const launcher = read('src/launcher.html')
  .replace('/*THREE_SRC*/', () => three)
  .replace('/*TPL_INDUSTRIAL*/', () => enc(themes.industrial))
  .replace('/*TPL_CANDY*/', () => enc(themes.candy));
out('candy_sort_factory.html', launcher);
console.log('Done.');
