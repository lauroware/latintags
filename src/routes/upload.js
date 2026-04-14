import { Router } from "express";
import multer from "multer";
import upload from "../middlewares/upload.js";
import { uploadImage } from "../controllers/uploadManager.js";

const uploadRouter = Router();

uploadRouter.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ status: "error", message: "La imagen no puede superar 700KB." });
    }
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }
    next();
  });
}, uploadImage);

export default uploadRouter;