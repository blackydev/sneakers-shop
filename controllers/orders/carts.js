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
  for (const element of cartBody.products) {
    if (!element.quantity) element.quantity = 1;

    let finalElem = await decreaseUnhiddenProductStock(
      element.productId,
      element.quantity
    ); // TODO: implement better update

    if (!finalElem)
      for (const previousElement of cartBody.products) {
        if (element.productId === previousElement.productId)
          return new Error("The product with the given ID was not found.");

        await increaseProductStock(
          previousElement.productId,
          previousElement.quantity
        );
      }

    products.push({
      productId: finalElem._id,
      name: finalElem.name,
      cost: finalElem.price,
      quantity: element.quantity,
    });

    amount += finalElem.price * element.quantity;
  }

  cart = {
    products: products,
    amount: amount,
  };

  return cart;
};
