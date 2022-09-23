const { Product } = require("../models/product");

const increaseProductStock = async (id, quantity) => {
  let product = await Product.findByIdAndUpdate(
    id,
    {
      $inc: { numberInStock: quantity },
    },
    { new: true }
  );
  return product;
};

const decreaseUnhiddenProductStock = async (id, quantity) => {
  let product = await Product.findOneAndUpdate(
    { _id: id, hidden: { $in: [false, null] } },
    {
      $inc: { numberInStock: -1 * quantity },
    },
    { new: true }
  );
  return product;
};

module.exports = {
  increaseProductStock,
  decreaseUnhiddenProductStock,
};
