import React from "react";

export default function ButtonGroup({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect,
  size,
  color = "dark",
}) {
  return (
    <ul className={`btn-group btn-group-${size} list-group-item`}>
      {items.map((item) => (
        <li
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item._id === selectedItem
              ? `btn btn-${color} text-capitalize active`
              : `btn btn-${color} text-capitalize`
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
}

ButtonGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};
