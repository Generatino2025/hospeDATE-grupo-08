import { httpGet } from "./servicios/httpGet.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

// ===============================
// VARIABLES GLOBALES
// ===============================
let usuarios = [];
let reservas = [];
let habitaciones = [];

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", initAdminPanel);

async function initAdminPanel() {
  try {
    await cargarDatos();
    renderEstadisticas();
    renderGrafico();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los datos del panel",
    });
  }
}

// ===============================
// CARGAR DATOS DESDE BACKEND
// ===============================
async function cargarDatos() {
  try {
    [usuarios, reservas, habitaciones] = await Promise.all([
      httpGet("/auth", true),          //  Usuarios desde /auth
      httpGet("/reservas", true),      //  Reservas
      httpGet("/habitaciones", true),  // Habitaciones
    ]);
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo conectar con el backend",
    });
    // Para no romper el resto del código, inicializamos arrays vacíos
    usuarios = [];
    reservas = [];
    habitaciones = [];
  }
}

// ===============================
// ESTADÍSTICAS
// ===============================
function renderEstadisticas() {
  try {
    const ocupadasIds = reservas.map(r => r.idHabitacion);
    const habitacionesOcupadas = habitaciones.filter(h =>
      ocupadasIds.includes(h.id)
    );

    const disponibles = habitaciones.length - habitacionesOcupadas.length;

    // Cards superiores
    document.getElementById("totalHabitaciones").textContent = habitaciones.length;
    document.getElementById("reservasActivas").textContent = reservas.length;
    document.getElementById("totalUsuarios").textContent = usuarios.length;

    // Reporte
    document.getElementById("repHabitaciones").textContent = habitaciones.length;
    document.getElementById("repReservas").textContent = reservas.length;
    document.getElementById("repUsuarios").textContent = usuarios.length;
    document.getElementById("repDisponibles").textContent = disponibles;
    document.getElementById("repOcupadas").textContent = habitacionesOcupadas.length;

    // Guardar para PDF / CSV
    window.__reporte = {
      disponibles,
      ocupadas: habitacionesOcupadas.length,
    };
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron calcular las estadísticas",
    });
  }
}

// ===============================
// GRÁFICO
// ===============================
function renderGrafico() {
  try {
    const ctx = document.getElementById("graficoHabitaciones");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Disponibles", "Ocupadas"],
        datasets: [
          {
            data: [window.__reporte.disponibles, window.__reporte.ocupadas],
            backgroundColor: ["#28a745", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo renderizar el gráfico",
    });
  }
}

// ===============================
// DESCARGAS PDF / CSV
// ===============================
document.getElementById("btnPDF").addEventListener("click", generarPDF);
document.getElementById("btnCSV").addEventListener("click", generarCSV);

function generarPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte General - Hospedate", 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Habitaciones: ${habitaciones.length}`, 20, 40);
    doc.text(`Reservas Activas: ${reservas.length}`, 20, 50);
    doc.text(`Usuarios Registrados: ${usuarios.length}`, 20, 60);
    doc.text(`Habitaciones Disponibles: ${window.__reporte.disponibles}`, 20, 70);
    doc.text(`Habitaciones Ocupadas: ${window.__reporte.ocupadas}`, 20, 80);
    doc.text("Fecha: " + new Date().toLocaleString(), 20, 100);

    doc.save("reporte-hospedate.pdf");

    Swal.fire({
      icon: "success",
      title: "PDF generado",
      text: "El reporte se descargó correctamente",
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo generar el PDF",
    });
  }
}

function generarCSV() {
  try {
    const data = [
      ["Métrica", "Valor"],
      ["Total Habitaciones", habitaciones.length],
      ["Reservas Activas", reservas.length],
      ["Usuarios Registrados", usuarios.length],
      ["Habitaciones Disponibles", window.__reporte.disponibles],
      ["Habitaciones Ocupadas", window.__reporte.ocupadas],
    ];

    const csv = data.map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "reporte-hospedate.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "CSV generado",
      text: "El reporte se descargó correctamente",
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo generar el CSV",
    });
  }
}



