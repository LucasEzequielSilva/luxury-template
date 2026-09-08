# Guía rápida: cargar y editar productos

La web lee el catálogo desde Airtable. Todo lo que cambies ahí aparece en la página en menos de un minuto, sin tocar código y sin ningún botón de "enviar".

**Panel:** https://airtable.com/appkJDEph0wKYmMIJ

## Cargar un equipo nuevo

1. Tocá **+ Agregar** (o duplicá una fila parecida con clic derecho → *Duplicate record*).
2. Completá:
   - **Modelo**: elegilo siempre de la lista desplegable. Es el campo más importante: con él la web arma el título, agrupa el stock y muestra el bloque de la serie. Si falta un modelo, avisale a Lucas.
   - **Capacidad** y **Color**: cada uno en su casillero. No hace falta repetirlos en el nombre, la web los agrega sola.
   - **Color**: escribí el nombre común y listo (`Blanco`, `Negro`, `Gold`, `Titanio Azul`). No hay que cargar ningún código de color.
   - **Nombre**: es solo para vos, para encontrar la fila en el panel. **No se muestra en la web.** Poné lo que te sirva.
   - **Categoría**: `iphone`, `android` o `consolas`.
   - **Condición**: `Sellado`, `A+`, `A`, `B` o `C`.
   - **Batería %**: escribí el número que te da el equipo en Ajustes (por ejemplo `92`). Con eso alcanza: la web sola lo muestra como "90% o más". En sellados dejalo vacío, ya se entiende que es 100%.
   - **Precio USD**: el precio de venta. La web lo pasa a pesos sola.
   - **Precio Original USD** (opcional): si lo completás, la web muestra el descuento.
   - **Fotos**: arrastrá las imágenes al campo. La primera es la que se ve en la tarjeta, el resto se ven en la ficha del equipo.
3. Tildá **Publicado**. Sin ese tilde el equipo no aparece en la web.

## Por qué cargás 11 equipos y ves menos tarjetas

En la sección **Stock** la web muestra **una tarjeta por modelo**, no una por equipo. Si cargás tres iPhone 16 Pro Max, los tres entran en la misma tarjeta.

No se pierde ninguno: la tarjeta avisa cuántos hay ("5 disponibles"), muestra los colores en puntitos y arranca el precio desde el más barato. Al entrar se eligen el color y la capacidad.

Está hecho así a propósito, para que la grilla no se llene de repetidos del mismo modelo cuando tengas mucho stock.

## Cambiar precio, foto o cualquier dato

Hacé clic en la celda y editala. Se guarda solo y la web se actualiza sola.

## Vender un equipo o sacarlo de la web

Destildá **Publicado**. No hace falta borrar la fila: así te queda el historial.

## Destacados

Tildá **Destacado** en los equipos que quieras mostrar en la sección "Los que más se venden" de la portada. Se muestran hasta 6.

## El precio del dólar

En la tabla **Ajustes** hay un campo **Precio del dólar**.

- Si lo dejás **vacío**, la web toma el dólar blue del día sola.
- Si ponés un número, manda ese: todos los precios en pesos se calculan con esa cotización hasta que lo borres.

## Reseñas

Las reseñas que dejan los clientes caen en la tabla **Reseñas** y **no salen publicadas hasta que vos las apruebes**. Para publicar una, tildá **Publicada**. Si no querés que salga, dejala sin tildar.

## Consejos para las fotos

- Foto real del equipo, fondo limpio, formato vertical o cuadrado.
- Hasta 3 o 4 fotos por equipo alcanza: frente, dorso y detalle de pantalla.
- Si un equipo no tiene foto, la web muestra un fondo con el color del equipo.
