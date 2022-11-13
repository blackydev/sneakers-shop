const { Product } = require("../../models/product");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { getAuthToken, deleteUsers } = require("./users.test");
const { createCategory, deleteCategories } = require("./categories.test");

const products = [
  {
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    price: 10.2,
    numberInStock: 255,
  },
  {
    name: "Star Wars IV",
    description:
      "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    price: 15,
    numberInStock: 55,
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
      const { _id } = await createCategory();
      categoryId = mongoose.Types.ObjectId().toString();
      await Product.insertMany([
        {
          ...products[0],
          image: pngImg,
          category: categoryId,
        },
        {
          ...products[1],
          image: jpgImg,
          category: categoryId,
        },
        {
          ...products[2],
          image: webpImg,
          category: mongoose.Types.ObjectId().toString(),
        },
      ]);
    });

    const exec = () => request(server).get("/api/products");

    it("should return products if request is correct", async () => {
      const res = await exec();
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty("name");
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    describe("queries", () => {
      let query;
      const exec = () => request(server).get("/api/products").query(query);

      describe("sortBy", () => {
        it("should return products sorted by price if request is correct", async () => {
          query = { sortBy: "price" };
          const res = await exec();
          expect(res.body[0].price < res.body[1].price).toBeTruthy();
          expect(res.status).toBe(200);
        });

        it("should return products sorted by price in desc. order", async () => {
          query = { sortBy: "-price" };
          const res = await exec();
          expect(res.body[0].price > res.body[1].price).toBeTruthy();
          expect(res.status).toBe(200);
        });

        it("should return 400 if query is an array", async () => {
          query = { sortBy: ["name", "_id"] };
          const res = await exec();
          expect(res.status).toBe(400);
        });
      });

      describe("category", () => {
        it("should return products with given category", async () => {
          query = { category: categoryId };
          const res = await exec();
          expect(res.body.length).toBe(2);
          expect(res.status).toBe(200);
        });
      });

      describe("select", () => {
        it("should return products with selected properties", async () => {
          query = { select: ["name", "price"] };
          const res = await exec();

          const mustHaveProps = ["_id", "id", "name", "price"];
          for (const item of res.body) {
            for (const prop of mustHaveProps) expect(item).toHaveProperty(prop);

            expect(item).not.toHaveProperty("image");
            expect(item).not.toHaveProperty("numberInStock");
            expect(res.status).toBe(200);
          }
        });
      });

      describe("paginate", () => {
        it("should return paginated products", async () => {
          const res = [];
          query = { pageLength: 1, pageNumber: 0 };
          res.push(await exec());
          query.pageNumber++;
          res.push(await exec());

          expect(res[0].body[0]._id != res[1].body[0]._id).toBeTruthy();

          for (const response of res) {
            expect(response.body.length).toBe(1);
            expect(response.status).toBe(200);
          }
        });
      });
    });
  });

  describe("GET /:id", () => {
    let product, query, productId;
    beforeEach(async () => {
      const { _id: categoryId } = await createCategory();
      product = new Product({
        ...products[0],
        image: "star-wars-1.png",
        category: categoryId,
      });
      await product.save();
      productId = product._id;
    });

    const exec = () =>
      request(server).get(`/api/products/${productId}`).query(query);

    it("should return product if request is correct", async () => {
      const res = await exec();
      expect(res.body).toMatchObject({
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
      });
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 404 if given ID is invalid", async () => {
      productId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if product with given ID doesn't exist", async () => {
      productId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    describe("queries", () => {
      it("should return product with selected properties if request is correct", async () => {
        query = { select: ["name", "category"] };
        const res = await exec();

        expect(res.body).toMatchObject({
          _id: product._id,
          name: product.name,
        });
        expect(res.body).not.toHaveProperty("image");
        expect(res.status).toBe(200);
      });
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
      let res = await exec();
      const mustHaveProps = [
        "name",
        "description",
        "price",
        "numberInStock",
        "category",
        "image",
      ];
      for (const prop of mustHaveProps) expect(res.body).toHaveProperty(prop);
      expect(res.status).toBe(200);
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
          let res = await exec();
          expect(res.status).toBe(200);
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
          let res = await exec();
          expect(res.status).toBe(200);
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
          let res = await exec();
          expect(res.status).toBe(200);
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
    let product, productId, token, img, categoryId;
    const template = {
      name: "Spider Man 2002",
      description: "Spider-Man. Your best friend from neighbourhood.",
      price: 59.9,
      numberInStock: 1200,
    };

    beforeEach(async () => {
      const category = await createCategory();
      const products = await createProducts(category);
      categoryId = category._id;
      product = products[0];
      productId = product._id;
      img = webpImg;

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
        imgLocationPrefix + path.basename(res.body.image)
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
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 403 if user is not admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if JWT token is fake", async () => {
      token = jwt.sign(
        {
          _id: mongoose.Types.ObjectId(),
        },
        config.get("jwtPrivateKey")
      );
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if ID is invalid", async () => {
      productId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if product with given ID doesn't exist", async () => {
      productId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });
});

const createProducts = async (category) => {
  const result = [];
  if (!category) category = await createCategory();
  for (const el of products) {
    const product = new Product({
      ...el,
      image: mockImg,
      category: category._id,
    });
    await product.save();
    result.push(product);
  }

  return result;
};

const deleteProducts = async () => {
  await Product.deleteMany({});
  await deleteCategories({});
};

module.exports = {
  createProducts,
  deleteProducts,
};
