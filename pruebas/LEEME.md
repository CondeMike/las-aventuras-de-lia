# Pruebas

## `recorrido.html` — recorrido automático

Juega la aventura entera sola y escribe el resultado en pantalla: qué escenas
visitó, qué respondió, cuántos cristales consiguió y si hubo errores de
JavaScript. Sirve para comprobar de un vistazo que el flujo completo sigue en pie
después de tocar el contenido o el código.

```bash
python3 -m http.server 8000
open http://localhost:8000/pruebas/recorrido.html          # todo correcto
open http://localhost:8000/pruebas/recorrido.html?falla=1  # falla dos veces cada reto
```

Con `?falla=1` se comprueba lo importante: que la ayuda suba de 0 a 2, que
ningún mensaje diga "incorrecto", que nunca se revele la respuesta y que Quatron
acabe preguntando justamente las operaciones falladas.

En la lluvia de estrellas el recorrido lee el cartel y atrapa la que lleva el
resultado; con `?falla=1` toca siempre una equivocada. Un recorrido limpio
termina la lluvia en **5 de 5 con la Corona de Nubo**; uno fallado, en **0 de 5
y sin corona**.

Con `?repetir=1` se juega la lluvia dos veces usando el botón lateral, que es
donde se comprueba que la escena se puede reentrar sin dejar restos.

Con `?parar=<escena>` el juego se queda quieto en esa pantalla, para mirarla
(por ejemplo `?parar=estrellas`).

Un recorrido sano termina con **19 escenas, 3/3 cristales y "errores js:
ninguno"**. Borra el progreso guardado al arrancar.
