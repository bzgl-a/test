const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { ROLE } = require("../constants/constants");

function setupUserRoutes(app, userService) {
  const router = express.Router();

  router.get("/self", authenticateToken, async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const user = await userService.getCurrentUser(userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.get(
    "/",
    authenticateToken,
    requireRole(ROLE.MANAGER),
    async (req, res, next) => {
      try {
        const users = await userService.getAllUsers();
        res.json(users);
      } catch (err) {
        next(err);
      }
    },
  );

  app.use("/api/users", router);
}

module.exports = setupUserRoutes;
