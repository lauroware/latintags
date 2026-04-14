import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { productModel } from "../models/products.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carpeta donde se guardan los QR generados: public/qr/
const QR_DIR = path.join(__dirname, "../../public/qr");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

const BASE_URL =
  process.env.BASE_URL || "https://tags.latinmerch.com.ar";

/**
 * GET /qr/:pid
 * Genera el QR del producto, lo guarda en public/qr/<pid>.png
 * y lo devuelve como descarga directa.
 */
const generateQR = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel.findById(pid).lean();
    if (!product) {
      return res.status(404).json({ status: "error", message: "Perfil no encontrado." });
    }

    const url = `${BASE_URL}/api/products/${pid}`;
    const filePath = path.join(QR_DIR, `${pid}.png`);

    // Generar PNG y guardarlo en disco
    await QRCode.toFile(filePath, url, {
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Devolver el archivo como descarga
    res.setHeader("Content-Disposition", `attachment; filename="qr-tag-${product.tag}.png"`);
    res.setHeader("Content-Type", "image/png");
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error generando QR:", error);
    res.status(500).json({ status: "error", message: "Error al generar el QR." });
  }
};

/**
 * GET /qr/:pid/view
 * Devuelve el QR inline (para mostrar en pantalla, no como descarga).
 */
const viewQR = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel.findById(pid).lean();
    if (!product) {
      return res.status(404).json({ status: "error", message: "Perfil no encontrado." });
    }

    const url = `${BASE_URL}/api/products/${pid}`;

    // Devolver como data URL base64 (útil para mostrar en la vista sin guardar)
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    res.json({ status: "success", qr: dataUrl, url });
  } catch (error) {
    console.error("Error generando QR:", error);
    res.status(500).json({ status: "error", message: "Error al generar el QR." });
  }
};

export { generateQR, viewQR };