document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorServicios");
  const buscador = document.getElementById("buscador");

  let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

  function mostrarServicios(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
      contenedor.innerHTML = `
        <p class="text-center text-muted">
          No hay servicios registrados
        </p>`;
      return;
    }

    lista.forEach((servicio, index) => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${servicio.nombre}</h5>
              <p class="card-text">${servicio.descripcion}</p>
              <p class="fw-bold">Precio: $${servicio.precio}</p>

              <div class="d-flex justify-content-between">
                <button class="btn btn-warning btn-sm" onclick="editarServicio(${index})">
                  <i class="bi bi-pencil"></i> Editar
                </button>

                <button class="btn btn-danger btn-sm" onclick="eliminarServicio(${index})">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }


  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = servicios.filter(s =>
      s.nombre.toLowerCase().includes(texto)
    );
    mostrarServicios(filtrados);
  });


  window.eliminarServicio = (index) => {
    Swal.fire({
      title: "¿Eliminar servicio?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        servicios.splice(index, 1);
        localStorage.setItem("servicios", JSON.stringify(servicios));
        mostrarServicios(servicios);
      }
    });
  };

  
  window.editarServicio = (index) => {
    localStorage.setItem("servicioEditar", index);
    window.location.href = "./crearservicios.html";
  };

  mostrarServicios(servicios);
});
