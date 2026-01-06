import {
  inicializarLocalStorage,
  obtenerHabitaciones,
} from "./crearhabitacion.js";
import { estaDisponible } from "./disponible.js";
import './reservar.js'

// Para favoritos
const FAVORITOS_KEY = "favoritos";

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
}


inicializarLocalStorage();

let favoritos = [];
let habitacionesDisponiblesCache = [];

export function pintarHabitacionesDisponibles() {
  const contenedor = document.getElementById("habitacionesGrid");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const checkIn = "2025-03-12";
  const checkOut = "2025-03-14";

  const habitaciones = obtenerHabitaciones();
  const disponibles = habitaciones.filter((h) =>
    estaDisponible(h, checkIn, checkOut)
  );

  // Guardar disponibles en caché para la búsqueda
  habitacionesDisponiblesCache = disponibles;

  // Renderizar habitaciones
  renderHabitaciones(disponibles);

  // Inicializar buscador
  inicializarBuscador();
}

function renderHabitaciones(habitacionesAMostrar) {
  const contenedor = document.getElementById("habitacionesGrid");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const favoritosLS = obtenerFavoritos();

  habitacionesAMostrar.forEach((habitacion) => {
  const esFavorito = favoritosLS?.some(f => f.id === habitacion.id);

    const card = `
      <div class="col-md-4">
        <div class="card room-card position-relative">
          <img src="${habitacion.imagen}" class="room-img w-100" />

          <div class="favorite-btn ${esFavorito ? "favorito" : ""}"
           data-fav-id="${habitacion.id}">
        <i class="bi bi-heart-fill"></i>
      </div>
          <div class="card-body">
            <h5 class="fw-bold text-primary-dark">Habitación ${habitacion.numero}</h5>
            <p class="text-muted">
              Tipo: ${habitacion.tipo} <br>
              Capacidad: ${habitacion.capacidad} personas
            </p>
            <h5 class="fw-bold text-accent">$${habitacion.precio} / noche</h5>

            <button
              class="btn btn-soft-yellow mt-2 w-100 fw-bold reservar-btn"
              data-id="${habitacion.id}"
              ${habitacion.disponible ? "" : "disabled"}
            >
              ${habitacion.disponible ? "Reservar" : "Ocupada"}
            </button>
          </div>
        </div>
      </div>
    `;
    
    contenedor.insertAdjacentHTML("beforeend", card);
  });

  attachDelegatedHandlers(contenedor);
}

function attachDelegatedHandlers(contenedor) {
  contenedor.removeEventListener("click", delegator); // idempotencia si se llama varias veces
  contenedor.addEventListener("click", delegator);
}

function delegator(e) {
  const btn = e.target.closest(".reservar-btn");
  if (btn) {
    const idHabitacion = btn.dataset.id;
    const usuarioActual = sessionStorage.getItem("usuarioActual");

    if (!usuarioActual) {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Inicia sesión para poder hacer una reserva",
        confirmButtonText: "Ir a Login",
      }).then(() => {
        window.location.href = "../pages/login.html";
      });
      return;
    }


      reservar(idHabitacion);
  }

  const favBtn = e.target.closest(".favorite-btn");
   
  if (favBtn) {    
    const idFav = favBtn.dataset.favId;
    toggleFavorito(idFav, favBtn);
  
  }
}


function toggleFavorito(id, btnEl) {
  
  let favoritos = obtenerFavoritos();
  const habitaciones = obtenerHabitaciones();

  // ❌ ELIMINAR Number(id)
  const index = favoritos.findIndex(f => f.id === id);

  if (index === -1) {
    const habitacion = habitaciones.find(h => h.id === id);
    if (!habitacion) {
      return;
    }

    favoritos.push({
      id: habitacion.id, // string "H2"
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      precio: habitacion.precio,
      imagen: habitacion.imagen
    });

    btnEl.classList.add("favorito");

    Swal.fire({
      icon: "success",
      title: "Agregado a favoritos ❤️",
      timer: 1200,
      showConfirmButton: false
    });

  } else {
    favoritos.splice(index, 1);
    btnEl.classList.remove("favorito");

    Swal.fire({
    icon: "info",
    title: "Eliminado de favoritos 💔",
    timer: 1000,
    showConfirmButton: false
  });
  }

  guardarFavoritos(favoritos);
}


function inicializarBuscador() {
  const buscador = document.getElementById("buscadorReservas");
  if (!buscador) return;

  buscador.addEventListener("input", () => {
    const textoBusqueda = buscador.value.toLowerCase().trim();

    if (textoBusqueda === "") {
      renderHabitaciones(habitacionesDisponiblesCache);
    } else {
      const habitacionesFiltradas = habitacionesDisponiblesCache.filter(
        (habitacion) => {
          const numero = String(habitacion.numero).toLowerCase();
          const tipo = habitacion.tipo.toLowerCase();
          const id = String(habitacion.id).toLowerCase();
          const nombre = `habitacion ${numero}`.toLowerCase();

          return (
            numero.includes(textoBusqueda) ||
            tipo.includes(textoBusqueda) ||
            id.includes(textoBusqueda) ||
            nombre.includes(textoBusqueda)
          );
        }
      );

      renderHabitaciones(habitacionesFiltradas);
    }
  });
}



