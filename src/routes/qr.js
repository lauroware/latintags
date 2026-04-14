import { Router } from "express";
import { superAdminOnly } from "../middlewares/index.js";
import { generateQR, viewQR } from "../controllers/qrManager.js";

const qrRouter = Router();

// Solo superadmin puede generar y descargar QR
qrRouter.get("/:pid", superAdminOnly, generateQR);
qrRouter.get("/:pid/view", superAdminOnly, viewQR);

export default qrRouter;