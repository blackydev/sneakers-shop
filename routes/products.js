const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const { upload } = require("../middleware/productUpload");
const { Product, validate, validateUnrequired } = require("../models/product");
const { findProducts, findProductById } = require("../controllers/products");
const { deleteFile } = require("../functions/deleteFile");

const deleteImage = async (req) => {
  req.file ? await deleteFile(req.body.image) : null;
};

router.get("/", async (req, res) => {
  const products = await findProducts();
  res.send(products);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await findProductById(req.params.id);
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");
  res.send(product);
});

router.post("/", [auth, admin, upload.single("image")], async (req, res) => {
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
  [auth, admin, validateObjectId, upload.single("image")],
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

    res.send(newProduct);
    await deleteFile(oldProduct.image);
  }
);

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
