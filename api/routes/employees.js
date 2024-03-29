var express = require("express");
var router = express.Router();
var { getEmployees } = require("../server/src/index");

router.get("/", async (req, res, next) => {
  let employeesRes = await getEmployees();
  res.json({ employeesRes });
});

module.exports = router;
