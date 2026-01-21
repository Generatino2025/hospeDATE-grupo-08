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
  // SUBMIT
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const numero = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const precioRaw = document.getElementById("precio").value.trim();
    const url_foto = inputImagen.value.trim();

    // VALIDACIONES
    if (!numero || !tipo || !descripcion || !precioRaw || !url_foto) {
      Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }

    const precioPorNoche = Number(precioRaw);
    if (!Number.isFinite(precioPorNoche) || precioPorNoche <= 0) {
      Swal.fire("Precio inválido", "El precio debe ser mayor a 0", "warning");
      return;
    }

    if (!/\.(jpg|jpeg|png)$/i.test(url_foto)) {
      Swal.fire("Imagen inválida", "La URL debe terminar en .jpg o .png", "error");
      return;
    }

    // OBJETO EXACTO PARA EL BACKEND
    const nuevaHabitacion = {
      numero,
      tipo,
      capacidad: 2, // fijo por ahora
      precioPorNoche,
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

