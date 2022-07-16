var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", (req, res, next) => {
  const status = functionsChain(req.body);
  res.send(status);
});

module.exports = router;
