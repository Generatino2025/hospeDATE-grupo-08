import { habitaciones as habitacionesBase } from "../assets/data/data.js";
import { httpGet } from "./servicios/httpGet.js";

const HAB_KEY = "habitaciones";

export function inicializarLocalStorage() {
  if (!localStorage.getItem(HAB_KEY)) {
    localStorage.setItem(HAB_KEY, JSON.stringify(habitacionesBase));
  }
}

export async function obtenerHabitaciones() {
  try {
    const data = await httpGet("/habitaciones", false);

    if (Array.isArray(data)) {
      localStorage.setItem(HAB_KEY, JSON.stringify(data));
      return data;
    }

    throw new Error("Respuesta inválida del backend");
  } catch (error) {
    console.warn("Backend no disponible, usando LocalStorage");
    return JSON.parse(localStorage.getItem(HAB_KEY)) || [];
  }
}

export async function guardarHabitacion(nuevaHabitacion) {
  const habitaciones = await obtenerHabitaciones();
  habitaciones.push(nuevaHabitacion);
  localStorage.setItem(HAB_KEY, JSON.stringify(habitaciones));
}

export async function generarId() {
  const habitaciones = await obtenerHabitaciones();
  return "H" + (habitaciones.length + 1);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // validaciones

  const nuevaHabitacion = {
    id: await generarId(),
    numero: nombre,
    tipo,
    capacidad: 2,
    precio,
    descripcion,
    imagen: urlImagen,
    disponible: true,
  };

  await guardarHabitacion(nuevaHabitacion);

  Swal.fire({
    icon: "success",
    title: "Habitación creada",
    text: "Se ha agregado correctamente.",
  });

  form.reset();
});

