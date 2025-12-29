import {
  serviceGetAllUsers,
  serviceGetUserByTag,
  serviceLoginUser,
  serviceDeleteAllUsers,
  serviceDeleteUserById,
  serviceUpdateUserRole,
  serviceUpdateUserEmail,
  serviceRestorePassword,
  serviceGetUserByEmail,
} from "../services/auth.js";
import { serviceProductsFromDTO } from "../services/product.js";
import { serviceGetPetByUserId } from "../services/product.js";
import { isValidPassword } from "../utils/index.js";
import transporter from "../utils/mail.js";
import { userModel } from "../models/users.model.js";
import { GMAIL } from "../config/index.config.js";
import { v4 } from "uuid";
import {
  serviceCreateToken,
  serviceDeleteTokenById,
  serviceFindTokenByUserId,
} from "../services/token.js";

const loginForm = (req, res) => {
  res.render("login", { title: "Login", style: "index.css" });
};

const login = async (req, res) => {
  try {
    const user = await serviceGetUserByTag(req.body.tag); // Cambiar a la función que busca usuarios por número de tag

    if (!user) {
      res
        .status(404)
        .send({ status: "error", payload: "Usuario no encontrado" });
      return;
    }

    const validPassword = isValidPassword(user, req.body.password);
    if (!validPassword) {
      res
        .status(401)
        .send({ status: "error", payload: "Contraseña incorrecta" });
      return;
    }

    const userDate = await userModel.findOneAndUpdate(
      { tag: user.tag }, // Cambiar el campo de búsqueda a número de tag
      { lastLoginDate: new Date() },
      { new: true }
    );

    req.session.user = user;
    const response = {
      status: "success",
      payload: {
        message: "Inicio de sesión exitoso",
        userDate: userDate,
      },
      redirectTo: "/api/products",
    };
    res.send(response);
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).send({ status: "error", payload: "Error en el servidor" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await serviceGetAllUsers();
    res
      .status(200)
      .send({ status: "success", payload: "All users found", allUsers });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", payload: "Error finding all users" });
  }
};

const updateUserRole = async (req, res) => {
  const { uid, newRole } = req.body;
  try {
    const updatedUser = await serviceUpdateUserRole(uid, newRole);
    res.status(200).send({
      status: "success",
      payload: "User role updated",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", payload: "Error updating user role" });
  }
};

const updateUserEmail = async (req, res) => {
  const { uid, newEmail } = req.body;

  try {
    const updatedUser = await serviceUpdateUserEmail(uid, newEmail);

    // ✅ refrescar sesión si el usuario actualizado es el mismo que está logueado
    const sessionUser = req.session?.user;
    if (
      sessionUser &&
      (String(sessionUser._id) === String(updatedUser?._id) ||
        String(sessionUser.tag) === String(updatedUser?.tag))
    ) {
      req.session.user = updatedUser;
      await new Promise((resolve, reject) =>
        req.session.save((err) => (err ? reject(err) : resolve()))
      );
    }

    return res.status(200).send({
      status: "success",
      payload: "User email updated",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", payload: "Error updating user email" });
  }
};



const renderRestorePassword = async (req, res) => {
  res.render("restore-password", { style: "index.css" });
};

// Paso 1: solicitar código de restablecimiento (se envía por email)
const requestRestorePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res
        .status(400)
        .send({ status: "error", payload: "Falta el email" });
    }

    // Validar que exista el usuario
    const user = await serviceGetUserByEmail(normalizedEmail);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", payload: "No existe un usuario con ese email" });
    }

    // Generar código y guardarlo como token
    const code = v4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Si ya había un token para ese email, lo reemplazamos
    try {
      const existing = await serviceFindTokenByUserId(normalizedEmail);
      if (existing?._id) {
        await serviceDeleteTokenById(existing._id);
      }
    } catch (e) {
      // no había token, ok
    }

    await serviceCreateToken({ token: code, user: normalizedEmail, expiresAt });

    // Enviar mail
    await transporter.sendMail({
      from: GMAIL,
      to: normalizedEmail,
      subject: "Código para restablecer tu contraseña",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Restablecimiento de contraseña</h2>
          <p>Tu código es:</p>
          <p style="font-size: 18px; font-weight: bold;">${code}</p>
          <p>Este código vence en 15 minutos.</p>
          <p>Si no solicitaste este cambio, podés ignorar este mensaje.</p>
        </div>
      `,
    });

    return res.status(200).send({
      status: "success",
      payload: "Te enviamos un código a tu email (revisá spam si no llega).",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", payload: "Error enviando el código" });
  }
};

const restorePassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedCode = String(code || "").trim();

    if (!normalizedEmail || !normalizedCode || !newPassword) {
      return res
        .status(400)
        .json({ message: "Faltan datos" });
    }

    let tokenReset;
    try {
      tokenReset = await serviceFindTokenByUserId(normalizedEmail);
    } catch (e) {
      return res.status(400).json({ message: "No hay un código activo para ese email" });
    }

    const expires = new Date(tokenReset.expiresAt).getTime();
    if (tokenReset.token !== normalizedCode || expires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Código de restablecimiento inválido o vencido" });
    }

    const updatedUser = await serviceRestorePassword(normalizedEmail, newPassword);

    await serviceDeleteTokenById(tokenReset._id);
    res.status(200).send({
      status: "success",
      payload: "User password updated",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", payload: "Error updating user password" });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    await serviceDeleteAllUsers();
    res.status(200).send({ status: "success", payload: "All users deleted" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", payload: "Error deleting all users" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    let uid = req.params.uid;
    if (!uid) {
      res.status(404).send({ status: "error", payload: "User not found" });
    } else {
      await serviceDeleteUserById(uid);
      res.status(200).send({ status: "success", payload: "User deleted" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", payload: "Error deleting user" });
  }
};

const isUserAdmin = (user) => {
  return user && user.role === "admin";
};

const isUserAdmin1 = (user) => {
  return user && user.role === "admin1";
};

const isUserAdmin2 = (user) => {
  return user && user.role === "admin2";
};

const adminView = async (req, res) => {
  const allUsers = await serviceGetAllUsers();
  const allProducts = await serviceProductsFromDTO();
  const user = req.session.user;
  // console.log('session',req.session);
  console.log("allProducts", allProducts);
  const isAdmin = isUserAdmin(user);
  // console.log('asdasdadmin');
  const userProduct = allProducts.find((product) => product.tag === user.tag);
  console.log("userProduct", userProduct);
  // console.log('allProducts',allProducts[0])

  // Verificar si se encontró un producto para el usuario actual
  const filteredProducts = userProduct ? [userProduct] : [];

  res.render("admin", {
    user,
    isAdmin,
    allUsers,
    allProducts: filteredProducts,
    style: "index.css",
  });
};

const adminView1 = async (req, res) => {
  const allUsers = await serviceGetAllUsers();
  const allProducts = await serviceProductsFromDTO();
  const user = req.session.user;
  // console.log('session',req.session);
  console.log("allProducts", allProducts);
  const isAdmin1 = isUserAdmin1(user);
  // console.log('asdasdadmin');
  const userProduct = allProducts.find((product) => product.tag === user.tag);
  console.log("userProduct", userProduct);
  // console.log('allProducts',allProducts[0])

  // Verificar si se encontró un producto para el usuario actual
  const filteredProducts = userProduct ? [userProduct] : [];

  res.render("admin1", {
    user,
    isAdmin1,
    allUsers,
    allProducts: filteredProducts,
    style: "index.css",
  });
};

const adminView2 = async (req, res) => {
  const allUsers = await serviceGetAllUsers();
  const allProducts = await serviceProductsFromDTO();
  const user = req.session.user;
  // console.log('session',req.session);
  console.log("allProducts", allProducts);
  const isAdmin2 = isUserAdmin2(user);
  // console.log('asdasdadmin');
  const userProduct = allProducts.find((product) => product.tag === user.tag);
  console.log("userProduct", userProduct);
  // console.log('allProducts',allProducts[0])

  // Verificar si se encontró un producto para el usuario actual
  const filteredProducts = userProduct ? [userProduct] : [];

  res.render("admin2", {
    user,
    isAdmin2,
    allUsers,
    allProducts: filteredProducts,
    style: "index.css",
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/auth/login");
    } else res.send({ status: "error", payload: "Logout Error", body: err });
  });
};

export {
  login,
  logout,
  loginForm,
  getAllUsers,
  deleteAllUsers,
  deleteUserById,
  adminView,
  adminView1,
  adminView2,
  updateUserRole,
  updateUserEmail,
  requestRestorePassword,
  restorePassword,
  renderRestorePassword,
};
