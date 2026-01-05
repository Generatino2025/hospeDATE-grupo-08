import {
  inicializarLocalStorage,
  obtenerHabitaciones
} from './crearhabitacion.js'

inicializarLocalStorage()
let montoTotal
let servicios = []
// Me traigo lo del local y session storage
export const user = JSON.parse(sessionStorage.getItem('usuarioActual'))
export let reservas = JSON.parse(localStorage.getItem('reservas')) || []
let habitacionesGuardadas = JSON.parse(localStorage.getItem('habitaciones'))

// me traigo lo del modal que voy a pintar en reserva es decir el htmlreserva
const modalReservaElement = document.getElementById('modalReserva')
const modalReserva = new bootstrap.Modal(modalReservaElement)

window.reservar = reservar

//traigo las habitaciones a pintar
const habitaciones = obtenerHabitaciones()

//-------------Funcion para reservar----------------------//
function reservar (idHabitacion) {
  const habitacion = habitaciones.find(h => h.id === idHabitacion)
  console.log('ingrese')
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
  document.getElementById('userTipoDoc').value = user.tipoDoc
  document.getElementById('userNumDoc').value = user.numeroDoc
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
  confirmarBtn.disabled = true
  confirmarBtn.title =
    'Faltan datos por llenar y debes ingresar un abono mínimo del 30% del valor total para continuar.'

  confirmarBtn.onclick = () => crearReserva(habitacion)
}

//-------------Funcion para  CREAR la reservar----------------------//
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

  montoTotal =
    noches * montoTotal + noches * servicios[0]?.precio + servicios[1]?.precio
  const saldoPendiente = montoTotal - abono

  if (noches <= 0) {
    Swal.fire(
      'Error',
      'La fecha de Salida debe ser mayor a la de Ingreso.',
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
    // Actualizar la disponibilidad a false
    habitacionesGuardadas = habitacionesGuardadas.map(h => {
      if (h.id === habitacion.id) {
        return { ...h, disponible: false }
      }
      return h
    })

    localStorage.setItem('habitaciones', JSON.stringify(habitacionesGuardadas))

    modalReserva.hide()
    window.location.reload()
  })
}

//-------------Funcion para Actualizar los MOntos a PAGAR---------------------//
function actualizarCalculos (habitacion) {
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const abono = Number(document.getElementById('abono').value)

  // Precio base
  const precioBase = habitacion.precio
  document.getElementById('precioPorNoche').value = `USD ${precioBase}`

  if (!checkIn || !checkOut) return

  const noches = (new Date(checkOut) - new Date(checkIn)) / 86400000
  if (noches <= 0) return

  // Total base
  montoTotal = noches * precioBase

  // Servicios adicionales
  const serviciosSeleccionados = document.querySelectorAll(
    '.serv-adicional:checked'
  )

  serviciosSeleccionados.forEach(serv => {
    const precio = Number(serv.dataset.precio)
    montoTotal += precio

    servicios.push({
      idServicio: serv.dataset.id,
      nombre: serv.dataset.nombre,
      precio
    })
  })

  // Saldo
  const saldo = montoTotal - abono
  console.log('Lo adicional es: ', servicios, montoTotal)
  // Pintar
  document.getElementById('cantidadNoches').value = noches
  document.getElementById('montoTotal').value = `USD ${montoTotal}`
  document.getElementById('saldoPendiente').value = `USD ${saldo}`

  validarAbonoMinimo(montoTotal)
  return { noches, montoTotal, saldo, servicios }
}

function validarAbonoMinimo (montoTotal) {
  const abono = Number(document.getElementById('abono').value)
  const confirmarBtn = document.getElementById('btnConfirmarReserva')

  if (!montoTotal || abono <= 0) {
    confirmarBtn.disabled = true
    confirmarBtn.title =
      'Faltan datos por llenar y debes ingresar un abono mínimo del 30% del valor total para continuar.'
    return
  }

  const minimo = montoTotal * 0.3

  if (abono >= minimo) {
    confirmarBtn.disabled = false
    confirmarBtn.title = 'Confirmar reserva'
  } else {
    confirmarBtn.disabled = true
    confirmarBtn.title = `El abono debe ser mínimo del 30% (USD ${minimo.toFixed(
      2
    )}) para continuar.`
  }
}
