const mongoose = require("mongoose");
const _ = require("lodash");
const { Delivery } = require("../models/delivery");

exports.createDelivery = async (deliveryBody) => {
  const delivery = await Delivery.findById(deliveryBody.id);
  if (delivery.points)
    if (!deliveryBody.point)
      throw new Error("The delivery with the given ID should have point send.");

  return {
    id: delivery.id,
    name: delivery.name,
    cost: delivery.price,
    point: deliveryBody.point,
  };
};
