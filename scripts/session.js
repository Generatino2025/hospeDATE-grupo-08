document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuarioLogueado");
    const h2Usuario = document.getElementById("nombreUsuario");

    // Si no hay sesión → login
    if (!usuario) {
        window.location.href = "../pages/login.html";
        return;
    }

    // Mostrar usuario en navbar
    if (h2Usuario) {
        h2Usuario.textContent = usuario;
    }
});
