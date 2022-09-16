import React from "react";
import ProductCard from "../productCard/horizontal";

export default function Products({
  products,
  className,
  onSelect,
  onDelete,
  style,
}) {
  return (
    products &&
    products.map((product) => (
      <div className={className} key={product._id} style={style}>
        <ProductCard
          product={product}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>
    ))
  );
}
