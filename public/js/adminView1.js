const updateProduct = async (pid) => {
  const data = {};
  const newEmailP = document.getElementById(`newEmailP-${pid}`).value;
  const newEmail = document.getElementById(`newEmail-${pid}`).value;
  const newDescription = document.getElementById(`newDescription-${pid}`).value;
  const newNombredelhumano = document.getElementById(
    `newNombredelhumano-${pid}`
  ).value;
  const newTelefono = document.getElementById(`newTelefono-${pid}`).value;

  if (newEmail || newDescription || newNombredelhumano || newTelefono) {
    data.pid = pid;
    data.updates = {
      email: newEmail,
      emailP: newEmailP,
      description: newDescription,
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
  const data = {};
  const newEmail = document.getElementById(`newEmail-${uid}`).value;
  if (newEmail) {
    data.uid = uid;
    data.updates = {
      email: newEmail,
    };
  }
  await fetch(
    `${window.location.protocol}//${window.location.host}/users/${uid}`,
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
      console.error("Error updating user email:", error);
    });
};
