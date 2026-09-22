const CLAVE_PARTICIPANTES = "sorteo_participantes";
const CLAVE_TITULO = "sorteo_titulo";
const CLAVE_MODO = "sorteo_modo";
const CLAVE_CANTIDAD = "sorteo_cantidad";

function guardarParticipantes(texto) {
  localStorage.setItem(CLAVE_PARTICIPANTES, texto);
}

function recuperarParticipantes() {
  return localStorage.getItem(CLAVE_PARTICIPANTES) || "";
}

function guardarTitulo(titulo) {
  localStorage.setItem(CLAVE_TITULO, titulo);
}

function recuperarTitulo() {
  return localStorage.getItem(CLAVE_TITULO) || "";
}

function guardarModo(modo) {
  localStorage.setItem(CLAVE_MODO, modo);
}

function recuperarModo() {
  return localStorage.getItem(CLAVE_MODO) || "equipos";
}

function guardarCantidad(cantidad) {
  localStorage.setItem(CLAVE_CANTIDAD, cantidad);
}

function recuperarCantidad() {
  return localStorage.getItem(CLAVE_CANTIDAD) || "2";
}

function limpiarAlmacenamiento() {
  localStorage.removeItem(CLAVE_PARTICIPANTES);
  localStorage.removeItem(CLAVE_TITULO);
  localStorage.removeItem(CLAVE_MODO);
  localStorage.removeItem(CLAVE_CANTIDAD);
}
