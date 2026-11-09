// Los tres correos de la landing. No se recolectan datos: el visitante escribe desde su propio correo.
const CORREO = 'info@cauren.app';

const mailto = (asunto: string, cuerpo: string) =>
  `mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

export const correo = CORREO;

export const lanzamiento = mailto(
  'Quiero anotarme al lanzamiento de Cauren',
  'Hola, quiero anotarme al lanzamiento de Cauren.\n\nMe dedico a:\nLes cobro a unas ... personas, por transferencia.\n\nGracias.',
);

export const piloto = mailto(
  'Quiero sumarme al piloto de Cauren',
  'Hola, quiero sumarme al piloto de Cauren.\n\nMe dedico a:\nCómo cobro hoy:\nA cuántas personas les cobro:\n\nGracias.',
);

export const consulta = mailto('Tengo una consulta sobre Cauren', 'Hola, tengo una consulta sobre Cauren:\n\n\n\nGracias.');
