const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../../models/user");

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
      return request(server)
        .post("/api/users")
        .send({ email: email, password: password });
    };

    it("should return 400 if email is incorrect", async () => {
      email = "uncorrectmail@com";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if password doesn't have upperCase", async () => {
      password = "uncorrectpassword123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if password doesn't have lowerCase", async () => {
      password = "UNCORRECTPASSWORD123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if password doesn't have numbers", async () => {
      password = "UNCORRECTPASSWORD";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 9 characters", async () => {
      password = "Abcde1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if user is already registered", async () => {
      await exec();
      password = "otherCorrectPassword123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return the user if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("email", email);
      expect(res.header).toHaveProperty("x-auth-token");
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

    const exec = async () => {
      return await request(server)
        .post("/api/users/auth")
        .send({ email: email, password: password });
    };

    it("should return token", async () => {
      const res = await exec();
      let token = jwt.verify(res.text, config.get("jwtPrivateKey"));
      expect(token).toHaveProperty("_id");
      expect(token).toHaveProperty("authNumber");
      expect(res.status).toBe(200);
    });

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

const getAuthToken = async (isAdmin) => {
  let user = new User({
    email: "correctEmail@gmail.com",
    password: "correctPassword123",
    isAdmin: isAdmin,
  });
  user = await user.save();
  token = user.generateAuthToken();
  return token;
};

const deleteUsers = async () => {
  await User.deleteMany({});
};

module.exports = {
  getAuthToken,
  deleteUsers,
};
