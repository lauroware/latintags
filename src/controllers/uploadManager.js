import cloudinary from "../config/cloudinary.js";

/**
 * POST /upload
 * Recibe una imagen via multipart/form-data (campo "image"),
 * la sube a Cloudinary y devuelve la URL segura.
 * Solo usuarios autenticados (admin/admin1/admin2/superadmin).
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No se recibió ninguna imagen." });
    }

    // Subir buffer a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "latintags",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [{ width: 800, crop: "limit" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.status(200).json({
      status: "success",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return res.status(500).json({ status: "error", message: "Error al subir la imagen." });
  }
};

export { uploadImage };