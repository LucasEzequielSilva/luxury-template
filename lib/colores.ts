/* Color del chasis por nombre comercial.

   El panel tenía una columna "Color Hex" que había que completar a mano con un
   código hexadecimal. Nadie que carga celulares tiene por qué saber qué es
   eso, y en la práctica quedó cargada al revés: "Blanco" con #1C1C1E (negro),
   "Gold" con #3A3A3C (gris). El círculo de color de la ficha salía de ahí, así
   que mostraba negro donde decía blanco.

   Ahora el tono se deduce del nombre del color, que es lo único que el
   vendedor escribe. La columna de hex queda sólo como salida de emergencia
   para un color que no esté en esta lista.

   Los tonos salieron de un relevamiento por generación de equipos y después
   pasaron por una verificación que compara nombre contra tono, para que no
   vuelva a entrar un "blanco" oscuro. Generado el 2026-09-08. */

const COLORES: Record<string, string> = {
  "alpine green": "#566754",
  "alpine green iphone 13 pro 13 pro max": "#566754",
  "amarillo": "#E6C255",
  "amarillo iphone 11": "#FCE384",
  "amarillo iphone 14": "#F5DE78",
  "amarillo iphone 15": "#E5E0C1",
  "amarillo yellow": "#F5CB53",
  "amarillo yellow switch lite": "#F5CB53",
  "azul": "#3A6EA8",
  "azul blue": "#4258A3",
  "azul blue switch lite": "#4258A3",
  "azul iphone 12 12 mini": "#04395E",
  "azul iphone 13 13 mini": "#246382",
  "azul iphone 14": "#A5B7C8",
  "azul iphone 15": "#CED5D9",
  "azul neblina": "#96AED1",
  "azul neon neon blue": "#00C3E3",
  "azul neon neon blue joy con": "#00C3E3",
  "azul oscuro": "#32374A",
  "azul pacifico": "#2E4B59",
  "azul pacifico iphone 12 pro 12 pro max": "#2E4B59",
  "azul profundo": "#32374A",
  "azul sierra": "#9FB9D1",
  "azul sierra iphone 13 pro 13 pro max": "#9FB9D1",
  "azul ultramar": "#9AADF6",
  "beige": "#CDBFA8",
  "black": "#3C4042",
  "black iphone 11 12 12 mini": "#201E24",
  "black negro": "#3C4049",
  "black negro galaxy a07": "#3C4049",
  "black titanium": "#3C3C3D",
  "blanco": "#FAFAFA",
  "blanco estelar": "#F5F0E8",
  "blanco estelar iphone 13 13 mini": "#F9F4EF",
  "blanco iphone 11 12 12 mini": "#F8F4F0",
  "blanco white": "#EFF1F3",
  "blanco white ps5 slim digital": "#EFF1F3",
  "blanco white switch oled": "#E9EBEA",
  "blue": "#3A6EA8",
  "blue black negro azulado": "#22252E",
  "blue black negro azulado galaxy a16": "#22252E",
  "blue iphone 12 12 mini": "#04395E",
  "blue iphone 13 13 mini": "#246382",
  "blue iphone 14": "#A5B7C8",
  "blue iphone 15": "#CED5D9",
  "blue titanium": "#36495B",
  "celeste": "#8FC4E8",
  "coral": "#FF7C81",
  "coral switch lite": "#FF7C81",
  "cosmic orange": "#F77E2D",
  "deep blue": "#32374A",
  "deep purple": "#5A5064",
  "desert titanium": "#BFA48F",
  "dorado": "#C7A45E",
  "dreamy purple morado": "#C7C6DE",
  "dreamy purple morado redmi 14c": "#C7C6DE",
  "gold": "#E2D6BD",
  "grafito": "#56554F",
  "grafito iphone 12 pro 13 pro": "#55534F",
  "graphite": "#56554F",
  "graphite iphone 12 pro 13 pro": "#55534F",
  "green": "#CAD4C5",
  "green iphone 11": "#ADE1CD",
  "green iphone 12 12 mini": "#DCF2D7",
  "green iphone 13 13 mini": "#384B37",
  "green verde": "#1B4544",
  "green verde galaxy a07": "#1B4544",
  "gris": "#8A8A8F",
  "gris espacial": "#52514E",
  "gris espacial iphone 11 pro 11 pro max": "#52514E",
  "gris gray": "#6C7175",
  "gris gray switch lite": "#6C7175",
  "gris oscuro": "#4F4F54",
  "lake green verde lago": "#DDE8D6",
  "lake green verde lago redmi a5": "#DDE8D6",
  "lavanda": "#DFCEEA",
  "lavender": "#DFCEEA",
  "light gray gris claro": "#D2D3D5",
  "light gray gris claro galaxy a16": "#D2D3D5",
  "light green verde claro": "#C6D5C6",
  "light green verde claro galaxy a16": "#C6D5C6",
  "light violet violeta claro": "#A8ADC3",
  "light violet violeta claro galaxy a07": "#A8ADC3",
  "lila": "#C4B2E4",
  "lime green verde lima": "#D0E3AD",
  "lime green verde lima redmi note 14": "#D0E3AD",
  "marron": "#7A5844",
  "medianoche": "#2A313A",
  "medianoche iphone 13 13 mini": "#212830",
  "midnight": "#2A313A",
  "midnight black negro medianoche": "#27272B",
  "midnight green": "#4E5851",
  "midnight green iphone 11 pro 11 pro max": "#4E5851",
  "midnight iphone 13 13 mini": "#212830",
  "mint green verde menta": "#A9C8CB",
  "mint green verde menta redmi 15c": "#A9C8CB",
  "mist blue": "#96AED1",
  "mist purple niebla purpura": "#BDBDDC",
  "mist purple niebla purpura redmi note 14": "#BDBDDC",
  "moonlight blue azul nocturno": "#2A4E93",
  "moonlight blue azul nocturno redmi 15c": "#2A4E93",
  "morado": "#E0D7E9",
  "morado iphone 11": "#D1CDDA",
  "morado iphone 12 12 mini": "#B7AFE6",
  "morado oscuro": "#5A5064",
  "naranja": "#D9782E",
  "naranja cosmico": "#F77E2D",
  "natural titanium": "#C2BCB2",
  "negro": "#3C4042",
  "negro black": "#323337",
  "negro black nintendo switch 2": "#323337",
  "negro black switch oled cuerpo": "#252629",
  "negro espacial": "#403E3C",
  "negro iphone 11 12 12 mini": "#201E24",
  "ocean blue azul oceano": "#86B4C8",
  "orange": "#D9782E",
  "oro": "#E2D6BD",
  "pacific blue": "#2E4B59",
  "pacific blue iphone 12 pro 12 pro max": "#2E4B59",
  "pink": "#F2ADDA",
  "pink iphone 13 13 mini": "#FADED7",
  "plata": "#DEDFE0",
  "plateado": "#C6C8C7",
  "product red": "#CE2033",
  "product red iphone 11": "#BA0C2E",
  "product red iphone 12 12 mini": "#DB3232",
  "product red iphone 13 13 mini": "#BF1024",
  "purple": "#E0D7E9",
  "purple iphone 11": "#D1CDDA",
  "purple iphone 12 12 mini": "#B7AFE6",
  "red": "#C0392F",
  "rojo": "#CE2033",
  "rojo iphone 11": "#BA0C2E",
  "rojo iphone 12 12 mini": "#DB3232",
  "rojo iphone 13 13 mini": "#BF1024",
  "rojo neon neon red": "#FF5A4F",
  "rojo neon neon red joy con": "#FF5A4F",
  "rosa": "#F2ADDA",
  "rosa iphone 13 13 mini": "#FADED7",
  "sage": "#A9B689",
  "sage green verde": "#A0A784",
  "sage green verde redmi 14c": "#A0A784",
  "salvia": "#A9B689",
  "sandy gold": "#DBD5C4",
  "sandy gold redmi a5": "#DBD5C4",
  "sierra blue": "#9FB9D1",
  "sierra blue iphone 13 pro 13 pro max": "#9FB9D1",
  "silver": "#DEDFE0",
  "space black": "#403E3C",
  "space gray": "#52514E",
  "space gray iphone 11 pro 11 pro max": "#52514E",
  "starlight": "#F5F0E8",
  "starlight iphone 13 13 mini": "#F9F4EF",
  "starry blue azul": "#33507F",
  "starry blue azul redmi 14c": "#33507F",
  "teal": "#B0D4D2",
  "titanio": "#8A8885",
  "titanio azul": "#36495B",
  "titanio blanco": "#F2F1ED",
  "titanio del desierto": "#BFA48F",
  "titanio desierto": "#BFA48F",
  "titanio natural": "#C2BCB2",
  "titanio negro": "#3C3C3D",
  "titanium": "#8A8885",
  "titanium black titanio negro": "#2E2F33",
  "titanium gray titanio gris": "#ACA7A2",
  "titanium silverblue titanio azul plateado": "#9EA5B6",
  "titanium whitesilver titanio blanco plateado": "#D0D1D3",
  "turquesa turquoise": "#00B6B9",
  "turquesa turquoise switch lite": "#00B6B9",
  "twilight orange naranja crepusculo": "#D89A85",
  "twilight orange naranja crepusculo redmi 15c": "#D89A85",
  "ultramarine": "#9AADF6",
  "ultramarino": "#9AADF6",
  "verde": "#CAD4C5",
  "verde alpino": "#566754",
  "verde alpino iphone 13 pro 13 pro max": "#566754",
  "verde azulado": "#B0D4D2",
  "verde iphone 11": "#ADE1CD",
  "verde iphone 12 12 mini": "#DCF2D7",
  "verde iphone 13 13 mini": "#384B37",
  "verde medianoche": "#4E5851",
  "verde medianoche iphone 11 pro 11 pro max": "#4E5851",
  "verde noche": "#4E5851",
  "verde noche iphone 11 pro 11 pro max": "#4E5851",
  "verde salvia": "#A9B689",
  "violeta": "#8A63C9",
  "white": "#FAFAFA",
  "white iphone 11 12 12 mini": "#F8F4F0",
  "white titanium": "#F2F1ED",
  "yellow": "#E6C255",
  "yellow iphone 11": "#FCE384",
  "yellow iphone 14": "#F5DE78",
  "yellow iphone 15": "#E5E0C1",
};

/* Sin acentos, sin mayúsculas y sin signos: "Titanio Azul" y "titanio azul"
   tienen que caer en la misma entrada. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* Busca el nombre completo y, si no está, va recortando palabras. Así
   "Verde agua" cae en "verde" y "Gris titanium" cae en "gris", sin necesidad
   de tener listada cada variante que se le ocurra escribir al vendedor. */
export function hexDeColor(nombre: string | undefined | null): string | undefined {
  if (!nombre) return undefined;
  const limpio = normalizar(nombre);
  if (!limpio) return undefined;
  if (COLORES[limpio]) return COLORES[limpio];

  const palabras = limpio.split(" ");
  for (let fin = palabras.length - 1; fin > 0; fin--) {
    const clave = palabras.slice(0, fin).join(" ");
    if (COLORES[clave]) return COLORES[clave];
  }
  for (let ini = 1; ini < palabras.length; ini++) {
    const clave = palabras.slice(ini).join(" ");
    if (COLORES[clave]) return COLORES[clave];
  }
  return undefined;
}
