import React, { Component } from "react";
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
        <main className="p-5 container">
          <section className="row">
            <div className="col-md-12 col-lg-4 my-2">
              <img
                src={getProductUrl(product.image)}
                className="card-img-top"
                alt={`${product.name}`}
              />
            </div>
            <h5 className="card-title d-flex justify-content-between">
              {product.name}
            </h5>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(Product);
