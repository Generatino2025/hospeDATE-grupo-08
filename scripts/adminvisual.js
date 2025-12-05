// Cargar datos del localStorage
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

// Mostrar estadísticas
document.getElementById("totalHabitaciones").textContent = habitaciones.length;
document.getElementById("reservasActivas").textContent = reservas.length;
document.getElementById("totalUsuarios").textContent = usuarios.length;

// Slider
const track = document.getElementById("slideTrack");
const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");

let position = 0;

next.addEventListener("click", () => {
    position -= 300;
    track.style.transform = `translateX(${position}px)`;
});

prev.addEventListener("click", () => {
    position += 300;
    track.style.transform = `translateX(${position}px)`;
});

// --- Reemplazar imágenes del slider según reservas ---
function actualizarSliderConImagenes() {

    // Obtiene todas las tarjetas del slider
    const slides = document.querySelectorAll(".slide");

    reservas.forEach((reserva, index) => {

        // Cada reserva tiene un idHabitacion
        let habitacion = habitaciones.find(h => h.id === reserva.idHabitacion);

        if (habitacion && slides[index]) {
            slides[index].querySelector("img").src = habitacion.urlImagen;
            slides[index].querySelector("h3").textContent = `Habitación ${habitacion.numero}`;
            slides[index].querySelector("p").textContent = habitacion.descripcion || "Habitación registrada";
        }
    });
}

actualizarSliderConImagenes();
