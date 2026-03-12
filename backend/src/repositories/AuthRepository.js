const BaseRepository = require("./BaseRepository");

class AuthRepository extends BaseRepository {
  constructor(pool) {
    super(pool);
  }

  async findByLogin(login, client = null) {
    const rows = await this.query(
      "SELECT id, login, password_hash, role, days_left FROM users WHERE login = $1",
      [login],
      client,
    );
    return rows[0];
  }
}

module.exports = AuthRepository;
