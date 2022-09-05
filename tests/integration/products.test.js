const { Product } = require("../../models/product");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const config = require("config");
const { createUser, deleteUsers } = require("./users.test");
const { exec } = require("child_process");

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

describe("products route", () => {
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
      finalProducts = await Product.insertMany([
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
      ]);
    });

    it("should return all products", async () => {
      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([
        {
          _id: finalProducts[0]._id,
          name: finalProducts[0].name,
          price: finalProducts[0].price,
          image: pngImg.filePath,
        },
        {
          _id: finalProducts[1]._id,
          name: finalProducts[1].name,
          price: finalProducts[1].price,
          image: jpgImg.filePath,
        },
        {
          _id: finalProducts[2]._id,
          name: finalProducts[2].name,
          price: finalProducts[2].price,
          image: webpImg.filePath,
        },
      ]);
    });

    it("should return 400 with error", async () => {
      const res = await request(server).get(
        "/api/products?sortBy=name&sortBy=_id&sortBy=name"
      );
      expect(res.status).toBe(400);
    });
  });

  describe("GET /:id", () => {
    let hidden;
    const exec = async () => {
      let product = new Product({
        ...products[0],
        image: pngImg.filePath,
        hidden: hidden,
      });
      await product.save();
      return product;
    };

    it("should return product", async () => {
      const product = await exec();
      const res = await request(server).get(`/api/products/${product._id}`);
      expect(res.body).toMatchObject({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: pngImg.filePath,
      });
      expect(res.status).toBe(200);
    });

    it("should return product with _id and name", async () => {
      const product = await exec();
      const res = await request(server).get(
        `/api/products/${product._id}?select=name`
      );
      expect(res.body).toMatchObject({
        _id: product._id,
        name: product.name,
      });
      expect(res.status).toBe(200);
    });

    it("should not return hidden product", async () => {
      hidden = true;
      const product = await exec();
      const res = await request(server).get(`/api/products/${product._id}`);
      expect(res.body).toMatchObject({});
      expect(res.status).toBe(404);
    });

    it("should return hidden product", async () => {
      hidden = true;
      const product = await exec();
      const res = await request(server).get(
        `/api/products/${product._id}?showHidden=true`
      );
      expect(res.body).toMatchObject({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: pngImg.filePath,
      });
      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    let imagePath;
    let product;
    let token;

    beforeEach(async () => {
      product = {
        name: "Star Wars I",
        description:
          "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
        slogan: "It's awesome movie",
        price: 15,
        numberInStock: 255,
      };

      let user = await createUser(true);
      user = await user.save();
      token = user.generateAuthToken();
    });

    afterEach(async () => {
      await deleteUsers();
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

    const exec = () => {
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

    it("return 403 if user is not admin", async () => {
      imagePath = webpImg.filePath;
      await deleteUsers();
      let user = await createUser();
      user = await user.save();
      token = user.generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
  });
});

const createProduct = async () => {
  let product = new Product({
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    slogan: "It's awesome movie",
    price: 15,
    numberInStock: 255,
  });
  product = await product.save();
  return product;
};

const deleteProducts = async () => {
  await Product.deleteMany({});
};

module.exports = {
  createProduct,
  deleteProducts,
};
