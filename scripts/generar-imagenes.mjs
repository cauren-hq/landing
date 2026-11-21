// Genera los PNG de `public/` (favicons, ícono e imagen OG) desde el ícono vectorial del sitio
// (`public/favicon.svg`) y los datos del logotipo (`src/lib/marca.js`). Uso y requisitos en README.md.

import path from 'node:path';
import { createRequire } from 'node:module';
import { PALABRA, SIMBOLO } from '../src/lib/marca.js';

// sharp llega como dependencia opcional de Astro; se resuelve desde Astro para no duplicarla.
const desdeAstro = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
const sharp = desdeAstro('sharp');

const [, , publicDir = 'public'] = process.argv;
const icono = path.join(publicDir, 'favicon.svg');

await sharp(icono, { density: 512 }).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32.png'));
await sharp(icono, { density: 512 }).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
await sharp(icono, { density: 512 }).resize(512, 512).png().toFile(path.join(publicDir, 'icono-512.png'));

// Símbolo en las coordenadas de la retícula (120 u), para dibujarlo dentro de la imagen OG.
const { centro, separacion, radioNodo, radioCentro, conector } = SIMBOLO;
const nodos = [
  [centro - separacion, centro - separacion],
  [centro + separacion, centro - separacion],
  [centro - separacion, centro + separacion],
  [centro + separacion, centro + separacion],
];
const simbolo = `
  <g stroke="#FFFFFF" stroke-width="${conector}" stroke-linecap="round">
    ${nodos.map(([x, y]) => `<line x1="${centro}" y1="${centro}" x2="${x}" y2="${y}"/>`).join('')}
  </g>
  ${nodos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${radioNodo}" fill="#FFFFFF"/>`).join('')}
  <circle cx="${centro}" cy="${centro}" r="${radioCentro}" fill="#6FCF4F"/>`;

// Logotipo negativo a 46 px de alto: el símbolo y la palabra comparten la retícula, así que se escalan juntos.
const alto = 46;
const escala = alto / 106;
const logotipo = `
  <g transform="translate(${96 - 7 * escala} ${90 - 7 * escala}) scale(${escala})">
    ${simbolo}
    <path fill="#FFFFFF" fill-rule="nonzero" d="${PALABRA}"/>
  </g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0E3B2A"/>
  ${logotipo}
  <text x="96" y="318" font-family="Manrope" font-weight="700" font-size="76" fill="#FFFFFF">Cuentas claras</text>
  <text x="96" y="408" font-family="Manrope" font-weight="700" font-size="76" fill="#FFFFFF">con quien te paga.</text>
  <rect x="96" y="452" width="88" height="8" rx="4" fill="#6FCF4F"/>
  <text x="96" y="528" font-family="Manrope" font-weight="500" font-size="30" fill="#DCE8DC">La plata entra sola. Saber de quién es, no.</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(path.join(publicDir, 'og.png'));
console.log('Imágenes generadas en', publicDir);
