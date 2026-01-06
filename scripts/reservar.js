import { usuarioEstaLogueado, pedirLogin } from "./session.js";

export function reservar(idHabitacion) {
    if (!usuarioEstaLogueado()) {
        pedirLogin();
        return;
    }

    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const existe = reservas.some(r => r.idHabitacion == idHabitacion);

    if (existe) {
        Swal.fire({
            icon: "error",
            title: "Habitación ya reservada"
        });
        return;
    }

    reservas.push({
        idHabitacion,
        fecha: new Date().toISOString()
    });

    localStorage.setItem("reservas", JSON.stringify(reservas));

    Swal.fire({
        icon: "success",
        title: "Reserva confirmada"
    });
    const btnConfirmar = document.getElementById("btnConfirmarReserva");

btnConfirmar.addEventListener("click", () => {
    const usuario = sessionStorage.getItem("usuarioActual");

    if (!usuario) {
        Swal.fire({
            icon: "warning",
            title: "Inicia sesión"
        }).then(() => {
            window.location.href = "./login.html";
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Reserva confirmada"
    });
});

}
