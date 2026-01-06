import {
  inicializarLocalStorage,
  obtenerHabitaciones
} from "./crearhabitacion.js";

import { estaDisponible } from "./disponible.js";
import "./reservar.js";

const FAVORITOS_KEY = "favoritos";

function usuarioLogueado() {
  return sessionStorage.getItem("usuarioActual") !== null;
}

function pedirLogin() {
  Swal.fire({
    icon: "warning",
    title: "Debes iniciar sesión",
    text: "Para continuar necesitas iniciar sesión",
    confirmButtonText: "Ir a Login"
  }).then(() => {
    window.location.href = "./login.html";
  });
}

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
}

function guardarFavoritos(favs) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favs));
}

inicializarLocalStorage();

let habitacionesDisponiblesCache = [];

export function pintarHabitacionesDisponibles() {
  const contenedor = document.getElementById("habitacionesGrid");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const habitaciones = obtenerHabitaciones();

  // 👉 SIEMPRE mostrar habitaciones
  habitacionesDisponiblesCache = habitaciones;

  renderHabitaciones(habitaciones);
}

function renderHabitaciones(habitaciones) {
  const contenedor = document.getElementById("habitacionesGrid");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const favoritos = obtenerFavoritos();

  habitaciones.forEach(h => {
    const esFavorito = favoritos.some(f => f.id === h.id);

    const card = `
      <div class="col-md-4">
        <div class="card room-card position-relative">
          <img src="${h.imagen}" class="room-img w-100" />

          <div class="favorite-btn ${esFavorito ? "favorito" : ""}"
               data-fav-id="${h.id}">
            <i class="bi bi-heart-fill"></i>
          </div>

          <div class="card-body">
            <h5 class="fw-bold text-primary-dark">
              Habitación ${h.numero}
            </h5>
            <p class="text-muted">
              Tipo: ${h.tipo} <br>
              Capacidad: ${h.capacidad} personas
            </p>
            <h5 class="fw-bold text-accent">
              $${h.precio} / noche
            </h5>

            <button
              class="btn btn-soft-yellow mt-2 w-100 fw-bold reservar-btn"
              data-id="${h.id}">
              Reservar
            </button>
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", card);
  });

  delegarEventos(contenedor);
}

function delegarEventos(contenedor) {
  contenedor.onclick = (e) => {

    // 🟡 Reservar
    const reservarBtn = e.target.closest(".reservar-btn");
    if (reservarBtn) {
      if (!usuarioLogueado()) {
        pedirLogin();
        return;
      }
      reservar(reservarBtn.dataset.id);
    }

    // ❤️ Favoritos
    const favBtn = e.target.closest(".favorite-btn");
    if (favBtn) {
      if (!usuarioLogueado()) {
        pedirLogin();
        return;
      }

      const id = favBtn.dataset.favId;
      let favs = obtenerFavoritos();

      const index = favs.findIndex(f => f.id === id);

      if (index === -1) {
        const h = obtenerHabitaciones().find(x => x.id === id);
        favs.push({
          id: h.id,
          numero: h.numero,
          tipo: h.tipo,
          precio: h.precio,
          imagen: h.imagen
        });

        favBtn.classList.add("favorito");

        Swal.fire({
          icon: "success",
          title: "Agregado a favoritos ❤️",
          timer: 1000,
          showConfirmButton: false
        });

      } else {
        favs.splice(index, 1);
        favBtn.classList.remove("favorito");
      }

      guardarFavoritos(favs);
    }
  };
}

pintarHabitacionesDisponibles();
