
import {
  actualizarCalculos,
  validarFormularioReserva,
} from "./reservarParaUsuario.js";
import { formatFechaUI } from "./utils/fechas.js";
import { listarReservas, putReserva, putServiciosReservas } from "./utils/HttpsParaReservas.js";
import { limpiarTodosErrores } from "./utils/validacionesErrores.js";

let reservas = [];
let respuesta = [];
let reservaEnEdicion = null;

document.addEventListener('DOMContentLoaded', function () {
  cargarReservas();
  obtenerReservasUsuario();

})

async function cargarReservas() {
  const user= JSON.parse(localStorage.getItem("user"))
  reservas = await listarReservas();
  obtenerReservasUsuario(user.idUsuario)
  
}

function obtenerReservasUsuario(id) {
    respuesta = reservas?.filter((r) => r?.usuario?.idUsuario == id);
   renderReservas(respuesta);
}


const listaReservas = document.getElementById("listaReservas");
const sinReservas = document.getElementById("sinReservas");
const filtros = document.getElementById("filtrosEstado");

// ----------------------------
// RENDER
// ----------------------------
export function renderReservas(reservasUsuario, estado = "TODAS") {
  listaReservas.innerHTML = "";
  sinReservas.classList.add("d-none");

  const filtradas =
    estado === "TODAS"
      ? reservasUsuario
      : reservasUsuario.filter((r) => r?.estado === estado);

  if (filtradas.length === 0) {
    sinReservas.classList.remove("d-none");
    return;
  }

  filtradas?.forEach((reserva) => {
      const acciones =
      (reserva.estado).toUpperCase() === "ACTIVA" ||  (reserva.estado).toUpperCase()  === "CONFIRMADA"
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
            <img src="${reserva?.habitacion.url_foto}" class="reserva-img" />
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
                ${formatFechaUI(reserva.fechaReserva.checkIn)} → ${formatFechaUI(reserva.fechaReserva.checkOut)}
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
  if (estado.toUpperCase() === "ACTIVA" || estado.toUpperCase() === "CONFIRMADA") return "badge-activa";
  if (estado.toUpperCase() === "FINALIZADA") return "badge-finalizada";
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

  renderReservas(respuesta, e.target.dataset.estado);
});

window.cancelarReserva = function (idReserva) {
    const index = reservas.find((r) => r.idReserva == idReserva);
     Swal.fire({
    title: "¿Cancelar reserva?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
  
    if (index === -1) return;

  const payloadReserva = {
    estado: "CANCELADA",
    notas: index.value,
    checkIn: index.fechaReserva.checkIn,
    checkOut: index.fechaReserva.checkOut
  };
  await putReserva(idReserva, payloadReserva,true)
  await cargarReservas();
  renderReservas(respuesta, document.querySelector(".btn.active").dataset.estado);

  });
};


// ---- los campos del modal
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

window.editarReserva = function (idReserva) {
  const reserva = respuesta?.find((r) => r.idReserva == idReserva);
  if (!reserva) return;

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

function cargarReservaEnModal(reserva) {
  console.log(reserva)
  reservaEnEdicion = reserva;

  // HAB
  habNumero.value = reserva.habitacion.numero;
  habTipo.value = reserva.habitacion.tipo;
  habPrecio.value = reserva.habitacion.precioPorNoche;

  // USER
  userNombre.value = reserva.usuario.nombre;
  userApellido.value = reserva.usuario.apellido;
  userTipoDoc.value = reserva.usuario.tipo_doc;
  userNumDoc.value = reserva.usuario.numero_doc;
  userTel.value = reserva.usuario.telefono;

  // FECHAS
  checkIn.value = reserva.fechaReserva.checkIn.split("T")[0];
  checkOut.value = reserva.fechaReserva.checkOut.split("T")[0];

  // PAGO
  metodoPago.value = reserva?.pago?.metodo || "";
  abono.value = reserva.pago?.montoPagado || 0;

  // NOTAS
  notas.value = reserva.notas || "";

  // SERVICIOS
  document.querySelectorAll(".serv-adicional").forEach(cb => {
    cb.checked = reserva.servicios.some(s => s.idServicio == cb.dataset.id);
  });

  actualizarCalculos(reserva.habitacion);

  btnConfirmarReserva.textContent = "Actualizar";
  btnConfirmarReserva.onclick = () =>
  actualizarReservaBackend(reserva);

  modalReserva.show();
}


async function actualizarReservaBackend(reserva) {
  limpiarTodosErrores();

  const idsServicios = [...document.querySelectorAll('.serv-adicional:checked')]
    .map(s => Number(s.dataset.id));

  const payloadReserva = {
    estado: reserva.estado,
    notas: notas.value,
    checkIn: new Date(checkIn.value).toISOString(),
    checkOut: new Date(checkOut.value).toISOString()
  };

  console.log(payloadReserva)
  await putReserva(reserva.idReserva, payloadReserva);

  if(idsServicios){
  await putServiciosReservas(reserva.idReserva, { idsServicios });
  }


  // if (reserva.pago) {
  //   await putPago(reserva.pago.idPago, {
  //     montoPagado: Number(abono.value),
  //     metodo: metodoPago.value
  //   });
  // }

  Swal.fire("Actualizada", "Reserva modificada correctamente", "success");

  modalReserva.hide();
  await cargarReservas();
}

