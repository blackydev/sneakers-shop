const { createDeliveries, deleteDeliveries } = require("./deliveries");
const { createCart, deleteCarts } = require("./carts");
const { createProducts } = require("./products");
const { Order } = require("../../models/order");

const createOrders = async (carts, deliveries, customers) => {
  if (!deliveries) deliveries = await createDeliveries();

  if (!carts) {
    carts = [];
    const products = await createProducts();
    let cart = await createCart([products[0], products[2]], [1, 2]);
    carts.push(cart);
    cart = await createCart([products[0], products[1]], [3, 1]);
    carts.push(cart);
  }

  if (!customers)
    customers = [
      {
        name: "Anna Czarnecka",
        email: "annaCzarnecka1337@gmail.com",
        address: "wislana 67",
        zip: "32-532",
        city: "Jaworzno",
        phone: "48987654321",
      },
      {
        name: "Jan Kowalski",
        email: "jankowalski@gmail.com",
        address: "wiczeslawa 97",
        zip: "32-501",
        city: "Chrzanow",
        phone: "48123456789",
      },
    ];

  const result = [];

  let order = new Order({
    customer: customers[0],
    cart: carts[0].items,
    delivery: { method: deliveries[0]._id, price: deliveries[0].price },
    status: 1, // pending
  });
  await order.save();
  result.push(order);

  order = new Order({
    customer: customers[1],
    cart: carts[1].items,
    delivery: { method: deliveries[1]._id, price: deliveries[1].price },
    status: 1, // pending
  });
  await order.save();
  result.push(order);

  return result;
};

const deleteOrders = async () => {
  await deleteDeliveries();
  await deleteCarts();
  await Order.deleteMany({});
};

module.exports = {
  createOrders,
  deleteOrders,
};
