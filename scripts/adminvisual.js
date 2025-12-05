/* --- MÓDULO DE ESTADÍSTICAS (datos de ejemplo) --- */
document.getElementById("totalHabitaciones").textContent = 0;
document.getElementById("reservasActivas").textContent = 0;
document.getElementById("totalUsuarios").textContent = 0;


/* --- SLIDER --- */
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
