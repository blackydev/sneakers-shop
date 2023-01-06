import React, { useState, useEffect } from "react";
import { apiUrl } from "../../services/httpService";
import { getImgDominantColor, shadeColor } from "../../utils/colorsUsage";

function getGradient(color) {
  const firstColor = shadeColor(color, 20);
  const secondColor = shadeColor(color, 90);
  const gradient = `linear-gradient(0deg, ${firstColor} 0%, ${secondColor} 100%)`;
  return gradient;
}

export default function ProductImg({ product, rounded = 5 }) {
  const [color, setColor] = useState();

  useEffect(() => {
    async function effect() {
      const color = await getImgDominantColor(apiUrl + product.image);
      setColor(color.hex);
    }
    effect();
  });

  return (
    <div className={`productImg shadow-lg rounded-${rounded}`}>
      <div
        className="position-relative"
        style={{
          background: color && getGradient(color),
        }}
      >
        <img
          className="product"
          src={apiUrl + product.image}
          alt={`${product.name}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
