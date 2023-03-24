const { Product } = require("../../models/product");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { getAuthToken, deleteUsers } = require("../utils/users");
const { createCategory } = require("../utils/categories");
const {
  createProducts,
  deleteProducts,
  products,
} = require("../utils/products");

pngImg = "./test/files/star wars 1.png";
jpgImg = "./test/files/star wars 4.jpg";
webpImg = "./test/files/star wars 6.webp";
tooBigImg = "./test/files/tooBigImg.jpg";
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
    await deleteProducts();
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

  describe("GET /", () => {
    let categoryId;
    beforeEach(async () => {
      categoryId = mongoose.Types.ObjectId().toString();
      await Product.insertMany([
        {
          ...products[0],
          image: pngImg,
          category: categoryId,
          release: new Date(),
        },
        {
          ...products[1],
          image: jpgImg,
          category: categoryId,
          release: new Date(),
        },
        {
          ...products[2],
          image: webpImg,
          category: mongoose.Types.ObjectId().toString(),
          release: new Date(),
        },
      ]);
    });

    const exec = () => request(server).get("/api/products");

    it("should return 200 and products if request is correct", async () => {
      const { body } = await exec().expect(200);
      expect(body.length).toBe(3);
      const product = body[0];
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("image");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("numberInStock");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("release");
    });

    describe("queries", () => {
      let query;
      const exec = () => request(server).get("/api/products").query(query);

      describe("category", () => {
        it("should return products with given category", async () => {
          query = { category: categoryId };
          const { body } = await exec().expect(200);
          expect(body.length).toBe(2);
        });
      });

      describe("paginate", () => {
        it("should return paginated products", async () => {
          query = { page: 0 };
          let res = await exec().expect(200);
          expect(res.body.length).toBe(3);

          query.page++;
          res = await exec().expect(200);
          expect(res.body.length).toBe(0);
        });
      });
    });
  });

  describe("GET /:id", () => {
    let product, query, productId;
    beforeEach(async () => {
      const category = await createCategory();
      product = new Product({
        ...products[0],
        image: "star-wars-1.png",
        category: category._id,
      });

      await product.save();
      productId = product._id;
    });

    const exec = () =>
      request(server).get(`/api/products/${productId}`).query(query);

    it("should return 200 and product if request is correct", async () => {
      const res = await exec().expect(200);

      expect(res.body).toMatchObject({
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
      });
    });

    it("should return 404 if given ID is invalid", async () => {
      productId = 1;
      await exec().expect(404);
    });

    it("should return 404 if product with given ID doesn't exist", async () => {
      productId = mongoose.Types.ObjectId().toString();
      await exec().expect(404);
    });
  });

  describe("POST /", () => {
    let imagePath, product;

    beforeEach(async () => {
      const { _id: categoryId } = await createCategory();
      product = {
        name: "Star Wars I",
        description:
          "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
        price: 15,
        numberInStock: 255,
        category: categoryId.toString(),
      };

      token = await getAuthToken(true);
    });

    const exec = () => {
      return request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .attach("image", imagePath)
        .field("name", product.name)
        .field("description", product.description)
        .field("price", product.price)
        .field("numberInStock", product.numberInStock)
        .field("category", product.category);
    };

    it("should return product", async () => {
      imagePath = pngImg;
      let { body } = await exec().expect(200);

      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("price");
      expect(body).toHaveProperty("numberInStock");
      expect(body).toHaveProperty("category");
      expect(body).toHaveProperty("image");
    });

    describe("image file validation", () => {
      const reqImg = (path) => {
        return request(server).get("/api" + path);
      };

      const doesExist = (imgPath) => {
        return fs.existsSync(imgLocationPrefix + path.basename(imgPath));
      };

      describe(".png", () => {
        beforeEach(() => {
          imagePath = pngImg;
        });

        it("should return 200 if request is correct", async () => {
          await exec().expect(200);
        });

        it("should file exists on the server if request is correct", async () => {
          let res = await exec();
          expect(await doesExist(res.body.image)).toBeTruthy();
        });

        it("should return 200 if you want get product image", async () => {
          let res = await exec();
          res = await reqImg(res.body.image);
          expect(res.status).toBe(200);
        });
      });

      describe(".jpg", () => {
        beforeEach(() => {
          imagePath = jpgImg;
        });

        it("should return 200 if request is correct", async () => {
          await exec().expect(200);
        });

        it("should file exists on the server if request is correct", async () => {
          let res = await exec();
          expect(await doesExist(res.body.image)).toBeTruthy();
        });

        it("should return 200 if you want get product image", async () => {
          let res = await exec();
          res = await reqImg(res.body.image);
          expect(res.status).toBe(200);
        });
      });

      describe(".webp", () => {
        beforeEach(() => {
          imagePath = webpImg;
        });

        it("should return 200 if request is correct", async () => {
          await exec().expect(200);
        });

        it("should file exists on the server if request is correct", async () => {
          let res = await exec();
          expect(await doesExist(res.body.image)).toBeTruthy();
        });

        it("should return 200 if you want get product image", async () => {
          let res = await exec();
          res = await reqImg(res.body.image);
          expect(res.status).toBe(200);
        });
      });

      it("should return 404 if image is too big", async () => {
        imagePath = tooBigImg;
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });

    it("should return 403 if user is not an admin", async () => {
      imagePath = webpImg;
      await deleteUsers();
      token = await getAuthToken(false);
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 401 if no token is provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /:id", () => {
    let product, productId, token, img, categoryId, template;

    beforeEach(async () => {
      const category = await createCategory();
      const products = await createProducts(category);
      categoryId = category._id;
      product = products[0];
      productId = product._id;
      img = webpImg;
      template = {
        name: "Spider Man 2002",
        description: "Spider-Man. Your best friend from neighbourhood.",
        price: 59.9,
        numberInStock: 1200,
      };

      token = await getAuthToken(true);
    });

    const reqImg = (path) => {
      return request(server).get("/api" + path);
    };

    const exec = () =>
      request(server)
        .put(`/api/products/${productId}`)
        .set("x-auth-token", token)
        .attach("image", img)
        .field("name", template.name)
        .field("description", template.description)
        .field("price", template.price)
        .field("numberInStock", template.numberInStock)
        .field("category", categoryId.toString());

    it("should return product if request is correct", async () => {
      let res = await exec();

      expect(res.body).toHaveProperty("image");
      expect(res.body.image).not.toBe(imgReturnedPrefix + mockImg);

      const mustHaveProps = ["name", "description", "price", "numberInStock"];
      for (const props of mustHaveProps)
        expect(res.body).toHaveProperty(props, template[props]);
    });

    it("should file exists on the server if request is correct", async () => {
      let res = await exec();

      const exists = await fs.existsSync(
        imgLocationPrefix + path.basename(res.body.image),
      );
      expect(exists).toBeTruthy();
    });

    it("should return 200 if request is correct", async () => {
      let res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 200 if request if you want get product image", async () => {
      let res = await exec();
      res = await reqImg(res.body.image);
      expect(res.status).toBe(200);
    });

    it("should return product if img is not send", async () => {
      img = null;
      const res = await exec();

      expect(res.body.image).toBe(imgReturnedPrefix + mockImg);

      const mustHaveProps = ["name", "description", "price", "numberInStock"];
      for (const props of mustHaveProps)
        expect(res.body).toHaveProperty(props, template[props]);

      expect(res.status).toBe(200);
    });

    it("should return 400 if name is invalid", async () => {
      template.name = 1;
      await exec().expect(400);
    });

    it("should return 404 if category with given ID does not exist", async () => {
      categoryId = mongoose.Types.ObjectId();
      await exec().expect(404);
    });

    it("should return 403 if user is not admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);
      await exec().expect(403);
    });

    it("should return 404 if ID is invalid", async () => {
      productId = 1;
      await exec().expect(404);
    });

    it("should return 404 if product with given ID doesn't exist", async () => {
      productId = mongoose.Types.ObjectId();
      await exec().expect(404);
    });
  });
});
