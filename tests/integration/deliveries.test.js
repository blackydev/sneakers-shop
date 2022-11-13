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
    await deleteUsers();
  });

  describe("GET /", () => {
    const exec = () => request(server).get("/api/deliveries");

    it("should return deliveries", async () => {
      await createDeliveries();
      const res = await exec();
      expect(res.body.length).toBe(2);
    });

    it("should return 200", async () => {
      await createDeliveries();
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    let token, delivery;

    beforeEach(async () => {
      token = await getAuthToken(true);
    });

    const exec = () =>
      request(server)
        .post(`/api/deliveries`)
        .set("x-auth-token", token)
        .send(delivery);

    it("should return delivery if valid data is passed", async () => {
      delivery = {
        name: "DHL packages",
        price: 9.9,
      };
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "DHL packages");
      expect(res.body).toHaveProperty("price", 9.9);
      expect(res.status).toBe(200);
    });

    it("should return 400 if no name is passed", async () => {
      delivery = {
        price: 9.9,
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid price is passed", async () => {
      delivery = {
        name: "DHL",
        price: "invalid",
      };
      const res = await exec();
      expect(res.status).toBe(400);
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

  describe("PUT /:id", () => {
    let token, delivery, newDelivery, deliveryId;

    beforeEach(async () => {
      token = await getAuthToken(true);
      delivery = new Delivery({
        name: "DHL",
        price: 9.9,
      });
      await delivery.save();
      deliveryId = delivery._id;
    });

    const exec = () =>
      request(server)
        .put(`/api/deliveries/${deliveryId}`)
        .set("x-auth-token", token)
        .send(newDelivery);

    it("should return delivery if request is correct", async () => {
      newDelivery = {
        name: "new DHL",
        price: 10.9,
      };
      const res = await exec();
      expect(res.body).toHaveProperty("name", "new DHL");
      expect(res.body).toHaveProperty("price", 10.9);
    });

    it("should return 200 if request is correct", async () => {
      newDelivery = {
        name: "new DHL",
        price: 10.9,
      };
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 404 if delivery with given ID doesn't exist", async () => {
      deliveryId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if invalid data is passed", async () => {
      newDelivery = {
        name: "DHL",
        price: "invalidData",
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if ID is invalid", async () => {
      deliveryId = 1;
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
