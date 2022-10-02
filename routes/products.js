const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");
const { upload } = require("../middleware/productUpload");
const { Product, validate } = require("../models/product");
const { validateProductId } = require("../middleware/validateObjectsId");
const { deleteFile } = require("../utils/deleteFile");
const { Category } = require("../models/category");

const hiddenQuery = { hidden: { $in: [false, null] } };

router.get("/", async (req, res) => {
  try {
    const { showHidden, select, sortBy, pageLength, pageNumber, category } =
      req.query;
    if (showHidden !== "true") var query = hiddenQuery;
    if (category) query = { ...query, category };
    if (sortBy) var sort = sortBy;
    else sort = "-release";

    const products = await Product.find(query)
      .populate("category", "name")
      .select(select) // ["_id", "name", "image", "price"]
      .sort(sort)
      .limit(pageLength)
      .skip(pageLength * pageNumber);

    res.send(products);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  let { showHidden, select } = req.query;
  showHidden = showHidden === "true" ? true : false;

  const product = await Product.findById(req.params.id, select).populate(
    "category",
    "name"
  );

  if (!product || (!showHidden && product.hidden))
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.post("/", [auth, isAdmin, upload.single("image")], async (req, res) => {
  if (req.file) req.body.image = req.file.filename;

  const { error } = validate(req.body);
  if (error) {
    deleteImage(req);
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  const product = new Product(getProperties(req.body));
  await product.save();

  res.send(product);
});

router.put(
  "/:id",
  [auth, isAdmin, validateObjectId, validateProductId, upload.single("image")],
  async (req, res) => {
    if (req.file) req.body.image = req.file.filename;
    else req.body.image = "";

    const { error } = validate(req.body);
    if (error) {
      deleteImage(req);
      return res.status(400).send(error.details[0].message);
    }

    if (req.body.image === "") req.body.image = undefined;

    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(404)
        .send("The category with the given ID was not found.");

    const oldProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );

    const product = await Product.findById({ _id: req.params.id });

    res.send(product);
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
    "category",
  ]);
};

module.exports = router;
