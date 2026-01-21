import { ENV } from "../../env.js";
import { getToken } from "./tokenServicio.js";

export async function httpGet(endpoint, isPrivate) {
   
  const headers = {
    "Content-Type": "application/json",
  };
  //Admin o cliente- token y la headers
  if (isPrivate) {
    const token = getToken();
    if (token) {
     //headers["Authorization"] = `Bearer ${token}`;
     headers["Authorization"] = `Bearer 
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5dWRpdGhAZ21haWwuY29tIiwicm9sZXMiOlsiUk9MRV9DTElFTlRFIl0sImV4cCI6MTc2OTA1Mjg5MiwiaWF0IjoxNzY5MDE2ODkyfQ.qZfWqtKcKCyUojskjNZDQRqm17JzizFv6LSRup1cNOY`;
    }
  }

  //petición
  const response = await fetch(`${ENV.API_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

   console.log(response)
 
  //Manejar la alerta de error
  if (!response) {
    console.log(response);
  }

  return await response.json();
}
