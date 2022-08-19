const { Product, productSchema } = require("../../models/product");
const { User } = require("../../models/user");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const config = require("config");
const { mockResponse } = require("mock-req-res");

const products = [
  {
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    slogan: "It's awesome movie",
    price: 15,
    numberInStock: 255,
  },
  {
    name: "Star Wars IV",
    description:
      "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    price: 10,
    numberInStock: 5,
    release: new Date("1979-07-19").toISOString(),
  },
  {
    name: "Star Wars VI",
    description:
      " Luke Skywalker and friends travel to Tatooine to rescue their companion Han Solo from the vile Jabba the Hutt.",
    price: 12,
    numberInStock: 103,
  },
];

pngImg = {
  filePath: "./tests/files/star wars 1.png",
};

jpgImg = {
  filePath: "./tests/files/star wars 4.jpg",
};

webpImg = {
  filePath: "./tests/files/star wars 6.webp",
};

tooBigImg = {
  filePath: "./tests/files/tooBigImg.jpg",
};

describe("products routes", () => {
  let server;
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Product.deleteMany({});
  });

  describe("GET /", () => {
    let finalProducts;
    beforeEach(async () => {
      finalProducts = [
        {
          ...products[0],
          image: pngImg.filePath,
        },
        {
          ...products[1],
          image: jpgImg.filePath,
        },
        {
          ...products[2],
          image: webpImg.filePath,
        },
      ];

      await Product.insertMany(finalProducts);
    });

    it("should return 200 with all products", async () => {
      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(finalProducts);
    });
  });

  describe("PUT /", () => {
    let imagePath;
    let product;
    let token;

    beforeEach(() => {
      product = {
        name: "Star Wars I",
        description:
          "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
        slogan: "It's awesome movie",
        price: 15,
        numberInStock: 255,
      };

      token = new User({ isAdmin: true }).generateAuthToken();
    });

    afterEach(async () => {
      // delete all files after test
      const dir = config.get("public") + "images/products/";
      await fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(dir, file), (err) => {
            if (err) throw err;
          });
        }
      });
    });

    exec = () => {
      return request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .attach("image", imagePath)
        .field("name", product.name)
        .field("description", product.description)
        .field("slogan", product.slogan)
        .field("price", product.price)
        .field("numberInStock", product.numberInStock);
    };

    it("return product with png if is valid", async () => {
      imagePath = pngImg.filePath;
      const res = await exec();
      expect(res.status).toBe(200);
      const exists = await fs.existsSync(res.body.image);
      expect(exists).toBeTruthy();
    });

    it("return product with jpg if is valid", async () => {
      imagePath = jpgImg.filePath;
      const res = await exec();
      expect(res.status).toBe(200);
      const exists = await fs.existsSync(res.body.image);
      expect(exists).toBeTruthy();
    });

    it("return product with webp if is valid", async () => {
      imagePath = webpImg.filePath;
      const res = await exec();
      expect(res.status).toBe(200);
      const exists = await fs.existsSync(res.body.image);
      expect(exists).toBeTruthy();
    });

    it("return 404 if image is too big", async () => {
      imagePath = tooBigImg.filePath;
      const res = await exec();
      expect(res.status).toBe(400);
      const exists = await fs.existsSync(res.body.image);
      expect(exists).toBeFalsy();
    });
  });
});
