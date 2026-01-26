import { httpGet } from "./servicios/httpGet.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

let usuarios = [];
let reservas = [];
let habitaciones = [];
let chart = null;

document.addEventListener("DOMContentLoaded", initAdminPanel);

async function initAdminPanel() {
  try {
    await cargarDatos();
    renderEstadisticas();
    renderGrafico();
  } catch {
    Swal.fire("Error", "No se pudo cargar el panel", "error");
  }
}

async function cargarDatos() {
  [usuarios, reservas, habitaciones] = await Promise.all([
    httpGet("auth", true),
    httpGet("reservas", true),
    httpGet("habitaciones", true),
  ]);
}

function renderEstadisticas() {
  const ocupadasIds = reservas.map(r => r.idHabitacion);
  const ocupadas = habitaciones.filter(h => ocupadasIds.includes(h.id));
  const disponibles = habitaciones.length - ocupadas.length;

  totalHabitaciones.textContent = habitaciones.length;
  reservasActivas.textContent = reservas.length;
  totalUsuarios.textContent = usuarios.length;

  repHabitaciones.textContent = habitaciones.length;
  repReservas.textContent = reservas.length;
  repUsuarios.textContent = usuarios.length;
  repDisponibles.textContent = disponibles;
  repOcupadas.textContent = ocupadas.length;

  window.__reporte = { disponibles, ocupadas: ocupadas.length };
}

function renderGrafico() {
  const ctx = document.getElementById("graficoResumen");

  if (chart) chart.destroy(); // 🔥 evita crecimiento infinito

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Disponibles", "Ocupadas"],
      datasets: [{
        data: [window.__reporte.disponibles, window.__reporte.ocupadas],
        backgroundColor: ["#0077B6", "#C62828"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
// ===============================
// DESCARGAR PDF
// ===============================
document.getElementById("btnPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte General del Sistema", 20, 20);

  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);

  doc.text(`Total Habitaciones: ${habitaciones.length}`, 20, 45);
  doc.text(`Reservas Activas: ${reservas.length}`, 20, 55);
  doc.text(`Usuarios Registrados: ${usuarios.length}`, 20, 65);
  doc.text(`Habitaciones Disponibles: ${window.__reporte.disponibles}`, 20, 75);
  doc.text(`Habitaciones Ocupadas: ${window.__reporte.ocupadas}`, 20, 85);

  doc.save("reporte_admin_hospedate.pdf");
});

// ===============================
// DESCARGAR CSV
// ===============================
document.getElementById("btnCSV").addEventListener("click", () => {
  const filas = [
    ["Métrica", "Valor"],
    ["Total Habitaciones", habitaciones.length],
    ["Reservas Activas", reservas.length],
    ["Usuarios Registrados", usuarios.length],
    ["Habitaciones Disponibles", window.__reporte.disponibles],
    ["Habitaciones Ocupadas", window.__reporte.ocupadas],
  ];

  const csv = filas.map(f => f.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_admin_hospedate.csv";
  link.click();

  URL.revokeObjectURL(url);
});



