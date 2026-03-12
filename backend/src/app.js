const express = require("express");

const { corsMiddleware } = require("./middleware/cors");
const { createPool } = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");

const AbsenceRepository = require("./repositories/AbsenceRepository");
const UserRepository = require("./repositories/UserRepository");
const AuthRepository = require("./repositories/AuthRepository");
const VacationRepository = require("./repositories/VacationRepository");

const AbsenceService = require("./services/AbsenceService");
const AuthService = require("./services/AuthService");
const UserService = require("./services/UserService");
const VacationService = require("./services/VacationService");

const setupAuthRoutes = require("./routes/auth");
const setupUserRoutes = require("./routes/users");
const setupVacationRoutes = require("./routes/vacation");
const setupAbsenceRoutes = require("./routes/absences");

function createApp(config) {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);
  app.set("etag", false);

  const pool = createPool(config.database);

  pool.on("error", err => {
    console.error("PostgreSQL pool error:", err.message);
  });

  const authRepo = new AuthRepository(pool);
  const authService = new AuthService(authRepo);
  setupAuthRoutes(app, authService);

  const userRepo = new UserRepository(pool);
  const userService = new UserService(userRepo);
  setupUserRoutes(app, userService);

  const vacationRepo = new VacationRepository(pool);
  const vacationService = new VacationService(vacationRepo, userRepo);
  setupVacationRoutes(app, vacationService);

  const absenceRepo = new AbsenceRepository(pool);
  const absenceService = new AbsenceService(absenceRepo);
  setupAbsenceRoutes(app, absenceService);

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return { app, pool };
}

module.exports = { createApp };
