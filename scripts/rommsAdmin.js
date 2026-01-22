const contenedor = document.getElementById('contenedorHabitaciones')
const buscador = document.getElementById('buscador')

let habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || []
function render (lista) {
  
  contenedor.innerHTML = ''

  lista.forEach(h => {
    const card = document.createElement('div')
    card.className = 'col-md-4'

    card.innerHTML = `
            <div class="room-card position-relative">
                <img src="${h.imagen}" class="room-image">

                <div class="p-3">
                    <h5 class="fw-bold mb-1">Habitación ${h.numero}</h5>
                    <p class="text-muted m-0">${h.tipo.toUpperCase()} · Capacidad: ${
      h.capacidad
    }</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price-tag">$${h.precio}/noche</span>
                        
                    </div>
                </div>
            </div>
        `

    contenedor.appendChild(card)
  })

  document.querySelectorAll('.reservar').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id
      const hab = habitaciones.find(x => x.id === id)

      Swal.fire({
        icon: 'information',
        title: `Habitación Dispponible ${hab.numero}!`,
        text: `${hab.tipo.toUpperCase()} por $${hab.precio}/noche`,
        showCancelButton: true
      })
    })
  })
}

// Mostrar todas las habitaciones al ingresar
render(habitaciones)

// Filtro buscador
buscador.addEventListener('input', () => {
  const q = buscador.value.toLowerCase().trim()

  const filtradas = habitaciones.filter(
    h =>
      h.numero.includes(q) ||
      h.tipo.toLowerCase().includes(q) ||
      String(h.capacidad).includes(q)
  )

  render(filtradas)
})



