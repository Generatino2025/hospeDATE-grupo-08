import { pintarHabitacionesDisponibles } from "./mostrarHabitaciones.js";
import "../scripts/reservar.js"


document.addEventListener('DOMContentLoaded', function () {
    console.log("entre a main")
    pintarHabitacionesDisponibles();
})

document.getElementById("btnBuscar").addEventListener("click", () => {
    const destino = document.getElementById("buscarDestino").value;
    const entrada = document.getElementById("checkIn").value;
    const salida = document.getElementById("checkOut").value;

    if (!destino || !entrada || !salida) {
        Swal.fire({
            icon: 'warning',
            title: '¡Campos incompletos!',
            text: 'Por favor completa todos los campos.',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Buscando hospedaje',
        text: `Buscando hospedajes en ${destino} del ${entrada} al ${salida}`,
        confirmButtonText: 'Ir a Reservas',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = './pages/reservas.html';
        }
    });
});

const track = document.getElementById("slideTrack");
const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");

let position = 0;
const slideWidth = 200;

next.addEventListener("click", () => {
    position -= slideWidth;

    if (Math.abs(position) >= track.scrollWidth - (slideWidth * 2)) {
        position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
});

prev.addEventListener("click", () => {
    position += slideWidth;

    if (position > 0) {
        position = -(track.scrollWidth - slideWidth * 2);
    }

    track.style.transform = `translateX(${position}px)`;
});

