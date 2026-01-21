import { habitaciones as habitacionesBase } from "../assets/data/data.js";
import { httpGet } from "./servicios/httpGet.js";

export function inicializarLocalStorage() {
  const habitacionesLS = localStorage.getItem("habitaciones");
  if (!habitacionesLS) {
    localStorage.setItem("habitaciones", JSON.stringify(habitacionesBase));
  }
}

export async  function obtenerHabitaciones() {
  // llamar del backend /habitaciones
  try {
    const response = await httpGet("habitaciones", false);
    console.log(response)
    return response
  } catch (error) {
    console.log("errorcito", error);
  }
}

export function guardarHabitaciones(habitaciones) {
  localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
}

function generarId() {
  const habitaciones = obtenerHabitaciones();
  return "H" + (habitaciones.length + 1);
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarLocalStorage();

  const form = document.getElementById("formHabitacion");
  const inputImagen = document.getElementById("imagen");
  const preview = document.getElementById("preview");

  if (!form) return;

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

    const regex = /\.(jpg|jpeg|png)$/i;
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
