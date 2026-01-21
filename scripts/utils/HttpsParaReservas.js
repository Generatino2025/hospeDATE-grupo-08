import { httpGet } from "../servicios/httpGet.js"
import { httpPost } from "../servicios/httpPost.js"
import { httpPut } from "../servicios/httpPut.js"

//---------------RESERVAS----------------------------//
// lISTAR LAS RESERVAS
export async function listarReservas(){
   try {
    const response = await httpGet("reservas", true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}

//post/reservas
export async function postReserva(data){
     try {
    const response = await httpPost("reservas", data, true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}
export async function putReserva(data, id){
     try {
    const response = await httpPut(`reservas/${id}`, data, true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}
//---------------sERVICIO----------------------------//
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

//put/reservas/{idreservas}/servicios
export async function putServiciosReservas(data, id){
     try {
    const response = await httpPut(`reservas/${id}/servicios`, data, true )
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}




//---------------PAGOS----------------------------//

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








