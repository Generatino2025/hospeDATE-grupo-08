import { servicios as serviciosBase } from "../assets/data/data.js";
import { httpGet } from "./servicios/httpGet.js";

// Inicializa LocalStorage
export function inicializarServiciosLS() {
  const serviciosLS = localStorage.getItem("servicios");
  if (!serviciosLS) {
    localStorage.setItem("servicios", JSON.stringify(serviciosBase));
  }
}

// Obtener servicios (backend)
export async function obtenerServicios() {
  try {
    const response = await httpGet("/servicios", false);
    return response;
  } catch (error) {
    console.log("Error obteniendo servicios", error);
    return JSON.parse(localStorage.getItem("servicios")) || [];
  }
}

// Guardar servicios
export function guardarServicios(servicios) {
  localStorage.setItem("servicios", JSON.stringify(servicios));
}

// Generar ID
function generarId(servicios) {
  return "S" + (servicios.length + 1);
}
