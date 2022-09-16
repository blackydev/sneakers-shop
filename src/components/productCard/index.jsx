import React from "react";
import { Link } from "react-router-dom";
import ProductImg from "./productImg";
import AlertMessage from "../common/productAlertMessage";
import { toast } from "react-toastify";
import cartService from "../../services/cartService";

export default function ProductCard({ rootState, product }) {
  return (
    <div className="productCard d-block text-decoration-none mb-2">
      <Link to={`/shop/${product._id}`} className="user-select-none ">
        <ProductImg product={product} />
      </Link>

      <div className="body mt-3 mx-1 position-relative d-flex">
        <Link
          to={`/shop/${product._id}`}
          className="text-dark text-decoration-none"
          style={{ width: "calc(100% - 50px)", overflow: "hidden" }}
        >
          <h4 className="fs-6 fw-bold text-truncate">{product.name}</h4>
          <h5 className="fs-6 fw-bold d-flex align-items-end">
            {product.price.toFixed(2)} zł
            <div className="badge bg-dark ms-2" role="alert">
              <AlertMessage product={product} />
            </div>
          </h5>
        </Link>
        {product.numberInStock !== 0 && (
          <button
            className="btn my-0 position-absolute end-0"
            onClick={async () => {
              await cartService.pushProduct(product._id, 1);
              toast.success("Product has been added to your cart.");
              rootState.setCartId(cartService.getCartId());
            }}
          >
            <img
              src="svg/add-button.svg"
              alt="add-product-to-card-button"
              style={{ height: "30px", zIndex: "2" }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
