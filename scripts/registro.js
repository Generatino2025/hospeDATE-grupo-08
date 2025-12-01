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

    // 1. Validar vacíos
    if (!nombre || !apellido || !tipoDoc || !numeroDoc || !correo || 
        !correo2 || !telefono || !password || !password2) {
        
        return Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Por favor llena todos los campos obligatorios."
        });
    }

    // 2. Validar correo correcto
    if (!correo.includes("@") || !correo.includes(".")) {
        return Swal.fire({
            icon: "warning",
            title: "Correo no valido",
            text: "El correo debe contener @ y un dominio valido."
        });
    }

    // 3. Validar correos iguales
    if (correo !== correo2) {
        return Swal.fire({
            icon: "error",
            title: "Correos no coinciden",
            text: "Los correos ingresados deben ser iguales."
        });
    }

    // 4. Validar contraseñas
    if (password !== password2) {
        return Swal.fire({
            icon: "error",
            title: "Contraseñas no coinciden",
            text: "Debes ingresar la misma contraseña en ambos campos."
        });
    }

    // 5. Validar términos
    if (!terminos) {
        return Swal.fire({
            icon: "info",
            title: "Aceptar terminos",
            text: "Debes aceptar los terminos y condiciones."
        });
    }

    // 6. Si todo está bien
    Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente.",
    }).then(() => {
        window.location.href = "./login.html"; 
    });

});
