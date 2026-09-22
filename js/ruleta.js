const CINCO_COLORES_BASICOS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcf7f",
  "#4d96ff",
  "#c77dff",
];

let listaElementos = [];
let conjuntoOcultos = new Set();
let ultimoSorteado = null;
let anguloAcumulado = 0;
let girando = false;

let lienzoRuleta;
let contextoRuleta;
let entradaElementos;
let entradaRapida;
let respuestaSeleccionada;
let botonIniciar;
let botonReiniciar;
let botonCentral;
let botonTitulo;
let botonEditar;
let botonOcultar;
let botonAgregar;
let botonVaciar;
let notificacion;

function indicesVisibles() {
  return listaElementos.map((_, i) => i).filter((i) => !conjuntoOcultos.has(i));
}

function dibujarRuleta() {
  if (!lienzoRuleta || !contextoRuleta) return;

  const centroX = lienzoRuleta.width / 2;
  const centroY = lienzoRuleta.height / 2;
  const radio = centroX - 10;

  contextoRuleta.clearRect(0, 0, lienzoRuleta.width, lienzoRuleta.height);

  const indices = indicesVisibles();

  if (indices.length === 0) {
    contextoRuleta.beginPath();
    contextoRuleta.arc(centroX, centroY, radio, 0, Math.PI * 2);
    contextoRuleta.fillStyle = "#e9e9f2";
    contextoRuleta.fill();
    contextoRuleta.fillStyle = "#8a8aa0";
    contextoRuleta.font = "600 20px Segoe UI, sans-serif";
    contextoRuleta.textAlign = "center";
    contextoRuleta.fillText("Agrega elementos", centroX, centroY);
    return;
  }

  const porcionAngulo = (Math.PI * 2) / indices.length;

  indices.forEach((indiceReal, posicion) => {
    const elemento = listaElementos[indiceReal];
    const anguloInicio = posicion * porcionAngulo;
    const anguloFin = anguloInicio + porcionAngulo;

    contextoRuleta.beginPath();
    contextoRuleta.moveTo(centroX, centroY);
    contextoRuleta.arc(centroX, centroY, radio, anguloInicio, anguloFin);
    contextoRuleta.closePath();
    contextoRuleta.fillStyle =
      CINCO_COLORES_BASICOS[posicion % CINCO_COLORES_BASICOS.length];
    contextoRuleta.fill();
    contextoRuleta.strokeStyle = "#ffffff";
    contextoRuleta.lineWidth = 2;
    contextoRuleta.stroke();

    contextoRuleta.save();
    contextoRuleta.translate(centroX, centroY);
    contextoRuleta.rotate(anguloInicio + porcionAngulo / 2);
    contextoRuleta.fillStyle = "#2b2b3a";
    contextoRuleta.font = "600 22px Segoe UI, sans-serif";

    const anguloMedio = anguloInicio + porcionAngulo / 2;
    const ladoIzquierdo =
      anguloMedio > Math.PI / 2 && anguloMedio < (3 * Math.PI) / 2;

    if (ladoIzquierdo) {
      contextoRuleta.rotate(Math.PI);
      contextoRuleta.textAlign = "left";
      contextoRuleta.fillText(elemento, -(radio - 30), 8);
    } else {
      contextoRuleta.textAlign = "right";
      contextoRuleta.fillText(elemento, radio - 30, 8);
    }

    contextoRuleta.restore();
  });
}

function mostrarNotificacion(mensaje) {
  if (!notificacion) return;
  notificacion.textContent = mensaje;
  notificacion.classList.add("visible");

  clearTimeout(mostrarNotificacion.temporizador);
  mostrarNotificacion.temporizador = setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 2200);
}

function girarRuleta() {
  if (girando) return;

  const indices = indicesVisibles();

  if (indices.length === 0) {
    mostrarNotificacion("No hay elementos visibles para girar");
    return;
  }

  girando = true;
  botonIniciar.disabled = true;

  const totalVisibles = indices.length;
  const posicionGanadora = Math.floor(Math.random() * totalVisibles);
  const indiceRealGanador = indices[posicionGanadora];

  const porcionGrados = 360 / totalVisibles;
  const anguloCentroGanador =
    posicionGanadora * porcionGrados + porcionGrados / 2;

  const objetivoFinal = (((0 - anguloCentroGanador) % 360) + 360) % 360;
  const actualNormalizado = ((anguloAcumulado % 360) + 360) % 360;

  let correccion = objetivoFinal - actualNormalizado;
  if (correccion < 0) correccion += 360;

  const vueltasCompletas = 6 + Math.floor(Math.random() * 3);
  const gradosFinales = vueltasCompletas * 360 + correccion;

  anguloAcumulado += gradosFinales;
  lienzoRuleta.style.transform = `rotate(${anguloAcumulado}deg)`;

  const elementoGanador = listaElementos[indiceRealGanador];

  setTimeout(() => {
    girando = false;
    botonIniciar.disabled = false;
    botonReiniciar.disabled = false;

    ultimoSorteado = indiceRealGanador;
    respuestaSeleccionada.textContent = elementoGanador;
    mostrarNotificacion(`Ganador: ${elementoGanador}`);
  }, 4100);
}

function ocultarElementoSeleccionado() {
  if (ultimoSorteado === null) {
    mostrarNotificacion("Primero gira la ruleta");
    return;
  }

  if (indicesVisibles().length <= 1) {
    mostrarNotificacion("Debe quedar al menos un elemento visible");
    return;
  }

  conjuntoOcultos.add(ultimoSorteado);
  ultimoSorteado = null;

  guardarOcultosEnAlmacen(conjuntoOcultos);
  dibujarRuleta();
  mostrarNotificacion("Elemento ocultado");
}

function reiniciarRuleta() {
  conjuntoOcultos.clear();
  ultimoSorteado = null;
  respuestaSeleccionada.textContent = "RESPUESTA";
  botonReiniciar.disabled = true;

  guardarOcultosEnAlmacen(conjuntoOcultos);
  dibujarRuleta();
  mostrarNotificacion("Ruleta reiniciada");
}

function alternarPantallaCompleta() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.body.classList.add("pantalla-completa");
  } else {
    document.exitFullscreen();
    document.body.classList.remove("pantalla-completa");
  }
}

function actualizarDesdeTextArea() {
  const texto = entradaElementos.value;
  listaElementos = texto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  conjuntoOcultos = new Set(
    [...conjuntoOcultos].filter((i) => i < listaElementos.length),
  );

  guardarElementosEnAlmacen(listaElementos);
  guardarOcultosEnAlmacen(conjuntoOcultos);

  dibujarRuleta();
}

function agregarElementoDesdeEntradaRapida() {
  const valor = entradaRapida.value.trim();

  if (valor === "") {
    mostrarNotificacion("Escribe un elemento antes de agregar");
    return;
  }

  listaElementos.push(valor);
  entradaElementos.value = listaElementos.join("\n");
  entradaRapida.value = "";
  entradaRapida.focus();

  guardarElementosEnAlmacen(listaElementos);
  dibujarRuleta();
  mostrarNotificacion(`"${valor}" agregado`);
}

function vaciarListaElementos() {
  if (listaElementos.length === 0) {
    mostrarNotificacion("La ruleta ya está vacía");
    return;
  }

  if (!confirm("¿Vaciar todos los elementos de la ruleta?")) return;

  listaElementos = [];
  conjuntoOcultos.clear();
  ultimoSorteado = null;
  entradaElementos.value = "";
  respuestaSeleccionada.textContent = "RESPUESTA";
  botonReiniciar.disabled = true;

  guardarElementosEnAlmacen(listaElementos);
  guardarOcultosEnAlmacen(conjuntoOcultos);
  dibujarRuleta();
  mostrarNotificacion("Ruleta vaciada");
}

function manejarTeclasGlobales(evento) {
  const etiqueta = evento.target.tagName;
  const enCampoTexto = etiqueta === "INPUT" || etiqueta === "TEXTAREA";

  if (evento.code === "Space") {
    if (enCampoTexto) return;
    evento.preventDefault();
    girarRuleta();
    return;
  }

  if (enCampoTexto) return;

  const tecla = evento.key.toLowerCase();

  if (tecla === "s") {
    evento.preventDefault();
    ocultarElementoSeleccionado();
  } else if (tecla === "r") {
    evento.preventDefault();
    reiniciarRuleta();
  } else if (tecla === "e") {
    evento.preventDefault();
    entradaElementos.focus();
    mostrarNotificacion("Modo edición");
  } else if (tecla === "f") {
    evento.preventDefault();
    alternarPantallaCompleta();
  }
}

function inicializarRuleta() {
  lienzoRuleta = document.getElementById("lienzoRuleta");
  entradaElementos = document.getElementById("entradaElementos");
  entradaRapida = document.getElementById("entradaRapida");
  respuestaSeleccionada = document.getElementById("respuestaSeleccionada");
  botonIniciar = document.getElementById("botonIniciar");
  botonReiniciar = document.getElementById("botonReiniciar");
  botonCentral = document.getElementById("botonCentral");
  botonTitulo = document.getElementById("botonTitulo");
  botonEditar = document.getElementById("botonEditar");
  botonOcultar = document.getElementById("botonOcultar");
  botonAgregar = document.getElementById("botonAgregar");
  botonVaciar = document.getElementById("botonVaciar");
  notificacion = document.getElementById("notificacion");

  if (!lienzoRuleta || !entradaElementos) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  contextoRuleta = lienzoRuleta.getContext("2d");

  const elementosGuardados = recuperarElementosDeAlmacen();
  listaElementos =
    elementosGuardados.length > 0
      ? elementosGuardados
      : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  if (elementosGuardados.length === 0) {
    guardarElementosEnAlmacen(listaElementos);
  }

  entradaElementos.value = listaElementos.join("\n");
  conjuntoOcultos = recuperarOcultosDeAlmacen();
  respuestaSeleccionada.textContent = recuperarTituloDeAlmacen();

  dibujarRuleta();

  entradaElementos.addEventListener("input", actualizarDesdeTextArea);

  botonAgregar.addEventListener("click", agregarElementoDesdeEntradaRapida);
  botonVaciar.addEventListener("click", vaciarListaElementos);

  entradaRapida.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregarElementoDesdeEntradaRapida();
    }
  });

  botonIniciar.addEventListener("click", girarRuleta);
  botonCentral.addEventListener("click", girarRuleta);
  botonReiniciar.addEventListener("click", reiniciarRuleta);

  botonEditar.addEventListener("click", () => {
    entradaElementos.focus();
    mostrarNotificacion("Modo edición");
  });

  botonOcultar.addEventListener("click", ocultarElementoSeleccionado);

  botonTitulo.addEventListener("click", () => {
    const titulo = prompt(
      "Ingrese el título:",
      respuestaSeleccionada.textContent,
    );
    if (titulo && titulo.trim() !== "") {
      const limpio = titulo.trim().toUpperCase();
      respuestaSeleccionada.textContent = limpio;
      guardarTituloEnAlmacen(limpio);
    }
  });

  document.addEventListener("keydown", manejarTeclasGlobales);
}
