import { Router } from "express";
import { superAdminOnly } from "../middlewares/index.js";
import {
  getSuperAdminPanel,
  getSuperAdminUsers,
  createTag,
  deleteTag,
} from "../controllers/superAdminManager.js";

const superAdminRouter = Router();

superAdminRouter.get("/", superAdminOnly, getSuperAdminPanel);
superAdminRouter.get("/users", superAdminOnly, getSuperAdminUsers);
superAdminRouter.post("/create", superAdminOnly, createTag);
superAdminRouter.delete("/tag/:tag", superAdminOnly, deleteTag);

export default superAdminRouter;