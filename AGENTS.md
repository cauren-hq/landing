# Landing de Cauren — Instrucciones para agentes

Este repositorio es público y contiene solo la landing de `cauren.app`. El producto, sus especificaciones y la guía de marca están en el repositorio privado `cauren-hq/cauren`; no copiar aquí especificaciones, código ni documentos internos.

## Idioma y voz

- Todo el texto, la documentación y los commits van en español, con terminología del contexto argentino.
- La voz es clara, directa y cercana, con voseo rioplatense y frases breves. El lema vigente es «Conectá tus cobros. Ordená tu negocio.».
- En la prosa, los importes y las cantidades usan punto para los miles y coma para los decimales («ARS 80.000»). En la interfaz, un importe se muestra como en la aplicación: `Intl.NumberFormat('es-AR', { style: 'currency', currency })`, por ejemplo «$ 80.000,00», con espacio de no separación.

## Marca

- Paleta: Pino `#0E3B2A` (principal), Bosque `#1F7A45` (texto destacado y enlaces), Brote `#6FCF4F` (acento, solo en elementos gráficos, nunca como color de texto), Salvia `#DCE8DC` (líneas y estados suaves), Niebla `#F4F7F3` (fondo), Tinta `#13201A` (texto). Están definidos como tokens en `src/styles/global.css`.
- Tipografía: Manrope (Regular, Medium, SemiBold, Bold).
- El símbolo se usa con sus trazados originales: no redibujarlo, deformarlo ni cambiar sus proporciones. Tamaño mínimo a una tinta: 24 px.

## Contenido

- El texto describe solo capacidades del MVP vigente de Cauren: ventas, cuotas, Mercado Pago, efectivo registrado, enlace para comprobantes, coincidencias explicadas con confirmación humana, saldos y auditoría.
- No presentar como disponibles la facturación electrónica o ARCA, WhatsApp, la importación bancaria, otras billeteras ni la confirmación automática. Ante una duda, consultar `docs/product/mvp-scope.md` en `cauren-hq/cauren`.
- No afirmar nada sobre competidores.
- No recolectar datos personales. El contacto es `mailto:info@cauren.app`.

## Técnica

- Astro con TypeScript estricto, Tailwind CSS 4 y MDX. Las islas de React se agregan solo cuando un componente lo necesite.
- El sitio funciona sin JavaScript y cumple accesibilidad básica: contraste AA, `lang="es-AR"`, texto alternativo y navegación por teclado.
- Versiones fijadas en `pnpm-lock.yaml`. No agregar dependencias que el sitio no use.
- Antes de commitear: `pnpm typecheck` y `pnpm build` sin errores.
