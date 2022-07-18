// format dates from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (input) => {
  var datePart = input.match(/\d+/g),
    month = datePart[0],
    day = datePart[1],
    year = datePart[2];
  return day + "/" + month + "/" + year;
};

module.exports = { formatDate };
