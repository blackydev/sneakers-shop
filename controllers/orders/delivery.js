const mongoose = require("mongoose");
const _ = require("lodash");
const { Delivery } = require("../../models/order/delivery");

exports.createDelivery = async (deliveryBody) => {
  const delivery = await Delivery.findById(deliveryBody._id);
  if (delivery.points)
    if (!deliveryBody.point)
      return new Error(
        "The delivery with the given ID should have point send."
      );

  return {
    _id: delivery._id,
    name: delivery.name,
    price: delivery.price,
    point: deliveryBody.point,
  };
};
