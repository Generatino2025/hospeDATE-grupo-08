// =========================
// Cargar datos del localStorage
// =========================
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

// =========================
// Mostrar estadísticas principales
// =========================
document.getElementById("totalHabitaciones").textContent = habitaciones.length;
document.getElementById("reservasActivas").textContent = reservas.length;
document.getElementById("totalUsuarios").textContent = usuarios.length;

// =========================
// Cálculo de habitaciones disponibles y ocupadas
// =========================

// habitaciones ocupadas = habitaciones que aparecen en reservas
let ocupadas = reservas.map(r => r.idHabitacion);
let habitacionesOcupadas = habitaciones.filter(h => ocupadas.includes(h.id));
let habitacionesDisponibles = habitaciones.length - habitacionesOcupadas.length;

// Mostrar valores en el reporte
document.getElementById("repHabitaciones").textContent = habitaciones.length;
document.getElementById("repReservas").textContent = reservas.length;
document.getElementById("repUsuarios").textContent = usuarios.length;

document.getElementById("repDisponibles").textContent = habitacionesDisponibles;
document.getElementById("repOcupadas").textContent = habitacionesOcupadas.length;

// =========================
// GRAFICO (Chart.js)
// =========================

const ctx = document.getElementById("graficoHabitaciones");

new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Disponibles", "Ocupadas"],
        datasets: [{
            label: "Estado de Habitaciones",
            data: [habitacionesDisponibles, habitacionesOcupadas.length],
            backgroundColor: ["#28a745", "#dc3545"],
            borderWidth: 1
        }]
    }
});
