(function () {
  "use strict";
  const RETOS = [
    { id: "4x2", cristal: 1, titulo: "El jardín mágico", grupos: 2, objeto: "🌸", nombre: "flores", respuestas: [6, 8, 10], logro: "¡Hiciste florecer el sendero!" },
    { id: "4x3", cristal: 1, titulo: "La puerta de piedra", grupos: 3, objeto: "♦", nombre: "diamantes", respuestas: [8, 12, 16], logro: "¡Recuperaste el cristal del jardín!" },
    { id: "4x4", cristal: 2, titulo: "El bosque luminoso", grupos: 4, objeto: "✨", nombre: "luces", respuestas: [12, 16, 20], logro: "¡El bosque vuelve a brillar!" },
    { id: "4x5", cristal: 2, titulo: "El río brillante", grupos: 5, objeto: "●", nombre: "luciérnagas", respuestas: [16, 20, 24], logro: "¡Recuperaste el cristal del bosque!" },
    { id: "4x6", cristal: 3, titulo: "Las torres de aves", grupos: 6, objeto: "🐦", nombre: "aves", respuestas: [20, 24, 28], logro: "¡Encendiste las torres!" },
    { id: "4x8", cristal: 3, titulo: "El observatorio", grupos: 8, objeto: "★", nombre: "estrellas", respuestas: [28, 32, 36], logro: "¡Recuperaste el último cristal!" },
    { id: "4x10", cristal: 3, titulo: "La gran constelación", grupos: 10, objeto: "✦", nombre: "estrellas", respuestas: [36, 40, 44], logro: "¡Dominas la magia del 4!" }
  ];
  function marco(contenido, clase, estado) {
    const activo = estado.preferencias.sonido;
    const cristales = [1, 2, 3].map(function (n) { return '<span class="' + (n <= estado.cristales ? "conseguido" : "") + '" aria-hidden="true">' + (n <= estado.cristales ? "◆" : "◇") + '</span>'; }).join("");
    return '<section class="escena ' + (clase || "") + '" aria-labelledby="tituloEscena"><div class="particulas" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="barra"><span class="insignia">✨ Las Aventuras de Lía</span><span class="controles"><button class="control sonido" data-accion="sonido" aria-label="' + (activo ? "Silenciar sonidos" : "Activar sonidos") + '" aria-pressed="' + activo + '">' + (activo ? "🔊" : "🔇") + '</button><button class="control reiniciar" data-accion="confirmar-reinicio" aria-label="Empezar una aventura nueva">↻ <span>Reiniciar</span></button></span></div>' +
      '<div class="progreso-cristales" aria-label="' + estado.cristales + ' de 3 cristales recuperados">' + cristales + '</div>' + contenido + '</section>';
  }
  function inicio(estado) {
    const continua = estado.retoActual > 0 || estado.cristales > 0;
    return marco('<h1 id="tituloEscena" class="titulo">Las Aventuras de Lía</h1><p class="subtitulo">El misterio de las cuatro torres</p>' +
      '<div class="personajes" aria-label="Lía y Nubo"><div class="personaje"><img class="lia" src="assets/personajes/lia-v4.png" alt="Lía, joven exploradora"><span>Lía</span></div><div class="personaje"><img class="nubo" src="assets/personajes/nubo-v2.png" alt="Nubo, zorro dragón amistoso"><span>Nubo</span></div></div>' +
      '<div class="pergamino pergamino--inicio"><strong>¡Tenemos una misión!</strong><span>Ayuda a Lía a recuperar 3 cristales.</span><span>Para encontrarlos, cuenta objetos en grupos de 4.</span></div><button class="boton boton--oro" data-accion="comenzar">' + (continua ? "Continuar" : "Empezar la misión") + '</button>', "escena--inicio", estado);
  }
  function mapa(estado) {
    const siguiente = RETOS[estado.retoActual];
    return marco('<h1 id="tituloEscena" class="titulo">Mapa del Reino</h1><div class="pergamino pergamino--mapa"><strong>' + (estado.cristales === 0 ? "Busca el primer cristal" : estado.cristales === 3 ? "¡Tienes los 3 cristales!" : "¡Tienes " + estado.cristales + " de 3 cristales!") + '</strong><span>' + (siguiente ? "Toca el portal brillante para seguir." : "Toca el portal para celebrar.") + '</span></div>' +
      '<div class="mapa-ruta"><button class="torre torre--activa" data-accion="' + (siguiente ? "abrir-reto" : "ver-final") + '" aria-label="' + (siguiente ? "Abrir el reto " + (estado.retoActual + 1) : "Ver la celebración final") + '"><span class="portal">✦</span><small>' + (siguiente ? "Reto " + (estado.retoActual + 1) : "Celebrar") + '</small></button></div><div class="placa-mundo"><span>Tu camino</span><small>Reto ' + Math.min(estado.retoActual + 1, RETOS.length) + ' de ' + RETOS.length + '</small></div>', "escena--mapa", estado);
  }
  function gruposHTML(r, nivel) {
    return '<div class="grupos grupos--aprendizaje nivel-ayuda-' + nivel + '" id="gruposReto" aria-label="' + r.grupos + ' grupos de 4 ' + r.nombre + '">' + Array.from({ length: r.grupos }, function (_, i) { return '<div class="grupo" style="--orden:' + i + '"><span class="numero-grupo" aria-hidden="true">' + (i + 1) + '</span><span class="elementos" aria-hidden="true">' + r.objeto.repeat(4) + '</span></div>'; }).join("") + '</div>';
  }
  function reto(r, estado) {
    const nivel = estado.nivelAyuda; const suma = Array.from({ length: r.grupos }, function () { return "4"; }).join(" + ");
    const pista = nivel === 0 ? "Mira todos los grupos antes de responder." : nivel === 1 ? "Cuenta de 4 en 4. Puedes seguir los números de abajo." : "Suma los grupos de 4 y busca el resultado.";
    const conteo = Array.from({ length: r.grupos }, function (_, i) { return '<span>' + ((i + 1) * 4) + '</span>'; }).join('<i aria-hidden="true">→</i>');
    return marco('<h1 id="tituloEscena" class="titulo titulo--reto">' + r.titulo + '</h1><div class="paso"><span>PASO 1</span> Mira los grupos</div><div class="pergamino pergamino--reto">Hay <strong>' + r.grupos + ' grupos de ' + r.nombre + '</strong>.<br>En cada grupo hay <strong>4 ' + r.nombre + '</strong>.</div>' + gruposHTML(r, nivel) + (nivel > 0 ? '<div class="conteo-guiado" aria-label="Conteo de cuatro en cuatro">' + conteo + '</div>' : '') + (nivel === 2 ? '<div class="suma-repetida" aria-label="Suma de grupos">' + suma + ' = ?</div>' : '') +
      '<div class="zona-respuesta"><div class="paso"><span>PASO 2</span> Elige tu respuesta</div><div class="pregunta"><span aria-hidden="true">🔎</span><strong>¿Cuántas ' + r.nombre + ' hay en total?</strong><small>' + r.grupos + ' grupos de 4 &nbsp;•&nbsp; 4 × ' + r.grupos + '</small></div><div class="opciones" role="group" aria-label="¿Cuántas ' + r.nombre + ' hay en total?">' + r.respuestas.map(function (v) { return '<button class="opcion" data-accion="responder" data-valor="' + v + '" aria-label="Responder ' + v + '">' + v + '</button>'; }).join("") + '</div></div><div class="zona-ayuda"><div class="mensaje" id="mensajeReto" role="status" aria-live="polite">' + pista + '</div>' + (nivel < 2 ? '<button class="boton boton--pista" data-accion="pista">💡 Dame una pista</button>' : '') + '</div>', "escena--reto", estado);
  }
  function final(estado) {
    const s = estado.sesion;
    return marco('<h1 id="tituloEscena" class="titulo">¡El reino vuelve a brillar!</h1><div class="final-cristales" aria-hidden="true">◆ ◆ ◆</div><img class="nubo nubo--final" src="assets/personajes/nubo-v2.png" alt="Nubo celebrando"><div class="pergamino"><strong>Completaste la aventura repitiendo el 4 distintas cantidades de veces.</strong><br>Observaste, contaste y volviste a intentarlo cuando fue necesario.</div>' +
      '<dl class="resumen"><div><dt>Retos completados</dt><dd>' + s.aciertos + '</dd></div><div><dt>Pistas que te ayudaron</dt><dd>' + s.ayudasUsadas + '</dd></div></dl><button class="boton boton--oro" data-accion="otra-vez">Jugar otra vez</button> <button class="boton boton--secundario" data-accion="volver-inicio">Volver al inicio</button>', "escena--final", estado);
  }
  window.Escenas = { RETOS: RETOS, inicio: inicio, mapa: mapa, reto: reto, final: final };
})();
