const express = require("express");
const _ = require("lodash");
const { createCart } = require("../controllers/orders/carts");
const validateObjectId = require("../middleware/validateObjectId");
const {
  increaseProductStock,
  decreaseUnhiddenProductStock,
} = require("../controllers/products");
const router = express.Router();
const { validate, validateProducts, Cart } = require("../models/order/cart");

router.get("/:id", validateObjectId, async (req, res) => {
  let cart = await Cart.findById(req.params.id).populate(
    "list.product",
    "name image"
  );

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const list = [];
  let totalCost = 0;
  for (let product of req.body.list) {
    let updated = await decreaseUnhiddenProductStock(
      product.productId,
      product.quantity
    );

    if (!updated) {
      for (const prevProduct of req.body.list) {
        if (product.productId === prevProduct.productId)
          return res
            .status(400)
            .send("The product with the given ID was not found.");

        await increaseProductStock(prevProduct.productId, prevProduct.quantity);
      }
    }

    list.push({
      product: updated._id,
      cost: updated.price,
      quantity: product.quantity,
    });

    totalCost += updated.price * product.quantity;
  }

  const cart = new Cart({
    list,
    totalCost,
  });
  await cart.save();

  res.send(cart);
});

router.post("/products", async (req, res) => {
  validateProducts;
});

module.exports = router;
