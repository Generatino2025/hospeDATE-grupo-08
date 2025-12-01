// Vista previa de imagen
document.getElementById("imagen").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

// Guardar habitación temporalmente
document.getElementById("formHabitacion").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const imagen = document.getElementById("imagen").files[0];

    if (!nombre || !tipo || !descripcion || !precio || !imagen) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos."
        });
        return;
    }

    // Simulación de guardado
    Swal.fire({
        icon: "success",
        title: "Habitación creada",
        text: "Se ha agregado correctamente."
    });

    document.getElementById("formHabitacion").reset();
    document.getElementById("preview").style.display = "none";
}); 