const express = require("express");
const router = express.Router();
const { getDeliverers, getPoints } = require("../controllers/furgonetka/main");

router.get("/services", async (req, res) => {
  const data = await getDeliverers();
  res.status(200).send(data);
});

router.get("/points/:service", async (req, res) => {
  const { search } = req.query;
  const service = [].push(req.params.service);
  if (!search) return res.status(400).send("No search phrase.");
  const data = await getPoints(search, service);
  res.status(200).send(data);
});

module.exports = router;
