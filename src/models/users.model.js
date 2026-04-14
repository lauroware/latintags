import mongoose from "mongoose";
import { createHash } from "../utils/index.js";

const userSchema = new mongoose.Schema({
  tag:        { type: String, required: true, unique: true },
  first_name: { type: String, default: "", get: capitalizeFirstLetter },
  last_name:  { type: String, default: "", get: capitalizeFirstLetter },
  email:      { type: String, default: "", sparse: true },
  age:        { type: Number, default: 0 },
  password:   { type: String, required: true },
  role:       { type: String, default: "user" },
  lastLoginDate: { type: Date, default: null },
});

userSchema.virtual("user").get(function () {
  return `${this.first_name} ${this.last_name}`;
});
function capitalizeFirstLetter(v) {
  if (typeof v === "string" && v.length > 0) {
    return v.charAt(0).toUpperCase() + v.substring(1);
  } else {
    return v; // Devuelve la cadena sin modificar si es vacía o no es una cadena
  }
}

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.methods.isAdmin1 = function () {
  return this.role === "admin1";
};

userSchema.methods.isAdmin2 = function () {
  return this.role === "admin2";
};

userSchema.pre("save", function (next) {
  const user = this;
  user.password = createHash(this.password);
  next();
});

const userModel = mongoose.model("users", userSchema);

export { userModel, userSchema };