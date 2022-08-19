const { Product } = require("../models/product");
const { findProductById } = require("./products");
const mongoose = require("mongoose");
const validateObjectId = require("../functions/validateObjectId");
const { validate } = require("../models/cart");

exports.createCartFromJSON = async (cartBody) => {
  const { error } = validate(cartBody);
  if (error) return error;

<<<<<<< Updated upstream
  const products = [];
  for (const el of cartBody.products) {
    let product;
    const id = el.productId;

    const isValid = validateObjectId(id);
    if (!isValid)
      return new Error("Product with given id doesn't exists: " + id);

=======
  const cart = [];
  for (const el of cartBody) {
    const id = el.product._id;

    let product = await findProductById(id);
    if (!product)
      return new Error("The product with the given ID was not found.");
>>>>>>> Stashed changes
    try {
      product = await findProductById(id);
      if (!product)
        return new Error("Product with given id doesn't exists: " + id);

      if (!el.quantity) el.quantity = 1;
      product = await Product.findByIdAndUpdate(
        id,
        { $inc: { numberInStock: -1 * el.quantity } },
        { new: true }
      );
    } catch (ex) {
      return ex;
    }

    products.push({
      productId: product._id,
      price: product.price,
      quantity: el.quantity,
    });
  }

  cart = {
    products: products,
  };

  return cart;
};
