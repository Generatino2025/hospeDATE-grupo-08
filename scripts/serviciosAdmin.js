import { listarServicios, eliminarServicios, actualizarServicios } from "./utils/HttpsParaReservas.js";

let servicios = [];

const contenedor = document.getElementById("contenedorServicios");
const buscador = document.getElementById("buscador");

const modal = new bootstrap.Modal(document.getElementById("modalEditarServicio"));
const formEditar = document.getElementById("formEditarServicio");
const inputId = document.getElementById("editarId");
const inputNombre = document.getElementById("editarNombre");
const inputPrecio = document.getElementById("editarPrecio");


init();

function init() {
  cargarServicios();
  bindBuscador();
}

async function cargarServicios() {
  try {
    servicios = await listarServicios();
    renderServicios(servicios);
  } catch (error) {
    console.error("Error cargando servicios:", error);
    Swal.fire("Error", "No se pudieron cargar los servicios", "error");
  }
}

function bindBuscador() {
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();

    const filtrados = servicios.filter(s =>
      s.nombre.toLowerCase().includes(texto)
    );

    renderServicios(filtrados);
  });
}

function renderServicios(lista) {
  contenedor.innerHTML = "";

  if (!lista.length) {
    contenedor.innerHTML = `
      <p class="text-center text-muted">
        No hay servicios registrados
      </p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  lista.forEach(servicio => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card servicio-card h-100">
        <div class="card-body servicio-body">

          <div class="servicio-header">
            <h5 class="servicio-title">${servicio.nombre}</h5>
          </div>

          <p class="servicio-precio">$${servicio.precio} / servicio</p>

          <div class="servicio-actions">
            <button 
              class="btn btn-warning servicio-btn btn-editar"
              data-id="${servicio.idServicio}"
              data-nombre="${servicio.nombre}"
              data-precio="${servicio.precio}">
              <i class="bi bi-pencil"></i> Editar
            </button>

            <button 
              class="btn btn-danger servicio-btn btn-eliminar"
              data-id="${servicio.idServicio}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>

        </div>
      </div>
    `;

    fragment.appendChild(col);
  });

  contenedor.appendChild(fragment);
}

contenedor.addEventListener("click", e => {
  const btnEliminar = e.target.closest(".btn-eliminar");
  const btnEditar = e.target.closest(".btn-editar");
console.log(e)
  if (btnEliminar) {
    const id = btnEliminar.dataset.id;
    borrarServicio(id);
  }

  if (btnEditar) {
    const { id, nombre, precio } = btnEditar.dataset;
    abrirModalEditar(id, nombre, precio);
  }
});

async function borrarServicio(id) {
  if (!id) {
    console.error("ID inválido:", id);
    return;
  }
console.log(id)
  const result = await Swal.fire({
    title: "¿Eliminar servicio?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  try {
    await eliminarServicios(id);
    await cargarServicios();
    Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo eliminar", "error");
  }
}


//Para el modal de editar 
function abrirModalEditar(id, nombre, precio) {
  inputId.value = id;
  inputNombre.value = nombre;
  inputPrecio.value = precio;

  modal.show();
}

formEditar.addEventListener("submit", async e => {
  e.preventDefault();
  const id = inputId.value;

  const data = {
    nombre: inputNombre.value.trim(),
    precio: Number(inputPrecio.value)
  };
console.log("guardar", e, id, data)

  if (!data.nombre || data.precio <= 0) {
    Swal.fire("Validación", "Datos inválidos", "warning");
    return;
  }

  try {
    await actualizarServicios(id, data);

    Swal.fire("Actualizado", "Servicio actualizado", "success");

    modal.hide();
    cargarServicios();
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo actualizar", "error");
  }
});

