const { Delivery } = require("../models/delivery");

exports.createDelivery = async (deliveryBody) => {
  const id = deliveryBody.methodId;
  if (!id) return new Error("No delivery ID.");

  const delivery = await Delivery.findById(id);

  if (!delivery)
    return new Error("The delivery with the given ID was not found.");
  if (delivery.points)
    if (!deliveryBody.point)
      return new Error(
        "The delivery with the given ID should have point send."
      );

  return {
    methodId: delivery._id,
    name: delivery.name,
    cost: delivery.price,
    point: deliveryBody.point,
  };
};
