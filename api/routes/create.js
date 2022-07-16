var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", (req, res, next) => {
  let stat = functionsChain(req.body);
  res.send(stat);
});

module.exports = router;
