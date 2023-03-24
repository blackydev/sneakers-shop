const request = require("supertest");
const mongoose = require("mongoose");
const _ = require("lodash");
const { createOrders, deleteOrders } = require("../utils/orders");
const { getAuthToken, deleteUsers } = require("../utils/users");
const { createDeliveries } = require("../utils/deliveries");
const { createProducts } = require("../utils/products");
const { createCart } = require("../utils/carts");
const { User } = require("../../models/user");

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
    let token, page;

    beforeEach(async () => {
      token = await getAuthToken(true);
      await createOrders();
      page = 0;
    });

    const exec = () =>
      request(server)
        .get(`/api/orders`)
        .set("x-auth-token", token)
        .query({ page });

    it("should return 200 and orders if request is correct", async () => {
      const { body } = await exec().expect(200);
      expect(body.length).toBe(2);
    });

    it("should return paginated orders if request is correct", async () => {
      let res = await exec().expect(200);
      expect(res.body.length).toBe(2);

      page = 1;
      res = await exec().expect(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe("GET /:id", () => {
    let token;
    let orderId, order;

    beforeEach(async () => {
      token = await getAuthToken(true);
      const orders = await createOrders();
      orderId = orders[0]._id;
      order = orders[0];
    });

    const exec = () =>
      request(server).get(`/api/orders/${orderId}`).set("x-auth-token", token);

    it("should return 200 and order if request is correct", async () => {
      const { body } = await exec().expect(200);
      expect(body).toHaveProperty("customer", {
        name: "Anna Czarnecka",
        email: "annaCzarnecka1337@gmail.com",
        address: "wislana 67",
        zip: "32-532",
        city: "Jaworzno",
        phone: "48987654321",
      });
      expect(body).toHaveProperty("cart");
      expect(body.cart.length).toBe(order.cart.length);
      expect(body).toHaveProperty("status", "pending");
      expect(body).toHaveProperty("delivery");
    });

    it("should return 404 if order with given ID doesn't exist", async () => {
      orderId = mongoose.Types.ObjectId();
      await exec().expect(404);
    });

    it("should return 404 if ID is invalid", async () => {
      orderId = 1;
      await exec().expect(404);
    });

    it("should return 400 if token is invalid", async () => {
      await deleteUsers();
      token = "123";
      await exec().expect(400);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      await exec().expect(401);
    });

    it("should return 403 if user is not an admin", async () => {
      await deleteUsers();
      token = await getAuthToken(false);

      await exec().expect(403);
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

    describe("if no jwt token is provided", () => {
      const exec = () =>
        request(server)
          .post(`/api/orders`)
          .send({ customer, cartId: cart._id, deliveryId });

      describe("should return order if request is correct", () => {
        it("with customer property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("customer", {
            name: "Anna Czarnecka",
            email: "annaCzarnecka1337@gmail.com",
            address: "wislana 67",
            zip: "32-532",
            city: "Jaworzno",
            phone: "48987654321",
          });
        });

        it("with cart property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("cart");
          expect(body.cart.length).toBe(cart.items.length);
        });
        it("with status property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("status", "pending");
        });
        it("with delivery property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("delivery");
        });
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

      it("should return 400 if cart ID is invalid", async () => {
        cart = mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if given delivery ID is invalid", async () => {
        deliveryId = mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });
    describe("if jwt token is provided", () => {
      let token, user;
      beforeEach(async () => {
        user = await new User({
          email: "correctEmail1@gmail.com",
          password: "correctPassword1234",
        }).save();
        token = user.generateAuthToken();
      });
      const exec = () =>
        request(server)
          .post(`/api/orders`)
          .send({ customer, cartId: cart._id, deliveryId })
          .set("x-auth-token", token);

      describe("should return order if request is correct", () => {
        it("with customer property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("customer", {
            name: "Anna Czarnecka",
            email: "annaCzarnecka1337@gmail.com",
            address: "wislana 67",
            zip: "32-532",
            city: "Jaworzno",
            phone: "48987654321",
          });
        });

        it("with cart property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("cart");
          expect(body.cart.length).toBe(cart.items.length);
        });
        it("with status property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("status", "pending");
        });
        it("with delivery property", async () => {
          const { body } = await exec();
          expect(body).toHaveProperty("delivery");
        });
      });

      it("should save order in user property if request is correct", async () => {
        await exec();
        const tmp = await User.findById(user._id);
        expect(_.isArray(tmp.orders)).toBeTruthy();
        expect(tmp.orders.length).toBe(1);
        expect(mongoose.Types.ObjectId.isValid(tmp.orders[0])).toBeTruthy();
      });

      it("should return 400 if token is incorrect", async () => {
        token = "1234";
        await exec().expect(400);
      });

      it("should return 200 if request is correct", async () => {
        await exec().expect(200);
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

      it("should return 400 if cart ID is invalid", async () => {
        cart = mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if given delivery ID is invalid", async () => {
        deliveryId = mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });
  });

  describe("GET /:id/payment (!P24 CONFIG REQUIRED!)", () => {
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
  /*

  describe("PUT /:id/status", () => {
    let token, orders, orderId, status;

    beforeEach(async () => {
      token = await getAuthToken(true);
      orders = await createOrders();
      orderId = orders[0]._id;
      status = 20; // accepted
    });

    const exec = () =>
      request(server)
        .put(`/api/orders/${orderId}/status`)
        .set("x-auth-token", token)
        .send({ status });

    it("should return order if request is correct", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("status", "accepted");
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
  */
});
