const form = document.getElementById("formLogin");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitForm();
});

const submitForm = async () => {
  const tag = document.getElementById("tag").value;
  const password = document.getElementById("password").value;

  // Agregar mensaje de carga
  Swal.fire({
    title: "Iniciando sesión...",
    allowOutsideClick: false,
    showConfirmButton: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
  });

  await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tag: tag,
      password: password,
    }),
  })
    .then(async (res) => {
      data = await res.json();
      if (data.status === "success") {
        // Redirigir al usuario a la página correspondiente
        window.location.href = data.redirectTo;
      } else {
        // Mostrar mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: data.payload,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Mostrar mensaje de error genérico
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Ocurrió un error al procesar la solicitud. Por favor, inténtalo nuevamente más tarde.",
      });
    });
};
