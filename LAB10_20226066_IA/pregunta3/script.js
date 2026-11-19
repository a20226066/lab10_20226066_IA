/* PREGUNTA 3: API HTML DRAG AND DROP + CONTADORES DE PREGUNTA 2 */
const CLAVE_NEMO = "LAB10_20226066_NEMO";
const CLAVE_DORY = "LAB10_20226066_DORY";
const AZUL = [173, 216, 230];
const VERDE = [46, 204, 113];
let siguienteId = 0;
let proximoPez = "nemo"; // Alternar colores garantiza ejemplos de ambos peces.
const MAX_BURBUJAS = 12;

function crearPecera(x) {
  const tablero = document.getElementById("pecera");
  tablero.replaceChildren();
  tablero.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
  tablero.style.gridTemplateRows = `repeat(${x}, 1fr)`;
  for (let i = 0; i < x * x; i++) {
    const celda = document.createElement("div");
    celda.className = "celda";
    tablero.appendChild(celda);
  }
  return tablero;
}

function leerCuenta(pez) {
  const almacen = pez === "nemo" ? localStorage : sessionStorage;
  const clave = pez === "nemo" ? CLAVE_NEMO : CLAVE_DORY;
  return Number(almacen.getItem(clave)) || 0;
}

function sumarCuenta(pez) {
  const almacen = pez === "nemo" ? localStorage : sessionStorage;
  const clave = pez === "nemo" ? CLAVE_NEMO : CLAVE_DORY;
  almacen.setItem(clave, String(leerCuenta(pez) + 1));
  mostrarCuentas();
}

function mostrarCuentas() {
  document.getElementById("cuenta-nemo").textContent = leerCuenta("nemo");
  document.getElementById("cuenta-dory").textContent = leerCuenta("dory");
}

function crearZona(pez, emoji, memoria) {
  const zona = document.createElement("section");
  zona.className = `zona zona-${pez}`;
  zona.dataset.pez = pez; // Identifica a qué pez se le puede soltar la burbuja.
  zona.innerHTML = `
    <span class="emoji-pez" aria-hidden="true">${emoji}</span>
    <span class="nombre-pez">${pez === "nemo" ? "Nemo" : "Dory"}</span>
    <span class="contador" id="cuenta-${pez}">0</span>
    <button type="button" data-contar="${pez}">Contar pez +1</button>
    <small>${memoria}</small>`;
  return zona;
}

function prepararZonas(tablero) {
  const zonas = document.createElement("div");
  zonas.className = "zonas";
  for (const [pez, emoji, memoria] of [
    ["nemo", "🐠", "localStorage"],
    ["dory", "🐟", "sessionStorage"]
  ]) {
    const zona = crearZona(pez, emoji, memoria);
    configurarSoltado(zona);
    zonas.appendChild(zona);
  }
  zonas.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-contar]");
    if (boton) sumarCuenta(boton.dataset.contar);
  });
  tablero.appendChild(zonas);
  mostrarCuentas();
}

function iniciarCambioColor(tablero) {
  let segundos = 0;
  tablero.style.backgroundColor = "rgb(173, 216, 230)";
  setInterval(() => {
    segundos++;
    const avance = Math.min(segundos / 60, 1);
    const rgb = AZUL.map((valor, indice) =>
      Math.round(valor + (VERDE[indice] - valor) * avance));
    tablero.style.backgroundColor = `rgb(${rgb.join(",")})`;
    document.getElementById("tiempo").textContent = segundos;
  }, 1000);
}

function actualizarCantidad() {
  document.getElementById("numero-burbujas").textContent =
    document.querySelectorAll(".burbuja").length;
}

function crearBurbuja(tablero) {
  if (document.querySelectorAll(".burbuja").length >= MAX_BURBUJAS) return;
  const pez = proximoPez;
  proximoPez = pez === "nemo" ? "dory" : "nemo";
  const burbuja = document.createElement("div");
  burbuja.className = `burbuja burbuja-${pez}`;
  burbuja.id = `burbuja-${++siguienteId}`;
  burbuja.dataset.pez = pez;
  burbuja.draggable = true;
  burbuja.title = `Burbuja ${pez}: arrastrar a ${pez}`;
  burbuja.style.left = `${5 + Math.random() * 81}%`;
  burbuja.style.top = `${10 + Math.random() * 16}%`;

  // ORIGEN: la burbuja anuncia su ID durante el arrastre.
  burbuja.addEventListener("dragstart", (evento) => {
    evento.dataTransfer.setData("text/plain", burbuja.id);
    evento.dataTransfer.effectAllowed = "move";
    burbuja.classList.add("en-arrastre");
  });
  burbuja.addEventListener("dragend", () => {
    // HTML Drag and Drop no mueve el nodo físicamente por defecto.
    // Por ello, si el intento falla, queda en sus coordenadas originales.
    burbuja.classList.remove("en-arrastre");
  });
  tablero.appendChild(burbuja);
  actualizarCantidad();
}

function configurarSoltado(zona) {
  zona.addEventListener("dragover", (evento) => {
    evento.preventDefault(); // Indispensable para habilitar drop.
    evento.dataTransfer.dropEffect = "move";
    zona.classList.add("sobre");
  });
  zona.addEventListener("dragleave", () => zona.classList.remove("sobre"));
  zona.addEventListener("drop", (evento) => {
    evento.preventDefault();
    zona.classList.remove("sobre");
    const id = evento.dataTransfer.getData("text/plain");
    const burbuja = document.getElementById(id);
    if (!burbuja) return;

    if (burbuja.dataset.pez === zona.dataset.pez) {
      sumarCuenta(zona.dataset.pez);
      burbuja.remove(); // Acierto: desaparece.
      actualizarCantidad();
      document.getElementById("mensaje").textContent = "¡Correcto! +1";
      zona.classList.add("acierto");
      setTimeout(() => zona.classList.remove("acierto"), 420);
    } else {
      // Error: el contador no cambia y la burbuja sigue en su sitio.
      document.getElementById("mensaje").textContent = "Zona incorrecta: intenta otra vez";
      zona.classList.add("error");
      setTimeout(() => zona.classList.remove("error"), 420);
    }
  });
}

const tablero = crearPecera(8);
prepararZonas(tablero);
iniciarCambioColor(tablero);
setInterval(() => crearBurbuja(tablero), 2000);
document.getElementById("limpiar").addEventListener("click", () => location.reload());
window.addEventListener("storage", (evento) => {
  if (evento.key === CLAVE_NEMO) mostrarCuentas();
});
