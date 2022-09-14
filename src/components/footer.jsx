import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class Footer extends Component {
  state = {};

  render() {
    return (
      <footer className="bg-dark text-light p-5">
        <div className="container p-2 justify-content-center text-center">
          <div className="d-flex flex-wrap justify-content-center">
            <div className="justify-content-center my-3 mx-5 px-5">
              <h3 className="fs-5">DAMIAN LIKUS</h3>
              <div>
                <Link
                  className="fw-lighter text-nowrap"
                  to="/polityka-prywatnosci"
                >
                  Polityka Prywatności
                </Link>
              </div>
              <div>
                <Link className="fw-lighter text-nowrap" to="/regulamin-sklepu">
                  Regulamin Sklepu
                </Link>
              </div>
            </div>
            <div className="justify-content-center my-3 mx-5 px-5">
              <h3 className="fs-5">KONTAKT</h3>
              <div>
                <a className="fw-lighter text-nowrap" href="tel:+48883133829">
                  +48 883 133 829
                </a>
              </div>
              <div>
                <a
                  className="fw-lighter text-nowrap"
                  href="mailto:hello@damianlikus.com"
                >
                  hello@damianlikus.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
