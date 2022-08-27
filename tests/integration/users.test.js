const { User } = require("../../models/user");
const request = require("supertest");

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
});
