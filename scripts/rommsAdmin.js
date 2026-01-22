const contenedor = document.getElementById('contenedorHabitaciones')
const buscador = document.getElementById('buscador')

let habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || []
function render (lista) {
  
  contenedor.innerHTML = ''

  lista.forEach(h => {
    const card = document.createElement('div')
    card.className = 'col-md-4'

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

// Mostrar todas las habitaciones al ingresar
render(habitaciones)

// Filtro buscador
buscador.addEventListener('input', () => {
  const q = buscador.value.toLowerCase().trim()

  const filtradas = habitaciones.filter(
    h =>
      h.numero.includes(q) ||
      h.tipo.toLowerCase().includes(q) ||
      String(h.capacidad).includes(q)
  )

        <div class="p-3">
          <h5 class="fw-bold mb-1">Habitación ${h.numero}</h5>
          <p class="text-muted m-0">
            ${h.tipo.toUpperCase()} · Capacidad: ${h.capacidad}
          </p>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="price-tag">$${h.precioPorNoche}/noche</span>

            <!-- ID CORRECTO -->
            <button
              class="btn btn-danger btn-sm eliminar"
              data-id="${h.idHabitacion}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });

  activarEliminar();
}


// ===============================
// ELIMINAR HABITACIÓN (ADMIN)
// ===============================
function activarEliminar(e) {
  console.log(e);
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const confirm = await Swal.fire({
        title: "¿Eliminar habitación?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
      });

      if (!confirm.isConfirmed) return;

      try {
        // CORRECCIÓN: template string correcto
        await httpDelete(`habitaciones/${id}`, true);

        // Actualiza la lista local y renderiza
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
