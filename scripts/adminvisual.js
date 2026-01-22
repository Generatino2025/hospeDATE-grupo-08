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




