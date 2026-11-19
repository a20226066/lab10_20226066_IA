/* PREGUNTA 2: WEB STORAGE API Y CAMBIO PROGRESIVO DE COLOR */
const CLAVE_NEMO = "LAB10_20226066_NEMO";
const CLAVE_DORY = "LAB10_20226066_DORY";
const AZUL = [173, 216, 230];  // #ADD8E6
const VERDE = [46, 204, 113];  // #2ECC71
const DURACION = 60; // segundos para alcanzar el verde

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

function actualizarCuenta(pez, cantidad = 1) {
  const almacen = pez === "nemo" ? localStorage : sessionStorage;
  const clave = pez === "nemo" ? CLAVE_NEMO : CLAVE_DORY;
  almacen.setItem(clave, String(leerCuenta(pez) + cantidad));
  mostrarCuentas();
}

function mostrarCuentas() {
  document.getElementById("cuenta-nemo").textContent = leerCuenta("nemo");
  document.getElementById("cuenta-dory").textContent = leerCuenta("dory");
}

function crearZona(pez, emoji, memoria) {
  const zona = document.createElement("section");
  zona.className = `zona zona-${pez}`;
  zona.dataset.pez = pez;
  // Los datos provienen de literales definidos por nuestro programa.
  zona.innerHTML = `
    <span class="emoji-pez" aria-hidden="true">${emoji}</span>
    <span class="nombre-pez">${pez === "nemo" ? "Nemo" : "Dory"}</span>
    <span class="contador" id="cuenta-${pez}">0</span>
    <button type="button" data-contar="${pez}">Contar pez +1</button>
    <small>${memoria}</small>`;
  return zona;
}

function crearPeces(tablero) {
  const zonas = document.createElement("div");
  zonas.className = "zonas";
  zonas.append(
    crearZona("nemo", "🐠", "localStorage"),
    crearZona("dory", "🐟", "sessionStorage")
  );
  zonas.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-contar]");
    if (boton) actualizarCuenta(boton.dataset.contar);
  });
  tablero.appendChild(zonas);
  mostrarCuentas();
}

function iniciarAgua(tablero) {
  let segundos = 0; // No guardar: al recargar se reinicia el color.
  tablero.style.backgroundColor = `rgb(${AZUL.join(",")})`;
  setInterval(() => {
    segundos++;
    const porcentaje = Math.min(segundos / DURACION, 1);
    const rgb = AZUL.map((valor, i) =>
      Math.round(valor + (VERDE[i] - valor) * porcentaje));
    tablero.style.backgroundColor = `rgb(${rgb.join(",")})`;
    document.getElementById("tiempo").textContent = segundos;
  }, 1000);
}

const tablero = crearPecera(8);
crearPeces(tablero);
iniciarAgua(tablero);
document.getElementById("limpiar").addEventListener("click", () => location.reload());
// Al cambiar localStorage, las OTRAS pestañas reciben el evento storage.
window.addEventListener("storage", (evento) => {
  if (evento.key === CLAVE_NEMO) mostrarCuentas();
});
