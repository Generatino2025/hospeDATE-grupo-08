// -------------------------------------------
// CARGAR / CREAR USUARIOS EN LOCAL STORAGE
// -------------------------------------------

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


// -------------------------------------------
// VALIDACIONES EN TIEMPO REAL
// -------------------------------------------

const correoInput = document.getElementById("correo");
const correo2Input = document.getElementById("correo2");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");

const errorCorreo2 = document.getElementById("errorCorreo2");
const errorPassword = document.getElementById("errorPassword");
const errorPassword2 = document.getElementById("errorPassword2");

// Correo vs confirmar correo
correo2Input.addEventListener("input", () => {
    if (correo2Input.value !== correoInput.value) {
        errorCorreo2.textContent = "El correo no coincide";
    } else {
        errorCorreo2.textContent = "";
    }
});

// Validar contraseña segura
passwordInput.addEventListener("input", () => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regex.test(passwordInput.value)) {
        errorPassword.textContent =
            "Mínimo 8 caracteres, una mayúscula y un número.";
    } else {
        errorPassword.textContent = "";
    }
});

// Confirmar contraseña
password2Input.addEventListener("input", () => {
    if (password2Input.value !== passwordInput.value) {
        errorPassword2.textContent = "La contraseña no coincide";
    } else {
        errorPassword2.textContent = "";
    }
});

// -------------------------------------------
// EVENTO BOTÓN REGISTRO
// -------------------------------------------

document.getElementById("formRegistro").addEventListener("submit", function (e) {
    e.preventDefault();


    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const tipoDoc = document.getElementById("tipoDoc").value;
    const numeroDoc = document.getElementById("numeroDoc").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const correo2 = document.getElementById("correo2").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value.trim();
    const password2 = document.getElementById("password2").value.trim();
    const terminos = document.getElementById("terminos").checked;

    // VALIDACION: campos vacíos
    if (!nombre || !apellido || !tipoDoc || !numeroDoc || !correo || !correo2 || !telefono || !password || !password2) {
        return Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos."
        });
    }

    // VALIDACION: correo
    if (!correo.includes("@") || !correo.includes(".")) {
        return Swal.fire({
            icon: "warning",
            title: "Correo inválido",
            text: "Debe contener @ y un dominio valido."
        });
    }

    // VALIDACION: correo igual
    if (correo !== correo2) {
        return Swal.fire({
            icon: "error",
            title: "Correos no coinciden",
            text: "Ambos correos deben ser iguales."
        });
    }

    // VALIDACION: password
    if (password !== password2) {
        return Swal.fire({
            icon: "error",
            title: "Contraseñas no coinciden",
            text: "Debes ingresar la misma contraseña en ambos campos."
        });
    }

    // VALIDACION: terminos
    if (!terminos) {
        return Swal.fire({
            icon: "info",
            title: "Aceptar términos",
            text: "Debes aceptar los términos y condiciones."
        });
    }

    // GUARDAR USUARIO
    const usuario = {
        nombre,
        apellido,
        tipoDoc,
        numeroDoc,
        correo,
        telefono,
        password,
        rol: "cliente"
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada.",
    }).then(() => {
        window.location.href = "./login.html";
    });
});


// -------------------------------------------
// MOSTRAR / OCULTAR CONTRASEÑA
// -------------------------------------------

// Función general
function togglePassword(idInput, idIcon) {
    const input = document.getElementById(idInput);
    const icon = document.querySelector(`#${idIcon} i`);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    }
}

// Eventos para ambos campos
document.getElementById("togglePass1").addEventListener("click", function () {
    togglePassword("password", "togglePass1");
});

document.getElementById("togglePass2").addEventListener("click", function () {
    togglePassword("password2", "togglePass2");
});
