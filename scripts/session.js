import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export function obtenerUsuarioActual() {
  const usuario = localStorage.getItem("user");
  return usuario ? JSON.parse(usuario) : null;
}

export function usuarioEstaLogueado() {
  return localStorage.getItem("user") !== null;
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
