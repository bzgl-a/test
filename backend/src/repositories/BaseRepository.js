class BaseRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params, client = null) {
    const db = client || this.pool;
    const result = await db.query(sql, params);
    return result.rows;
  }

  async withTransaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = BaseRepository;
