var express = require("express");
var router = express.Router();
var { functionsChain } = require("../server/src/index");
router.post("/", async (req, res, next) => {
  let funcRes = await functionsChain(req.body);
  let stat = funcRes.status;
  let spreadsheetUrl = funcRes.spreadsheetUrl;

  res.setHeader("Content-Type", "application/json");
  res.json({ spreadsheetUrl, stat });
});

module.exports = router;
