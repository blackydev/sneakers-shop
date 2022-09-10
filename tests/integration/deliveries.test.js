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
    let deliveries;

    beforeEach(async () => {
      deliveries = await createDeliveries();
    });

    afterEach(async () => {
      await deleteDeliveries();
    });

    const exec = () => {
      return request(server).get("/api/deliveries");
    };

    it("return all deliveries", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
    });
  });
});

describe("GET /:id", () => {
  let deliveryId;

  beforeEach(async () => {
    const deliveries = await createDeliveries();
    deliveryId = deliveries[0]._id;
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
  });

  it("return 404 if invalid id is passed", async () => {
    deliveryId = mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });
});

describe("PUT /:id", () => {
  let deliveryId;
  let token;
  let name, price, points, serviceId;

  beforeEach(async () => {
    const deliveries = await createDeliveries();
    const delivery = deliveries[2];
    name = delivery.name;
    price = delivery.price;
    points = delivery.points;
    serviceId = delivery.serviceId;

    deliveryId = deliveries[3]._id;

    token = await getAuthToken(true);
  });

  afterEach(async () => {
    await deleteDeliveries();
    await deleteUsers();
  });

  const exec = () => {
    return request(server)
      .put(`/api/deliveries/${deliveryId}`)
      .set("x-auth-token", token)
      .send({ name, price, points, serviceId });
  };

  it("return delivery if valid data is passed", async () => {
    const res = await exec();
    expect(res.body).toHaveProperty("name", name);
    expect(res.body).toHaveProperty("price", price);
    expect(res.body).toHaveProperty("points", points);
    expect(res.body).toHaveProperty("serviceId", serviceId);
    expect(res.status).toBe(200);
  });

  it("return delivery with points=false if points is not in request", async () => {
    points = null;
    const res = await exec();
    expect(res.body).toHaveProperty("name", name);
    expect(res.body).toHaveProperty("price", price);
    expect(res.body).toHaveProperty("points", false);
    expect(res.body).toHaveProperty("serviceId", serviceId);
    expect(res.status).toBe(200);
  });

  it("return 400 if name is not provided", async () => {
    name = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 404 if passed ID is invalid", async () => {
    deliveryId = mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("return 403 if user is not admin", async () => {
    await deleteUsers();
    token = await getAuthToken(false);
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("return 400 if invalid token is provided", async () => {
    await deleteUsers();
    token = "123";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 401 if no token is provided", async () => {
    await deleteUsers();
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
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
