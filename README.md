# Landing de Cauren

Sitio público de [Cauren](https://cauren.app): conciliación de cobros para empresas argentinas. Es un sitio estático hecho con Astro, TypeScript, Tailwind CSS y MDX, publicado en GitHub Pages con el dominio `cauren.app`.

El producto se desarrolla en el repositorio privado `cauren-hq/cauren`, que guarda la especificación de esta landing (`_bmad-output/implementation-artifacts/spec-landing-page.md`), la guía de marca y el alcance del MVP. Este repositorio solo contiene la landing.

## Desarrollo local

Requisitos: Node.js 22 (ver `.nvmrc`) y pnpm mediante corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev          # servidor local en http://localhost:4321
pnpm typecheck    # astro check
pnpm build        # genera dist/
pnpm verify       # verifica dist/: SEO, 404, robots, sitemap, CNAME, recursos y anclas
pnpm preview      # sirve dist/ localmente
```

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/content/inicio.mdx` | Texto de la portada, con título y descripción para SEO en el frontmatter |
| `src/pages/` | Portada (`index.astro`) y página 404 |
| `src/components/` | Secciones, símbolo y logotipo, metadatos (`Seo.astro`) |
| `src/styles/global.css` | Paleta y tipografía de la guía de marca como tokens de Tailwind |
| `public/` | `CNAME`, `robots.txt`, favicons, ícono e imagen OpenGraph |
| `scripts/generar-imagenes.mjs` | Genera los PNG de `public/` desde los originales de marca |
| `scripts/verificar-build.mjs` | Verifica la salida del build (`pnpm verify`); el workflow lo corre en cada ejecución |

El sitemap (`sitemap-index.xml`) lo genera `@astrojs/sitemap` en cada build. Las URL canónicas salen de `site` en `astro.config.mjs`.

## Imágenes de marca

El símbolo (`src/components/Simbolo.astro`) y `public/favicon.svg` usan los trazados originales de `cauren-icono-app.svg`, sin redibujar. El logotipo del encabezado es provisorio: el símbolo más «CAUREN» en Manrope, hasta que haya un archivo vectorial del logotipo.

Para regenerar los PNG hace falta un clon de `cauren-hq/cauren` y Manrope instalada como fuente del sistema (o accesible por fontconfig), porque la imagen OG tiene texto:

```bash
node scripts/generar-imagenes.mjs ../cauren/docs/ux/assets
```

## Publicación

El workflow `.github/workflows/deploy.yml` verifica tipos, hace el build y corre `pnpm verify` en cada PR. Con cada push a `main` además publica `dist/` en GitHub Pages.

### Configuración inicial (una sola vez)

1. **Pages:** en *Settings → Pages* del repositorio, elegir **GitHub Actions** como origen.
2. **Verificación del dominio:** en la organización, *Settings → Pages → Add a domain*, agregar `cauren.app` y crear en Cloudflare el registro TXT que indique GitHub (`_github-pages-challenge-cauren-hq.cauren.app`). Así nadie más puede usar el dominio en otro repositorio de Pages.
3. **DNS en Cloudflare**, todos en modo *DNS only* (nube gris, sin proxy) para que GitHub pueda emitir el certificado:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `cauren.app` | `185.199.108.153` |
   | A | `cauren.app` | `185.199.109.153` |
   | A | `cauren.app` | `185.199.110.153` |
   | A | `cauren.app` | `185.199.111.153` |
   | AAAA | `cauren.app` | `2606:50c0:8000::153` |
   | AAAA | `cauren.app` | `2606:50c0:8001::153` |
   | AAAA | `cauren.app` | `2606:50c0:8002::153` |
   | AAAA | `cauren.app` | `2606:50c0:8003::153` |
   | CNAME | `www` | `cauren-hq.github.io` |

   No tocar los registros MX y TXT del correo de Zoho (`info@cauren.app`).
4. **Dominio propio:** en *Settings → Pages*, cargar `cauren.app` como *Custom domain*. Cuando GitHub emita el certificado, activar **Enforce HTTPS**. `.app` exige HTTPS en todos los navegadores, así que el sitio no carga hasta que el certificado esté listo.

Fuente de los valores: [documentación de GitHub Pages sobre dominios propios](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
