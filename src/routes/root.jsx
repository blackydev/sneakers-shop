import React, { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "../components/navBar";
import cartService from "../services/cartService";
import auth from "../services/authService";
import Footer from "../components/footer";

export default function Root() {
  const [cartId, setCartId] = useState(cartService.getCartId());
  const [user, setUser] = useState(auth.getCurrentUser());

  return (
    <>
      <div>
        <ScrollRestoration />
        <ToastContainer position="bottom-right" autoClose={3000} />
        <NavBar context={{ cartId, setCartId, user, setUser }} />
        <Outlet context={{ cartId, setCartId, user, setUser }} />
      </div>
      <Footer />
    </>
  );
}
