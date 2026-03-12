const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");

class AuthService {
  constructor(authRepository) {
    this.authRepo = authRepository;

    this.jwtSecret = process.env.JWT_SECRET;
    if (!this.jwtSecret) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    this.dummyHash = "$2b$10$XXXXXXXXXXXXXXXXXXXXXX";
  }

  async _verifyPasswordSecure(inputPassword, storedHash) {
    if (storedHash) {
      return await bcrypt.compare(inputPassword, storedHash);
    }
    await bcrypt.compare(inputPassword, this.dummyHash);
    return false;
  }

  _generateToken(user) {
    return jwt.sign({ sub: user.id, role: user.role }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: "vacation-app",
      audience: "vacation-app-users",
    });
  }

  async login(login, password) {
    const user = await this.authRepo.findByLogin(login);

    const isValid = await this._verifyPasswordSecure(
      password,
      user?.password_hash,
    );

    if (!isValid) {
      throw new AuthError();
    }

    return {
      token: this._generateToken(user),
    };
  }
}

module.exports = AuthService;
