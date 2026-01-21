import { httpPost } from "./servicios/httpPost.js";
import { setToken } from "./servicios/tokenServicio.js";

// ===============================
// LOGIN REAL
// ===============================
document
  .getElementById("btnLogin")
  .addEventListener("click", async function () {
    const correo = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    // Validar campos vacios
    if (!correo || !contrasena) {
      return Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor llena todos los campos.",
      });
    }

    const credenciales = {
      correo,
      contrasena,
    };

    try {
      //  LLAMADA AL BACKEND
      const response = await httpPost("auth/login", credenciales, false);
      console.log(response);
      // GUARDAR TOKEN (ACA SI)
      setToken(response.token);

      // Guardar el usuario REAL que manda el backend
      localStorage.setItem("user", JSON.stringify(response.usuario));

      // REDIRECCION POR ROL
      if (response?.usuario?.rol === "ADMIN") {
        Swal.fire({
          icon: "success",
          title: "Bienvenido Administrador",
        }).then(() => {
          window.location.href = "../pages/adminvisual.html";
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Has iniciado sesión correctamente",
        }).then(() => {
          window.location.href = "../pages/indexUsuario.html";
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Correo o contraseña incorrectos.",
      });
      console.error(error);
    }
  });

// ===============================
// MOSTRAR / OCULTAR CONTRASEÑA
// ===============================
const loginPassInput = document.getElementById("password");
const toggleLoginPass = document.getElementById("toggleLoginPass");

toggleLoginPass.addEventListener("click", () => {
  const icon = toggleLoginPass.querySelector("i");

  if (loginPassInput.type === "password") {
    loginPassInput.type = "text";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  } else {
    loginPassInput.type = "password";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  }
});
