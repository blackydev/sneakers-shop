import React, { Component } from "react";
import "../styles/home.css";
import ProductCard from "./productCard";
import { getNewestProduct, getProductUrl } from "../services/productService";
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
          <section className="container d-flex justify-content-center product position-relative py-3">
            <div className="col-lg-4">{<ProductCard product={product} />}</div>
          </section>
*/

export default Home;
