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
  });

  describe("GET /", () => {
    let token;
    let query;

    beforeEach(async () => {
      token = await getAuthToken(true);
      orders = await createOrders();
      query = "";
    });

    afterEach(async () => {
      await deleteOrders();
      await deleteUsers();
    });

    const exec = () => {
      return request(server)
        .get(`/api/orders${query}`)
        .set("x-auth-token", token);
    };

    it("return orders if token is provided", async () => {
      const res = await exec();
      expect(res.body[0]).toHaveProperty("customer.name");
      expect(res.body[0]).toHaveProperty("cart.list");
      expect(res.body[0]).toHaveProperty("delivery.model");
      expect(res.body[0]).toHaveProperty("delivery.cost");
      expect(res.status).toBe(200);
    });

    it("return orders just with pending status", async () => {
      query = "?statusLike=pending";
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("return orders just with interrupted status", async () => {
      query = "?statusLike=interrupted";
      const res = await exec();
      expect(res.body.length).toBe(0);
      expect(res.status).toBe(200);
    });

    it("return paged orders if page query is passed", async () => {
      query = "?pageLength=1";
      let res = await exec();
      const checker = res.body[0];
      expect(res.body.length).toBe(1);
      expect(res.status).toBe(200);

      query = "?pageLength=1&pageNumber=1";
      res = await exec();
      expect(res.body.length).toBe(1);
      expect(res.status).toBe(200);
      expect(res.body[0]._id != checker._id).toBeTruthy();
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

    afterEach(async () => {
      await deleteOrders();
      await deleteUsers();
    });

    const exec = () => {
      return request(server)
        .get(`/api/orders/${orderId}`)
        .set("x-auth-token", token);
    };

    it("return order if token is provided", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("customer");
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("delivery");
      expect(res.status).toBe(200);
    });

    it("return 404 if invalid id is passed", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("return 400 if invalid token is provided", async () => {
      await deleteUsers();
      token = "123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("return 401 if no token is provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("return 400 if token is fake", async () => {
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
    let deliveries, products;
    let customer, cart, delivery;

    beforeEach(async () => {
      deliveries = await createDeliveries();
      products = await createProducts();

      cart = await createCart([products[0], products[2]], [1, 2]);
      delivery = {
        model: deliveries[1]._id,
      };

      customer = {
        name: "Anna Czarnecka",
        email: "annaCzarnecka1337@gmail.com",
        address: "wislana 67",
        zip: "32-532",
        city: "Jaworzno",
        phone: "48987654321",
      };
    });

    afterEach(async () => {
      await deleteOrders();
    });

    const exec = () => {
      return request(server)
        .post(`/api/orders`)
        .send({ customer, cart: cart._id, delivery });
    };

    it("return order if valid data is passed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("customer");
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("delivery");
      expect(res.status).toBe(200);
    });

    it("return 400 if invalid customer is passed", async () => {
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

    it("return 400 if invalid cart is passed", async () => {
      cart = {
        products: [
          {
            productId: mongoose.Types.ObjectId(),
          },
        ],
      };

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("return 400 if invalid delivery is passed", async () => {
      delivery = {
        methodId: mongoose.Types.ObjectId(),
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("POST /:id/payment", () => {
    let orders, orderId;

    beforeEach(async () => {
      orders = await createOrders();
      orderId = orders[0]._id;
    });

    afterEach(async () => {
      await deleteOrders();
    });

    const exec = () => {
      return request(server)
        .post(`/api/orders/${orderId}/payment`)
        .send({ paymentMethodId: 154 });
    };

    it("return 302 status (redirect)", async () => {
      const res = await exec();
      expect(res.status).toBe(302);
    });

    it("return 404 if invalid id is passed", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("GET /:id/status", () => {
    let orders, orderId;

    beforeEach(async () => {
      orders = await createOrders();
      orderId = orders[0]._id;
    });

    afterEach(async () => {
      await deleteOrders();
    });

    const exec = () => {
      return request(server).get(`/api/orders/${orderId}/status`);
    };

    it("return order information", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("status", orders[0].status);
      expect(res.body).toHaveProperty("cart.list");
      expect(res.body).toHaveProperty("delivery");

      expect(res.status).toBe(200);
    });

    it("return order information (with customer) if status is accepted", async () => {
      await Order.findByIdAndUpdate(orders[0]._id, { status: "accepted" });
      const res = await exec();
      expect(res.body).toHaveProperty("status", "accepted");
      expect(res.body).toHaveProperty("cart");
      expect(res.body).toHaveProperty("delivery");
      expect(res.body).toHaveProperty("customer.name");

      expect(res.status).toBe(200);
    });

    it("return 404 if invalid id is passed", async () => {
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
      status = "shipped";
    });

    afterEach(async () => {
      await deleteUsers();
      await deleteOrders();
    });

    const exec = () => {
      return request(server)
        .put(`/api/orders/${orderId}/status`)
        .set("x-auth-token", token)
        .send({ status: status });
    };

    it("return order if valid status is passsed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("status", status);
      expect(res.body).toHaveProperty("cart", orders[0].cart);
      expect(res.body).toHaveProperty("delivery");
      expect(res.status).toBe(200);
    });

    it("return 400 if invalid status is passed", async () => {
      status = "wrongStatus";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("return 404 if invalid id is passed", async () => {
      orderId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });*/
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
    delivery: {
      model: deliveries[1]._id,
      cost: deliveries[1].price,
    },
    status: "pending",
  });
  await order.save();
  result.push(order);

  order = new Order({
    customer: customers[1],
    cart: { list: carts[1].list },
    delivery: {
      model: deliveries[2]._id,
      cost: deliveries[2].price,
      point: "Krakow",
    },
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