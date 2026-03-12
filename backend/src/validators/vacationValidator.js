const ValidationError = require("../errors/ValidationError");
const { LEAVE_TYPE } = require("../constants/constants");

const validateDateFormat = (date, fieldName = "date") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError(`Invalid ${fieldName} format. Use YYYY-MM-DD`);
  }

  const parsed = new Date(date + "T00:00:00Z");
  if (isNaN(parsed.getTime())) {
    throw new ValidationError(`${fieldName} is not a valid date`);
  }

  const normalized = parsed.toISOString().split("T")[0];
  if (normalized !== date) {
    throw new ValidationError(`${fieldName} is not a valid date`);
  }

  return parsed;
};

const validateDateRange = (start_date, end_date) => {
  const start = validateDateFormat(start_date, "start_date");
  const end = validateDateFormat(end_date, "end_date");

  if (end < start) {
    throw new ValidationError("End date cannot be before start date");
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysCount =
    Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;

  if (daysCount <= 0 || daysCount > 366) {
    throw new ValidationError("Invalid date range (max 366 days)");
  }

  return { start_date, end_date, daysCount };
};

const validateLeaveType = type => {
  if (!type || !Object.values(LEAVE_TYPE).includes(type)) {
    throw new ValidationError("Invalid leave type", {
      provided: type,
      allowed: Object.values(LEAVE_TYPE),
    });
  }
  return type;
};

const validateRejectReason = reason => {
  if (!reason || typeof reason !== "string" || !reason.trim()) {
    throw new ValidationError("Rejection reason is required");
  }
  if (reason.trim().length > 500) {
    throw new ValidationError("Rejection reason too long (max 500 chars)");
  }
  return reason.trim();
};

const validateId = (id, fieldName = "id") => {
  if (id === null || id === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0 || num > Number.MAX_SAFE_INTEGER) {
    throw new ValidationError(`Invalid ${fieldName}`, { provided: id });
  }
  return num;
};

const validateVacationBalance = (requestedDays, availableDays) => {
  if (requestedDays > availableDays) {
    const err = new ValidationError("Not enough vacation days");
    err.statusCode = 409;
    err.details = { requested: requestedDays, available: availableDays };
    throw err;
  }
};

module.exports = {
  validateDateRange,
  validateLeaveType,
  validateRejectReason,
  validateId,
  validateVacationBalance,
};
