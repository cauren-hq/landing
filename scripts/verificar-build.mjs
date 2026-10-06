// Verifica la salida de `pnpm build` contra los criterios de la especificación de la landing:
// archivos publicados, SEO de la portada, 404, robots y sitemap. Falla con la lista de problemas.
import fs from 'node:fs';
import path from 'node:path';

const SITIO = 'https://cauren.app';
const CORREO = 'info@cauren.app';
const dist = process.argv[2] ?? 'dist';
const problemas = [];

const leer = (archivo) => {
  const ruta = path.join(dist, archivo);
  if (!fs.existsSync(ruta)) {
    problemas.push(`Falta ${archivo}`);
    return '';
  }
  return fs.readFileSync(ruta, 'utf8');
};
const exigir = (condicion, mensaje) => {
  if (!condicion) problemas.push(mensaje);
};
const atributo = (html, patron) => html.match(patron)?.[1];

// Portada: un único h1, canonical y OpenGraph absolutos, JSON-LD válido y contacto.
const inicio = leer('index.html');
if (inicio) {
  exigir((inicio.match(/<h1[\s>]/g) ?? []).length === 1, 'index.html debe tener un único <h1>');
  exigir(/<html[^>]*lang="es-AR"/.test(inicio), 'index.html debe declarar lang="es-AR"');
  exigir(
    atributo(inicio, /<link rel="canonical" href="([^"]+)"/) === `${SITIO}/`,
    `La canonical de la portada debe ser ${SITIO}/`,
  );
  exigir(atributo(inicio, /<meta property="og:url" content="([^"]+)"/) === `${SITIO}/`, `og:url debe ser ${SITIO}/`);
  exigir(
    atributo(inicio, /<meta property="og:image" content="([^"]+)"/) === `${SITIO}/og.png`,
    `og:image debe ser ${SITIO}/og.png`,
  );
  for (const meta of ['og:title', 'og:description', 'twitter:card', 'description']) {
    exigir(new RegExp(`(property|name)="${meta}" content="[^"]+"`).test(inicio), `Falta el metadato ${meta}`);
  }
  const bloques = [...inicio.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
  exigir(bloques.length > 0, 'Falta el JSON-LD de la portada');
  for (const bloque of bloques) {
    try {
      const tipos = (JSON.parse(bloque)['@graph'] ?? []).map((nodo) => nodo['@type']);
      exigir(tipos.includes('Organization') && tipos.includes('WebSite'), 'El JSON-LD debe incluir Organization y WebSite');
    } catch (error) {
      problemas.push(`El JSON-LD no es JSON válido: ${error.message}`);
    }
  }
  exigir(inicio.includes(`href="mailto:${CORREO}"`), `Falta el enlace mailto:${CORREO}`);
}

// 404: propia, fuera del índice y con enlace a la portada.
const noEncontrada = leer('404.html');
if (noEncontrada) {
  exigir(noEncontrada.includes('<meta name="robots" content="noindex">'), '404.html debe tener noindex');
  exigir(!noEncontrada.includes('rel="canonical"'), '404.html no debe declarar canonical');
  exigir(noEncontrada.includes('href="/"'), '404.html debe enlazar a la portada');
}

// Rastreadores: robots permite todo y apunta al sitemap; el sitemap solo lista URL de cauren.app.
const robots = leer('robots.txt');
if (robots) {
  exigir(/^Allow: \/$/m.test(robots), 'robots.txt debe permitir todo');
  exigir(robots.includes(`Sitemap: ${SITIO}/sitemap-index.xml`), 'robots.txt debe apuntar al sitemap');
}
leer('sitemap-index.xml');
const urls = fs
  .readdirSync(dist)
  .filter((archivo) => /^sitemap-\d+\.xml$/.test(archivo))
  .flatMap((archivo) => [...leer(archivo).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
exigir(urls.includes(`${SITIO}/`), 'El sitemap debe incluir la portada');
exigir(
  urls.every((url) => url.startsWith(`${SITIO}/`) && !url.includes('404')),
  `El sitemap solo debe listar páginas de ${SITIO}, sin la 404`,
);

// Recursos y anclas: cada recurso propio que citan las páginas existe en dist/, y cada enlace a
// una sección de la portada apunta a un id que existe.
const aRuta = (url) => decodeURIComponent(new URL(url, `${SITIO}/`).pathname).replace(/^\//, '');
const idsInicio = new Set([...inicio.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [archivo, html] of [
  ['index.html', inicio],
  ['404.html', noEncontrada],
]) {
  const recursos = [
    ...html.matchAll(/<link rel="(?:icon|apple-touch-icon)" href="([^"]+)"/g),
    ...html.matchAll(/<meta (?:property|name)="(?:og:image|twitter:image)" content="([^"]+)"/g),
    ...html.matchAll(/"logo":"([^"]+)"/g),
  ].map((m) => m[1]);
  for (const recurso of recursos.filter((url) => url.startsWith('/') || url.startsWith(SITIO))) {
    exigir(fs.existsSync(path.join(dist, aRuta(recurso))), `${archivo} cita ${recurso}, que no está en ${dist}`);
  }
  for (const [, ancla] of html.matchAll(/href="\/?#([^"]+)"/g)) {
    exigir(idsInicio.has(ancla), `${archivo} enlaza a #${ancla}, que no existe en la portada`);
  }
}

// Dominio propio.
exigir(leer('CNAME').trim() === 'cauren.app', 'CNAME debe contener cauren.app');

if (problemas.length > 0) {
  console.error(`La verificación del build encontró ${problemas.length} problema(s):`);
  for (const problema of problemas) console.error(`- ${problema}`);
  process.exit(1);
}
console.log('Build verificado: archivos, SEO, 404, robots, sitemap, CNAME, recursos y anclas.');
