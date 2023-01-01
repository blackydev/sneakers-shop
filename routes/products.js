const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const { Category } = require("../models/category");
const { Product, validate } = require("../models/product");
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");
const { upload, dirPath } = require("../middleware/productUpload");
const { validateProductId } = require("../middleware/validateProductId");
const { deleteFile } = require("../utils/deleteFile");

const router = express.Router();

router.get("/", async (req, res) => {
  let { select, sortBy, pageLength, pageNumber, category } = req.query;
  if (!sortBy) sortBy = "-release";
  if (category) var query = { category };

  try {
    const products = await Product.find(query)
      .populate("category", "name")
      .select(select) // ["_id", "name", "image", "price"]
      .sort(sortBy)
      .limit(pageLength)
      .skip(pageLength * pageNumber);

    res.send(products);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(
    req.params.id,
    req.query.select
  ).populate("category", "name");

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.post("/", [auth, isAdmin, upload.single("image")], async (req, res) => {
  if (req.file) req.body.image = req.file.filename;

  const { error } = validate(req.body);
  if (error) {
    if (req.file) await deleteImage(req.body.image);
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(400)
      .send("The category with the given ID was not found.");

  let product = new Product(
    _.pick(req.body, [
      "name",
      "image",
      "description",
      "price",
      "numberInStock",
      "release",
      "category",
    ])
  );
  product = await product.save();

  res.send(product);
});

router.put(
  "/:id",
  [validateObjectId, auth, isAdmin, validateProductId, upload.single("image")],
  async (req, res) => {
    if (req.file) req.body.image = req.file.filename;
    else req.body.image = "";

    const { error } = validate(req.body);
    if (error) {
      if (req.file) await deleteImage(req.body.image);
      return res.status(400).send(error.details[0].message);
    }

    if (req.body.image === "") req.body.image = undefined;

    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(404)
        .send("The category with the given ID was not found.");

    const { image: oldImage } = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );

    const product = await Product.findById({ _id: req.params.id });

    if (req.file) await deleteImage(oldImage);
    res.send(product);
  }
);

const deleteImage = (image) => deleteFile(dirPath + path.basename(image));

module.exports = router;
