import React, { Component } from "react";
import ProductCart from "./productCart";
import { getProduct, getProductUrl } from "../services/productService";
import { withRouter } from "../utils/withRouter";

class Product extends Component {
  state = {
    product: {},
  };

  async populateProduct() {
    const { router } = this.props;
    try {
      const { data } = await getProduct(router.params.id);
      if (!data) return null;
      this.setState({ product: data });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        router.navigate("/produkt-nieodnaleziony");
    }
  }

  async componentDidMount() {
    await this.populateProduct();
  }

  render() {
    const { product } = this.state;

    return (
      <React.Fragment>
        <main className="px-5">
          <section className="container">
            <div className="row">
              <div className="col-sm-12 col-lg-7">
                <img
                  src={getProductUrl(product.image)}
                  className="img-fluid"
                  alt={`${product.name}`}
                />
              </div>
              <div className="col-sm-12 col-lg-5 d-flex justify-content-center flex-column">
                <ProductCart />
              </div>
            </div>
          </section>
          <section className="description my-5">
            <div className="container position-relative">
              <h2 className="mb-2 fs-3">{product.name}</h2>
              <div className="col-12 px-1 py-1">{product.description}</div>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(Product);
