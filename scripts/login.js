document.getElementById("btnLogin").addEventListener("click", function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validación de campos vacíos 
    if (!email || !password) {
        return Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.'
        });
    }

    // USUARIO ADMIN (FIJO)
    const adminUser = {
        correo: "AdminHotel@gmail.com",
        password: "admin123",
        rol: "admin"
    };

    // Verificar si es admin
    if (email === adminUser.correo && password === adminUser.password) {
        return Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador',
            text: 'Acceso concedido como administrador.'
        }).then(() => {
            // Aqui puedes redirigir al panel admin cuando exista
            window.location.href = "../pages/crearhabitacion.html";  
        });
    }

    // ================================
    // USUARIO REGISTRADO (NORMAL)
    // ================================

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    // Si no existe usuario guardado
    if (!usuarioGuardado) {
        return Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'No existe un usuario registrado. Crea una cuenta primero.'
        });
    }

    // Validar usuario normal
    if (email === usuarioGuardado.correo && password === usuarioGuardado.password) {
        Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Has iniciado sesión correctamente'
        }).then(() => {
            window.location.href = "../index.html"; 
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'El correo o la contraseña no coinciden.'
        });
    }
});

