import React, { Component } from "react";
import { getProducts } from "../services/productService";

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
              return <div key={`${product._id}`}> {product.name} </div>;
            })}
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Products;
