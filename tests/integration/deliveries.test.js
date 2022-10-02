const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { getAuthToken, deleteUsers } = require("./users.test");
const { Delivery } = require("../../models/delivery");

const deliveries = [
  {
    name: "personal pickup",
    price: 0,
  },
  {
    name: "carrier DPD",
    price: 20,
    serviceId: 9603401,
  },
  {
    name: "inpost package robot",
    price: 10.9,
    serviceId: 9603406,
    points: "inpost",
  },
  {
    name: "orlen package",
    price: 9.9,
    serviceId: 9603408,
    points: "orlen",
  },
];

describe("deliveries route", () => {
  let server;

  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await deleteDeliveries();
  });

  describe("GET /", () => {
    it("return all deliveries", async () => {
      await createDeliveries();
      const res = await request(server).get("/api/deliveries");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
    });
  });

  describe("GET /:id", () => {
    let deliveryId;

    beforeEach(async () => {
      const deliveries = await createDeliveries();
      deliveryId = deliveries[3]._id;
    });

    afterEach(async () => {
      await deleteDeliveries();
    });

    const exec = () => {
      return request(server).get(`/api/deliveries/${deliveryId}`);
    };

    it("return delivery if valid id is passed", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("price");
      expect(res.body).toHaveProperty("serviceId");
      expect(res.body).toHaveProperty("points");
    });

    it("return 404 if invalid id is passed", async () => {
      deliveryId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let delivery;

    beforeEach(async () => {
      token = await getAuthToken(true);
    });

    afterEach(async () => {
      await deleteDeliveries();
      await deleteUsers();
    });

    const exec = () => {
      return request(server)
        .post(`/api/deliveries`)
        .set("x-auth-token", token)
        .send(delivery);
    };

    it("return delivery if valid data is passed", async () => {
      delivery = {
        name: "DHL packages",
        price: 9.9,
        serviceId: 9603409,
      };
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "DHL packages");
      expect(res.body).toHaveProperty("price", 9.9);
      expect(res.status).toBe(200);
    });

    it("return 400 if no name is passed", async () => {
      delivery = {
        name: "",
        price: 9.9,
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    let token, delivery, newDelivery;

    beforeEach(async () => {
      token = await getAuthToken(true);
      delivery = new Delivery({
        name: "DHL",
        price: 9.9,
      });
      await delivery.save();
    });

    afterEach(async () => {
      await deleteDeliveries();
      await deleteUsers();
    });

    const exec = () => {
      return request(server)
        .put(`/api/deliveries/${delivery._id}`)
        .set("x-auth-token", token)
        .send(newDelivery);
    };

    it("return delivery", async () => {
      newDelivery = {
        name: "new DHL",
        price: 10.9,
      };
      const res = await exec();
      expect(res.body).toHaveProperty("name", "new DHL");
      expect(res.body).toHaveProperty("price", 10.9);
      expect(res.status).toBe(200);
    });

    it("return 404 if invalid ID is passed", async () => {
      delivery._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("return 400 if invalid data is passed", async () => {
      newDelivery = {
        name: "DHL",
        price: "invalidData",
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});

const createDeliveries = async () => {
  const result = [];
  for (const el of deliveries) {
    const delivery = new Delivery(el);
    await delivery.save();
    result.push(delivery);
  }

  return result;
};

const deleteDeliveries = async () => {
  await Delivery.deleteMany({});
};

module.exports = { createDeliveries, deleteDeliveries };
