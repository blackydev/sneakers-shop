const {
  increaseProductStock,
  decreaseUnhiddenProductStock,
} = require("../products");
const { validate } = require("../../models/order/cart");

exports.createCart = async (cartBody) => {
  const { error } = validate(cartBody);
  if (error) throw error;

  const products = [];
  let amount = 0;
  for (const element of cartBody.products) {
    if (!element.quantity) element.quantity = 1;

    let product = await decreaseUnhiddenProductStock(
      element.productId,
      element.quantity
    ); // TODO: implement better update

    if (!product)
      for (const previousElement of cartBody.products) {
        if (element.productId === previousElement.productId)
          throw new Error("The product with the given ID was not found.");

        await increaseProductStock(
          previousElement.productId,
          previousElement.quantity
        );
      }

    products.push({
      productId: product.productId,
      name: product.name,
      cost: product.price,
      quantity: element.quantity,
    });

    amount += product.price * element.quantity;
  }

  cart = {
    products: products,
    amount: amount,
  };

  return cart;
};
