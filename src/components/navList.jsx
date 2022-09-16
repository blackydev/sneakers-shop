import React from "react";
import { NavLink } from "react-router-dom";
import auth from "../services/authService";

export default function NavList({ context }) {
  const { user, cartId } = context;

  const orderLink = user ? "/order" : "/before-order";

  return (
    <ul className="navbar-nav mx-sm-auto fw-bold ">
      <li className="nav-item text-nowrap mx-1">
        <NavLink end className="nav-link" to="/">
          Home
        </NavLink>
      </li>
      {cartId && (
        <li className="nav-item text-nowrap mx-1">
          <NavLink end className="nav-link" to={orderLink}>
            Order
          </NavLink>
        </li>
      )}
      {!user && (
        <li className="nav-item text-nowrap mx-1">
          <NavLink end className="nav-link" to="/login">
            <img src="svg/box-arrow-in-right.svg" alt="login" />
          </NavLink>
        </li>
      )}
      {user && (
        <li className="nav-item dropdown">
          <div
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Account
          </div>
          <ul className="dropdown-menu">
            <li>
              <NavLink to="/my-orders" className="dropdown-item fw-bold">
                My Orders
              </NavLink>
            </li>
            <li>
              <button
                className="dropdown-item fw-bold"
                onClick={() => {
                  auth.logout();
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </li>
      )}
    </ul>
  );
}
