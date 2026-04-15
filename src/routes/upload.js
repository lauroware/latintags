import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadManager.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 700 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Solo JPG, PNG o WEBP."));
  },
});

const uploadRouter = Router();

uploadRouter.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ status: "error", message: "La imagen no puede superar 700KB." });
    }
    if (err) return res.status(400).json({ status: "error", message: err.message });
    next();
  });
}, uploadImage);

export default uploadRouter;