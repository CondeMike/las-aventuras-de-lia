/* Dibujado de escenas. Cada función devuelve el HTML completo de una pantalla.
   Nada aquí decide la lógica del juego: solo la pinta. */
(function () {
  "use strict";

  const C = window.Contenido;

  function esc(texto) {
    return String(texto).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function chispas(cantidad) {
    let html = '<div class="chispas" aria-hidden="true">';
    for (let i = 0; i < cantidad; i++) html += '<i style="--i:' + i + '"></i>';
    return html + "</div>";
  }

  function hud(estado) {
    const cristales = [1, 2, 3].map(function (n) {
      const tiene = n <= estado.cristales;
      return '<span class="cristal ' + (tiene ? "cristal--vivo" : "") + '" style="--r:' + n + '" aria-hidden="true"></span>';
    }).join("");
    const sonido = estado.preferencias.sonido;
    return '<header class="hud">' +
      '<span class="hud-mundo"><b>Reino Cuadrado</b><small>La familia del 4</small></span>' +
      '<div class="cristalera" role="img" aria-label="' + estado.cristales + ' de 3 cristales recuperados">' + cristales + '</div>' +
      '<div class="hud-controles">' +
      '<button class="pastilla" data-accion="sonido" aria-pressed="' + sonido + '" aria-label="' + (sonido ? "Silenciar sonidos" : "Activar sonidos") + '">' + (sonido ? "🔊" : "🔇") + '</button>' +
      '<button class="pastilla" data-accion="confirmar-reinicio" aria-label="Empezar una aventura nueva">↻</button>' +
      "</div></header>";
  }

  function voz(texto, acciones) {
    const botones = (acciones || []).map(function (b) {
      return '<button class="boton ' + (b.clase || "boton--oro") + '" data-accion="' + b.accion + '">' + esc(b.texto) + "</button>";
    }).join("");
    return '<footer class="voz">' +
      '<img class="voz-retrato" src="assets/personajes/web/nubo.png" alt="Nubo">' +
      '<div class="voz-globo"><span class="voz-nombre">Nubo</span><p id="vozTexto">' + esc(texto) + "</p></div>" +
      (botones ? '<div class="voz-acciones">' + botones + "</div>" : "") +
      "</footer>";
  }

  function marco(paso, estado, contenido, opciones) {
    const o = opciones || {};
    return '<section class="escena escena--' + paso.tipo + ' escena--' + paso.id + '" style="--acento:' + paso.acento + '" data-paso="' + paso.id + '">' +
      '<div class="telon" style="background-image:url(\'' + C.fondoDe(paso) + '\');background-position:' + paso.foco + '"></div>' +
      '<div class="telon-tinte" aria-hidden="true"></div>' +
      chispas(10) +
      '<div class="follaje" aria-hidden="true"></div>' +
      (o.figuras
        ? '<div class="figurantes">' + o.figuras.map(function (f) {
            return '<img class="figurante figurante--' + f.quien + '" src="' + f.src + '" alt="' + esc(f.alt) + '">';
          }).join("") + "</div>"
        : "") +
      hud(estado) +
      '<div class="lienzo">' + contenido + "</div>" +
      (o.sinVoz ? "" : voz(o.voz || paso.nubo, o.acciones)) +
      "</section>";
  }

  /* ---------- Portada ---------- */
  function portada(paso, estado) {
    const empezada = estado.pasoActual > 0 || estado.cristales > 0;
    const dias = estado.acumulado.diasDeAventura;
    const contenido =
      '<div class="rotulo">' +
      '<h1 id="tituloEscena" class="titulo titulo--epico">' + esc(paso.titulo) + "</h1>" +
      '<p class="lema">' + esc(paso.subtitulo) + "</p>" +
      "</div>" +
      '<div class="elenco">' +
      '<figure class="retrato"><img src="assets/personajes/web/lia.png" alt="Lía, exploradora"><figcaption>Lía</figcaption></figure>' +
      '<figure class="retrato retrato--nubo"><img src="assets/personajes/web/nubo.png" alt="Nubo, zorro dragón"><figcaption>Nubo</figcaption></figure>' +
      "</div>" +
      '<div class="medallero">' +
      '<span class="medalla"><b>' + dias + "</b><small>día" + (dias === 1 ? "" : "s") + " de aventura</small></span>" +
      '<span class="medalla"><b>' + estado.cristales + "/3</b><small>cristales</small></span>" +
      (estado.estrellas ? '<span class="medalla"><b>' + estado.estrellas + "</b><small>estrellas</small></span>" : "") +
      "</div>";
    return marco(paso, estado, contenido, {
      acciones: [{ accion: "comenzar", texto: empezada ? paso.botonContinuar : paso.boton }]
    });
  }

  /* ---------- Mapa ---------- */
  function mapa(paso, estado) {
    const nodos = [1, 2, 3].map(function (n) {
      const estadoNodo = n < paso.objetivo ? "logrado" : n === paso.objetivo ? "activo" : "lejano";
      const etiqueta = n < paso.objetivo ? "Cristal " + n + " recuperado" : n === paso.objetivo ? "Aquí vamos ahora" : "Todavía no";
      return '<li class="nodo nodo--' + estadoNodo + '" style="--n:' + n + '">' +
        '<span class="nodo-gema" aria-hidden="true">' + (n < paso.objetivo ? "◆" : n === paso.objetivo ? "✦" : "◇") + "</span>" +
        '<span class="nodo-texto"><b>Cristal ' + n + "</b><small>" + etiqueta + "</small></span></li>";
    }).join("");
    const contenido =
      '<h1 id="tituloEscena" class="titulo">' + esc(paso.titulo) + "</h1>" +
      '<p class="lema">' + (paso.objetivo === 1 ? "Tu primera parada" : "Cristal " + paso.objetivo + " de 3") + "</p>" +
      '<ol class="ruta">' + nodos + "</ol>";
    return marco(paso, estado, contenido, { acciones: [{ accion: "avanzar", texto: paso.boton }] });
  }

  /* ---------- Retos ---------- */
  function grupos(paso, nivel) {
    const piezas = Array.from({ length: paso.b }, function (_, i) {
      const elementos = Array.from({ length: paso.a }, function () {
        return '<span class="pieza">' + paso.objeto + "</span>";
      }).join("");
      return '<div class="grupo" style="--orden:' + i + '"><span class="grupo-num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<div class="grupo-piezas" aria-hidden="true">' + elementos + "</div></div>";
    }).join("");
    return '<div class="grupos nivel-' + nivel + (paso.b >= 7 ? " grupos--muchos" : "") + (paso.b === 1 ? " grupos--uno" : "") + '" id="gruposReto" role="img" aria-label="' + paso.b + (paso.b === 1 ? " grupo" : " grupos") + " de " + paso.a + " " + paso.nombre + '">' + piezas + "</div>";
  }

  function andamios(paso, nivel) {
    if (nivel === 0) return "";
    const conteo = Array.from({ length: paso.b }, function (_, i) {
      return '<span>' + (i + 1) * paso.a + "</span>";
    }).join('<i aria-hidden="true">›</i>');
    let html = '<div class="conteo" aria-label="Contar de ' + paso.a + " en " + paso.a + '">' + conteo + "</div>";
    if (nivel === 2 && paso.b > 1 && paso.formato !== "completar") {
      const suma = Array.from({ length: paso.b }, function () { return paso.a; }).join(" + ");
      html += '<div class="suma">' + suma + " = <b>?</b></div>";
    }
    return html;
  }

  /* El enunciado son tres capas, siempre en el mismo orden y siempre con el
     mismo peso: el hecho (lo único que hay que recordar dentro de un año), su
     lectura en voz alta y la pregunta. El hecho estaba antes en un subtítulo
     del tamaño de una nota al pie: lo que se quiere memorizar tiene que ser lo
     que el ojo fija, y el "?" tiene que estar en pantalla MIENTRAS se resuelve,
     no aparecer después, para que se vea cómo se llena. */
  function enunciado(paso) {
    const total = paso.a * paso.b;
    if (paso.formato === "completar") {
      return {
        ecuacion: paso.a + " × <b>?</b> = " + total,
        lecturaSimbolo: "El " + paso.a + ", ¿cuántas veces?",
        lecturaGrupos: total + " " + paso.nombre + " en grupos de " + paso.a,
        pregunta: "¿Cuántos grupos de " + paso.a + " hay?"
      };
    }
    return {
      ecuacion: paso.a + " × " + paso.b + " = <b>?</b>",
      lecturaSimbolo: "El " + paso.a + ", " + C.veces(paso.b),
      lecturaGrupos: (paso.b === 1 ? "1 grupo" : paso.b + " grupos") + " de " + paso.a + " " + paso.nombre,
      pregunta: "¿" + C.cuantos(paso.gen) + " " + paso.nombre + " hay en total?"
    };
  }

  /* Toda pista empieza por un verbo que se puede hacer con el dedo. "Mira bien"
     no es una estrategia: no dice qué mirar ni qué hacer, y a los seis años no
     genera ninguna acción. "Cuenta los grupos: 1, 2, 3" sí. */
  function enumera(n) {
    return Array.from({ length: n }, function (_, i) { return i + 1; }).join(", ");
  }

  /* Contar el total: la ayuda va de tocar, a contar de 4 en 4, a sumar. */
  function pistaDirecta(paso, nivel) {
    if (nivel === 0) {
      if (paso.b === 1) return "Toca el grupo y cuenta: " + enumera(paso.a) + ".";
      return (paso.b <= 5 ? "Cuenta los grupos: " + enumera(paso.b) + "." : "Toca los grupos y cuéntalos.") +
        " Cada uno tiene " + paso.a + " " + paso.nombre + ".";
    }
    if (nivel === 1) {
      if (paso.b === 1) return "Vuelve a contar lo que hay dentro: " + enumera(paso.a) + ".";
      const serie = C.saltos(paso.a, paso.b, 3);
      return "Ve tocando los números de abajo y dilos en voz alta: " + serie +
        (serie.slice(-1) === "…" ? "" : ".");
    }
    if (paso.b === 1) return "Solo hay un grupo: la respuesta es lo que ves dentro.";
    return "Suma los números de abajo. Ese es el total.";
  }

  /* Averiguar cuántos grupos: aquí la respuesta NO es la suma, así que la ayuda
     lleva por otro camino — contar los saltos hasta el total. */
  function pistaInversa(paso, nivel) {
    if (nivel === 0) {
      return "Aquí cuentas los grupos, no " + C.los(paso.gen) + " " + paso.nombre + ". Toca uno por uno.";
    }
    if (nivel === 1) {
      return "Ve tocando: " + C.saltos(paso.a, paso.b, 3) + " hasta llegar a " + paso.a * paso.b +
        ". Cuenta cuántos saltos das.";
    }
    return "Cada grupo tiene su número arriba. Cuéntalos uno por uno.";
  }

  function reto(paso, estado, opciones) {
    const nivel = estado.nivelAyuda;
    const t = enunciado(paso);
    const pista = paso.formato === "completar" ? pistaInversa(paso, nivel) : pistaDirecta(paso, nivel);
    const botones = opciones.map(function (v) {
      return '<button class="gema" data-accion="responder" data-valor="' + v + '" aria-label="Responder ' + v + '"><span>' + v + "</span></button>";
    }).join("");

    const contenido =
      '<h1 id="tituloEscena" class="titulo titulo--reto">' + esc(paso.titulo) + "</h1>" +
      '<div class="tarea">' +
      '<span class="etapa"><b>1</b> Cuenta</span>' +
      grupos(paso, nivel) +
      andamios(paso, nivel) +
      "</div>" +
      '<div class="panel panel--respuesta">' +
      '<span class="etapa"><b>2</b> Elige</span>' +
      '<p class="ecuacion-reto">' + t.ecuacion + "</p>" +
      '<p class="lectura"><span>' + t.lecturaSimbolo + "</span><span>" + t.lecturaGrupos + "</span></p>" +
      '<p class="pregunta">' + t.pregunta + "</p>" +
      '<p class="mensaje" id="mensajeReto" role="status" aria-live="polite">' + pista + "</p>" +
      '<div class="opciones" role="group" aria-label="' + esc(t.pregunta) + '">' + botones + "</div>" +
      (nivel < 2 ? '<button class="boton boton--pista" data-accion="pista">💡 Dame una pista</button>' : "") +
      "</div>";

    return marco(paso, estado, contenido, { voz: paso.nubo });
  }

  /* ---------- Recompensa ----------
     El mapa de poderes es la tabla que Lía acaba de construir, así que enseña
     el hecho ENTERO: `4 × 7 = 28`, no `4 × 7`. Una operación sin resultado no
     es un poder, es una pregunta pendiente.

     Y la marca de dominio va dicha con palabras. Antes eran ★★☆, que en este
     juego ya significan otra cosa —las que se atrapan en la lluvia—, y unas
     estrellas sueltas junto a una multiplicación no dicen nada por sí solas.
     Ahora cada rótulo se explica a sí mismo y no hace falta una leyenda que
     memorizar. Los cristalitos son de oro, no cian: en el sistema de
     materiales el oro es lo conseguido. */
  const DOMINIO = [
    { texto: "todavía no", clase: "poder--cero" },
    { texto: "con ayuda",  clase: "poder--uno"  },
    { texto: "casi",       clase: "poder--dos"  },
    { texto: "sin ayuda",  clase: "poder--tres" }
  ];

  function poderes(estado) {
    return C.TABLA.map(function (b) {
      const nivel = Progreso.estrellasDe(b);
      const d = DOMINIO[nivel];
      const marcas = [0, 1, 2].map(function (i) {
        return '<i class="' + (i < nivel ? "vivo" : "") + '"></i>';
      }).join("");
      return '<li class="poder ' + d.clase + (nivel ? " poder--visto" : "") + '"' +
        ' aria-label="4 por ' + b + " igual a " + 4 * b + ", " + d.texto + '">' +
        '<b aria-hidden="true">4 × ' + b + " = <em>" + 4 * b + "</em></b>" +
        '<span class="poder-marca" aria-hidden="true">' + marcas +
        "<small>" + d.texto + "</small></span></li>";
    }).join("");
  }

  function recompensa(paso, estado) {
    let cuerpo = "";
    if (paso.tesoro) {
      cuerpo = '<div class="tesoro"><span class="tesoro-icono" aria-hidden="true">' + paso.tesoro.icono + "</span>" +
        "<b>" + esc(paso.tesoro.nombre) + "</b><small>" + esc(paso.tesoro.detalle) + "</small></div>";
    }
    if (paso.resumen) {
      cuerpo += '<p class="lema">Tus poderes de la tabla del 4</p>' +
        '<ul class="poderes" aria-label="Tus poderes de la tabla del 4">' + poderes(estado) + "</ul>";
    }
    const contenido =
      '<div class="fogonazo" aria-hidden="true"></div>' +
      '<h1 id="tituloEscena" class="titulo titulo--premio">' + esc(paso.titulo) + "</h1>" +
      cuerpo;
    return marco(paso, estado, contenido, { acciones: [{ accion: "avanzar", texto: paso.boton }] });
  }

  /* ---------- Minijuego ----------
     El cartel de la esquina lleva la multiplicación y las estrellas llevan los
     resultados. Es el puente entre la secuencia y la lucha: aquí ya no hay nada
     que contar, pero tampoco hay tiempo de pensarlo dos veces. */
  function minijuego(paso, estado) {
    const contenido =
      '<h1 id="tituloEscena" class="titulo">' + esc(paso.titulo) + "</h1>" +
      '<div class="arena" id="arena">' +
      '<div class="cartel" id="cartelLluvia" role="status" aria-live="polite" hidden></div>' +
      '<p class="arena-aviso" id="arenaAviso">Cuando digas, empiezan a caer.</p></div>' +
      '<div class="marcador">' +
      '<span><b id="marcadorAciertos">0</b> de ' + paso.oleadas + "</span>" +
      '<i aria-hidden="true">·</i>' +
      '<span><b id="marcadorEstrellas">0</b> ✨</span>' +
      "</div>";
    return marco(paso, estado, contenido, { acciones: [{ accion: "jugar-minijuego", texto: paso.boton }] });
  }

  /* ---------- Jefe ---------- */
  function jefe(paso, estado, pregunta, opciones, vida) {
    const corazones = Array.from({ length: paso.corazones }, function (_, i) {
      return '<span class="bloque ' + (i < paso.corazones - vida ? "bloque--roto" : "") + '" aria-hidden="true"></span>';
    }).join("");
    let cuerpo;
    if (!pregunta) {
      cuerpo = '<div class="panel panel--aviso"><p>Quatron tiene <b>' + paso.corazones + " bloques</b>. Cada respuesta correcta suelta uno.</p></div>";
    } else {
      const botones = opciones.map(function (v) {
        return '<button class="gema gema--ataque" data-accion="responder-jefe" data-valor="' + v + '" aria-label="Atacar con ' + v + '"><span>' + v + "</span></button>";
      }).join("");
      cuerpo = '<div class="panel panel--respuesta panel--jefe">' +
        '<p class="operacion-jefe">' + pregunta.a + " × " + pregunta.b + " = <b>?</b></p>" +
        '<div class="opciones" role="group" aria-label="' + pregunta.a + " por " + pregunta.b + '">' + botones + "</div>" +
        '<p class="mensaje" id="mensajeReto" role="status" aria-live="polite">Elige el resultado correcto.</p>' +
        "</div>";
    }
    const contenido =
      '<h1 id="tituloEscena" class="titulo titulo--jefe">' + esc(paso.titulo) + "</h1>" +
      '<div class="vida-jefe" role="img" aria-label="A Quatron le quedan ' + vida + " de " + paso.corazones + ' bloques">' + corazones + "</div>" +
      cuerpo;
    return marco(paso, estado, contenido, {
      voz: paso.nubo,
      acciones: pregunta ? null : [{ accion: "empezar-jefe", texto: paso.boton }]
    });
  }

  /* ---------- Epílogo ---------- */
  function epilogo(paso, estado) {
    const s = estado.sesion;
    const contenido =
      '<div class="sombra-misterio" aria-hidden="true"></div>' +
      '<h1 id="tituloEscena" class="titulo titulo--misterio">' + esc(paso.titulo) + "</h1>" +
      '<p class="lema">' + esc(paso.cierre) + "</p>" +
      '<ul class="cierre-datos">' +
      "<li><b>" + s.aciertos + "</b><small>retos resueltos</small></li>" +
      "<li><b>" + estado.cristales + "</b><small>cristales</small></li>" +
      "<li><b>" + estado.tesoros.length + "</b><small>tesoros</small></li>" +
      "</ul>";
    return marco(paso, estado, contenido, {
      /* Los dos vuelven a aparecer aquí, de pie en el sendero. La aventura
         empieza con ellos mirando el castillo y se cierra con ellos mirando el
         cuadro: la última escena no puede ser la única en la que no están.
         Nubo sale del pie de página y se planta al lado de Lía, a la altura
         que le toca: un cachorro junto a ella, no un icono de interfaz. */
      figuras: [
        { quien: "lia",  src: "assets/personajes/web/lia.png",  alt: "Lía, de pie frente al cuadro" },
        { quien: "nubo", src: "assets/personajes/web/nubo.png", alt: "Nubo, a su lado" }
      ],
      acciones: [
        { accion: "otra-vez", texto: paso.boton },
        { accion: "volver-inicio", texto: paso.botonSecundario, clase: "boton--calma" }
      ]
    });
  }

  window.Escenas = {
    portada: portada,
    mapa: mapa,
    reto: reto,
    recompensa: recompensa,
    minijuego: minijuego,
    jefe: jefe,
    epilogo: epilogo
  };
})();
