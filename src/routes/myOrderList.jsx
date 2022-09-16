import React from "react";
import { useLoaderData } from "react-router-dom";
import userService from "../services/userService";
import MyOrderCard from "../components/myOrderCard";

export async function loader({ params }) {
  try {
    var { data: orders } = await userService.getOrders();
  } catch (ex) {
    throw new Response("", {
      statusText: "You do not have any orders.",
    });
  }
  orders.map((order) => {
    order.totalPrice = order.delivery.price;
    for (const item of order.cart) order.totalPrice += item.price * item.amount;
    return order;
  });

  orders.sort((a, b) => {
    a = a._id;
    b = b._id;
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  });

  return { orders, params };
}

export default function MyOrderList() {
  const { orders } = useLoaderData();

  return (
    <main className="container">
      <h2 className="fw-bold mb-4">Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div key={order._id} className="col-12 col-md-6 col-lg-4 col-xxl-3">
            <MyOrderCard order={order} />
          </div>
        ))}
      </div>
    </main>
  );
}
