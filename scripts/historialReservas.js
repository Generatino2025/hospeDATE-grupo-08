
import {
  actualizarCalculos,
  validarFormularioReserva,
} from "./reservarParaUsuario.js";
import { listarReservas } from "./utils/HttpsParaReservas.js";
import { limpiarTodosErrores } from "./utils/validacionesErrores.js";

let reservas = [];
let respuesta = []
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

// export function separarReservas(reservasUsuario) {
//   return {
//     activas: reservasUsuario.filter(
//       (r) => r.estado === "ACTIVA" && r.fechas.checkOut >= hoy
//     ),
//     pasadas: reservasUsuario.filter(
//       (r) => r.estado === "ACTIVA" && r.fechas.checkOut < hoy
//     ),
//     canceladas: reservasUsuario.filter((r) => r.estado === "CANCELADA"),
//   };
// }

 
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

  await putReserva(reserva.idReserva, payloadReserva);

  await putServiciosReserva(reserva.idReserva, { idsServicios });

  if (reserva.pago) {
    await putPago(reserva.pago.idPago, {
      montoPagado: Number(abono.value),
      metodo: metodoPago.value
    });
  }

  Swal.fire("Actualizada", "Reserva modificada correctamente", "success");

  modalReserva.hide();
  await cargarReservas();
}


///--------------------------------------------------------///
//let reservaEnEdicion = null;

// function filtrarReservasPorFecha(desde, hasta) {
//   return reservas.filter((r) =>
//     rangoSeCruza(r.fechas.checkIn, r.fechas.checkOut, desde, hasta)
//   );
// }




//const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
//const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

const listaReservas = document.getElementById("listaReservas");
const sinReservas = document.getElementById("sinReservas");
const filtros = document.getElementById("filtrosEstado");

// ----------------------------
// SOLO RESERVAS DEL USUARIO
// ----------------------------
// const reservasUsuario = reservas.filter(
//   (r) => r?.huesped?.numeroDoc === usuarioActual?.numeroDoc
// );

// ----------------------------
// OBTENER IMAGEN HABITACIÓN
// ----------------------------
// function obtenerImagenHabitacion(idHabitacion) {
//   const hab = habitaciones.find((h) => h.id === idHabitacion);
//   return hab?.imagen || "https://via.placeholder.com/150";
// }

// ----------------------------
// RENDER
// ----------------------------
export function renderReservas(reservasUsuario, estado = "TODAS") {
  listaReservas.innerHTML = "";
  sinReservas.classList.add("d-none");
console.log(reservasUsuario)
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
                ${reserva.fechaReserva.checkIn} → ${reserva.fechaReserva.checkOut}
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
  metodoPago.value = reserva.pago?.metodo || "";
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


// INIT
// renderReservas();

// function cargarReservaEnModal(reserva) {
//   reservaEnEdicion = reserva;

//   const habitacion = habitaciones.find(
//     (h) => h.id === reserva.habitacion.idHabitacion
//   );

//   // HABITACION
//   habNumero.value = habitacion.numero;
//   habTipo.value = habitacion.tipo;
//   habPrecio.value = habitacion.precio;

//   // USER
//   userNombre.value = reserva.huesped.nombre;
//   userApellido.value = reserva.huesped.apellido;
//   userTipoDoc.value = reserva.huesped.tipoDoc;
//   userNumDoc.value = reserva.huesped.numeroDoc;
//   userTel.value = reserva.huesped.telefono;

//   // FECHAS
//   checkIn.value = reserva.fechas.checkIn;
//   checkOut.value = reserva.fechas.checkOut;

//   // PAGO
//   metodoPago.value = reserva.pago.metodo;
//   abono.value = reserva.pago.montoPagado;

//   // NOTAS
//   notas.value = reserva.notas || "";

//   // SERVICIOS
//   document.querySelectorAll(".serv-adicional").forEach((cb) => {
//     cb.checked = reserva.serviciosAdicionales?.some(
//       (s) => s.idServicio === cb.dataset.id
//     );
//   });

//   // CALCULAR
//   actualizarCalculos(habitacion);

//   // BOTÓN
//   btnConfirmarReserva.textContent = "Actualizar Reserva";
//   btnConfirmarReserva.onclick = () => actualizarReserva(reserva, habitacion);

//   modalReserva.show();
// }

// function actualizarReserva(reserva, habitacion) {
//   limpiarTodosErrores();

//   const checkInVal = checkIn.value;
//   const checkOutVal = checkOut.value;

//   const abonoValor = Number(abono.value);
//   const metodo = metodoPago.value;

//   if (!validarFormularioReserva(habitacion)) return;

//   const noches = (new Date(checkOutVal) - new Date(checkInVal)) / 86400000;

//   const resultado = actualizarCalculos(habitacion);

//   reserva.fechas = {
//     checkIn,
//     checkOut,
//     noches,
//   };

//   reserva.pago = {
//     metodo,
//     montoTotal: resultado.montoTotal,
//     montoPagado: abonoValor,
//     saldoPendiente: resultado.saldo,
//     moneda: "USD",
//   };

//   reserva.serviciosAdicionales = resultado.servicios;
//   reserva.notas = notas.value;

//   localStorage.setItem("reservas", JSON.stringify(reservas));

//   Swal.fire("Actualizada", "Reserva modificada correctamente", "success");

//   modalReserva.hide();
//   renderReservas(document.querySelector(".btn.active").dataset.estado);
// }
