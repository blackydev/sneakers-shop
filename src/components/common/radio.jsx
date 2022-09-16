import React from "react";

export default function Radio({ name, options, onChange }) {
  return (
    <div className="form-check" onChange={onChange}>
      {options.map((option) => {
        return (
          <div className="form-check" key={option._id}>
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={option._id}
              value={option._id}
            />
            <label className="form-check-label" htmlFor={option._id}>
              {option.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
