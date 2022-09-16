import React from "react";
import { Link } from "react-router-dom";
import ProductImg from "./productImg";
import NumberSelect from "../common/numberSelect";
import AlertMessage from "../common/productAlertMessage";

export default function ProductCard({ product, onSelect, onDelete }) {
  const arr = [];
  for (let i = 1; i <= 9; i++) arr.push({ id: i, value: i });
  return (
    <div className="bg-secondary shadow rounded-3 p-3 py-3" id={product._id}>
      <div className="productCard user-select-none text-decoration-none d-flex position-relative ">
        <div style={{ width: "120px", minWidth: "120px" }}>
          <ProductImg product={product} rounded={4} />
        </div>

        <div
          className="d-flex flex-column justify-content-center position-relative ms-4"
          style={{ width: "calc(100% - 120px)" }}
        >
          <div
            className="d-flex justify-content-between text-truncate mt-3"
            style={{ maxWidth: "calc(100% - 40px)" }}
          >
            <h4 className="fs-6 fw-bold text-truncate">
              <Link
                className="text-decoration-none text-dark w-100"
                to={`/shop/${product._id}`}
              >
                {product.name}
              </Link>
            </h4>
          </div>

          <div className="d-flex align-items-center">
            <h5 className="fs-6 align-self-end">
              {product.price.toFixed(2)} zł
              {!onSelect && product.amount !== 1 && <> x {product.amount}</>}
            </h5>

            {onSelect && (
              <>
                <button
                  className="d-inline btn-close mx-2"
                  disabled
                  aria-label="multiply"
                />
                <NumberSelect
                  min={1}
                  max={9}
                  defaultValue={product.amount}
                  distance={1}
                  onSelect={onSelect}
                  data-id={product._id}
                  style={{ width: "85px", height: "35px", fontSize: "14px" }}
                />
              </>
            )}
            <div
              className="badge bg-dark position-absolute top-0 mt-2"
              role="alert"
            >
              <AlertMessage product={product} />
            </div>
          </div>
        </div>
        {onDelete && (
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 ms-3"
            aria-label="Close"
            onClick={onDelete}
            data-id={product._id}
          />
        )}
      </div>
    </div>
  );
}
