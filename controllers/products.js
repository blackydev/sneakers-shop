const { Product } = require("../models/product");
const query = { hidden: { $in: [false, null] } };

exports.findProducts = async () => {
  const products = await Product.find(query);
  return products;
};

exports.findProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || product.hidden) return;
  return product;
};

exports.findProductByName = async (name) => {
  const product = await Product.find({ name: name });
  if (Object.keys(product).length === 0) return;
  return product;
};
