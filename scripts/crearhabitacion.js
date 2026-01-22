import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import { httpPost } from "./servicios/httpPost.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formHabitacion");
  const inputImagen = document.getElementById("imagen");
  const preview = document.getElementById("preview");

  if (!form) return;

  // ===============================
  // PREVIEW IMAGEN
  // ===============================
  inputImagen.addEventListener("input", () => {
    const url = inputImagen.value.trim();
    const regex = /\.(jpg|jpeg|png)$/i;

    if (regex.test(url)) {
      preview.src = url;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  });

  // ===============================
  // FUNCIONES UX
  // ===============================
  function marcarInvalido(input) {
    input.classList.add("is-invalid");
  }

  function limpiarErrores() {
    document
      .querySelectorAll(".is-invalid")
      .forEach(el => el.classList.remove("is-invalid"));
  }

  // ===============================
  // SUBMIT
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    limpiarErrores();

    const numero = document.getElementById("numero").value.trim();
    const tipo = document.getElementById("tipo").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const precioRaw = document.getElementById("precio").value.trim();
    const url_foto = inputImagen.value.trim();

    let hayErrores = false;

    if (!numero) {
      marcarInvalido(document.getElementById("numero"));
      hayErrores = true;
    }

    if (!tipo) {
      marcarInvalido(document.getElementById("tipo"));
      hayErrores = true;
    }

    if (!descripcion) {
      marcarInvalido(document.getElementById("descripcion"));
      hayErrores = true;
    }

    if (!precioRaw || precioRaw <= 0) {
      marcarInvalido(document.getElementById("precio"));
      hayErrores = true;
    }

    if (!url_foto) {
      marcarInvalido(document.getElementById("imagen"));
      hayErrores = true;
    }

    if (hayErrores) {
      Swal.fire(
        "Formulario incompleto",
        "Completa los campos marcados en rojo",
        "warning"
      );

      document.querySelector(".is-invalid")?.focus();
      return;
    }

    // ===============================
    // OBJETO BACKEND
    // ===============================
    const nuevaHabitacion = {
      numero,
      tipo,
      capacidad: 2,
      precioPorNoche: Number(precioRaw),
      url_foto
    };

    try {
      await httpPost("habitaciones", nuevaHabitacion, true);

      Swal.fire(
        "Habitación creada",
        "Se guardó correctamente en la base de datos",
        "success"
      ).then(() => {
        form.reset();
        preview.style.display = "none";
      });

    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo crear la habitación",
        "error"
      );
    }
  });
});



