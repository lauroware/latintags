import { Router } from "express";
import { superAdminOnly } from "../middlewares/index.js";
import {
  getSuperAdminPanel,
  createTag,
  deleteTag,
} from "../controllers/superAdminManager.js";

const superAdminRouter = Router();

// Panel principal
superAdminRouter.get("/", superAdminOnly, getSuperAdminPanel);

// Crear usuario + perfil en un paso
superAdminRouter.post("/create", superAdminOnly, createTag);

// Eliminar usuario + perfil por tag
superAdminRouter.delete("/tag/:tag", superAdminOnly, deleteTag);

export default superAdminRouter;