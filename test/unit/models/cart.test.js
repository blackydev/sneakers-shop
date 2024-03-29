const { Cart, deleteCart } = require("../../../models/cart");
const { createCart, deleteCarts } = require("../../utils/carts");
const { createProducts, deleteProducts } = require("../../utils/products");
const { Product } = require("../../../models/product");

describe("cart", () => {
  let server;
  beforeEach(async () => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
    await deleteCarts();
  });

  describe("deleteCart function", () => {
    it("should increase stock of product after cart deletion", async () => {
      const products = await createProducts();
      const product = products[0];
      const cart = await createCart([product], [1]);
      const { numberInStock: stockBefore } = await Product.findById(
        product._id
      );
      await deleteCart(cart);
      const { numberInStock: stockAfter } = await Product.findById(product._id);
      expect(stockAfter > stockBefore).toBeTruthy();
    });

    it("should delete cart", async () => {
      const cart = await createCart();
      await deleteCart(cart);
      const result = await Cart.findById(cart._id);
      expect(result).toBeFalsy();
    });
  });
});
