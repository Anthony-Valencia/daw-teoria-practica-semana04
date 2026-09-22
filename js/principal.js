window.addEventListener("load", () => {
  if (typeof inicializarRuleta === "function") {
    inicializarRuleta();
    console.log("Aula Virtual iniciada");
  } else {
    console.error("inicializarRuleta no está definida");
  }
});
