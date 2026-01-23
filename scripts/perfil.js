import { httpPutFormData } from "./servicios/httpPut.js";
import { getToken } from "./servicios/tokenServicio.js";

document.addEventListener("DOMContentLoaded", () => {

  const token = getToken();
  const userJSON = localStorage.getItem("user");
  const usuario = userJSON ? JSON.parse(userJSON) : null;

  // 🔐 Validar sesion
  if (!token || !usuario) {
    Swal.fire("Error", "Debes iniciar sesión", "error").then(() => {
      window.location.href = "./login.html";
    });
    return;
  }

  // 📥 Cargar datos en el formulario
  document.getElementById("nombre").value = usuario.nombre || "";
  document.getElementById("apellido").value = usuario.apellido || "";
  document.getElementById("tipoDoc").value = usuario.tipo_doc || "";
  document.getElementById("numeroDoc").value = usuario.numero_doc || "";
  document.getElementById("correo").value = usuario.correo || "";
  document.getElementById("telefono").value = usuario.telefono || "";

  // 🖼 Foto de perfil (si existe)
  const fotoPerfil = document.getElementById("fotoPerfil");
  if (usuario.foto) {
  fotoPerfil.src = `data:image/jpeg;base64,${usuario.foto}`;
  }

  document.getElementById("inputFoto").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      fotoPerfil.src = reader.result;
      usuario.foto = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // 💾 Guardar cambios
  document.getElementById("formPerfil").addEventListener("submit", async e => {
    e.preventDefault();

    // const datosActualizados = {
    //   nombre: document.getElementById("nombre").value,
    //   apellido: document.getElementById("apellido").value,
    //   correo: document.getElementById("correo").value,
    //   telefono: document.getElementById("telefono").value,
    //   foto: usuario.foto
    // };

    const formData = new FormData();

      formData.append("nombre", document.getElementById("nombre").value);
      formData.append("apellido", document.getElementById("apellido").value);
      formData.append("correo", document.getElementById("correo").value);
      formData.append("telefono", document.getElementById("telefono").value);

      const fileInput = document.getElementById("inputFoto");
      if (fileInput.files[0]) {
        formData.append("foto", fileInput.files[0]);
      }

    try {
      const usuarioActualizado = await httpPutFormData(
        `auth/${usuario?.idUsuario}`,
        formData,
        true
      );

      localStorage.setItem("user", JSON.stringify(usuarioActualizado));

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos se guardaron correctamente"
      });

    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
      console.error(error);
    }
  });

});
