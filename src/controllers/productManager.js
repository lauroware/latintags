import {
  serviceGetProductById,
  serviceGetProducts,
  serviceUpdateProduct,
  serviceProductsCreatedBy,
} from "../services/product.js";
import { userModel } from "../models/users.model.js";

import { productModel } from "../models/products.model.js";

const isUserAdmin = (user) => {
  return user && user.role === "admin";
};

const isUserAdmin1 = (user) => {
  return user && user.role === "admin1";
};

const isUserAdmin2 = (user) => {
  return user && user.role === "admin2";
};

const isPet = (product) => {
  return product?.userId === "pet";
};

const isPerson = (product) => {
  return product?.userId === "person";
};

const isUserPremium = (user) => {
  return user && user.role === "premium";
};

const getProducts = async (req, res) => {
  let user = req.session.user;
  try {
    const products = await serviceGetProducts(req.query);
    let isAdmin = isUserAdmin(user);
    let isAdmin1 = isUserAdmin1(user);
    let isAdmin2 = isUserAdmin2(user);
    let isPremium = isUserPremium(user);
    const hasNextPage = products.hasNextPage;
    const hasPrevPage = products.hasPrevPage;
    const sort = products.sort;
    const page = products.page;
    const query = products.query;
    const allCategories = products.docs.map((element) => element.category);
    const categories = allCategories.filter(
      (element, index, self) => self.indexOf(element) === index
    );
    res.status(200).render("home", {
      title: "Products",
      style: "index.css",
      products,
      hasNextPage,
      hasPrevPage,
      sort,
      page,
      query,
      categories,
      user,
      isPremium,
      isAdmin,
      isAdmin1,
      isAdmin2,
    });
  } catch (error) {
    res.status(500).send({ message: "Error trying to get all products" });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.pid;
  let user = req.session.user;

  try {
    // Obtener los detalles del producto
    let product = await serviceGetProductById(id);

    // Verificar si el usuario es administrador o premium
    let isAdmin = isUserAdmin(user);
    let isAdmin1 = isUserAdmin1(user);
    let isAdmin2 = isUserAdmin2(user);
    let isPremium = isUserPremium(user);
    let isPetFromProducts = isPet(product);
    let isPersonFromProducts = isPerson(product);

    // Renderizar la plantilla con los datos del producto y otras variables
    res.render("details", {
      product,
      user,
      isPetFromProducts,
      isPersonFromProducts,
      isAdmin,
      isAdmin1,
      isAdmin2, // Pasar la variable isAdmin1 a la plantilla
      isPremium,
      title: "Products",
      style: "index.css",
    });
  } catch (error) {
    res.status(500).send({ message: "Error trying to get a product by id" });
  }
};

const getProductsFromPremiumUsers = async (req, res) => {
  let user = req.session.user;
  try {
    let allProducts = await serviceProductsCreatedBy(user._id);
    let isPremium = isUserPremium(user);
    res.render("premiumUser", {
      user,
      isPremium,
      allProducts,
      style: "index.css",
    });
  } catch (error) {
    res.status(500).send({ message: "Error trying to get a product by id" });
  }
};

const updateProduct = async (req, res) => {
  const { pid, updates } = req.body;
  try {
    const result = await serviceUpdateProduct(pid, updates);
    if (result.status === "error") {
      res.status(404).send({ message: result.payload });
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating the product" });
  }
};

const updateProductEmail = async (req, res) => {
  try {
    const { pid } = req.params;
    const emailRaw = req.body?.email || req.body?.emailP;

    const newEmail = String(emailRaw || "").trim().toLowerCase();
    if (!newEmail) {
      return res.status(400).send({ message: "Falta el email" });
    }

    // 1) Traer producto para saber su tag
    const product = await productModel.findById(pid).lean();
    if (!product) {
      return res.status(404).send({ message: "Producto inexistente" });
    }

    // 2) Seguridad: solo dueño del tag o admin/premium
    const user = req.session?.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const isAdmin = user.role === "admin";
    const isPremium = user.role === "premium";
    const isOwner = String(user.tag) === String(product.tag);

    if (!isAdmin && !isPremium && !isOwner) {
      return res.status(401).send({
        status: "Unauthorized",
        message: "Unauthorized to do this action",
        code: 401,
      });
    }

    // 3) Actualizar Product (email real)
    const updatedProduct = await productModel.findByIdAndUpdate(
      pid,
      { $set: { email: newEmail, emailP: newEmail } },
      { new: true }
    );

    // 4) ✅ Sincronizar User (para que restore password funcione)
    await userModel.updateOne(
      { tag: updatedProduct.tag },
      { $set: { email: newEmail, emailP: newEmail } }
    );

    return res.status(200).send(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error updating product email" });
  }
};


const getAdminView = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const products = await productModel.find({ createdBy: idUsuario });
    console.log(products); // Verifica los datos que estás enviando
    res.render("adminView", { products });
  } catch (error) {
    console.error("Error al obtener los productos del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const getAdminView1 = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const products = await productModel.find({ createdBy: idUsuario });
    console.log(products); // Verifica los datos que estás enviando
    res.render("adminView1", { products });
  } catch (error) {
    console.error("Error al obtener los productos del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const getAdminView2 = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const products = await productModel.find({ createdBy: idUsuario });
    console.log(products); // Verifica los datos que estás enviando
    res.render("adminView2", { products });
  } catch (error) {
    console.error("Error al obtener los productos del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export {
  getProducts,
  getProductById,
  updateProduct,
  updateProductEmail, // 👈 nuevo
  getProductsFromPremiumUsers,
  getAdminView,
  getAdminView1,
  getAdminView2,
};
