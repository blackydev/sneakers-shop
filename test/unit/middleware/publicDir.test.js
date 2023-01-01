const request = require("supertest");

describe("static (public) directory", () => {
  let server;

  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  it("return 200 if image exists", async () => {
    const res = await request(server).get("/api/public/images/test-img.webp");
    expect(res.status).toBe(200);
  });

  it("return 404 if image doesn't exist", async () => {
    const res = await request(server).get("/api/public/images/test.webp");
    expect(res.status).toBe(404);
  });
});
