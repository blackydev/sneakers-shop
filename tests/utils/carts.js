const { Cart } = require("../../models/cart");
const { createProducts, deleteProducts } = require("./products");

const createCart = async (products, amounts) => {
  if (!products) products = await createProducts();
  if (!amounts) amounts = [1, 3, 2];

  const items = [];
  let i = 0;
  for (const product of products)
    items.push({
      product: product._id,
      price: product.price,
      amount: amounts[i],
    });

  const cart = new Cart({ items: items });
  await cart.save();
  return cart;
};

const deleteCarts = async () => {
  await Cart.deleteMany({});
  await deleteProducts();
};

module.exports = { createCart, deleteCarts };
