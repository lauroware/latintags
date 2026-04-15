import { Router } from "express";
const productsRouter = Router();
import {
  getProducts,
  getProductById,
  updateProduct,
  toggleModoPerdido,
} from "../controllers/productManager.js";
import { premiumOrAdmin } from "../middlewares/index.js";
import { adminOnly1 } from "../middlewares/index.js";

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", premiumOrAdmin);
productsRouter.put("/:pid", premiumOrAdmin, updateProduct);
productsRouter.put("/:pid/perdido", toggleModoPerdido);

export default productsRouter;