import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getProductUrl } from "../services/productService";

class ProductCard extends Component {
  render() {
    const { product } = this.props;

    return (
      <React.Fragment>
        <div key={`${product._id}`} className="card card-product">
          <Link to={`sklep/${product._id}`}>
            <img
              src={getProductUrl(product.image)}
              className="card-img-top"
              alt={`${product.name}`}
            />

            <div className="card-body">
              <h4 className="card-title fw-bold text-truncate mb-1">
                {product.name}
              </h4>
              <div className="card-text">{product.price} zł</div>
            </div>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default ProductCard;
