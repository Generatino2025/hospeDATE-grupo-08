// import { inicializarLocalStorage, obtenerHabitaciones } from "./crearhabitacion.js";
// import { estaDisponible } from "./disponible.js";

// inicializarLocalStorage();

// let favoritos = [];
// export function pintarHabitacionesDisponibles() {    
//   const contenedor = document.getElementById("habitacionesGrid");
//   contenedor.innerHTML = "";
// console.log("ingrese")
//   const checkIn = "2025-03-12";
//   const checkOut = "2025-03-14";

//    const habitaciones = obtenerHabitaciones();
//    console.log(habitaciones)

//   const disponibles = habitaciones.filter(h =>
//     estaDisponible(h, checkIn, checkOut)
//   );

//   disponibles.forEach(habitacion => {


//     const card = `
//       <div class="col-md-4">
//         <div class="card room-card position-relative ">

//           <img src="${habitacion.imagen}" class="room-img w-100" />

//           <div 
//             class="favorite-btn" 
//             onclick="toggleFavorito('${habitacion.id}', this)">
//             <i class="bi bi-heart-fill"></i>
//           </div>

//           <div class="card-body">
//             <h5 class="fw-bold text-primary-dark">Habitación ${habitacion.numero}</h5>
//             <p class="text-muted">
//               Tipo: ${habitacion.tipo} <br>
//               Capacidad: ${habitacion.capacidad} personas
//             </p>
//             <h5 class="fw-bold text-accent">$${habitacion.precio} / noche</h5>

//             <button class="btn btn-soft-yellow mt-2 w-100 fw-bold"
//               onclick="reservar('${habitacion.id}')" data-bs-toggle="modal" data-bs-target="#modalReserva" >
//               Reservar
//             </button>
//           </div>

//         </div>
//       </div>
//     `;
//     contenedor.innerHTML += card;
//   });
// }


import {
  inicializarLocalStorage,
  obtenerHabitaciones,
} from "./crearhabitacion.js";
import { estaDisponible } from "./disponible.js";
import './reservar.js'

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

  habitacionesAMostrar.forEach((habitacion) => {
    const card = `
      <div class="col-md-4">
        <div class="card room-card position-relative">
          <img src="${habitacion.imagen}" class="room-img w-100" />
          <div class="favorite-btn" data-fav-id="${habitacion.id}">
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

function abrirModalReserva(idHabitacion) {
  const modalEl = document.getElementById("modalReserva");
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  // opcional: inyectar datos en el modal para mostrar info
  const modalBody = modalEl.querySelector(".modal-body");
  if (modalBody) {
    const habit = obtenerHabitaciones().find(h => h.id === idHabitacion);
    modalBody.innerHTML = `
      <p class="fw-bold">Habitación ${habit.numero} — ${habit.tipo.toUpperCase()}</p>
      <p>Capacidad: ${habit.capacidad} personas</p>
      <p>Precio: $${habit.precio} / noche</p>
      <input type="hidden" id="modalHabitacionId" value="${idHabitacion}">
    `;
  }

  modal.show();
}

function toggleFavorito(id, btnEl) {
  const index = favoritos.indexOf(id);
  if (index === -1) {
    favoritos.push(id);
    btnEl.classList.add("favorito");
  } else {
    favoritos.splice(index, 1);
    btnEl.classList.remove("favorito");
  }
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

