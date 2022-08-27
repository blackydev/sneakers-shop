const express = require("express");
const router = express.Router();
const { getDeliverers } = require("../controllers/delivery/main")

router.get("/", async (req, res) => {
    const result = await getDeliverers();
    res.status(200).send(result);
});

module.exports = router;
