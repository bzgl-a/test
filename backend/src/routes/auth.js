const express = require("express");
const { validateLoginCredentials } = require("../validators/authValidator");

function setupAuthRoutes(app, authService) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const { login, password } = validateLoginCredentials(
        req.body.login,
        req.body.password,
      );

      const { token } = await authService.login(login, password);

      res.json({ token });
    } catch (err) {
      next(err);
    }
  });

  app.use("/api/auth", router);
}

module.exports = setupAuthRoutes;
