document.addEventListener("DOMContentLoaded", pintarFavoritos);

import { usuarioEstaLogueado, pedirLogin } from "./session.js";

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-favorito")) {

        if (!usuarioEstaLogueado()) {
            e.preventDefault();
            pedirLogin();
            return;
        }

        // ✔️ aquí sigue la lógica normal de favoritos
    }
});

const FAVORITOS_KEY = "favoritos";

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
}

export function pintarFavoritos() {
  const contenedor = document.getElementById("favoritosGrid");
  const sinFavoritos = document.getElementById("sinFavoritos");

  if (!contenedor) return;

  const favoritos = obtenerFavoritos();
  contenedor.innerHTML = "";

  if (favoritos.length === 0) {
    sinFavoritos.classList.remove("d-none");
    return;
  }

  sinFavoritos.classList.add("d-none");

  favoritos.forEach((h) => {
    const card = `
      <div class="col-md-4">
        <div class="card room-card position-relative">
          <img src="${h.url_foto}" class="room-img w-100" />

          <div class="favorite-btn favorito"
                         data-fav-id="${h.idHabitacion}">

            <i class="bi bi-heart-fill"></i>
          </div>

          <div class="card-body">
            <h5 class="fw-bold text-primary-dark">
              Habitación ${h.numero}
            </h5>
            <p class="text-muted">
              Tipo: ${h.tipo}
            </p>
            <h5 class="fw-bold text-accent">
              $${h.precioPorNoche} / noche
            </h5>
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", card);
  });

  contenedor.addEventListener("click", manejarEliminarFavorito);
}


function manejarEliminarFavorito(e) {
  const favBtn = e.target.closest(".favorite-btn");
  if (!favBtn) return;

  const id = favBtn.dataset.favId;

  let favoritos = obtenerFavoritos();
  favoritos = favoritos.filter(f => Number(f.idHabitacion) !== Number(id));
console.log(favoritos,  id)
  guardarFavoritos(favoritos);

  Swal.fire({
    icon: "info",
    title: "Eliminado de favoritos 💔",
    timer: 1000,
    showConfirmButton: false
  });

  pintarFavoritos(); // refresca vista
}
