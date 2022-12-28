const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { validate, Cart } = require("../models/cart");
const { Product } = require("../models/product");

const router = express.Router();

/* 
INSTRUCTION:
  GET /
    creates and returns new empty cart

  GET /:id
    get cart

  PUT /:id
    req: { product, amount }
    put product to cart

  DELETE /:id/:productId
    delete product in cart
*/

router.get("/", async (req, res) => {
  const cart = new Cart({
    items: [],
  });
  await cart.save();
  res.send(cart);
});

router.get("/:id", validateObjectId, async (req, res) => {
  let cart = await Cart.findById(req.params.id).populate(
    "items.product",
    "name image release"
  );

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

router.put("/:id", async (req, res) => {
  /* 
  req: {
    productId,
    amount
  }
  */
  const { productId, amount: reqAmount } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);
  const cart = await Cart.findById(req.params.id);
  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  const index = cart.items.findIndex((item) => item.product == productId);

  if (index === -1) var amount = reqAmount;
  else amount = reqAmount - cart.items[index].amount;

  const product = await Product.findByIdAndDecreaseStock(productId, amount);
  if (!product)
    return res.status(400).send("The product with the given ID was not found.");

  if (index === -1)
    cart.items.push({
      product: productId,
      price: product.price,
      amount: reqAmount,
    });
  else cart.items[index].amount = reqAmount;

  await cart.save();
  res.send(cart);
});

router.delete("/:cartId/:productId", async (req, res) => {
  const { params } = req;

  let cart = await Cart.findById(params.cartId);
  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  let items = cart.items;

  const index = items.findIndex((item) => item.product == params.productId);
  if (index === -1)
    return res
      .status(400)
      .send("The cart doesn't have product with the given ID.");

  let product = await Product.findByIdAndIncreaseStock(
    params.productId,
    items[index].amount
  );
  if (!product)
    return res.status(400).send("The product with the given ID was not found.");

  cart.items.splice(index, 1);
  if (cart.items.length === 0) {
    await cart.remove();
    return res.status(204).send();
  }

  await cart.save();
  res.send(cart);
});

module.exports = router;
