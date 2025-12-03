import { habitaciones as habitacionesBase } from "../assets/data/data.js";

export function inicializarLocalStorage() {
  const habitacionesLS = localStorage.getItem("habitaciones");
  if (!habitacionesLS) {
    localStorage.setItem("habitaciones", JSON.stringify(habitacionesBase));
  }
}

export function obtenerHabitaciones() {
  return JSON.parse(localStorage.getItem("habitaciones")) || [];
}

export function guardarHabitaciones(habitaciones) {
  localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
}

function generarId() {
  const habitaciones = obtenerHabitaciones();
  return "H" + (habitaciones.length + 1);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar localStorage si es necesario
  inicializarLocalStorage();

  // Referencias a elementos (ya existen en DOM)
  const form = document.getElementById("formHabitacion");
  const inputImagen = document.getElementById("imagen");
  const preview = document.getElementById("preview");

  if (!form) {
    return;
  }

  // Vista previa de imagen por URL (se ejecuta al tipear la URL)
  if (inputImagen && preview) {
    inputImagen.addEventListener("input", function () {
      const url = this.value.trim();
      const regex = /\.(jpg|jpeg|png)$/i;

      if (regex.test(url)) {
        preview.src = url;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim() || "";
    const tipo = document.getElementById("tipo")?.value || "";
    const descripcion =
      document.getElementById("descripcion")?.value.trim() || "";
    const precioRaw = document.getElementById("precio")?.value.trim() || "";
    const urlImagen = document.getElementById("imagen")?.value.trim() || "";

    const regex = /\.(jpg|jpeg|png)$/i;

    if (!nombre || !tipo || !descripcion || !precioRaw || !urlImagen) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    const precio = Number(precioRaw);
    if (!Number.isFinite(precio) || precio <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Precio inválido",
        text: "Ingresa un precio numérico mayor a 0.",
      });
      return;
    }

    if (!regex.test(urlImagen)) {
      Swal.fire({
        icon: "error",
        title: "Imagen no válida",
        text: "La URL debe terminar en .jpg, .jpeg o .png.",
      });
      return;
    }

    const nuevaHabitacion = {
      id: generarId(),
      numero: nombre,
      tipo,
      capacidad: 2,
      precio,
      descripcion,
      imagen: urlImagen,
      disponible: true,
    };

    const habitaciones = obtenerHabitaciones();
    habitaciones.push(nuevaHabitacion);
    guardarHabitaciones(habitaciones);

    Swal.fire({
      icon: "success",
      title: "Habitación creada",
      text: "Se ha agregado correctamente.",
    });

    form.reset();
    if (preview) preview.style.display = "none";
  });
});
