import { servicios } from "../../assets/data/data";
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