const {
  increaseProductStock,
  decreaseUnhiddenProductStock,
} = require("../products");
const { validate } = require("../../models/order/cart");

exports.createCart = async (cartBody) => {
  const { error } = validate(cartBody);
  if (error) return error;

  const products = [];
  let amount = 0;
  for (const product of cartBody.products) {
    if (!product.quantity) product.quantity = 1;

    let finalProduct = await decreaseUnhiddenProductStock(
      product._id,
      product.quantity
    ); // TODO: implement better update

    if (!finalProduct)
      for (const previousProduct of cartBody.products) {
        if (product._id === previousProduct._id)
          return new Error("The product with the given ID was not found.");

        await increaseProductStock(
          previousProduct._id,
          previousProduct.quantity
        );
      }

    products.push({
      _id: finalProduct._id,
      name: finalProduct.name,
      cost: finalProduct.price,
      quantity: product.quantity,
    });

    amount += finalProduct.price * product.quantity;
  }

  cart = {
    products: products,
    amount: amount,
  };

  return cart;
};

exports.recreateReturnedCart = async (cartBody) => {
  for (const product of cartBody.products) {
    let finalProduct = await decreaseUnhiddenProductStock(
      product._id,
      product.quantity
    );

    if (!finalProduct)
      for (const previousProduct of cartBody.products) {
        if (product._id === previousProduct._id)
          return new Error("The product with the given ID was not found.");

        await increaseProductStock(
          previousProduct._id,
          previousProduct.quantity
        );
      }
  }

  return cart;
};

exports.returnCart = async (cart) => {
  for (let product of cart.products) {
    const finalProduct = await increaseProductStock(
      product._id,
      product.quantity
    );
    if (!finalProduct)
      return new Error("The product with the given ID was not found.");
  }

  return true;
};
