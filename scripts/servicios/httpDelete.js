import { ENV } from "../../env.js"
import { getToken } from "./tokenServicio.js"


export async function httpDelete(endpoint, isPrivate ) {
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

    //petición
    const response = await fetch(`${ENV.API_URL}${endpoint}`, {
        method: "DELETE",
        headers    
    }) 

    //Manejar la alerta de error
    if(!response){
        console.log(response)
    }

    }