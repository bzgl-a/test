const AppError = require("./AppError");

class AuthError extends AppError {
  constructor(message = "Invalid credentials", details = null) {
    super(message, 401, true, details);
  }
}

module.exports = AuthError;
