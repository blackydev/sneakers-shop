import React from "react";
import { Link } from "react-router-dom";
import ProductImg from "./productCard/productImg";
import dayjs from "dayjs";

export default function MyOrderCard({ order }) {
  const { product } = order.cart[0];

  return (
    <Link
      to={`/my-orders/${order._id}`}
      className={`d-flex justify-content-between bg-secondary bg-gradient border border-2 rounded-3 shadow-sm text-black text-decoration-none px-3 mb-3`}
    >
      <div className="position-relative py-3">
        <h3 className="fs-5 fw-bold text-capitalize">{order.status}</h3>
        <div>
          {dayjs(order.createdAt).format("D MMMM YYYY")} <br />
          {JSON.stringify(order.totalPrice)} zł
        </div>
      </div>
      <div className="my-auto" style={{ width: "95px" }}>
        <ProductImg product={product} rounded={3} />
      </div>
    </Link>
  );
}
