const request = require("supertest");
const mongoose = require("mongoose");
const { Cart } = require("../../models/cart");
const { createProducts, deleteProducts } = require("./products.test");
const { Product } = require("../../models/product");

describe("carts route", () => {
  let server;

  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await deleteCarts();
  });

  describe("GET /:id", () => {
    let cart, id;
    beforeEach(async () => {
      cart = await createCart();
      id = cart._id;
    });

    const exec = () => {
      return request(server).get(`/api/carts/${id}`);
    };

    it("should return cart with populated products", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("list");
      expect(res.body.list.length).toBe(3);
      for (const item of res.body.list) {
        expect(item).toHaveProperty("product");
        expect(item).toHaveProperty("cost");
        expect(item).toHaveProperty("quantity");
        expect(item.product).toHaveProperty("_id");
        expect(item.product).toHaveProperty("image");
        expect(item.product).toHaveProperty("name");
      }
      expect(res.status).toBe(200);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("POST", () => {
    let product, quantity;
    beforeEach(async () => {
      const products = await createProducts();
      product = products[0];
      quantity = 1;
    });

    const exec = () => {
      return request(server).post("/api/carts").send({
        product: product._id,
        quantity,
      });
    };

    it("should return valid cart", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("list");

      const item = res.body.list[0];
      expect(item.product).toHaveProperty("_id");
      expect(item).toHaveProperty("cost", product.price);
      expect(item.product).toHaveProperty("image", product.image);
      expect(item.product).toHaveProperty("name", product.name);

      expect(res.status).toBe(200);
    });

    it("should change stock of product if valid cart is passed", async () => {
      quantity = 2;
      const inStock = product.numberInStock;
      await exec();
      const { numberInStock } = await Product.findById(product._id);
      expect(numberInStock === inStock - 2);
    });

    it("should return 404 if invalid product ID is passed", async () => {
      product._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if invalid quantity is passed", async () => {
      quantity = 0;
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    let cart, products, quantities;
    let productId, quantity;
    beforeEach(async () => {
      products = await createProducts();
      quantities = [1, 2];
      cart = await createCart([products[0], products[1]], quantities);
      productId = products[2]._id;
      quantity = 1;
    });

    const exec = () => {
      return request(server)
        .put(`/api/carts/${cart._id}`)
        .send({ product: productId, quantity });
    };

    it("should return valid cart", async () => {
      expect(cart.list.length).toBe(2);
      const res = await exec();
      expect(res.body.list.length).toBe(3);
      expect(res.status).toBe(200);
    });

    it("should return 404 if invalid cart id is passed", async () => {
      cart._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if invalid data is passed", async () => {
      productId = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid product ID is passed", async () => {
      productId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 if valid product is passed which is already in cart", async () => {
      productId = products[1]._id;
      quantity = 4;
      const res = await exec();
      res.body.list.some((item) => {
        if (item == productId) expect(item.quantity).toBe(quantity);
      });
      expect(res.status).toBe(200);
    });

    it("should return 400 if passed quantity are higher then limit", async () => {
      quantity = 100000;
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /:id/list/:productId", () => {
    let cart, products, quantities;
    let productId;
    beforeEach(async () => {
      products = await createProducts();
      quantities = [1, 2];
      cart = await createCart([products[0], products[1]], quantities);
      productId = products[1]._id;
    });

    const exec = () => {
      return request(server)
        .delete(`/api/carts/${cart._id}`)
        .send({ product: productId });
    };

    it("should return 200 if valid data is passed", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 204 and change the stock if last product is deleted", async () => {
      await deleteCarts();
      products = await createProducts();
      cart = await createCart([products[0]], [2]);
      productId = products[0]._id;
      const { numberInStock: stockBefore } = await Product.findById(productId);
      const res = await exec();
      const { numberInStock: stockAfter } = await Product.findById(productId);

      expect(stockBefore + 2 === stockAfter).toBeTruthy();
      expect(res.status).toBe(204);
    });

    it("should return 400 if product is not in cart", async () => {
      productId = products[2]._id;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid cart id is passed", async () => {
      cart._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if cart does not have product with given id", async () => {
      await deleteCarts();
      products = await createProducts();
      cart = await createCart([products[0]], [2]);
      productId = products[1]._id;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 and do not change stock if invalid id is passed", async () => {
      await deleteCarts();
      products = await createProducts();
      cart = await createCart([products[0]], [2]);
      productId = products[1]._id;
      const res = await exec();
      expect(res.status).toBe(400);
      const updated = await Product.findById(products[0]._id);
      expect(updated.numberInStock != products[0].numberInStock);
    });

    it("should return 404 if product with given ID does not exist", async () => {
      await Product.findByIdAndDelete(productId);
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });
});

const createCart = async (products, quantities) => {
  if (!products) products = await createProducts();
  if (!quantities) quantities = [1, 3, 2];

  const list = [];
  let i = 0;
  for (const product of products)
    list.push({
      product: product._id,
      cost: product.price,
      quantity: quantities[i],
    });

  const cart = new Cart({ list: list });
  await cart.save();
  return cart;
};

const deleteCarts = async () => {
  await Cart.deleteMany({});
  await deleteProducts();
};

module.exports = { createCart, deleteCarts };
