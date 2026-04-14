const updateProduct = async (pid) => {
  const data = {};
  const get = (id) => { const el = document.getElementById(id); return el ? el.value : undefined; };
  const getCheck = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  data.pid = pid;
  data.updates = {
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
  };

  // Limpiar undefined
  Object.keys(data.updates).forEach(k => data.updates[k] === undefined && delete data.updates[k]);

  try {
    const res = await fetch(
      `${window.location.protocol}//${window.location.host}/api/products/${pid}`,
      { method: "put", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }
    );
    if (res.ok) {
      window.location.reload();
    } else {
      const err = await res.json();
      Swal.fire("Error", err.message || "No se pudo guardar.", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Error de conexión.", "error");
  }
};