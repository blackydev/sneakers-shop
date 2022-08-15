const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");

router.get("/", (req, res) => {

});

router.post("/", orderController.post);

module.exports = router;
