import { httpPost } from "./servicios/httpPost.js";

const form = document.getElementById("formServicio");
const inputNombre = document.getElementById("nombre");
const inputTipo = document.getElementById("tipo");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const btnSubmit = form.querySelector("button[type='submit']");

init();

function init() {
  bindEvents();
}

function bindEvents() {
  form.addEventListener("submit", handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();

  const servicio = buildPayload();

  if (!validateForm(servicio)) return;

  try {
    setLoading(true);

    await httpPost("servicios", servicio, true);

    Swal.fire({
      icon: "success",
      title: "Servicio creado",
      text: "El servicio fue registrado correctamente"
    });

    resetForm();
  } catch (error) {
    console.error("Error creando servicio:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.message || "No se pudo crear el servicio"
    });
  } finally {
    setLoading(false);
  }
}

function buildPayload() {
  return {
    nombre: inputNombre.value.trim(),    
    precio: Number(inputPrecio.value)
  };
}

function validateForm(servicio) {
  if (!servicio.nombre) {
    showWarning("El nombre es obligatorio");
    return false;
  }

  if (!servicio.precio || servicio.precio <= 0) {
    showWarning("El precio debe ser mayor a 0");
    return false;
  }

  return true;
}

function resetForm() {
  form.reset();
}

function setLoading(isLoading) {
  btnSubmit.disabled = isLoading;
  btnSubmit.textContent = isLoading ? "Guardando..." : "Guardar Servicio";
}

function showWarning(message) {
  Swal.fire({
    icon: "warning",
    title: "Validación",
    text: message
  });
}


