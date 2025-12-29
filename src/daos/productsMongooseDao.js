import { ContenedorMongoDb } from "../persistence/mongoDbPersistence.js";
import { productModel } from "../models/products.model.js";
import ProductDTO from "../DTOs/products.dto.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/customError.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { userModel } from "../models/users.model.js";

const productDtoFromObject = (obj) => {
  const {
    _id,
    email,
    emailP,
    title,
    thumbnail,
    description,
    fechadenacimiento,
    medicamentos,
    enfermedades,
    nombredelhumano,
    telefono,
    tag,
    userId,
  } = obj;
  return new ProductDTO(
    _id,
    email,
    emailP,
    title,
    thumbnail,
    description,
    fechadenacimiento,
    medicamentos,
    enfermedades,
    nombredelhumano,
    telefono,
    tag,
    userId
  );
};

const allProductsFromObject = (products) => {
  return products.map((product) => {
    const {
      _id,
      email,
      emailP,
      title,
      description,
      fechadenacimiento,
      medicamentos,
      enfermedades,
      nombredelhumano,
      telefono,
      thumbnail,
      tag,
      userId,
    } = product;
    return new ProductDTO(
      _id,
      email,
      emailP,
      title,
      description,
      fechadenacimiento,
      medicamentos,
      enfermedades,
      nombredelhumano,
      telefono,
      thumbnail,
      tag,
      userId
    );
  });
};

class ProductsDAOMongoDb extends ContenedorMongoDb {
  async getProducts({ query, limit, page, sort }) {
    const setLimit = limit ? limit : 10;
    const setPage = page ? page : 1;
    const setSort = sort ? { price: sort } : {};
    const setQuery = query ? { category: query } : {};
    const options = {
      limit: setLimit,
      page: setPage,
      sort: setSort,
      lean: true,
    };
    try {
      const products = await productModel.paginate(setQuery, options);
      return { ...products, setQuery, options };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(pid) {
    try {
      const product = await productModel.findOne({ _id: pid });
      if (!product) {
        throw new CustomError(`Product with id: ${pid} not found`, 404);
      }
      return productDtoFromObject(product);
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProduct(product, uid) {
    try {
      const {
        email,
        title,
        description,
        fechadenacimiento,
        medicamentos,
        enfermedades,
        nombredelhumano,
        telefono,
        thumbnail,
        tag,
      } = product;
      if (
        !email ||
        !title ||
        !description ||
        !fechadenacimiento ||
        !thumbnail ||
        !medicamentos ||
        !enfermedades ||
        !nombredelhumano ||
        !telefono ||
        !tag
      ) {
        throw new CustomError(
          "Error trying to create Product: Missing required fields",
          EErrors.INVALID_DATA
        );
      } else {
        const newProduct = await this.save({ ...product, createdBy: uid });
        return productDtoFromObject(newProduct);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllProductsCreatedBy(uid) {
    try {
      const allProducts = await productModel.find({ createdBy: uid });
      return allProductsFromObject(allProducts);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(pid, updates) {
  try {
    // Verifica si hay propiedades a actualizar en el objeto updates
    if (Object.keys(updates).length === 0) {
      return {
        status: "error",
        payload: "No hay propiedades para actualizar",
      };
    }

    // Actualiza el producto con las propiedades proporcionadas en el objeto updates
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: pid },
      updates,
      { new: true }
    );

    // Verifica si el producto existe y ha sido actualizado
    if (!updatedProduct) {
      return { status: "error", payload: "Producto inexistente" };
    }

    // ✅ Si se actualiza el email en Product, sincronizar también en User (por tag)
    if (updates.email || updates.emailP) {
      const newEmail = String(updates.email || updates.emailP)
        .trim()
        .toLowerCase();

      await userModel.updateOne(
        { tag: updatedProduct.tag },
        { $set: { email: newEmail, emailP: newEmail } }
      );
    }

    return updatedProduct;
  } catch (error) {
    throw new Error(error);
  }
}

  async getAllProductsFromDTO() {
    try {
      const allProducts = await productModel.find();
      return allProductsFromObject(allProducts);
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  async deleteProductById(pid) {
    try {
      const deletedProduct = await this.delete(pid);
      return productDtoFromObject(deletedProduct);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAllProducts() {
    try {
      const deleteAll = await this.deleteAll();
      return deleteAll;
    } catch (error) {
      throw new Error(error);
    }
  }
}



export default ProductsDAOMongoDb;
