const updateProduct = async (pid) => {
  const data = {};
  const newEmailP = document.getElementById(`newEmailP-${pid}`).value;
  const newEmail = document.getElementById(`newEmail-${pid}`).value;
  const newTitle = document.getElementById(`newTitle-${pid}`).value;
  const newDescription = document.getElementById(`newDescription-${pid}`).value;
  const newThumbnail = document.getElementById(`newThumbnail-${pid}`).value;
  const newFechadenacimiento = document.getElementById(
    `newFechadenacimiento-${pid}`
  ).value;
  const newMedicamentos = document.getElementById(
    `newMedicamentos-${pid}`
  ).value;
  const newEnfermedades = document.getElementById(
    `newEnfermedades-${pid}`
  ).value;
  const newNombredelhumano = document.getElementById(
    `newNombredelhumano-${pid}`
  ).value;
  const newTelefono = document.getElementById(`newTelefono-${pid}`).value;

  if (
    newEmailP ||
    newEmail ||
    newTitle ||
    newDescription ||
    newThumbnail ||
    newFechadenacimiento ||
    newMedicamentos ||
    newEnfermedades ||
    newNombredelhumano ||
    newTelefono
  ) {
    data.pid = pid;
    data.updates = {
      email: newEmail,
      emailP: newEmailP,
      title: newTitle,
      title: newTitle,
      description: newDescription,
      thumbnail: newThumbnail,
      fechadenacimiento: newFechadenacimiento,
      medicamentos: newMedicamentos,
      enfermedades: newEnfermedades,
      nombredelhumano: newNombredelhumano,
      telefono: newTelefono,
    };
  }

  await fetch(
    `${window.location.protocol}//${window.location.host}/api/products/${pid}`,
    {
      method: "put",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
};

const updateUserEmail = async (uid) => {
  const newEmail = document.getElementById(`newEmail-${uid}`).value;
  const data = {};

  if (newEmail) {
    data.uid = uid;
    data.newEmail = newEmail;
  }
  await fetch(`${window.location.href}/users/${uid}`, {
    method: "put",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating user role:", error);
    });
};
