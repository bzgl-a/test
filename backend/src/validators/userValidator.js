const ValidationError = require("../errors/ValidationError");

const validateUserId = (id, fieldName = "user id") => {
  if (id === null || id === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }

  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0 || num > Number.MAX_SAFE_INTEGER) {
    throw new ValidationError(`Invalid ${fieldName}`, { provided: id });
  }
  return num;
};

module.exports = {
  validateUserId,
};
