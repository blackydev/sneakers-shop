import React from "react";

export default function ImgRadio({ name, options, onChange, className }) {
  return options.map((option) => {
    return (
      <div key={option._id} onChange={onChange} className="col">
        <input
          className="imgRadio d-none"
          type="radio"
          name={name}
          id={option._id}
          value={option._id}
        />
        <label className="imgRadio" htmlFor={option._id}>
          <img
            key={option._id}
            id={option._id}
            value={option._id}
            src={option.src}
            alt={option.name}
          />
        </label>
      </div>
    );
  });
}
