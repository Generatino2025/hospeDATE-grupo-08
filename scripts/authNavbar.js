import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const navLogin = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");
  const btnLogout = document.getElementById("btnLogout");
  const nombreUsuario = document.getElementById("nombreUsuario");

  if (!navLogin || !navLogout) return;

  const usuarioJSON = sessionStorage.getItem("usuarioActual");
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  if (usuario) {
    navLogin.style.display = "none";
    navLogout.style.display = "block";

    if (nombreUsuario) {
      nombreUsuario.textContent = usuario.nombre;
    }
  } else {
    navLogin.style.display = "block";
    navLogout.style.display = "none";

    if (nombreUsuario) {
      nombreUsuario.textContent = "";
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();

      sessionStorage.removeItem("usuarioActual");

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada"
      }).then(() => {
        window.location.href = "./login.html";
      });
    });
  }

  const links = document.querySelectorAll(".custom-nav-link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href")?.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});
