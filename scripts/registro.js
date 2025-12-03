document.getElementById("btnRegistro").addEventListener("click", function () {

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
            title: "Aceptar terminos",
            text: "Debes aceptar los terminos y condiciones."
        });
    }

    //SI TODO ESTÁ BIEN → GUARDAR USUARIO
    const usuario = {
        nombre,
        apellido,
        tipoDoc,
        numeroDoc,
        correo,
        telefono,
        password
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    // ALERTA ÉXITO
    Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada.",
    }).then(() => {
        window.location.href = "./login.html";
    });
});

