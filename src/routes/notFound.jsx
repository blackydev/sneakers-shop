import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function NotFound() {
  const { statusText, status } = useRouteError();
  if (statusText) var header = statusText;
  else header = "The page was not found.";

  return (
    <main className="container position-relative" style={{ minHeight: "90vh" }}>
      <section
        className="position-absolute top-50 start-50 translate-middle text-center"
        id="not-found"
      >
        <h2 className="fw-bold my-3">{header}</h2>
        {status !== 503 && (
          <Link to={"/"} type="button" className="btn btn-lg btn-dark">
            Return to home page.
          </Link>
        )}
      </section>
    </main>
  );
}
