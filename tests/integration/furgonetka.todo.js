const { createDelivery } = require("../../controllers/furgonetka");
const { createOrders, deleteOrders } = require("./orders.test");
const { Order } = require("../../models/order");

describe("furgonetka", () => {
  let server;

  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await deleteOrders();
  });

  describe("createDelivery", () => {
    it("should return 200", async () => {
      const orders = await createOrders();
      const order = await Order.findById(orders[0]._id);
      const res = await createDelivery(order);
      expect(res).toBe(2);
    });
  });
});
