var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", (req, res, next) => {
  res.send(functionsChain(req.body));
});

module.exports = router;
