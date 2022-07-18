// format dates from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (input) => {
  console.log("input: ", input);
  var datePart = input.match(/\d+/g),
    month = datePart[0],
    day = datePart[1],
    year = datePart[2];
  console.log(day, month, year);
  return day + "/" + month + "/" + year;
};

module.exports = { formatDate };
