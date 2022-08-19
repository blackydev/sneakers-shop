const { Product } = require("../models/product");
const globalQuery = { hidden: { $in: [false, null] } };

exports.findProducts = async () => {
  const products = await Product.find(globalQuery);
  return products;
};

exports.findProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || product.hidden) return;
  return product;
};

exports.findProductByIdAndUpdate = async (id, update) => {
  const query = Object.assign({ _id: id }, globalQuery);
  const product = await Product.findOneAndUpdate(query, update, { new: true });
  if (!product) return;
  return product;
};

exports.findProductByName = async (name) => {
  const product = await Product.find({ name: name });
  if (Object.keys(product).length === 0) return;
  return product;
};
