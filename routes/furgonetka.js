const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { getPoints, getDeliverers } = require("../controllers/furgonetka");

router.get("/", async (req, res) => {
  const result = await getDeliverers();
  res.status(200).send(result);
});

router.get("/:service/points", async (req, res) => {
  /*
  request: /inpost/points/?search=miami
  */
  const { search } = req.query;
  const service = req.params.service;
  if (!search) return res.status(400).send("No search phrase query.");
  const data = await getPoints(service, search);
  res.status(200).send(data);
});

module.exports = router;
