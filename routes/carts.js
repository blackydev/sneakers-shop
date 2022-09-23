const express = require("express");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const {
  increaseProductStock,
  decreaseUnhiddenProductStock,
} = require("../controllers/products");
const router = express.Router();
const { validate, validateListItem, Cart } = require("../models/cart");

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
  req: 
  list: [{
    product,
    quantity
  }]
  */
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const list = [];
  let totalCost = 0;
  for (let item of req.body.list) {
    let updated = await decreaseUnhiddenProductStock(
      item.product,
      item.quantity
    );

    if (!updated) {
      for (const prevProduct of req.body.list) {
        if (item.product === prevProduct.product)
          return res
            .status(400)
            .send("The product with the given ID was not found.");

        await increaseProductStock(prevProduct.product, prevProduct.quantity);
      }
    }

    list.push({
      product: updated._id,
      cost: updated.price,
      quantity: item.quantity,
    });

    totalCost += updated.price * item.quantity;
  }

  let cart = new Cart({
    list,
    totalCost,
  });
  await cart.save();

  cart = await cart.populate("list.product", "name image");

  res.send(cart);
});

router.patch("/:id/list-item", async (req, res) => {
  /* 
  req: {
    product,
    quantity
  }
  */
  const body = req.body;
  const { error } = validateListItem(body);
  if (error) return res.status(400).send(error.message);
  let cart = await Cart.findById(req.params.id);
  if (!cart)
    return res.status(400).send("The cart with the given ID was not found.");

  const index = cart.list.findIndex((item) => item.product == body.product);
  if (index !== -1) var quantity = body.quantity - cart.list[index].quantity;
  else var quantity = body.quantity;

  let product = await decreaseUnhiddenProductStock(body.product, quantity);
  if (!product)
    return res.status(400).send("The product with the given ID was not found.");

  if (index !== -1) cart.list[index].quantity = body.quantity;
  else
    cart.list.push({
      product: product._id,
      cost: product.price,
      quantity: body.quantity,
    });

  await cart.save();
  res.send(cart);
});

router.delete("/:id/list-item", async (req, res) => {
  /* 
  req: {
    product,
  }
  */
  const body = req.body;
  const { error } = validateListItem({ ...body, quantity: 1 });
  if (error) return res.status(400).send(error.message);
  let cart = await Cart.findById(req.params.id);
  if (!cart)
    return res.status(400).send("The cart with the given ID was not found.");

  let list = cart.list;
  if (list.length === 1) {
    await cart.remove();
    return res.status(204).send();
  }

  const index = list.findIndex((item) => item.product == body.product);
  if (index === -1)
    return res
      .status(400)
      .send("The cart doesn't have product with the given ID.");

  let product = await increaseProductStock(body.product, list[index].quantity);
  if (!product)
    return res.status(400).send("The product with the given ID was not found.");

  cart.list.splice(index, 1);

  await cart.save();
  res.send(cart);
});

module.exports = router;
