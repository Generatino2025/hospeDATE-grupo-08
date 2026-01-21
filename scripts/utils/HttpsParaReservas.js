// Get- /reservas/{idRederva}

import { httpGet } from "../servicios/httpGet.js"

//Put/reserva/{id}

//Delete/reserva/{id}

//put/reservas/{idreservas}/servicios

//post/reservas
export async function postReserva(data){
     try {
    const response = await httpPost("reserva", data, true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}


//post/pago
export async function postPago(data){
     try {
    const response = await httpPost("pagos", data, true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}
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



