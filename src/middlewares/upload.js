import multer from "multer";

const storage = multer.memoryStorage();

export default multer({ storage, limits: { fileSize: 700 * 1024 } });