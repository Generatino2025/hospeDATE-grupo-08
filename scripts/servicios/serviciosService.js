import { servicios } from "../../assets/data/data.js";
import { httpGet } from "./httpGet";

const SERV_KEY="servicios";

export async function obtenerServicios() {
    try {
        const data = await httpGet("/servicios", false);
        if (Array.isArray(data)){
            localStorage.setItem(SERV_KEY,JSON.stringify(data));
            return data
        } 
        throw new Error ("Respuesta Inválida");
    } catch (error){
        console.warn("Backend no disponible, usando LocalStorage");
        return JSON.parse(localStorage.getItem(SERV_KEY)) || [];
    }
    
}
export async function guardarServicio(nuevoServicio) {
  try {
    return await httpPost("/servicios", nuevoServicio, true);
  } catch (error) {

    const servicios = await obtenerServicios();
    servicios.push(nuevoServicio);
    localStorage.setItem(SERV_KEY, JSON.stringify(servicios));
  }
}

export async function generarIdServicio() {
  const servicios = await obtenerServicios();
  return "S" + (servicios.length + 1);
}