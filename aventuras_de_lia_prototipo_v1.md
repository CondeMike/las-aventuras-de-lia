# Las Aventuras de Lía — Prototipo v1

## 1. Objetivo del prototipo

Crear una experiencia de juego breve, cálida y motivadora para que Lía practique y comprenda la tabla del 4 mediante interacción, exploración y feedback positivo.

El prototipo debe validar si:

- La narrativa y el entorno de fantasía despiertan el interés de Lía.
- Las actividades resultan fáciles de entender sin explicaciones extensas.
- La práctica se siente como parte de una aventura y no como un examen.
- La ayuda de Nubo reduce la frustración y facilita un segundo intento.
- Los controles grandes y táctiles funcionan correctamente en computador, tableta y móvil.
- El progreso básico puede conservarse en el dispositivo.

## 2. Alcance de la versión 1

La primera versión incluye cinco escenas jugables centradas en la tabla del 4:

1. **Bienvenida al Reino Cuadrado**
2. **El puente de cuatro tablas**
3. **El bosque de grupos mágicos**
4. **La puerta del castillo**
5. **Celebración y resumen de la aventura**

El alcance funcional comprende:

- Navegación lineal entre las cinco escenas.
- Interacción mediante clic o toque.
- Preguntas y retos de la tabla del 4.
- Feedback inmediato en cada respuesta.
- Ayuda gradual de Nubo después de un error.
- Segundo intento sin penalización visible.
- Guardado básico del progreso con `localStorage`.
- Registro local de métricas esenciales.
- Diseño responsive, apto para interacción táctil.

Quedan fuera de esta versión: cuentas de usuario, servidor, sincronización entre dispositivos, panel para adultos, tablas distintas de la del 4, compras, anuncios y clasificación competitiva.

## 3. Comportamiento de las escenas

### Escena 1: Bienvenida al Reino Cuadrado

**Propósito:** presentar a Lía, a Nubo y la misión de la aventura.

**Comportamiento:**

- Se muestra el Reino Cuadrado con una estética de fantasía infantil cálida.
- Nubo explica, en una frase breve, que el reino necesita recuperar la magia de los grupos de cuatro.
- Un botón grande, por ejemplo **“¡Comenzar aventura!”**, inicia el recorrido.
- La escena acepta clic y toque.
- Al comenzar, se crea o recupera la partida local.

**Condición de avance:** pulsar el botón de inicio.

### Escena 2: El puente de cuatro tablas

**Propósito:** introducir la idea de multiplicar como grupos iguales.

**Comportamiento:**

- Lía debe completar un puente formado por grupos de cuatro tablas de madera.
- La interfaz presenta una pregunta visual sencilla, por ejemplo: “Hay 3 grupos de 4 tablas. ¿Cuántas tablas hay?”.
- Se ofrecen respuestas grandes y claramente separadas.
- Una respuesta correcta completa una parte del puente y habilita el avance.
- Una respuesta incorrecta activa la ayuda de Nubo y permite intentarlo de nuevo.

**Condición de avance:** resolver correctamente el reto.

### Escena 3: El bosque de grupos mágicos

**Propósito:** reforzar la relación entre representación visual, suma repetida y multiplicación.

**Comportamiento:**

- Se muestran elementos del bosque organizados en grupos de cuatro, como luciérnagas, flores o piedras mágicas.
- Lía selecciona la multiplicación o el resultado que corresponde a la imagen.
- Los elementos pueden iluminarse por grupos para facilitar el conteo.
- Si hay un error, Nubo destaca los grupos y ofrece una pista concreta.
- Al acertar, el bosque recupera color, luz o movimiento.

**Condición de avance:** asociar correctamente la representación visual con la operación.

### Escena 4: La puerta del castillo

**Propósito:** comprobar la recuperación de resultados de la tabla del 4 en un reto final breve.

**Comportamiento:**

- La puerta presenta entre tres y cinco preguntas cortas de la tabla del 4.
- Las preguntas aparecen de una en una para evitar sobrecarga visual.
- Cada respuesta recibe feedback inmediato.
- Los errores no reinician la escena ni eliminan avances anteriores.
- Nubo ofrece ayuda cuando sea necesario.
- Al completar la serie, la puerta se abre con una animación breve.

**Condición de avance:** contestar correctamente todos los retos, incluyendo segundos intentos.

### Escena 5: Celebración y resumen

**Propósito:** cerrar la experiencia con reconocimiento y ganas de volver a jugar.

**Comportamiento:**

- Lía recibe una celebración visual y un mensaje positivo por completar la aventura.
- Se presenta un resumen sencillo: retos completados, aciertos y ayudas utilizadas.
- Se evita mostrar notas, porcentajes de fracaso o comparaciones con otras personas.
- Se ofrecen botones grandes para **“Jugar otra vez”** y **“Continuar después”**.
- Al reiniciar, puede conservarse el historial acumulado y comenzar una nueva sesión desde la primera escena.

**Condición de finalización:** llegar al resumen de la aventura.

## 4. Sistema de ayuda de Nubo

Nubo funciona como acompañante, guía emocional y apoyo pedagógico. Su intervención debe ser breve, amable y útil.

### Secuencia de ayuda

1. **Primer error:** mensaje tranquilizador y pista visual o conceptual.
2. **Segundo intento:** se mantiene la misma pregunta, con apoyo adicional; por ejemplo, grupos resaltados, conteo guiado o suma repetida.
3. **Error posterior:** Nubo puede mostrar la estrategia completa y pedir a Lía que seleccione o confirme la respuesta correcta.

### Principios

- No revelar inmediatamente la respuesta en el primer error.
- Explicar con lenguaje concreto y frases cortas.
- Relacionar siempre la ayuda con grupos de cuatro.
- Evitar expresiones negativas como “fallaste”, “mal” o “incorrecto”.
- No aplicar castigos, perder vidas ni restar puntos.
- Reducir la ayuda cuando Lía responde correctamente sin apoyo.

Ejemplos de mensajes:

- “Casi. Vamos a mirar los grupos de cuatro.”
- “Cuenta conmigo: 4, 8, 12…”
- “Tres grupos de cuatro son 4 + 4 + 4.”
- “¡Eso es! Encontraste la magia de los grupos.”

## 5. Reglas de feedback

### Cuando la respuesta es correcta

- Confirmar de inmediato con sonido opcional, animación breve y mensaje positivo.
- Reconocer la estrategia o el esfuerzo, no una cualidad fija.
- Mantener la celebración proporcionada para no ralentizar el juego.
- Habilitar claramente el siguiente paso.

Ejemplos: “¡Lo resolviste!”, “¡Buen conteo por grupos!” o “¡El puente está listo!”.

### Cuando la respuesta necesita revisión

- Evitar alarmas, colores agresivos y sonidos de castigo.
- Mantener visibles los elementos útiles para razonar.
- Activar la ayuda de Nubo y permitir otro intento.
- No cambiar la pregunta antes de que Lía pueda comprenderla.
- Registrar el intento para métricas sin mostrar una penalización.

### Accesibilidad del feedback

- No depender exclusivamente del color.
- Combinar texto, icono, animación y, si se usa, sonido.
- Respetar una opción de sonido activado o desactivado.
- Mantener mensajes legibles, breves y con buen contraste.

## 6. Guardado de progreso con `localStorage`

El prototipo guarda el estado en el navegador bajo una clave versionada, por ejemplo:

```text
aventurasDeLia.v1
```

Estructura sugerida:

```json
{
  "version": 1,
  "escenaActual": 3,
  "escenasCompletadas": [1, 2],
  "sesion": {
    "inicio": "2026-09-04T15:00:00.000Z",
    "intentos": 8,
    "aciertosPrimerIntento": 5,
    "ayudasUsadas": 3
  },
  "acumulado": {
    "sesionesIniciadas": 2,
    "aventurasCompletadas": 1,
    "intentos": 18,
    "aciertos": 14,
    "ayudasUsadas": 4
  },
  "preferencias": {
    "sonido": true
  },
  "actualizadoEn": "2026-09-04T15:08:00.000Z"
}
```

### Reglas de persistencia

- Guardar al iniciar la aventura, completar una escena, responder un reto y cambiar una preferencia.
- Recuperar la partida al cargar la página y ofrecer continuar desde la escena guardada.
- Validar los datos antes de usarlos y restaurar valores seguros si están dañados.
- Incluir la versión del esquema para facilitar futuras migraciones.
- Ofrecer una acción explícita para reiniciar la partida.
- No almacenar nombre completo, edad exacta ni otros datos personales.

## 7. Métricas básicas

Las métricas se almacenan localmente durante el prototipo y sirven para observar la experiencia, no para calificar a Lía.

- Sesiones iniciadas.
- Aventuras completadas.
- Escena alcanzada o completada.
- Número total de retos presentados.
- Número total de intentos.
- Aciertos en el primer intento.
- Ayudas de Nubo utilizadas.
- Tiempo aproximado por escena y por sesión.
- Veces que se abandona o retoma una escena.
- Preferencia de sonido.

Si más adelante se envían métricas a un servidor, será necesario definir consentimiento, minimización de datos, retención y protección de la privacidad infantil antes de implementarlo.

## 8. Estructura de archivos propuesta

```text
aventuras-de-lia/
├── index.html
├── css/
│   └── game.css
├── js/
│   ├── game.js
│   ├── progreso.js
│   └── escenas.js
└── README.md
```

### Responsabilidad de cada archivo

- `index.html`: estructura principal, contenedor del juego, controles globales y carga de recursos.
- `css/game.css`: identidad visual, layouts, estados de interacción, animaciones y reglas responsive.
- `js/game.js`: inicialización, navegación, eventos globales y coordinación entre módulos.
- `js/progreso.js`: lectura, validación, actualización y reinicio de datos en `localStorage`.
- `js/escenas.js`: definición de las cinco escenas, retos, respuestas, pistas y condiciones de avance.
- `README.md`: instrucciones para ejecutar el prototipo, alcance, estructura y notas de prueba.

## 9. Lineamientos visuales

### Dirección artística

- Fantasía infantil cálida, amable y luminosa.
- Ambientación en el **Reino Cuadrado**, con formas geométricas integradas en castillos, caminos, ventanas y objetos mágicos.
- Materiales inspirados en madera pintada, pergamino, tela y piedra suave.
- Paleta cálida con acentos mágicos; evitar fondos estridentes o saturación excesiva.
- Personajes y elementos con formas redondeadas y expresivas.
- Nubo debe verse amistoso, reconocible y nunca evaluador o autoritario.

### Interfaz

- Botones grandes, con etiquetas claras y áreas táctiles de al menos 44 × 44 px.
- Tipografía redondeada y muy legible.
- Contraste suficiente entre texto, controles y fondo.
- Una acción principal evidente por pantalla.
- Pocas opciones simultáneas para reducir distracciones.
- Estados visibles de reposo, foco, pulsación, acierto y ayuda.
- Animaciones suaves y cortas; permitir reducirlas si fuera necesario.

### Responsive y táctil

- Diseñar primero para pantallas pequeñas y ampliar progresivamente.
- Evitar interacciones que dependan de `hover`.
- Admitir toque, clic y teclado básico.
- Evitar arrastres precisos como requisito para completar una actividad.
- Mantener controles esenciales dentro del área visible en orientación vertical y horizontal.
- Probar tamaños desde móvil hasta escritorio sin texto cortado ni elementos superpuestos.

## 10. Criterios de prueba con Lía

La prueba debe realizarse como observación amable, sin convertirla en evaluación escolar. Una persona adulta puede acompañar, pero debe intervenir lo mínimo posible.

### Comprensión y autonomía

- Lía entiende cómo comenzar sin una explicación externa extensa.
- Identifica qué debe tocar o seleccionar en cada escena.
- Puede completar al menos cuatro de las cinco escenas con ayuda del propio juego.
- Comprende que los elementos se organizan en grupos de cuatro.
- Puede relacionar al menos una imagen con su suma repetida o multiplicación.

### Motivación y experiencia emocional

- Muestra interés por la historia, los personajes o la recompensa visual.
- Desea continuar después de un error.
- Interpreta a Nubo como ayuda y no como castigo.
- La celebración final resulta satisfactoria y no excesivamente larga.
- Expresa interés en repetir la aventura o jugar una nueva misión.

### Usabilidad

- Los botones se pueden pulsar fácilmente en el dispositivo de prueba.
- Los textos se leen sin esfuerzo y las instrucciones son suficientemente cortas.
- No hay bloqueos, dobles avances accidentales ni pérdida inesperada de progreso.
- El juego funciona con clic y toque.
- Al cerrar y volver a abrir, la partida se recupera correctamente.

### Señales a registrar durante la sesión

- Escenas en las que Lía duda o solicita explicación.
- Elementos que intenta tocar y no son interactivos.
- Tiempo aproximado por escena.
- Respuestas en primer intento y ayudas utilizadas.
- Reacciones ante el feedback correcto y ante la ayuda.
- Frases espontáneas, especialmente sobre diversión, confusión o dificultad.
- Problemas de lectura, tamaño, contraste, sonido o precisión táctil.

### Criterio general de éxito del prototipo

La versión 1 se considera validada si Lía puede recorrer la experiencia con poca ayuda adulta, comprende el patrón de grupos de cuatro, tolera los errores gracias al apoyo de Nubo y manifiesta interés en continuar o volver a jugar. Los hallazgos de la sesión deben utilizarse para ajustar instrucciones, dificultad, ritmo y feedback antes de ampliar el contenido.

---

**Versión:** 1.0  
**Fecha de documentación:** 4 de septiembre de 2026  
**Estado:** especificación inicial lista para implementación y prueba
