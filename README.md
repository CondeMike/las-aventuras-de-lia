# Las Aventuras de Lía — Reino Cuadrado (v4)

Aventura por escenas para practicar la tabla del 4 completa. Lía no "hace
ejercicios": recupera tres cristales, y cada avance abre un lugar nuevo del reino.

## Cómo jugar

1. Abre `index.html` con doble clic.
2. Pulsa **Empezar la misión**.

Funciona sin servidor, sin conexión y sin dependencias. Si el navegador bloquea
`localStorage` al abrir archivos locales, levanta un servidor desde esta carpeta:

```bash
python3 -m http.server 8000   # luego abre http://localhost:8000
```

## El recorrido

Diecinueve pasos, unos 20 minutos, cada uno con su escena. La aventura tiene dos
mitades con propósitos distintos:

**La secuencia** — los diez retos en orden, de 4×1 a 4×10. Sirve para
*comprender*: grupos visibles que se pueden contar y ayuda si hace falta.

**La lucha** — Quatron pregunta al azar sobre toda la familia del 4. Sirve para
*recordar*: no hay nada que contar, solo la respuesta.

| # | Escena | Qué pasa |
|---|--------|----------|
| 0 | Portada | Lía y Nubo frente al castillo |
| 1 | Mapa | Ruta de los tres cristales |
| 2 | La linterna de Nubo | **4×1** — un solo grupo, para empezar ganando |
| 3 | El jardín dormido | **4×2** — el fondo *es* el reto: dos canteros de cuatro flores |
| 4 | La puerta de piedra | **4×3** → ◆ cristal 1 |
| 5 | El cofre de Nubo | Recompensa: un tesoro que se guarda |
| 6 | Mapa | Una torre ya encendida |
| 7 | Las cuatro torres | **4×4** |
| 8 | El claro de los cristales | **4×5** en formato inverso (`4 × ? = 20`) |
| 9 | La escalinata de flores | **4×6** → ◆ cristal 2 |
| 10 | Lluvia de estrellas | Cinco rondas: el cartel pide `4 × b` y hay que atrapar la estrella con el resultado |
| 11 | Mapa | Falta el último cristal |
| 12 | Las siete losas | **4×7** |
| 13 | La veta de cristal | **4×8** (`4 × ? = 32`) |
| 14 | El cielo del atardecer | **4×9** |
| 15 | El muro de hiedra | **4×10** (`4 × ? = 40`) |
| 16 | Quatron | Jefe de 5 bloques, al azar sobre toda la tabla → ◆ cristal 3 |
| 17 | ¡El reino brilla! | Victoria y mapa de poderes |
| 18 | Continuará… | Lía frente al cuadro: el gancho para mañana |

Las once ilustraciones se reparten entre diecinueve escenas, así que seis se
repiten con otro encuadre —nunca dos seguidas, y siempre con varias escenas de
por medio—. Dos repeticiones son deliberadas: el sendero del castillo (pasos 0 y
2) es de donde Lía baja al empezar, y la escalinata de flores (pasos 9 y 18) es
el mismo sitio al que vuelve al final, cuando *ahora sí* ve el cuadro.

## Decisiones de diseño

**La escena es la recompensa.** Cada paso cambia el fondo, el color de acento y
lo que dice Nubo. Avanzar no da puntos: abre un lugar nuevo.

**Tres materiales, y ninguno más.** Las once ilustraciones se construyen con
piedra (lo que sostiene), oro (lo conseguido, lo que se puede tocar) y cristal
(lo mágico, lo que se pregunta). La interfaz usaba un cuarto material que no
aparece en ninguna imagen: el vidrio esmerilado. Los paneles son placas de
piedra con banda de oro remachada y la clave del arco engastada; las respuestas
son prismas facetados; los bloques de Quatron son los cubos de los que está
hecho Quatron; las chispas son destellos de cuatro puntas, que es el número del
juego. No hay ni un rectángulo redondeado en el arte, así que tampoco aquí.

**Se difumina la interfaz, nunca el mundo.** Un `backdrop-filter` bajo el panel
desenfocaba la escena y con eso anunciaba "la historia se detiene, haz el
ejercicio". Ahora el fondo se ve entero, los grupos se apoyan en el suelo en vez
de vivir en una segunda caja, y el follaje de las esquinas mete la cámara dentro
del mundo. Solo cuando la gema está en el aire se aparta la placa —y sigue
nítido el sitio donde está pasando.

**Nada revela la respuesta.** Al fallar, Nubo sube un peldaño de ayuda —primero
conteo de 4 en 4, después suma repetida— y la pregunta sigue ahí. No hay
contador de errores en pantalla.

**La respuesta correcta cambia de sitio.** Las opciones se barajan en cada reto
(≈33 % en cada posición) y los distractores mezclan múltiplos vecinos con la
confusión clásica de sumar en vez de multiplicar (`4 + 6` frente a `4 × 6`).

**La lluvia de estrellas es el puente.** Entre la secuencia (contar) y la lucha
(recordar) hace falta un escalón: recordar deprisa pero sin que pase nada si
fallas. El cartel de la esquina pide `4 × b` y caen cuatro estrellas con
resultados; acertar no acorta la partida, deja tiempo de recoger las que sobran
—ese es el premio por acertar rápido—. Las cuatro estrellas de una ronda caen
**siempre a la misma velocidad**: si la buena bajara más rápido que las otras,
el juego estaría decidiendo por azar quién acierta. El ritmo vive en
`contenido.js` (`caida`, `cadencia`) para poder afinarlo sin tocar código: hoy
son 4,1 s de caída y una ronda nueva cada 4,2 s. Los dos valores se mueven
juntos: al empezar una ronda se limpia el cielo, así que el tiempo real para
responder es el menor de los dos, y bajar solo la velocidad haría que las
estrellas se borraran a mitad de vuelo sin dar ni un segundo más. Al acabar,
un botón lateral vuelve a empezar: repetir una ronda de recuperación es
exactamente la práctica que se busca, así que el botón no se agota. Las preguntas salen **solo de lo ya
enseñado**, nunca de un reto que todavía no ha llegado, y con el mismo sorteo
sesgado de Quatron. Los aciertos se anotan al vuelo: cuentan para lo que Quatron
tiene que repasar, pero no para los retos resueltos ni para las estrellas de
poder, porque atinar en tres segundos entre cuatro estrellas es recordar bajo
presión, no resolver un reto. Los fallos no se anotan en ningún sitio: en la
lluvia también se falla por puntería, y eso no dice nada de la tabla. Una partida perfecta da 20 estrellas, que sigue siendo `5 × 4`.

**Se repite porque hay algo esperando, no porque se pierda algo.** Cinco de
cinco se lleva el primer premio que le falte a Nubo de una escalera de cinco:
👑 corona, 🏅 medalla, 🔔 cascabel, 🍪 galleta, 💫 polvo de estrella. La corona va
primera porque Nubo ya la lleva puesta en la ilustración del cofre y en la del
mapa: el premio no inventa nada, explica de dónde salió. Al terminar se ve
**cuál es el siguiente**, con su nombre y su icono —un premio en abstracto no
engancha a nadie—, y se guardan entre sesiones: son una colección, no una
puntuación.

**La apuesta se dice cuando empieza a caer, no antes.** Antes de pulsar, Nubo
explica el juego; en cuanto cae la primera estrella el texto cambia a lo que
está en juego —"¡Acierta las 5 y Nubo gana 👑 Corona de Nubo!"—, porque sin
apuesta atrapar la cuarta da igual que fallarla.

**Cada vuelta va más rápida.** La caída se acorta un 18 % acumulado por partida
seguida (4,1 s → 3,5 → 3,0 → 2,7 → 2,4 → 2,2…) con un suelo de 1,6 s para que no
acabe siendo imposible. Se acelera solo dentro de la misma visita: quien vuelve
otro día empieza tranquila. Cuando ya están los cinco premios el botón pasa a
decir "¡Otra vez, más rápido!" y lo que queda en juego es batir la vuelta
anterior.

**Quatron es azar con memoria.** Sus cinco preguntas se sortean sobre toda la
familia del 4, así que la pelea nunca es igual dos veces. Pero el sorteo va
sesgado por `dominio`: lo que Lía falló entra con más papeletas. Medido sobre
400 peleas, una operación fallada tres veces sale el **100 %** de las veces,
mientras las demás se reparten el resto en torno al 43 %.

**El hecho es lo más grande de la pantalla.** `4 × 6 = ?` está en pantalla
desde el primer segundo, al mismo cuerpo que la operación del jefe, y el `?` se
llena al acertar. Antes vivía en un subtítulo de 0.92rem al 69 % de opacidad,
debajo de un nombre de escena de 2.4rem: la jerarquía visual iba al revés de la
jerarquía de aprendizaje.

**Dos capas de lenguaje que no se mezclan.** Nubo habla rico y variable
—canteros, vetas, bandadas—, que es donde se aprenden palabras nuevas sin tener
que calcular a la vez. La pregunta, la lectura y las pistas dicen siempre
**grupo**: la multiplicación es la invariancia del grupo, así que el nombre no
puede cambiar diez veces. Debajo del hecho van sus dos puentes: *"el 4, tres
veces"* (hacia la voz, y de paso fija el orden de los factores: decir "3 grupos
de 4" mientras se lee `4 × 3` enseña el error más común) y *"3 grupos de 4
diamantes"* (hacia la imagen).

**Toda pista empieza por un verbo que se hace con el dedo.** "Mira bien todos
los canteros" no es una estrategia: no dice qué mirar ni qué hacer. "Cuenta los
grupos: 1, 2, 3" sí. Y la pista va *entre* la pregunta y las gemas, porque
debajo de las opciones llegaba después de la decisión.

**El elogio no se regala.** "¡Casi!" con 7 cuando la respuesta era 12 no es
casi, y un elogio que no discrimina deja de informar. Al fallar: neutro y con
estrategia. Al acertar sin ayuda: se nombra lo que hizo, no lo que es.

**La aventura se abre y se cierra con los dos.** En el epílogo Lía y Nubo
vuelven a estar de pie en la escena, a tamaño de personaje y no de avatar,
detrás del panel y del globo, con la luz del farol que ya está pintado ahí
dándoles en el borde. Empiezan mirando el castillo y terminan mirando el cuadro;
la última pantalla no podía ser la única en la que no aparecen.

La altura de Nubo se deriva de la de Lía (`--alto * .42`), así que la pareja no
se descompensa por mucho que cambie el tamaño: es un cachorro sentado a su lado,
no un icono. Y el alto se topa en `66dvh`, porque sin tope un portátil bajito la
deja sin cabeza. Con la izquierda ocupada, el texto se va a la derecha en
pantallas anchas y arriba en vertical: deja de ser una pantalla centrada y pasa
a ser una página ilustrada. `marco()` acepta `figuras`, así que plantar
personajes en cualquier escena es una línea de datos.

**El mapa de poderes enseña el hecho entero.** En la pantalla de victoria cada
losa pone `4 × 7 = 28`, no `4 × 7`: una operación sin resultado no es un poder,
es una pregunta pendiente. Y la marca de dominio va **dicha con palabras** —
"sin ayuda", "casi", "con ayuda", "todavía no"— junto a tres cristalitos de oro.
Antes eran ★★☆, que en este juego ya significan otra cosa: las estrellas que se
atrapan en la lluvia. Unas estrellas sueltas al lado de una multiplicación no
dicen nada por sí solas, y una leyenda que hay que memorizar tampoco: cada
rótulo se explica a sí mismo. Los cristalitos son de oro y no cian porque en el
sistema de materiales el oro es lo conseguido.

**Se refuerza produciendo, no reconociendo.** Al acertar, Lía arrastra el
resultado hasta su casilla y ve el hecho completo `4 × 6 = 24`.

**Los días no se pierden.** `diasDeAventura` solo suma. No hay racha que romper.

**El error nunca se muestra como error.** El resumen final habla de *poderes*
(★★☆ por operación), no de aciertos y fallos.

## Progreso guardado

Clave `aventurasDeLia.v4` en `localStorage`: paso actual, cristales, tesoros,
estrellas del minijuego, dominio por operación, métricas de sesión, historial
acumulado y preferencia de sonido. Todo se valida al cargar: un dato corrupto
no rompe la partida.

Al cambiar de versión la aventura vuelve a empezar, pero Lía no pierde lo suyo:
días jugados, poderes conseguidos y tesoros se rescatan de la partida anterior.

**↻ Reiniciar** pide confirmación, vuelve al comienzo y conserva tesoros,
poderes e historial.

## Estructura

- `index.html` — entrada.
- `css/game.css` — escenas a pantalla completa, HUD, paneles y animaciones.
- `js/contenido.js` — **los 14 pasos como datos**: fondo, encuadre, acento, voz
  de Nubo y reto. Agregar un mundo nuevo es agregar datos aquí.
- `js/progreso.js` — estado persistente y selección adaptativa de repaso.
- `js/sonidos.js` — efectos con Web Audio, sin archivos externos.
- `js/escenas.js` — dibujado de cada tipo de escena.
- `js/game.js` — flujo, respuestas, minijuego, jefe y transiciones.

## Imágenes

Los originales se conservan; el juego carga copias ligeras.

| Carpeta | Qué es |
|---------|--------|
| `assets/reino-cuadrado/fondos/` | Originales PNG, ~2,4 MB c/u. **No se cargan.** |
| `assets/reino-cuadrado/fondos-web/` | Lo que usa el juego: JPEG 1280 px, ~280 KB c/u (25 MB → 3,3 MB) |
| `assets/personajes/` | Originales de Lía y Nubo, 1,5–2 MB c/u. **No se cargan.** |
| `assets/personajes/web/` | Lo que usa el juego: 195 KB c/u |

Nubo sale en todas las escenas, así que su peso importa más que el de cualquier
fondo. Una pantalla cuesta ~500 KB, y el juego **precarga siempre el fondo
siguiente** mientras Lía resuelve el reto actual: el cambio de escena —que es la
recompensa— nunca debe hacerla esperar.

Para regenerar tras editar un original:

```bash
for f in assets/reino-cuadrado/fondos/*.png; do
  sips -Z 1280 -s format jpeg -s formatOptions 62 "$f" \
    --out "assets/reino-cuadrado/fondos-web/$(basename "$f" .png).jpg"
done
sips -Z 420 assets/personajes/nubo-v2.png --out assets/personajes/web/nubo.png
sips -Z 520 assets/personajes/lia-v4.png  --out assets/personajes/web/lia.png
```

## Pruebas

`pruebas/recorrido.html` juega la aventura entera sola y reporta escenas
visitadas, cristales y errores de JavaScript. Ver `pruebas/LEEME.md`.
