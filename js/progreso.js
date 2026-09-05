(function () {
  "use strict";
  const CLAVE = "aventurasDeLia.v2";
  const ESCENAS = ["inicio", "mapa", "reto", "final"];

  function nuevaPartida() {
    return {
      version: 2, escenaActual: "inicio", retoActual: 0, nivelAyuda: 0, cristales: 0,
      escenasCompletadas: [],
      sesion: { inicio: new Date().toISOString(), retosPresentados: 0, intentos: 0, aciertos: 0, aciertosPrimerIntento: 0, ayudasUsadas: 0, erroresPorReto: {} },
      acumulado: { sesionesIniciadas: 1, aventurasCompletadas: 0, intentos: 0, aciertos: 0, ayudasUsadas: 0 },
      preferencias: { sonido: true }, actualizadoEn: new Date().toISOString()
    };
  }
  function entero(valor, maximo) { const n = Math.max(0, Math.floor(Number(valor) || 0)); return maximo === undefined ? n : Math.min(n, maximo); }
  function cargar() {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE));
      if (!g || g.version !== 2) return nuevaPartida();
      const d = nuevaPartida();
      d.escenaActual = ESCENAS.includes(g.escenaActual) ? g.escenaActual : "inicio";
      d.retoActual = entero(g.retoActual, 7); d.nivelAyuda = entero(g.nivelAyuda, 2); d.cristales = entero(g.cristales, 3);
      d.escenasCompletadas = Array.isArray(g.escenasCompletadas) ? g.escenasCompletadas.filter(Number.isFinite) : [];
      ["sesion", "acumulado"].forEach(function (grupo) {
        if (!g[grupo] || typeof g[grupo] !== "object") return;
        Object.keys(d[grupo]).forEach(function (clave) {
          if (clave === "inicio" && typeof g[grupo][clave] === "string") d[grupo][clave] = g[grupo][clave];
          else if (clave === "erroresPorReto" && g[grupo][clave] && typeof g[grupo][clave] === "object") d[grupo][clave] = g[grupo][clave];
          else if (typeof d[grupo][clave] === "number") d[grupo][clave] = entero(g[grupo][clave]);
        });
      });
      d.preferencias.sonido = !(g.preferencias && g.preferencias.sonido === false);
      return d;
    } catch (error) { return nuevaPartida(); }
  }
  let datos = cargar();
  function guardar() { datos.actualizadoEn = new Date().toISOString(); try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (error) {} }
  function sumar(campo) { datos.sesion[campo] += 1; if (campo in datos.acumulado) datos.acumulado[campo] += 1; }

  window.Progreso = {
    obtener: function () { return datos; },
    guardarEscena: function (escena) { datos.escenaActual = escena; guardar(); },
    iniciarAventura: function () { datos.escenaActual = "mapa"; guardar(); },
    presentarReto: function (indice) {
      if (datos.retoActual !== indice || datos.escenaActual !== "reto") sumar("retosPresentados");
      datos.escenaActual = "reto"; datos.retoActual = indice; datos.nivelAyuda = 0; guardar();
    },
    pedirPista: function () { if (datos.nivelAyuda < 2) { datos.nivelAyuda += 1; sumar("ayudasUsadas"); guardar(); } return datos.nivelAyuda; },
    registrarError: function (id) {
      sumar("intentos"); datos.sesion.erroresPorReto[id] = entero(datos.sesion.erroresPorReto[id]) + 1;
      if (datos.nivelAyuda < 2) { datos.nivelAyuda += 1; sumar("ayudasUsadas"); }
      guardar(); return datos.nivelAyuda;
    },
    registrarAcierto: function (id) {
      sumar("intentos"); sumar("aciertos");
      if (!datos.sesion.erroresPorReto[id]) datos.sesion.aciertosPrimerIntento += 1;
      if (!datos.escenasCompletadas.includes(datos.retoActual)) datos.escenasCompletadas.push(datos.retoActual);
      guardar();
    },
    avanzarReto: function () { datos.retoActual += 1; datos.nivelAyuda = 0; guardar(); },
    concederCristal: function (numero) { datos.cristales = Math.max(datos.cristales, numero); datos.escenaActual = "mapa"; guardar(); },
    completar: function () { if (datos.escenaActual !== "final") datos.acumulado.aventurasCompletadas += 1; datos.escenaActual = "final"; guardar(); },
    cambiarSonido: function (activo) { datos.preferencias.sonido = activo; guardar(); },
    nuevaSesion: function () { const a = datos.acumulado; datos = nuevaPartida(); datos.acumulado = a; datos.acumulado.sesionesIniciadas += 1; guardar(); },
    borrarTodo: function () { datos = nuevaPartida(); try { localStorage.removeItem("aventurasDeLia.v1"); } catch (error) {} guardar(); }
  };
})();
