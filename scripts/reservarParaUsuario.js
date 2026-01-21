import { obtenerHabitaciones } from './crearhabitacion.js'
import { listarServicios } from './utils/HttpsParaReservas.js'
import {
  limpiarError,
  limpiarTodosErrores,
  mostrarError
} from './utils/validacionesErrores.js'

let montoTotal
let servicios = []

//-----------------------------------------------------------------//
console.log("entre a reserva User")

// Me traigo lo del local y session storage
export const user = JSON.parse(sessionStorage.getItem('usuarioActual'))
export let reservas = JSON.parse(localStorage.getItem('reservas')) || []
let habitacionesGuardadas = JSON.parse(localStorage.getItem('habitaciones'))


document.addEventListener('DOMContentLoaded', () => {
  const modalReservaElement = document.getElementById('modalReserva')
  if (!modalReservaElement) {
    console.error('No existe #modalReserva en el DOM')
    return
  }
  modalReserva = new bootstrap.Modal(modalReservaElement)
  modalReserva.show()

})


document.getElementById('checkIn').addEventListener('change', () => {
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  validarFechas(checkIn, checkOut)
})

document.getElementById('checkOut').addEventListener('change', () => {
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  validarFechas(checkIn, checkOut)
})

//-------------Funcion para reservar----------------------//
export async function reservar (idHabitacion) {
  //-------------Lo cargo desde el backe----------//
  const habitaciones = await obtenerHabitaciones()

  limpiarTodosErrores()
  const habitacion = habitaciones?.find(
    h => String(h.idHabitacion) === String(idHabitacion)
  )

  if (!habitacion) {
    console.error('Habitación no encontrada', idHabitacion, habitaciones)
    return
  }

  // Pintar habitación
  document.getElementById('habNumero').value = habitacion.numero
  document.getElementById('habTipo').value = habitacion.tipo
  document.getElementById('habPrecio').value = habitacion.precioPorNoche

  // Pintar cálculos base
  document.getElementById('precioPorNoche').value = `USD ${habitacion.precioPorNoche}`

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
  confirmarBtn.onclick = () => crearReserva(habitacion)
}

//-------------Funcion para  CREAR la reservar----------------------//
async function crearReserva (habitacion) {
  //-----------Obtener servicios  dedl backend-------------------//
  const servicios = await listarServicios()
  console.log(servicios)

  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const abono = Number(document.getElementById('abono').value)

  if (!validarFormularioReserva(habitacion)) return

  const metodo = document.getElementById('metodoPago').value

  const fecha1 = new Date(checkIn)
  const fecha2 = new Date(checkOut)
  const noches = (fecha2 - fecha1) / 86400000

  montoTotal =
    noches * montoTotal + noches * servicios[0]?.precio + servicios[1]?.precio
  const saldoPendiente = montoTotal - abono
  console.log(montoTotal, saldoPendiente)
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
      idHabitacion: habitacion.idHabitacion,
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      capacidad: habitacion.capacidad,
      precioPorNoche: habitacion.precioPorNoche
    },

    fechas: {
      checkIn,
      checkOut,
      noches
    },

    pago: {
      metodo,
      montoTotal: montoTotal,
      montoPagado: abono,
      saldoPendiente,
      moneda: 'USD'
    },

    serviciosAdicionales: [...servicios],
    estado: 'ACTIVA', // ACTIVA | FINALIZADA | CANCELADA
    notas: '',
    creadaEn: new Date().toISOString()
  }

  reservas.push(nuevaReserva)

  // Guardar en localStorage
  localStorage.setItem('reservas', JSON.stringify(reservas))

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
export function actualizarCalculos (habitacion) {
  servicios = []
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const abono = Number(document.getElementById('abono').value)

  // Precio base
  const precioBase = habitacion.precioPorNoche
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
  // Pintar
  document.getElementById('cantidadNoches').value = noches
  document.getElementById('montoTotal').value = `USD ${montoTotal}`
  document.getElementById('saldoPendiente').value = `USD ${saldo}`

  validarAbono(abono)
  return { noches, montoTotal, saldo, servicios }
}

function validarAbono (abono) {
  limpiarError('abono')

  if (abono <= 0) {
    mostrarError('abono', 'El abono debe ser mayor a 0.')
    return false
  }

  if (abono > montoTotal) {
    mostrarError('abono', 'El abono no puede ser mayor al monto total.')
    return false
  }

  const minimo = montoTotal * 0.3

  if (abono < minimo) {
    mostrarError(
      'abono',
      `Debe abonar mínimo el 30% (USD ${minimo.toFixed(2)}) para reservar.`
    )
    return false
  }

  return true
}

export function validarFechas (checkIn, checkOut) {
  let valido = true
  const hoy = new Date().toISOString().split('T')[0]

  limpiarError('checkIn')
  limpiarError('checkOut')

  if (!checkIn) {
    mostrarError('checkIn', 'Debe seleccionar la fecha de ingreso.')
    valido = false
  } else if (checkIn < hoy) {
    mostrarError('checkIn', 'No se permiten reservas en fechas pasadas.')
    valido = false
  }

  if (!checkOut) {
    mostrarError('checkOut', 'Debe seleccionar la fecha de salida.')
    valido = false
  } else if (checkOut <= checkIn) {
    mostrarError(
      'checkOut',
      'La fecha de salida debe ser mayor a la fecha de ingreso.'
    )
    valido = false
  }

  return valido
}

export function validarFormularioReserva (habitacion) {
  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const abono = Number(document.getElementById('abono').value)

  if (!validarFechas(checkIn, checkOut)) return false

  const noches = (new Date(checkOut) - new Date(checkIn)) / 86400000

  if (noches <= 0) return false

  montoTotal = noches * habitacion.precioPorNoche

  if (!validarAbono(abono)) return false

  return true
}
