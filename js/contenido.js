/* Contenido narrativo del Reino Cuadrado.

   La aventura tiene dos mitades con propósitos distintos:
   - LA SECUENCIA: los diez retos en orden, de 4×1 a 4×10. Sirve para
     comprender: cada uno enseña, con grupos visibles y ayuda si hace falta.
   - LA LUCHA: Quatron pregunta al azar sobre toda la familia del 4. Sirve para
     recordar: sin grupos que contar, solo la respuesta.

   Cada paso declara su escena: fondo, encuadre, color de acento, voz de Nubo y,
   si corresponde, el reto que la habita. Agregar un mundo nuevo es agregar
   datos aquí, no código.

   DOS CAPAS DE LENGUAJE, y no se mezclan:
   - La narrativa vive en `nubo` y en `titulo`. Ahí el vocabulario es rico y
     cambia en cada escena: canteros, vetas, bandadas. Es el sitio legítimo
     para enseñar palabras nuevas, porque no hay que calcular mientras se leen.
   - La operativa vive en la pregunta, la lectura y las pistas. Ahí la palabra
     es siempre la misma: GRUPO. La multiplicación es justamente la invariancia
     del grupo; si el nombre cambia diez veces, lo único que debía quedarse
     quieto es lo que se mueve. Por eso los pasos ya no traen `grupo`/`grupos`:
     la capa operativa no los quiere. */
(function () {
  "use strict";

  const FONDOS = "assets/reino-cuadrado/fondos-web/";

  const PASOS = [
    {
      id: "portada",
      tipo: "portada",
      fondo: "fondo_01_introduccion.jpg",
      foco: "center 45%",
      acento: "#ffc35c",
      titulo: "Las Aventuras de Lía",
      subtitulo: "El misterio del Reino Cuadrado",
      nubo: "¡Lía! El reino perdió sus tres cristales. Sin ellos, las torres no encienden.",
      boton: "Empezar la misión",
      botonContinuar: "Seguir la aventura"
    },
    {
      id: "mapa-1",
      tipo: "mapa",
      fondo: "fondo_02_reino_cuadrado_mapa.jpg",
      foco: "center 40%",
      acento: "#8fd4ff",
      titulo: "El Reino Cuadrado",
      objetivo: 1,
      nubo: "El primer cristal está en el jardín, al pie del castillo. ¿Vamos?",
      boton: "Bajar al sendero"
    },

    /* ---- Cristal 1: el sendero y el jardín ---- */
    {
      id: "linterna",
      tipo: "reto",
      fondo: "fondo_01_introduccion.jpg",
      foco: "52% 72%",
      acento: "#ffd06b",
      cristal: 1,
      titulo: "La linterna de Nubo",
      nubo: "Empecemos fácil. Mi linterna guarda 4 luciérnagas. Es una sola linterna.",
      formato: "contar",
      a: 4, b: 1,
      objeto: "✨", nombre: "luciérnagas", gen: "f",
      logro: "¡Con una linterna ya podemos caminar de noche!"
    },
    {
      id: "jardin",
      tipo: "reto",
      fondo: "fondo_03_primer_reto_visual.jpg",
      foco: "center 32%",
      acento: "#d59bff",
      cristal: 1,
      titulo: "El jardín dormido",
      nubo: "Mira: quedan dos canteros con flores. Si cuentas todas, el jardín despierta.",
      formato: "contar",
      a: 4, b: 2,
      objeto: "🌸", nombre: "flores", gen: "f",
      logro: "¡El jardín volvió a florecer!"
    },
    {
      id: "puerta",
      tipo: "reto",
      fondo: "fondo_04_puerta_4x3.jpg",
      foco: "58% center",
      acento: "#c07bff",
      cristal: 1,
      otorgaCristal: 1,
      titulo: "La puerta de piedra",
      nubo: "La puerta pide un número. Hay tres huecos y cada uno lleva 4 diamantes.",
      formato: "contar",
      a: 4, b: 3,
      objeto: "🔷", nombre: "diamantes", gen: "m",
      logro: "¡La puerta se abrió y el primer cristal es tuyo!"
    },
    {
      id: "cofre",
      tipo: "recompensa",
      fondo: "fondo_08_cofre_recompensa.jpg",
      foco: "center",
      acento: "#ffd35e",
      titulo: "¡El cofre de Nubo!",
      nubo: "¡Estaba escondido detrás de la puerta! Mira lo que había dentro.",
      tesoro: { id: "capa", icono: "🧣", nombre: "Capa de Nubo", detalle: "Nubo se la pone y no se la quiere quitar." },
      boton: "Guardar el tesoro"
    },

    /* ---- Cristal 2: las torres y el bosque ---- */
    {
      id: "mapa-2",
      tipo: "mapa",
      fondo: "fondo_02_reino_cuadrado_mapa.jpg",
      foco: "center 30%",
      acento: "#8fd4ff",
      titulo: "El Reino Cuadrado",
      objetivo: 2,
      nubo: "¡Una torre encendió! El segundo cristal está más arriba, donde anidan las aves.",
      boton: "Subir a las torres"
    },
    {
      id: "torres",
      tipo: "reto",
      fondo: "fondo_06_cuatro_torres.jpg",
      foco: "center 38%",
      acento: "#ffb46b",
      cristal: 2,
      titulo: "Las cuatro torres",
      nubo: "Cuatro torres, y en cada nido duermen 4 pajaritos. ¿Cuántos hay en todo?",
      formato: "contar",
      a: 4, b: 4,
      objeto: "🐦", nombre: "pajaritos", gen: "m",
      logro: "¡Los pajaritos despertaron y encendieron las torres!"
    },
    {
      id: "claro",
      tipo: "reto",
      fondo: "fondo_05_ayuda_visual.jpg",
      foco: "62% center",
      acento: "#6fe4ff",
      cristal: 2,
      titulo: "El claro de los cristales",
      nubo: "Conté 20 cristales en total y están en montones de 4. ¿Cuántos montones son?",
      formato: "completar",
      a: 4, b: 5,
      objeto: "💠", nombre: "cristales", gen: "m",
      logro: "¡Los montones volvieron a brillar!"
    },
    {
      id: "escalinata",
      tipo: "reto",
      fondo: "fondo_11_misterio_continuara.jpg",
      foco: "center 62%",
      acento: "#ff9ec4",
      cristal: 2,
      otorgaCristal: 2,
      titulo: "La escalinata de flores",
      nubo: "Seis escalones, y en cada uno crecieron 4 flores. Cuéntalas y podremos subir.",
      formato: "contar",
      a: 4, b: 6,
      objeto: "🌺", nombre: "flores", gen: "f",
      logro: "¡Llegaste arriba y el segundo cristal es tuyo!"
    },
    {
      id: "estrellas",
      tipo: "minijuego",
      fondo: "fondo_07_minijuego.jpg",
      foco: "center 35%",
      acento: "#ffe06b",
      titulo: "¡Lluvia de estrellas!",
      nubo: "¡Mira el cartel! Atrapa la estrella que lleva el resultado. Caen de cuatro en cuatro.",
      oleadas: 5,
      porOleada: 4,
      /* El ritmo de la lluvia, aquí para poder afinarlo sin tocar código.
         `caida` es lo que tarda una estrella en cruzar la arena y `cadencia` es
         cada cuánto sale una ronda nueva. Se mueven juntas: al empezar una
         ronda se limpia el cielo, así que el tiempo real para responder es el
         menor de los dos. Bajar solo la velocidad haría que las estrellas se
         borraran a mitad de vuelo sin dar ni un segundo más. Las cuatro estrellas de una ronda caen SIEMPRE a la
         misma velocidad: si la buena bajara más rápido que las otras, el juego
         estaría decidiendo por azar quién acierta. */
      caida: 4.1,
      cadencia: 4200,
      /* Cada partida seguida acelera la siguiente: se repite porque hay un
         premio nuevo esperando, y al repetir se pone más difícil. El suelo
         está para que no acabe siendo imposible. */
      acelera: 0.18,
      caidaMinima: 1.6,
      boton: "¡A cazar estrellas!",
      /* La escalera de premios de Nubo. Una partida perfecta se lleva el
         primero que falte, así que volver a jugar siempre tiene algo nuevo
         detrás y cada vuelta es otro repaso de la tabla. Los premios se
         guardan entre sesiones: son una colección, no una puntuación.
         La corona va primera porque Nubo ya la lleva puesta en la ilustración
         del cofre y en la del mapa: no inventa nada, explica de dónde salió. */
      tesorosPerfectos: [
        { id: "corona",   icono: "👑", nombre: "Corona de Nubo",   detalle: "La que lleva puesta en el cofre. Ahora ya sabes por qué." },
        { id: "medalla",  icono: "🏅", nombre: "Medalla de estrella", detalle: "Se la cuelga al cuello para salir a explorar." },
        { id: "cascabel", icono: "🔔", nombre: "Cascabel de plata", detalle: "Suena cuando Nubo vuela cerca, aunque no se le vea." },
        { id: "galleta",  icono: "🍪", nombre: "Galleta de luna",   detalle: "La guarda para el camino largo. Nunca se la come." },
        { id: "polvo",    icono: "💫", nombre: "Polvo de estrella", detalle: "Le deja las alas brillando un ratito." }
      ]
    },

    /* ---- Cristal 3: la subida hasta el guardián ---- */
    {
      id: "mapa-3",
      tipo: "mapa",
      fondo: "fondo_02_reino_cuadrado_mapa.jpg",
      foco: "center 22%",
      acento: "#8fd4ff",
      titulo: "El Reino Cuadrado",
      objetivo: 3,
      nubo: "Falta un cristal... y algo grande lo está cuidando. Primero, el camino largo.",
      boton: "Tomar el camino largo"
    },
    {
      id: "losas",
      tipo: "reto",
      fondo: "fondo_03_primer_reto_visual.jpg",
      foco: "center 90%",
      acento: "#7fd8c8",
      cristal: 3,
      titulo: "Las siete losas",
      nubo: "El sendero tiene siete losas, y en cada una brillan 4 piedritas.",
      formato: "contar",
      a: 4, b: 7,
      objeto: "🔵", nombre: "piedritas", gen: "f",
      logro: "¡El sendero se encendió entero!"
    },
    {
      id: "veta",
      tipo: "reto",
      fondo: "fondo_05_ayuda_visual.jpg",
      foco: "88% 42%",
      acento: "#8ab4ff",
      cristal: 3,
      titulo: "La veta de cristal",
      nubo: "Aquí hay 32 cristales en la roca, repartidos en vetas de 4. ¿Cuántas vetas ves?",
      formato: "completar",
      a: 4, b: 8,
      objeto: "🔹", nombre: "cristales", gen: "m",
      logro: "¡La roca se abrió y dejó ver el camino!"
    },
    {
      id: "bandadas",
      tipo: "reto",
      fondo: "fondo_06_cuatro_torres.jpg",
      foco: "center 6%",
      acento: "#ff9d6b",
      cristal: 3,
      titulo: "El cielo del atardecer",
      nubo: "Nueve bandadas cruzan el cielo, y cada una lleva 4 aves.",
      formato: "contar",
      a: 4, b: 9,
      objeto: "🕊️", nombre: "aves", gen: "f",
      logro: "¡Las bandadas te señalaron dónde está el guardián!"
    },
    {
      id: "hiedra",
      tipo: "reto",
      fondo: "fondo_04_puerta_4x3.jpg",
      foco: "14% 34%",
      acento: "#8fd07a",
      cristal: 3,
      titulo: "El muro de hiedra",
      nubo: "El último muro: 40 hojas en ramas de 4. Dime cuántas ramas hay y lo apartamos.",
      formato: "completar",
      a: 4, b: 10,
      objeto: "🍀", nombre: "hojas", gen: "f",
      logro: "¡La hiedra se apartó! Detrás está Quatron."
    },
    {
      id: "quatron",
      tipo: "jefe",
      fondo: "fondo_09_batalla_quatron.jpg",
      foco: "center 42%",
      acento: "#7fe0ff",
      otorgaCristal: 3,
      titulo: "Quatron, guardián de piedra",
      nubo: "¡Es Quatron! Aquí no hay nada que contar, Lía: ahora te toca recordar.",
      corazones: 5,
      boton: "¡Adelante!",
      logro: "¡Quatron devolvió el último cristal!"
    },
    {
      id: "victoria",
      tipo: "recompensa",
      fondo: "fondo_10_victoria_restauracion.jpg",
      foco: "center 38%",
      acento: "#ffd35e",
      titulo: "¡El reino vuelve a brillar!",
      nubo: "¡Los tres cristales! Mira las torres, Lía. Todo esto lo encendiste tú.",
      resumen: true,
      boton: "Ver qué pasa después"
    },
    {
      id: "epilogo",
      tipo: "epilogo",
      fondo: "fondo_11_misterio_continuara.jpg",
      foco: "center 22%",
      acento: "#ff8a5c",
      titulo: "Continuará...",
      nubo: "Lía... ese cuadro no estaba ahí antes. ¿Viste esos ojos?",
      cierre: "Mañana seguimos.",
      boton: "Jugar otra vez",
      botonSecundario: "Volver al inicio"
    }
  ];

  /* Toda la tabla, para el mapa de poderes del final. */
  const TABLA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /* De dónde saca Quatron sus preguntas. El 4×1 queda fuera: para un jefe
     final es demasiado fácil y le quita emoción a la pelea. */
  const FAMILIA = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  function paso(indice) {
    return PASOS[Math.min(Math.max(indice, 0), PASOS.length - 1)];
  }

  function claveOperacion(a, b) {
    return a + "x" + b;
  }

  /* Concordancia de género. Sin esto el juego dice "¿Cuántas diamantes hay?",
     y quien lo lee está justo aprendiendo a leer. */
  function cuantos(genero) { return genero === "f" ? "Cuántas" : "Cuántos"; }
  function los(genero)     { return genero === "f" ? "las" : "los"; }

  /* Cómo se lee el símbolo. "3 grupos de 4" se escribe 3 × 4, así que decirlo
     así mientras en pantalla pone 4 × 3 enseña el error de orden más común.
     La salida es leer el símbolo tal como está: "el 4, tres veces". Y en
     palabras, no en cifras: quien juega todavía está aprendiendo a leer. */
  const PALABRA = ["cero", "una", "dos", "tres", "cuatro", "cinco",
                   "seis", "siete", "ocho", "nueve", "diez"];

  function veces(n) {
    return (PALABRA[n] || n) + (n === 1 ? " vez" : " veces");
  }

  /* Los primeros saltos del conteo salteado, para las pistas: 4, 8, 12… */
  function saltos(a, b, cuantosMostrar) {
    const n = Math.min(b, cuantosMostrar);
    const lista = Array.from({ length: n }, function (_, i) { return (i + 1) * a; });
    return lista.join(", ") + (b > n ? "…" : "");
  }

  window.Contenido = {
    FONDOS: FONDOS,
    PASOS: PASOS,
    TABLA: TABLA,
    FAMILIA: FAMILIA,
    paso: paso,
    claveOperacion: claveOperacion,
    cuantos: cuantos,
    los: los,
    veces: veces,
    saltos: saltos,
    totalRetos: PASOS.filter(function (p) { return p.tipo === "reto"; }).length,
    ultimo: PASOS.length - 1,
    fondoDe: function (p) { return FONDOS + p.fondo; }
  };
})();
