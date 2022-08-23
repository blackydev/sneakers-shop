const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");
const { upload } = require("../middleware/productUpload");
const { Product, validate, validateUnrequired } = require("../models/product");
const { deleteFile } = require("../functions/deleteFile");

const hiddenQuery = { hidden: { $in: [false, null] } };

router.get("/", async (req, res) => {
  try {
    const { hide, select, sortBy } = req.query;
    const query = hide === "false" ? null : hiddenQuery;

    const products = await Product.find(query)
      .select(select) // ["_id", "name", "image", "price"]
      .sort(sortBy);

    res.send(products);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.hidden)
    return res.status(404).send("The product with the given ID was not found.");
  res.send(product);
});

router.get("/all", [auth, isAdmin], async (req, res) => {
  const products = await Product.find().select([
    "_id",
    "name",
    "image",
    "price",
  ]);
  res.send(products);
});

router.get("/all/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");
  res.send(product);
});

router.post("/", [auth, isAdmin, upload.single("image")], async (req, res) => {
  req.body.image = req.file ? req.file.destination + req.file.filename : "";

  const { error } = validate(req.body);
  if (error) {
    deleteImage(req);
    return res.status(400).send(error.details[0].message);
  }

  const product = new Product(getProperties(req.body));
  await product.save();

  res.send(product);
});

router.patch(
  "/:id",
  [auth, isAdmin, validateObjectId, upload.single("image")],
  async (req, res) => {
    req.body.image = req.file ? req.file.destination + req.file.filename : "";

    const { error } = validateUnrequired(req.body);
    if (error) {
      deleteImage(req);
      return res.status(400).send(error.details[0].message);
    }

    const oldProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (!oldProduct) {
      res.status(404).send("The product with the given ID was not found.");
      return deleteImage(req);
    }

    const newProduct = await Product.findById({ _id: req.params.id });

    res.status(200).send(newProduct);
    if (req.file) await deleteFile(oldProduct.image);
  }
);

const deleteImage = async (req) => {
  req.file ? await deleteFile(req.body.image) : null;
};

const getProperties = (productBody) => {
  return _.pick(productBody, [
    "name",
    "image",
    "description",
    "slogan",
    "price",
    "numberInStock",
    "release",
    "hidden",
  ]);
};

module.exports = router;
