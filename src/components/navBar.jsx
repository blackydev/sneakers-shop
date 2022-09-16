import React from "react";
import NavList from "./navList";
import { Link } from "react-router-dom";

function NavBar({ context }) {
  return (
    <>
      <div style={{ marginTop: "56px" }} />
      <nav className="navbar fixed-top navbar-light bg-light navbar-expand-sm">
        <div className="container-md">
          <Link
            className="navbar-brand position-absolute fw-bold top-0 pt-1 mt-2"
            to="/"
          >
            Sneakers
          </Link>

          <button
            className="navbar-toggler ms-auto"
            style={{ border: "none" }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavList context={context} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
