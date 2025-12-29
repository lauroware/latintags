import { STRIPE_PUBLIC_KEY } from "../config/index.config.js";

const isUserAdmin = (user) => {
  return user && user.role === "admin";
};

const isUserPremium = (user) => {
  return user && user.role === "premium";
};

export const getPublicKey = async (req, res) => {
  const publicKey = STRIPE_PUBLIC_KEY;
  res.json({ publicKey });
};
