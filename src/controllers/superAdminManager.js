import { userModel } from "../models/users.model.js";
import { productModel } from "../models/products.model.js";
import { createHash } from "../utils/index.js";

// Mapeo rol → tipo de perfil (para mostrar etiquetas legibles)
const ROLE_LABEL = {
  admin: "Mascota",
  admin1: "Objeto",
  admin2: "Persona",
  premium: "Premium",
  superadmin: "Superadmin",
  user: "Usuario",
};

// Devuelve todos los usuarios con su perfil vinculado (para el panel JS)
const getSuperAdminUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find().lean();
    const allProducts = await productModel.find().lean();

    const ROLE_TO_TYPE = { admin: "pet", admin1: "object", admin2: "person" };

    const users = allUsers.map((u) => {
      const profile = allProducts.find((p) => String(p.tag) === String(u.tag));
      return {
        _id: u._id,
        tag: u.tag,
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        role: u.role,
        profileType: ROLE_TO_TYPE[u.role] || u.role,
        createdAt: u._id.getTimestamp(),
        profile: profile ? { _id: profile._id, title: profile.title } : null,
      };
    });

    return res.status(200).json({ status: "success", users });
  } catch (error) {
    console.error("Error en getSuperAdminUsers:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
  try {
    const allUsers = await userModel.find().lean();
    const allProducts = await productModel.find().lean();

    // Enriquecer cada usuario con su perfil vinculado (si tiene)
    const usersWithProfile = allUsers.map((u) => {
      const profile = allProducts.find((p) => String(p.tag) === String(u.tag));
      return {
        ...u,
        roleLabel: ROLE_LABEL[u.role] || u.role,
        profile: profile || null,
      };
    });

    res.render("superAdmin", {
      title: "Panel Superadmin",
      style: "index.css",
      user: req.session.user,
      isSuperAdmin: true,
      users: usersWithProfile,
    });
  } catch (error) {
    console.error("Error en superAdmin panel:", error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
;

// Crea usuario + perfil en una sola operación (solo tag + password + tipo)
const createTag = async (req, res) => {
  try {
    const { tag, password, role, profileType } = req.body;

    if (!tag || !password || !role || !profileType) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: tag, password, role, profileType.",
      });
    }

    const existingTag = await userModel.findOne({ tag: String(tag) });
    if (existingTag) {
      return res.status(409).json({
        status: "error",
        message: `El tag "${tag}" ya está en uso.`,
      });
    }

    // Crear usuario con solo lo mínimo — el usuario completa el resto después
    const newUser = await userModel.create({
      tag:      String(tag),
      password, // el pre-save del modelo hashea automáticamente
      role,
    });

    // Crear perfil vacío vinculado al usuario
    await productModel.create({
      tag:       String(tag),
      userId:    profileType,
      createdBy: newUser._id,
    });

    return res.status(201).json({
      status:  "success",
      message: `Tag #${tag} creado correctamente.`,
      user:    { tag: newUser.tag, role: newUser.role },
    });
  } catch (error) {
    console.error("Error al crear tag:", error);
    return res.status(500).json({
      status:  "error",
      message: error.message || "Error interno al crear el tag.",
    });
  }
};

// Elimina usuario y su perfil vinculado
const deleteTag = async (req, res) => {
  try {
    const { tag } = req.params;

    if (!tag) {
      return res.status(400).json({ status: "error", message: "Tag requerido." });
    }

    const deletedUser = await userModel.findOneAndDelete({ tag: String(tag) });
    const deletedProduct = await productModel.findOneAndDelete({ tag: String(tag) });

    if (!deletedUser && !deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún registro con tag "${tag}".`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Tag #${tag} eliminado correctamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar tag:", error);
    return res.status(500).json({ status: "error", message: "Error interno al eliminar." });
  }
};

export { getSuperAdminPanel, getSuperAdminUsers, createTag, deleteTag };