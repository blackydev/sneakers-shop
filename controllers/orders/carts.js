const {
  findUnhiddenProduct,
  increaseProductStock,
  decreaseUnhiddenProductStock,
} = require("../products");
const { validate } = require("../../models/order/cart");
const winston = require("winston");

exports.initCart = async (cartBody) => {
  const { error } = validate(cartBody);
  if (error) return error;

  const products = [];
  let amount = 0;
  for (const product of cartBody.products) {
    if (!product.quantity) product.quantity = 1;

    let updated = await decreaseUnhiddenProductStock(
      product.productId,
      product.quantity
    );

    if (!updated)
      for (const prevProduct of cartBody.products) {
        if (product.productId === prevProduct.productId)
          return new Error("The product with the given ID was not found.");

        await increaseProductStock(prevProduct.productId, prevProduct.quantity);
      }

    products.push({
      productId: updated._id,
      name: updated.name,
      cost: updated.price,
      quantity: product.quantity,
    });

    totalCost += updated.price * product.quantity;
  }

  cart = {
    products: products,
    totalCost: amount,
  };

  return cart;
};
