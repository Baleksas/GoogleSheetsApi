var express = require("express");
var router = express.Router();
var { functionsChain, createForAll } = require("../server/src/index");
router.post("/", async (req, res, next) => {
  let createAllRes = await createForAll(req.body);

  res.setHeader("Content-Type", "application/json");
  res.json(createAllRes);
});

module.exports = router;
