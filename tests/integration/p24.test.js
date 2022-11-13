const request = require("supertest");

describe("payment route", () => {
  let server;
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  const exec = (str) => request(server).get(`/api/p24${str}`);

  describe("GET /methods", () => {
    it("should return payment methods", async () => {
      const res = await exec("");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("id");
    });
    it("should return 200", async () => {
      const res = await exec("");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /methods/:lang", () => {
    it("should return payment methods in polish language", async () => {
      const res = await exec("/pl");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("id");
    });

    it("should return 200", async () => {
      const res = await exec("/pl");
      expect(res.status).toBe(200);
    });

    it("should return payment methods in english language", async () => {
      const res = await exec("/en");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("id");
    });

    it("should return 200", async () => {
      const res = await exec("/en");
      expect(res.status).toBe(200);
    });
  });
});
