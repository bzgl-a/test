require("dotenv").config();
const { createApp } = require("./src/app");
const { STATUS, ROLE, LEAVE_TYPE } = require("./src/constants/constants");

const PORT = parseInt(process.env.PORT) || 3000;

const { app, pool } = createApp({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  constants: { STATUS, ROLE, LEAVE_TYPE },
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend ready at http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
