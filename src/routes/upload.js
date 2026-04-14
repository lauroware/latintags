import { Router } from "express";
import upload from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/index.js";
import { uploadImage } from "../controllers/uploadManager.js";

const uploadRouter = Router();

// Solo usuarios autenticados pueden subir imágenes
uploadRouter.post("/", authMiddleware, upload.single("image"), uploadImage);

//probando

export default uploadRouter;