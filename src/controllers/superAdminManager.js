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

// Renderiza el panel con todos los usuarios existentes
const getSuperAdminPanel = async (req, res) => {
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
};

// Crea usuario + perfil en una sola operación
const createTag = async (req, res) => {
  try {
    const {
      // Datos del usuario
      tag,
      first_name,
      last_name,
      email,
      age,
      password,
      role,
      // Datos del perfil
      profileType,   // "pet" | "object" | "person"
      title,
      description,
      thumbnail,
      emailP,
      // Mascota
      fechadenacimiento,
      medicamentos,
      enfermedades,
      nombredelhumano,
      telefono,
    } = req.body;

    // Validaciones básicas
    if (!tag || !first_name || !last_name || !email || !age || !password || !role) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios del usuario.",
      });
    }

    if (!title || !description || !thumbnail) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios del perfil.",
      });
    }

    // Verificar que el tag no exista
    const existingUser = await userModel.findOne({ tag: String(tag) });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: `El tag "${tag}" ya está en uso.`,
      });
    }

    const existingEmail = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({
        status: "error",
        message: `El email "${email}" ya está registrado.`,
      });
    }

    // Crear usuario (el pre-save del modelo hashea la contraseña automáticamente)
    const newUser = await userModel.create({
      tag: String(tag),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase().trim(),
      age: Number(age),
      password,
      role,
    });

    // Preparar campos según tipo de perfil
    const profileData = {
      tag: String(tag),
      userId: profileType,
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      email: email.toLowerCase().trim(),
      emailP: (emailP || email).toLowerCase().trim(),
      createdBy: newUser._id,
      // Campos opcionales según tipo
      fechadenacimiento: fechadenacimiento || "",
      medicamentos: medicamentos || "",
      enfermedades: enfermedades || "",
      nombredelhumano: nombredelhumano || "",
      telefono: telefono || "",
    };

    const newProduct = await productModel.create(profileData);

    return res.status(201).json({
      status: "success",
      message: `Tag #${tag} creado correctamente.`,
      user: { tag: newUser.tag, role: newUser.role, email: newUser.email },
      profile: { title: newProduct.title, type: newProduct.userId },
    });
  } catch (error) {
    console.error("Error al crear tag:", error);
    return res.status(500).json({
      status: "error",
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

export { getSuperAdminPanel, createTag, deleteTag };