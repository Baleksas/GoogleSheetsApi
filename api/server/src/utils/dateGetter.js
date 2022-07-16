// Function to get nearest weeks Momday and it's whole week days.
const getWeekDay = (day) => {
  var d = new Date();
  d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
  // day - 1 because passing days while days in dates are from 0
  d.setDate(d.getDate() + day - 1);
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
};

module.exports = { getWeekDay };
