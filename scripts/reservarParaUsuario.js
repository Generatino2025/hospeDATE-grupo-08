
import { listarServicios, obtenerHabitaciones, postPago, postReserva, putServiciosReservas } from './utils/HttpsParaReservas.js'
import {
  limpiarError,
  limpiarTodosErrores,
  mostrarError
} from './utils/validacionesErrores.js'

let montoTotal
let servicios = []
let modalReserva = null

// Me traigo lo del local y session storage
export const user = JSON.parse(localStorage.getItem('user'))


document.addEventListener('DOMContentLoaded', () => {
  const modalReservaElement = document.getElementById('modalReserva')

  if (!modalReservaElement) {
    console.error('No existe #modalReserva en el DOM')
    return
  }

  modalReserva = new bootstrap.Modal(modalReservaElement, {
    backdrop: 'static',
    keyboard: false
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
})

//-------------Funcion para reservar----------------------//
export async function reservar (idHabitacion) {
  resetModalReserva();

  //-------------Lo cargo desde el backe----------//
  const habitaciones = await obtenerHabitaciones()
  const serviciosBackend = await listarServicios()
  pintarServicios(serviciosBackend)

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
  document.getElementById('userTipoDoc').value = user.tipo_doc
  document.getElementById('userNumDoc').value = user.numero_doc
  document.getElementById('userTel').value = user.telefono

  // Eventos de recálculo
  document.getElementById('checkIn').onchange = () =>
    actualizarCalculos(habitacion)
  document.getElementById('checkOut').onchange = () =>
    actualizarCalculos(habitacion)
  document.getElementById('abono').oninput = () =>
    actualizarCalculos(habitacion)

  if (!modalReserva) {
  console.error('Modal no inicializado aún')
  return
}

  // Mostrar modal
  modalReserva.show()

  // Asignar el evento confirmar (se reemplaza cada vez)
  const confirmarBtn = document.getElementById('btnConfirmarReserva')
  confirmarBtn.onclick = () => crearReserva(habitacion)
}

//-------------Funcion para  CREAR la reservar----------------------//
async function crearReserva (habitacion) {

  const serviciosSeleccionados = document.querySelectorAll('.serv-adicional:checked')

  const idsServicios = [...serviciosSeleccionados].map(s =>
    Number(s.dataset.id)
  )

  const checkIn = document.getElementById('checkIn').value
  const checkOut = document.getElementById('checkOut').value
  const abono = Number(document.getElementById('abono').value)

  if (!validarFormularioReserva(habitacion)) return

  const metodo = document.getElementById('metodoPago').value

  const fecha1 = new Date(checkIn)
  const fecha2 = new Date(checkOut)
  const noches = (fecha2 - fecha1) / 86400000

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

 if (!validarFormularioReserva(habitacion)) return

 const payloadReserva = {
  idUsuario: user.idUsuario,
  idHabitacion: habitacion.idHabitacion,
  estado: 'ACTIVA',
  notas: document.getElementById('notas').value || '',
  checkIn: new Date(checkIn).toISOString(),
  checkOut: new Date(checkOut).toISOString()
}

const payloadServicios = {
  idsServicios
}
const payloadPago = {
  idReserva: null, // luego lo seteas
  montoPagado: abono,
  metodo: metodo.toUpperCase()
}

  try {
    //  Crear reserva
    const reservaCreada = await postReserva(payloadReserva)
    
    const idReserva = reservaCreada.idReserva

    // 2️⃣ Asociar servicios
    if (idsServicios.length > 0) {
      await putServiciosReservas(idReserva, {
        idsServicios
      })
    }

    await postPago({
      idReserva,
      montoPagado: abono,
      metodo: metodo.toUpperCase()
    }, idReserva)
  
    
    Swal.fire({
      title: 'Reserva Confirmada',
      icon: 'success',
      text: `Reserva #${idReserva} fue creada con éxito.`,
      timer: 2000
    })

   } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo crear la reserva', 'error')
  }
   modalReserva.hide()
 
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

  const noches = Math.ceil(
  (new Date(checkOut) - new Date(checkIn)) / 86400000
);

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

  const noches = Math.ceil(
  (new Date(checkOut) - new Date(checkIn)) / 86400000
);


  if (noches <= 0) return false

  montoTotal = noches * habitacion.precioPorNoche

  if (!validarAbono(abono)) return false

  return true
}

function pintarServicios(servicios) {
  const container = document.getElementById('serviciosContainer')
  if (!container) return

  container.innerHTML = ''

  servicios.forEach(servicio => {
    const html = `
      <div class="col-md-6">
        <div class="form-check">
          <input
            class="form-check-input serv-adicional"
            type="checkbox"
            data-id="${servicio.idServicio}"
            data-precio="${servicio.precio}"
            data-nombre="${servicio.nombre}"
          />
          <label class="form-check-label">
            ${servicio.nombre} (USD ${servicio.precio})
          </label>
        </div>
      </div>
    `
    container.insertAdjacentHTML('beforeend', html)
  })
}


function resetModalReserva() {
  limpiarTodosErrores();

  document.getElementById('checkIn').value = '';
  document.getElementById('checkOut').value = '';
  document.getElementById('abono').value = '';
  document.getElementById('metodoPago').value = '';
  document.getElementById('notas').value = '';

  document.getElementById('cantidadNoches').value = '';
  document.getElementById('montoTotal').value = '';
  document.getElementById('saldoPendiente').value = '';

  servicios = [];
  montoTotal = 0;

  document.querySelectorAll('.serv-adicional').forEach(cb => {
    cb.checked = false;
  });
}

