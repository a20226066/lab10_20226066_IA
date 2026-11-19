/* PREGUNTA 1: DOCUMENT OBJECT MODEL (DOM) */

/** Genera un tablero de x × x celdas usando nodos DOM. */
function crearPecera(x) {
  const dimension = Number(x);
  if (!Number.isInteger(dimension) || dimension < 1 || dimension > 20) {
    throw new Error("La dimensión debe ser un entero entre 1 y 20.");
  }

  const pecera = document.getElementById("pecera");
  pecera.replaceChildren(); // Borra las celdas del tablero anterior.
  pecera.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
  pecera.style.gridTemplateRows = `repeat(${dimension}, 1fr)`;

  // DocumentFragment permite insertar las celdas juntas al finalizar.
  const celdas = document.createDocumentFragment();
  for (let fila = 1; fila <= dimension; fila++) {
    for (let columna = 1; columna <= dimension; columna++) {
      const celda = document.createElement("div");
      celda.classList.add("celda");
      celda.title = `Fila ${fila}, columna ${columna}`;
      celdas.appendChild(celda);
    }
  }
  pecera.appendChild(celdas);
  document.getElementById("medidas").textContent =
    `${dimension} × ${dimension} = ${dimension * dimension} celdas`;
}

document.getElementById("formulario").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const x = document.getElementById("tamano").value;
  try { crearPecera(x); }
  catch (error) { alert(error.message); }
});

// El evento funciona también sobre celdas creadas dinámicamente.
document.getElementById("pecera").addEventListener("click", (evento) => {
  if (evento.target.classList.contains("celda")) {
    evento.target.classList.toggle("marcada");
  }
});

crearPecera(6); // Pecera de ejemplo al cargar.
