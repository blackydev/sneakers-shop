import React from "react";
import ProductCard from "../productCard";

export default function Products({ rootState, products, className, style }) {
  return products.map((product) => {
    return (
      <div className={className} key={product._id} style={style}>
        <ProductCard rootState={rootState} product={product} />
      </div>
    );
  });
}
