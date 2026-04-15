const updateProduct = async (pid) => {
  const get = (id) => { const el = document.getElementById(id); return el ? el.value : undefined; };
  const getCheck = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  const data = {
    pid,
    updates: {
      email:             get(`newEmail-${pid}`),
      mostrarEmail:      getCheck(`newMostrarEmail-${pid}`),
      title:             get(`newTitle-${pid}`),
      thumbnail:         get(`newThumbnail-${pid}`),
      description:       get(`newDescription-${pid}`),
      fechadenacimiento: get(`newFechadenacimiento-${pid}`),
      medicamentos:      get(`newMedicamentos-${pid}`),
      enfermedades:      get(`newEnfermedades-${pid}`),
      nombredelhumano:   get(`newNombredelhumano-${pid}`),
      telefono:          get(`newTelefono-${pid}`),
    }
  };

  Object.keys(data.updates).forEach(k => data.updates[k] === undefined && delete data.updates[k]);

  try {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const err = await res.json();
      Swal.fire("Error", err.message || "No se pudo guardar.", "error");
    }
  } catch {
    Swal.fire("Error", "Error de conexión.", "error");
  }
};

const uploadFoto = async (input, pid) => {
  const file = input.files[0];
  if (!file) return;

  const status = document.getElementById(`uploadStatus-${pid}`);
  status.textContent = "Subiendo...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      document.getElementById(`newThumbnail-${pid}`).value = data.url;
      status.textContent = "✓ Foto subida";
      status.style.color = "#2ecc7a";
    } else {
      status.textContent = data.message || "Error al subir";
      status.style.color = "#e05555";
    }
  } catch {
    status.textContent = "Error de conexión";
    status.style.color = "#e05555";
  }
};

const togglePerdido = async (pid, activar) => {
  const mensajePerdido = document.getElementById(`newMensajePerdido-${pid}`)?.value || "";

  try {
    const res = await fetch(`/api/products/${pid}/perdido`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activar, mensajePerdido }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      Swal.fire("Error", "No se pudo cambiar el modo perdido.", "error");
    }
  } catch {
    Swal.fire("Error", "Error de conexión.", "error");
  }
};