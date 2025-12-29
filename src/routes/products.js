import { Router } from "express";
const productsRouter = Router();
import {
  getProducts,
  getProductById,
  updateProduct,
} from "../controllers/productManager.js";
import { premiumOrAdmin } from "../middlewares/index.js";
import { adminOnly1 } from "../middlewares/index.js";

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById); // Aplica el middleware unrestrictedAccess aquí
productsRouter.post("/", premiumOrAdmin);
productsRouter.put("/:pid", premiumOrAdmin, updateProduct);

export default productsRouter;
