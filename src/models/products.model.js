import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, max: 100 },
    emailP: { type: String, required: true, max: 100 },
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    fechadenacimiento: { type: String, required: true },
    medicamentos: { type: String, required: true, max: 100 },
    enfermedades: { type: String, required: true, max: 100 },
    nombredelhumano: { type: String, required: true },
    telefono: { type: String, required: true, max: 100 },
    thumbnail: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tag: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

productSchema.plugin(paginate);
const productModel = mongoose.model("products", productSchema);

productSchema.methods.isPet = function () {
  return product.userId === "pet";
};

productSchema.methods.isPerson = function () {
  return product.userId === "person";
};

export { productModel, productSchema };
