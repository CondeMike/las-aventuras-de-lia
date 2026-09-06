/* Estado persistente de la aventura. Guarda poco, valida todo y nunca rompe
   la partida si el almacenamiento viene corrupto. */
(function () {
  "use strict";

  const CLAVE = "aventurasDeLia.v4";
  const CLAVES_VIEJAS = ["aventurasDeLia.v1", "aventurasDeLia.v2", "aventurasDeLia.v3"];

  function hoy() {
    return new Date().toISOString().slice(0, 10);
  }

  function nuevaPartida() {
    return {
      version: 4,
      pasoActual: 0,
      nivelAyuda: 0,
      cristales: 0,
      tesoros: [],
      estrellas: 0,
      dominio: {},
      sesion: { inicio: new Date().toISOString(), retosPresentados: 0, intentos: 0, aciertos: 0, aciertosPrimerIntento: 0, ayudasUsadas: 0 },
      acumulado: { sesionesIniciadas: 1, aventurasCompletadas: 0, intentos: 0, aciertos: 0, ayudasUsadas: 0, diasDeAventura: 1, ultimoDia: hoy() },
      preferencias: { sonido: true },
      actualizadoEn: new Date().toISOString()
    };
  }

  function entero(valor, maximo) {
    const n = Math.max(0, Math.floor(Number(valor) || 0));
    return maximo === undefined ? n : Math.min(n, maximo);
  }

  function saneaDominio(crudo) {
    const limpio = {};
    if (!crudo || typeof crudo !== "object") return limpio;
    Object.keys(crudo).slice(0, 60).forEach(function (clave) {
      if (!/^\d{1,2}x\d{1,2}$/.test(clave)) return;
      const d = crudo[clave] || {};
      limpio[clave] = { intentos: entero(d.intentos, 999), aciertos: entero(d.aciertos, 999), fallos: entero(d.fallos, 999), sinAyuda: entero(d.sinAyuda, 999) };
    });
    return limpio;
  }

  /* Al cambiar de versión, la aventura vuelve a empezar pero Lía no pierde lo
     suyo: días jugados, poderes conseguidos y tesoros se traen de la partida
     anterior más reciente que exista. */
  function rescatarDeVersionAnterior(destino) {
    for (let i = CLAVES_VIEJAS.length - 1; i >= 0; i--) {
      let viejo;
      try { viejo = JSON.parse(localStorage.getItem(CLAVES_VIEJAS[i])); } catch (error) { viejo = null; }
      if (!viejo) continue;
      if (viejo.acumulado) {
        ["sesionesIniciadas", "aventurasCompletadas", "intentos", "aciertos", "ayudasUsadas", "diasDeAventura"].forEach(function (c) {
          destino.acumulado[c] = Math.max(destino.acumulado[c], entero(viejo.acumulado[c]));
        });
        if (typeof viejo.acumulado.ultimoDia === "string") destino.acumulado.ultimoDia = viejo.acumulado.ultimoDia;
      }
      destino.dominio = saneaDominio(viejo.dominio);
      if (Array.isArray(viejo.tesoros)) destino.tesoros = viejo.tesoros.filter(function (t) { return typeof t === "string"; }).slice(0, 30);
      destino.estrellas = entero(viejo.estrellas, 9999);
      destino.acumulado.sesionesIniciadas += 1;
      return;
    }
  }

  function cargar() {
    let guardado = null;
    try { guardado = JSON.parse(localStorage.getItem(CLAVE)); } catch (error) { guardado = null; }

    const d = nuevaPartida();
    if (!guardado || guardado.version !== 4) {
      rescatarDeVersionAnterior(d);
      return d;
    }

    const tope = window.Contenido ? window.Contenido.ultimo : 18;
    d.pasoActual = entero(guardado.pasoActual, tope);
    d.nivelAyuda = entero(guardado.nivelAyuda, 2);
    d.cristales = entero(guardado.cristales, 3);
    d.estrellas = entero(guardado.estrellas, 9999);
    d.tesoros = Array.isArray(guardado.tesoros) ? guardado.tesoros.filter(function (t) { return typeof t === "string"; }).slice(0, 30) : [];
    d.dominio = saneaDominio(guardado.dominio);

    ["sesion", "acumulado"].forEach(function (grupo) {
      const origen = guardado[grupo];
      if (!origen || typeof origen !== "object") return;
      Object.keys(d[grupo]).forEach(function (clave) {
        if (typeof d[grupo][clave] === "number") d[grupo][clave] = entero(origen[clave]);
        else if (typeof origen[clave] === "string") d[grupo][clave] = origen[clave];
      });
    });
    if (!d.acumulado.diasDeAventura) d.acumulado.diasDeAventura = 1;
    d.preferencias.sonido = !(guardado.preferencias && guardado.preferencias.sonido === false);
    return d;
  }

  let datos = cargar();

  function guardar() {
    datos.actualizadoEn = new Date().toISOString();
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (error) { /* modo privado */ }
  }

  function sumar(campo) {
    if (campo in datos.sesion) datos.sesion[campo] += 1;
    if (campo in datos.acumulado) datos.acumulado[campo] += 1;
  }

  function fichaDe(clave) {
    if (!datos.dominio[clave]) datos.dominio[clave] = { intentos: 0, aciertos: 0, fallos: 0, sinAyuda: 0 };
    return datos.dominio[clave];
  }

  /* Un día nuevo suma al contador acumulativo: nunca se pierde, no hay racha que romper. */
  (function registrarDia() {
    if (datos.acumulado.ultimoDia !== hoy()) {
      datos.acumulado.ultimoDia = hoy();
      datos.acumulado.diasDeAventura += 1;
      guardar();
    }
  })();

  window.Progreso = {
    obtener: function () { return datos; },

    irAPaso: function (indice) {
      datos.pasoActual = entero(indice, window.Contenido.ultimo);
      datos.nivelAyuda = 0;
      guardar();
    },
    avanzar: function () {
      this.irAPaso(datos.pasoActual + 1);
      return datos.pasoActual;
    },
    presentarReto: function () {
      sumar("retosPresentados");
      datos.nivelAyuda = 0;
      guardar();
    },

    pedirPista: function () {
      if (datos.nivelAyuda < 2) { datos.nivelAyuda += 1; sumar("ayudasUsadas"); guardar(); }
      return datos.nivelAyuda;
    },

    registrarError: function (clave) {
      sumar("intentos");
      const f = fichaDe(clave); f.intentos += 1; f.fallos += 1;
      if (datos.nivelAyuda < 2) { datos.nivelAyuda += 1; sumar("ayudasUsadas"); }
      guardar();
      return datos.nivelAyuda;
    },

    registrarAcierto: function (clave) {
      sumar("intentos"); sumar("aciertos");
      const f = fichaDe(clave); f.intentos += 1; f.aciertos += 1;
      const limpio = f.fallos === 0 && datos.nivelAyuda === 0;
      if (limpio) { f.sinAyuda += 1; datos.sesion.aciertosPrimerIntento += 1; }
      guardar();
      return limpio;
    },

    /* Un acierto "al vuelo", el de la lluvia de estrellas. Cuenta para lo que
       Quatron tiene que repasar, pero no para los retos resueltos ni para las
       estrellas de poder: atinar en tres segundos entre cuatro estrellas es
       recordar bajo presión, no resolver un reto. No es lo mismo y no debe
       sumar en el mismo sitio. Los fallos de la lluvia no se anotan: ahí se
       falla también por puntería, y eso no dice nada de la tabla. */
    registrarAciertoAlVuelo: function (clave) {
      const f = fichaDe(clave);
      f.intentos += 1; f.aciertos += 1;
      guardar();
    },

    /* Sorteo con sesgo. Quatron pregunta al azar sobre toda la familia del 4,
       pero lo que a Lía le costó tiene más papeletas de volver a salir. Así la
       pelea nunca es igual dos veces y aun así repasa lo que hace falta. */
    operacionesParaRepasar: function (candidatas, cuantas) {
      const bolsa = candidatas.map(function (b) {
        const f = datos.dominio["4x" + b];
        const peso = !f || !f.intentos ? 1.5 : (f.fallos * 2 + 1) / (f.aciertos + 1);
        return { b: b, peso: peso * (0.55 + Math.random() * 0.9) };
      });
      bolsa.sort(function (x, y) { return y.peso - x.peso; });
      return bolsa.slice(0, Math.min(cuantas, bolsa.length)).map(function (p) { return p.b; });
    },

    estrellasDe: function (b) {
      const f = datos.dominio["4x" + b];
      if (!f || !f.aciertos) return 0;
      if (f.sinAyuda >= 1 && f.fallos === 0) return 3;
      if (f.aciertos >= 1 && f.fallos <= 1) return 2;
      return 1;
    },

    concederCristal: function (numero) {
      datos.cristales = Math.max(datos.cristales, entero(numero, 3));
      guardar();
    },
    guardarTesoro: function (id) {
      if (id && !datos.tesoros.includes(id)) { datos.tesoros.push(id); guardar(); }
    },
    sumarEstrellas: function (cuantas) {
      datos.estrellas += entero(cuantas, 999); guardar();
    },
    completarAventura: function () {
      datos.acumulado.aventurasCompletadas += 1; guardar();
    },

    cambiarSonido: function (activo) { datos.preferencias.sonido = activo; guardar(); },

    nuevaSesion: function () {
      const historial = datos.acumulado;
      const dominio = datos.dominio;
      const tesoros = datos.tesoros;
      datos = nuevaPartida();
      datos.acumulado = historial;
      datos.acumulado.sesionesIniciadas += 1;
      datos.dominio = dominio;
      datos.tesoros = tesoros;
      guardar();
    },

    borrarTodo: function () {
      datos = nuevaPartida();
      CLAVES_VIEJAS.forEach(function (c) { try { localStorage.removeItem(c); } catch (error) {} });
      guardar();
    }
  };
})();
