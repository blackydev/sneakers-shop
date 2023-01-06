import React, { useState, useEffect } from "react";
import { apiUrl } from "../services/httpService";
import { getImgDominantColor, shadeColor } from "../utils/colorsUsage";
import { Link } from "react-router-dom";

function getGradient(color) {
  const firstColor = shadeColor(color, -8);
  const secondColor = shadeColor(color, 30);
  const thirdColor = shadeColor(color, 25);
  const gradient = `linear-gradient(100deg, ${firstColor} 0%, ${secondColor} 65%,${thirdColor} 100%)`;
  return gradient;
}

export default function HomeHeader({ product }) {
  const [color, setColor] = useState();
  const [textColor, setTextColor] = useState();

  useEffect(() => {
    async function effect() {
      const { hex, isLight } = await getImgDominantColor(
        apiUrl + product.image
      );
      setColor(hex);
      if (isLight) setTextColor("black");
      else setTextColor("white");
    }
    effect();
  });
  if (color) var gradient = getGradient(color);
  return (
    <header
      className={"position-relative overflow-hidden home text-" + textColor}
      style={{
        background: gradient,
        transform: "translateY(-56px)",
      }}
    >
      <div className="bg-text">{product.category.name}</div>
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="text col-4 col-xl-2 mb-xl-5 pb-xl-5">
            <h2 className="fw-bold mb-2">BUY NOW</h2>
            <div className="fs-5 text-uppercase">{product.name}</div>
            <h4 className="fs-6">{product.price} zł</h4>
            <Link to={"/shop/" + product._id} className="btn btn-sm btn-dark">
              {" "}
              GET IT NOW!{" "}
            </Link>
          </div>
          <img
            src={apiUrl + product.image}
            alt={product.name}
            className="col-8 col-md-6 col-xl-5"
          />
        </div>
      </div>
    </header>
  );
}
