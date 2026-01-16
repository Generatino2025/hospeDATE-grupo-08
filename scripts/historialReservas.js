// ==================
// MODAL ELEMENTOS

import {
  actualizarCalculos,
  validarFormularioReserva,
} from "./reservarParaUsuario.js";
import { limpiarTodosErrores } from "./utils/validacionesErrores.js";

// ==================
const modalReservaElement = document.getElementById("modalReserva");
const modalReserva = new bootstrap.Modal(modalReservaElement);

const habNumero = document.getElementById("habNumero");
const habTipo = document.getElementById("habTipo");
const habPrecio = document.getElementById("habPrecio");

const userNombre = document.getElementById("userNombre");
const userApellido = document.getElementById("userApellido");
const userTipoDoc = document.getElementById("userTipoDoc");
const userNumDoc = document.getElementById("userNumDoc");
const userTel = document.getElementById("userTel");

const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");

const precioPorNoche = document.getElementById("precioPorNoche");
const cantidadNoches = document.getElementById("cantidadNoches");
const montoTotalInput = document.getElementById("montoTotal");
const saldoPendiente = document.getElementById("saldoPendiente");

const metodoPago = document.getElementById("metodoPago");
const abono = document.getElementById("abono");

const notas = document.getElementById("notas");

const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");

function cancelarReserva(idReserva) {
  reservas = reservas.map((r) =>
    r.idReserva === idReserva ? { ...r, estado: "CANCELADA" } : r
  );

  localStorage.setItem("reservas", JSON.stringify(reservas));
}

let reservaEnEdicion = null;

function filtrarReservasPorFecha(desde, hasta) {
  return reservas.filter((r) =>
    rangoSeCruza(r.fechas.checkIn, r.fechas.checkOut, desde, hasta)
  );
}

export function obtenerReservasUsuario(usuarioId) {
  return reservas.filter((r) => r.usuarioId === usuarioId);
}

export function separarReservas(reservasUsuario) {
  const hoy = hoyISO();

  return {
    activas: reservasUsuario.filter(
      (r) => r.estado === "ACTIVA" && r.fechas.checkOut >= hoy
    ),
    pasadas: reservasUsuario.filter(
      (r) => r.estado === "ACTIVA" && r.fechas.checkOut < hoy
    ),
    canceladas: reservasUsuario.filter((r) => r.estado === "CANCELADA"),
  };
}

const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

const listaReservas = document.getElementById("listaReservas");
const sinReservas = document.getElementById("sinReservas");
const filtros = document.getElementById("filtrosEstado");

// ----------------------------
// SOLO RESERVAS DEL USUARIO
// ----------------------------
const reservasUsuario = reservas.filter(
  (r) => r?.huesped?.numeroDoc === usuarioActual?.numeroDoc
);

// ----------------------------
// OBTENER IMAGEN HABITACIÓN
// ----------------------------
function obtenerImagenHabitacion(idHabitacion) {
  const hab = habitaciones.find((h) => h.id === idHabitacion);
  return hab?.imagen || "https://via.placeholder.com/150";
}

// ----------------------------
// RENDER
// ----------------------------
export function renderReservas(estado = "TODAS") {
  listaReservas.innerHTML = "";
  sinReservas.classList.add("d-none");

  const filtradas =
    estado === "TODAS"
      ? reservasUsuario
      : reservasUsuario.filter((r) => r.estado === estado);

  if (filtradas.length === 0) {
    sinReservas.classList.remove("d-none");
    return;
  }

  filtradas.forEach((reserva) => {
    const img = obtenerImagenHabitacion(reserva.habitacion.idHabitacion);
    const acciones =
      reserva.estado === "ACTIVA"
        ? `
          <div class="mt-2 d-flex gap-2">
            <button class="btn btn-sm btn-edit" onclick="editarReserva('${reserva.idReserva}')">
              Modificar
            </button>
            <button class="btn btn-sm btn-delete" onclick="cancelarReserva('${reserva.idReserva}')">
              Cancelar
            </button>
          </div>
        `
        : "";

    const col = document.createElement("div");
    col.className = "col-md-6";

    col.innerHTML = `
      <div class="card reserva-card ${reserva.estado}">
        <div class="row g-0">
          <div class="col-4">
            <img src="${img}" class="reserva-img" />
          </div>

          <div class="col-8">
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <strong>${reserva.idReserva}</strong>
                <span class="badge ${badgeClase(reserva.estado)}">
                  ${reserva.estado}
                </span>
              </div>

              <p class="mb-1">
                Habitación ${reserva.habitacion.numero} - ${
      reserva.habitacion.tipo
    }
              </p>

              <p class="mb-1">
                ${reserva.fechas.checkIn} → ${reserva.fechas.checkOut}
              </p>

              <p class="mb-1">
                Total: USD ${reserva.pago.montoTotal}
              </p>

              <p class="mb-0">
                Saldo: USD ${reserva.pago.saldoPendiente}
              </p>

              ${acciones}
            </div>
          </div>
        </div>
      </div>
    `;

    listaReservas.appendChild(col);
  });
}

// ----------------------------
function badgeClase(estado) {
  if (estado === "ACTIVA") return "badge-activa";
  if (estado === "FINALIZADA") return "badge-finalizada";
  return "badge-cancelada";
}

// ----------------------------
// EVENTOS
// ----------------------------
filtros.addEventListener("click", (e) => {
  if (!e.target.dataset.estado) return;

  document.querySelectorAll("#filtrosEstado button").forEach((b) => {
    b.classList.remove("btn-primary", "active");
    b.classList.add("btn-outline-primary");
  });

  e.target.classList.add("btn-primary", "active");
  e.target.classList.remove("btn-outline-primary");

  renderReservas(e.target.dataset.estado);
});

window.cancelarReserva = function (idReserva) {
  Swal.fire({
    title: "¿Cancelar reserva?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No",
  }).then((result) => {
    if (!result.isConfirmed) return;

    const index = reservas.findIndex((r) => r.idReserva === idReserva);
    if (index === -1) return;

    reservas[index].estado = "CANCELADA";
    localStorage.setItem("reservas", JSON.stringify(reservas));

    renderReservas(document.querySelector(".btn.active").dataset.estado);
  });
};

window.editarReserva = function (idReserva) {
  const reserva = reservas.find((r) => r.idReserva === idReserva);
  if (!reserva) return;

  // Aquí luego conectas tu modal real

  Swal.fire({
    title: "Modificar Reserva",
    text: `Reserva ${idReserva}`,
    icon: "info",
     showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
   if (!result.isConfirmed) return;
    cargarReservaEnModal(reserva);
  });
};

// INIT
renderReservas();

function cargarReservaEnModal(reserva) {
  reservaEnEdicion = reserva;

  const habitacion = habitaciones.find(
    (h) => h.id === reserva.habitacion.idHabitacion
  );

  // HABITACION
  habNumero.value = habitacion.numero;
  habTipo.value = habitacion.tipo;
  habPrecio.value = habitacion.precio;

  // USER
  userNombre.value = reserva.huesped.nombre;
  userApellido.value = reserva.huesped.apellido;
  userTipoDoc.value = reserva.huesped.tipoDoc;
  userNumDoc.value = reserva.huesped.numeroDoc;
  userTel.value = reserva.huesped.telefono;

  // FECHAS
  checkIn.value = reserva.fechas.checkIn;
  checkOut.value = reserva.fechas.checkOut;

  // PAGO
  metodoPago.value = reserva.pago.metodo;
  abono.value = reserva.pago.montoPagado;

  // NOTAS
  notas.value = reserva.notas || "";

  // SERVICIOS
  document.querySelectorAll(".serv-adicional").forEach((cb) => {
    cb.checked = reserva.serviciosAdicionales?.some(
      (s) => s.idServicio === cb.dataset.id
    );
  });

  // CALCULAR
  actualizarCalculos(habitacion);

  // BOTÓN
  btnConfirmarReserva.textContent = "Actualizar Reserva";
  btnConfirmarReserva.onclick = () => actualizarReserva(reserva, habitacion);

  modalReserva.show();
}

function actualizarReserva(reserva, habitacion) {
  limpiarTodosErrores();

  const checkInVal = checkIn.value;
  const checkOutVal = checkOut.value;

  const abonoValor = Number(abono.value);
  const metodo = metodoPago.value;

  if (!validarFormularioReserva(habitacion)) return;

  const noches = (new Date(checkOutVal) - new Date(checkInVal)) / 86400000;

  const resultado = actualizarCalculos(habitacion);

  reserva.fechas = {
    checkIn,
    checkOut,
    noches,
  };

  reserva.pago = {
    metodo,
    montoTotal: resultado.montoTotal,
    montoPagado: abonoValor,
    saldoPendiente: resultado.saldo,
    moneda: "USD",
  };

  reserva.serviciosAdicionales = resultado.servicios;
  reserva.notas = notas.value;

  localStorage.setItem("reservas", JSON.stringify(reservas));

  Swal.fire("Actualizada", "Reserva modificada correctamente", "success");

  modalReserva.hide();
  renderReservas(document.querySelector(".btn.active").dataset.estado);
}
