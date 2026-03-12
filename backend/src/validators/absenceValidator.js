const ValidationError = require("../errors/ValidationError");

const validateYearMonth = (year, month) => {
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (isNaN(yearNum) || isNaN(monthNum)) {
    throw new ValidationError("Year and month must be numbers");
  }
  if (yearNum < 1900 || yearNum > 2100) {
    throw new ValidationError("Year must be between 1900 and 2100");
  }
  if (monthNum < 1 || monthNum > 12) {
    throw new ValidationError("Month must be between 1 and 12");
  }
  return { yearNum, monthNum };
};

const validateDate = date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
  }

  const parsed = new Date(date + "T00:00:00Z");
  if (isNaN(parsed.getTime())) {
    throw new ValidationError("Invalid date value");
  }

  const normalized = parsed.toISOString().split("T")[0];
  if (normalized !== date) {
    throw new ValidationError("Invalid date value");
  }

  return date;
};

const validateYear = year => {
  if (!/^\d{4}$/.test(year)) {
    throw new ValidationError("Invalid year format. Use YYYY");
  }
  const yearNum = parseInt(year, 10);
  if (yearNum < 1900 || yearNum > 2100) {
    throw new ValidationError("Year must be between 1900 and 2100");
  }
  return year;
};

module.exports = {
  validateYearMonth,
  validateDate,
  validateYear,
};
