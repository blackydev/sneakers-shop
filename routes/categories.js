const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");
const { auth, isAdmin } = require("../middleware/authorization");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const categories = await Category.find().sort("name");
  res.send(categories);
});

router.post("/", [auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = new Category({ name: req.body.name });
  category = await category.save();

  res.send(category);
});

router.put("/:id", [validateObjectId, auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

module.exports = router;
