const mongoose = require("mongoose");
const _ = require("lodash");
const { Product } = require("../../../models/product");
<<<<<<< Updated upstream
const { createCartFromJSON } = require("../../../controllers/carts");
=======
const { createCart } = require("../../../controllers/carts");
const winston = require("winston");
>>>>>>> Stashed changes

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

  describe("createCartFromJSON", () => {
    let productsId;

    beforeEach(async () => {
      let productsDB = await Product.insertMany(products);
      productsId = [];
      for (const product of productsDB) productsId.push(product._id);
    });

    it("should return cart if products are valid", async () => {
<<<<<<< Updated upstream
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: productsId[1], quantity: 2 },
        ],
      };
=======
      const cartBody = [
        { product: { _id: productsId[0] } },
        { product: { _id: productsId[1] }, quantity: 2 },
      ];
>>>>>>> Stashed changes

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCartFromJSON(jsonCart);

<<<<<<< Updated upstream
      expect(result).toMatchObject({
        products: [
          { price: 15, productId: productsId[0], quantity: 1 },
          { price: 10, productId: productsId[1], quantity: 2 },
        ],
      });
=======
      expect(result).toMatchObject([
        {
          product: { _id: productsId[0], name: products[0].name },
          quantity: 1,
        },
        {
          product: { _id: productsId[1], name: products[1].name },
          quantity: 2,
        },
      ]);
>>>>>>> Stashed changes
      expect(_.isError(result)).toBeFalsy();
    });

    it("should return error if product with given id doesn't exist", async () => {
      const fakeId = mongoose.Types.ObjectId();
<<<<<<< Updated upstream
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: fakeId, quantity: 2 },
        ],
      };
=======
      const cartBody = [
        { product: { _id: productsId[0] } },
        { product: { _id: fakeId }, quantity: 2 },
      ];
>>>>>>> Stashed changes

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCartFromJSON(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });

    it("should return error if product id is invalid", async () => {
<<<<<<< Updated upstream
      const cartBody = {
        products: [
          { productId: productsId[0] },
          { productId: 123, quantity: 2 },
        ],
      };
=======
      const cartBody = [
        { product: { _id: productsId[0] } },
        { product: { _id: 123 }, quantity: 2 },
      ];
>>>>>>> Stashed changes

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCartFromJSON(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });

    it("should return error if client send products with fake price", async () => {
<<<<<<< Updated upstream
      const cartBody = {
        products: [
          { productId: productsId[0], price: 45 },
          { productId: 123, quantity: 2, price: 30 },
        ],
      };
=======
      const cartBody = [
        { product: { _id: productsId[0], price: 0 } },
        { product: { _id: productsId[1], price: 0 }, quantity: 2 },
      ];
>>>>>>> Stashed changes

      const jsonCart = JSON.parse(JSON.stringify(cartBody));
      const result = await createCartFromJSON(jsonCart);
      expect(_.isError(result)).toBeTruthy();
    });
  });
});
