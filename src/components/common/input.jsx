import React from "react";

export default function Input({ name, label, error, ...rest }) {
  return (
    <div className="form-floating">
      <input
        {...rest}
        name={name}
        className={`form-control ${error && "is-invalid"}`}
        placeholder={label}
      />
      <label htmlFor={name}>{label}</label>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
