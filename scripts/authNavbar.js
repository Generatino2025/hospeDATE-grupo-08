import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const navLogin = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");
  const btnLogout = document.getElementById("btnLogout");

  if (!navLogin || !navLogout) return;

  const usuarioActual = sessionStorage.getItem("usuarioActual");

  // Mostrar / ocultar
  if (usuarioActual) {
    navLogin.style.display = "none";
    navLogout.style.display = "block";
  } else {
    navLogin.style.display = "block";
    navLogout.style.display = "none";
  }

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault(); //evita comportamientos raros

      sessionStorage.removeItem("usuarioActual");

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada"
      }).then(() => {
        window.location.href = "/pages/login.html";
      });
    });
  }
});
