const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { ROLE } = require("../constants/constants");
const {
  validateDateRange,
  validateLeaveType,
  validateId,
} = require("../validators/vacationValidator");

function setupVacationRoutes(app, vacationService) {
  const router = express.Router();

  router.post("/", authenticateToken, async (req, res, next) => {
    try {
      const { start_date, end_date, type, comment = "" } = req.body;
      const userId = req.user.sub;

      validateLeaveType(type);
      validateDateRange(start_date, end_date);

      const result = await vacationService.createRequest(userId, {
        start_date,
        end_date,
        type,
        comment,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post(
    "/:id/approve",
    authenticateToken,
    requireRole(ROLE.MANAGER),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const managerId = req.user.sub;
        const requestId = validateId(id, "request id");

        const result = await vacationService.approveRequest(
          requestId,
          managerId,
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    "/:id/reject",
    authenticateToken,
    requireRole(ROLE.MANAGER),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { rejectReason } = req.body;
        const managerId = req.user.sub;
        const requestId = validateId(id, "request id");

        const result = await vacationService.rejectRequest(
          requestId,
          managerId,
          rejectReason,
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  router.get("/requests", authenticateToken, async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const year = req.query.year
        ? parseInt(req.query?.year)
        : new Date().getFullYear();
      const result = await vacationService.getRequestsForUser(userId, year);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get(
    "/manager-requests",
    authenticateToken,
    requireRole(ROLE.MANAGER),
    async (req, res, next) => {
      try {
        const year = req.query.year
          ? parseInt(req.query?.year)
          : new Date().getFullYear();
        const result = await vacationService.getRequestsForManager(year);
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  app.use("/api/vacations", router);
}

module.exports = setupVacationRoutes;
