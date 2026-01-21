import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const navLogin = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");
  const btnLogout = document.getElementById("btnLogout");
  const nombreUsuario = document.getElementById("nombreUsuario");

  if (!navLogin || !navLogout) return;

  // NUEVA FUENTE DE VERDAD
  const token = localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;

  if (token && user) {
    // USUARIO LOGUEADO
    navLogin.style.display = "none";
    navLogout.style.display = "block";

    if (nombreUsuario) {
      nombreUsuario.textContent = user.nombre;
    }
  } else {
    // USUARIO NO LOGUEADO
    navLogin.style.display = "block";
    navLogout.style.display = "none";

    if (nombreUsuario) {
      nombreUsuario.textContent = "";
    }
  }

  //  LOGOUT REAL
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();

      // Limpiar sesion real
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada"
      }).then(() => {
        window.location.href = "./login.html";
      });
    });
  }

  // MARCAR LINK ACTIVO
  const links = document.querySelectorAll(".custom-nav-link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href")?.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});
