const { Product } = require("../../models/product");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { getAuthToken, deleteUsers } = require("./users.test");

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
    slogan: "It's good movie",
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

pngImg = "./tests/files/star wars 1.png";

jpgImg = "./tests/files/star wars 4.jpg";

webpImg = "./tests/files/star wars 6.webp";

tooBigImg = "./tests/files/tooBigImg.jpg";

mockImg = "xyz.jpg";

imgReturnedPrefix = "/public/images/products/";

imgLocationPrefix = config.get("public") + "images/products/";

describe("products route", () => {
  let server;
  let token;
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Product.deleteMany({});
    await deleteUsers();
  });

  describe("GET /", () => {
    let finalProducts;
    beforeEach(async () => {
      finalProducts = await Product.insertMany([
        {
          ...products[0],
          image: pngImg,
        },
        {
          ...products[1],
          image: jpgImg,
        },
        {
          ...products[2],
          image: webpImg,
        },
      ]);
    });

    afterEach(async () => {
      await Product.deleteMany({});
    });

    it("should return all products", async () => {
      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

    it("should return 400 with error if sort query is an array", async () => {
      const res = await request(server).get(
        "/api/products?sortBy=name&sortBy=_id&sortBy=name"
      );
      expect(res.status).toBe(400);
    });

    it("should return 200 with hidden products", async () => {
      await Product.deleteMany({});
      const hiddenProduct = new Product({
        ...products[0],
        hidden: true,
        image: mockImg,
      });
      await hiddenProduct.save();

      const res = await request(server).get("/api/products?showHidden=true");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    const _ = require("lodash");
  });

  describe("GET /:id", () => {
    let hidden;
    const exec = async () => {
      let product = new Product({
        ...products[0],
        image: "star-wars-1.png",
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
        image: imgReturnedPrefix + "star-wars-1.png",
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
        image: imgReturnedPrefix + "star-wars-1.png",
      });
      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    let imagePath;
    let product;

    beforeEach(async () => {
      product = {
        name: "Star Wars I",
        description:
          "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
        slogan: "It's awesome movie",
        price: 15,
        numberInStock: 255,
      };

      token = await getAuthToken(true);
    });

    afterEach(async () => {
      // delete all files after test
      const dir = config.get("public") + "images/products/";
      await fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== ".gitkeep")
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

    const expectImg = (path) => {
      return request(server).get("/api" + path);
    };

    it("return product with png if is valid", async () => {
      imagePath = pngImg;
      let res = await exec();
      expect(res.status).toBe(200);
      res = await expectImg(res.body.image);
      expect(res.status).toBe(200);
    });

    it("return product with jpg if is valid", async () => {
      imagePath = jpgImg;
      const res = await exec();
      expect(res.status).toBe(200);
      const exists = await fs.existsSync(
        imgLocationPrefix + path.basename(res.body.image)
      );
      expect(exists).toBeTruthy();
    });

    it("return product with webp if is valid", async () => {
      imagePath = webpImg;
      const res = await exec();
      expect(res.status).toBe(200);
      const exists = await fs.existsSync(
        imgLocationPrefix + path.basename(res.body.image)
      );
      expect(exists).toBeTruthy();
    });

    it("return 404 if image is too big", async () => {
      imagePath = tooBigImg;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("return 403 if user is not admin", async () => {
      imagePath = webpImg;
      await deleteUsers();
      token = await getAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
  });

  describe("PUT /:id", () => {
    let product;
    let token;
    let imagePath;
    let productId;
    let reqProduct;

    beforeEach(async () => {
      const products = await createProducts();
      product = products[0];
      imagePath = webpImg;
      productId = product._id;
      reqProduct = products[1];

      token = await getAuthToken(true);
    });

    afterEach(async () => {
      await deleteUsers();
      // delete all files after test
      const dir = config.get("public") + "images/products/";
      await fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== ".gitkeep")
            fs.unlink(path.join(dir, file), (err) => {
              if (err) throw err;
            });
        }
      });
    });

    const exec = () => {
      return request(server)
        .put(`/api/products/${productId}`)
        .set("x-auth-token", token)
        .attach("image", imagePath)
        .field("name", reqProduct.name)
        .field("description", reqProduct.description)
        .field("slogan", reqProduct.slogan)
        .field("price", reqProduct.price)
        .field("numberInStock", reqProduct.numberInStock);
    };

    it("return product if no image is send", async () => {
      imagePath = null;
      const res = await exec();
      expect(res.body).toHaveProperty("image", imgReturnedPrefix + mockImg);
      expect(res.body).toHaveProperty("name", products[1].name);
      expect(res.body).toHaveProperty("description", products[1].description);
      expect(res.body).toHaveProperty("slogan", products[1].slogan);
      expect(res.body).toHaveProperty("price", products[1].price);
      expect(res.body).toHaveProperty(
        "numberInStock",
        products[1].numberInStock
      );

      expect(res.status).toBe(200);
    });

    it("return product if image is send", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("image");
      expect(res.body.image).not.toBe(mockImg);
      expect(res.body).toHaveProperty("name", products[1].name);
      expect(res.body).toHaveProperty("description", products[1].description);
      expect(res.body).toHaveProperty("slogan", products[1].slogan);
      expect(res.body).toHaveProperty("price", products[1].price);
      expect(res.body).toHaveProperty(
        "numberInStock",
        products[1].numberInStock
      );
      const exists = await fs.existsSync(
        imgLocationPrefix + path.basename(res.body.image)
      );
      expect(exists).toBeTruthy();
    });

    it("return 400 if name is not provided", async () => {
      reqProduct.name = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("return 403 if user is not admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("return 400 if token is fake", async () => {
      token = jwt.sign(
        {
          _id: mongoose.Types.ObjectId(),
        },
        config.get("jwtPrivateKey")
      );
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});

const createProducts = async () => {
  const result = [];
  for (const el of products) {
    const product = new Product({ ...el, image: mockImg });
    await product.save();
    result.push(product);
  }

  return result;
};

const deleteProducts = async () => {
  await Product.deleteMany({});
};

module.exports = {
  createProducts,
  deleteProducts,
};
