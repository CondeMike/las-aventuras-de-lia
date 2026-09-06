(function () {
  "use strict";

  let contexto;
  let activo = true;

  function ctx() {
    if (!contexto) contexto = new (window.AudioContext || window.webkitAudioContext)();
    if (contexto.state === "suspended") contexto.resume();
    return contexto;
  }

  function tono(frecuencia, inicio, duracion, tipo, volumen) {
    if (!activo) return;
    const audio = ctx();
    const oscilador = audio.createOscillator();
    const ganancia = audio.createGain();
    oscilador.type = tipo || "sine";
    oscilador.frequency.setValueAtTime(frecuencia, audio.currentTime + inicio);
    ganancia.gain.setValueAtTime(0.0001, audio.currentTime + inicio);
    ganancia.gain.exponentialRampToValueAtTime(volumen || 0.08, audio.currentTime + inicio + 0.015);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + inicio + duracion);
    oscilador.connect(ganancia).connect(audio.destination);
    oscilador.start(audio.currentTime + inicio);
    oscilador.stop(audio.currentTime + inicio + duracion + 0.03);
  }

  const efectos = {
    toque: function () { tono(320, 0, .08, "sine", .035); },
    viajar: function () { tono(330, 0, .12, "triangle"); tono(440, .08, .14, "triangle"); },
    casi: function () { tono(260, 0, .16, "sine", .05); tono(220, .13, .2, "sine", .04); },
    acierto: function () { tono(523, 0, .16, "triangle"); tono(659, .1, .18, "triangle"); tono(784, .2, .3, "triangle", .1); },
    poder: function () {
      tono(392, 0, .13, "square", .045);
      tono(523, .1, .15, "triangle", .075);
      tono(659, .2, .18, "triangle", .085);
      tono(784, .31, .2, "triangle", .095);
      tono(1047, .45, .5, "sine", .11);
    },
    ayuda: function () { tono(392, 0, .18, "sine"); tono(494, .15, .2, "sine"); },
    puerta: function () { tono(130, 0, .5, "sawtooth", .06); tono(196, .25, .55, "triangle", .08); tono(784, .55, .4, "sine", .09); },
    golpe: function () { tono(90, 0, .18, "square", .07); tono(150, .04, .22, "sawtooth", .05); tono(660, .12, .2, "triangle", .07); },
    cristal: function () {
      tono(880, 0, .18, "sine", .07);
      tono(1175, .09, .2, "sine", .08);
      tono(1568, .2, .3, "sine", .09);
      tono(2093, .34, .55, "sine", .07);
    }
  };

  try { activo = localStorage.getItem("aventurasDeLia.sonido") !== "apagado"; } catch (error) { activo = true; }

  window.Sonidos = {
    reproducir: function (nombre) { if (efectos[nombre]) efectos[nombre](); },
    alternar: function () {
      activo = !activo;
      try { localStorage.setItem("aventurasDeLia.sonido", activo ? "encendido" : "apagado"); } catch (error) {}
      if (activo) efectos.acierto();
      return activo;
    },
    establecer: function (valor) { activo = Boolean(valor); },
    estaActivo: function () { return activo; }
  };
})();
