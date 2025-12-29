import { Router } from "express";

const mockRouter = Router();

const isUserAdmin = (user) => {
  return user && user.role === "admin";
};

export default mockRouter;
