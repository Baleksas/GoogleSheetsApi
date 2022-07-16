var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", async (req, res, next) => {
  let funcRes = await functionsChain(req.body);
  let stat = funcRes.status;
  console.log("stat", stat);
  console.log("response,,,", stat.response, " after response");

  if (stat[stat.length - 1] !== 200)
    res
      .status(stat.response.data.error.code)
      .send(stat.response.data.error.message);
  res.setHeader("Content-Type", "application/json");

  res.json(stat);
});

module.exports = router;
