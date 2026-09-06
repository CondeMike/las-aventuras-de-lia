/* Control del juego: qué escena toca, qué pasa al responder y cómo se celebra. */
(function () {
  "use strict";

  const raiz = document.getElementById("juego");
  const C = window.Contenido;

  let bloqueado = false;
  let opcionesActuales = [];
  let pasoGuardado = 0;
  let jefe = null;
  let mini = null;
  let vecesLluvia = 0;
  let mostrandoPortada = true;
  let ocupado = false;

  /* ---------- utilidades ---------- */
  function mezclar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Distractores plausibles + la respuesta, siempre en posición aleatoria. Los
     retos y Quatron piden dos; la lluvia de estrellas pide tres. */
  function armarOpciones(correcta, candidatas, cuantos) {
    const n = cuantos || 2;
    const validas = [];
    mezclar(candidatas).forEach(function (v) {
      if (v > 0 && v !== correcta && !validas.includes(v) && validas.length < n) validas.push(v);
    });
    while (validas.length < n) {
      const extra = correcta + (validas.length + 1) * 2;
      if (!validas.includes(extra)) validas.push(extra);
    }
    return mezclar(validas.concat([correcta]));
  }

  function opcionesDeReto(paso) {
    if (paso.formato === "completar") {
      return armarOpciones(paso.b, [paso.b - 1, paso.b + 1, paso.b + 2, paso.b - 2, paso.b + 3]);
    }
    const c = paso.a * paso.b;
    return armarOpciones(c, [c - paso.a, c + paso.a, c + 2 * paso.a, c - 2 * paso.a, paso.a + paso.b]);
  }

  function respuestaEsperada(paso) {
    return paso.formato === "completar" ? paso.b : paso.a * paso.b;
  }

  function enfocarTitulo() {
    const t = raiz.querySelector("h1");
    if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); }
  }

  /* Precarga el fondo siguiente para que el cambio de escena sea instantáneo. */
  function precargar(indice) {
    const p = C.PASOS[indice];
    if (!p) return;
    const img = new Image();
    img.src = C.fondoDe(p);
  }

  /* El puntero mueve el mundo un poco: el telón poco, el follaje delantero el
     doble. Se guarda en la raíz para que sobreviva a los repintados. */
  function seguirMirada(ev) {
    const x = (ev.clientX / window.innerWidth - .5) * 2;
    const y = (ev.clientY / window.innerHeight - .5) * 2;
    raiz.style.setProperty("--px", x.toFixed(3));
    raiz.style.setProperty("--py", y.toFixed(3));
  }

  /* ---------- pintado ---------- */
  function renderizar() {
    const estado = Progreso.obtener();
    const paso = C.paso(mostrandoPortada ? 0 : estado.pasoActual);
    bloqueado = false;

    if (paso.tipo === "portada") raiz.innerHTML = Escenas.portada(paso, estado);
    else if (paso.tipo === "mapa") raiz.innerHTML = Escenas.mapa(paso, estado);
    else if (paso.tipo === "reto") raiz.innerHTML = Escenas.reto(paso, estado, opcionesActuales);
    else if (paso.tipo === "recompensa") raiz.innerHTML = Escenas.recompensa(paso, estado);
    else if (paso.tipo === "minijuego") raiz.innerHTML = Escenas.minijuego(paso, estado);
    else if (paso.tipo === "jefe") raiz.innerHTML = Escenas.jefe(paso, estado, jefe && jefe.pregunta, (jefe && jefe.opciones) || [], jefe ? jefe.vida : paso.corazones);
    else raiz.innerHTML = Escenas.epilogo(paso, estado);

    window.scrollTo(0, 0);
    enfocarTitulo();
    precargar(mostrandoPortada ? pasoGuardado : estado.pasoActual + 1);
  }

  /* Entrar a un paso: prepara su estado y lo pinta con una transición suave. */
  function entrar(indice, conTelon) {
    if (ocupado && conTelon !== false) return;
    function pintar() {
      mostrandoPortada = false;
      pasoGuardado = indice;
      Progreso.irAPaso(indice);
      const paso = C.paso(indice);
      jefe = null;
      mini = null;
      if (paso.tipo !== "minijuego") vecesLluvia = 0;
      if (paso.tipo === "reto") {
        Progreso.presentarReto();
        opcionesActuales = opcionesDeReto(paso);
      }
      renderizar();
    }
    if (conTelon === false) return pintar();
    transicion(pintar);
  }

  function transicion(alMedio) {
    ocupado = true;
    const capa = document.createElement("div");
    capa.className = "cortina";
    document.body.appendChild(capa);
    window.setTimeout(function () {
      alMedio();
      ocupado = false;
      capa.classList.add("cortina--abre");
      window.setTimeout(function () { capa.remove(); }, 520);
    }, 260);
  }

  /* ---------- refuerzo al acertar ---------- */
  function celebrar(paso, alCerrar) {
    const producto = paso.a * paso.b;
    const cristal = Boolean(paso.otorgaCristal);
    const capa = document.createElement("div");
    let completado = false, arrastrando = false, movido = false, inicioX = 0, inicioY = 0;

    capa.className = "refuerzo" + (cristal ? " refuerzo--cristal" : "");
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.setAttribute("aria-labelledby", "tituloRefuerzo");
    capa.innerHTML =
      '<div class="rayos" aria-hidden="true"></div>' +
      '<div class="refuerzo-caja">' +
      '<p class="refuerzo-guia" id="tituloRefuerzo"><b>¡Encontraste el resultado!</b><span>Arrastra el ' + producto + " hasta su casilla.</span></p>" +
      '<div class="ecuacion"><span>' + paso.a + " × " + paso.b + " =</span>" +
      '<span class="hueco" aria-label="Casilla del resultado">?</span></div>' +
      '<button class="ficha" type="button" aria-label="Resultado ' + producto + '. Arrástralo a su casilla o tócalo para colocarlo.">' + producto + "</button>" +
      '<div class="refuerzo-final" aria-live="polite"></div>' +
      "</div>";
    raiz.querySelector(".escena").appendChild(capa);

    const ficha = capa.querySelector(".ficha");
    const hueco = capa.querySelector(".hueco");
    const cierre = capa.querySelector(".refuerzo-final");

    function colocar() {
      if (completado) return;
      completado = true; arrastrando = false;
      ficha.style.transform = "";
      ficha.classList.remove("ficha--moviendo");
      ficha.hidden = true;
      hueco.textContent = producto;
      hueco.classList.add("hueco--lleno");
      capa.classList.add("refuerzo--completo");
      Sonidos.reproducir(cristal ? "cristal" : "poder");
      cierre.innerHTML =
        '<p class="refuerzo-frase"><b>' + paso.a + " × " + paso.b + " = " + producto + "</b><span>" + paso.logro + "</span></p>" +
        (cristal ? '<div class="cristal-premio" aria-label="Cristal recuperado">◆</div>' : "") +
        '<button class="boton boton--oro cerrar-refuerzo" type="button">' + (cristal ? "Guardar el cristal" : "Seguir") + "</button>";
      const boton = cierre.querySelector(".cerrar-refuerzo");
      boton.addEventListener("click", function () {
        if (boton.disabled) return;
        boton.disabled = true;
        capa.classList.add("refuerzo--sale");
        window.setTimeout(function () { capa.remove(); alCerrar(); }, 420);
      });
      boton.focus({ preventScroll: true });
    }

    ficha.addEventListener("pointerdown", function (ev) {
      arrastrando = true; movido = false; inicioX = ev.clientX; inicioY = ev.clientY;
      ficha.setPointerCapture(ev.pointerId);
      ficha.classList.add("ficha--moviendo");
    });
    ficha.addEventListener("pointermove", function (ev) {
      if (!arrastrando) return;
      movido = Math.abs(ev.clientX - inicioX) + Math.abs(ev.clientY - inicioY) > 8;
      ficha.style.transform = "translate(" + (ev.clientX - inicioX) + "px," + (ev.clientY - inicioY) + "px) scale(1.1)";
    });
    ficha.addEventListener("pointerup", function (ev) {
      if (!arrastrando) return;
      arrastrando = false;
      const caja = hueco.getBoundingClientRect();
      const dentro = ev.clientX >= caja.left - 30 && ev.clientX <= caja.right + 30 &&
        ev.clientY >= caja.top - 30 && ev.clientY <= caja.bottom + 30;
      if (dentro) colocar();
      else { ficha.style.transform = ""; ficha.classList.remove("ficha--moviendo"); }
    });
    ficha.addEventListener("click", function () { if (!movido) colocar(); movido = false; });
    ficha.focus({ preventScroll: true });
  }

  /* ---------- responder un reto ---------- */
  function responder(valor) {
    if (bloqueado) return;
    const estado = Progreso.obtener();
    const paso = C.paso(estado.pasoActual);
    const clave = C.claveOperacion(paso.a, paso.b);
    const esperada = respuestaEsperada(paso);

    if (valor !== esperada) {
      Sonidos.reproducir("casi");
      Progreso.registrarError(clave);
      renderizar();
      const m = document.getElementById("mensajeReto");
      m.className = "mensaje mensaje--pista";
      m.textContent = paso.formato === "completar"
        ? "Ese no era. Cuenta otra vez los grupos, uno por uno."
        : (valor < esperada
          ? "Ese no era. Vuelve a contar de " + paso.a + " en " + paso.a + ", sin saltarte ninguno."
          : (paso.b === 1
            ? "Ese no era. Mira otra vez: dentro hay " + paso.a + " " + paso.nombre + "."
            : "Ese no era. Mira: cada grupo tiene " + paso.a + " " + paso.nombre + "."));
      m.tabIndex = -1;
      m.focus({ preventScroll: true });
      return;
    }

    bloqueado = true;
    const limpio = Progreso.registrarAcierto(clave);
    Sonidos.reproducir("acierto");
    raiz.querySelectorAll(".gema, .boton--pista").forEach(function (b) { b.disabled = true; });
    const zona = document.getElementById("gruposReto");
    if (zona) zona.classList.add("brilla");
    const m = document.getElementById("mensajeReto");
    m.className = "mensaje mensaje--bien";
    m.innerHTML = limpio ? "¡Lo contaste sin ayuda! 🌟" : "¡Ahí está! " + paso.a + " × " + paso.b + " = <b>" + paso.a * paso.b + "</b>";

    ocupado = true;
    window.setTimeout(function () {
      celebrar(paso, function () {
        if (paso.otorgaCristal) {
          Progreso.concederCristal(paso.otorgaCristal);
          Sonidos.reproducir("cristal");
        }
        entrar(Progreso.obtener().pasoActual + 1);
      });
      ocupado = false;
    }, 520);
  }

  function pedirPista() {
    Progreso.pedirPista();
    Sonidos.reproducir("ayuda");
    renderizar();
    const m = document.getElementById("mensajeReto");
    m.tabIndex = -1;
    m.focus({ preventScroll: true });
  }

  /* ---------- minijuego de estrellas ----------
     Ya no es solo puntería. En el cartel aparece una multiplicación y hay que
     atrapar la estrella que lleva el resultado. Las preguntas salen SOLO de lo
     que ya se enseñó —nunca de un reto que todavía no ha llegado— y con el
     mismo sorteo sesgado de Quatron, así que lo que costó vuelve más veces.
     La cadencia es la de antes: cinco rondas cada 2,5 s. Acertar pronto no
     acorta la partida, deja tiempo de recoger las estrellas que sobran. */

  /* El primer premio de la escalera que Nubo todavía no tiene. Cuando ya están
     todos, la partida sigue teniendo sentido: cada vuelta va más rápida. */
  function premioPendiente(paso, tesoros) {
    const escalera = paso.tesorosPerfectos || [];
    for (let i = 0; i < escalera.length; i++) {
      if (!tesoros.includes(escalera[i].id)) return escalera[i];
    }
    return null;
  }

  function operacionesYaVistas(indice) {
    const vistas = C.PASOS.slice(0, indice)
      .filter(function (p) { return p.tipo === "reto" && p.b > 1; })
      .map(function (p) { return p.b; });
    return vistas.length ? vistas : C.FAMILIA.slice(0, 4);
  }

  function jugarMinijuego() {
    const inicio = Progreso.obtener();
    const paso = C.paso(inicio.pasoActual);
    const arena = document.getElementById("arena");
    const aviso = document.getElementById("arenaAviso");
    const cartel = document.getElementById("cartelLluvia");
    const marcaEstrellas = document.getElementById("marcadorEstrellas");
    const marcaAciertos = document.getElementById("marcadorAciertos");
    const boton = raiz.querySelector("[data-accion='jugar-minijuego']");
    if (!arena || mini) return;

    /* Cada partida seguida va más rápida que la anterior. Se acelera solo
       dentro de la misma visita: quien vuelve otro día empieza tranquila. */
    const impulso = 1 + vecesLluvia * (paso.acelera || 0.18);
    const caida = Math.max(paso.caidaMinima || 1.6, (paso.caida || 4.1) / impulso);
    const cadencia = Math.round((paso.cadencia || 4200) / impulso);
    const premio = premioPendiente(paso, inicio.tesoros);
    const pozo = operacionesYaVistas(inicio.pasoActual);
    const cola = [];
    while (cola.length < paso.oleadas) {
      cola.push.apply(cola, Progreso.operacionesParaRepasar(pozo, paso.oleadas - cola.length));
    }

    vecesLluvia += 1;
    mini = { atrapadas: 0, aciertos: 0, oleada: 0, b: 0, resuelta: false, terminado: false, premio: premio };
    if (aviso) aviso.remove();
    if (boton) boton.disabled = true;

    /* La instrucción ya la leyó antes de empezar. En cuanto cae la primera
       estrella lo que hace falta no es explicar el juego, es decir qué está
       en juego: sin apuesta, atrapar la cuarta da igual que fallarla. */
    const voz = document.getElementById("vozTexto");
    if (voz) {
      voz.textContent = premio
        ? "¡Acierta las " + paso.oleadas + " y Nubo gana " + premio.icono + " " + premio.nombre + "!"
        : "Nubo ya tiene todos sus premios. ¿Le ganas a la vez pasada? ¡Ahora va más rápido!";
    }

    function limpiarCielo() {
      arena.querySelectorAll(".estrella").forEach(function (e) { e.remove(); });
    }

    function fin() {
      if (mini.terminado) return;
      mini.terminado = true;
      limpiarCielo();
      const perfecto = mini.aciertos === paso.oleadas;
      const ganado = perfecto ? mini.premio : null;
      Progreso.sumarEstrellas(mini.atrapadas);
      if (ganado) Progreso.guardarTesoro(ganado.id);
      Sonidos.reproducir(ganado ? "cristal" : "poder");
      const queda = premioPendiente(paso, Progreso.obtener().tesoros);
      arena.innerHTML = '<div class="arena-final">' +
        '<p class="refuerzo-frase"><b>' + mini.aciertos + " de " + paso.oleadas + "</b>" +
        "<span>" + (perfecto ? "¡No fallaste ni una!" : "multiplicaciones acertadas") + "</span></p>" +
        '<p class="arena-marca">Atrapaste <b>' + mini.atrapadas + "</b> ✨</p>" +
        (ganado
          ? '<div class="tesoro tesoro--sorpresa"><span class="tesoro-icono" aria-hidden="true">' + ganado.icono + "</span>" +
            "<b>" + ganado.nombre + "</b><small>" + ganado.detalle + "</small></div>"
          : "") +
        /* El gancho para volver a jugar: se ve cuál es el siguiente premio,
           no se promete uno en abstracto. */
        (queda
          ? '<p class="arena-proximo">A Nubo le espera <b>' + queda.icono + " " + queda.nombre + "</b></p>"
          : "") +
        "</div>";
      if (boton) {
        boton.disabled = false;
        boton.textContent = "Seguir la aventura";
        boton.dataset.accion = "avanzar";
        /* Volver a intentarlo es lo mejor que puede pasar aquí: repetir una
           ronda de recuperación es exactamente la práctica que se busca. Así
           que el botón está siempre, y el rótulo no miente a la segunda. */
        if (!raiz.querySelector("[data-accion='repetir-lluvia']")) {
          const otra = document.createElement("button");
          otra.type = "button";
          otra.className = "boton boton--calma";
          otra.dataset.accion = "repetir-lluvia";
          boton.parentNode.insertBefore(otra, boton);
        }
        raiz.querySelector("[data-accion='repetir-lluvia']").textContent =
          queda ? (vecesLluvia === 1 ? "¡Una última vez!" : "¡Otra más!") : "¡Otra vez, más rápido!";
        boton.focus({ preventScroll: true });
      }
    }

    function pintarCartel(resuelto) {
      cartel.hidden = false;
      cartel.classList.toggle("cartel--bien", Boolean(resuelto));
      cartel.innerHTML = "<span>4 × " + mini.b + " =</span><b>" +
        (resuelto ? 4 * mini.b : "?") + "</b>";
    }

    function soltarOleada() {
      if (mini.terminado) return;
      if (mini.oleada >= paso.oleadas) {
        /* Un respiro para ver el cartel en verde de la última ronda, y ya. La
           espera larga de antes solo enseñaba un cielo vacío. */
        window.setTimeout(fin, 700);
        return;
      }
      /* Las que quedaban se apagan: dos multiplicaciones distintas cayendo a la
         vez no se pueden leer. */
      limpiarCielo();

      mini.oleada += 1;
      mini.b = cola[mini.oleada - 1];
      mini.resuelta = false;
      const correcta = 4 * mini.b;
      pintarCartel(false);

      const valores = armarOpciones(correcta,
        [correcta - 4, correcta + 4, correcta + 8, correcta - 8, 4 + mini.b, correcta - 2], 3);
      valores.forEach(function (v, i) {
        const estrella = document.createElement("button");
        estrella.type = "button";
        estrella.className = "estrella";
        estrella.dataset.accion = "atrapar";
        estrella.dataset.valor = v;
        estrella.innerHTML = "<span>" + v + "</span>";
        estrella.setAttribute("aria-label", "Estrella con el " + v);
        estrella.style.left = (6 + i * 22 + Math.random() * 7) + "%";
        estrella.style.animationDuration = caida + "s";
        estrella.style.animationDelay = (i * 0.07) + "s";
        arena.appendChild(estrella);
      });
      window.setTimeout(soltarOleada, cadencia);
    }

    function recoger(e) {
      e.classList.add("estrella--atrapada");
      mini.atrapadas += 1;
      marcaEstrellas.textContent = mini.atrapadas;
      window.setTimeout(function () { e.remove(); }, 260);
    }

    function atrapar(ev) {
      const e = ev.target.closest(".estrella");
      if (!e || !arena.contains(e) || e.classList.contains("estrella--atrapada")) return;

      /* Las que sobran de una ronda ya resuelta valen como estrella suelta:
         ese es el premio por haber acertado rápido. */
      if (e.classList.contains("estrella--suelta")) {
        Sonidos.reproducir("toque");
        return recoger(e);
      }
      if (mini.resuelta) return;

      if (Number(e.dataset.valor) !== 4 * mini.b) {
        /* Un fallo aquí no se anota en ningún sitio: en la lluvia también se
           falla por puntería, y eso no dice nada de la tabla. */
        Sonidos.reproducir("casi");
        e.classList.add("estrella--fallada");
        window.setTimeout(function () { e.remove(); }, 320);
        return;
      }

      mini.resuelta = true;
      mini.aciertos += 1;
      marcaAciertos.textContent = mini.aciertos;
      Progreso.registrarAciertoAlVuelo(C.claveOperacion(4, mini.b));
      Sonidos.reproducir("acierto");
      pintarCartel(true);
      recoger(e);
      arena.querySelectorAll(".estrella:not(.estrella--atrapada)").forEach(function (o) {
        o.classList.add("estrella--suelta");
        o.innerHTML = "<span>✦</span>";
        o.setAttribute("aria-label", "Atrapar estrella");
        o.removeAttribute("data-valor");
      });
    }

    arena.addEventListener("pointerdown", atrapar);
    soltarOleada();
  }

  /* ---------- Quatron ---------- */
  function siguientePreguntaJefe() {
    const b = jefe.cola.shift();
    const correcta = 4 * b;
    jefe.pregunta = { a: 4, b: b };
    jefe.opciones = armarOpciones(correcta, [correcta - 4, correcta + 4, correcta + 8, correcta - 8, 4 + b]);
    renderizar();
  }

  function empezarJefe() {
    if (jefe) return;
    const paso = C.paso(Progreso.obtener().pasoActual);
    /* Quatron trae de vuelta justo lo que más le costó. */
    const cola = Progreso.operacionesParaRepasar(C.FAMILIA, paso.corazones);
    jefe = { vida: paso.corazones, cola: cola, pregunta: null, opciones: [] };
    Sonidos.reproducir("puerta");
    siguientePreguntaJefe();
  }

  function responderJefe(valor) {
    if (bloqueado || !jefe || !jefe.pregunta) return;
    const paso = C.paso(Progreso.obtener().pasoActual);
    const p = jefe.pregunta;
    const clave = C.claveOperacion(p.a, p.b);

    if (valor !== 4 * p.b) {
      Sonidos.reproducir("casi");
      Progreso.registrarError(clave);
      const m = document.getElementById("mensajeReto");
      const suma = Array.from({ length: p.b }, function () { return "4"; }).join(" + ");
      m.className = "mensaje mensaje--pista";
      m.innerHTML = "Nubo susurra: <b>" + suma + "</b>. Cuenta de 4 en 4.";
      raiz.querySelector(".escena").classList.add("tiembla");
      window.setTimeout(function () { raiz.querySelector(".escena").classList.remove("tiembla"); }, 500);
      return;
    }

    bloqueado = true;
    Progreso.registrarAcierto(clave);
    Sonidos.reproducir("golpe");
    jefe.vida -= 1;
    raiz.querySelectorAll(".gema").forEach(function (b) { b.disabled = true; });
    const m = document.getElementById("mensajeReto");
    m.className = "mensaje mensaje--bien";
    m.innerHTML = "¡" + p.a + " × " + p.b + " = <b>" + p.a * p.b + "</b>! Se soltó un bloque.";
    raiz.querySelector(".escena").classList.add("impacto");

    window.setTimeout(function () {
      bloqueado = false;
      const escena = raiz.querySelector(".escena");
      if (escena) escena.classList.remove("impacto");
      if (!jefe) return;
      if (jefe.vida > 0) return siguientePreguntaJefe();
      Progreso.concederCristal(paso.otorgaCristal);
      Sonidos.reproducir("cristal");
      entrar(Progreso.obtener().pasoActual + 1);
    }, 900);
  }

  /* ---------- diálogo de reinicio ---------- */
  function confirmarReinicio() {
    const capa = document.createElement("div");
    capa.className = "modal";
    capa.innerHTML = '<div class="modal-caja" role="dialog" aria-modal="true" aria-labelledby="tituloModal">' +
      '<h2 id="tituloModal">¿Empezar la aventura otra vez?</h2>' +
      "<p>Volverás al comienzo del Reino Cuadrado. Tus tesoros y tus poderes se quedan contigo.</p>" +
      '<div class="modal-acciones"><button class="boton boton--oro" data-accion="reiniciar">Sí, empezar</button>' +
      '<button class="boton boton--calma" data-accion="cancelar-reinicio">Seguir jugando</button></div></div>';
    raiz.querySelector(".escena").appendChild(capa);
    capa.querySelector("[data-accion='cancelar-reinicio']").focus();
  }

  /* ---------- eventos ---------- */
  if (window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", seguirMirada, { passive: true });
  }

  raiz.addEventListener("click", function (ev) {
    const boton = ev.target.closest("[data-accion]");
    if (!boton || boton.disabled || ocupado) return;
    const accion = boton.dataset.accion;
    const estado = Progreso.obtener();

    if (accion === "comenzar") { Sonidos.reproducir("viajar"); entrar(pasoGuardado > 0 ? pasoGuardado : 1); }
    else if (accion === "avanzar") {
      if (C.paso(estado.pasoActual).tesoro) Progreso.guardarTesoro(C.paso(estado.pasoActual).tesoro.id);
      Sonidos.reproducir("viajar");
      entrar(estado.pasoActual + 1);
    }
    else if (accion === "responder") responder(Number(boton.dataset.valor));
    else if (accion === "pista") pedirPista();
    else if (accion === "jugar-minijuego") jugarMinijuego();
    else if (accion === "repetir-lluvia") {
      Sonidos.reproducir("viajar");
      entrar(estado.pasoActual);
      /* Quien pulsa "otra vez" ya está lista: no hay que pedirle que empiece
         dos veces. Se espera a que el telón termine de abrirse. */
      window.setTimeout(jugarMinijuego, 640);
    }
    else if (accion === "empezar-jefe") empezarJefe();
    else if (accion === "responder-jefe") responderJefe(Number(boton.dataset.valor));
    else if (accion === "otra-vez") { Progreso.completarAventura(); Progreso.nuevaSesion(); entrar(1); }
    else if (accion === "volver-inicio") { Progreso.completarAventura(); Progreso.nuevaSesion(); entrar(0); }
    else if (accion === "confirmar-reinicio") confirmarReinicio();
    else if (accion === "cancelar-reinicio") { boton.closest(".modal").remove(); enfocarTitulo(); }
    else if (accion === "reiniciar") { Progreso.nuevaSesion(); entrar(0); }
    else if (accion === "sonido") {
      const activo = Sonidos.alternar();
      Progreso.cambiarSonido(activo);
      boton.textContent = activo ? "🔊" : "🔇";
      boton.setAttribute("aria-pressed", activo);
      boton.setAttribute("aria-label", activo ? "Silenciar sonidos" : "Activar sonidos");
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    const modal = raiz.querySelector(".modal");
    if (modal) { modal.remove(); enfocarTitulo(); }
  });

  /* ---------- arranque ---------- */
  Sonidos.establecer(Progreso.obtener().preferencias.sonido);
  /* La sesión siempre abre en la portada; el botón devuelve a Lía donde lo dejó. */
  pasoGuardado = Progreso.obtener().pasoActual;
  mostrandoPortada = true;
  renderizar();
})();
