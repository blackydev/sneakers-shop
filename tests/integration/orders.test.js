const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { getAuthToken, deleteUsers } = require("./users.test");
const { createDeliveries, deleteDeliveries } = require("./deliveries.test");
const { createCart, deleteCarts } = require("./carts.test");
const { createProducts } = require("./products.test");
const { Order } = require("../../models/order");

describe("orders route", () => {
  let server;

  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await deleteOrders();
    await deleteUsers();
  });

  describe("GET /", () => {
    let token, query;

    beforeEach(async () => {
      token = await getAuthToken(true);
      await createOrders();
      query = "";
    });

    const exec = () =>
      request(server)
        .get(`/api/orders`)
        .set("x-auth-token", token)
        .query(query);

    describe("correct request", () => {
      it("should return orders if request is correct", async () => {
        const res = await exec();
        expect(res.body.length).toBe(2);
        const mustHaveProps = [
          "customer.name",
          "cart.list",
          "delivery.method",
          "delivery.cost",
        ];
        for (const prop of mustHaveProps)
          expect(res.body[0]).toHaveProperty(prop);
      });

      it("should return 200 if request is correct", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
      });

      it('return orders with "pending" status if request is correct', async () => {
        query = { status: "pending" };
        const res = await exec();
        expect(res.status).toBe(200);
      });

      it('return orders just with "interrupted" status if request is correct', async () => {
        query = { status: "interrupted" };
        const res = await exec();
        expect(res.body.length).toBe(0);
        expect(res.status).toBe(200);
      });

      it("should return paginated orders if request is correct", async () => {
        query = { pageLength: 1 };

        let res = await exec();
        const checker = res.body[0];
        expect(res.body.length).toBe(1);
        expect(res.status).toBe(200);

        query = { pageLength: 1, pageNumber: 1 };
        res = await exec();
        expect(res.body.length).toBe(1);
        expect(res.status).toBe(200);
        expect(res.body[0]._id != checker._id).toBeTruthy();
      });
    });
  });

  describe("GET /:id", () => {
    let token;
    let orderId;

    beforeEach(async () => {
      token = await getAuthToken(true);
      const orders = await createOrders();
      orderId = orders[0]._id;
    });

    const exec = () =>
      request(server).get(`/api/orders/${orderId}`).set("x-auth-token", token);

    it("should return order if request is correct", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("customer");
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("delivery");
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 404 if order with given ID doesn't exist", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if ID is invalid", async () => {
      orderId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if token is invalid", async () => {
      await deleteUsers();
      token = "123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not an admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 400 if JWT is fake", async () => {
      token = jwt.sign(
        {
          _id: mongoose.Types.ObjectId(),
          authNumber: "19kbciesksf",
        },
        config.get("jwtPrivateKey")
      );
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    let deliveries, products, customer, cart, deliveryId;

    beforeEach(async () => {
      deliveries = await createDeliveries();
      products = await createProducts();

      cart = await createCart([products[0], products[2]], [1, 2]);
      deliveryId = deliveries[1]._id;

      customer = {
        name: "Anna Czarnecka",
        email: "annaCzarnecka1337@gmail.com",
        address: "wislana 67",
        zip: "32-532",
        city: "Jaworzno",
        phone: "48987654321",
      };
    });

    const exec = () =>
      request(server)
        .post(`/api/orders`)
        .send({ customer, cartId: cart._id, deliveryId });

    it("should return order if request is correct", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("customer");
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("delivery");
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 400 if customer is invalid", async () => {
      customer = {
        email: "jankowalski@gmail.com",
        address: "Wiczeslawa 97",
        zip: "32-501",
        city: "Chrzanow",
        phone: "48123456789",
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if cart ID is invalid", async () => {
      cart = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if given delivery is invalid", async () => {
      deliveryId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("POST /:id/payment", () => {
    let orders, orderId;

    beforeEach(async () => {
      orders = await createOrders();
      orderId = orders[0]._id;
    });

    const exec = () => request(server).get(`/api/orders/${orderId}/payment`);

    it("should return 200", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 404 if ID is invalid", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("GET /:id/status", () => {
    let orders, orderId, key;

    beforeEach(async () => {
      orders = await createOrders();
      orderId = orders[0]._id;
      key = orders[0].createdAt;
    });

    const exec = () =>
      request(server).get(`/api/orders/${orderId}/status`).query({ key });

    it("should return order status if request is correct", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("status", orders[0].status);
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 404 if ID is invalid", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if key is empty", async () => {
      key = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if key is incorrect", async () => {
      key = new Date();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /:id/status", () => {
    let token, orders, orderId, status;

    beforeEach(async () => {
      token = await getAuthToken(true);
      orders = await createOrders();
      orderId = orders[0]._id;
      status = "shipped";
    });

    const exec = () =>
      request(server)
        .put(`/api/orders/${orderId}/status`)
        .set("x-auth-token", token)
        .send({ status: status });

    it("should return order if request is correct", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("status", status);
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("delivery");
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 400 if given status is invalid", async () => {
      status = "wrongStatus";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if given ID is invalid", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if given ID is invalid", async () => {
      orderId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 if no token is provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not an admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);

      const res = await exec();
      expect(res.status).toBe(403);
    });
  });
});

const createOrders = async (carts, deliveries, customers) => {
  if (!deliveries) deliveries = await createDeliveries();

  if (!carts) {
    carts = [];
    const products = await createProducts();
    let cart = await createCart([products[0], products[2]], [1, 2]);
    carts.push(cart);
    cart = await createCart([products[0], products[1]], [3, 1]);
    carts.push(cart);
  }

  if (!customers)
    customers = [
      {
        name: "Anna Czarnecka",
        email: "annaCzarnecka1337@gmail.com",
        address: "wislana 67",
        zip: "32-532",
        city: "Jaworzno",
        phone: "48987654321",
      },
      {
        name: "Jan Kowalski",
        email: "jankowalski@gmail.com",
        address: "wiczeslawa 97",
        zip: "32-501",
        city: "Chrzanow",
        phone: "48123456789",
      },
    ];

  const result = [];

  let order = new Order({
    customer: customers[0],
    cart: { list: carts[0].list },
    delivery: { method: deliveries[0]._id, cost: deliveries[0].price },
    status: "pending",
  });
  await order.save();
  result.push(order);

  order = new Order({
    customer: customers[1],
    cart: { list: carts[1].list },
    delivery: { method: deliveries[1]._id, cost: deliveries[1].price },
    status: "pending",
  });
  await order.save();
  result.push(order);

  return result;
};

const deleteOrders = async () => {
  await deleteDeliveries();
  await deleteCarts();
  await Order.deleteMany({});
};

module.exports = {
  createOrders,
  deleteOrders,
};
