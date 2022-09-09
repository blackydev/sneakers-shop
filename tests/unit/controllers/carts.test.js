const mongoose = require("mongoose");
const _ = require("lodash");
const { Product } = require("../../../models/product");
const { createCart } = require("../../../controllers/orders/carts");

const products = [
  {
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    slogan: "It's awesome movie",
    price: 15,
    numberInStock: 255,
    image: "./tests/files/star wars 1.png",
  },
  {
    name: "Star Wars IV",
    description:
      "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    price: 10,
    numberInStock: 5,
    release: new Date("1979-07-19").toISOString(),
    image: "./tests/files/star wars 1.png",
  },
];

describe("carts", () => {
  let server;

  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await Product.deleteMany({});
  });

  describe("createCart", () => {
    let productsId;

    beforeEach(async () => {
      let productsDB = await Product.insertMany(products);
      productsId = [];
      for (const product of productsDB) productsId.push(product._id);
    });

    it("should return cart if products are valid", async () => {
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: productsId[1], quantity: 2 },
        ],
      };

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCart(jsonCart);

      expect(result).toMatchObject({
        products: [
          { cost: 15, productId: productsId[0], quantity: 1 },
          { cost: 10, productId: productsId[1], quantity: 2 },
        ],
        amount: 35,
      });
      expect(_.isError(result)).toBeFalsy();
    });

    it("should return error if product with given id doesn't exist", async () => {
      const fakeId = mongoose.Types.ObjectId();
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: fakeId, quantity: 2 },
        ],
      };

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCart(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });

    it("should return error if product id is invalid", async () => {
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: 123, quantity: 2 },
        ],
      };

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCart(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });

    it("should return error if client send products with fake price", async () => {
      const cartBody = {
        products: [
          { productId: productsId[0], price: 45 },
          { productId: 123, quantity: 2, price: 30 },
        ],
      };

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCart(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });
  });
});
