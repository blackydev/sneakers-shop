import React from "react";
import { useLoaderData } from "react-router-dom";
import Products from "../components/products/horizontal";
import orderService from "../services/orderService";

async function pay(orderId) {
  const { data: p24Token } = await orderService.pay(orderId);
  window.location.assign(orderService.paymentURL(p24Token));
}

export default function MyOrder() {
  const { orders, params } = useLoaderData();
  const order = orders.find((order) => order._id === params.id);
  if (!order) return null;
  const { customer, delivery } = order;

  const products = [];
  order.cart.map((item) =>
    products.push({
      ...item,
      ...item.product,
      product: undefined,
    }),
  );

  return (
    <main className="container">
      <section id="products" className="col-12 pb-2 row mx-auto">
        <h2 className="fw-bold mb-4">Cart</h2>
        <Products
          products={products}
          className="mb-4 col-12 col-lg-6 col-xl-4"
        />
      </section>

      <div className="col-12 row bg-dark text-light shadow p-4 rounded-4 mx-auto mb-5">
        <section
          id="customer"
          className="col-12 col-md-4 py-1 py-md-0 d-flex justify-content-start justify-content-md-start">
          <div>
            <h4 className="fw-bold">Customer</h4>
            <p>
              Name: {customer.name} <br />
              Email: {customer.email} <br />
              Address: {customer.zip} {customer.address} <br />
              City: {customer.city} <br />
              Phone: {customer.phone}
              {customer.company && (
                <>
                  <br /> Company: {customer.company}
                </>
              )}
            </p>
          </div>
        </section>
        <section
          id="delivery"
          className="col-12 col-md-4 py-1 py-md-0 d-flex justify-content-start justify-content-md-center">
          <div>
            <h4 className="fw-bold">Delivery</h4>
            <p>
              Name: {delivery.method.name} <br />
              Cost: {delivery.price} zł
            </p>
          </div>
        </section>
        <section
          id="other"
          className="col-12 col-md-4 py-1 py-md-0 d-flex justify-content-start justify-content-md-end">
          <div className="">
            <h4 className="fw-bold">Other</h4>
            <p>
              Status: {order.status} <br />
              Total Cost: {order.totalPrice} zł <br />
            </p>
          </div>
        </section>
        {order.status === "pending" && (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light mt-3 px-3 fs-5 rounded-3"
              onClick={() => pay(order._id)}>
              PAY
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
