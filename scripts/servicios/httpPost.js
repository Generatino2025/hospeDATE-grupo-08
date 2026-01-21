import { ENV } from "../../env.js"
import { getToken } from "./tokenServicio.js"


export async function httpPost(endpoint, data, isPrivate ) {
    console.log(endpoint, data, isPrivate, ENV,endpoint)
    const headers ={
        "Content-Type": "application/json"
    }
    //Admin o cliente- token y la headers
    if(isPrivate){
        const token = getToken()
        if (token){
            headers["Authorization"] = `Bearer ${token}`
        }
    }

    //petición al servicio de backend
console.log(`${ENV}${endpoint}`)
    const response =  await fetch(`${ENV.API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    }) 
    
    //Manejar la alerta de error
    if(!response){
        console.log(response)
    }

    return response.json();

}