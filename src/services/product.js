import ProductRepository from "../repositories/products.repository.js";
const productRepository = new ProductRepository();

const serviceGetProducts = async (filters) => {
  let products = await productRepository.getProducts(filters);
  return products;
};

const serviceGetPetByUserId = async (userId) => {
  let product = await productRepository.getPetByUserId(userId);
  return product;
};

const serviceGetProductById = async (pid) => {
  let product = await productRepository.getProductById(pid);
  return product;
};

const serviceProductsFromDTO = async () => {
  let allProducts = await productRepository.getProductsDTO();
  return allProducts;
};

const serviceUpdateProduct = async (pid, updates) => {
  let updatedProduct = await productRepository.updateProduct(pid, updates);
  return updatedProduct;
};

const serviceProductsFromUser = async (userId) => {
  // Asegúrate de que esta función filtra los productos por userId
  const products = await Product.find({ userId: userId });
  return products;
};

const serviceProductsCreatedBy = async (productModel, userId) => {
  try {
    // Realizar la consulta para obtener los productos creados por el usuario
    const allProductsCreatedByUser = await productModel.find({
      createdBy: userId,
    });
    return allProductsCreatedByUser;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  serviceGetProductById,
  serviceGetProducts,
  serviceUpdateProduct,
  serviceProductsFromDTO,
  serviceProductsCreatedBy,
  serviceGetPetByUserId,
};
