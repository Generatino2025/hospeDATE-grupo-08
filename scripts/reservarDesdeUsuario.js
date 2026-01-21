import { obtenerHabitaciones } from "./crearhabitacion.js"
import { pintarHabitacionesDisponibles } from "./mostrarHabitaciones.js"
import { listarServicios } from "./utils/HttpsParaReservas.js"

console.log("Entre al usuairo final")

document.addEventListener('DOMContentLoaded', async () => {
   //-------------Lo cargo desde el backe----------//
   // const habitaciones = await obtenerHabitaciones()

     //-----------Obtener servicios  dedl backend-------------------//
     //const servicios = await listarServicios()
      pintarHabitacionesDisponibles()
})
