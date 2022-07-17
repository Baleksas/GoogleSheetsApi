// format dates from YYYY-MM-DD to DD-MM-YYYY
const getWeekData = (input) => {
  let week = [];
  var datePart = input.match(/\d+/g),
    year = datePart[0],
    month = datePart[1],
    day = datePart[2];

  for (var i = 0; i < 7; i++) {
    week.push([day++ + "/" + month + "/" + year]);
  }
  return week;
};

module.exports = { getWeekData };
