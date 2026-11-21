# Landing de deQuien

Sitio público de [deQuien](https://dequien.app): cuentas claras con quien te paga. Es un sitio estático hecho con Astro, TypeScript, Tailwind CSS y MDX, publicado en GitHub Pages con el dominio `dequien.app`.

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
| `src/lib/marca.js` | Trazados del logotipo y medidas del símbolo, tomados de la guía de marca |
| `src/styles/global.css` | Paleta y tipografía de la guía de marca como tokens de Tailwind |
| `public/` | `CNAME`, `robots.txt`, favicons, ícono e imagen OpenGraph |
| `scripts/generar-imagenes.mjs` | Genera los PNG de `public/` desde el ícono y los datos de marca |
| `scripts/verificar-build.mjs` | Verifica la salida del build (`pnpm verify`); el workflow lo corre en cada ejecución |

El sitemap (`sitemap-index.xml`) lo genera `@astrojs/sitemap` en cada build. Las URL canónicas salen de `site` en `astro.config.mjs`.

## Imágenes de marca

El logotipo se arma con dos piezas que comparten la retícula de 120 unidades de la guía de marca:

- `src/components/Simbolo.astro`: el símbolo se construye con las medidas del manual (nodo central de radio 26, cuatro nodos de radio 15 a 38 u del centro y conectores de 11 u), no se redibuja. `public/favicon.svg` es el ícono de aplicación: el mismo símbolo sobre Pino.
- `src/lib/marca.js`: los trazados de la palabra «deQuien» («de» en Manrope Regular y «Quien» en Manrope Bold) extraídos del PDF de identidad de marca v2.0.

Para regenerar los PNG alcanza con este repositorio; no hace falta el repo privado. La imagen OG lleva texto, así que necesita Manrope instalada como fuente del sistema (o accesible por fontconfig):

```bash
node scripts/generar-imagenes.mjs
```

## Publicación

El workflow `.github/workflows/deploy.yml` verifica tipos, hace el build y corre `pnpm verify` en cada PR. Con cada push a `main` además publica `dist/` en GitHub Pages.

### Configuración inicial (una sola vez)

1. **Pages:** en *Settings → Pages* del repositorio, elegir **GitHub Actions** como origen.
2. **Verificación del dominio:** en la organización, *Settings → Pages → Add a domain*, agregar `dequien.app` y crear en Cloudflare el registro TXT que indique GitHub (`_github-pages-challenge-cauren-hq.dequien.app`). Así nadie más puede usar el dominio en otro repositorio de Pages.
3. **DNS en Cloudflare**, todos en modo *DNS only* (nube gris, sin proxy) para que GitHub pueda emitir el certificado:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `dequien.app` | `185.199.108.153` |
   | A | `dequien.app` | `185.199.109.153` |
   | A | `dequien.app` | `185.199.110.153` |
   | A | `dequien.app` | `185.199.111.153` |
   | AAAA | `dequien.app` | `2606:50c0:8000::153` |
   | AAAA | `dequien.app` | `2606:50c0:8001::153` |
   | AAAA | `dequien.app` | `2606:50c0:8002::153` |
   | AAAA | `dequien.app` | `2606:50c0:8003::153` |
   | CNAME | `www` | `cauren-hq.github.io` |

   No tocar los registros MX y TXT del correo de Zoho (`info@dequien.app`).
4. **Dominio propio:** en *Settings → Pages*, cargar `dequien.app` como *Custom domain*. Cuando GitHub emita el certificado, activar **Enforce HTTPS**. `.app` exige HTTPS en todos los navegadores, así que el sitio no carga hasta que el certificado esté listo.

Fuente de los valores: [documentación de GitHub Pages sobre dominios propios](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
