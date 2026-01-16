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

//=============================  Botones de Descargas
document.getElementById("btnPDF").addEventListener("click", generarPDF);
document.getElementById("btnCSV").addEventListener("click", generarCSV);


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


//--------------Función de descargas de Información
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte General - Hospedate", 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Habitaciones: ${habitaciones.length}`, 20, 40);
    doc.text(`Reservas Activas: ${reservas.length}`, 20, 50);
    doc.text(`Usuarios Registrados: ${usuarios.length}`, 20, 60);
    doc.text(`Habitaciones Disponibles: ${habitacionesDisponibles}`, 20, 70);
    doc.text(`Habitaciones Ocupadas: ${habitacionesOcupadas.length}`, 20, 80);

    doc.text("Fecha: " + new Date().toLocaleString(), 20, 100);

    doc.save("reporte-hospedate.pdf");
}

function generarCSV() {
    const data = [
        ["Métrica", "Valor"],
        ["Total Habitaciones", habitaciones.length],
        ["Reservas Activas", reservas.length],
        ["Usuarios Registrados", usuarios.length],
        ["Habitaciones Disponibles", habitacionesDisponibles],
        ["Habitaciones Ocupadas", habitacionesOcupadas.length],
    ];

    let csvContent = data.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte-hospedate.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

