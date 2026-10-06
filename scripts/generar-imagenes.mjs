// Genera los PNG de `public/` (favicons, ícono e imagen OG) desde los originales de marca de
// `cauren-hq/cauren` (docs/ux/assets). Uso y requisitos en README.md.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// sharp llega como dependencia opcional de Astro; se resuelve desde Astro para no duplicarla.
const desdeAstro = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
const sharp = desdeAstro('sharp');

const [, , assetsDir, publicDir = 'public'] = process.argv;
if (!assetsDir) {
  throw new Error('Uso: node scripts/generar-imagenes.mjs <ruta a docs/ux/assets> [public]');
}

const icono = path.join(assetsDir, 'cauren-icono-app-1024.png');

await sharp(icono).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32.png'));
await sharp(icono).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
await sharp(icono).resize(512, 512).png().toFile(path.join(publicDir, 'icono-512.png'));

const svg = fs.readFileSync(path.join(assetsDir, 'cauren-icono-app.svg'), 'utf8');
const trazados = [...svg.matchAll(/<path fill="(#[0-9A-F]+)" d="([^"]+)"/g)].map((m) => ({ fill: m[1], d: m[2] }));
if (trazados.length !== 2) throw new Error('No se encontraron los dos trazados del símbolo.');
const simbolo = trazados.map((t) => `<path fill="${t.fill}" d="${t.d}"/>`).join('');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0E3B2A"/>
  <g transform="translate(860 150) scale(2.75)" opacity="0.18">${simbolo}</g>
  <g transform="translate(96 92) scale(0.6)">${simbolo}</g>
  <text x="182" y="137" font-family="Manrope" font-weight="600" font-size="38" letter-spacing="5.5" fill="#FFFFFF">CAUREN</text>
  <text x="96" y="318" font-family="Manrope" font-weight="700" font-size="76" fill="#FFFFFF">Conectá tus cobros.</text>
  <text x="96" y="408" font-family="Manrope" font-weight="700" font-size="76" fill="#FFFFFF">Ordená tu negocio.</text>
  <rect x="96" y="460" width="88" height="8" rx="4" fill="#6FCF4F"/>
  <text x="96" y="530" font-family="Manrope" font-weight="500" font-size="30" fill="#DCE8DC">Conciliación de cobros para empresas argentinas</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(path.join(publicDir, 'og.png'));
console.log('Imágenes generadas en', publicDir);
