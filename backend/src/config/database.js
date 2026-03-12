const { Pool } = require("pg");

function createPool(config) {
  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
  });

  return pool;
}

module.exports = { createPool };
