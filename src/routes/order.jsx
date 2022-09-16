import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import cartService from "../services/cartService";
import Products from "../components/products/horizontal";
import OrderForm from "../components/orderForm";

const throwError = () => {
  cartService.removeCartId();
  throw new Response("", {
    status: 404,
    statusText: "You do not have a cart.",
  });
};

export async function loader() {
  try {
    var { data: cart } = await cartService.getCart();
  } catch (ex) {
    if (ex.response && ex.response.status === 404) throwError();
  }
  if (cart.items.length === 0) throwError();

  const products = [];
  cart.items.map((item) =>
    products.push({
      ...item,
      ...item.product,
      product: undefined,
    })
  );
  return { products };
}

function getTotalPrice(products) {
  let totalPrice = 0;
  products.map((item) => (totalPrice += item.price * item.amount));
  return Math.round(totalPrice * 100) / 100;
}

export default function Order() {
  const { products: loadedProducts } = useLoaderData();
  const [products, setProducts] = useState(loadedProducts);
  const [productsPrice, setProductsPrice] = useState(getTotalPrice(products));

  function handleAmountSelection({ target }) {
    const amount = target.value;
    const productId = target.dataset.id;

    const index = products.findIndex((item) => item._id === productId);

    products[index].amount = amount;
    setProducts(products);
    setProductsPrice(getTotalPrice(products));
    cartService.pushProduct(productId, amount);
  }

  function handleProductDeletion({ target }) {
    const productId = target.dataset.id;
    const index = products.findIndex((item) => item._id === productId);
    products.splice(index, 1);
    setProducts([...products]);
    setProductsPrice(getTotalPrice(products));
    cartService.deleteProduct(productId);
  }

  if (products.length === 0) {
    throw new Response("", {
      status: 404,
      statusText: "You deleted all products from cart.",
    });
  }
  return (
    <main className="container d-flex justify-content-center">
      <div
        className="py-5 rounded-5"
        style={{ minHeight: "calc(90vh)", maxWidth: "720px" }}
      >
        <h3 className="fw-bold mb-3">Cart</h3>
        <section id="cart" className="mb-5">
          <Products
            products={products}
            onSelect={handleAmountSelection}
            onDelete={handleProductDeletion}
            className="col-12 mb-4"
          />
        </section>
        <section id="order-form" className="rounded-4">
          <OrderForm productsPrice={productsPrice} />
        </section>
      </div>
    </main>
  );
}
