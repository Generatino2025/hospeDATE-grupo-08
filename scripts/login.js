// ===============================
// USUARIOS BASE (ADMIN)
// ===============================
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

// ===============================
// LOGIN
// ===============================
document.getElementById("btnLogin").addEventListener("click", function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validar campos vacíos
    if (!email || !password) {
        return Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.'
        });
    }

    // Buscar usuario
    const usuarioEncontrado = usuarios.find(
        u => u.correo === email && u.password === password
    );

    if (!usuarioEncontrado) {
        return Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'Correo o contraseña incorrectos.'
        });
    }

    // ===============================
    // GUARDAR SESIÓN
    // ===============================
    sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

    // Nombre que se mostrará en el navbar
    localStorage.setItem(
        "usuarioLogueado",
        usuarioEncontrado.rol === "admin"
            ? "Administrador"
            : `${usuarioEncontrado.nombre}`
    );

    // ===============================
    // REDIRECCIÓN POR ROL
    // ===============================
    if (usuarioEncontrado.rol === "admin") {
        return Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador'
        }).then(() => {
            window.location.href = "../pages/adminvisual.html";
        });
    }

    Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesión correctamente'
    }).then(() => {
        window.location.href = "../index.html";
    });
});

// ===============================
// MOSTRAR / OCULTAR CONTRASEÑA
// ===============================
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
