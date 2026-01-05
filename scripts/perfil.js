const usuario = JSON.parse(sessionStorage.getItem("usuarioActual"));

if (!usuario) {
  Swal.fire("Error", "No hay usuario activo", "error");
  window.location.href = "./login.html";
}

// Cargar datos
document.getElementById("nombre").value = usuario.nombre || "";
document.getElementById("apellido").value = usuario.apellido || "";
document.getElementById("tipoDoc").value = usuario.tipoDoc || "";
document.getElementById("numeroDoc").value = usuario.numeroDoc || "";
document.getElementById("correo").value = usuario.correo || "";
document.getElementById("telefono").value = usuario.telefono || "";

// Foto
const fotoPerfil = document.getElementById("fotoPerfil");
if (usuario.foto) fotoPerfil.src = usuario.foto;

// Subir nueva foto
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

// Guardar cambios
document.getElementById("formPerfil").addEventListener("submit", e => {
  e.preventDefault();

  usuario.nombre = nombre.value;
  usuario.apellido = apellido.value;
  usuario.tipoDoc = tipoDoc.value;
  usuario.numeroDoc = numeroDoc.value;
  usuario.correo = correo.value;
  usuario.telefono = telefono.value;

  sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));

  Swal.fire({
    icon: "success",
    title: "Perfil actualizado",
    text: "Tus datos se guardaron correctamente"
  });
});
