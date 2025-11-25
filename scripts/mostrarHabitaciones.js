import { habitaciones } from "../assets/data/data.js";
import { estaDisponible } from "./disponible.js";

let favoritos = [];
export function pintarHabitacionesDisponibles() {    
  const contenedor = document.getElementById("habitacionesGrid");
  contenedor.innerHTML = "";

  const checkIn = "2025-03-12";
  const checkOut = "2025-03-14";

  const disponibles = habitaciones.filter(h =>
    estaDisponible(h, checkIn, checkOut)
  );

  disponibles.forEach(habitacion => {
    const card = `
      <div class="col-md-4">
        <div class="card room-card position-relative">

          <img src="${habitacion.imagen}" class="room-img w-100" />

          <div 
            class="favorite-btn" 
            onclick="toggleFavorito('${habitacion.id}', this)">
            <i class="bi bi-heart-fill"></i>
          </div>

          <div class="card-body">
            <h5 class="fw-bold text-primary-dark">Habitación ${habitacion.numero}</h5>
            <p class="text-muted">
              Tipo: ${habitacion.tipo} <br>
              Capacidad: ${habitacion.capacidad} personas
            </p>
            <h5 class="fw-bold text-accent">$${habitacion.precio} / noche</h5>

            <button class="btn btn-soft-yellow mt-2 w-100 fw-bold"
              onclick="reservar('${habitacion.id}')">
              Reservar
            </button>
          </div>

        </div>
      </div>
    `;

    contenedor.innerHTML += card;
  });
}


// No esta llegando la información pendiente para revisar
// export function toggleFavorito(id, btn) {
//   if (favoritos.includes(id)) {
//     favoritos = favoritos.filter(f => f !== id);
//     btn.classList.remove("active");
//   } else {
//     favoritos.push(id);
//     btn.classList.add("active");
//   }
// }