const express = require("express");
const router = express.Router();
const { getDeliverers } = require("../controllers/delivery/main")

router.get("/", async (req, res) => {
    const data = await getDeliverers();
    res.status(200).send(data);
});

module.exports = router;
