const LIMITE_PARTICIPANTES = 100;
const LIMITE_CARACTERES_NOMBRE = 50;

function parsearParticipantes(texto) {
  const lineas = texto.split("\n");
  const participantes = [];

  for (const linea of lineas) {
    const limpia = linea.trim();
    if (limpia === "") continue;

    let nombre = limpia;
    let esLider = false;

    if (nombre.startsWith("*")) {
      esLider = true;
      nombre = nombre.substring(1).trim();
    }

    if (nombre.length === 0) continue;
    if (nombre.length > LIMITE_CARACTERES_NOMBRE) {
      nombre = nombre.substring(0, LIMITE_CARACTERES_NOMBRE);
    }

    participantes.push({ nombre, esLider });

    if (participantes.length >= LIMITE_PARTICIPANTES) break;
  }

  return participantes;
}

function mezclarArreglo(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function separarLideresYResto(participantes) {
  const lideres = participantes.filter((p) => p.esLider);
  const resto = participantes.filter((p) => !p.esLider);
  return { lideres, resto };
}

function calcularNumeroEquipos(totalParticipantes, modo, cantidad) {
  if (modo === "equipos") {
    return Math.min(cantidad, totalParticipantes);
  }
  return Math.ceil(totalParticipantes / cantidad);
}

function repartirEnEquipos(participantes, numeroEquipos) {
  const { lideres, resto } = separarLideresYResto(participantes);
  const lideresMezclados = mezclarArreglo(lideres);
  const restoMezclado = mezclarArreglo(resto);

  const equipos = Array.from({ length: numeroEquipos }, () => []);

  for (const lider of lideresMezclados) {
    const equipoMasVacio = equipos.reduce(
      (min, equipo) => (equipo.length < min.length ? equipo : min),
      equipos[0],
    );
    equipoMasVacio.push(lider);
  }

  for (const participante of restoMezclado) {
    const equipoMasVacio = equipos.reduce(
      (min, equipo) => (equipo.length < min.length ? equipo : min),
      equipos[0],
    );
    equipoMasVacio.push(participante);
  }

  return equipos;
}

function generarEquipos(texto, modo, cantidad) {
  const participantes = parsearParticipantes(texto);

  if (participantes.length < 2) {
    return { error: "Debes ingresar al menos 2 participantes." };
  }

  const numeroEquipos = calcularNumeroEquipos(
    participantes.length,
    modo,
    cantidad,
  );

  if (numeroEquipos < 2) {
    return { error: "Se necesitan al menos 2 equipos." };
  }

  const equipos = repartirEnEquipos(participantes, numeroEquipos);

  return { equipos, numeroEquipos };
}
