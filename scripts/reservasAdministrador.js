import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { reservas as reservasBase } from "../assets/data/data.js";

// ----------------------------------------------------
// INICIALIZAR RESERVAS
// ----------------------------------------------------
if (!localStorage.getItem("reservas")) {
  localStorage.setItem("reservas", JSON.stringify(reservasBase));
}

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

const dashboard = document.getElementById("dashboardReservas");
const inputBuscar = document.getElementById("buscar");

// ----------------------------------------------------
// FUNCIÓN PARA CREAR TARJETA
// ----------------------------------------------------
function crearTarjeta(reserva, index) {
  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
    <div class="card-reserva">
      <div class="card-header">Reserva #${reserva.idReserva}</div>
      <div class="card-body">
        <p><strong>Huésped:</strong> ${reserva.huesped.nombre} ${reserva.huesped.apellido}</p>
        <p><strong>Habitación:</strong> ${reserva.habitacion.numero} (${reserva.habitacion.tipo})</p>
        <p><strong>Fechas:</strong> ${reserva.fechas.checkIn} - ${reserva.fechas.checkOut} (${reserva.fechas.noches} noches)</p>
        <p><strong>Pago:</strong> Total USD ${reserva.pago.montoTotal} | Pagado USD ${reserva.pago.montoPagado} | Saldo USD ${reserva.pago.saldoPendiente}</p>
        <p><strong>Estado:</strong>
          <span class="badge ${reserva.estado === "confirmada" ? "bg-success" : "bg-danger"}">
            ${reserva.estado}
          </span>
        </p>
      </div>
      <div class="card-footer acciones-footer">
        <button class="btn  btn-edit btn-sm" onclick="editarReserva(${index})">Editar</button>
        <button class="btn btn-delete  btn-sm" onclick="eliminarReserva(${index})">Eliminar</button>
      </div>
    </div>
  `;

  dashboard.appendChild(card);
}

// ----------------------------------------------------
// RENDERIZAR RESERVAS
// ----------------------------------------------------
function renderReservas(filtro = "") {
  dashboard.innerHTML = "";

  const lista = reservas.filter(r =>
    r.idReserva.toLowerCase().includes(filtro.toLowerCase()) ||
    r.huesped.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    r.habitacion.numero.toString().includes(filtro)
  );

  if (lista.length === 0) {
    dashboard.innerHTML = `<p class="text-center">No se encontraron reservas.</p>`;
    return;
  }

  lista.forEach((reserva, index) => crearTarjeta(reserva, index));
}

// ----------------------------------------------------
// BUSCADOR
// ----------------------------------------------------
inputBuscar.addEventListener("input", () => {
  renderReservas(inputBuscar.value);
});

// ----------------------------------------------------
// EDITAR ESTADO
// ----------------------------------------------------
window.editarReserva = function (index) {
  const reserva = reservas[index];

  Swal.fire({
    title: `Editar ${reserva.idReserva}`,
    input: "select",
    inputOptions: {
      confirmada: "Confirmada",
      cancelada: "Cancelada"
    },
    inputValue: reserva.estado,
    showCancelButton: true,
    confirmButtonText: "Guardar"
  }).then(result => {
    if (result.isConfirmed) {
      reservas[index].estado = result.value;
      localStorage.setItem("reservas", JSON.stringify(reservas));
      renderReservas(inputBuscar.value);
      Swal.fire("Actualizado", "El estado fue modificado.", "success");
    }
  });
};

// ----------------------------------------------------
// ELIMINAR RESERVA
// ----------------------------------------------------
window.eliminarReserva = function (index) {
  const reserva = reservas[index];

  Swal.fire({
    title: "¿Eliminar reserva?",
    text: `Se eliminará la reserva ${reserva.idReserva}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      reservas.splice(index, 1);
      localStorage.setItem("reservas", JSON.stringify(reservas));
      renderReservas(inputBuscar.value);
      Swal.fire("Eliminada", "La reserva fue eliminada.", "success");
    }
  });
};

// Navbar auth is handled centrally in scripts/authNavbar.js

// Inicial
renderReservas();
