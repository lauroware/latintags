import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    email:            { type: String, default: "" },
    mostrarEmail:     { type: Boolean, default: false },
    title:            { type: String, default: "" },
    description:      { type: String, default: "" },
    fechadenacimiento:{ type: String, default: "" },
    medicamentos:     { type: String, default: "" },
    enfermedades:     { type: String, default: "" },
    nombredelhumano:  { type: String, default: "" },
    telefono:         { type: String, default: "" },
    thumbnail:        { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tag:    { type: String, required: true },
    userId: { type: String, required: true }, // "pet" | "object" | "person"
  },
  { versionKey: false }
);

productSchema.plugin(paginate);
const productModel = mongoose.model("products", productSchema);

productSchema.methods.isPet = function () {
  return this.userId === "pet";
};

productSchema.methods.isPerson = function () {
  return this.userId === "person";
};

productSchema.methods.isObject = function () {
  return this.userId === "object";
};

export { productModel, productSchema };