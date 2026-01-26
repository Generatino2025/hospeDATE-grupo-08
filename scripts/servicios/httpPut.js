import { ENV } from "../../env.js"
import { getToken } from "./tokenServicio.js"

export async function httpPut(endpoint, data, isPrivate ) {
    console.log(endpoint, data)
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

    return await response.json();

}


export async function httpPutFormData(endpoint, data, isPrivate = false) {
 const headers ={}
    //Admin o cliente- token y la headers
    if(isPrivate){
        const token = getToken()
        if (token){
            headers["Authorization"] = `Bearer ${token}`
        }
    }
  const res = await fetch(`${ENV.API_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: data
  });

  // Detectar tipo de respuesta
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  if (res.status === 204) {
    return null;
  }

  console.log(res.text())
  return await res.text();
 
}
