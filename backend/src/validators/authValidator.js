const ValidationError = require("../errors/ValidationError");

const validateLogin = login => {
  if (!login) {
    throw new ValidationError();
  }

  return login;
};

const validatePassword = password => {
  if (!password) {
    throw new ValidationError();
  }

  return password;
};

const validateLoginCredentials = (login, password) => ({
  login: validateLogin(login),
  password: validatePassword(password),
});

module.exports = {
  validateLoginCredentials,
  validateLogin,
  validatePassword,
};
