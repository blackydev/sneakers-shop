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
      name: "Płyta",
      path: "/sklep/631e5c79eefa5dde8f7531b3",
    },
  ];

  NavAnchors = [
    {
      name: "Facebook",
      path: "https://www.facebook.com/damianlikus",
      imgUrl: "/svg/facebook.svg",
    },
    {
      name: "Instagram",
      path: "https://www.instagram.com/damian.likus/",
      imgUrl: "/svg/instagram.svg",
    },
    {
      name: "Youtube",
      path: "https://www.youtube.com/c/DamianLikus",
      imgUrl: "/svg/youtube.svg",
    },
  ];

  render() {
    return (
      <nav className="w-100 bg-light">
        <div className="navbar navbar-light navbar-expand-sm">
          <div className=" container-md">
            <Link className="navbar-brand" to="/">
              <img src="/img/logo.png" height="45" alt="Damian Likus"></img>
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
                    <li
                      key={`${e.name}`}
                      className="nav-item text-nowrap fw-bold"
                    >
                      <NavLink className="nav-link" to={`${e.path}`}>
                        {e.name}
                      </NavLink>
                    </li>
                  );
                })}
                {this.NavAnchors.map((e) => {
                  return (
                    <li
                      key={`${e.name}`}
                      className="nav-item text-nowrap fw-bold"
                    >
                      <a className="nav-link" href={`${e.path}`}>
                        <img src={`${e.imgUrl}`} alt={`${e.name}`} />
                      </a>
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
