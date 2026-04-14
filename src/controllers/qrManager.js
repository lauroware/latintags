import QRCode from "qrcode";
import { productModel } from "../models/products.model.js";

const BASE_URL = process.env.BASE_URL || "https://tags.latinmerch.com.ar";

/**
 * GET /qr/:pid
 * Genera el QR en memoria y lo devuelve como PNG descargable.
 * Compatible con entornos serverless (Vercel) — no escribe en disco.
 */
const generateQR = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel.findById(pid).lean();
    if (!product) {
      return res.status(404).json({ status: "error", message: "Perfil no encontrado." });
    }

    const url = `${BASE_URL}/api/products/${pid}`;

    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename="qr-tag-${product.tag}.png"`);
    res.send(buffer);
  } catch (error) {
    console.error("Error generando QR:", error);
    res.status(500).json({ status: "error", message: "Error al generar el QR." });
  }
};

/**
 * GET /qr/:pid/view
 * Devuelve el QR como base64 JSON (para mostrar en pantalla).
 */
const viewQR = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel.findById(pid).lean();
    if (!product) {
      return res.status(404).json({ status: "error", message: "Perfil no encontrado." });
    }

    const url = `${BASE_URL}/api/products/${pid}`;
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