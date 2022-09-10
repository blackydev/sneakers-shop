const { Product } = require("../models/product");

const validateProductId = async (req, res, next) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  next();
};

module.exports = {
  validateProductId,
};
