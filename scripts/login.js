let usuarios = JSON.parse(localStorage.getItem("usuarios"));

if (!usuarios) {
    usuarios = [
        {
            nombre: "Admin",
            apellido: "Hotel",
            tipoDoc: "CC",
            numeroDoc: "0000",
            correo: "AdminHotel@gmail.com",
            telefono: "000000",
            password: "admin123",
            rol: "admin"
        }
    ];

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

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

    // USUARIO Buscarlo Admin o Cliente
     const usuarioEncontrado = usuarios.find(u => u.correo === email && u.password === password);

      // Si no existe usuario guardado
    if (!usuarioEncontrado) {
        return Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'No existe un usuario registrado. Crea una cuenta primero.'
        });
    }

    // Guardar sesión del usuario

    sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
    // ================================
    // USUARIO REGISTRADO (NORMAL)
    // ================================
// Si es admin, redirigir al panel
    if (usuarioEncontrado.rol === "admin") {
        return Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador'
        }).then(() => {
            window.location.href = "../pages/adminvisual.html";
        });
    }

    // Si es cliente, redirigir al home
    Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesión correctamente'
    }).then(() => {
        window.location.href = "../index.html";
    });
});

// === Mostrar / ocultar contraseña en Login ===
const loginPassInput = document.getElementById("password");
const toggleLoginPass = document.getElementById("toggleLoginPass");

toggleLoginPass.addEventListener("click", () => {
    const icon = toggleLoginPass.querySelector("i");

    if (loginPassInput.type === "password") {
        loginPassInput.type = "text";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    } else {
        loginPassInput.type = "password";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    }
});


