import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { httpGet } from "./servicios/httpGet.js";
import { httpDelete } from "./servicios/httpDelete.js";
import { httpPut } from "./servicios/httpPut.js";

const contenedor = document.getElementById("contenedorHabitaciones");
const buscador = document.getElementById("buscador");

let habitaciones = [];

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", cargarHabitaciones);

// ===============================
// CARGAR DESDE BD
// ===============================
async function cargarHabitaciones() {
  try {
    habitaciones = await httpGet("habitaciones", true);
    render(habitaciones);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudieron cargar las habitaciones", "error");
  }
}

// ===============================
// RENDER (MISMA ESTRUCTURA)
// ===============================
function render(lista) {
  contenedor.innerHTML = "";

  if (!lista.length) {
    contenedor.innerHTML = `<p>No hay habitaciones registradas</p>`;
    return;
  }

  lista.forEach(h => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="room-card position-relative">
        <img src="${h.url_foto}"
             class="room-image"
             onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">

        <div class="p-3">
          <h5 class="fw-bold mb-1">Habitación ${h.numero}</h5>
          <p class="text-muted m-0">
            ${h.tipo.toUpperCase()} · Capacidad: ${h.capacidad}
          </p>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="price-tag">$${h.precioPorNoche}/noche</span>

            <div>
              <button
                class="btn btn-warning btn-sm editar"
                data-id="${h.idHabitacion}">
                Editar
              </button>

              <button
                class="btn btn-danger btn-sm eliminar"
                data-id="${h.idHabitacion}">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    contenedor.appendChild(card);
  });

  activarEliminar();
  activarEditar();
}

// ===============================
// ELIMINAR
// ===============================
function activarEliminar() {
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;

      const confirm = await Swal.fire({
        title: "¿Eliminar habitación?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar"
      });

      if (!confirm.isConfirmed) return;

      try {
        await httpDelete(`habitaciones/${id}`, true);

        habitaciones = habitaciones.filter(h => h.idHabitacion != id);
        render(habitaciones);

        Swal.fire("Eliminada", "Habitación eliminada correctamente", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar la habitación", "error");
      }
    });
  });
}

// ===============================
// EDITAR → ABRIR MODAL
// ===============================
function activarEditar() {
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const h = habitaciones.find(x => x.idHabitacion == id);

      editId.value = h.idHabitacion;
      editNumero.value = h.numero;
      editTipo.value = h.tipo;
      editCapacidad.value = h.capacidad;
      editPrecio.value = h.precioPorNoche;
      editDescripcion.value = h.descripcion;
      editImagen.value = h.url_foto;

      new bootstrap.Modal(document.getElementById("modalEditar")).show();
    });
  });
}

// ===============================
// GUARDAR CAMBIOS
// ===============================
btnGuardarCambios.addEventListener("click", async () => {
  if (!editNumero.value || !editPrecio.value) {
    Swal.fire("Campos obligatorios", "Completa número y precio", "warning");
    return;
  }

  const data = {
    numero: editNumero.value,
    tipo: editTipo.value,
    capacidad: Number(editCapacidad.value),
    precioPorNoche: Number(editPrecio.value),
    descripcion: editDescripcion.value,
    url_foto: editImagen.value
  };

  try {
    await httpPut(`habitaciones/${editId.value}`, data, true);

    Swal.fire("Actualizada", "Habitación modificada correctamente", "success");
    bootstrap.Modal.getInstance(modalEditar).hide();

    cargarHabitaciones();
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo actualizar la habitación", "error");
  }
});

// ===============================
// BUSCADOR
// ===============================
buscador.addEventListener("input", () => {
  const q = buscador.value.toLowerCase().trim();
  const filtradas = habitaciones.filter(h =>
    h.numero.toString().includes(q) ||
    h.tipo.toLowerCase().includes(q) ||
    String(h.capacidad).includes(q)
  );
  render(filtradas);
});

