(function () {
  "use strict";
  const raiz = document.getElementById("juego");
  let bloqueado = false;
  function retoActual() { return Escenas.RETOS[Progreso.obtener().retoActual]; }
  function enfocarTitulo() { const t = raiz.querySelector("h1"); if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); } }
  function renderizar(escena) {
    bloqueado = false; const e = Progreso.obtener();
    if (escena === "inicio") raiz.innerHTML = Escenas.inicio(e);
    else if (escena === "mapa") raiz.innerHTML = Escenas.mapa(e);
    else if (escena === "reto" && retoActual()) raiz.innerHTML = Escenas.reto(retoActual(), e);
    else raiz.innerHTML = Escenas.final(e);
    window.scrollTo(0, 0); enfocarTitulo();
  }
  function celebrar(r, correcto, cristal, alCerrar) {
    const capa = document.createElement("div"); let completado = false; let arrastrando = false; let movido = false; let inicioX = 0; let inicioY = 0;
    capa.className = "celebracion-operacion" + (cristal ? " celebracion-operacion--cristal" : ""); capa.setAttribute("role", "dialog"); capa.setAttribute("aria-modal", "true"); capa.setAttribute("aria-labelledby", "tituloRefuerzo");
    capa.innerHTML = '<div class="rayos-logro" aria-hidden="true"></div><div class="instruccion-refuerzo" id="tituloRefuerzo"><strong>¡Encontraste el resultado!</strong><span>Arrastra el ' + correcto + ' hasta el cajón.</span></div><div class="ecuacion-impacto ecuacion-arrastre"><span>4 × ' + r.grupos + ' =</span><span class="cajon-resultado" aria-label="Cajón para el resultado">?</span></div><button class="numero-arrastrable" type="button" aria-label="Resultado ' + correcto + '. Arrástralo al cajón o tócalo para colocarlo.">' + correcto + '</button><div class="confirmacion-refuerzo" aria-live="polite"></div>';
    raiz.querySelector(".escena").appendChild(capa);
    const numero = capa.querySelector(".numero-arrastrable"); const cajon = capa.querySelector(".cajon-resultado"); const confirmacion = capa.querySelector(".confirmacion-refuerzo");
    function colocar() {
      if (completado) return; completado = true; arrastrando = false; numero.style.transform = ""; numero.classList.remove("numero-arrastrable--moviendo"); numero.hidden = true; cajon.textContent = correcto; cajon.classList.add("cajon-resultado--lleno"); capa.classList.add("celebracion-operacion--completa"); Sonidos.reproducir("poder");
      confirmacion.innerHTML = '<strong>¡Exacto! 4 × ' + r.grupos + ' = ' + correcto + '</strong><span>' + r.logro + '</span>' + (cristal ? '<span class="cristal-mini" aria-hidden="true">◆</span>' : '') + '<button class="boton boton--oro cerrar-refuerzo" type="button">Continuar</button>';
      const cerrar = confirmacion.querySelector(".cerrar-refuerzo"); cerrar.addEventListener("click", function () { capa.classList.add("celebracion-operacion--sale"); window.setTimeout(function () { capa.remove(); alCerrar(); }, 450); }); cerrar.focus({ preventScroll: true });
    }
    numero.addEventListener("pointerdown", function (ev) { arrastrando = true; movido = false; inicioX = ev.clientX; inicioY = ev.clientY; numero.setPointerCapture(ev.pointerId); numero.classList.add("numero-arrastrable--moviendo"); });
    numero.addEventListener("pointermove", function (ev) { if (!arrastrando) return; movido = Math.abs(ev.clientX - inicioX) + Math.abs(ev.clientY - inicioY) > 8; numero.style.transform = "translate(" + (ev.clientX - inicioX) + "px," + (ev.clientY - inicioY) + "px) scale(1.08)"; });
    numero.addEventListener("pointerup", function (ev) { if (!arrastrando) return; arrastrando = false; const caja = cajon.getBoundingClientRect(); const dentro = ev.clientX >= caja.left - 24 && ev.clientX <= caja.right + 24 && ev.clientY >= caja.top - 24 && ev.clientY <= caja.bottom + 24; if (dentro) colocar(); else { numero.style.transform = ""; numero.classList.remove("numero-arrastrable--moviendo"); } });
    numero.addEventListener("click", function () { if (!movido) colocar(); movido = false; }); numero.focus({ preventScroll: true });
  }
  function mostrarPista() { Progreso.pedirPista(); Sonidos.reproducir("ayuda"); renderizar("reto"); const m = document.getElementById("mensajeReto"); m.tabIndex = -1; m.focus({ preventScroll: true }); }
  function responder(valor) {
    if (bloqueado) return;
    const r = retoActual(); const correcto = r.grupos * 4;
    if (valor !== correcto) {
      Sonidos.reproducir("casi"); Progreso.registrarError(r.id); renderizar("reto");
      const m = document.getElementById("mensajeReto"); m.textContent = valor < correcto ? "¡Buen intento! Cuenta otra vez las " + r.nombre + " de 4 en 4." : "¡Buen intento! Revisa los grupos: hay 4 " + r.nombre + " en cada uno."; m.tabIndex = -1; m.focus({ preventScroll: true }); return;
    }
    bloqueado = true; Progreso.registrarAcierto(r.id); Sonidos.reproducir("acierto");
    const cristal = [1, 3, 6].includes(Progreso.obtener().retoActual);
    raiz.querySelectorAll(".opcion, .boton--pista").forEach(function (b) { b.disabled = true; });
    document.getElementById("gruposReto").classList.add("brilla");
    const m = document.getElementById("mensajeReto"); m.className = "mensaje mensaje--bien"; m.innerHTML = "¡Lo lograste! <strong>Hay " + correcto + " " + r.nombre + " en total.</strong>";
    const b = document.createElement("button"); b.className = "boton boton--oro continuar-reto"; b.dataset.accion = "continuar"; b.disabled = true; b.textContent = cristal ? "Guardar el cristal" : "Seguir el sendero"; m.insertAdjacentElement("afterend", b);
    celebrar(r, correcto, cristal, function () { bloqueado = false; b.disabled = false; b.focus({ preventScroll: true }); });
  }
  function continuar() {
    const cristal = retoActual().cristal; Progreso.avanzarReto(); const siguiente = retoActual();
    if (!siguiente || siguiente.cristal !== cristal) { Progreso.concederCristal(cristal); Sonidos.reproducir("poder"); renderizar("mapa"); }
    else { Progreso.presentarReto(Progreso.obtener().retoActual); renderizar("reto"); }
  }
  function confirmarReinicio() {
    const d = document.createElement("div"); d.className = "dialogo-capa"; d.innerHTML = '<div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="tituloDialogo"><h2 id="tituloDialogo">¿Empezar una aventura nueva?</h2><p>El recorrido actual volverá al comienzo.</p><button class="boton boton--oro" data-accion="reiniciar">Sí, empezar</button> <button class="boton boton--secundario" data-accion="cancelar-reinicio">Seguir jugando</button></div>'; raiz.querySelector(".escena").appendChild(d); d.querySelector("[data-accion='cancelar-reinicio']").focus();
  }
  raiz.addEventListener("click", function (ev) {
    const b = ev.target.closest("[data-accion]"); if (!b) return; const a = b.dataset.accion;
    if (a === "comenzar") { Progreso.iniciarAventura(); renderizar("mapa"); }
    else if (a === "abrir-reto") { Progreso.presentarReto(Progreso.obtener().retoActual); renderizar("reto"); }
    else if (a === "responder") responder(Number(b.dataset.valor));
    else if (a === "pista") mostrarPista(); else if (a === "continuar") continuar();
    else if (a === "ver-final") { Progreso.completar(); Sonidos.reproducir("poder"); renderizar("final"); }
    else if (a === "otra-vez") { Progreso.nuevaSesion(); Progreso.iniciarAventura(); renderizar("mapa"); }
    else if (a === "volver-inicio") { Progreso.guardarEscena("inicio"); renderizar("inicio"); }
    else if (a === "confirmar-reinicio") confirmarReinicio();
    else if (a === "cancelar-reinicio") { b.closest(".dialogo-capa").remove(); enfocarTitulo(); }
    else if (a === "reiniciar") { Progreso.nuevaSesion(); renderizar("inicio"); }
    else if (a === "sonido") { const activo = Sonidos.alternar(); Progreso.cambiarSonido(activo); b.textContent = activo ? "🔊" : "🔇"; b.setAttribute("aria-label", activo ? "Silenciar sonidos" : "Activar sonidos"); b.setAttribute("aria-pressed", activo); }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { const d = raiz.querySelector(".dialogo-capa"); if (d) { d.remove(); enfocarTitulo(); } } });
  Sonidos.establecer(Progreso.obtener().preferencias.sonido); renderizar(Progreso.obtener().escenaActual);
})();
