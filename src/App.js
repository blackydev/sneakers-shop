import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import Home, { loader as homeLoader } from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Product, { loader as productLoader } from "./routes/product";
import Order, { loader as orderLoader } from "./routes/order";
import MyOrderList, { loader as myOrderListLoader } from "./routes/myOrderList";
import MyOrder from "./routes/myOrder";
import NotFound from "./routes/notFound";
import BeforeOrder from "./routes/beforeOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: "/shop/:id/",
        element: <Product />,
        loader: productLoader,
      },
      {
        path: "/order/",
        element: <Order />,
        loader: orderLoader,
      },
      {
        path: "/my-orders/",
        element: <MyOrderList />,
        loader: myOrderListLoader,
      },
      {
        path: "/before-order/",
        element: <BeforeOrder />,
      },
      {
        path: "/my-orders/:id",
        element: <MyOrder />,
        loader: myOrderListLoader,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
