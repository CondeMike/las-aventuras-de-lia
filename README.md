# Las Aventuras de Lía — prototipo v2

Prototipo jugable, táctil y sin dependencias para comprender y practicar la familia del 4 dentro de una aventura infantil.

## Cómo jugar

1. Abre `index.html` con doble clic.
2. Pulsa **Empezar la misión** y sigue los dos pasos de cada reto.

Funciona sin servidor y sin conexión a internet en navegadores modernos. Si el navegador limita `localStorage` al abrir archivos locales, puedes iniciar un servidor opcional desde esta carpeta:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000`.

## Progreso guardado

La versión 2 del juego guarda en el navegador:

- escena y reto actuales;
- los tres cristales recuperados;
- intentos, aciertos al primer intento y pistas utilizadas;
- historial acumulado de sesiones y aventuras terminadas;
- preferencia de sonido.

El botón **↻ Reiniciar** pide confirmación, comienza una sesión nueva y conserva el historial acumulado.

## Enfoque pedagógico

Los siete retos presentan la tabla mediante grupos visibles de cuatro elementos. Cada pantalla separa la tarea en dos acciones: primero observar los grupos y luego responder una pregunta breve. Al acertar, el niño completa la multiplicación arrastrando el resultado hasta su cajón; el refuerzo permanece visible hasta pulsar **Continuar**. La ayuda avanza desde el conteo de cuatro en cuatro hasta la suma repetida. La respuesta no se revela automáticamente tras el primer error.

## Estructura

- `index.html`: entrada de la aplicación.
- `css/game.css`: diseño responsive, animaciones y componentes visuales.
- `js/progreso.js`: lectura y escritura segura de `localStorage`.
- `js/sonidos.js`: efectos musicales sintetizados con Web Audio y control de sonido.
- `js/escenas.js`: contenido de las escenas jugables actuales.
- `js/game.js`: navegación, respuestas y eventos del juego.

No se usan frameworks, backend, fuentes ni recursos externos. Los personajes están incluidos localmente en `assets/personajes/` y el arte del mundo en `assets/reino-cuadrado/`.
