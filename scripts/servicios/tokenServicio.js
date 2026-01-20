export function getToken() {
    return JSON.parse(localStorage.getItem("token"))
    
}

export function setToken(token) {
    localStorage.setItem("token", JSON.stringify(token))
    
}

export function clearToken() {
    return localStorage.removeItem("token")
    
}