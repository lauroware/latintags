/**
 * Script para crear el usuario superadmin.
 * Uso: node scripts/createSuperAdmin.js
 *
 * Podés cambiar TAG, EMAIL y PASSWORD antes de correrlo.
 * Correrlo una sola vez — si el tag o email ya existen, avisa y no duplica.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Cargar .env desde la raíz del proyecto
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "../.env") });

// ─── CONFIGURÁ ESTOS VALORES ───────────────────────────────────────────────
const TAG      = "0000";
const EMAIL    = "lauro.ware@economicas.uba.ar";
const PASSWORD = "Yanoesgingo1$";
const NOMBRE   = "Super";
const APELLIDO = "Admin";
// ───────────────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  tag:        { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  role:       { type: String, default: "user" },
  lastLoginDate: { type: Date, default: null },
});

const User = mongoose.model("users", userSchema);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  console.log("Conectado a MongoDB.");

  const existingTag   = await User.findOne({ tag: TAG });
  const existingEmail = await User.findOne({ email: EMAIL });

  if (existingTag) {
    console.error(`✗ Ya existe un usuario con tag "${TAG}". Cambiá el valor TAG en el script.`);
    process.exit(1);
  }
  if (existingEmail) {
    console.error(`✗ Ya existe un usuario con email "${EMAIL}". Cambiá el valor EMAIL en el script.`);
    process.exit(1);
  }

  const hashedPassword = bcrypt.hashSync(PASSWORD, bcrypt.genSaltSync(10));

  await User.create({
    tag:        TAG,
    first_name: NOMBRE,
    last_name:  APELLIDO,
    email:      EMAIL,
    age:        0,
    password:   hashedPassword,
    role:       "superadmin",
  });

  console.log(`✓ Superadmin creado correctamente.`);
  console.log(`  Tag:      ${TAG}`);
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`\n  Entrá en /auth/login usando el tag y la contraseña de arriba.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});