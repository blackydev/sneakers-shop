import React, { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ProductImg from "../components/productCard/productImg";
import NumberSelect from "../components/common/numberSelect";
import productService from "../services/productService";
import cartService from "../services/cartService";
import AlertMessage from "../components/common/productAlertMessage";

export async function loader({ params }) {
  try {
    const { data: product } = await productService.getProduct(params.id);
    return { product };
  } catch (ex) {
    if (ex.response && ex.response.status === 404)
      throw new Response("Product with given ID was not found.", {
        status: 404,
      });
  }
}

export default function Product() {
  const rootState = useOutletContext();
  let { product } = useLoaderData();
  let [amount, setAmount] = useState(1);

  return (
    <div
      className="d-flex align-items-end text-bg-light"
      style={{ minHeight: "65vh" }}
    >
      <section className="container" id="product">
        <div className="row d-flex justify-content-center text-center text-lg-start">
          <div className="col-6 col-lg-4 my-5 my-lg-auto">
            <ProductImg product={product} />
          </div>
          <div className="col-10 col-lg-8 d-flex">
            <div className="my-auto w-100 ">
              <h2 className="d-flex align-items-start justify-content-center justify-content-lg-start">
                {product.name}
                <div className="badge fs-6 bg-primary ms-2 mt-1" role="alert">
                  <AlertMessage product={product} />
                </div>{" "}
              </h2>

              <p>{product.description}</p>
              <div className="mx-auto mx-lg-0" style={{ width: "200px" }}>
                {product.numberInStock !== 0 && (
                  <div className="input-group mb-3 me-2">
                    <NumberSelect
                      min={1}
                      max={9}
                      defaultValue={1}
                      distance={1}
                      onSelect={(e) => setAmount(e.target.value)}
                      aria-label="products-amount-selector"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={async () => {
                        await cartService.pushProduct(product._id, amount);
                        toast.success("Product has been added to your cart.");
                        rootState.setCartId(cartService.getCartId());
                      }}
                    >
                      ADD TO CARD
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
