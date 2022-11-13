const request = require("supertest");
const { Category } = require("../../models/category");
const mongoose = require("mongoose");
const { getAuthToken, deleteUsers } = require("./users.test");

describe("categories route", () => {
  let server, token;

  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await deleteCategories();
    await deleteUsers();
  });

  describe("GET /", () => {
    beforeEach(async () => {
      await createCategory();
      await createCategory("games");
    });

    const exec = () => request(server).get("/api/categories");

    it("should return categories if request is correct", async () => {
      const res = await exec();
      expect(res.body.length).toBe(2);
    });

    it("should return 200 if request is correct", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });

  describe("POST /:id", () => {
    let name;
    beforeEach(async () => {
      token = await getAuthToken(true);
    });

    const exec = () =>
      request(server)
        .post(`/api/categories`)
        .set("x-auth-token", token)
        .send({ name });

    it("should return category if request is correct", async () => {
      name = "games";
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "games");
    });

    it("should return 200 if request is correct", async () => {
      name = "games";
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 400 if name is invalid", async () => {
      name = 10;
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
    let id, name;
    beforeEach(async () => {
      token = await getAuthToken(true);
      const category = await createCategory();
      id = category._id;
    });

    const exec = () =>
      request(server)
        .put(`/api/categories/${id}`)
        .set("x-auth-token", token)
        .send({ name });

    it("should return category if request is correct", async () => {
      name = "games";
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "games");
    });

    it("should return 200 if request is correct", async () => {
      name = "games";
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 400 if name is invalid", async () => {
      name = 10;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if category with given ID doesn't exist", async () => {
      name = "games";
      id = mongoose.Types.ObjectId();
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

    it("should return 404 if ID is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });
});

const createCategory = async (name) => {
  if (!name) name = "movies";
  const category = new Category({ name });
  await category.save();
  return category;
};

const deleteCategories = async () => {
  await Category.deleteMany({});
};

module.exports = {
  createCategory,
  deleteCategories,
};
