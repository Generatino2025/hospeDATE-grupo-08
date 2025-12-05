const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

document.getElementById("totalHabitaciones").textContent = habitaciones.length;
document.getElementById("reservasActivas").textContent = reservas.length;
document.getElementById("totalUsuarios").textContent = usuarios.length;

const track = document.getElementById("slideTrack");
track.innerHTML = "";

reservas.forEach(reserva => {
    const habitacion = habitaciones.find(h => h.id === reserva.idHabitacion);

    if (habitacion) {
        const slide = document.createElement("div");
        slide.classList.add("slide");

        slide.innerHTML = `
            <img src="${habitacion.imagen}" alt="Imagen habitación">
            <h3>${habitacion.nombre || "Habitación"}</h3>
            <p>ID Habitación: ${habitacion.id}</p>
            <button class="ingresar-btn" data-id="${habitacion.id}">
                Ingresar
            </button>
        `;

        track.appendChild(slide);
    }
});

const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");

let position = 0;
const SLIDE_WIDTH = 300;

next.addEventListener("click", () => {
    position -= SLIDE_WIDTH;
    track.style.transform = `translateX(${position}px)`;
});

prev.addEventListener("click", () => {
    position += SLIDE_WIDTH;
    track.style.transform = `translateX(${position}px)`;
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("ingresar-btn")) {
        const idHabitacion = e.target.getAttribute("data-id");
        window.location.href = `sede.html?id=${idHabitacion}`;
    }
});
