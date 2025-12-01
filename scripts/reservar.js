import { habitaciones } from "../assets/data/data.js";


export const user = {
  nombre: "María",
  apellido: "Pérez",
  tipoDocumento: "CC",
  numeroDocumento: "12345678",
  telefono: "3001234567",
  email: "maria@example.com",
  direccion: "Bogotá",
};

export let reservas = [];

// Exponer la función para usar desde onclick
window.reservar = reservar;

function reservar(idHabitacion) {
  const habitacion = habitaciones.find(h => h.id === idHabitacion);

  // Pintar habitación
  document.getElementById("habNumero").value = habitacion.numero;
  document.getElementById("habTipo").value = habitacion.tipo;
  document.getElementById("habPrecio").value = habitacion.precio;

  // Pintar usuario
  document.getElementById("userNombre").value = user.nombre;
  document.getElementById("userApellido").value = user.apellido;
  document.getElementById("userTipoDoc").value = user.tipoDocumento;
  document.getElementById("userNumDoc").value = user.numeroDocumento;
  document.getElementById("userTel").value = user.telefono;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalReserva"));
  modal.show();

  // Escuchar click del botón confirmar
  document.getElementById("btnConfirmarReserva").onclick = () => {
    crearReserva(habitacion, modal);
  };
}

function crearReserva(habitacion, modal) {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const metodo = document.getElementById("metodoPago").value;
  const abono = Number(document.getElementById("abono").value);

  const fecha1 = new Date(checkIn);
  const fecha2 = new Date(checkOut);
  const noches = (fecha2 - fecha1) / (1000 * 60 * 60 * 24);

  const montoTotal = noches * habitacion.precio;
  const saldoPendiente = montoTotal - abono;

  const nuevaReserva = {
    idReserva: `R-${String(reservas.length + 1).padStart(4, "0")}`,
    huesped: { ...user },
    habitacion: {
      idHabitacion: habitacion.id,
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      capacidad: habitacion.capacidad,
      precioPorNoche: habitacion.precio,
    },
    fechas: {
      checkIn,
      checkOut,
      noches,
    },
    pago: {
      metodo,
      montoTotal,
      montoPagado: abono,
      saldoPendiente,
      moneda: "USD",
    },
    serviciosAdicionales: [],
    estado: "confirmada",
    notas: "",
  };

  reservas.push(nuevaReserva);

  console.log("Reserva creada:", nuevaReserva);
  console.log("Reservas actuales:", reservas);

  Swal.fire({
    title: 'Reserva Confirmada',
    text: `La reserva ${nuevaReserva.idReserva} fue creada con éxito.`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  }).then(() => {
    modal.hide();
  });
}

window.reservar = reservar;
