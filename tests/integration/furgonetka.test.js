const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { getAuthToken, deleteUsers } = require("./users.test");
const { createOrders, deleteOrders } = require("./Orders.test");
const { Delivery } = require("../../models/delivery");

const deliveries = [
  {
    name: "personal pickup",
    price: 0,
    points: false,
    serviceId: 0, // poczta polska
  },
  {
    name: "carrier",
    price: 20,
    points: false,
    serviceId: 9603405, // poczta polska
  },
  {
    name: "inpost",
    price: 10.9,
    points: true,
    serviceId: 9603406, // poczta polska
  },
  {
    name: "orlen",
    price: 9.9,
    points: true,
    serviceId: 9603408, // poczta polska
  },
];

describe("deliveries route", () => {
  let server;

  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  describe("GET /", () => {
    const exec = () => {
      return request(server).get("/api/furgonetka");
    };

    it("return all services", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("services");
      expect(res.status).toBe(200);
    });
  });

  /*
  describe("POST /delivery", () => {
    let token, orders;
    beforeEach(async () => {
      token = await getAuthToken();
      orders = await createOrders();
    });

    afterEach(async () => {
      await deleteUsers();
      await deleteOrders();
    });

    const exec = () => {
      return request(server)
        .set("x-auth-token", token)
        .post("/api/furgonetka/delivery");
    };
  });
*/
  describe("GET /:services/points", () => {
    let service, searchQuery;

    const exec = () => {
      return request(server).get(
        `/api/furgonetka/${service}/points?search=${searchQuery}`
      );
    };

    it("return inpost points if valid data is passed", async () => {
      service = "inpost";
      searchQuery = "jaworzno";
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("points");
    });

    it("return orlen points if valid data is passed", async () => {
      service = "orlen";
      searchQuery = "jaworzno";
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("points");
    });

    it("return 400 if no serach phrase is passed", async () => {
      service = "inpost";
      searchQuery = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});
