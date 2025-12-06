import { inicializarLocalStorage, obtenerHabitaciones } from "./crearhabitacion.js";

inicializarLocalStorage();

export const user = {
  nombre: 'María',
  apellido: 'Pérez',
  tipoDocumento: 'CC',
  numeroDocumento: '12345678',
  telefono: '3001234567',
  email: 'maria@example.com',
  direccion: 'Bogotá'
}

export let reservas = JSON.parse(localStorage.getItem('reservas')) || []

const modalReservaElement = document.getElementById('modalReserva')

window.reservar = reservar

  const habitaciones = obtenerHabitaciones();

function reservar (idHabitacion) {
  const habitacion = habitaciones.find(h => h.id === idHabitacion)
console.log("ingrese")
  // Pintar habitación
  document.getElementById('habNumero').value = habitacion.numero
  document.getElementById('habTipo').value = habitacion.tipo
  document.getElementById('habPrecio').value = habitacion.precio

  // Pintar cálculos base
  document.getElementById('precioPorNoche').value = `USD ${habitacion.precio}`

  // Reset campos
  // document.getElementById('cantidadNoches').value = ''
  document.getElementById('montoTotal').value = ''
  document.getElementById('saldoPendiente').value = ''

  // Pintar usuario
  document.getElementById('userNombre').value = user.nombre
  document.getElementById('userApellido').value = user.apellido
  document.getElementById('userTipoDoc').value = user.tipoDocumento
  document.getElementById('userNumDoc').value = user.numeroDocumento
  document.getElementById('userTel').value = user.telefono

  // Eventos de recálculo
  document.getElementById('checkIn').onchange = () =>
    actualizarCalculos(habitacion)
  document.getElementById('checkOut').onchange = () =>
    actualizarCalculos(habitacion)
  document.getElementById('abono').oninput = () =>
    actualizarCalculos(habitacion)

  // Mostrar modal
  modalReserva.show()

  // Asignar el evento confirmar (se reemplaza cada vez)
  const confirmarBtn = document.getElementById('btnConfirmarReserva')
  confirmarBtn.onclick = () => crearReserva(habitacion)
}

function crearReserva (habitacion) {
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const metodo = document.getElementById('metodoPago').value
  const abono = Number(document.getElementById('abono').value)

  if (!checkIn || !checkOut) {
    Swal.fire(
      'Error',
      'Debe seleccionar las fechas de Check-In y Check-Out.',
      'error'
    )
    return
  }
  const fecha1 = new Date(checkIn)
  const fecha2 = new Date(checkOut)
  const noches = (fecha2 - fecha1) / (1000 * 60 * 60 * 24)

  const montoTotal = noches * habitacion.precio
  const saldoPendiente = montoTotal - abono

  if (noches <= 0) {
    Swal.fire(
      'Error',
      'La fecha de Check-Out debe ser mayor a la de Check-In.',
      'error'
    )
    return
  }

  if (abono < 0) {
    Swal.fire('Error', 'El monto abonado no puede ser negativo.', 'error')
    return
  } else {
    if (abono > montoTotal) {
      Swal.fire('Error', 'El abono no puede ser mayor al monto total.', 'error')
      return
    }
  }

  const nuevaReserva = {
    idReserva: `R-${String(reservas.length + 1).padStart(4, '0')}`,
    huesped: { ...user },
    habitacion: {
      idHabitacion: habitacion.id,
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      capacidad: habitacion.capacidad,
      precioPorNoche: habitacion.precio
    },
    fechas: {
      checkIn,
      checkOut,
      noches
    },
    pago: {
      metodo,
      montoTotal,
      montoPagado: abono,
      saldoPendiente,
      moneda: 'USD'
    },
    serviciosAdicionales: [],
    estado: 'confirmada',
    notas: ''
  }

  reservas.push(nuevaReserva)

  // Guardar en localStorage
  localStorage.setItem('reservas', JSON.stringify(reservas))

  console.log('Reserva creada:', nuevaReserva)
  console.log('Reservas actuales:', reservas)

  Swal.fire({
    title: 'Reserva Confirmada',
    text: `La reserva ${nuevaReserva.idReserva} fue creada con éxito.`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  }).then(() => {
    modalReserva.hide()
  })
}

function actualizarCalculos(habitacion) {
  const checkIn = document.getElementById('checkIn').value;
  const checkOut = document.getElementById('checkOut').value;
  const abono = Number(document.getElementById('abono').value);

  // Precio base
  const precioBase = habitacion.precio;
  document.getElementById('precioPorNoche').value = `USD ${precioBase}`;

  if (!checkIn || !checkOut) return;

  const noches = (new Date(checkOut) - new Date(checkIn)) / 86400000;
  if (noches <= 0) return;

  // Total base
  let montoTotal = noches * precioBase;

  // Servicios adicionales
  const serviciosSeleccionados = document.querySelectorAll('.serv-adicional:checked');
  let servicios = [];

  serviciosSeleccionados.forEach(serv => {
    const precio = Number(serv.dataset.precio);
    montoTotal += precio;

    servicios.push({
      idServicio: serv.dataset.id,
      nombre: serv.dataset.nombre,
      precio
    });
  });

  // Saldo
  const saldo = montoTotal - abono;

  // Pintar
  document.getElementById('cantidadNoches').value = noches;
  document.getElementById('montoTotal').value = `USD ${montoTotal}`;
  document.getElementById('saldoPendiente').value = `USD ${saldo}`;

  return { noches, montoTotal, saldo, servicios };
}
