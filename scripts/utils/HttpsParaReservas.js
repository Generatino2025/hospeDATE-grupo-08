// Get- /reservas/{idRederva}

import { httpGet } from "../servicios/httpGet"

//Put/reserva/{id}

//Delete/reserva/{id}

//put/reservas/{idreservas}/servicios

//post/reservas

//post/pago
//get/pagos/reserva/{idreserva}

//get/servicios 

//---1 Pintar o llamar los servicios Adicionales disponible--/
export async function listarServicios() {
   try {
    const response = await httpGet("servicios", true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}

