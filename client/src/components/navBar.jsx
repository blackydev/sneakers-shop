import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class NavBar extends Component {
  state = {};

  NavLinks = [
    {
      name: "Strona Główna",
      path: "/",
    },
    {
      name: "Sklep",
      path: "/sklep",
    },
    {
      name: "Sociale",
      path: "/socialmedia",
    },
  ];

  render() {
    return (
      <nav className="w-100 bg-light">
        <div className="navbar navbar-light navbar-expand-sm">
          <div className=" container-md">
            <Link className="navbar-brand" to="/">
              <img src="logo.png" height="45" alt="Damian Likus"></img>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-sm-auto">
                {this.NavLinks.map((e) => {
                  return (
                    <li className="nav-item text-nowrap">
                      <NavLink className="nav-link" to={`${e.path}`}>
                        {e.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
