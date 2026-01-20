import { ENV } from "../../env.js"
import { getToken } from "./tokenServicio.js"


export async function httpPut(endpoint, data, isPrivate ) {
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
        method: "PUT",
        headers,
        body: JSON.stringify(data)
    }) 

    //Manejar la alerta de error
    if(!response){
        console.log(response)
    }

    return response.json();

}