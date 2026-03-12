const BaseRepository = require("./BaseRepository");

class UserRepository extends BaseRepository {
  constructor(pool) {
    super(pool);
  }

  async findUserById(id, client = null) {
    return await this.query(
      "SELECT first_name,last_name, role, days_left FROM users WHERE id = $1",
      [id],
      client,
    ).then(rows => rows[0]);
  }

  async findAllUsers(client = null) {
    return await this.query(
      "SELECT first_name, last_name, role, days_left FROM users ORDER BY last_name, first_name",
      [],
      client,
    );
  }
}

module.exports = UserRepository;
