const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../../models/user");
const { createOrders, deleteOrders } = require("../utils/orders");
const _ = require("lodash");

describe("users route", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe("POST /", () => {
    let email, password;

    beforeEach(() => {
      email = "correctEmail@gmail.com";
      password = "correctPassword123";
    });

    const exec = () => {
      return request(server).post("/api/users").send({ email, password });
    };

    it("should return 200", async () => {
      const { status } = await exec();
      expect(status).toBe(200);
    });

    describe("unsuccesful attempts", () => {
      it("should return 400 if email is incorrect", async () => {
        email = "incorrectmail@com";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password doesn't have uppercase letter", async () => {
        password = "incorrectpassword123";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password doesn't have lowercase letter", async () => {
        password = "INCORRECTPASSWORD123";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password doesn't have numbers", async () => {
        password = "INCORRECTPASSWORD";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password has less than 9 chars", async () => {
        password = "Abcde1234";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if user with the same name is already registered", async () => {
        await exec();
        password = "otherCorrectPassword123";
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });
  });

  describe("POST /auth", () => {
    let email, password;

    beforeEach(async () => {
      email = "correctEmail@gmail.com";
      password = "correctPassword123";
      await request(server)
        .post("/api/users")
        .send({ email: email, password: password });
    });

    const exec = () =>
      request(server)
        .post("/api/auth")
        .send({ email: email, password: password });

    describe("succesful attempts", () => {
      it("should return token", async () => {
        const res = await exec();
        let token = jwt.verify(res.text, config.get("jwtPrivateKey"));
        expect(token).toHaveProperty("_id");
        expect(res.status).toBe(200);
      });

      it("should return 200", async () => {
        const res = await exec();
        let token = jwt.verify(res.text, config.get("jwtPrivateKey"));
        expect(res.status).toBe(200);
      });
    });
    describe("succesful attempts", () => {
      it("should return 400 if email is incorrect", async () => {
        email = "incorrectEmail";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password is incorrect", async () => {
        password = "IncorrectPassword123";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 if password is empty", async () => {
        password = "";
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });
  });

  describe("GET /orders", () => {
    let token;
    beforeEach(async () => {
      const orders = await createOrders();
      let user = new User({
        email: "correctEmail@gmail.com",
        password: "correctPassword123",
        orders: [orders[0]._id, orders[1]._id],
      });
      user = await user.save();
      token = user.generateAuthToken();
    });

    afterEach(async () => {
      await deleteOrders();
    });

    const exec = () =>
      request(server).get("/api/users/orders").set("x-auth-token", token);

    it("should return 200", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return empty array if user does not have orders", async () => {
      let user = await new User({
        email: "correctEmail1@gmail.com",
        password: "correctPassword1234",
      }).save();
      token = user.generateAuthToken();
      const res = await exec();
      expect(_.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });

    describe("should return array if user has orders", () => {
      it("with cart field", async () => {
        const res = await exec();
        const order = res.body[0];
        expect(order).toHaveProperty("cart");
        const properties = ["amount", "price", "product"];
        properties.map((prop) => expect(order.cart[0]).toHaveProperty(prop));
      });

      it("with specific product field", async () => {
        const res = await exec();
        const cart = res.body[0].cart;
        expect(cart[0]).toHaveProperty("product");
        const properties = ["_id", "name", "image", "release"];
        properties.map((prop) => expect(cart[0].product).toHaveProperty(prop));
        expect(cart[0]).not.toHaveProperty("product.description");
      });

      it("with customer field", async () => {
        const res = await exec();
        const order = res.body[0];
        expect(order).toHaveProperty("customer");
        const properties = ["name", "phone", "zip", "city", "email", "address"];
        properties.map((prop) => expect(order.customer).toHaveProperty(prop));
      });
      it("with status field", async () => {
        const res = await exec();
        const order = res.body[0];
        expect(order).toHaveProperty("status");
      });
    });
  });
});
