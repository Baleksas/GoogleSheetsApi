var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Api is working");
});

module.exports = router;
