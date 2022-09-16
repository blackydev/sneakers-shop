import React from "react";

export default function NumberSelect({
  min,
  max,
  distance,
  onSelect,
  ...rest
}) {
  const arr = [];
  for (let i = min; i <= max; i += distance) arr.push(i);
  return (
    <select className="form-select" onChange={(e) => onSelect(e)} {...rest}>
      {arr.map((e) => {
        return (
          <option key={e} value={`${e}`}>
            {e}
          </option>
        );
      })}
    </select>
  );
}
