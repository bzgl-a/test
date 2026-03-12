const express = require("express");
const { authenticateToken } = require("../middleware/auth");

function setupAbsenceRoutes(app, absenceService) {
  const router = express.Router();

  router.get(
    "/month/:year/:month",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { year, month } = req.params;
        const result = await absenceService.getAbsencesByMonth(year, month);
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  router.get("/day/:date", authenticateToken, async (req, res, next) => {
    try {
      const { date } = req.params;
      const result = await absenceService.getAbsencesByDay(date);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/calendar/:year", authenticateToken, async (req, res, next) => {
    try {
      const { year } = req.params;
      const result = await absenceService.getAbsenceCalendar(year);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.use("/api/absences", router);
}

module.exports = setupAbsenceRoutes;
