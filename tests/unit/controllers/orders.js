const mongoose = require("mongoose");
const _ = require("lodash");
const { Product } = require("../../../models/product");
const { Order } = require("../../../models/order");
const { setInterruptedOrders } = require("../../../controllers/orders");

const products = [
  {
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    slogan: "It's awesome movie",
    price: 15,
    numberInStock: 10,
    image: "./tests/files/star wars 2.png",
  },
  {
    name: "Star Wars IV",
    description:
      "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    price: 10,
    numberInStock: 20,
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
  });

  describe("setInterruptedOrders", async () => {
    let products;
    beforeEach(async () => {
      products = await Product.insertMany([...products]);
    });

    afterEach(async () => {
      await Product.deleteMany({});
      await Order.deleteMany({});
    });

    exec = () => {
      const order = new Order({});
    };

    it("should ", async () => {});
  });
});
