const mongoose = require("mongoose");
const _ = require("lodash");
const { Product } = require("../../../models/product");
const { createOrderFromJSON } = require("../../../controllers/orders");

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

describe("orders", () => {
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

    exec = () => {
      const order = {
        customer: {
          name: "Jan",
          lastname: "Kowalski",
          email: "jankowalski@jakismail.xd",
          street: "Wiczesława 97",
          zip: "32-203",
          city: "Jaworzno",
          phone: "+48123456789",
        },
        cart: {
          products: [
            { productId: productsId[0] },
            { productId: productsId[1], quantity: 2 },
          ],
        },
      };
      return JSON.parse(JSON.stringify(order));
    };

    it("should return order if is valid", async () => {
      const result = await createOrderFromJSON(exec());
      expect(result).toMatchObject({
        customer: {
          city: "Jaworzno",
          email: "jankowalski@jakismail.xd",
          lastname: "Kowalski",
          name: "Jan",
          phone: "+48123456789",
          street: "Wiczesława 97",
          zip: "32-203",
        },
        cart: {
          products: [
            { productId: productsId[0], price: 15, quantity: 1 },
            { productId: productsId[1], price: 10, quantity: 2 },
          ],
        },
        amount: 35,
      });
    });
  });
});
