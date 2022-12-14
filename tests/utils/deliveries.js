const { Delivery } = require("../../models/delivery");

const deliveries = [
  {
    name: "personal pickup",
    price: 0,
  },
  {
    name: "carrier DPD",
    price: 20,
  },
];

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
