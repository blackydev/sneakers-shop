import React, { Component } from "react";
import { Link } from "react-router-dom";

class ProductCard extends Component {
  render() {
    const { product } = this.props;

    return (
      <div key={`${product._id}`} className="card" style="width: 18rem;">
        <img src="head.jpg" className="card-img-top" alt={`${product.name}`} />
        <div className="card-body">
          <h5 className="card-title"></h5>
          <p className="card-text">{product.slogan}</p>
          <Link to={`sklep/${product._id}`} className="btn btn-primary">
            Go somewhere
          </Link>
        </div>
      </div>
    );
  }
}

export default ProductCard;
