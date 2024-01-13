exports.sqlDateFormat = function (date) {
  console.log("d", date);
  return date.toISOString().split("T")[0];
};

exports.sqlDateTimeFormat = function (date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

exports.getFirstAndLastDayOfMonth = function (year, month) {
  // Get the first day of the month
  const firstDay = new Date(year, month, 1);

  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);

  return { firstDay, lastDay };
};
