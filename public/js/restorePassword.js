const formRequestCode = document.getElementById("formRequestCode");
const formResetPassword = document.getElementById("formResetPassword");

const getEmail = () => {
  const emailInput = document.getElementById("email");
  return String(emailInput?.value || "").trim().toLowerCase();
};

if (formRequestCode) {
  formRequestCode.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = getEmail();

    try {
      const resp = await fetch("/auth/restorePassword/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data?.payload || data?.message || "No se pudo enviar el código");
      }

      await Swal.fire({
        icon: "success",
        title: "Listo",
        text: data?.payload || "Te enviamos un código. Revisá tu email.",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Ups",
        text: err?.message || "Error enviando el código",
      });
    }
  });
}

if (formResetPassword) {
  formResetPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = getEmail();
    const code = String(document.getElementById("code")?.value || "").trim();
    const newPassword = String(document.getElementById("newPassword")?.value || "");

    if (!email) {
      await Swal.fire({
        icon: "warning",
        title: "Falta el email",
        text: "Primero completá el email (es el mismo al que pediste el código).",
      });
      return;
    }

    try {
      const resp = await fetch("/auth/restorePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data?.payload || data?.message || "No se pudo actualizar la contraseña");
      }

      await Swal.fire({
        icon: "success",
        title: "Perfecto",
        text: "Contraseña actualizada. Ya podés iniciar sesión.",
      });

      window.location.href = "/auth/login";
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Ups",
        text: err?.message || "Error actualizando la contraseña",
      });
    }
  });
}
