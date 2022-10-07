const express = require("express");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { validate, Cart } = require("../models/cart");
const { Product } = require("../models/product");

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
  /*  
  req: {
    product,
    quantity
  }
  */
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let product = await Product.findByIdAndDecreaseStock(
    req.body.product,
    req.body.quantity
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  let cart = new Cart({
    list: [{ product: product._id, cost: product.price }],
  });

  await cart.save();

  cart = await cart.populate("list.product", "name image");

  res.send(cart);
});

router.put("/:id", async (req, res) => {
  /* 
  req: {
    product,
    quantity
  }
  */
  const body = req.body;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.message);
  let cart = await Cart.findById(req.params.id);
  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  const index = cart.list.findIndex((item) => item.product == body.product);
  if (index !== -1) var quantity = body.quantity - cart.list[index].quantity;
  else var quantity = body.quantity;

  let product = await Product.findByIdAndDecreaseStock(body.product, quantity);
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  if (index !== -1) {
    cart.list[index].quantity = body.quantity;
  } else {
    cart.list.push({
      product: product._id,
      cost: product.price,
      quantity: body.quantity,
    });
  }

  await cart.save();
  res.send(cart);
});
router.delete("/:id/:productId", async (req, res) => {
  /* 
  req: {
    product,
  }
  */
  const { params } = req;

  let cart = await Cart.findById(params.id);
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
