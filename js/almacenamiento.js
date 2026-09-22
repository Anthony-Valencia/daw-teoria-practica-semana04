const CLAVE_ELEMENTOS = "aula_virtual_elementos";
const CLAVE_OCULTOS = "aula_virtual_ocultos";
const CLAVE_TITULO = "aula_virtual_titulo";

function guardarElementosEnAlmacen(listaElementos) {
  localStorage.setItem(CLAVE_ELEMENTOS, JSON.stringify(listaElementos));
}

function recuperarElementosDeAlmacen() {
  const datos = localStorage.getItem(CLAVE_ELEMENTOS);
  if (!datos) return [];
  try {
    return JSON.parse(datos);
  } catch {
    return [];
  }
}

function guardarOcultosEnAlmacen(conjuntoOcultos) {
  localStorage.setItem(CLAVE_OCULTOS, JSON.stringify([...conjuntoOcultos]));
}

function recuperarOcultosDeAlmacen() {
  const datos = localStorage.getItem(CLAVE_OCULTOS);
  if (!datos) return new Set();
  try {
    return new Set(JSON.parse(datos));
  } catch {
    return new Set();
  }
}

function guardarTituloEnAlmacen(titulo) {
  localStorage.setItem(CLAVE_TITULO, titulo);
}

function recuperarTituloDeAlmacen() {
  return localStorage.getItem(CLAVE_TITULO) || "RESPUESTA";
}
