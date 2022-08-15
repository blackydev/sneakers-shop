const { User } = require("../../../models/user");
const auth = require("../../../middleware/authorization");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  beforeEach(() => {
    process.env = "";
  });

  afterEach(() => {
    process.env = "test";
  });

  it("should not populate req.user with the payload of a fake JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    auth(req, mockRes, next);

    expect(req.user).toBeFalsy();
  });
});
