import React, { Component } from "react";

function ProductNotFound() {
  return (
    <React.Fragment>
      <main className="py-5 container position-relative">
        <section className="position-absolute top-50 start-50 translate-middle">
          <h2 className="fw-bold text-center">
            Produkt nie został odnaleziony.
          </h2>
        </section>
      </main>
    </React.Fragment>
  );
}

export default ProductNotFound;
