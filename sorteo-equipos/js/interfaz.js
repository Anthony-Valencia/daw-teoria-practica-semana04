const pantallaConfiguracion = document.getElementById("pantallaConfiguracion");
const pantallaResultados = document.getElementById("pantallaResultados");
const entradaParticipantes = document.getElementById("entradaParticipantes");
const contadorParticipantes = document.getElementById("contadorParticipantes");
const radiosModo = document.querySelectorAll('input[name="modoDivision"]');
const selectorCantidad = document.getElementById("selectorCantidad");
const entradaTitulo = document.getElementById("entradaTitulo");
const botonLimpiar = document.getElementById("botonLimpiar");
const botonGenerar = document.getElementById("botonGenerar");
const botonVolver = document.getElementById("botonVolver");
const botonDescargarJpg = document.getElementById("botonDescargarJpg");
const botonCopiarTodo = document.getElementById("botonCopiarTodo");
const botonCopiarColumnas = document.getElementById("botonCopiarColumnas");
const tituloResultados = document.getElementById("tituloResultados");
const contenedorEquipos = document.getElementById("contenedorEquipos");
const notificacion = document.getElementById("notificacion");

let equiposActuales = [];
let tituloActual = "";
let temporizadorNotificacion = null;

function contarParticipantes(texto) {
  return texto.split("\n").filter((l) => l.trim() !== "").length;
}

function actualizarContador() {
  const total = contarParticipantes(entradaParticipantes.value);
  contadorParticipantes.textContent = total;
}

function obtenerModoSeleccionado() {
  for (const radio of radiosModo) {
    if (radio.checked) return radio.value;
  }
  return "equipos";
}

function actualizarOpcionesCantidad(modo) {
  const opciones =
    modo === "equipos"
      ? [2, 3, 4, 5, 6, 7, 8, 9, 10]
      : [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];

  const sufijo = modo === "equipos" ? "equipos" : "por equipo";
  const valorPrevio = selectorCantidad.value;

  selectorCantidad.innerHTML = "";
  for (const valor of opciones) {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = `${valor} ${sufijo}`;
    selectorCantidad.appendChild(opcion);
  }

  if ([...selectorCantidad.options].some((o) => o.value === valorPrevio)) {
    selectorCantidad.value = valorPrevio;
  }
}

function mostrarNotificacion(mensaje) {
  notificacion.textContent = mensaje;
  notificacion.classList.add("visible");

  clearTimeout(temporizadorNotificacion);
  temporizadorNotificacion = setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 2200);
}

function renderizarEquipos(equipos, titulo) {
  contenedorEquipos.innerHTML = "";

  equipos.forEach((integrantes, indice) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "equipo";

    const encabezado = document.createElement("h3");
    encabezado.textContent = `Equipo ${indice + 1}`;
    tarjeta.appendChild(encabezado);

    const lista = document.createElement("ul");

    integrantes.forEach((participante) => {
      const item = document.createElement("li");
      if (participante.esLider) item.classList.add("lider");

      if (participante.esLider) {
        const estrella = document.createElement("span");
        estrella.className = "estrella";
        estrella.textContent = "★";
        item.appendChild(estrella);
      }

      const textoNombre = document.createElement("span");
      textoNombre.textContent = participante.nombre;
      item.appendChild(textoNombre);

      lista.appendChild(item);
    });

    tarjeta.appendChild(lista);
    contenedorEquipos.appendChild(tarjeta);
  });

  tituloResultados.textContent = titulo || "Equipos conformados";
}

function cambiarPantalla(pantalla) {
  pantallaConfiguracion.classList.remove("activa");
  pantallaResultados.classList.remove("activa");
  pantalla.classList.add("activa");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function textoPlanoEquipos() {
  const lineas = [];
  if (tituloActual) lineas.push(tituloActual, "");
  equiposActuales.forEach((integrantes, indice) => {
    lineas.push(`Equipo ${indice + 1}:`);
    integrantes.forEach((p) => {
      lineas.push(`  ${p.esLider ? "* " : ""}${p.nombre}`);
    });
    lineas.push("");
  });
  return lineas.join("\n");
}

async function copiarAlPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const areaTemporal = document.createElement("textarea");
    areaTemporal.value = texto;
    areaTemporal.style.position = "fixed";
    areaTemporal.style.opacity = "0";
    document.body.appendChild(areaTemporal);
    areaTemporal.select();
    const exito = document.execCommand("copy");
    document.body.removeChild(areaTemporal);
    return exito;
  }
}

async function copiarTodo() {
  const texto = textoPlanoEquipos();
  const exito = await copiarAlPortapapeles(texto);
  mostrarNotificacion(
    exito ? "Equipos copiados al portapapeles" : "Error al copiar",
  );
}

async function copiarColumnas() {
  const maxIntegrantes = Math.max(...equiposActuales.map((e) => e.length));
  const filas = [];

  const encabezados = equiposActuales.map((_, i) => `Equipo ${i + 1}`);
  filas.push(encabezados.join("\t"));

  for (let i = 0; i < maxIntegrantes; i++) {
    const fila = equiposActuales.map((equipo) => {
      const p = equipo[i];
      if (!p) return "";
      return (p.esLider ? "* " : "") + p.nombre;
    });
    filas.push(fila.join("\t"));
  }

  const texto = filas.join("\n");
  const exito = await copiarAlPortapapeles(texto);
  mostrarNotificacion(
    exito ? "Equipos en columnas copiados" : "Error al copiar",
  );
}

function dibujarRectanguloRedondeado(ctx, x, y, ancho, alto, radio) {
  ctx.beginPath();
  ctx.moveTo(x + radio, y);
  ctx.lineTo(x + ancho - radio, y);
  ctx.quadraticCurveTo(x + ancho, y, x + ancho, y + radio);
  ctx.lineTo(x + ancho, y + alto - radio);
  ctx.quadraticCurveTo(x + ancho, y + alto, x + ancho - radio, y + alto);
  ctx.lineTo(x + radio, y + alto);
  ctx.quadraticCurveTo(x, y + alto, x, y + alto - radio);
  ctx.lineTo(x, y + radio);
  ctx.quadraticCurveTo(x, y, x + radio, y);
  ctx.closePath();
}

function descargarJpg() {
  const ancho = 1000;
  const margen = 40;
  const anchoTarjeta = 300;
  const altoTarjetaBase = 70;
  const altoPorLinea = 32;
  const separacion = 20;
  const columnas = 3;

  const maxLineas = Math.max(...equiposActuales.map((e) => e.length));
  const altoTarjeta = altoTarjetaBase + maxLineas * altoPorLinea;

  const filas = Math.ceil(equiposActuales.length / columnas);
  const altoTotal = margen * 2 + 60 + filas * (altoTarjeta + separacion);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = altoTotal;

  const ctx = lienzo.getContext("2d");

  ctx.fillStyle = "#f5f6fa";
  ctx.fillRect(0, 0, ancho, altoTotal);

  ctx.fillStyle = "#4a3b8a";
  ctx.font = "bold 26px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tituloActual || "Equipos conformados", ancho / 2, margen + 30);

  equiposActuales.forEach((integrantes, indice) => {
    const columna = indice % columnas;
    const fila = Math.floor(indice / columnas);

    const x = margen + columna * (anchoTarjeta + separacion);
    const y = margen + 60 + fila * (altoTarjeta + separacion);

    ctx.fillStyle = "#ffffff";
    dibujarRectanguloRedondeado(ctx, x, y, anchoTarjeta, altoTarjeta, 12);
    ctx.fill();

    ctx.fillStyle = "#e91e8c";
    dibujarRectanguloRedondeado(ctx, x, y, 6, altoTarjeta, 3);
    ctx.fill();

    ctx.fillStyle = "#e91e8c";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Equipo ${indice + 1}`, x + 20, y + 32);

    ctx.strokeStyle = "#f0d0e0";
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 44);
    ctx.lineTo(x + anchoTarjeta - 20, y + 44);
    ctx.stroke();

    integrantes.forEach((p, i) => {
      const yTexto = y + 70 + i * altoPorLinea;
      ctx.fillStyle = p.esLider ? "#4a3b8a" : "#2b2b3a";
      ctx.font = p.esLider
        ? "bold 15px Segoe UI, sans-serif"
        : "15px Segoe UI, sans-serif";
      const texto = (p.esLider ? "★ " : "") + p.nombre;
      ctx.fillText(texto, x + 22, yTexto);
    });
  });

  const enlace = document.createElement("a");
  enlace.download = `equipos-${Date.now()}.jpg`;
  enlace.href = lienzo.toDataURL("image/jpeg", 0.92);
  enlace.click();

  mostrarNotificacion("Imagen descargada");
}

function manejarGenerar() {
  const texto = entradaParticipantes.value;
  const modo = obtenerModoSeleccionado();
  const cantidad = parseInt(selectorCantidad.value, 10);
  const titulo = entradaTitulo.value.trim();

  const resultado = generarEquipos(texto, modo, cantidad);

  if (resultado.error) {
    mostrarNotificacion(resultado.error);
    return;
  }

  equiposActuales = resultado.equipos;
  tituloActual = titulo;

  renderizarEquipos(equiposActuales, tituloActual);
  cambiarPantalla(pantallaResultados);
}

function manejarLimpiar() {
  if (!confirm("¿Borrar todos los participantes y el título?")) return;

  entradaParticipantes.value = "";
  entradaTitulo.value = "";
  radiosModo.forEach((radio) => {
    radio.checked = radio.value === "equipos";
  });
  actualizarOpcionesCantidad("equipos");
  selectorCantidad.value = "2";
  actualizarContador();

  guardarParticipantes("");
  guardarTitulo("");
  guardarModo("equipos");
  guardarCantidad("2");

  mostrarNotificacion("Datos borrados");
}

function inicializarInterfaz() {
  entradaParticipantes.value = recuperarParticipantes();
  entradaTitulo.value = recuperarTitulo();

  const modoGuardado = recuperarModo();
  for (const radio of radiosModo) {
    radio.checked = radio.value === modoGuardado;
  }

  actualizarOpcionesCantidad(modoGuardado);

  const cantidadGuardada = recuperarCantidad();
  if ([...selectorCantidad.options].some((o) => o.value === cantidadGuardada)) {
    selectorCantidad.value = cantidadGuardada;
  }

  actualizarContador();

  entradaParticipantes.addEventListener("input", () => {
    actualizarContador();
    guardarParticipantes(entradaParticipantes.value);
  });

  entradaTitulo.addEventListener("input", () => {
    guardarTitulo(entradaTitulo.value);
  });

  radiosModo.forEach((radio) => {
    radio.addEventListener("change", () => {
      const modo = obtenerModoSeleccionado();
      actualizarOpcionesCantidad(modo);
      guardarModo(modo);
      guardarCantidad(selectorCantidad.value);
    });
  });

  selectorCantidad.addEventListener("change", () => {
    guardarCantidad(selectorCantidad.value);
  });

  botonGenerar.addEventListener("click", manejarGenerar);
  botonLimpiar.addEventListener("click", manejarLimpiar);
  botonVolver.addEventListener("click", () =>
    cambiarPantalla(pantallaConfiguracion),
  );

  botonDescargarJpg.addEventListener("click", descargarJpg);
  botonCopiarTodo.addEventListener("click", copiarTodo);
  botonCopiarColumnas.addEventListener("click", copiarColumnas);
}
