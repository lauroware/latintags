// Importaciones
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { getPublicKey } from "./src/controllers/stripeManager.js";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import cartsRouter from "./src/routes/carts.js";
import MongoStore from "connect-mongo";
import authRouter from "./src/routes/auth.js";
import productsRouter from "./src/routes/products.js";
import mockRouter from "./src/routes/mockingProducts.js";
import superAdminRouter from "./src/routes/superAdmin.js";
import { engine } from "express-handlebars";
import { SECRET_KEY, DB_URL } from "./src/config/index.config.js";
import { fileURLToPath } from "url";
import { authMiddleware } from "./src/middlewares/index.js";
import initializePassport from "./src/config/passport.config.js";
import passport from "passport";
import swaggerUiExpress from "swagger-ui-express";
import errorHandler from "./src/middlewares/errors/index.js";
import addLogger from "./src/utils/logger.js";
import Handlebars from "handlebars";
import helper from "handlebars-helpers";
import productRoutes from "./src/routes/products.js";
import { productModel } from "./src/models/products.model.js";

// Ruta al nuevo middleware

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

Handlebars.registerHelper("isEqual", function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

app.engine("handlebars", engine());
app.set("views", path.join(__dirname, "views")); // Corrige la ubicación de las vistas
app.set("view engine", "handlebars");

// Registro del helper en Handlebars
Handlebars.registerHelper("ifEzquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

initializePassport();

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }); // Corrige la conexión a MongoDB
// Manejo la conexión a MongoDB
mongoose.connection.once("open", () => {
  console.log("Conectado a MongoDB");
});

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Corrige la ubicación de los archivos estáticos

// Rutas
app.use(addLogger);
app.use(errorHandler);
app.use(passport.initialize());

// Expone isSuperAdmin a todas las vistas del layout
app.use((req, res, next) => {
  res.locals.isSuperAdmin = req.session?.user?.role === "superadmin";
  next();
});
app.use("/auth", authRouter);
app.use("/api/products", authMiddleware, productsRouter);
app.use("/superadmin", superAdminRouter);
app.get("/publicKey", getPublicKey);

app.get("/loggerTest", (req, res) => {
  req.logger.warning("ALERTA!");
  res.send({ message: "Prueba de logger" });
});
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de la app",
      description: "API Ecommerce Backend Coder",
    },
  },
  apis: [`${__dirname}/src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Redirección
app.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth");
  } else {
    res.redirect("/api/products");
  }
});

// Exportación del módulo
export default app;