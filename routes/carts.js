const express = require("express");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { validate, Cart } = require("../models/cart");
const { Product } = require("../models/product");

/* 
INSTRUCTION:
  GET /
    creates and returns new empty cart

  GET /:id
    get cart

  PUT /:id
    req: { product, quantity }
    put product to cart

  DELETE /:id/:productId
    delete product in cart
*/

router.get("/", async (req, res) => {
  const cart = new Cart({
    list: [],
  });
  await cart.save();
  res.send(cart);
});

router.get("/:id", validateObjectId, async (req, res) => {
  let cart = await Cart.findById(req.params.id).populate(
    "list.product",
    "name image"
  );

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

router.put("/:id", async (req, res) => {
  /* 
  req: {
    productId,
    quantity
  }
  */
  const { productId, quantity: reqQuantity } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);
  const cart = await Cart.findById(req.params.id);
  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  const index = cart.list.findIndex((item) => item.product == productId);

  if (index === -1) var quantity = reqQuantity;
  else quantity = reqQuantity - cart.list[index].quantity;

  const product = await Product.findByIdAndDecreaseStock(productId, quantity);
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  if (index === -1)
    cart.list.push({
      product: productId,
      cost: product.price,
      quantity: reqQuantity,
    });
  else cart.list[index].quantity = reqQuantity;

  await cart.save();
  res.send(cart);
});

router.delete("/:cartId/:productId", async (req, res) => {
  const { params } = req;

  let cart = await Cart.findById(params.cartId);
  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  let list = cart.list;

  const index = list.findIndex((item) => item.product == params.productId);
  if (index === -1)
    return res
      .status(400)
      .send("The cart doesn't have product with the given ID.");

  let product = await Product.findByIdAndIncreaseStock(
    params.productId,
    list[index].quantity
  );
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  cart.list.splice(index, 1);
  if (cart.list.length === 0) {
    await cart.remove();
    return res.status(204).send();
  }

  await cart.save();
  res.send(cart);
});

module.exports = router;
