const express = require("express");
const router = express.Router();
const { getPaymentMethods } = require("../controllers/p24");

router.get("/methods/", async (req, res) => {
  const result = await getPaymentMethods("pl");
  res.status(200).send(result);
});

router.get("/methods/:lang", async (req, res) => {
  const result = await getPaymentMethods(req.params.lang);
  res.status(200).send(result);
});

module.exports = router;
