import React from "react";
import { Link, useOutletContext } from "react-router-dom";

export default function BeforeOrder() {
  const rootState = useOutletContext();
  if (rootState.user) window.location.href = "/order";

  return (
    <main
      className="w-100 bg-dark d-flex justify-content-center align-items-center position-absolute top-0"
      style={{ minHeight: "100vh", zIndex: "1030" }}
    >
      <div
        className="text-dark bg-light rounded-4 p-4"
        style={{ width: "22rem" }}
      >
        <div className="px-4 position-relative">
          <h3>Create an account!</h3>
          An account will allow you to:
          <ul className="px-1 pt-1">
            <li>view the status of your orders.</li>
            <li>store the history of your orders.</li>
            <li>paying orders in case of unexpected errors.</li>
          </ul>
          <Link to="/">
            <button
              className="d-inline btn-close position-absolute fs-6"
              style={{ top: "0px", right: "0px" }}
              aria-label="close"
            />
          </Link>
        </div>

        <div className="d-flex justify-content-evenly fs-bolder">
          <Link className="btn btn-dark" to="/register">
            Create An Account
          </Link>
          <Link className="btn btn-grey" to="/order" style={{ opacity: "0.8" }}>
            Just Order
          </Link>
        </div>
      </div>
    </main>
  );
}
