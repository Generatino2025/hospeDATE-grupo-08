import { pintarHabitacionesDisponibles } from "./mostrarHabitaciones.js";

document.addEventListener('DOMContentLoaded', function () {
   const contenedor = document.getElementById("habitacionesGrid");
    if (contenedor) {
        pintarHabitacionesDisponibles();
    } else {
        console.log("No hay grid de habitaciones en esta página");
    }

    // 1. BOTÓN BUSCAR
    const btnBuscar = document.getElementById("btnBuscar");
    if (btnBuscar) {
        btnBuscar.addEventListener("click", () => {
            const destino = document.getElementById("buscarDestino").value;
            const entrada = document.getElementById("checkIn").value;
            const salida = document.getElementById("checkOut").value;

            if (!destino || !entrada || !salida) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor completa todos los campos.'
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Buscando hospedaje',
                text: `Buscando hospedajes en ${destino} del ${entrada} al ${salida}`,
                confirmButtonText: 'Ir a Reservas',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = './pages/reservas.html';
                }
            });
        });
    } else {
        console.warn("btnBuscar no existe en este HTML");
    }

    // 2. SLIDER
    const track = document.getElementById("slideTrack");
    const prev = document.getElementById("btnPrev");
    const next = document.getElementById("btnNext");
    let position = 0;
    const slideWidth = 200;

    if (next && prev && track) {
        next.addEventListener("click", () => {
            position -= slideWidth;

            if (Math.abs(position) >= track.scrollWidth - (slideWidth * 2)) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
        });

        prev.addEventListener("click", () => {
            position += slideWidth;

            if (position > 0) {
                position = -(track.scrollWidth - slideWidth * 2);
            }

            track.style.transform = `translateX(${position}px)`;
        });
    }

    // 3. LOGOUT
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            console.log("ingrese al logout");

            sessionStorage.removeItem("usuarioActual");

            Swal.fire({
                icon: "success",
                title: "Sesión cerrada"
            }).then(() => {
                window.location.href = "../pages/login.html";
            });
        });
    }
});
