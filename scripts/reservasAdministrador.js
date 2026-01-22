import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { httpGet, httpPut, httpDelete } from "./servicios/httpServicios.js"; // asegúrate de tener tus servicios

// Contenedores y filtros
const dashboard = document.getElementById("dashboardReservas");
const inputBuscar = document.getElementById("buscar");
const inputFechaInicio = document.getElementById("fechaInicio");
const inputFechaFin = document.getElementById("fechaFin");

// Variables globales
let reservas = [];
let habitaciones = [];

// ===========================
// Cargar datos desde backend
// ===========================
async function cargarDatos() {
  try {
    // Traer habitaciones
    habitaciones = await httpGet("habitaciones", true); // true = privado (admin)
    // Traer reservas
    reservas = await httpGet("reservas", true);

    renderReservas();
  } catch (error) {
    console.error("Error al cargar datos del backend:", error);
    Swal.fire("Error", "No se pudieron cargar las reservas desde el servidor.", "error");
  }
}

// ===========================
// Crear tarjeta de reserva
// ===========================
function crearTarjeta(reserva) {
  const habitacion = habitaciones.find(h => h.idHabitacion === reserva.idHabitacion);

  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
    <div class="card-reserva">
      <div class="card-header">Reserva #${reserva.idReserva}</div>
      <div class="card-body">
        <p><strong>Huésped:</strong> ${reserva.huesped.nombre} ${reserva.huesped.apellido}</p>
        <p><strong>Habitación:</strong> ${habitacion ? habitacion.numero + " (" + habitacion.tipo + ")" : "N/D"}</p>
        <p><strong>Fechas:</strong> ${reserva.fechas.checkIn} - ${reserva.fechas.checkOut} (${reserva.fechas.noches} noches)</p>
        <p><strong>Pago:</strong> Total $${reserva.pago.montoTotal} | Pagado $${reserva.pago.montoPagado} | Saldo $${reserva.pago.saldoPendiente}</p>
        <p><strong>Estado:</strong>
          <span class="badge ${reserva.estado === "confirmada" ? "bg-success" : "bg-danger"}">
            ${reserva.estado}
          </span>
        </p>
      </div>
      <div class="card-footer acciones-footer">
        <button class="btn btn-edit btn-sm" onclick="editarReserva(${reserva.idReserva})">Editar</button>
        <button class="btn btn-delete btn-sm" onclick="eliminarReserva(${reserva.idReserva})">Eliminar</button>
      </div>
    </div>
  `;

  dashboard.appendChild(card);
}

// ===========================
// Renderizar reservas con filtro
// ===========================
function renderReservas() {
  dashboard.innerHTML = "";

  const filtroTexto = inputBuscar.value.toLowerCase();
  const fechaInicio = inputFechaInicio?.value ? new Date(inputFechaInicio.value) : null;
  const fechaFin = inputFechaFin?.value ? new Date(inputFechaFin.value) : null;

  const listaFiltrada = reservas.filter(r => {
    const cumpleTexto =
      r.idReserva.toString().includes(filtroTexto) ||
      r.huesped.nombre.toLowerCase().includes(filtroTexto) ||
      (habitaciones.find(h => h.idHabitacion === r.idHabitacion)?.numero || "").toString().includes(filtroTexto);

    const checkIn = new Date(r.fechas.checkIn);
    const checkOut = new Date(r.fechas.checkOut);

    const cumpleFechaInicio = fechaInicio ? checkIn >= fechaInicio : true;
    const cumpleFechaFin = fechaFin ? checkOut <= fechaFin : true;

    return cumpleTexto && cumpleFechaInicio && cumpleFechaFin;
  });

  if (listaFiltrada.length === 0) {
    dashboard.innerHTML = `<p class="text-center">No se encontraron reservas.</p>`;
    return;
  }

  listaFiltrada.forEach(reserva => crearTarjeta(reserva));
}

// ===========================
// Editar estado de reserva
// ===========================
window.editarReserva = async function(idReserva) {
  const reserva = reservas.find(r => r.idReserva === idReserva);
  if (!reserva) return;

  const { value, isConfirmed } = await Swal.fire({
    title: `Editar estado de reserva #${idReserva}`,
    input: "select",
    inputOptions: {
      confirmada: "Confirmada",
      cancelada: "Cancelada"
    },
    inputValue: reserva.estado,
    showCancelButton: true,
    confirmButtonText: "Guardar"
  });

  if (isConfirmed) {
    try {
      // Actualizar en backend
      reserva.estado = value;
      await httpPut(`reservas/${idReserva}`, reserva, true);
      await cargarDatos();
      Swal.fire("Éxito", "El estado de la reserva se actualizó correctamente.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar la reserva.", "error");
    }
  }
};

// ===========================
// Eliminar reserva
// ===========================
window.eliminarReserva = async function(idReserva) {
  const confirmar = await Swal.fire({
    title: "¿Eliminar reserva?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar"
  });

  if (confirmar.isConfirmed) {
    try {
      await httpDelete(`reservas/${idReserva}`, true);
      await cargarDatos();
      Swal.fire("Éxito", "Reserva eliminada correctamente.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
    }
  }
};

// ===========================
// Eventos de filtros
// ===========================
inputBuscar.addEventListener("input", renderReservas);
inputFechaInicio?.addEventListener("change", renderReservas);
inputFechaFin?.addEventListener("change", renderReservas);

// ===========================
// Inicial
// ===========================
cargarDatos();



