var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", async (req, res, next) => {
  let funcRes = await functionsChain(req.body);
  let stat = funcRes.status;
  res.setHeader("Content-Type", "application/json");

  //TODO: Implement error messages which let user know what went wrong. (Create/copy/write)
  let filteredStatus = stat.filter((status) => status !== 200);
  if (filteredStatus.length > 1) {
    res.send(filteredStatus);
  } else {
    res.json(stat);
  }
});

module.exports = router;
