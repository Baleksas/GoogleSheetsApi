const { formatDate } = require("./formatDate");

/**
 * Returns writing data
 * @param {object} args - Arguments object
 * @param {string} sheet_name - sheet name in which to write data
 *
 */
const getDataToWrite = (args, sheet_name) => {
  // String to date format
  let sdate = new Date(args.startingDate);
  // Week contain first day
  let week = [[formatDate(sdate.toLocaleDateString("en-US"))]];
  // Create 2d array of week days to pass into request to write
  for (var i = 1; i < 7; i++) {
    sdate.setDate(sdate.getDate() + 1);
    week.push([formatDate(sdate.toLocaleDateString("en-US"))]);
  }
  return [
    {
      range: `${sheet_name}!C10:C17`,
      values: week,
    },
    {
      range: `${sheet_name}!H3:H3`,
      values: [week[0]],
    },
    {
      range: `${sheet_name}!H4:H4`,
      values: [week[4]],
    },
    {
      range: `${sheet_name}!C6:D6`,
      values: [[args.employee, ""]],
    },
    {
      range: `${sheet_name}!H6:H6`,
      values: [[args.employeeNumber]],
    },
    {
      range: `${sheet_name}!H7:H7`,
      values: [[args.employeeEmail]],
    },
    {
      range: `${sheet_name}!C7:D7`,
      values: [[args.manager, ""]],
    },
  ];
};

module.exports = { getDataToWrite };
