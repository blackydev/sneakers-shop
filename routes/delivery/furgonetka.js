const express = require("express");
const router = express.Router();
const { getPoints } = require("../../controllers/furgonetka");

router.get("/:service/points", async (req, res) => {
  const { search } = req.query;
  const service = req.params.service;
  if (!search) return res.status(400).send("No search phrase query.");
  const data = await getPoints(service, search);
  res.status(200).send(data);
});

module.exports = router;
