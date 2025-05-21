//Array de metodos (C R U D)
const productsController = {};
import productsModel from "../models/Products.js";

// SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};


// SELECT (un solo producto)
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);  // Busca el producto por _id
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);  // Devuelve el producto encontrado
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};


// INSERT
productsController.createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "product saved" });
};

// DELETE
productsController.deleteProducts = async (req, res) => {
  const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json({ message: "product deleted" });
};

// UPDATE
productsController.updateProducts = async (req, res) => {
  // Solicito todos los valores
  const { name, description, price, stock } = req.body;
  // Actualizo
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "product updated" });
};

export default productsController;
