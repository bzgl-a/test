function errorHandler(err, req, res, next) {
  if (!err.isOperational) {
    console.error("NonOperational error:", err);
  } else {
    console.error("Operational error:", err.name, err.message);
  }

  const response = {
    error: err.isOperational
      ? err.message || "Something went wrong"
      : "Internal Server Error",
  };

  if (err.isOperational && err.details) {
    response.details = err.details;
  }

  return res.status(err.statusCode || 500).json(response);
}

module.exports = { errorHandler };
