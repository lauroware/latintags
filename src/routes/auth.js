import { Router } from "express";
import {
  authMiddleware,
  adminOnly,
  premiumOnly,
  adminOnly1,
  adminOnly2,
} from "../middlewares/index.js";
import {
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
  renderRestorePassword,
  requestRestorePassword,
  restorePassword,
} from "../controllers/userManager.js";
import { getProductById } from "../controllers/productManager.js";
import passport from "passport";
import { getProductsFromPremiumUsers } from "../controllers/productManager.js";
import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
const authRouter = Router();

authRouter.get("/login", loginForm);

authRouter.post("/login", login);

authRouter.get("/adminView", adminOnly, adminView, getProductsFromPremiumUsers);
authRouter.get(
  "/adminView1",
  adminOnly1,
  adminView1,
  getProductsFromPremiumUsers
);

authRouter.get(
  "/adminView2",
  adminOnly2,
  adminView2,
  getProductsFromPremiumUsers
);

authRouter.get("/", adminOnly, getAllUsers);

authRouter.put(
  "/adminView/users/:uid",
  adminOnly,
  updateUserRole,
  updateUserEmail
);

authRouter.put(
  "/adminView1/users/:uid",
  adminOnly,
  updateUserRole,
  updateUserEmail
);

authRouter.delete(
  "/adminView/users",
  adminOnly,
  deleteAllUsers,
  getProductsFromPremiumUsers
);

authRouter.delete("/adminView/users/:uid", adminOnly, deleteUserById);

// La siguiente ruta se convierte en pública
authRouter.get("/products/:id", getProductById);

authRouter.get("/restorePassword", renderRestorePassword);

authRouter.get("/info", (req, res) => {
  res.render("info", { style: "index.css", title: "Info" });
});

// Paso 1: pedir código (envía email)
authRouter.post("/restorePassword/request", requestRestorePassword);

authRouter.put("/restorePassword", restorePassword);

authRouter.get("/premiumView", premiumOnly, getProductsFromPremiumUsers);

authRouter.get("/logout", logout);

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

authRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);

export default authRouter;
