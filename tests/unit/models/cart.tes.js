const { deleteCartsInterval } = require("../../../models/cart");
const { createCart } = require("../../integration/carts.test");
const { createProducts } = require("../../integration/products.test");
const jest = require("jest");
jest.useFakeTimers();

describe("cart model", () => {
  describe("JWT", () => {
    it("should delete unupdated carts", async () => {
      const products = await createProducts();
      const cart = await createCart(products, [1, 1, 1]);
    });
  });
});
