import React, { Component } from "react";
import "../styles/home.css";
import ProductCard from "./productCard";
import { getNewestProduct } from "../services/productService";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="home">
      <picture>
        <img src="/img/mainHeader.jpg" alt="konsola DJ" />
      </picture>
    </header>
  );
};

class Home extends Component {
  state = {
    product: {},
  };

  async componentDidMount() {
    const { data: products } = await getNewestProduct();
    const product = products[0];
    this.setState({ product });
  }

  render() {
    const { product } = this.state;
    return (
      <React.Fragment>
        <Header />
        <main className="p-5 bg-light home">
          <section className="container about py-5">
            <div className="position-relative row align-items-center">
              <picture className="col-lg-6">
                <img
                  className="img-fluid rounded"
                  src="/img/dj-damian-likus.jpg"
                  alt="DJ Damian Likus Chrzanów"
                />
              </picture>
              <div className="col-lg-6 text-white text-center about-text">
                <div className="p-4 rounded bg-primary ">
                  <h4 className="md-3 fw-bold">DJ i Producent Muzyczny</h4>
                  <div>
                    Jestem absolwentem Państwowej Szkoły Muzycznej I stopnia.
                    Byłem uczestnikiem „Latem Zagrane”, organizowanych przez
                    Adama Sztabę, na których w koncercie finałowym miał okazję
                    dyrygować orkiestrą podczas wykonania utworu „Feel You” z
                    autorskiej wydanej płyty "emotions".
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container d-flex justify-content-center product position-relative py-3">
            <div className="col-lg-4">{<ProductCard product={product} />}</div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

/*
                  <div className="d-flex flex-wrap justify-content-center text-center my-4">
                    <div className="justify-content-center my-2 mx-2">
                      <a
                        type="button"
                        className="btn btn-primary"
                        href="mailto:hello@damianlikus.com"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-envelope-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"></path>
                        </svg>{" "}
                        hello@damianlikus.com
                      </a>
                    </div>
                    <div className="justify-content-center my-2 mx-2">
                      <a
                        type="button"
                        className="btn btn-primary"
                        href="tel:+48883133829"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-phone-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"></path>
                        </svg>{" "}
                        +48 883 133 829
                      </a>
                    </div>
                  </div>
*/

export default Home;
