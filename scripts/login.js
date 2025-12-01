document.getElementById("btnLogin").addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.'
        });
        return;
    }

    // --- VALIDACIÓN PARA EL ADMIN ---
    if (email === "AdminHotel@gmail.com" && password === "2123holiwis") {

        Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador',
            text: 'Redirigiendo...',
            timer: 1500,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.href = "../reservas/crearHabitacion.html"; 
            // Ajusta esta ruta al archivo real
        }, 1500);

        return;
    }

    // --- SI NO ES ADMIN: Login normal ---
    Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesión correctamente'
    });
});
