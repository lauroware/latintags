import { serviceGetUserByTag } from "../services/auth.js";

const getUserTagMiddleware = async (req, res, next) => {
  try {
    // Obtener el tag del usuario de la sesión
    const user = req.session?.user;
    const tag = user ? user.tag : null;

    // Pasar el tag a serviceGetUserByTag para obtener el usuario
    const userWithTag = await serviceGetUserByTag(tag);

    // Almacenar el tag del usuario en la sesión si se obtiene correctamente
    if (userWithTag) {
      req.session.userTag = userWithTag.tag; // Suponiendo que quieres almacenar el tag en req.session.userTag
    }

    // Continuar con el flujo de la solicitud
    next();
  } catch (error) {
    console.error("Error al obtener el tag del usuario:", error);
    res.status(500).send({
      status: "Internal Server Error",
      message: "Error retrieving user tag",
      code: 500,
    });
  }
};

export default getUserTagMiddleware;
