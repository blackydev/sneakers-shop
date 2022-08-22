const { Product } = require("../models/product");

exports.increaseProductStock = async (id, quantity) => {
  let product = await Product.findByIdAndUpdate(
    id,
    {
      $inc: { numberInStock: 1 * quantity },
    },
    { new: true }
  );
  return product ? true : false;
};

exports.decreaseUnhiddenProductStock = async (id, quantity) => {
  let product = await Product.findOneAndUpdate(
    { _id: id, hidden: { $in: [false, null] } },
    {
      $inc: { numberInStock: -1 * quantity },
    },
    { new: true }
  );
  return product ? true : false;
};
