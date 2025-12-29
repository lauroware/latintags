import { serviceGetUserByTag } from "../services/auth.js";

const unauthorized = (res) =>
  res.status(401).send({
    status: "Unauthorized",
    message: "Unauthorized to do this action",
    code: 401,
  });

const authMiddleware = (req, res, next) => {
  // Permitir acceso sin autenticación SOLO para productos (como tenías)
  if (req.originalUrl.startsWith("/api/products")) return next();

  const user = req.session?.user;
  if (user) return next();

  return unauthorized(res);
};

const adminOnly = async (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.tag) return unauthorized(res);

  const user = await serviceGetUserByTag(sessionUser.tag);
  if (user?.role === "admin") return next();

  return unauthorized(res);
};

const adminOnly1 = async (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.tag) return unauthorized(res);

  const user = await serviceGetUserByTag(sessionUser.tag);
  if (user?.role === "admin1") return next();

  return unauthorized(res);
};

const adminOnly2 = async (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.tag) return unauthorized(res);

  const user = await serviceGetUserByTag(sessionUser.tag);
  if (user?.role === "admin2") return next();

  return unauthorized(res);
};

const premiumOnly = async (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.tag) return unauthorized(res);

  const user = await serviceGetUserByTag(sessionUser.tag);
  if (user?.role === "premium") return next();

  return unauthorized(res);
};

const premiumOrAdmin = async (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.tag) return unauthorized(res);

  const user = await serviceGetUserByTag(sessionUser.tag);
  if (user?.role === "admin" || user?.role === "admin1" || user?.role === "admin2" || user?.role === "premium")
    return next();

  return unauthorized(res);
};

export {
  authMiddleware,
  adminOnly,
  adminOnly1,
  adminOnly2,
  premiumOnly,
  premiumOrAdmin,
};
