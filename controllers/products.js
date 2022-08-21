const { Product } = require("../models/product");
const globalQuery = { hidden: { $in: [false, null] } };

exports.findProducts = () => {
  return Product.find(globalQuery);
};

exports.findProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || product.hidden) return;
  return product;
};

exports.findProductByIdAndUpdate = (id, update) => {
  const query = Object.assign({ _id: id }, globalQuery);
  return Product.findOneAndUpdate(query, update, { new: true });
};

exports.findProductByName = async (name) => {
  const product = await Product.find({ name: name });
  if (Object.keys(product).length === 0) return;
  return product;
};
