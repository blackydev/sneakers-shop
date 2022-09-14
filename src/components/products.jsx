import React, { Component } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "./productCard";
import Header from "./header";

class Products extends Component {
  state = {
    products: [],
    title: "Sklep",
  };

  async componentDidMount() {
    const { data: products } = await getProducts();
    this.setState({ products });
  }

  render() {
    const { products, title } = this.state;
    return (
      <React.Fragment>
        <Header title={title} />
        <main className="p-5 mainProduct">
          <section className="container">
            <ul className="row list-products">
              {products.map((product) => {
                return (
                  <React.Fragment>
                    <li className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-2">
                      <ProductCard product={product} />
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Products;
