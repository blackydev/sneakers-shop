import React, { Component } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "./productCard";

class Products extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const { data: products } = await getProducts();
    this.setState({ products });
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <main>
          <section>
            {products.map((product) => {
              return <ProductCard products={products} />;
            })}
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Products;
