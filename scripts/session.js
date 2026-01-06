// session.js

export function obtenerUsuarioActual() {
    const usuario = sessionStorage.getItem("usuarioActual");
    return usuario ? JSON.parse(usuario) : null;
}

export function usuarioEstaLogueado() {
    return sessionStorage.getItem("usuarioActual") !== null;
}

export function pedirLogin() {
    Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Para continuar necesitas iniciar sesión",
        confirmButtonText: "Ir a Login"
    }).then(() => {
        window.location.href = "./login.html";
    });
}
