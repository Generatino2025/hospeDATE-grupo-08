import {
  inicializarServiciosLS,
  obtenerServicios
} from "./crearservicio.js";

inicializarServiciosLS();

export async function pintarServicios() {
  const contenedor = document.getElementById("serviciosGrid");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const servicios = await obtenerServicios();

  servicios.forEach(s => {
    const card = `
      <div class="col-md-4">
        <div class="card p-3">
          <h5 class="fw-bold">${s.nombre}</h5>
          <p>${s.descripcion}</p>
          <p class="fw-bold">$${s.precio}</p>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", card);
  });
}

pintarServicios();
